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
        <el-button type="primary" @click="addOrUpdateHandle()" icon="el-icon-plus">新增角色</el-button>
        <el-button type="danger" @click="deleteHandle()" icon="el-icon-delete" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table
      @selection-change="selectionChangeHandle"
      :height="$store.state.documentClientIFRMAE"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" width="100px" label="门店编码"></el-table-column>
      <el-table-column prop="Name" header-align="center" align="center" label="门店名称"></el-table-column>
      <el-table-column prop="Address" header-align="center" align="center" label="门店地址"></el-table-column>
      <el-table-column prop="Contact" header-align="center" align="center" label="联系人"></el-table-column>
      <el-table-column prop="Phone" header-align="center" align="center" label="电话号码"></el-table-column>
      <el-table-column prop="FullName" header-align="center" align="center" label="城市"></el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOn |formatDate}}</span>
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
        console.log("觉得辣椒粉")
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
