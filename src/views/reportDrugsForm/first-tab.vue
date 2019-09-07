<template>
  <div class="storeStock-first-tab">
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column header-align="center" align="center" label="门店 / 品牌" min-width="80" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <!--<span>{{scope.row.StoreName}} / {{scope.row.BrandName}}</span>-->
          <span>{{scope.row.StoreName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="ProductId" header-align="center" align="center" label="商品ID" min-width="100"></el-table-column>-->
      <!--<el-table-column prop="CategoryId" header-align="center" align="center" label="分类ID" min-width="100"></el-table-column>-->
      <el-table-column prop="ProductCode" header-align="center" align="center" label="商品编码" min-width="80"></el-table-column>
      <el-table-column prop="CategoryName" header-align="center" align="center" label="分类" min-width="80"></el-table-column>
      <el-table-column prop="ProductName" header-align="center" align="center" label="商品名称" min-width="100" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="Quantity" header-align="center" align="center" label="总数量" min-width="100"></el-table-column>
      <el-table-column prop="YBQuantity" header-align="center" align="center" label="医保数量" min-width="100"></el-table-column>
      <el-table-column prop="ZFQuantity" header-align="center" align="center" label="自费数量" min-width="100"></el-table-column>
      <el-table-column prop="StoreSalePrice" header-align="center" align="center" label="门店价格" min-width="100"></el-table-column>
      <!--<el-table-column prop="" label="操作" width="150" header-align="center" align="center">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="mini" @click="addOrUpdateHandle(scope.row.Id)">查看</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="prev, pager, next, jumper, sizes, total" background>
    </el-pagination>
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></first-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import { mapGetters } from 'vuex'
import {calcAge} from '@/utils/validate'

export default {
  components: { FirstTabAddOrUpdate },
  name: 'stockFirst',
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 303, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载

      pageIndex: 1,
      pageSize: 50,
      IsPaging: true,
      value6: [],

      dataList: [],
      totalPage: 1
    }
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
    }
  },
  methods: {
    // 这个是查询某门店当日的：患者全部挂号列表
    getDataList () {
      this.dataListLoading = true
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.IsPaging,
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店Id（必须）
        StartDay: this.fatherDataForm.StartDate, // 开始时间
        EndDay: this.fatherDataForm.EndDate, // 结束时间

        ProductCodeOrBarCode: this.fatherDataForm.ProductCodeOrBarCode,
        ProductName: this.fatherDataForm.ProductName,
        CategoryId: this.fatherDataForm.CategoryId
      }
      // 获取挂号列表
      // console.log(params)
      API.report.getDrugsUseReport(params).then(result => {
        if (result.code === '0000') {
          // console.log(result.data)
          this.dataList = result.data
          this.totalPage = result.total
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
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
    addOrUpdateHandle (formId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(formId)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
