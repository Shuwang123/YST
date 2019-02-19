<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button  type="primary" @click="addOrUpdateHandle()" icon="el-icon-plus">新增角色</el-button>
        <el-button  type="danger" @click="deleteHandle()" icon="el-icon-delete" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      :height="$store.state.documentClientIFRMAE"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column type="selection" header-align="center" :align="$store.state.common.align" width="50"></el-table-column>
      <el-table-column :align="$store.state.common.align" type="index" label="序号" width="50px"></el-table-column>
      <el-table-column prop="id" header-align="center" :align="$store.state.common.align" width="80" label="ID"></el-table-column>
      <el-table-column prop="name" header-align="center" :align="$store.state.common.align" label="角色名称"></el-table-column>
      <el-table-column prop="description" header-align="center" :align="$store.state.common.align" label="备注"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" width="180" label="创建时间">
        <template slot-scope="scope">
          <span>
             {{ scope.row.createdOn |formatDate}}
          </span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" width="200px" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
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
import {formatDate} from '@/utils/validate'
export default {
  name: 'role',
  data () {
    return {
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      pageSize: 10,
      pageIndex: 1,
      totalPage: 1,
      dataForm: {
        roleName: ''
      },
      dataList: [],
      dataListSelections: []
    }
  },
  filters: {
    formatDate (time) {
      if (!time) {
        return ''
      }
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    AddOrUpdate
  },
  computed: {
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 获取数据
    getDataList () {
      var parmet = {pageIndex: this.pageIndex, pageSize: this.pageSize, 'roleName': String(this.dataForm.roleName)}
      this.dataListLoading = true
      API.role.jueseList(parmet).then(response => {
        console.log(response)
        if (response.code === '0000') {
          if (response.data.roleList) {
            this.dataList = response.data.roleList
            console.log(this.dataList)
          }
          /* this.$message.success('数据加载成功！') */
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
    },
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(function (item) {
        return item.id
      })
      var dataJSON = {'roleIds': ids.join(',')}
      this.$confirm(`确定对[roleIds=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.role.roleDelete(dataJSON).then((data) => {
          if (data.code === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1000,
              onClose: () => {
                if (ids.length === this.dataList.length) {
                  if (this.pageIndex > 1) {
                    this.pageIndex--
                  } else {
                    this.dataList = []
                  }
                }
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-role {
    margin:10px;
    .el-pagination {
      margin-top: 15px;
      text-align: right;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
