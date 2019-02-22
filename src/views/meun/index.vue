<template>
  <div class="mod-meun">
    <!--头部查询 搭配 新增按钮-->
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增菜单</el-button>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="ID/菜单名字" v-model="input4" clearable>
          <template slot="append">搜索</template>
          <!--<el-button type="success">搜索</el-button>-->
        </el-input>
      </el-form-item>
    </el-form>
    <!--<el-table-->
      <!--:data="dataList"-->
      <!--border-->
      <!--v-loading="dataListLoading"-->
      <!--:height="$store.state.documentClientIFRMAE"-->
      <!--style="width: 100%;">-->
      <!--<el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>-->
      <!--<el-table-column label="名称" width="150">-->
        <!--<template slot-scope="scope">-->
          <!--<span @click.prevent="toggleHandle(scope.$index, scope.row)" :style="childStyles(scope.row)">-->
          <!--<i :class="iconClasses(scope.row)" :style="iconStyles(scope.row)"></i>-->
          <!--{{ scope.row.name }}-->
          <!--</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="parentName" header-align="center" align="center" width="120" label="上级菜单"></el-table-column>-->
      <!--<el-table-column prop="icon" header-align="center" align="center" label="图标">-->
        <!--<template slot-scope="scope">-->
          <!--<i :class="['fa-lg', scope.row.icon]"></i>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="type" header-align="center" align="center" label="类型">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>-->
          <!--<el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>-->
          <!--<el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="showOrder" header-align="center" align="center" label="排序号"></el-table-column>-->
      <!--<el-table-column prop="menuUrl" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="菜单URL"></el-table-column>-->
      <!--<el-table-column prop="perms" header-align="center" align="center" width="150" :show-overflow-tooltip="true" label="授权标识"></el-table-column>-->
      <!--<el-table-column header-align="center" align="center" width="200" label="操作">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button  type="primary" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>-->
          <!--<el-button  type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
    <!--中间数据展示-->
    <el-table :data="dataMenu"
              stripe border
              v-loading="dataListLoading"
              :height="$store.state.documentClientIFRMAE"
              style="width: 100%;text-align: center">
      <el-table-column prop="Id" label="ID" width="100" header-align="center"></el-table-column>
      <!--<el-table-column prop="" label="" width="100">-->
        <!--<template slot-scope="scope">-->
          <!--<el-checkbox v-model="checked">复选框</el-checkbox>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="Name" label="菜单名字" width="100" align="center"></el-table-column>
      <el-table-column prop="Url" label="菜单链接" min-width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Icon" label="图标" width="100" align="center"></el-table-column>
      <el-table-column prop="ParentId" label="父级ID" width="100" header-align="center"></el-table-column>
      <el-table-column prop="DisplayOrder" label="排序" width="100" header-align="center"></el-table-column>
      <el-table-column prop="UrlType" label="1表示菜单2表示按钮" width="150" header-align="center"></el-table-column>
      <el-table-column prop="" label="操作" width="200" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"
                     @click="handleEdit(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="" label="index自动" width="100" type="index" header-align="center"></el-table-column>
    </el-table>
    <!--底部分页器-->
    <div class="slz-footer">
      <el-pagination background :total="allMenus"
        :page-size="pageSize" :page-sizes="[1,2,10,20,30,100]" @size-change="getNewPageSizes"
        :current-page="pageIndex" @current-change="getNewMenuList"
        layout="prev,pager,next,jumper,sizes,total">
      </el-pagination>
    </div>
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
      input4: "",
      // 分页功能
      allMenus: 10,   // 表中数据总量
      pageIndex: 1,   // 当前页的索引
      pageSize: 1   // 每页的行数

    }
  },
  created () {
  },
  mounted () {
    this.getDataList();
    // this.getDataMenu();
    this.getNewMenuList();
  },
  methods: {
    // 根据页标pageIndex改变，而请求新的菜单数据
    getNewMenuList (val=1) {
      this.pageIndex = val;
      this.$http.post('/proxyApi/YstApiMenu/LoadData',{
        PageIndex:val,
        PageSize:this.pageSize,
        IsPaging:true
      },{emulateJSON:true}).then(result => {
        if (result.body.code == '0000') {
          this.allMenus = result.body.total;
          this.dataMenu = result.body.data;
        }
      });
    },
    // 根据页码pageSize改变，请求新的菜单数据，这个函数应该很少触发
    getNewPageSizes (val) {
      this.pageSize = val;
      this.$http.post('/proxyApi/YstApiMenu/LoadData',{
        PageIndex:this.pageIndex,
        PageSize:val,
        IsPaging:true
      },{emulateJSON:true}).then(result => {
        if (result.body.code == '0000') {
          this.allMenus = result.body.total;
          this.dataMenu = result.body.data;
        }
      });
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
.slz-footer {margin-top: 5px}
</style>
