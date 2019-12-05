<template>
  <div class="storeStock-first-tab">
    <!--chenxiHeight命名法-->
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column type="index" align="center" width="70" label="序号"></el-table-column>
      <el-table-column prop="StoreName" header-align="center" align="center" label="门店" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="RoleName" header-align="center" align="center" label="角色" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="NickName" header-align="center" align="center" label="医生昵称" width="100"></el-table-column>
      <el-table-column prop="RegisterAmount" header-align="center" align="center" label="挂号费" width=""></el-table-column>
      <!--<el-table-column prop="" label="已挂号/限号量（？）" width="" header-align="center" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.Id}}/{{scope.row.Id}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="Room" header-align="left" align="left" label="诊室" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="OrderWork" header-align="left" align="left" label="排班信息" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Phone" header-align="center" align="center" label="医生联系电话" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="190" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" plain
                     @click="addOrUpdateHandle(scope.row)">挂号</el-button>
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

    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @registerPrint="fatherFun"></first-tab-add-or-update>
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
      totalPage: 1,
      IsPaging: true,
      dataForm: {
        RedLine: ''
      },
      dataList: []
    }
  },
  components: { FirstTabAddOrUpdate },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
    }
  },
  methods: {
    fatherFun () {
      this.getDataList()
    },

    // 这个是查询某门店的：全部医生列表
    getDataList () {
      this.dataListLoading = true
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.IsPaging,
        // id: this.fatherDataForm.AccountId,
        id: '',
        userName: '',
        nickName: this.fatherDataForm.doctorName, // 医生姓名search
        roleId: this.$store.getters.getAllDoctorIdArr.join(), // 角色名里includes('医生')，对应的id存在vuex里
        canViewStores: this.$store.getters.getAccountCurrentHandleStore
      }
      // console.log(params)
      API.adminUser.adminUserList(params).then(response => {
        if (response.code === '0000') {
          if (response.data) { this.dataList = response.data }
          this.totalPage = response.total
          // console.log(this.dataList)
        } else {
          this.$message.error(response.message)
        }
        this.dataListLoading = false
      })
      // API.register.getDoctors(params).then(result => {
      //   console.log('ajsdj')
      //   if (result.code === '0000') {
      //     this.dataList = result.data
      //     this.totalPage = result.total
      //   } else {
      //     this.$message.error(result.message)
      //   }
      //   this.dataListLoading = false
      // })
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
    addOrUpdateHandle (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
