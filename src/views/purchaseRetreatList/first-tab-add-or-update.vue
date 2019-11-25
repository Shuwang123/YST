<template>
    <el-dialog
        v-dialogDrag
        :title="'退单详情'" width="1005px"
        :close-on-click-modal="false"
        :visible.sync="visible" @close="handleClose">
        <el-container v-loading="dataListLoading"><!-- display: none -->
            <el-aside :width="'100%'">
                <div class="ownScrollbar" ref="ownOnscroll" style="min-height: 500px;max-height: 500px;overflow-y: scroll;">
                    <el-row>
                        <el-col :span="8"><p>退单人：<span v-if="dataList !== null">{{dataList.CreatedByName}}</span></p></el-col>
                        <el-col :span="8"><p>供应商：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
                        <el-col :span="8">
                            <p style="width: 190px;">门店：<span v-if="dataList !== null" style="display: inline-block; vertical-align: bottom; width: 134px; overflow: hidden; text-overflow:ellipsis;white-space:nowrap;">{{dataList.StoreName}}</span></p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8"><p>联系人：<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
                        <el-col :span="8"><p>电话：<span v-if="dataList !== null">{{dataList.Phone}}</span></p></el-col>
                        <el-col :span="8"><p>地址：<span v-if="dataList !== null">{{dataList.Address}}</span></p></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8"><p>创建时间：<span v-if="dataList !== null">{{dataList.CreatedTime | myDateFilter('yyyy-MM-dd hh:mm:ss')}}</span></p></el-col>
                        <el-col :span="15"><p>备注：<span v-if="dataList !== null">{{dataList.Remark}}</span></p></el-col>
                    </el-row>
                    <el-row><el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">药品：<b v-text="categoryName"></b></div></el-col></el-row>

                    <el-table  v-if="dataList !== null" :key="Math.random()"
                        :data="dataList.Items"
                        stripe
                        row-class-name="purchaseListRow"
                        :header-cell-style="$cxObj.tableHeaderStyle40px"
                        style="width: 100%;">
                        <el-table-column type="index" align="center" label="序号" fixed width="50"></el-table-column>
                        <el-table-column prop="ProductCode" align="center" label="商品编码" fixed min-width="85" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="CategoryName" header-align="center" align="center" label="药态" fixed min-width="70" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="ProductName" header-align="center" align="center" label="药品名称" fixed min-width="80" :show-overflow-tooltip="true"></el-table-column>

                        <el-table-column prop="Quantity" :key="Math.random()" label="退货量" header-align="center" align="center"></el-table-column>
                        <!--<el-table-column prop="LastCostPirce" header-align="center" align="center" label="前采购价"></el-table-column>-->
                        <el-table-column prop="CostPrice" header-align="center" label="进价" align="center"></el-table-column>
                        <!--<el-table-column prop="StoreSalePrice" label="售价" header-align="center" align="center"></el-table-column>-->

                        <!--<el-table-column label="生产日期" header-align="center" align="center">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span v-if="scope.row.ProdctionDate === null">未填写</span>-->
                                <!--<span v-else>{{scope.row.ProdctionDate | myDateFilter('yyyy-MM-dd')}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="有效期" header-align="center" align="center">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span v-if="scope.row.ExpiryDate === null">未填写</span>-->
                                <!--<span v-else>{{scope.row.ExpiryDate | myDateFilter('yyyy-MM-dd')}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="操作" header-align="center" align="center">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-button type="text" @click="leftRemove(scope.row.ProductId)">移除</el-button>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    </el-table>
                    <p style="font-size: 16px;height: 40px;line-height: 40px">退单总金额：￥<span style="color: #e4393c" v-text="OrderTotalPrice.toFixed(2)"></span></p>
                </div>
            </el-aside>

            <!--右侧：追加药材-->
            <el-main v-if="false" style="padding: 0 0 0 5px !important; border-left: 1px solid #E6E6E6"></el-main>
        </el-container>

        <!--底部：footer按钮-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button v-if="fatherData === 6" type="primary" @click="handelSubmit7()" :disabled="rukuIsDisabled">审核通过</el-button>
          <el-button v-if="fatherData === 7" type="primary" @click="handelSubmit8()" :disabled="rukuIsDisabled">确认出库</el-button>
        </span>
    </el-dialog>
</template>
<script type="text/ecmascript-6">
  import API from '@/api'
  export default {
    props: ['fatherData'],
    data () {
      return {
        stepActive: -1,
        visible: false,
        dataListLoading: false, // 加载
        formId: '', // 保存的单据Id
        dataForm: {
          SpellName: ''
        },
        dataList: null,

        categoryName: '',
        categoryId: '',

        dataListAdd: [],
        OrderTotalPrice: 0, // 入库单总价显示

        rukuIsDisabled: false, // 入库时防止双击带来一些bug
        lastPosition: 0
      }
    },
    methods: {
      // leftRemove (ProductId) {
      //   this.dataList.Items = this.dataList.Items.filter(item => {
      //     return item.ProductId !== ProductId
      //   })
      // },

      // 获取退单详情
      init (Id) { // 单据的id
        this.visible = true
        this.dataListLoading = true
        this.formId = Id // 把单据Id保存下来，以后出库或者审核确认都需要这个值
        if (Id !== undefined) {
          API.purchase.getPurchaseInfo({id: Id}).then(result => {
            if (result.code === '0000') {
              this.dataList = result.data
              console.log(result.data.Items)

              // 退单总价标记
              this.dataList.Items.forEach(item => {
                this.OrderTotalPrice += item.Quantity * item.CostPrice
              })

              this.categoryId = this.dataList.Items[0].CategoryId
              this.categoryName = this.dataList.Items[0].CategoryName // 返回的入库单详情里每个药材对象中都包含药态，所以这儿取下巧

              this.dataListLoading = false
            }
          })
        }
        console.log(this.fatherData) // 点击的哪个tab，这个字段用于确定
      },

      handleClose () {
        this.formId = ''
        this.OrderTotalPrice = 0
        this.rukuIsDisabled = false
      },
      // 退单审核通过
      handelSubmit7 () {
        this.$confirm(`确定通过审核? `, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            id: this.formId,
            remark: '备注暂无'}
          console.log(params)
          API.purchase.retreatAuditedOK(params).then(result => {
            if (result.code === '0000') {
              this.$message({
                type: 'success',
                message: '审核通过!',
                duration: 1000
              })
              this.$emit('refreshDataList')
              this.visible = false
            } else {
              this.$message.error(result.message)
            }
          })
        })
      },
      // 退单审核通过后，继续执行此方法就出库了
      handelSubmit8 () {
        this.$confirm(`确定退单出库? `, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.rukuIsDisabled = true // 做了confirm后其实这个禁用按钮的判断可以不写了，不会出现重复提交的问题了
          var params = {
            id: this.formId,
            Items: JSON.stringify(this.dataList.Items.map(item => {
              return {
                Id: item.Id,
                ProductBatchNo: item.ProductCode,
                ActualQuantity: item.Quantity, // 这是详情id，上面那个A的是药材ID
                ProductionDate: '', // new D ate()
                ShelfLife: 1, //
                ExpiryDate: ''}
            }))
          }
          console.log(params)
          API.purchase.retreatSuccess(params).then(result => {
            if (result.code === '0000') {
              this.$message({
                type: 'success',
                message: `出库成功`,
                duration: 1000
              })
              this.$emit('refreshDataList')
              this.visible = false
            } else {
              this.rukuIsDisabled = false // 请求失败，按钮状态变为可再次点击
              this.$message({
                type: 'error',
                message: `${result.message}`,
                duration: 1000
              })
            }
          })

        })
      }

    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .ownScrollbar::-webkit-scrollbar,
    .purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
        width: 7px;
    }
    .ownScrollbar::-webkit-scrollbar-thumb,
    .purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
        border-radius: 3px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
        background-color: #DDDEE0;
    }
    .ownScrollbar::-webkit-scrollbar-track,
    .purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
        border-radius: 0;
        box-shadow: inset 0 0 5px rgba(0,0,0,0);
        background-color: rgba(0,0,0,0);
    }
</style>
