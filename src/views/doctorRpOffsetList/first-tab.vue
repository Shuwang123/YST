<template>
  <div class="purchaseList-first-tab">
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="purchaseListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column prop="Id" header-align="center" align="center" label="ID" width="60"></el-table-column>
      <el-table-column prop="StoreName" header-align="center" align="center" label="门店" min-width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="退单编码" min-width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="CategoryOneName" header-align="center" align="center" label="一级药态" min-width="100" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column header-align="center" align="center" label="剂数/总量" min-width="119">
        <template slot-scope="scope">
          <span>{{ scope.row.Total }} / {{ scope.row.Total * scope.row.TotalQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="总价/折扣" min-width="119">
        <template slot-scope="scope">
          <span>{{ scope.row.TotalAmount.toFixed(2) }}￥ / {{ scope.row.Discount * 100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="PaymentWayName" header-align="center" align="center" label="退费方式" min-width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="RoStatus" header-align="center" align="center" label="状态" min-width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="RoStatusName" header-align="center" align="center" label="状态" min-width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Remark" header-align="center" align="center" min-width="110" label="备注" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" align="center" label="时间" min-width="119">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOnTime | myDateFilter('MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row.Id)">查看</el-button>
          <el-button v-if="fatherStatus === 2" type="text" @click="offsetSubmit(scope.row.Id)">审核</el-button>
          <el-button v-if="fatherStatus === 2" type="text" @click="offsetCancel(scope.row.Id)">废弃</el-button>
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
        fatherStatus: 0 // 父层传递来的想查看的某类状态：退单状态、 -1 123
      }
    },
    components: { FirstTabAddOrUpdate },
    mounted () {
      window.onresize = () => {
        this.chenxiHeight = document.documentElement['clientHeight'] - 273 // 273 测试老半天
      }
    },
    methods: {
      getDataList (fatherStatus) {
        this.dataListLoading = true
        this.fatherStatus = fatherStatus
        this.$nextTick(() => {
          var params = {
            PageIndex: this.pageIndex,
            PageSize: this.pageSize,
            IsPaging: this.IsPaging,
            StoreId: this.$store.getters.getAccountCurrentHandleStore,
            Code: this.fatherDataForm.Code, // 挂号单Code
            Id: this.fatherDataForm.Id, // 挂号单Id
            WrokFrom: this.fatherDataForm.StartDate, // 开始时间
            WrokTo: this.fatherDataForm.EndDate, // 结束时间

            RoStatus: this.fatherStatus, // 单据状态 -1 123
            OrderType: 2, // 退单
            CategoryOne: this.fatherDataForm.CategoryOne, } // 	一级分类
          // console.log(fatherStatus, params)
          API.offset.getOffsetList(params).then(result => { // 获取退单列表
            if (result.code === '0000') {
              this.dataList =result.data
              this.totalPage = result.total
              console.log(this.dataList)
            } else {
              this.$message.error(result.message)
            }
            this.dataListLoading = false
          })
        })
      },
      getDataListChild () {
        this.getDataList(this.fatherStatus)
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataListChild()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataListChild()
      },
      addOrUpdateHandle (id, type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, type)
        })
      },

      // 退费单入库
      offsetSubmit (Id) {
        this.$confirm(`点击确定通过审核?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.offset.offsetSubmit({id: Id}).then(result => {
            if (result.code === '0000') {
              this.getDataListChild()
            } else {
              this.$message.error(result.message)
            }
          })
        })
      },
      // 作废退费单
      offsetCancel (id) {
        this.$prompt('请输入作废退单的原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.*/,
          inputErrorMessage: '未输入退单原因'
        }).then(({ value }) => {
          var obj = {
            id: id,
            remark: value}
          // console.log(obj)
          API.offset.offsetCancel(obj).then(result => {
            console.log(result)
            if (result.code === '0000') {
              this.getDataListChild()
              this.$message.success(`操作成功`)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
