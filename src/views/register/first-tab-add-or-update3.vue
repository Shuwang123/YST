<template>
  <div class="ownScrollbar" style="min-height: 400px;max-height: 400px;overflow-y: scroll;">
    <el-row>
      <!--<el-col>A B C D E ...</el-col>-->
    </el-row>
    <el-row>
      <el-col :span="24"><p>患者姓名：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
      <el-col :span="24"><p>性别：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
      <el-col :span="24"><p>出生：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
      <el-col :span="24"><p>电话：<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
      <el-col :span="24"><p>地址：<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <el-col :span="24">
        <p>操作：
          <span>
            <el-button  type="danger" @click="child" size="mini">确定新建</el-button>
          </span>
        </p>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
// import {treeDataTranslate} from '@/utils'
import FirstTabAddOrUpdate3 from './first-tab-add-or-update3'
export default {
  components: { FirstTabAddOrUpdate3 },
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
      dataListAdd: []
    }
  },
  methods: {
    child () {
      this.$emit('childEven')
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
    addOrUpdateHandle3 (id, type) {
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
