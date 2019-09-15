<template>
  <div class="storeStock-first-tab">
    <!--chenxiHeight命名法-->
    <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <!--<el-form-item>-->
          <!--<el-input v-model="dataForm.RedLine" placeholder="预警量" size="mini" clearable style="width: 120px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-input v-model="dataForm.CategoryId" placeholder="药品种类" size="mini" clearable style="width: 120px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-input v-model="dataForm.BrandId" placeholder="品牌ID" size="mini" clearable style="width: 120px"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="">
          <el-select v-model="dataForm.Order" placeholder="排序" @change="getDataList()"
                     size="mini" clearable
                     style="width: 120px">
            <el-option v-for="item in orderArr" :key="item.text" :label="item.text" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="pageIndex = 1; getDataList()" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- :default-sort = "{prop: 'RedLine', order: 'ascending'}-->
    <!--<el-form :inline="true" @keyup.enter.native="getDataList()">-->
    <el-table
      @selection-change="selectionChangeHandle"
      :height="chenxiHeight"
      :data="dataList"
      border highlight-current-row @current-change="handleCurrentChange"
      v-loading="dataListLoading"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;"
      @filter-change="tableColumnFilter"
      @cell-dblclick="anyCellDblclick">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="门店："><span>{{ scope.row.StoreName }}</span></el-form-item>
            <el-form-item label="药品编码："><span>{{ scope.row.ProductCode }}</span></el-form-item>
            <el-form-item label="药名："><span>{{ scope.row.ProductName }}</span></el-form-item>
            <el-form-item label="余量："><span>{{ scope.row.Quantity }}</span></el-form-item>
            <el-form-item label="单价："><span>{{ scope.row.StoreSalePrice }}</span></el-form-item>
            <el-form-item label="预警值："><span>{{ scope.row.RedLine }}</span></el-form-item>
            <el-form-item label="药态："><span>{{ scope.row.CategoryName }}</span></el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column prop="StoreName" header-align="left" align="left" label="门店" width="70" :show-overflow-tooltip="true"></el-table-column>

      <!--20190901 使用者觉得这的药态查询不显眼，改成头部的下拉了选药态了-->
      <!--<el-table-column prop="CategoryName" header-align="center" align="center"-->
                       <!--label="药态" width="70" :show-overflow-tooltip="true"-->
                       <!--column-key="CategoryId"-->
                       <!--:filters="categoryTypeArr" :filter-multiple="false"-->
                       <!--filter-placement="bottom">-->
                       <!--&lt;!&ndash;:filter-method="filterHandler"&ndash;&gt;-->
      <!--</el-table-column>-->
      <el-table-column prop="CategoryName" header-align="center" align="center"
                       label="药态" width="70" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="ProductCode" header-align="center" align="center" label="药品编码" width="90"></el-table-column>
      <!--<el-table-column prop="ProductName" header-align="center" align="center" label="药名" min-width="80"></el-table-column>-->
      <el-table-column header-align="center" align="center" label="药名" min-width="80">
        <template slot-scope="scope">
          <span :style="{color: scope.row.Quantity - scope.row.RedLine <= 0 ? '#e4393c' : ''}">{{scope.row.ProductName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="Status" header-align="center" align="center" label="没有厂商吧，所有厂商来货后都合并为一味药" width="" :show-overflow-tooltip="true"></el-table-column>-->

      <el-table-column prop="OccupyQuantity" header-align="center" align="center" label="锁定" min-width="80"></el-table-column>
      <el-table-column prop="UsableQuantity" header-align="center" align="center" label="可用" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="AvgCostPrice" header-align="center" align="center" label="成本 (avg)" min-width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="center" label="成本 (avg)" width="120" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.AvgCostPrice.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="Amount" header-align="center" align="center" label="成本总价" min-width="80" :show-overflow-tooltip="true"></el-table-column>-->

      <!--<el-table-column prop="StoreSalePrice" header-align="center" align="center" label="门店售价" min-width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="center" label="门店售价" min-width="139" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-input-number v-if="scope.row.isDblclick===true"
                           @blur="tableInputBlur(scope.row)"
                           v-model="scope.row.StoreSalePrice" :precision="2"
                           :min="0.01" :step="0.10" :max="10000" size="mini"></el-input-number>
          <span v-else>{{Number(scope.row.StoreSalePrice).toFixed(2)}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column prop="SaleAmount" header-align="center" align="center" label="售价总价" min-width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="center" label="库存 (余量)" width="120" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span :style="{color: scope.row.Quantity - scope.row.RedLine <= 0 ? '#e4393c' : ''}">{{scope.row.Quantity}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="RedLine" header-align="center" align="center" label="预警值" width="100" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="ProfitPercent" header-align="center" align="center" label="毛利" width="100" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column header-align="center" align="center" label="操作" min-width="80" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="prev, pager, next, jumper, sizes, total" background>
    </el-pagination>
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataListChild"></first-tab-add-or-update>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import { mapGetters } from 'vuex'
export default {
  name: 'stockFirst',
  components: { FirstTabAddOrUpdate },
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 303, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      pageIndex: 1,
      pageSize: 20,
      IsPaging: true,

      dataForm: {
        CategoryId: '',
        RedLine: '',
        BrandId: '', // 品牌ID
        Order: '' // 按照---LeftRedLineDesc  LeftRedLineAsc库存量-警告值 排序
      },
      orderArr: [{
        text: '库存减预警（小到大）',
        val: 'LeftRedLineAsc'
      }, {
        text: '库存减预警（大到小）',
        val: 'LeftRedLineDesc'
      }],
      dataList: [],
      totalPage: 1,
      dataListSelections: [],
      categoryTypeArr: []
    }
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
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
        BrandId: this.dataForm.BrandId,

        // CategoryId: this.dataForm.CategoryId,
        CategoryId: this.fatherDataForm.CategoryId,
        Order: this.dataForm.Order
      }
      console.log(params)
      API.storeStock.getStoreStock(params).then(result => {
        if (result.code === '0000') {
          this.dataList = result.data.map(item => {
            item.RedLine = Number(item.RedLine)
            return item
          })
          this.totalPage = result.total
          console.log(result.data)

          API.drugs.getDrugsCategory().then(response => {
            if (response.code === '0000') {
              this.categoryTypeArr = response.data.map(item => {
                return {text: item.text, value: item.text, id: item.id}
              }).filter(obj => obj.id > 10)
              this.dataListLoading = false
            }
          })
        }
      })
    },
    // 当表格的某列的：筛选条件发生变化的时候会触发该事件，参数的值是一个对象，
    // 对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。
    tableColumnFilter (obj) { // obj = {CategoryId: [全部, 饮片, 颗粒, 三九...]}
      if (obj.CategoryId[0] === undefined) {
        this.dataForm.CategoryId = ''
      } else {
        this.categoryTypeArr.forEach(item => {
          if (item.value === obj.CategoryId[0]) {
            this.dataForm.CategoryId = item.id
          }
        })
      }
      this.getDataList()
    },
    // 某个单元格上双击时
    anyCellDblclick (row, column, cell, event) {
      // console.log(row, column, cell, event)
      if (column.label !== '门店售价') { return false }
      this.dataList.forEach(item => {
        if (item.ProductCode === row.ProductCode) {
          item.isDblclick = true
        }
      })
      this.dataList.push() // 双击后重新渲染，触发表格的重新布局
    },
    tableInputBlur (row) {
      // 先刷新前端的页面
      this.$set(row, 'isDblclick', false)
      // this.dataList.forEach(item => {
      //   if (item.Id === row.Id) { item.isDblclick = false }
      // })
      this.dataList.push()

      // 上面只是前端页面临时数据渲染了，其实服务器还没有更新的，之后悄悄的请求一次服务器
      API.storeStock.editStoreStockSalePrice({id: row.Id, storeSalePrice: row.StoreSalePrice}).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `操作成功`,
            duration: 3000
          }) // this.getDataList()
        }
      })
    },
    // // 切换药态列筛选状态
    // filterHandler (value, row, column) {
    //   this.categoryTypeArr.forEach(item => {
    //     if (item.value === value) {
    //       this.dataForm.CategoryId = item.id
    //     }
    //   })
    //   const property = column['property']
    //   return row[property] === value
    // },
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
    addOrUpdateHandle (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    },

    // 选中单行
    handleCurrentChange (val) {
      // this.currentRow = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.storeStock-first-tab /deep/ {
  .el-dialog__body {
    padding: 30px 50px;
  }
  p span {
    font-weight: 700;
  }
  .el-table__expand-icon {
    margin-top: 7px;
  }
  .demo-table-expand {
    label {
      width: 90px;
      text-align: right;
    }
    .el-form-item {
      color: #99a9bf;
      width: 26%;
      padding-left: 100px;
      margin-right: 0;
      margin-bottom: 0;
      span {
        color: #e4393c;
      }
    }
  }
}
</style>
