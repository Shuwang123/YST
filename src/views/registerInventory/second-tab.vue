<template>
  <div class="storeStock-first-tab">
    <!--chenxiHeight命名法-->
    <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.BillCode" placeholder="单据编码" size="mini" clearable style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.BillType" placeholder="单据类型" size="mini" clearable style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item>
          <!--:default-time="['12:00:00']"-->
          <el-date-picker
            size="mini"
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 260px">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="pageIndex = 1; getDataList()" size="mini">查询</el-button>
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
      <el-table-column prop="StoreName" header-align="left" align="left" label="门店" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="BillCode" header-align="center" align="center" label="账单编码" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="BillId" header-align="center" align="center" label="账单ID" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ProductCode" header-align="center" align="center" label="药品编码" width="90"></el-table-column>
      <el-table-column prop="CategoryName" header-align="center" align="center"
                       label="药态" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ProductName" header-align="center" align="center" label="药名" min-width="80"></el-table-column>
      <!--<el-table-column prop="CategoryName" header-align="center" align="center" label="种类" width="70" :show-overflow-tooltip="true"></el-table-column>-->

      <el-table-column prop="Quantity" header-align="center" align="center" label="改变前" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="ChangeQuantity" header-align="center" align="center" label="增加 / 扣减" min-width="80"></el-table-column>
      <el-table-column prop="CurrentQuantity" header-align="center" align="center" label="剩余" min-width="80" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="BillTypeName" header-align="center" align="center" label="账单类型" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="BatchNo" header-align="center" align="center" label="批次号" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" align="center" label="事件时间" min-width="119">
        <template slot-scope="scope">
          <span>{{ scope.row.CreateTime | myDateFilter('yyyy-MM-dd hh:mm')}}</span>
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
      chenxiHeight: document.documentElement['clientHeight'] - 303, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载

      pageIndex: 1,
      pageSize: 17,
      IsPaging: true,
      value6: [],
      dataForm: {
        BillCode: '', // 单据编码
        BillType: '', // 单据类型 是入库单加还是开方减这个意思吗？
        StartDate: '',
        EndDate: ''
      },
      dataList: [],
      totalPage: 1,
      dataListSelections: []
    }
  },
  watch: {
    'value6': function () {
      console.log(this.value6)
      if (this.value6 !== [] && this.value6 !== null) {
        this.dataForm.StartDate = this.value6[0]
        this.dataForm.EndDate = this.value6[1]
        // console.log(this.dataForm.StartDate)
        // console.log(this.dataForm.EndDate)
      } else {
        this.dataForm.StartDate = ''
        this.dataForm.EndDate = ''
      }
    }
  },
  components: { FirstTabAddOrUpdate },
  created () {
    this.getDataList()
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
    }
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

        ProductCodeOrBarCode: this.fatherDataForm.ProductCodeOrBarCode, // 产品编码
        ProductName: this.fatherDataForm.ProductName, // 产品名称
        // SpellName: this.fatherDataForm.SpellName,
        // SupplierId: this.dataForm.SupplierId, // 供应商

        BillCode: this.dataForm.BillCode,
        BillType: this.dataForm.BillType,
        StartDate: this.dataForm.StartDate,
        EndDate: this.dataForm.EndDate
      }
      console.log(this.value6,params)
      API.storeStock.getStockHistory(params).then(result => {
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
