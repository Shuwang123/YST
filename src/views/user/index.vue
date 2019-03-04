<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.nickName" placeholder="账号别名（text）" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="账号ID(系统自动生成的不可控)" clearable style="width: 100px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-input v-model="dataForm.roleId" placeholder="门店ID 1:1(必填)" clearable style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.storeId" placeholder="角色ID 1:1" clearable style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button icon="el-icon-search" @click="addOrUpdateHandle()">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      border stripe
      :height="$store.state.documentClientIFRMAE"
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column type="index" label="序号" :align="$store.state.common.align" width="50px"></el-table-column>
      <el-table-column prop="ID" header-align="center" :align="$store.state.common.align" label="账户ID"></el-table-column>
      <el-table-column prop="Name" header-align="center" :align="$store.state.common.align" label="账户名字"></el-table-column>
      <el-table-column prop="Description" header-align="center" :align="$store.state.common.align" label="描述"></el-table-column>
      <!--<el-table-column header-align="center" :align="$store.state.common.align" label="角色">-->
        <!--<template slot-scope="scope">-->
           <!--<span v-for="(item, index) in scope.row.roles" :key="index">-->
             <!--{{item.roleName}}-->
          <!--</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作" width="190" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"
                     @click="addOrUpdateHandle(scope.row.Id)">编辑
          </el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"
                     @click="handelDelete(scope.row.Id)">启禁
          </el-button>
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
        userName: '',
        pageIndex: 1,
        pageSize: 10,
        isPaging: true,
        nickName: '', // 别名
        id: '', // 账号id
        storeId: '', // 名店id ※
        roleId: ''// 角色id
      },
      dataList: []
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 创建编辑账户
    addOrUpdateHandle (id) {
      console.log(id)
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 获取所有账户信息列表，或分页
    getDataList () {
      var parmet = {
        userName: this.dataForm.userName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPaging: true,
        nickName: this.nickName, // 别名
        id: this.id, // 账号id
        storeId: this.storeId, // 名店id ※?????无法请求分页
        roleId: this.roleId// 角色id
      }
      this.dataListLoading = true
      console.log('分页请求前')
      API.adminUser.adminUserList(parmet).then(response => {
        console.log(response)
        if (response.code === '0000') {
          if (response.data) {
            this.dataList = response.data
            console.log(this.dataList)
          }
          this.totalPage = response.total
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
      text-align: left;
    }
  }
}
</style>
