<template>
  <el-dialog
    v-dialogDrag
    :title="'采购单详情'" :width="isAddActive === false ? '900px' : '85%'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <!--<el-col><div style="border-top: 1px dashed #ccc;padding-top: 10px;font-weight: 900">别名（选填）</div></el-col>-->
    <el-container>
      <el-aside :width="isAddActive === false ? '100%' : '60%'">
        <div class="ownScrollbar" style="min-height: 500px;max-height: 500px;overflow-y: scroll;">

          <!--头部状态-->
          <el-row>
            <el-col style="padding: 0 50px">
              <el-steps :active="stepActive" process-status="success" finish-status="success" align-center>
                <el-step title="待收货(已创建采购单)" description="药房还未录入实际到货量、采购价、门店售价"></el-step>
                <el-step title="未入库" description="药房还未录入商品批次号"></el-step>
                <el-step title="已入库" description="整个采购计划已完毕"></el-step>
              </el-steps>
            </el-col>
          </el-row>
          <!--头部采购单其他信息-->
          <el-row>
            <el-col :span="8"><p>采购人：<span v-if="dataList !== null">{{dataList.CreatedByName}}</span></p></el-col>
            <el-col :span="8"><p>供应商：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
            <el-col :span="8">
              <p style="width: 190px;">门店：
                <span v-if="dataList !== null" style="display: inline-block; vertical-align: bottom; width: 134px; overflow: hidden; text-overflow:ellipsis;white-space:nowrap;">{{dataList.StoreName}}</span>
              </p>
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
          <el-row>
            <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">药品：<b v-text="categoryName"></b></div></el-col>
          </el-row>

          <!--主体：列表展示-->
          <el-table  v-if="dataList !== null" :key="Math.random()"
                     :data="dataList.Items"
                     stripe
                     v-loading="dataListLoading"
                     row-class-name="purchaseListRow"
                     :header-cell-style="$cxObj.tableHeaderStyle40px"
                     style="width: 100%;">
            <!--<el-table-column prop="Id" align="center" label="ID" width="50"></el-table-column>-->
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column prop="ProductId" align="center" label="商品" width="50"></el-table-column>
            <el-table-column prop="ProductName" header-align="center" align="center" label="药品名称"></el-table-column>
            <el-table-column prop="CategoryName" header-align="center" align="center" label="药态"></el-table-column>

            <!--采购数量-->
            <el-table-column v-if="editType === 'A'" :key="Math.random()" label="采购数量" header-align="center" :align="$store.state.common.align" width="120">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.Quantity" :step="1" :min="1" :max="1000" size="mini" controls-position="right" style="width: 105px"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-else prop="Quantity" :key="Math.random()" label="采购数量" header-align="center" align="center"></el-table-column>

            <el-table-column prop="LastCostPirce" header-align="center" align="center" label="上次采购价"></el-table-column>

            <!--就是添加药材的进价!!!-->
            <el-table-column v-if="editType === 'A'" :key="Math.random()" label="此次采购价" header-align="center" :align="$store.state.common.align" width="110">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.CostPrice" :precision="2" :step="0.01" :min="0.01" :max="1000" size="mini" controls-position="right" style="width: 100px"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-else prop="CostPrice" header-align="center" label="此次采购价" align="center"></el-table-column>

            <!--门店售价填写-->
            <el-table-column v-if="editType === 'A'" :key="Math.random()" label="售价填写" prop="" header-align="center" :align="$store.state.common.align" width="110">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.StoreSalePrice" :precision="2" :step="0.01" :min="0.01" :max="1000" size="mini" controls-position="right" style="width: 100px"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-if="editType !== 'A'" prop="StoreSalePrice" label="售价" header-align="center" align="center"></el-table-column>
            <!--<el-table-column v-if="dataList.Status !== -1 && editType !== 'A'" prop="StoreSalePrice" label="售价" header-align="center" align="center"></el-table-column>-->



            <!--翻页：批号录入-->
            <!--<el-table-column prop="Amount" header-align="center" align="center" label="总价"></el-table-column>-->
            <el-table-column v-if="editType === 'B'" :key="Math.random()" prop="" header-align="center" :align="$store.state.common.align" label="批号填写" width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.ProductBatchNo" placeholder="批号录入" size="mini"></el-input>
                <!--<el-input-number v-model="scope.row.ProductBatchNo" :step="1" :min="0" :max="10000" size="mini" controls-position="right"></el-input-number>-->
              </template>
            </el-table-column>
            <el-table-column v-if="dataList.Status === 10" prop="ProductBatchNo" header-align="center" align="center" label="批号"></el-table-column>

            <el-table-column v-if="editType === 'A'" prop="" label="操作" width="50" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="leftRemove(scope.row.ProductId)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <p style="font-size: 16px;height: 40px;line-height: 40px">采购单总金额：￥
            <span style="color: #e4393c">{{OrderTotalPrice.toFixed(2)}}</span>
          </p>
        </div>
      </el-aside>

      <!--右侧：追加药材-->
      <el-main v-if="isAddActive" style="padding: 0 0 0 5px !important; border-left: 1px solid #E6E6E6">
        <!--<el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="0" :inline="true">-->
        <el-form class="purchaseListInfo" :model="dataForm" ref="dataForm" label-width="0" :inline="true">
          <el-form-item label="" prop="SpellName">
            <el-input v-model="dataForm.SpellName" placeholder="拼音搜索" size="mini" clearable>
              <el-button slot="append" icon="el-icon-search" @click="drugsSearch()"></el-button>
            </el-input>
          </el-form-item>
          <!--@selection-change="selectionChangeHandle"-->
          <!--<el-table-column type="selection" header-align="center" :align="$store.state.common.align" width="50"></el-table-column>-->
          <el-table
            :data="dataListAdd" ref="tableChild" :key="Math.random()"
            stripe
            :height="450"
            v-loading="dataListLoading"
            :header-cell-style="$cxObj.tableHeaderStyle40px"
            row-class-name="purchaseTableRowClass"
            style="width: 100%;">
            <el-table-column :align="$store.state.common.align" type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="Code" header-align="center" :align="$store.state.common.align" width="90" label="商品编码" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="CategoryName" header-align="center" :align="$store.state.common.align" width="" label="药态" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ShowName" header-align="center" :align="$store.state.common.align" label="药名" width="70" :show-overflow-tooltip="true"></el-table-column>
            <!--<el-table-column prop="Specification" header-align="center" :align="$store.state.common.align" label="规格" :show-overflow-tooltip="true"></el-table-column>-->
            <!--<el-table-column prop="Unit" header-align="center" :align="$store.state.common.align" label="单位"></el-table-column>-->
            <!--<el-table-column prop="RedLine" header-align="center" :align="$store.state.common.align" label="预警量" :show-overflow-tooltip="true"></el-table-column>-->
            <el-table-column prop="Quantity" header-align="center" :align="$store.state.common.align" label="库存" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="" label="操作" width="50" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="rightAdd(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-main>
    </el-container>

    <!--底部：footer按钮-->
    <span v-if="editType !== ''" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="editType === 'A'" type="primary" @click="dataFormAdd()">新增药材</el-button>
      <el-button v-if="editType === 'A'" type="primary" @click="dataFormSubmitA()">保存</el-button>
      <el-button v-else-if="editType === 'B'" type="primary" @click="dataFormSubmitB()">确定入库</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
