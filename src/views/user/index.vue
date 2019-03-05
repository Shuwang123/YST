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
        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">申请账号</el-button>
      </el-form-item>
    </el-form>

    <!--<el-table-column header-align="center" :align="$store.state.common.align" label="角色">-->
    <!--<template slot-scope="scope">-->
    <!--<span v-for="(item, index) in scope.row.roles" :key="index">-->
    <!--{{item.roleName}}-->
    <!--</span>-->
    <!--</template>-->
    <!--</el-table-column>-->
    <el-table
      :data="dataList"
      border stripe
      :height="$store.state.documentClientIFRMAE"
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column type="index" label="序号" :align="$store.state.common.align" width="50px"></el-table-column>
      <!--<el-table-column prop="Id" header-align="center" :align="$store.state.common.align" label="ID" width="50"></el-table-column>-->
      <el-table-column prop="UserName" header-align="center" :align="$store.state.common.align" label="账号"></el-table-column>
      <el-table-column prop="NickName" header-align="center" :align="$store.state.common.align" label="昵称" width="100"></el-table-column>
      <el-table-column prop="Phone" header-align="center" :align="$store.state.common.align" label="电话" width="150"></el-table-column>
      <el-table-column prop="StoreName" header-align="center" :align="$store.state.common.align" label="门店" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="RoleName" header-align="center" :align="$store.state.common.align" label="角色"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOn | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="StatusName" header-align="center" :align="$store.state.common.align" label="状态" width="100"></el-table-column>
      <el-table-column prop="Status" header-align="center" :align="$store.state.common.align" label="1,3" width="100"></el-table-column>
      <el-table-column label="操作" width="330" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"
                     @click="addOrUpdateHandle(scope.row.Id)">编辑
          </el-button>
          <el-button type="success" size="mini" plain
                     @click="handelStart(scope.row.Id)">启
          </el-button>
          <el-button type="danger" size="mini" plain
                     @click="handelDelete(scope.row.Id)">禁
          </el-button>
          <!--<el-button type="danger" size="mini" plain-->
                     <!--@click="handelUpdatePwd(scope.row.Id)">修改密码-->
          <!--</el-button>-->
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
    <!--<update-pwd v-if="updatePwdVisible" ref="updatePwd" @refreshDataList0="getDataList"></update-pwd>-->
  </div>
</template>
<script type="text/ecmascript-6">
import {formatDate} from '@/utils/validate'
import AddOrUpdate from './add-or-update'
// import UpdatePwd from './update-pwd'
import API from '@/api'
export default {
  name: 'user',
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  computed: {
  },
  components: {
    AddOrUpdate
    // ,    UpdatePwd
  },
  data () {
    return {
      addOrUpdateVisible: false,
      // updatePwdVisible: false,
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
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 获取所有账户信息列表，或分页
    getDataList () {
      var parmet = {
        userName: this.dataForm.userName,
        PageIndex: this.dataForm.pageIndex,
        PageSize: this.dataForm.pageSize,
        IsPaging: true,
        nickName: this.dataForm.nickName, // 别名
        id: this.dataForm.id, // 账号id
        storeId: this.dataForm.storeId === '' ? 0 : this.dataForm.storeId, // 名店id ※?????无法请求分页
        roleId: this.dataForm.roleId// 角色id
      }
      console.log(parmet)
      this.dataListLoading = true
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
    },
    handelDelete (id) {
      API.adminUser.adminUserDelete({id: id}).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: '禁用成功',
            duration: 1500
            // onClose: () => {
            // }
          })
          this.getDataList()
        }
      })
    },
    handelStart (id) {
      API.adminUser.adminUserStart({id: id}).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: '激活成功',
            duration: 1500
            // onClose: () => {
            // }
          })
          this.getDataList()
        }
      })
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
