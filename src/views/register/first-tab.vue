<template>
  <div class="storeStock-first-tab">
    <!--chenxiHeight命名法-->
    <!--<div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">-->
      <!--<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->
        <!--&lt;!&ndash;<el-form-item label="">&ndash;&gt;-->
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
      @selection-change="selectionChangeHandle"
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column prop="ProductCode" header-align="center" align="center" label="医生" width=""></el-table-column>
      <el-table-column prop="ProductName" header-align="center" align="center" label="可挂号人数" width=""></el-table-column>
      <el-table-column prop="StoreName" header-align="left" align="left" label="已就挂号人数" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="StoreName" header-align="left" align="left" label="时间（全天）" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain
                     @click="addOrUpdateHandle(scope.row)">挂号
          </el-button>
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
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataListChild"></first-tab-add-or-update>
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
      IsPaging: true,

      OrderArr: [
        {text: '库存从大-->小', val: 'Quantity'},
        {text: '暂用量或可使用量排序', val: 'OccupyQuantityUsableQuantity'}
      ], // 先请求供应商数组
      dataForm: {
        RedLine: '',
        BrandId: '', // 品牌ID
        Order: '' // 按照分别按照Quantity, OccupyQuantityUsableQuantity排序
      },
      dataList: [],
      totalPage: 1,
      dataListSelections: []
    }
  },
  components: { FirstTabAddOrUpdate },
  created () {
    this.getDataList()
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 333 // 273 测试老半天
    }
  },
  methods: {
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    getDataList () {
      this.dataListLoading = true
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.IsPaging,
        StoreId: this.fatherDataForm.StoreId, // 门店ID
        ProductCodeOrBarCode: this.fatherDataForm.ProductCodeOrBarCode, // 产品编码
        ProductName: this.fatherDataForm.ProductName, // 产品名称
        SpellName: this.fatherDataForm.SpellName,

        // SupplierId: this.dataForm.SupplierId, // 供应商
        RedLine: this.dataForm.RedLine,
        CategoryId: this.fatherDataForm.CategoryId === '10' ? '' : this.fatherDataForm.CategoryId,
        BrandId: this.dataForm.BrandId,
        Order: this.dataForm.Order
      }
      API.storeStock.getStoreStock(params).then(result => {
        if (result.code === '0000') {
          this.dataList = result.data
          this.totalPage = result.total
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
      })
    },
    getDataListChild () {
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
    addOrUpdateHandle (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
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
