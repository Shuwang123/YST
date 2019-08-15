<template>
  <div class="purchaseList-first-tab">
    <!-- chenxiHeight命名法 -->
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="purchaseListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column prop="Id" header-align="center" align="center" label="ID" width="60" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="Address" header-align="center" align="center" label="地址" width="60" :show-overflow-tooltip="true"></el-table-column>-->
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
      <el-table-column prop="" label="操作" :width="status === 1 ? 280 : 150" header-align="center" align="center">
        <template slot-scope="scope">
          <!--<el-button type="text" @click="addOrUpdateHandle(scope.row.Id)">就诊</el-button>-->
          <el-button type="text"
                     @click="$router.push(`/doctor/recipel?MobilePhone=${scope.row.MobilePhone}&DoctorName=${scope.row.DoctorName}&DoctorId=${fatherDataForm.AccountId}&registerFormId=${scope.row.Id}`)">
            就诊</el-button>
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
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataListChild"></first-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import { calcAge } from '@/utils/validate'
import API from '@/api'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import { mapGetters } from 'vuex'
export default {
  name: 'drugs',
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 273, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载

      pageIndex: 1,
      pageSize: 10,
      IsPaging: 10,
      totalPage: 1,
      dataList: [],
      status: 0 // 采购单的状态、1 4 10 -1
    }
  },
  components: { FirstTabAddOrUpdate },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 273 // 273 测试老半天
    }
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$nextTick(() => {
        var params = {
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          IsPaging: this.IsPaging,
          StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店Id（必须）
          Code: '', // 挂号单
          UserName: this.fatherDataForm.PatientName, // 患者姓名
          MobilePhone: this.fatherDataForm.PatientPhone, // 患者电话
          AccountId: this.fatherDataForm.AccountId, // 账户Id,医生Id
          WrokFrom: '', // 开始时间
          WrokTo: '', // 结束时间
          Status: '2', // -1作废1初始 2只支付挂号费 待就诊（候诊）3已就诊-待收费 5已收费6已发货  -2全部
          OrderType: '1' // 40表示协定方
        }
        API.register.getRegisterList(params).then(result => { // 获取待就诊列表（挂号列表为基础筛选：医生）或者以后还可能筛选挂号单本身的状态
          if (result.code === '0000') {
            this.dataList = this.fatherDataForm.AccountId === '' ? [] : result.data.map(item => {
              item.BirthDate = calcAge(item.BirthDate)
              return item
            })
            this.totalPage = result.total
          } else {
            this.$message.error(result.message)
          }
          this.dataListLoading = false
        })
        console.log(params)
      })
    },
    getDataListChild () {
      this.getDataList(this.status)
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList(this.status)
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList(this.status)
    },
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
