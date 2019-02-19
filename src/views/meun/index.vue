<template>
  <div class="mod-meun">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增菜单</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :height="$store.state.documentClientIFRMAE"
      style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column label="名称" width="150">
        <template slot-scope="scope">
          <span @click.prevent="toggleHandle(scope.$index, scope.row)" :style="childStyles(scope.row)">
          <i :class="iconClasses(scope.row)" :style="iconStyles(scope.row)"></i>
          {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="parentName" header-align="center" align="center" width="120" label="上级菜单"></el-table-column>
      <el-table-column prop="icon" header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <i :class="['fa-lg', scope.row.icon]"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="showOrder" header-align="center" align="center" label="排序号"></el-table-column>
      <el-table-column prop="menuUrl" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="菜单URL"></el-table-column>
      <el-table-column prop="perms" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="授权标识"></el-table-column>
      <el-table-column header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button  type="primary" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button  type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import isArray from 'lodash/isArray'
import API from '@/api'
import { treeDataTranslate } from '@/utils'
import AddOrUpdate from './add-or-update'
export default {
  name: 'meun',
  computed: {
  },
  components: {
    AddOrUpdate
  },
  data () {
    return {
      addOrUpdateVisible: false,
      dataListLoading: false,
      dataForm: {},
      menuList: [],
      dataList: []
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataList = []
      API.permission.list().then(data => {
        console.log(data)
        if (data.data) {
          var tempdataList = treeDataTranslate(data.data.permissionList, 'id')
          console.log(tempdataList)
          tempdataList.sort((a, b) => {
            return a.showOrder - b.showOrder
          })
          this.dataList.push(...tempdataList)
        }
      })
    },
    // 切换处理
    toggleHandle (index, row) {
      if (this.hasChild(row)) {
        this.dataList[index]._expanded = !this.dataList[index]._expanded
        if (this.dataList[index]._expanded) {
          this.dataList = this.dataList.splice(0, index + 1).concat(row.children).concat(this.dataList)
        } else {
          this.dataList = this.removeChildNode(this.dataList, row.id)
        }
      }
    },
    // 移除子节点
    removeChildNode (data, parentId) {
      var parentIds = isArray(parentId) ? parentId : [parentId]
      if (parentId.length <= 0) {
        return data
      }
      var ids = []
      for (var i = 0; i < data.length; i++) {
        if (parentIds.indexOf(data[i].parentId) !== -1 && parentIds.indexOf(data[i].id) === -1) {
          ids.push(data.splice(i, 1)[0].id)
          i--
        }
      }
      return this.removeChildNode(data, ids)
    },
    // 是否有list
    hasChild (row) {
      return (isArray(row.children) && row.children.length >= 1) || false
    },
    iconStyles (row) {
      return { 'visibility': this.hasChild(row) ? 'visible' : 'hidden' }
    },
    childStyles (row) {
      return { 'padding-left': (row._level > 1 ? row._level * 10 : 0) + 'px' }
    },
    iconClasses (row) {
      return [ !row._expanded ? 'el-icon-caret-right' : 'el-icon-caret-bottom' ]
    },
    addOrUpdateHandle (item) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(item)
      })
    },
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(function (item) {
        return item.id
      })
      var dataJSON = {'id': ids.join(',')}
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.permission.deletes(dataJSON).then(response => {
          if (response.code === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1000,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(response.message)
          }
        })
      })
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-meun {
    margin:10px;
  }
}
</style>
