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
        <el-select v-model="dataForm.Source" style="width: 110px" placeholder="选择来源"
                   @change="getDataList()" clearable @clear="getDataList()">
          <el-option v-for="item in memberOrigin" :key="item.lab"
                     :label="item.lab" :value="item.val">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.UserName" placeholder="患者姓名" clearable @clear="getDataList()" style="width: 110px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.MobilePhone" placeholder="患者电话" clearable @clear="getDataList()" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.UsersIntroducePeople" placeholder="患者介绍人" clearable @clear="getDataList()" style="width: 110px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle(undefined, 'Basics')" icon="el-icon-plus">新增会员</el-button>
      </el-form-item>
    </el-form>

    <!-- chenxiHeight命名法 -->
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column prop="Id" header-align="center" align="center" label="ID" width="50" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="StoreName" header-align="center" align="center" label="门店" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="病历号" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" align="center" label="姓名" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.UserName}} / {{scope.row.Sex === 1 ? '男' : '女'}} / {{scope.row.BirthDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="MobilePhone" header-align="center" align="center" min-width="110" label="电话"></el-table-column>
      <el-table-column prop="Points" header-align="center" align="center" min-width="100" label="当前积分"></el-table-column>
      <el-table-column prop="Address" header-align="center" align="center" label="地址" min-width="130" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="AllergyHistory" header-align="left" align="left" label="过敏史" width="" :show-overflow-tooltip="true"></el-table-column>-->

      <el-table-column prop="UsersIntroducePeople" header-align="center" align="center" label="介绍人" min-width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间 / 创建人" min-width="170">
        <template slot-scope="scope">
          <span>{{scope.row.CreatedOn | myDateFilter('yyyy-MM-dd hh:mm')}} / {{scope.row.UpdatedBy}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column header-align="center" align="center" label="更新时间 / 操作人" min-width="170">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.CreatedOn | myDateFilter('yyyy-MM-dd hh:mm')}} / {{scope.row.CreatedBy}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row.Id, 'Basics')">会员</el-button>
          <el-button type="text" @click="addOrUpdateHandle(scope.row.Id, 'integral')">积分</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 17, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="prev, pager, next, jumper, sizes, total" background>
    </el-pagination>
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></first-tab-add-or-update>
    <first-tab-add-or-update-flowing v-if="addOrUpdateVisibleFlowing" ref="addOrUpdateFlowing" @refreshDataListFlowing="getDataList"></first-tab-add-or-update-flowing>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {calcAge} from '@/utils/validate' // 自定义的计算年龄的方法，精确到月，至于精确到天，那种才生下来的娃，一个月不到不太可能中医
import { mapGetters } from 'vuex'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import FirstTabAddOrUpdateFlowing from './first-tab-add-or-update-flowing'
import ComStore from '../common/com-store'
export default {
  name: 'member',
  data () {
    return {
      dataListLoading: false, // 加载
      chenxiHeight: document.documentElement['clientHeight'] - 276, // 心累，不要动
      addOrUpdateVisible: false,
      addOrUpdateVisibleFlowing: false,

      pageSize: 17,
      pageIndex: 1,
      isPaging: true,
      dataForm: {
        UserName: '',
        MobilePhone: '',
        Source: '', // 患者来源
        UsersIntroducePeople: '' // 患者介绍人，查询
      },
      memberOrigin: [
        {lab: '医生介绍', val: '1'},
        {lab: '广告', val: '2'},
        {lab: '宣传单', val: '3'},
        {lab: '网络渠道', val: '4'},
        {lab: '美团', val: '5'},
        {lab: '熟人介绍', val: '6'},
        {lab: '其他', val: '20'}
      ],
      totalPage: 1,
      dataList: []
    }
  },
  components: {
    FirstTabAddOrUpdate,
    FirstTabAddOrUpdateFlowing,
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
          Source: this.dataForm.Source, // 患者来源
          UserName: this.dataForm.UserName,
          MobilePhone: this.dataForm.MobilePhone,
          UsersIntroducePeople: this.dataForm.UsersIntroducePeople, // 患者介绍人
          Code: this.dataForm.Code
        }
        // console.log(params)
        API.member.getMemberList(params).then(result => {
          if (result.code === '0000') {
            this.dataList = result.data.map(item => {
              item.BirthDate = calcAge(item.BirthDate) // @utils/validate.js里的自定义方法
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
    addOrUpdateHandle (id, popType) {
      if (popType === 'Basics') {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      } else if (popType === 'integral') {
        this.addOrUpdateVisibleFlowing = true
        this.$nextTick(() => {
          this.$refs.addOrUpdateFlowing.init(id)
        })
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
