<template>
  <div class="mod-store">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.storeName" placeholder="门店名称" clearable @clear="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.storeCode" placeholder="门店编码" clearable @clear="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" icon="el-icon-plus">新增门店</el-button>
        <el-button type="danger" @click="handelDelete()" icon="el-icon-delete" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table
      @selection-change="selectionChangeHandle"
      :height="$store.state.documentClientIFRMAE"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      :header-cell-style="$cxObj.tableHeaderStyle"
      style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="Name" header-align="center" align="center" label="门店名称" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Id" header-align="center" align="center" label="门店ID" width="70"></el-table-column>
      <!--<el-table-column prop="Code" header-align="center" align="center" width="100px" label="门店编码"></el-table-column>-->
      <!--<el-table-column prop="FullName" header-align="right" align="right" label="地区" width="170" :show-overflow-tooltip="true"></el-table-column>-->
      <!--<el-table-column prop="Address" header-align="left" align="left" label="地址详情" width="170" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="left" label="地区：详细地址" min-width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.FullName}}：{{scope.row.Address}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Contact" header-align="center" align="center" label="联系人" min-width="100"></el-table-column>
      <el-table-column prop="Phone" header-align="center" align="center" label="联系电话" min-width="119"></el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOn | myDateFilter('yyyy-MM-dd hh:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" header-align="center" align="center" width="210">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"
                     @click="addOrUpdateHandle(scope.row.Id)">编辑
          </el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"
                     @click="handelDelete(scope.row.Id)">删除
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
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import { mapGetters } from 'vuex'
import AddOrUpdate from './add-or-update'

export default {
  components: {
    AddOrUpdate
  },
  name: 'store',
  data () {
    return {
      dataListSelections: [],

      storePayInfoVisible: false, // ?????这是卅子
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      pageSize: 13,
      pageIndex: 1,
      totalPage: 1,
      dataForm: {
        storeName: '',
        storeCode: ''
      },
      dataList: []
    }
  },
  created () {
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    selectionChangeHandle (val) {
      this.dataListSelections = val // 数组中元素就是row的信息
    },
    getDataList () {
      const _this = this
      var parmet = {
        name: this.dataForm.storeName,
        code: this.dataForm.storeCode,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPaging: true,
        canViewStores: '' // 普通管理员能拥有这个界面吗？如果有权限，那这个门店列表的展示又有判断了，会根据登陆接口获取当前账号的可控门店字段
        // (后端自动处理过了，当传递''时可以自动返回对应账号的上限个数的门店)
      }
      _this.dataListLoading = true
      API.store.storeAll(parmet).then(response => {
        if (response.code === '0000') {
          _this.dataList = response.data
          _this.totalPage = response.total
        } else {
          _this.$message.error(response.message)
        }
        _this.dataListLoading = false
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
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    handelDelete (id) {
      var ids = id ? [id] : this.dataListSelections.map(function (item) {
        return item.Id
      })
      var dataJSON = {ids: ids.join()}
      this.$confirm(`确定对[ids=${ids.join()}]进行[${id === undefined ? '批量删除' : '删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(dataJSON.ids)
        API.store.deleteSubmit(dataJSON).then((result) => {
          if (result.code === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功!',
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-store {
    margin: 10px;
    .el-pagination {
      margin-top: 15px;
      text-align: left;
    }
    .nav{
      position: absolute;
      width: 100%;
    }
  }
}
</style>
