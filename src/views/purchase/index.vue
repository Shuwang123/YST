<template>
  <div class="mod-purchase">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent="getDataList()" ref="dataForm" label-width="80px">
      <el-form-item>
        <el-button type="primary" size="mini" @click="savePurchase()">保存采购单</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" size="mini" icon="el-icon-plus">商品导入</el-button>
        <el-button type="danger" @click="deleteHandle()" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" size="mini">批量移除</el-button>
      </el-form-item>
      <br>
      <div style="background-color: #F5F7FA;margin-bottom: -5px;border-radius: 5px 5px 0 0">
        <el-form-item label="操作账号" prop="">
          <el-input v-model="dataForm.UserName" placeholder="操作账号" clearable size="mini" style="width: 100px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-select v-model="dataForm.supplierId" placeholder="供应厂商" style="width: 150px" size="mini" @change="handleSupplier">
            <el-option v-for="item in supplierArr" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-select v-model="dataForm.StoreId" placeholder="选择门店" style="width: 150px" size="mini" @change="handleStore" :disabled="!dataForm.View">
            <el-option v-for="item in storeAll" :key="item.Id" :label="'['+item.Id+']'+item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-input v-model="dataForm.Buyer" placeholder="联系人" style="width: 80px" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.Phone" placeholder="联系电话" style="width: 120px" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.Address" placeholder="门店地址" style="width: 160px" size="mini"></el-input>
        </el-form-item>
      </div>
    </el-form>

    <el-table
      :data="dataList"
      border stripe
      :height="$store.state.documentClientIFRMAE"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      row-class-name="purchaseTableRowClass"
      style="width: 100%;">
      <el-table-column type="selection" header-align="center" :align="$store.state.common.align" width="50"></el-table-column>
      <el-table-column :align="$store.state.common.align" type="index" label="序号" width="50px"></el-table-column>
      <el-table-column prop="Id" header-align="center" :align="$store.state.common.align" width="80" label="商品编码"></el-table-column>
      <el-table-column prop="ShowName" header-align="center" :align="$store.state.common.align" label="药材名称"></el-table-column>
      <el-table-column prop="Description" header-align="center" :align="$store.state.common.align" label="规格" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="进价">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.SalePrice" :precision="2" :step="0.1" :min="0.1" :max="100" size="mini" controls-position="right"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="数量">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.Quantity" :precision="2" :step="1" :min="1" :max="10000" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="单位"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" width="190" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" plain
                     @click="deleteHandle(scope.row.Id)">移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<div style="position: relative">-->
      <!--<el-pagination-->
        <!--@size-change="sizeChangeHandle"-->
        <!--@current-change="currentChangeHandle"-->
        <!--:current-page="pageIndex"-->
        <!--:page-sizes="[10, 20, 50, 100]"-->
        <!--:page-size="pageSize"-->
        <!--:total="totalPage"-->
        <!--layout="prev, pager, next, jumper, sizes, total" background>-->
      <!--</el-pagination>-->
      <!--<el-input-->
        <!--:style="description" size="mini"-->
        <!--type="textarea"-->
        <!--:autosize="{ minRows: 1, maxRows: 4}"-->
        <!--placeholder="请输入进货备注"-->
        <!--v-model="dataForm.Remark">-->
      <!--</el-input>-->
    <!--</div>-->
    <el-input
      size="mini" style="width: 300px"
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4}"
      placeholder="请输入进货备注"
      v-model="dataForm.Remark">
    </el-input>
    <add-or-update v-if="addOrUpdateVisible" :purchaseFatherList="purchaseFormal" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import AddOrUpdate from './add-or-update'