// import {treeDataTranslate} from '@/utils'
export default {
  components: {
  },
  data () {
    return {
      stepActive: -1,
      visible: false,
      dataListLoading: false, // 加载
      Id: '',
      dataForm: {
        SpellName: ''
      },
      dataList: null,
      editType: '', // 这个状态A表示待收货的编辑、B表示未入库的编辑、其他的表示查看
      categoryName: '',
      categoryId: '',

      isAddActive: false,
      dataListAdd: [],
      OrderTotalPrice: 0 // 采购单总价显示
    }
  },
  methods: {
    comFunction () {
      // 这请求起点 药材的接口要改成，请求对应门店库存的接口（这个后来崩了） 后来 又改回老接口了
      API.drugs.getDrugsList({
        Name: '',
        PageIndex: 1,
        PageSize: 10000,
        IsPaging: 'false',
        SpellName: this.dataForm.SpellName,
        CategoryId: this.categoryId,
        StoreId: this.dataList.StoreId,
        CodeOrBarCode: ''
      }).then(result => {
        if (result.code === '0000') {
          this.dataListAdd = result.data
          this.dataList.Items.forEach(item0 => {
            this.dataListAdd = this.dataListAdd.filter(item => {
              return item0.ProductCode !== item.Code
            })
          })
        } else {
          this.$message({ message: '查询结果为空', type: 'warning', duration: 3000 })
        }
      })
    },
    // 先初始化 右边 待添加的药材列表
    dataFormAdd () {
      this.isAddActive = !this.isAddActive // 点击'[添加药材]'按钮
      if (this.isAddActive === false) {
        return false
      }
      this.comFunction()
    },
    leftRemove (ProductId) {
      this.dataList.Items = this.dataList.Items.filter(item => {
        return item.ProductId !== ProductId
      })
      if (this.isAddActive === true) {
        this.comFunction()
      }
    },
    rightAdd (row) {
      // 这为什么要发个请求呢，看起来没必要，但其实左右el-table的详情展示不同（来源的接口也不同），右边无法直接传递自己的值给左边
      API.drugs.getDrugsList({name: '', PageIndex: 1, PageSize: 10000, IsPaging: 'false', SpellName: this.dataForm.SpellName, CategoryId: this.categoryId}).then(result => {
        if (result.code === '0000') {
          result.data.forEach(item => {
            if (item.Code === row.Code) {
              // this.dataList.Items.push(item) // 左边右边的table中row的详情不一样，脑壳大……
              this.dataList.Items.push({
                Id: '', // 这个明细id啥时候才起作用 CategoryName
                ProductId: item.Id, // need 这儿为什么需要商品id而不需要明细id
                SapProductCode: item.Code, // need
                ProductCode: item.Code, // need
                ProductName: item.ShowName, // need
                Specification: null,
                Unit: 'g',
                CostPrice: item.SalePrice, // need
                SalePrice: 0,
                Preferential: 0,
                CategoryId: '',
                CategoryName: item.CategoryName, // need
                Quantity: item.Quantity, // need
                Amount: 0.33,
                ActualShipAmount: 0,
                ActualAmount: 0,
                ActualShipQuantity: 0,
                ActualQuantity: 0,
                BgColor: 'bg-danger',
                SupplierId: 0, // ???取不到哦
                SupplierCode: null, // ???取不到哦
                SupplierName: null,
                InventoryQuantity: 0,
                BatchNo: 0,
                ProductBatchNo: null,
                CargoFee: 0,
                Pictures: [
                  '/Content/AdminLTE/img/default-50x50.gif',
                  '/Content/AdminLTE/img/default-50x50.gif',
                  '/Content/AdminLTE/img/default-50x50.gif'
                ],
                StoreId: '', // ???取不到哦,这个貌似确定取不到
                SapStoreCode: null,
                ShippedQuantityByInventory: 0,
                ShippedQuantityByFactory: 0,
                ActualOrderQuantity: 0
              })
              console.log(this.dataList.Items)
              return false
            }
          })
          this.$nextTick(() => {
            console.log('这儿没执行？')
            if (this.isAddActive === true) {
              this.comFunction()
            }
          })
        }
      })
    },
    // 获取某个采购单详情info
    init (id, type) {
      this.visible = true
      this.dataListLoading = true
      this.editType = type !== undefined ? type : '' // A B 不同编辑类型页面会展示不同的input和‘按钮’
      if (id !== undefined) {
        API.purchase.getPurchaseInfo({id: id}).then(result => {
          if (result.code === '0000') {
            this.dataList = result.data
            // 2019.06.01 展示采购单总价
            this.dataList.Items.forEach(item => {
              this.OrderTotalPrice += item.Quantity * item.CostPrice
            })

            this.categoryId = this.dataList.Items[0].CategoryId
            this.categoryName = this.dataList.Items[0].CategoryName // 返回的采购单详情里每个药材对象中都包含药态，所以这儿取下巧
            switch (result.data.Status) {
              case -1:
                this.stepActive = -1
                break
              case 1:
                this.stepActive = 0
                break
              case 4:
                this.stepActive = 1
                break
              case 10:
                this.stepActive = 2
                break
            }
            this.dataListLoading = false
          }
        })
      }
    },
    handleClose () {
      this.editType = ''
      this.isAddActive = false
      this.OrderTotalPrice = 0
    },
    dataFormSubmitA () { // 编辑的提交 采购数量和价格
      var params = {
        Address: this.dataList.Address,
        Buyer: this.dataList.Buyer,
        Phone: this.dataList.Phone,
        OrderType: this.dataList.OrderType,
        Remark: this.dataList.Remark,
        StoreId: this.dataList.StoreId,
        StoreCode: this.dataList.StoreCode,
        Id: this.dataList.Id,
        SupplierId: this.dataList.SupplierId,
        SupplierCode: this.dataList.SupplierCode,
        Items: JSON.stringify(this.dataList.Items.map(item => {
          return {
            ProductId: item.ProductId,

            LastCostPirce: item.LastCostPrice, // 这还提交上一次采购价其实没啥用了，不过后一个tab里填写入库编码的时候还可以瞄一下，有点点小用吧

            CostPrice: item.CostPrice, // 进价售价：
            StoreSalePrice: item.StoreSalePrice, // 门店售价：这三个值，直接来源于添加药材那，用来作为初始值在创建采购单的时候直接传递给后端

            Quantity: item.Quantity, // 采购量手填

            SapProductCode: item.SapProductCode,
            SupplierId: this.dataList.SupplierId,
            SupplierCode: this.dataList.SupplierCode // 这儿接口9返回的item.SupplierId用为零，导致不得不去获取总表的那个返回值
          }
          // [{\"ProductId\":23,\"CostPrice\":0,\"Quantity\":3,\"SapProductCode\":\"10000109\",\"SupplierId\":1,\"SupplierCode\":\"6006\"}
        }))
      }
      console.log(params)
      API.purchase.editNumberAndPrice(params).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `编辑${result.message}`,
            duration: 1000
          })
          this.$emit('refreshDataList')
          this.visible = false
        } else {
          this.$message({
            type: 'error',
            message: `${result.message}`,
            duration: 1000
          })
        }
      })
    },
    dataFormSubmitB () { // 入库的提交 批次号
      if (this.dataList.Items.some(item => item.ProductBatchNo === 0 || item.ProductBatchNo === '' || item.ProductBatchNo === null)) {
        this.$alert('请把批次号填完!', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      var params = {
        Code: this.dataList.Code,
        Id: this.dataList.Id,
        Remark: this.dataList.Remark,
        Items: JSON.stringify(this.dataList.Items.map(item => {
          return {
            Id: item.Id, // 这是详情id，上面那个A的是药材ID
            ActualQuantity: item.Quantity,
            productBatchNo: item.ProductBatchNo
          }
          // "[{\"Id\":96,\"ActualQuantity\":1,\"productBatchNo\":123123}, ]       }))
        }))
      }
      console.log(params)
      API.purchase.editBatchNo(params).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `编辑${result.message}`,
            duration: 1000
          })
          this.$emit('refreshDataList')
          this.visible = false
        } else {
          this.$message({
            type: 'error',
            message: `${result.message}`,
            duration: 1000
          })
        }
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
