<template>
  <div class="purchaseList-first-tab">
    <!-- chenxiHeight命名法 -->
    <el-table
      @selection-change="selectionChangeHandle"
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="purchaseListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column prop="Id" header-align="center" align="center" label="就诊号" width="100"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="姓名" width="100"></el-table-column>
      <el-table-column prop="CreatedTime" header-align="center" align="center" label="性别" width="150"></el-table-column>

      <el-table-column prop="SupplierName" header-align="center" align="center" label="年龄" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="StoreName" header-align="center" align="center" label="出诊、复诊"></el-table-column>
      <el-table-column prop="Quantity" header-align="center" align="center" label="病历号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="CreatedByName" header-align="center" align="center" label="挂号单编号" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" :width="status === 1 ? 280 : 150" header-align="center" align="center">
        <template slot-scope="scope">
          <!--<el-button type="text" @click="addOrUpdateHandle(scope.row.Id)">就诊</el-button>-->
          <el-button type="text" @click="$router.push(`/doctor/recipel(kaifang)/${scope.row.Id}`)">就诊</el-button>
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
import { formatDate } from '@/utils/validate'
import API from '@/api'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import { mapGetters } from 'vuex'
export default {
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  name: 'drugs',
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 273, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载

      pageIndex: 1,
      pageSize: 10,
      totalPage: 1,
      dataList: [],
      dataListSelections: [],

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
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    getDataList (status) {
      this.status = status
      var params = { // 对应采购单状态status 1 4 10
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: true,
        SupplierId: this.fatherDataForm.SupplierId, // 供应商ID
        StoreId: this.fatherDataForm.StoreId, // 门店ID
        code: this.fatherDataForm.code, // 单据号
        StartDate: this.fatherDataForm.StartDate,
        EndDate: this.fatherDataForm.EndDate,
        Status: status === 0 ? '' : this.status // 单据号状态传0表示获取所有状态类型
      }
      this.dataListLoading = true
      console.log(this.status)
      API.purchase.getPurchaseList(params).then(result => {
        if (result.code === '0000') {
          if (this.status === 0) {
            this.dataList = result.data
            this.totalPage = result.total
          } else {
            this.dataList = result.data.filter(item => {
              return item.Status === this.status
            })
            this.totalPage = result.total
          }
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
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
    },
    handelDelete (id) {
      this.$confirm(`确定对[id=${id}]的采购单进行 '删除' 操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.purchase.deletePurchase({ids: id, reason: '没有原因，要啥子原因嘛'}).then((result) => {
          if (result.code === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1000,
              onClose: () => {
                this.getDataList(this.status)
              }
            })
          } else {
            this.$message.error(result.message)
          }
        })
      })
    },
    handelStatus4 (id) {
      this.$confirm(`确定对[id=${id}]的采购单进行 '添加到未入库列表' 操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('俺睡觉了快递费')
        console.log(id)
        API.purchase.handleStatus4({ids: id}).then((result) => {
          if (result.code === '0000') {
            this.$message({
              type: 'success',
              message: '修改成功!',
              duration: 1000,
              onClose: () => {
                this.getDataList(this.status)
              }
            })
          } else {
            this.$message.error(result.message)
          }
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
