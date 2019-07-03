<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <com-store :paramsFather="{
          'label_0': '',
          'size_1': '',
          'width_2': '130px',
          'clear_3': false,
          'multiple_4': false,
          'must_5': true,
          'isTrigger': true
        }" ref="comStoreOne" @eventStore="changeStoreData"></com-store>
      <el-form-item>
        <el-select v-model="dataForm.roleId" placeholder="请选择角色" @change="getDataList()">
          <el-option v-for="item in roleArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-input v-model="dataForm.userName" placeholder="查询账号" clearable @clear="getDataList()"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-input v-model="dataForm.nickName" placeholder="请输入医生姓名" clearable @clear="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      border stripe
      :height="$store.state.documentClientIFRMAE"
      v-loading="dataListLoading"
      :header-cell-style="$cxObj.tableHeaderStyle"
      style="width: 100%;">
      <el-table-column type="index" label="序号" :align="$store.state.common.align" width="50px"></el-table-column>
      <el-table-column prop="StoreName" header-align="center" :align="$store.state.common.align" label="所属门店" width="100" :show-tooltip-when-overflow="true"></el-table-column>
      <el-table-column prop="NickName" header-align="center" align="center" label="医生" min-width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="RoleName" header-align="center" :align="$store.state.common.align" label="角色" min-width="100"></el-table-column>
      <el-table-column prop="Phone" header-align="center" :align="$store.state.common.align" label="联系电话" min-width="119"></el-table-column>
      <el-table-column label="操作" width="260" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row.Id)">排班编辑
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
      dataList: [],

      countRefresh: 1 // 非主流写法
    }
  },
  created () {
    this.initID()
  },
  methods: {
    // 公用门店下拉子组件的想option改变时，父组件的storedId也变化
    changeStoreData (choseStoreId) {
      // this.getDataList() 需手动点击查询按钮了，有点缺陷，暂时这样吧，毕竟切换门店的情况本身就很少 ？？？？？？？？？？？？？？
    },
    initID () {
      API.role.jueseList({PageIndex: 1, PageSize: 1000, IsPaging: true}).then(result => {
        if (result.code === '0000') {
          result.data.forEach(item => {
            if (item.Name.includes('医生')) {
              this.roleArr.push({name: item.Name, id: item.Id})
            }
          })
          this.dataForm.roleId = this.roleArr[0].id
          this.getDataList()
        }
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
        canViewStores: this.$store.getters.getAccountCurrentHandleStore, // 名店id 传递''返回全部（相对自己的权限内），不是传递0
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
    // 编辑 医生排班
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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
