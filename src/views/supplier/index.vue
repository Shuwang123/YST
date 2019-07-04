<template>
  <div class="mod-supplier">
    <el-form :inline="true" :model="dataForm" @submit.native.prevent="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.Name" placeholder="供应商名称" clearable @clear="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" icon="el-icon-plus">新增供应商</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      border stripe
      :height="$store.state.documentClientIFRMAE"
      v-loading="dataListLoading"
      :header-cell-style="$cxObj.tableHeaderStyle"
      style="width: 100%;">
      <el-table-column :align="$store.state.common.align" type="index" label="序号" width="50px"></el-table-column>
      <!--<el-table-column type="selection" header-align="center" :align="$store.state.common.align" width="50"></el-table-column>-->
      <!--<el-table-column prop="Id" header-align="center" :align="$store.state.common.align" width="50" label="ID"></el-table-column>-->

      <el-table-column prop="Code" header-align="center" :align="$store.state.common.align" width="100" label="编码"></el-table-column>
      <el-table-column prop="ShortName" header-align="center" :align="$store.state.common.align" label="供应商"></el-table-column>
      <el-table-column prop="Name" header-align="center" :align="$store.state.common.align" label="厂家"></el-table-column>
      <el-table-column prop="Contact" header-align="center" :align="$store.state.common.align" label="联系人"></el-table-column>
      <el-table-column prop="Phone" header-align="center" :align="$store.state.common.align" label="联系电话"></el-table-column>
      <!--<el-table-column prop="QQ" header-align="center" :align="$store.state.common.align" label="QQ"></el-table-column>-->
      <!--<el-table-column prop="SupplierType" header-align="center" :align="$store.state.common.align" label="类型"></el-table-column>-->
      <el-table-column header-align="center" :align="$store.state.common.align" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"
                     @click="addOrUpdateHandle(scope.row.Code)">编辑
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
import AddOrUpdate from './add-or-update'
import API from '@/api'
import { formatDate } from '@/utils/validate'
export default {
  name: 'supplier',
  components: {
    AddOrUpdate
  },
  data () {
    return {
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载v-loading
      pageSize: 13,
      pageIndex: 1,
      totalPage: 1,
      dataForm: {
        Name: ''},
      dataList: []
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      var parmet = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: true,
        name: this.dataForm.Name,
        Code: ''}
      this.dataListLoading = true
      API.supplier.getSupplierList(parmet).then(response => {
        if (response.code === '0000') {
          if (response.data) {
            this.dataList = response.data
          }
          this.totalPage = response.total
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val // this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    addOrUpdateHandle (Code) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(Code)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-supplier {
    margin:10px;
    .el-pagination {
      margin-top: 15px;
      text-align: left;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
