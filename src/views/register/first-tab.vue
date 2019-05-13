<template>
  <div class="storeStock-first-tab">
    <!--chenxiHeight命名法-->
    <!--<div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">-->
      <!--<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->
        <!--&lt;!&ndash;<el-form-item label="">个人想法，因为门店的医生没筛选，所以这儿可能留着做input search&ndash;&gt;-->
          <!--&lt;!&ndash;<el-select v-model="dataForm.Order" placeholder="排序" size="mini" clearable style="width: 120px">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-option v-for="item in OrderArr" :key="item.text" :label="item.text" :value="item.val"></el-option>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-form-item>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-button icon="el-icon-search" @click="pageIndex = 1; getDataList()" size="mini">查询</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
      <!--</el-form>-->
    <!--</div>-->
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column prop="StoreName" header-align="center" align="center" label="门店" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="NickName" header-align="center" align="center" label="医生" width="100"></el-table-column>
      <!--<el-table-column prop="" label="可挂号/已挂号" width="" header-align="center" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.Id}}/{{scope.row.Id}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="Phone" header-align="left" align="left" label="时间（全天）" width="" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="Phone" header-align="center" align="center" label="医生联系电话" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="190" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" plain
                     @click="addOrUpdateHandle(scope.row)">挂号</el-button>
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
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></first-tab-add-or-update>

    <input type="button" id="tts_btn" @click="doTTS()" value="播放"><div id="bdtts_div_id">
    <audio id="tts_autio_id" autoplay="autoplay">
      <source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=1 2 3" type="audio/mpeg">
      <embed id="tts_embed_id" height="0" width="0" src="">
    </audio>
  </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatDate } from '@/utils/validate'
import API from '@/api'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import { mapGetters } from 'vuex'
export default {
  name: 'stockFirst',
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 333, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      pageIndex: 1,
      pageSize: 10,
      totalPage: 1,
      IsPaging: true,
      dataForm: {
        RedLine: ''
      },
      dataList: []
    }
  },
  components: { FirstTabAddOrUpdate },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 333 // 273 测试老半天
    }
  },
  methods: {
    doTTS () {
      document.getElementById('tts_autio_id').play()
    },
    // 这个是查询某门店的：全部医生列表
    getDataList () {
      this.dataListLoading = true
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.IsPaging,
        // id: this.fatherDataForm.AccountId,
        id: '',
        userName: '',
        nickName: '',
        roleId: '',
        canViewStores: this.$store.getters.getAccountCurrentHandleStore
      }
      console.log(params)
      API.adminUser.adminUserList(params).then(response => {
        if (response.code === '0000') {
          if (response.data) { this.dataList = response.data }
          this.totalPage = response.total
          console.log(this.dataList)
        } else {
          this.$message.error(response.message)
        }
        this.dataListLoading = false
      })
      // API.register.getDoctors(params).then(result => {
      //   console.log('ajsdj')
      //   if (result.code === '0000') {
      //     this.dataList = result.data
      //     this.totalPage = result.total
      //   } else {
      //     this.$message.error(result.message)
      //   }
      //   this.dataListLoading = false
      // })
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
    addOrUpdateHandle (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    },
    handelDelete (id) {
      this.$confirm(`确定对[id=${id}]的行导出excel表格吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
