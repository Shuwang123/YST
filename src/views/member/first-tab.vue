<template>
  <div class="first-tab">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <com-store :paramsFather="{
          'label_0': '',
          'size_1': '',
          'width_2': '130px',
          'clear_3': false,
          'disabled_4': !dataForm.View,
          'multiple_5': false
        }" ref="comStoreOne" @eventStore="changeStoreData"></com-store>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.UserName" placeholder="姓名" clearable style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.MobilePhone" placeholder="电话" clearable style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" icon="el-icon-plus">新增会员</el-button>
      </el-form-item>
    </el-form>

    <!-- chenxiHeight命名法 -->
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      :row-class-name="ownTableRowClassName"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      :cell-class-name="ownColumnStyle"
      style="width: 100%;">
      <el-table-column prop="Id" header-align="center" align="center" label="ID" width="50" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="StoreId" header-align="center" align="center" label="门店" width="50" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="StoreName" header-align="center" align="center" label="门店" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="病历号" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="UserName" header-align="center" align="center" label="姓名" width="60" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="性别" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.Sex === 1">男</span>
          <span v-else-if="scope.row.Sex === 2">女</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="年龄" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.BirthDate | getAge}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="MobilePhone" header-align="center" align="center" width="110" label="电话"></el-table-column>
      <el-table-column prop="Address" header-align="center" align="center" label="地址" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="AllergyHistory" header-align="center" align="center" label="过敏史" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="CreatedBy" header-align="center" align="center" label="创建人" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOn | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="更新时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.UpdatedOn | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="UpdatedBy" header-align="center" align="center" label="操作人" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row.Id)">编辑</el-button>
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
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></first-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {formatDate} from '@/utils/validate'
import { mapGetters } from 'vuex'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import ComStore from '../common/com-store'
export default {
  name: 'member',
  filters: {
    formatDate (time) {
      var day = new Date(time.substring(6, time.length - 2) * 1)
      return formatDate(day, 'yyyy-MM-dd hh:mm')
    },
    getAge (time) {
      var age = formatDate(new Date(time.substring(6, time.length - 2) * 1), 'yyyy-MM-dd')
      var now = formatDate(new Date(), 'yyyy-MM-dd')
      var nowArr = now.split('-')
      var ageArr = age.split('-')
      return `${nowArr[0] - ageArr[0]}`
    }
  },
  data () {
    return {
      dataListLoading: false, // 加载
      chenxiHeight: document.documentElement['clientHeight'] - 273, // 心累，不要动
      addOrUpdateVisible: false,

      pageSize: 10,
      pageIndex: 1,
      isPaging: true,
      dataForm: {
        UserName: '',
        View: true, // 是否显示门店筛选组件
        StoreId: '',
        MobilePhone: ''
      },
      totalPage: 1,
      dataList: []
    }
  },
  components: {
    FirstTabAddOrUpdate,
    ComStore
  },
  created () {
    this.getDataList()
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 273 // 273 测试老半天的值，苦逼，重新整理vue的计算属性和属性监听玩法
    }
  },
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.StoreId = choseStoreId
      }
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      this.$nextTick(() => {
        API.purchase.getLoginInfo().then(result => {
          if (result.code === '0000') {
            this.dataForm.View = result.data.View // 决定门店下拉禁用
            if (result.data.View === false) { // 如果是不可选择的单门店!!!
              this.$refs.comStoreOne.pageInit(result.data.StoreId) // 单选类型，多选类型，初始化下拉值
              this.dataForm.StoreId = result.data.StoreId
            } else { // 如果是可选择的多门店下拉
              // 下面这个API，只是因为loginInfo这个无法直接拿到contact等信息，不得不重新请求另一个接口而已
              API.store.storeAll({
                name: '',
                PageIndex: 1,
                PageSize: 1000,
                IsPaging: true,
                code: '',
                canViewStores: ''// 最初的考虑是单门店的：storeId = CanViewStores
              }).then(result => {
                if (result.code === '0000') {
                  this.dataForm.StoreId = this.dataForm.StoreId > 0 ? this.dataForm.StoreId : result.data[0].Id // 这有问题哈，归属门店难道一定排第一个吗
                  this.$refs.comStoreOne.pageInit(this.dataForm.StoreId)
                }
              })
            }

            this.$nextTick(() => {
              var params = {
                StoreId: this.dataForm.StoreId, // 所有门店传递0
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                IsPaging: this.isPaging,
                UserName: this.dataForm.UserName,
                MobilePhone: this.dataForm.MobilePhone,
                Code: this.dataForm.Code
              }
              console.log(params)
              API.member.getMemberList(params).then(result => {
                if (result.code === '0000') {
                  this.dataList = result.data
                  this.totalPage = result.total
                } else {
                  this.$message.error(result.message)
                }
                this.dataListLoading = false
              })
            })
          }
        })
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
        this.$refs.addOrUpdate.init(id, this.dataForm.StoreId)
      })
    },

    // 根据'未上架'状态，判断每行是高亮还是暗色
    ownTableRowClassName ({row, rowIndex}) {
      if (rowIndex >= 0 && row.WebStatus === 1) {
        return 'on-row'
      } else if (rowIndex >= 0 && row.WebStatus === 2) {
        return 'off-row'
      } else {
        return ''
      }
    },
    // 根据'未上架'状态和‘列标’，‘判断此列中的对应单元格’高亮还是暗色（返回的class是加载td上的，所以是一个一个的往td上加的就能控制，不像上面的行直接加给的tr，看清细节）
    ownColumnStyle ({row, column, rowIndex, columnIndex}) { // 0123开始columnIndex
      if (columnIndex === 4 || columnIndex === 5 || columnIndex === 15) {
        if (row.WebStatus === 1) {
          return 'highlightColumn'
        } else if (row.WebStatus === 2) {
          return 'dimColumn'
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-table {
  & /deep/ .on-row {
    color: #606266;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
  & /deep/ .off-row {
    color: #ccc;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
  & /deep/ .highlightColumn { color: #409EFF } /*这儿只管上架状态的列的样式，‘未上架的列的样式’ 干脆全跟着 ‘未上架的行的样式’ 混*/
}
</style>
