<template>
  <div class="mod-purchase">
    <el-form :inline="true" :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item>
        <el-button type="primary" size="mini" @click="savePurchase()">保存采购单</el-button>
        <el-button type="primary" @click="addOrUpdateHandle(dataForm.CategoryId, dataForm.StoreId)" size="mini" icon="el-icon-plus" :disabled="dataForm.StoreId > 0 ? false : true">商品导入</el-button>
        <el-button type="danger" @click="deleteHandle()" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" size="mini">批量移除</el-button>
      </el-form-item>
      <br>
      <div style="background-color: #F5F7FA;margin-bottom: -5px;border-radius: 5px 5px 0 0">
        <el-form-item label="操作账号" prop="">
          <el-input v-model="dataForm.UserName" placeholder="操作账号" clearable size="mini" style="width: 100px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="" prop="CategoryText">
          <el-radio-group v-model="dataForm.CategoryText" size="mini" @change="categoryTextHandle">
            <el-radio-button v-for="item in drugsCategoryList" :key="item.id"
                             :label="item.text"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-select v-model="dataForm.supplierId" placeholder="供应厂商" style="width: 150px" size="mini" @change="handleSupplier">
            <el-option v-for="item in supplierArr" :key="item.Id" :label="item.ShortName" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-select v-model="dataForm.StoreId" placeholder="选择门店" style="width: 150px" size="mini" @change="handleStore" :disabled="!dataForm.View">
            <el-option v-for="item in storeArr" :key="item.Id" :label="'['+item.Id+']'+item.Name" :value="item.Id"></el-option>
          </el-select>
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
      <el-table-column prop="Code" header-align="center" :align="$store.state.common.align" width="100" label="商品编码"></el-table-column>
      <el-table-column prop="ShowName" header-align="center" :align="$store.state.common.align" label="药材名称"></el-table-column>
      <el-table-column prop="Specification" header-align="center" :align="$store.state.common.align" label="规格" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="进价" min-width="110">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.SalePrice" :precision="2" :step="0.1" :min="0.1" :max="100" size="mini" controls-position="right"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="数量" min-width="110">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.Quantity" :precision="2" :step="1" :min="1" :max="10000" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <!--<el-table-column prop="" header-align="center" :align="$store.state.common.align" label="单位"></el-table-column>-->
      <el-table-column header-align="center" :align="$store.state.common.align" width="190" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" plain
                     @click="deleteHandle(scope.row.Id)">移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-input v-model="dataForm.Buyer" placeholder="联系人" style="width: 80px" size="mini"></el-input>
    <el-input v-model="dataForm.Phone" placeholder="联系电话" style="width: 120px" size="mini"></el-input>
    <el-input v-model="dataForm.Address" placeholder="门店地址" style="width: 160px" size="mini"></el-input>
    <el-input
      size="mini" style="width: 300px"
      type="textarea"
      :autosize="{ minRows: 1, maxRows: 4}"
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
        supplierId: '0',
        supplierCode: '',

        StoreId: '0',
        StoreCode: '',
        Buyer: '',
        Phone: '',
        Address: '',
        CategoryText: '', // 这两个后端不需要，只是前端自己弄来做一些判断而已
        CategoryId: '', //
        Remark: ''
      },
      oldCategoryText: '', // 切换药态时，此信息可以判断用户点的取消，还是确定
      // oldCategoryId: '', //

      storeArr: [],
      supplierArr: [],
      drugsCategoryList: [],

      dataListSelections: [],
      dataList: [],
      purchaseFormal: [] // 采购单正式列表
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
            vm.dataList = JSON.parse(window.sessionStorage.getItem('modPurchaseList'))
            vm.purchaseFormal = JSON.parse(window.sessionStorage.getItem('modPurchaseList'))
            vm.dataForm.StoreId = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).StoreId
            vm.dataForm.Buyer = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).Buyer
            vm.dataForm.Phone = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).Phone
            vm.dataForm.Address = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).Address
            vm.dataForm.Remark = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).Remark
            vm.dataForm.supplierId = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).supplierId
            vm.dataForm.supplierCode = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).supplierCode
            vm.dataForm.CategoryText = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).CategoryText
            vm.dataForm.CategoryId = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).CategoryId
            vm.oldCategoryText = JSON.parse(window.sessionStorage.getItem('modPurchasePeopleInfo')).oldCategoryText
            window.sessionStorage.setItem('modPurchaseList', JSON.stringify([]))
            window.sessionStorage.setItem('modPurchasePeopleInfo', '')
            // console.log(vm.dataList)
            // console.log(vm.purchaseFormal)
            // console.log(vm)
          }).catch(() => {
            window.sessionStorage.setItem('modPurchaseList', JSON.stringify([]))
            window.sessionStorage.setItem('modPurchasePeopleInfo', '')
          })
        }
        next()
      })
    }
  },
  // 离开采购页时
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
          supplierCode: this.dataForm.supplierCode,
          CategoryText: this.dataForm.CategoryText,
          CategoryId: this.dataForm.CategoryId,
          oldCategoryText: this.oldCategoryText
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
      // 并发请求 供应商、门店、药态(并发请求，最后单独请求第四个，根据当前登陆账号觉得是否禁用门店下拉)
      function funSupplier () { return API.supplier.getSupplierList({name: '', PageIndex: '1', PageSize: '1000', IsPaging: true, code: ''}) }
      function funStore () { return API.store.storeAll({PageIndex: 1, PageSize: 1000, IsPaging: true}) }
      function funCategory () { return API.drugs.getDrugsCategory() }
      this.$ios.all([funSupplier(), funStore(), funCategory()]).then(this.$ios.spread((resultSupplier, resultStore, resultCategory) => {
        if (resultSupplier.code === '0000' && resultStore.code === '0000' && resultCategory.code === '0000') {
          this.supplierArr = resultSupplier.data // 初始化供应商
          this.storeArr = resultStore.data // 初始化门店

          this.drugsCategoryList = resultCategory.data.filter((item, index) => { return index > 0 }) // 初始化药态
          this.dataForm.CategoryText = this.drugsCategoryList[0].text
          this.dataForm.CategoryId = this.drugsCategoryList[0].id
          this.oldCategoryText = this.drugsCategoryList[0].text
          this.dataListLoading = false
        }
        this.$nextTick(() => {
          // 初始化页面完毕后才，处理去获取当前页面login信息，获得账号下对应门店的详情---（识别当前账号是：管理员账号、还是1对1类型的账号）
          API.purchase.getLoginInfo().then(result => {
            if (result.code === '0000') {
              console.log(result)
              console.log('???')
              this.dataForm.UserName = result.data.UserName
              this.dataForm.View = result.data.View // 决定：门店下拉是否禁用
              this.dataForm.StoreId = result.data.StoreId
              this.dataForm.StoreCode = result.data.StoreCode // 这儿后端的接口获取登陆信息还有不足，或者前端自己处理，如果普通账号，那门店直接就锁定的，但这种情况下却没有联系人，电话，地址这三个页面的初始信息了
              // 这下面应该还有几行的……
              // 超级管理员：canViewStore: '', storeId都是0，view都是true
              // 普通账号：canViewStore: '', storeId都不能与0，view都是false
            }
          })
        })
      }))
    },
    categoryTextHandle (text) {
      this.$confirm('此操作将清空之前的记录! 是否要继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getDataList() // 确定切换药态后，就会清空
        this.drugsCategoryList.forEach(item => {
          if (item.text === text) {
            this.dataForm.CategoryId = item.id // 这个药态的id会传递给子组件，用于弹窗时正确请求对应的药材列表
            this.oldCategoryText = item.text
            // console.log(this.dataForm.CategoryText)
            // console.log(this.oldCategoryText)
            // console.log(this.dataForm.CategoryId)
          }
        })
      }).catch(() => {
        this.dataForm.CategoryText = this.oldCategoryText
      })
    },
    // 切换门店时
    handleStore (storeId) {
      var handChild = this.storeArr.filter(item => {
        return item.Id === storeId
      })
      this.dataForm.StoreId = handChild[0].Id
      this.dataForm.StoreCode = handChild[0].Code
      this.dataForm.Buyer = handChild[0].Contact
      this.dataForm.Phone = handChild[0].Phone
      this.dataForm.Address = handChild[0].Address

      this.getDataList()
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
    // 这儿哟，子组件第一个勾选会跑到父组件的bug 连续x=x=arr造成的
    getDataList (arr) {
      if (String(arr) === '[]' || arr === undefined) {
        this.dataList = []
        this.purchaseFormal = []
      } else {
        this.dataList = arr
        this.purchaseFormal = arr
      }
    },
    addOrUpdateHandle (id0, id1) { // id0是药态类型、饮片、颗粒等+id1门店id
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id0, id1)
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
        if (String(params.StoreId) === '0' || params.SupplierId === '0') {
          this.$alert('您没有选择供应商、门店!', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        console.log(params)
        API.purchase.submitPurchase(params).then(result => {
          if (result.code === '0000') {
            this.$message({message: result.message, type: 'success', duration: 3000})
            this.dataForm = {
              Name: '',
              UserName: '', // 当前页面登陆的账号名
              View: true, // 是否显示门店筛选组件
              supplierId: '0',
              supplierCode: '',

              StoreId: '0',
              StoreCode: '',
              Buyer: '',
              Phone: '',
              Address: '',
              CategoryText: '', // 这两个后端不需要，只是前端自己弄来做一些判断而已
              CategoryId: '', //
              Remark: ''
            }
            this.oldCategoryText = ''
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
