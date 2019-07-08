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
      <el-table-column prop="DoctorName" header-align="center" align="center" label="医生" min-width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="RegisterMemberCount" header-align="center" align="center" label="挂号人数" min-width="100"></el-table-column>
      <el-table-column prop="ConsultationMemberCount" header-align="center" align="center" label="就诊人数" min-width="100"></el-table-column>
      <el-table-column prop="KFMemberCount" header-align="center" align="center" label="开方人次" min-width="100"></el-table-column>

      <el-table-column prop="FirstDiagnosisMemberCount" header-align="center" align="center" label="初诊" min-width="110"></el-table-column>
      <el-table-column prop="AgainDiagnosisMemberCount" header-align="center" align="center" label="复诊" min-width="110"></el-table-column>

      <el-table-column prop="TJDrugCount" header-align="center" align="center" label="汤剂" min-width="110"></el-table-column>
      <el-table-column prop="GFDrugCount" header-align="center" align="center" label="膏方" min-width="110"></el-table-column>
      <el-table-column prop="WJDrugCount" header-align="center" align="center" label="丸剂" min-width="110"></el-table-column>
      <el-table-column prop="WorkAmount" header-align="center" align="center" label="加工费" min-width="110"></el-table-column>

      <el-table-column prop="ENDrugAmount" header-align="center" align="center" label="西药费" min-width="110"></el-table-column>
      <el-table-column prop="ProductAmount" header-align="center" align="center" label="产品" min-width="110"></el-table-column>
      <el-table-column prop="LLAmount" header-align="center" align="center" label="理疗" min-width="110"></el-table-column>
      <el-table-column prop="OrderAmount" header-align="center" align="center" label="总金额" min-width="110"></el-table-column>
      <!--<el-table-column prop="" label="操作" width="150" header-align="center" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row.Id)">查看</el-button>-->
          <!--<el-button type="text" size="mini" @click="comfireDispensing(scope.row.Code)">点击出库</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
    <second-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataListChild"></second-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import SecondTabAddOrUpdate from './second-tab-add-or-update'
import { mapGetters } from 'vuex'
import {calcAge} from '@/utils/validate'

export default {
  components: { SecondTabAddOrUpdate },
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
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店Id（必须）
        StartDay: this.fatherDataForm.StartDate, // 开始时间
        EndDay: this.fatherDataForm.EndDate // 结束时间
      }
      // 获取挂号列表
      console.log(params)
      API.report.getDoctorReport(params).then(result => {
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
    },
    addOrUpdateHandle (patientId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(patientId)
      })
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
