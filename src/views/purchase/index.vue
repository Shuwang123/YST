<template>
  <div class="mod-purchase">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent="getDataList()" ref="dataForm" label-width="100px">
    <!--<el-form :inline="true" :model="dataForm" @submit.native.prevent="getDataList()" :rules="dataRule" ref="dataForm" label-width="80">-->
      <el-form-item>
        <el-button type="primary" size="mini">保存</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" size="mini">导入商品</el-button>
        <el-button type="danger" @click="deleteHandle()" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" size="mini">批量移除</el-button>
      </el-form-item>
      <br>
      <el-form-item label="" prop="">
        <el-select v-model="dataForm.StoreId" placeholder="选择门店" style="width: 100px" size="mini" @change="handleStore" :disabled="!dataForm.View">
          <el-option v-for="item in storeAll" :key="item.Id" :label="'['+item.Id+']'+item.Name" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-select v-model="dataForm.supplierName" placeholder="供应厂商" style="width: 150px" size="mini">
          <el-option v-for="item in supplierArr" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-input v-model="dataForm.UserName" placeholder="操作账号" clearable size="mini" style="width: 100px" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="" prop="">
        <el-input v-model="dataForm.Buyer" placeholder="门店联系人" style="width: 100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.Phone" placeholder="联系电话" style="width: 120px" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.Address" placeholder="门店地址" style="width: 100px" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.Remark" placeholder="填写进货备注" style="width: 230px" size="mini"></el-input>
      </el-form-item>
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
      <!--<el-table-column prop="" header-align="center" :align="$store.state.common.align" label="进价">-->
        <!--<template slot-scope="scope">-->
          <!--<el-input-number v-model="num5" :precision="2" :step="0.1" :min="1" :max="10" size="mini" controls-position="right"></el-input-number>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="" header-align="center" :align="$store.state.common.align" label="数量">-->
        <!--<template slot-scope="scope">-->
          <!--<el-input-number v-model="num3" :precision="2" :step="0.1" :min="1" :max="10" size="mini"></el-input-number>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="单位"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" width="190" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" plain
                     @click="deleteHandle(scope.row.Code)">移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="prev, pager, next, jumper, sizes, total" background>
    </el-pagination>
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
        supplierName: ''
      },
      storeAll: [],
      supplierArr: [],

      dataList: [],
      dataListSelections: [],
      purchaseFormal: [] // 采购单正式列表
    }
  },
  components: {
    AddOrUpdate
  },
  computed: {
  },
  mounted () {
    this.getDataList()
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
    selectionChangeHandle (val) {
      this.dataListSelections = val
      // console.log(val) // 自动就是个数组
      // console.log(this.dataListSelections)
    },
    getDataList (dataList = []) {
      var parmet = {pageIndex: this.pageIndex, pageSize: this.pageSize, 'Name': String(this.dataForm.Name), isPaging: true}
      this.dataList = dataList
      this.purchaseFormal = dataList
      console.log(this.purchaseFormal)
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
    deleteHandle (Code) {
      this.$confirm(`确定移除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.purchaseFormal = this.dataList = this.purchaseFormal.filter(item => {
          return item.Code !== Code
        })
      })
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
  & /deep/ .el-form-item {margin-bottom: 10px}
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
