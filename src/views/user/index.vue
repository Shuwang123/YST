<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.username" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      :height="$store.state.documentClientIFRMAE"
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column :align="$store.state.common.align" type="index" label="序号" width="50px"></el-table-column>
      <!--<el-table-column prop="code" header-align="center" :align="$store.state.common.align" width="80" label="用户编码"></el-table-column>-->
      <el-table-column prop="username" header-align="center" :align="$store.state.common.align" label="用户名"></el-table-column>
      <el-table-column prop="realname" header-align="center" :align="$store.state.common.align" label="真实姓名"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="角色">
        <template slot-scope="scope">
           <span v-for="(item, index) in scope.row.roles" :key="index">
             {{item.roleName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" header-align="center" :align="$store.state.common.align" label="手机号"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">角色分配</el-button>
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import AddOrUpdate from './add-or-update'
import API from '@/api'
export default {
  name: 'user',
  computed: {
  },
  components: {
    AddOrUpdate
  },
  data () {
    return {
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      pageSize: 10,
      pageIndex: 1,
      totalPage: 1,
      dataForm: {
        username: ''
      },
      dataList: []
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 分配角色
    addOrUpdateHandle (id) {
      console.log(id)
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 获取数据信息
    getDataList () {
      var parmet = {username: this.dataForm.username, pageIndex: this.pageIndex, pageSize: this.pageSize}
      this.dataListLoading = true
      API.adminUser.adminUserList(parmet).then(response => {
        console.log(response)
        if (response.code === '0000') {
          if (response.data && response.data.accountList) {
            this.dataList = response.data.accountList
            console.log(this.dataList)
          }
          this.totalPage = response.paging.totalCount
        } else {
          this.$message.error(response.message)
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-user {
    margin: 10px;
    .el-pagination {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
