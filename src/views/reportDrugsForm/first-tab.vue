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

    <!--导出excel功能-->
    <table ref="myExportExcel" style="display: none">
      <tr>
        <th v-for="val in thArr" v-text="val"></th>
      </tr>
      <tr v-for="item in dataList">
        <!--<td v-for="val in item">{{val}}</td>-->
        <td v-text="item.StoreName"></td>
        <td v-text="item.ProductId"></td>
        <td v-text="item.ProductCode"></td>
        <td v-text="item.ProductName"></td>
        <td v-text="item.CategoryId"></td>
        <td v-text="item.CategoryName"></td>
        <td v-text="item.Quantity"></td>
        <td v-text="item.YBQuantity"></td>
        <td v-text="item.ZFQuantity"></td>
        <td v-text="item.StoreSalePrice"></td>
      </tr>
    </table>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import { mapGetters } from 'vuex'
import {calcAge} from '@/utils/validate'
import {myExportExcel} from '@/utils'

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
      totalPage: 1,
      thArr: ['门店','商品Id','商品编码','商品名称','分类编码','分类名称','销售总量','医保数量','自费数量','门店价格']
    }
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
    }
  },
  methods: {
    handleDownload() {
      if (!this.dataList.length) {
        this.$alert('没有任何数据，无法导出! ', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }

      // 先输入表格名称
      this.$prompt('请输入Excel表名（不填默认为sheet）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.*/,
        inputErrorMessage: '未输入表名'
      }).then(({ value }) => {
        // console.log(value) 这有点懵逼，为什么value变量换成name，得到undefined，脑壳痛啥子哟？？？
        myExportExcel(this.$refs.myExportExcel, value) // 需要传入两个参数，一个table的dom节点，还有表格名称
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导出Excel操作'
        })
      })

      // 别的实现方法
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
      //   // const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
      //   const list = this.list
      //   // const data = this.formatJson(filterVal, list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     list,
      //     filename: this.filename,
      //     autoWidth: this.autoWidth,
      //     bookType: this.bookType
      //   })
      // })
    },
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
          console.log(result.data)
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
