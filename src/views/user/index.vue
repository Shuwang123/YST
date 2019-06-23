<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <com-store :paramsFather="{
        'label_0': '',
        'size_1': '',
        'width_2': '180px',
        'clear_3': true,
        'multiple_4': false,
        'must_5': false,
        'isTrigger': false
      }" ref="comStore" @eventStore="changeStoreData"></com-store>
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="查询账号" clearable @clear="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.nickName" placeholder="查询昵称" clearable @clear="getDataList()"></el-input>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-input v-model="dataForm.id" placeholder="账号ID(系统自动生成的不可控)" clearable style="width: 100px"></el-input>-->
      <!--</el-form-item>-->

      <el-form-item>
        <el-select v-model="dataForm.roleId" placeholder="请选择角色" clearable @change="getDataList()">
          <el-option v-for="item in roleArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
      :header-cell-style="$cxObj.tableHeaderStyle"
      style="width: 100%;">
      <el-table-column type="index" label="序号" :align="$store.state.common.align" width="50px"></el-table-column>
      <!--<el-table-column prop="Id" header-align="center" :align="$store.state.common.align" label="ID" width="50"></el-table-column>-->
      <el-table-column prop="StoreName" header-align="center" :align="$store.state.common.align" label="所属门店" width="100" :show-tooltip-when-overflow="true"></el-table-column>
      <!--<el-table-column prop="UserName" header-align="right" align="right" label="注册账号" width="119"></el-table-column>-->
      <!--<el-table-column prop="NickName" header-align="left" align="left" label="昵称" width="100"></el-table-column>-->
      <el-table-column header-align="center" align="left" label="登陆账号 / 昵称" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="display: inline-block;padding-left: 23%">{{scope.row.UserName}} ( {{scope.row.NickName}} )</span>
        </template>
      </el-table-column>
      <el-table-column prop="RoleName" header-align="center" :align="$store.state.common.align" label="角色" min-width="100"></el-table-column>
      <el-table-column prop="Phone" header-align="center" :align="$store.state.common.align" label="联系电话" min-width="119"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="创建时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOn | myDateFilter('yyyy-MM-dd hh:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="StatusName" header-align="center" :align="$store.state.common.align" label="状态" width="100"></el-table-column>
      <!--<el-table-column prop="Status" header-align="center" :align="$store.state.common.align" label="1,3" width="100"></el-table-column>-->
      <el-table-column label="操作" width="260" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"
                     @click="addOrUpdateHandle(scope.row.Id)">编辑
          </el-button>
          <el-button type="primary" size="mini" plain @click="resetHandle(scope.row)">重置</el-button>
          <el-button
            :type="scope.row.Status === 1 ? 'success' : 'danger'"
            size="mini" plain icon=""
            @click="scope.row.Status === 1 ? handelDelete(scope.row.Id) : handelStart(scope.row.Id)">
            {{scope.row.Status === 1 ? '禁用' : '启用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 13, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="prev, pager, next, jumper, sizes, total" background>
    </el-pagination>

    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!--<update-pwd v-if="updatePwdVisible" ref="updatePwd" @refreshDataList0="getDataList"></update-pwd>-->
  </div>
</template>
<script type="text/ecmascript-6">
import AddOrUpdate from './add-or-update'
// import UpdatePwd from './update-pwd'
import ComStore from '../common/com-store'
import API from '@/api'
export default {
  name: 'user',
  computed: {
  },
  components: {
    AddOrUpdate,
    ComStore
    // UpdatePwd
  },
  data () {
    return {
      addOrUpdateVisible: false,
      // updatePwdVisible: false,
      dataListLoading: false, // 加载

      pageSize: 13,
      pageIndex: 1,
      totalPage: 1,
      dataForm: {
        userName: '',
        nickName: '', // 别名
        id: '', // 账号id
        storeId: '', // 名店id ※
        roleId: ''// 角色id
      },
      roleArr: [],
      dataList: []
    }
  },
  mounted () {
    this.getDataList()
    this.initID()
  },
  methods: {
    // 公用门店下拉子组件的想option改变时，父组件的storedId也变化
    changeStoreData (choseStoreId) {
      this.dataForm.storeId = choseStoreId
      this.getDataList()
    },
    initID () {
      API.role.jueseList({PageIndex: 1, PageSize: 1000, IsPaging: true}).then(result => {
        if (result.code === '0000') {
          result.data.forEach(item => {
            this.roleArr.push({name: item.Name, id: item.Id})
          })
        }
      })
    },
    // 创建编辑账户
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    resetHandle (row) {
      this.$confirm(`确定将[id=${row.Id}][账号名=${row.UserName}]的账户的密码重置为123456吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.role.resetPassword({id: row.Id}).then((result) => {
          if (result.code === '0000') {
            this.$message({
              type: 'success',
              message: '重置密码成功!',
              duration: 1000,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(result.message)
          }
        })
      })
    },
    // 获取所有账户信息列表，或分页
    getDataList () {
      var parmet = {
        userName: this.dataForm.userName,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: true,
        nickName: this.dataForm.nickName, // 别名
        id: this.dataForm.id, // 账号id
        canViewStores: this.dataForm.storeId === '' ? this.$store.getters.getAccountLoginInfoAll.CanViewStores : this.dataForm.storeId, // 名店id 传递''返回全部（相对自己的权限内），不是传递0
        // storeId: this.dataForm.storeId === '' ? this.$store.getters.getAccountLoginInfoAll.CanViewStores : this.dataForm.storeId,
        roleId: this.dataForm.roleId// 角色id
      }
      console.log(parmet)
      this.dataListLoading = true
      API.adminUser.adminUserList(parmet).then(response => {
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
            // onClose: () => { // }
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
            // onClose: () => { // }
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
