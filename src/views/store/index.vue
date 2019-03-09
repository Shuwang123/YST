<template>
  <div class="mod-store">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.storeName" placeholder="门店名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.storeCode" placeholder="门店编码" clearable></el-input>
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
      <el-table-column prop="Id" header-align="center" align="center" label="ID" width="50"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" width="100px" label="门店编码"></el-table-column>
      <el-table-column prop="Name" header-align="center" align="center" label="门店名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="FullName" header-align="center" align="center" label="统一地区" width="100"></el-table-column>
      <el-table-column prop="Address" header-align="center" align="center" label="详细地址" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Contact" header-align="center" align="center" label="联系人" width="100"></el-table-column>
      <el-table-column prop="Phone" header-align="center" align="center" label="电话号码" width="150"></el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOn | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="190" header-align="center" align="center">
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
    <!--"LicenseCode": null,-->
    <!--"NickName": null,-->
    <!--"IsSettingLicenseCode": "空"   这三个返回的不知道干啥的，没有使用-->

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
import API from '@/api'
import {formatDate} from '@/utils/validate'
import { mapGetters } from 'vuex'
import AddOrUpdate from './add-or-update'

export default {
  components: {
    AddOrUpdate
  },
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  name: 'store',
  data () {
    return {
      dataListSelections: [],

      storePayInfoVisible: false, // ?????这是卅子
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      pageSize: 10,
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
      this.dataListSelections = val
    },
    getDataList () {
      const _this = this
      var parmet = {name: this.dataForm.storeName, code: this.dataForm.storeCode, pageIndex: this.pageIndex, pageSize: this.pageSize, isPaging: true}
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
