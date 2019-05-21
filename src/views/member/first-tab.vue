<template>
  <div class="first-tab">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <com-store :paramsFather="{
          'label_0': '',
          'size_1': '',
          'width_2': '130px',
          'clear_3': false,
          'multiple_4': false,
          'must_5': true,
          'isTrigger': true
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
      <el-table-column prop="StoreName" header-align="center" align="center" label="门店" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="病历号" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="UserName" header-align="center" align="center" label="姓名" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="性别" width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.Sex === 1">男</span>
          <span v-else-if="scope.row.Sex === 2">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="BirthDate" header-align="center" align="center" label="年龄" width="50" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="MobilePhone" header-align="center" align="center" width="110" label="电话"></el-table-column>
      <el-table-column prop="Address" header-align="left" align="left" label="地址" width="" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="AllergyHistory" header-align="left" align="left" label="过敏史" width="" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="center" label="创建时间" width="139">
        <template slot-scope="scope">
          <span>{{ scope.row.CreatedOn | myDateFilter('yyyy-MM-dd hh:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CreatedBy" header-align="center" align="center" label="创建人" width="65" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" align="center" label="更新时间" width="139">
        <template slot-scope="scope">
          <span>{{ scope.row.UpdatedOn | myDateFilter('yyyy-MM-dd hh:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="UpdatedBy" header-align="center" align="center" label="操作人" width="65" :show-overflow-tooltip="true"></el-table-column>
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
import {calcAge} from '@/utils/validate' // 自定义的计算年龄的方法，精确到月，至于精确到天，那种才生下来的娃，一个月不到不太可能中医
import { mapGetters } from 'vuex'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import ComStore from '../common/com-store'
export default {
  name: 'member',
  data () {
    return {
      dataListLoading: false, // 加载
      chenxiHeight: document.documentElement['clientHeight'] - 276, // 心累，不要动
      addOrUpdateVisible: false,

      pageSize: 10,
      pageIndex: 1,
      isPaging: true,
      dataForm: {
        UserName: '',
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
      this.chenxiHeight = document.documentElement['clientHeight'] - 276 // 273 测试老半天的值，苦逼，重新整理vue的计算属性和属性监听玩法
    }
  },
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      // if (isMultiple === false) { this.dataForm.StoreId = choseStoreId }
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      this.$nextTick(() => { // 因为门店切换后，属性监听，存给Vuex和session，最后这又从Vuex获得，整个流程不写$nextTick()的话，可能得到的是切换前的旧值哟
        var params = {
          StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店来源Vuex
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
            this.dataList = result.data.map(item => {
              item.BirthDate = calcAge(item.BirthDate) // 这个方法不要太懵逼哈，@utils/validate.js里的自定义方法
              return item
            })
            this.totalPage = result.total
          } else {
            this.$message.error(result.message)
          }
          this.dataListLoading = false
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
        this.$refs.addOrUpdate.init(id)
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
    & td .cell {
      height: 35px;
      line-height: 35px;
    }
  }
  & /deep/ .off-row {
    color: #ccc;
    & td {padding: 0;}
    & td .cell {
      height: 35px;
      line-height: 35px;
    }
  }
  & /deep/ .highlightColumn { color: #409EFF } /*这儿只管上架状态的列的样式，‘未上架的列的样式’ 干脆全跟着 ‘未上架的行的样式’ 混*/
}
</style>
