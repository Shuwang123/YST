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
      <el-table-column type="index" align="center" width="70" label="序号"></el-table-column>
      <el-table-column header-align="center" align="center" label="门店 / 医生" min-width="110" :show-overflow-tooltip="true">
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
      <el-table-column header-align="center" align="left" label="挂号费" min-width="147">
        <template slot-scope="scope">
          <p><span style="display: inline-block;width: 45%;text-align: right;padding-right: 7px">￥</span>{{scope.row.RegisterAmount}}</p>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="收费状态" min-width="190">
        <template slot-scope="scope">
          <span>{{scope.row.DiagnosisTypeName}} / {{scope.row.RegisterStatusName}} / {{scope.row.RegisterOrderStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row.Id)">查看</el-button>
          <el-button type="text" size="mini" @click="registerRevoke(scope.row.Id)">退挂号费</el-button>
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
    <second-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></second-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import SecondTabAddOrUpdate from './second-tab-add-or-update'
import { mapGetters } from 'vuex'
import {calcAge} from '@/utils/validate'

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
      value6: [],
      dataForm: {
        BillCode: '', // 单据编码
        BillType: '', // 单据类型 是入库单加还是开方减这个意思吗？
        StartDate: '',
        EndDate: ''
      },
      dataList: [],
      totalPage: 1
    }
  },
  components: { SecondTabAddOrUpdate },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天333
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
        AccountId: this.fatherDataForm.AccountId, // 医生Id，传'' 查询所有患者挂号列表出来（门店还有限制不要担心）
        Code: this.fatherDataForm.Code, // 挂号单
        UserName: this.fatherDataForm.patientName, // 患者姓名
        MobilePhone: this.fatherDataForm.MobilePhone, // 患者电话
        WrokFrom: this.fatherDataForm.StartDate, // 开始时间
        WrokTo: this.fatherDataForm.EndDate, // 结束时间
        Status: '2' // -1作废1初始 2只支付挂号费 待就诊（候诊）3已就诊-待收费 5已收费6已发货  -2全部
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
    addOrUpdateHandle (patientId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(patientId)
      })
    },
    registerRevoke (id) {
      this.$prompt('请输入退费原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /./,
        inputErrorMessage: '未输入退费原因'
      }).then(({ value }) => {
        var obj = {
          id: id,
          remark: value}
        API.register.registerRevoke(obj).then(result => {
          console.log(result)
          if (result.code === '0000') {
            this.getDataList()
            this.$message.success(`退费操作成功`)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退费操作'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