import API from '@/api'
import {formatDate} from '@/utils/validate'
export default {
  name: 'role',
  data () {
    return {
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载v-loading

      pageSize: 10,
      pageIndex: 1,
      totalPage: 1,
      dataForm: {
        Name: '',
        UserName: '', // 当前页面登陆的账号名
        View: true, // 是否显示门店筛选组件
        StoreId: '',
        StoreCode: '',
        Buyer: '',
        Phone: '',
        Address: '',
        supplierId: '1',
        supplierCode: '6006'
      },
      storeAll: [],
      supplierArr: [],

      dataList: [],
      dataListSelections: [],
      purchaseFormal: [] // 采购单正式列表
      // description: {
      //   width: '200px',
      //   position: 'absolute',
      //   top: '1px',
      //   right: '100px'
      // }
    }
  },
  components: {
    AddOrUpdate
  },
  computed: {
  },
  // 进入采购页
  beforeRouteEnter (to, from, next) {
    if (to.path === '/drugs/purchase') {
      next(vm => {
        // 这儿的[]==[]为false…… 还有神奇的vm，都不晓得哪冒出来的，居然可以直接用，这查查资料
        console.log(window.sessionStorage.getItem('modPurchaseList'))
        if (window.sessionStorage.getItem('modPurchaseList') !== '[]' && JSON.parse(window.sessionStorage.getItem('modPurchaseList')) !== '' &&
          window.sessionStorage.getItem('modPurchaseList') !== undefined && window.sessionStorage.getItem('modPurchaseList') !== null) {
          // console.log(window.sessionStorage.getItem('modPurchaseList'))
          vm.$confirm(`系统有历史保存信息，是否调用？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // console.log(vm.dataList)
            // console.log(vm.purchaseFormal)
            // console.log(vm)
            vm.dataList = vm.purchaseFormal = JSON.parse(window.sessionStorage.getItem('modPurchaseList'))
            vm.dataForm.StoreId = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).StoreId
            vm.dataForm.Buyer = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).Buyer
            vm.dataForm.Phone = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).Phone
            vm.dataForm.Address = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).Address
            vm.dataForm.Remark = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).Remark
            vm.dataForm.supplierId = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).supplierId
            vm.dataForm.supplierCode = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).supplierCode
            window.sessionStorage.setItem('modPurchaseList', JSON.stringify([]))
            window.sessionStorage.setItem('modPurchasePeopleInfo', '')
          }).catch(() => {
            window.sessionStorage.setItem('modPurchaseList', JSON.stringify([]))
            window.sessionStorage.setItem('modPurchasePeopleInfo', '')
          })
        }
        next()
      })
    }
  },
  // 离开采购页面时
  beforeRouteLeave (to, from, next) {
    if (from.path === '/drugs/purchase' && this.dataList.join() !== '') {
      this.$confirm(`检测到未保存的内容，是否在离开页面前保存修改？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.setItem('modPurchaseList', JSON.stringify(this.dataList))
        var arr = {
          StoreId: this.dataForm.StoreId,
          Buyer: this.dataForm.Buyer,
          Phone: this.dataForm.Phone,
          Address: this.dataForm.Address,
          Remark: this.dataForm.Remark,
          supplierId: this.dataForm.supplierId,
          supplierCode: this.dataForm.supplierCode
        }
        window.sessionStorage.setItem('modPurchasePeopleInfo', JSON.stringify(arr))
        next()
      }).catch(() => {
        this.$message({type: 'info', message: '放弃保存并离开页面'})
        window.sessionStorage.setItem('modPurchaseList', JSON.stringify([]))
        window.sessionStorage.setItem('modPurchasePeopleInfo', '')
        next()
      })
    } else {
      next()
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    pageInit () {
      this.dataListLoading = true
      // 先初始化门店列表
      API.store.storeAll({PageIndex: 1, PageSize: 1000, IsPaging: true}).then(result => {
        if (result.code === '0000') {
          this.storeAll = result.data
        }
        this.$nextTick(() => {
          // 后处理当前页面 login账号 的对应门店的详情，识别当前账号是：管理员账号、还是1对1类型的账号
          API.purchase.getLoginInfo().then(result => {
            if (result.code === '0000') {
              this.dataForm.UserName = result.data.UserName
              this.dataForm.View = result.data.View // View为true表示当前账号可以自由选择门店
              this.dataForm.StoreId = result.data.StoreId
              this.dataForm.StoreCode = result.data.StoreCode
            }
            this.dataListLoading = false
          })
        })
      })
      // 先提前获取供应商列表初始化给supplierArr保存好
      API.supplier.getSupplierList({name: '', PageIndex: '1', PageSize: '1000', IsPaging: true, code: ''}).then(result => {
        if (result.code === '0000') {
          this.supplierArr = result.data.map(item => {
            return {Id: item.Id, Name: item.Name}
          })
        }
      })
    },
    // 切换门店时
    handleStore (storeId) {
      var handChild = this.storeAll.filter(item => {
        return item.Id === storeId
      })
      this.dataForm.StoreId = handChild[0].Id
      this.dataForm.StoreCode = handChild[0].Code
      this.dataForm.Buyer = handChild[0].Contact
      this.dataForm.Phone = handChild[0].Phone
      this.dataForm.Address = handChild[0].Address
    },
    // 切换供应商时
    handleSupplier (supplierId) {
      var handChild = this.supplierArr.filter(item => {
        return item.Id === supplierId
      })
      this.dataForm.supplierId = handChild[0].Id
      this.dataForm.supplierCode = handChild[0].Code
    },
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 这儿哟，子组件第一个勾选会跑到父组件的bug
    getDataList (arr = []) {
      this.dataList = this.purchaseFormal = arr
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val // this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (Id) {
      this.$confirm(`${Id === undefined ? '批量' : ''}移除Id为[${Id === undefined ? this.dataListSelections.map(item => {
        return item.Id
      }).join() : Id}]的项?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(Id)
        if (Id === undefined) {
          for (var i = 0; i < this.dataListSelections.length; i++) {
            this.purchaseFormal = this.dataList = this.purchaseFormal.filter(item => {
              return item.Id !== this.dataListSelections[i].Id
            })
          }
        } else {
          this.purchaseFormal = this.dataList = this.purchaseFormal.filter(item => {
            return item.Id !== Id
          })
        }
      })
    },
    // 正式提交采购单
    savePurchase () {
      if (String(this.dataList) !== [] && String(this.dataList) !== '') {
        var params = {
          Buyer: this.dataForm.Buyer,
          Phone: this.dataForm.Phone,
          Address: this.dataForm.Address,
          Remark: this.dataForm.Remark,
          OrderType: 1,
          StoreId: this.dataForm.StoreId,
          StoreCode: this.dataForm.StoreCode,
          Items: JSON.stringify(this.dataList.map(item => {
            return {
              ProductId: item.Id,
              SapProductCode: item.Code,
              CostPrice: item.SalePrice,
              Quantity: item.Quantity,
              SupplierId: this.dataForm.supplierId,
              SupplierCode: this.dataForm.supplierCode
            }
          })),
          SupplierId: this.dataForm.supplierId,
          SupplierCode: this.dataForm.supplierCode
        }
        console.log(params)
        API.purchase.submitPurchase(params).then(result => {
          if (result.code === '0000') {
            this.$message({message: result.message, type: 'success', duration: 3000})
            this.dataForm = {
              Name: '',
              UserName: '', // 当前页面登陆的账号名
              View: true, // 是否显示门店筛选组件
              StoreId: '',
              StoreCode: '',
              Buyer: '',
              Phone: '',
              Address: '',
              supplierId: '1',
              supplierCode: '6006'
            }
            this.pageInit()
            this.dataList = []
            this.purchaseFormal = []
            // this.dataList = this.purchaseFormal = [] 沃日，那个bug，在子层选中的第一个药品会直接显示到父层的bug就是这句话，写成连续的=就会那样，分开写就好了，不晓得为啥子，空了看看这方面的原理
          } else {
            this.$alert(`${result.message}`, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      } else {
        this.$alert('你还啥都没填呢!', '提示', {
          confirmButtonText: '确定'
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-purchase {
    margin:10px;
    .el-pagination {
      margin-top: 15px;
      text-align: left;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
/*表头高重写*/
.mod-purchase {
  /*重写头部input的margin-bottom*/
  & /deep/ .el-form-item {margin-bottom: 5px}
  margin-top: 0;
  & /deep/ .el-table--medium th, & /deep/ .el-table--medium td, & /deep/ .el-table th, & /deep/ .el-table td,
  & /deep/ .el-table--medium th, & /deep/ .el-table--medium td, & /deep/ .el-table th, & /deep/ .el-table td {
    padding: 0 !important;
  }
  & /deep/ .purchaseTableRowClass {
    height: 30px;
    line-height: 30px;
  }
}
</style>
