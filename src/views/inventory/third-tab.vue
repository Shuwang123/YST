<template>
  <div class="storeStock-first-tab">
    <!--chenxiHeight命名法-->
    <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="">
          <el-select v-model="dataForm.SupplierId" placeholder="供应厂商" size="mini" clearable style="width: 120px">
            <el-option v-for="item in SupplierIdArr" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.BatchNo" placeholder="批次号" size="mini" clearable style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getDataList()" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      @selection-change="selectionChangeHandle"
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column prop="StoreName" header-align="left" align="left" label="门店" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ProductCode" header-align="center" align="center" label="商品编码" width="90"></el-table-column>
      <el-table-column prop="SupplierName" header-align="center" align="center" label="供应商" min-width=""></el-table-column>
      <el-table-column prop="CategoryName" header-align="center" align="center"
                       label="药态" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ProductName" header-align="center" align="center" label="名称" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="Status" header-align="center" align="center" label="没有厂商吧？所以厂商来货后都合并为一味药" width="" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="Dosage" header-align="center" align="center" label="剂型" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Specification" header-align="center" align="center" label="规格" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Unit" header-align="center" align="center" label="单位" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Quantity" header-align="center" align="center" label="存量" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Price" header-align="center" align="center" label="进价" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="BatchNo" header-align="center" align="center" label="批次号" min-width="110" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" align="center" label="历史时间" min-width="119">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.CreatedOn}}</span>-->
          <span>{{ scope.row.CreatedOn | myDateFilter('yyyy-MM-dd hh:mm')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 17, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="prev, pager, next, jumper, sizes, total" background>
    </el-pagination>
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataListChild"></first-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import { mapGetters } from 'vuex'
export default {
  name: 'stockFirst',
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 303, // 心累，不要动333
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载

      pageIndex: 1,
      pageSize: 17,
      IsPaging: true,

      SupplierIdArr: [], // 先请求供应商数组
      dataForm: {
        SupplierId: '',
        BatchNo: ''
      },
      dataList: [],
      totalPage: 1,
      dataListSelections: []
    }
  },
  components: { FirstTabAddOrUpdate },
  created () {
    this.getDataList()
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天333
    }
    // 初始化供应商数组
    API.supplier.getSupplierList({name: '', PageIndex: '1', PageSize: '1000', IsPaging: true, code: ''}).then(result => {
      if (result.code === '0000') {
        this.SupplierIdArr = result.data
      }
    })
  },
  methods: {
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    getDataList () {
      this.dataListLoading = true
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.IsPaging,
        StoreId: this.fatherDataForm.StoreId, // 门店ID
        CategoryId: this.fatherDataForm.CategoryId,

        SupplierId: this.dataForm.SupplierId, // 供应商
        ProductCodeOrBarCode: this.fatherDataForm.ProductCodeOrBarCode, // 产品编码 // ProductName: this.fatherDataForm.ProductName, // 产品名称
        BatchNo: this.dataForm.BatchNo
      }
      API.storeStock.getStockBatch(params).then(result => {
        if (result.code === '0000') {
          this.dataList = result.data
          this.totalPage = result.total
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
      })
    },
    getDataListChild () {
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    }
    // addOrUpdateHandle (id, type) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id, type)
    //   })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
