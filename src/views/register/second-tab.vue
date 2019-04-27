<template>
  <div class="storeStock-first-tab">
    <!--chenxiHeight命名法-->
    <!--<div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">-->
      <!--<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->
        <!--<el-form-item>-->
          <!--<el-input v-model="dataForm.BillCode" placeholder="单据编码" size="mini" clearable style="width: 120px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-input v-model="dataForm.BillType" placeholder="单据类型" size="mini" clearable style="width: 120px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--&lt;!&ndash;:default-time="['12:00:00']"&ndash;&gt;-->
          <!--<el-date-picker-->
            <!--size="mini"-->
            <!--v-model="value6"-->
            <!--type="daterange"-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--value-format="yyyy-MM-dd"-->
            <!--style="width: 260px">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button icon="el-icon-search" @click="pageIndex = 1; getDataList()" size="mini">查询</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</div>-->
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
      <el-table-column prop="Id" header-align="center" align="center" label="ID" width="60" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="UserName" header-align="left" align="left" label="用户名" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="NickName" header-align="center" align="center" label="别名" width="90"></el-table-column>
      <el-table-column prop="RoleName" header-align="center" align="center" label="职业" width="80"></el-table-column>
      <el-table-column prop="CreatedOn" header-align="center" align="center" label="创建时间" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="StoreName" header-align="center" align="center" label="所属门店" width=""></el-table-column>
      <el-table-column prop="Status" header-align="center" align="center" label="状态" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Phone" header-align="center" align="center" label="电话" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="StatusName" header-align="center" align="center" label="状态名" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" plain @click="xx(scope.row)">编辑、打印、查看等</el-button>
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
  name: 'stockFirst',
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 333, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载

      pageIndex: 1,
      pageSize: 10,
      IsPaging: true,
      value6: [],
      dataForm: {
        BillCode: '', // 单据编码
        BillType: '', // 单据类型 是采购单加还是开方减这个意思吗？
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
      this.chenxiHeight = document.documentElement['clientHeight'] - 333 // 273 测试老半天
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

        StoreId: 0, // 门店Id（必须）
        Code: '', // 挂号单
        UserName: '', // 患者姓名
        MobilePhone: '', // 患者电话
        AccountId: '', // 账户Id
        WrokFrom: '', // 开始时间
        WrokTo: '' // 结束时间
      }
      console.log(this.value6)
      console.log('jdaljdjadjlk去哦wieuROIu气我ie')
      // 获取挂号列表
      API.register.getRegisterList(params).then(result => {
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
    // addOrUpdateHandle (id, type) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id, type)
    //   })
    // },
    handelDelete (id) {
      this.$confirm(`确定对[id=${id}]的行导出excel表格吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
