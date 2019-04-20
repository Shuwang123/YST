<template>
  <el-dialog
    v-dialogDrag
    :title="'挂号信息填写、所有历史患者列表、新建患者'" :width="'50%'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <div v-if="show">
      <div class="ownScrollbar" style="min-height: 400px;max-height: 400px;overflow-y: scroll;">
        <el-row>
          <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">患者信息：<b v-text="categoryName"></b></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><p>病历号：<span v-if="dataList !== null">{{dataList.CreatedByName}}</span></p></el-col>
          <el-col :span="8"><p>会员卡号：<span v-if="dataList !== null">{{dataList.CreatedByName}}</span></p></el-col>
          <br>
          <el-col :span="8">
            <p>患者姓名：
              <span>
                <el-button  type="danger" @click="show = !show; addOrUpdateHandle1()" size="mini">导入患者</el-button>
              </span>
            </p>
          </el-col>
          <el-col :span="8"><p>性别：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
          <el-col :span="8"><p>年龄：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><p>电话：<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
          <el-col :span="8"><p>地址：<span v-if="dataList !== null">{{dataList.Phone}}</span></p></el-col>
          <el-col :span="8"><p>xxx：<span v-if="dataList !== null">{{dataList.Address}}</span></p></el-col>
        </el-row>

        <el-row>
          <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">医生信息：xx医生<b v-text="categoryName"></b></div></el-col>
        </el-row>
        <el-row>
          <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">其他信息：<b v-text="categoryName"></b></div></el-col>
        </el-row>
        <hr>
        <el-row>
          <el-col :span="24"><p>挂号单号：201904190001<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
          <el-col :span="24"><p>操作时间：2019-04-19 12:00:00<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
          <el-col :span="24"><p>挂号类型：初诊、复诊<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
          <el-col :span="24"><p>挂号费填写：30￥<span v-if="dataList !== null">{{dataList.Phone}}</span></p></el-col>
          <el-col :span="24"><p>诊疗费填写：10￥<span v-if="dataList !== null">{{dataList.Address}}</span></p></el-col>
          <el-col :span="24"><p>收费类型：只挂号、只诊疗、挂号+诊疗<span v-if="dataList !== null">{{dataList.Address}}</span></p></el-col>
          <el-col :span="24"><p>支付方式：<span v-if="dataList !== null">{{dataList.Address}}</span></p></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><p>合计：40￥<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
          <el-col :span="8"><p>实收：50￥<span v-if="dataList !== null">{{dataList.Phone}}</span></p></el-col>
          <el-col :span="8"><p>找零：10￥<span v-if="dataList !== null">{{dataList.Address}}</span></p></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="dataFormSubmitA()">挂号并打印</el-button>
        <el-button  type="primary" @click="dataFormAdd()">只挂号不打印</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
    </div>
    <div v-if="!show">
      <first-tab-add-or-update1 v-if="addOrUpdateVisible" ref="addOrUpdate" @childEven="father001"></first-tab-add-or-update1>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
// import {treeDataTranslate} from '@/utils'
import FirstTabAddOrUpdate1 from './first-tab-add-or-update1'
export default {
  components: { FirstTabAddOrUpdate1 },
  data () {
    return {
      show: true,
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
      addOrUpdateVisible: false
    }
  },

  methods: {
    father001 () {
      this.show = !this.show
    },
    comFunction () {
      // 这儿请求起点药材的接口要改成，请求对应门店库存的接口 后来 又改回老接口了
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
            CostPrice: item.CostPrice,
            Quantity: item.Quantity,
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
    },
    addOrUpdateHandle1 (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
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
