<template>
  <div v-if="show3" class="ownScrollbar" style="min-height: 400px;max-height: 400px;overflow-y: scroll;">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="">
        <el-input v-model="dataForm.code" placeholder="姓名" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="dataForm.code" placeholder="患者电话" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()" size="mini">查询</el-button>
        <el-button type="danger" @click="show3 = !show3; addOrUpdateHandle3()" size="mini">新建患者</el-button>
      </el-form-item>
    </el-form>

    <el-table
      @selection-change="selectionChangeHandle"
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle30px"
      style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column prop="NickName" header-align="center" align="center" label="姓名" width=""></el-table-column>
      <el-table-column prop="Phone" header-align="left" align="left" label="电话" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Phone" header-align="center" align="center" label="性别" width=""></el-table-column>
      <el-table-column prop="Phone" header-align="left" align="left" label="出生" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain
                     @click="child; addOrUpdateHandle(scope.row)">载入
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
  </div>
  <div v-else-if="!show3">
    <first-tab-add-or-update3 v-if="addOrUpdateVisible" ref="addOrUpdate" @childEven="father003"></first-tab-add-or-update3>
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
      dataListAdd: [],
      show3: true
    }
  },
  methods: {
    child () {
      this.$emit('childEven')
    },
    father003 () {
      this.show3 = !this.show3
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
          }
        })
      }
      this.dataListLoading = false
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
