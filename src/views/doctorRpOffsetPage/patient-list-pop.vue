<template>
  <el-dialog
    v-dialogDrag
    :title="$store.getters.getRegisterStep === 1 ? '挂号信息填写' : $store.getters.getRegisterStep === 2 ? '门店患者调用' : '建立新的患者'"
    width="778px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <div class="ownScrollbar" style="min-height: 400px;max-height: 600px;">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="">
          <el-input v-model="dataForm.UserName" placeholder="姓名" size="mini" @clear="getDataList()" clearable style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="dataForm.MobilePhone" placeholder="患者电话" size="mini" @clear="getDataList()" clearable style="width: 120px"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-button icon="el-icon-search" @click="getDataList()" size="mini">查询</el-button>-->
          <!--<el-button type="primary" size="mini" @click="dataForm.UserName = ''; dataForm.MobilePhone = ''; getDataList()">重置</el-button>-->
          <el-button icon="el-icon-search" size="mini" @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table
              :height="'450'"
              :data="dataList"
              stripe
              v-loading="dataListLoading"
              row-class-name="all-row"
              :header-cell-style="$cxObj.tableHeaderStyle30px"
              style="width: 100%;">
        <!--<el-table-column prop="Id" header-align="center" align="center" label="ID" width="50" :show-overflow-tooltip="true"></el-table-column>-->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="Code" header-align="left" align="center" label="病历号" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="UserName" header-align="center" align="center" label="姓名" width="80" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column header-align="center" :align="$store.state.common.align" label="性别" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.Sex === 1">男</span>
            <span v-else-if="scope.row.Sex === 2">女</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" :align="$store.state.common.align" label="年龄" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.BirthDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="MobilePhone" header-align="center" align="center" width="150" label="电话"></el-table-column>
        <el-table-column prop="Address" header-align="left" align="left" label="地址" width="" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="" label="操作" width="80" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" plain @click="child(scope.row); $store.commit('setRegisterStep', 1)">
              载入</el-button>
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
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import API from '@/api'
  import {calcAge} from '@/utils/validate'
  export default {
    data () {
      return {
        visible: false,
        dataListLoading: false, // 加载
        Id: '',

        pageSize: 20,
        pageIndex: 1,
        isPaging: true,
        dataForm: {
          UserName: '',
          MobilePhone: ''
        },
        totalPage: 1,

        dataList: null
      }
    },
    methods: {
      child (row) {
        this.visible = false
        this.$emit('childEven', row)
      },
      getDataList () {
        this.dataListLoading = true
        var params = {
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
          IsPaging: this.isPaging,
          UserName: this.dataForm.UserName,
          StoreId: this.$store.getters.getAccountCurrentHandleStore,
          MobilePhone: this.dataForm.MobilePhone
        }
        API.member.getMemberList(params).then(result => {
          if (result.code === '0000') {
            this.dataList = result.data.map(item => {
              item.BirthDate = calcAge(item.BirthDate)
              return item
            })
            this.totalPage = result.total
          } else {
            this.$message.error(result.message)
          }
          this.dataListLoading = false
        })
      },
      // 获取某个采购单详情info
      init () {
        this.visible = true
        this.getDataList()
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
      handleClose () {
        this.editType = ''
        this.isAddActive = false
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .ownScrollbar /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    width: 0;
  }
  .ownScrollbar:hover /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    width: 7px;
  }
  .ownScrollbar /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    background-color: #DDDEE0;
  }
  .ownScrollbar /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: inset 0 0 5px rgba(0,0,0,0);
    background-color: rgba(0,0,0,0);
  }
</style>
