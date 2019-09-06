<template>
  <div class="storeStock-first-tab">
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column header-align="center" align="center" label="门店 / 医生" min-width="114" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.StoreName}} / {{scope.row.DoctorName}}</span>
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
      <!--<el-table-column prop="Status" header-align="center" align="center" label="状态" width="" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="left" label="订单总价" min-width="147">
        <template slot-scope="scope">
          <p><span style="display: inline-block;width: 45%;text-align: right;padding-right: 7px">￥</span>{{scope.row.OrderAmount.toFixed(2)}}</p>
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
        BillType: '', // 单据类型 是采购单加还是开方减这个意思吗？
        StartDate: '',
        EndDate: ''
      },
      dataList: [],
      totalPage: 1
    }
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
    }
  },
  methods: {
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
        CategoryOne: '-2'
      }
      // 获取挂号列表
      // console.log(params)
      API.register.getRegisterList(params).then(result => {
        if (result.code === '0000') {
          this.dataList = result.data.map(item => {
            item.BirthDate = calcAge(item.BirthDate)
            return item
          })
          this.totalPage = result.total
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
      })
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
