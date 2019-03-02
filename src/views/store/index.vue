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
      </el-form-item>
    </el-form>

    <el-table
      :height="$store.state.documentClientIFRMAE"
      :data="dataList"
      border stripe=""
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
      <el-table-column prop="code" header-align="center" align="center" width="100px" label="门店编码"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="门店名称"></el-table-column>
      <el-table-column prop="phone" header-align="center" align="center" label="电话号码"></el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间">
        <!--<template slot-scope="scope">-->
          <!--<span>-->
          <!--{{ scope.row.createdOn |formatDate}}-->
          <!--</span>-->
        <!--</template>-->
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
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {formatDate} from '@/utils/validate'
import { mapGetters } from 'vuex'
export default {
  components: {
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
      storePayInfoVisible: false,
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
    getDataList () {
      const _this = this
      var parmet = {'storeCode': this.dataForm.storeCode, 'storeName': this.dataForm.storeName, pageIndex: this.pageIndex, pageSize: this.pageSize}
      _this.dataListLoading = true
      API.store.storeAll(parmet).then(response => {
        if (response.code === '0000') {
          _this.dataList = response.data.storeList
          _this.totalPage = response.paging.totalCount
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
