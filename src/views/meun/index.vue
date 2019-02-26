<template>
  <div class="mod-meun">

    <!--头部查询 搭配 新增-->
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增菜单</el-button>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="菜单名称" v-model="input4" clearable prefix-icon="el-icon-search" @keyup.enter.native="searchMenu">
          <el-button slot="append" @click="searchMenu">查询</el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <!--中间数据展示-->
    <el-table :data="dataMenu"
              stripe border
              v-loading="dataListLoading"
              :height="$store.state.documentClientIFRMAE"
              style="width: 100%;text-align: center">
      <el-table-column prop="Id" label="ID" width="100" header-align="center"></el-table-column>
      <el-table-column prop="Name" label="菜单名字" width="100" align="center"></el-table-column>
      <el-table-column prop="Url" label="菜单链接" min-width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Icon" label="图标" :show-overflow-tooltip="true" width="100" align="center">
      </el-table-column>
      <el-table-column prop="ParentId" label="父级ID" width="100" header-align="center"></el-table-column>
      <el-table-column prop="DisplayOrder" label="排序" width="100" header-align="center"></el-table-column>
      <el-table-column prop="UrlType" label="1表示菜单2表示按钮" width="150" header-align="center"></el-table-column>
      <el-table-column prop="" label="操作" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"
                     @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"
                     @click="handleEdit(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--底部分页器-->
    <div class="slz-footer">
      <el-pagination background :total="allMenus"
        :page-size="pageSize" :page-sizes="[1,2,3,10,20,30,100]" @size-change="getNewPageSizes"
        :current-page="pageIndex" @current-change="getNewMenuList"
        layout="prev,pager,next,jumper,sizes,total">
      </el-pagination>
    </div>

    <!--子组件弹窗-->
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

      dataList: [],

      dataMenu: [],
      checked: false,

      // 查询菜单列表功能
      input4: '',

      // 分页功能
      allMenus: 10,   // 表中数据总量
      pageIndex: 1,   // 当前页的索引
      pageSize: 10,   // 每页的行数
      obj: {
        name: this.input4,
        PageIndex:this.pageIndex,
        PageSize:this.pageSize,
        IsPaging:true
      }

    }
  },
  mounted () {
    this.getDataList();
    // this.getDataMenu();
    this.getNewMenuList();
  },
  methods: {
    // 公用的请求方法(顶部查询，底部分页pageIndex、pageSize调用)
    postMenu () {
      // this.$http.post('/proxyApi/YstApiMenu/LoadData',{
      //   name: this.input4,
      //   PageIndex:this.pageIndex,
      //   PageSize:this.pageSize,
      //   IsPaging:true
      // },{emulateJSON:true}).then(result => {
      // API.permission.add(this.obj).then(result => {
      API.permission.add({
        name: this.input4,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: true
      }).then(result => {
        console.log(result.code)
        if (result.code === '0000') {
          this.allMenus = result.total
          this.dataMenu = result.data
          // console.log(result.total)
          // console.log(result.data)
          // console.log(result.message)
        }
      });
    },
    // 顶部查询菜单功能
    searchMenu () {
      if (this.input4.trim() == '') {
        this.$message({
          message: '查询关键字不能为空',
          type: 'warning',
          duration: 1000
        });
      }
      this.postMenu();
    },
    // 根据页标pageIndex改变请求新的菜单数据
    getNewMenuList (val=1) {
      this.pageIndex = val;
      this.postMenu();
    },
    // 根据页码pageSize改变请求新的菜单数据，这个函数应该很少触发
    getNewPageSizes (val) {
      this.pageSize = val;
      this.postMenu();
    },

    getDataMenu () {
      this.$http.get('/proxyApi/YstApiMenu/LoadMenu').then(result => {
        if (result.body.message == "success") {
          this.dataMenu = result.body.data;
          console.log(this.dataMenu);
        }
      })
    },
    getDataList () {
      this.dataMenu = []
      // API.permission.list().then(result => {
      // API.permission.add({
      //   name: this.input4,
      //   PageIndex: this.pageIndex,
      //   PageSize: this.pageSize,
      //   IsPaging: true
      // }).then(result => {
      //   console.log(result)
      //   if (result.data) {
      //     var tempdataList = treeDataTranslate(result.data.permissionList, 'id')
      //     console.log(tempdataList)
      //     tempdataList.sort((a, b) => {
      //       return a.showOrder - b.showOrder
      //     })
      //     this.dataMenu.push(...tempdataList)
      //   }
      // })
      this.postMenu()
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
.slz-footer {margin-top: 5px}
</style>
