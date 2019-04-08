<template>
  <div class="mod-meun">
      <!--头部查询 搭配 新增 :model="dataForm" -->
        <el-form :inline="true" @submit.native.prevent="searchMenu">
        <el-form-item>
            <el-input v-model="objMenu.name" placeholder="菜单名称" clearable @keyup.prevent="searchMenu"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button icon="el-icon-search" @click="searchMenu">查询</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增菜单</el-button>
        </el-form-item>
        </el-form>
        <!--中间数据展示  v-loading="dataListLoading"-->
        <el-table
                :data="dataMenu"
                stripe border
                :height="$store.state.documentClientIFRMAE"
                :header-cell-style="$cxObj.tableHeaderStyle"
                style="width: 100%;text-align: center">
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
        <el-table-column type="index" label="患者名" width="100" header-align="center"></el-table-column>
        <el-table-column prop="Id" label="病例号" width="150" header-align="center"></el-table-column>
        <el-table-column prop="tel" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" min-width="50" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="num" label="挂单号" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <el-table-column prop="time" label="挂号时间" width="100" header-align="center"></el-table-column>
        <el-table-column prop="source" label="来源" width="100" header-align="center"></el-table-column>
        <el-table-column prop="doc" label="医生" width="150" header-align="center"></el-table-column>
        <el-table-column prop="stat" label="状态" width="150" header-align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="190" header-align="center" align="center">
            <template slot-scope="scope">
            <el-button type="primary" size="mini" plain icon="el-icon-edit"
                        @click="addOrUpdateHandle(scope.row)">编辑
            </el-button>
            <el-button type="danger" size="mini" plain icon="el-icon-delete"
                        @click="handelDelete(scope.$index, scope.row)">删除
            </el-button>
            </template>
        </el-table-column>
        </el-table>
        <!--底部分页器-->
        <div class="slz-footer">
        <el-pagination background :total="20"
            :current-page="objMenu.pageIndex" @current-change="getNewMenuList"
            :page-size="10" :page-sizes="[10,20,30,100]" @size-change="getNewPageSizes"
            layout="prev,pager,next,jumper,sizes,total">
        </el-pagination>
        </div>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import { treeDataTranslate } from '@/utils'
export default{
  data () {
    return {
      objMenu: {
        name: '',
        pageIndex: 2
      },
      dataMenu: [
        {
          name: '小弟舒',
          Id: '1',
          tel: '2',
          type: 3,
          num: '4',
          time: '5',
          source: '6',
          doc: '7',
          stat: '8'
        }
      ]
    }
  },
  methods: {
    searchMenu () {
      console.log('1233')
    },
    dataListLoading () {
      console.log('456')
    },
    getNewMenuList () {
      console.log('admin')
    },
    getNewPageSizes () {
      console.log('psd')
    }
  }
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
