<template>
  <div class="agreement41">
    <!-- chenxiHeight命名法 -->
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border
      v-loading="dataListLoading"
      :row-class-name="tableRowClassName"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column prop="Id" header-align="center" align="center" label="ID" width="60" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="编码" min-width="100"></el-table-column>
      <el-table-column prop="PrescriptionName" header-align="center" align="center" label="处方名" min-width="110" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="CategoryOneName" header-align="center" align="center" label="一级药态" min-width="110" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="MainCure" header-align="center" align="center" label="主治" min-width="110" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Effect" header-align="center" align="center" label="功效" min-width="110" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="DrugRate" header-align="center" align="center" label="用法" min-width="110" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Explain" header-align="center" align="center" label="说明" min-width="110" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" align="center" label="更新时间" min-width="119">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOnTime | myDateFilter('MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="" label="操作" width="190" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row.Id, 'see')">查看</el-button>
          <el-button type="text" @click="addOrUpdateHandle(scope.row.Id, 'edit')">编辑</el-button>
          <el-button type="text" @click="delAgreement(scope.row)">删除</el-button>
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
    <second-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataListChild"></second-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import { calcAge } from '@/utils/validate'
import API from '@/api'
import SecondTabAddOrUpdate from './second-tab-add-or-update'
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
      dataList: []
    }
  },
  components: { SecondTabAddOrUpdate },
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
          UserName: '', // 患者姓名
          MobilePhone: '', // 患者电话
          // AccountId: this.fatherDataForm.AccountId, // 账户Id,医生Id
          WrokFrom: '', // 开始时间
          WrokTo: '', // 结束时间
          Status: this.fatherDataForm.agreementStatus, // -1作废1初始 2只支付挂号费 待就诊（候诊）3已就诊-待收费 5已收费6已发货  -2全部 ''表示协定方
          OrderType: '41', // 40表示协定方 41表示经典方
          PrescriptionName: this.fatherDataForm.PrescriptionName,
          CategoryOne: '-2' // 一级分类 -2查询所有 1内服2外用3制膏4水丸5水蜜丸
        }
        // console.log(params)
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
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.pageInit(id, type)
      })
    },
    tableRowClassName ({row, rowIndex}) {
      if (row.Status === -1) {
        return 'warning-row'
      } else if (row.Status === 3) {
        return 'success-row'
      }
      return ''
    },
    // 删除协定方
    delAgreement (row) {
      this.$prompt(`确定删除经典方：${row.PrescriptionName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /./,
        inputErrorMessage: '未填写原因原因'
      }).then(({value}) => {
        var obj = {
          id: row.Id,
          remark: value
        }
        API.register.deleteAgreement(obj).then(result => {
          console.log(result)
          if (result.code === '0000') {
            this.getDataList()
            this.$message.success(`删除成功`)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除操作已取消'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.agreement41 /deep/ {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .success-row {
    background: #f0f9eb;
  }
  .warning-row {
    background: #F5F7FA;
  }
}
</style>
