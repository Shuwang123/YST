<template>
  <div class="storeStock-first-tab">
    <div style="background-color: #F5F7FA;border-radius: 0 0 0 0;padding: 1px 3px">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button icon="el-icon-document" @click="handleDownload" size="mini">Export Excel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      show-summary
      :summary-method="getSummaries"
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column type="index" align="center" width="70" label="序号"></el-table-column>
      <el-table-column header-align="center" align="center" label="门店"  min-width="70" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.StoreName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="SourceName" header-align="center" align="center" label="订单来源" min-width="100"></el-table-column>
      <el-table-column prop="DoctorName" header-align="center" align="center" label="医生" min-width="100"></el-table-column>
      <el-table-column header-align="center" align="center" label="一级药态" min-width="119">
        <template slot-scope="scope">
          <span>{{scope.row.CategoryOneName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="UserCode" header-align="center" align="center" label="病历号" min-width="100"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="挂号单" min-width="100"></el-table-column>
      <el-table-column header-align="center" align="center" label="挂号患者" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.UserName}} / {{scope.row.SexName}} / {{scope.row.BirthDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="MobilePhone" header-align="center" align="center" label="手机" min-width="110"></el-table-column>
      <el-table-column header-align="center" align="center" label="时间" min-width="119">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOnTime | myDateFilter('MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Total" header-align="center" align="center" label="帖数" min-width="70"></el-table-column>
      <!--<el-table-column prop="Status" header-align="center" align="center" label="状态" width="" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="left" label="订单总价" class-name="TotalOrderAmount" min-width="147">
        <template slot-scope="scope">
          <p><span style="display: inline-block;width: 45%;text-align: right;padding-right: 7px">￥</span>{{scope.row.OrderAmount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="挂号费" class-name="TotalRegisterAmount" min-width="147">
        <template slot-scope="scope">
          <p><span style="">￥</span>{{Number(scope.row.RegisterAmount).toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="加工费" class-name="TotalWorkAmount" min-width="119">
        <template slot-scope="scope">
          <span>{{scope.row.WorkAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="快递费" class-name="TotalExpressAmount" min-width="119">
        <template slot-scope="scope">
          <span>{{scope.row.ExpressAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="零售价" class-name="TotalOrderItemAmount" min-width="147">
        <template slot-scope="scope">
          <p><span style="">￥</span>{{Number(scope.row.OrderItemAmount).toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="进货价" class-name="TotalOrderItemCostAmount" min-width="147">
        <template slot-scope="scope">
          <p><span style="">￥</span>{{Number(scope.row.OrderItemCostAmount).toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="毛利润" class-name="SaleOrderProfitAmount"  min-width="147">
        <template slot-scope="scope">
          <p><span style=""></span>{{Number(scope.row.ProfitAmount).toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="毛利率" class-name="SaleOrderRateOfProfitAmount" min-width="147">
        <template slot-scope="scope">
          <p><span style=""></span>{{scope.row.ProfitPercent}}</p>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="折扣" min-width="119">
        <template slot-scope="scope">
          <span>{{Number(scope.row.Discount * 100).toFixed(4) }}%</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="收费状态" min-width="260" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.DiagnosisTypeName}} / {{scope.row.RegisterStatusName ? scope.row.RegisterStatusName : ''}} / {{scope.row.StatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row.Id)">查看</el-button>
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
    <three-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></three-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import request from '../../api/request'
import ThreeTabAddOrUpdate from './three-tab-add-or-update'
import { mapGetters } from 'vuex'
import {calcAge} from '@/utils/validate'

export default {
  components: { ThreeTabAddOrUpdate },
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
      SumColumns: []
    }
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
    }
  },
  methods: {
    handleDownload () {
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.IsPaging,
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店Id（必须）
        AccountId: this.fatherDataForm.AccountId, // 账户Id,医生Id
        Code: this.fatherDataForm.Code, // 挂号单
        UserName: this.fatherDataForm.patientName, // 患者姓名
        MobilePhone: this.fatherDataForm.MobilePhone, // 患者电话
        WrokFrom: this.fatherDataForm.StartDate, // 开始时间
        WrokTo: this.fatherDataForm.EndDate, // 结束时间
        Status: '6', // -1作废1初始 2只支付挂号费 待就诊（候诊）3 已就诊-(待收费) 5已收费6已发货 出库  -2全部
        OrderType: '1', // 40表示协定方
        CategoryOne: this.fatherDataForm.CategoryOne,
        CategoryOneStatus: 2,
        Source: this.fatherDataForm.Source
      }
      var url = request.downUrl + '/YstApiSaleOrder/LoadData'
      // 附加参数
      var href = url + '?toExcel=true'
      var parameters = params
      for (var name in parameters) {
        href += '&' + name + '=' + encodeURIComponent(parameters[name])
      }
      window.location.href = href
    },
    // 这个是查询某门店当日的：患者全部挂号列表
    getDataList () {
      this.dataListLoading = true
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.IsPaging,
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店Id（必须）
        AccountId: this.fatherDataForm.AccountId, // 账户Id,医生Id
        Code: this.fatherDataForm.Code, // 挂号单
        UserName: this.fatherDataForm.patientName, // 患者姓名
        MobilePhone: this.fatherDataForm.MobilePhone, // 患者电话
        WrokFrom: this.fatherDataForm.StartDate, // 开始时间
        WrokTo: this.fatherDataForm.EndDate, // 结束时间
        Status: '6', // -1作废1初始 2只支付挂号费 待就诊（候诊）3 已就诊-(待收费) 5已收费6已发货 出库  -2全部
        OrderType: '1', // 40表示协定方
        CategoryOne: this.fatherDataForm.CategoryOne,
        CategoryOneStatus: 2,
        Source: this.fatherDataForm.Source
      }
      // 获取挂号列表
      // console.log(params)
      API.register.getRegisterList(params).then(result => {
        if (result.code === '0000') {
          this.dataList = result.data.map(item => {
            item.BirthDate = calcAge(item.BirthDate)
            return item
          })
          console.log(this.dataList)
          this.totalPage = result.total
          this.SumColumns = result.SumColumns
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
      })
    },
    getSummaries: function (param) {
      const { columns } = param
      const sums = []
      const SumColumns = this.SumColumns
      columns.forEach(function (column, index) {
        SumColumns.forEach(function (column1, index1) {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (column.className === column1.Column) {
            sums[index] = column1.Value
          }
        })
      })

      return sums
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
    },
    addOrUpdateHandle (formId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(formId)
      })
    },
    jumpOffsetPage (row) {
      this.$confirm('确定利用旧单据建立退单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          name: 'offsetPage',
          params: {
            type: 'edit',
            row: row
          }})
      }).catch(() => {
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
