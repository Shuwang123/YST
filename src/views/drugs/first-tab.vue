<template>
  <div class="first-tab">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.drugsName" placeholder="药材名称" clearable @clear="getDataList()" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.drugsSpell" placeholder="拼音首字母" clearable @clear="getDataList()" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.CategoryId" placeholder="药品种类" @change="getDataList()"
                   clearable @clear="getDataList()" style="width: 110px">
          <el-option v-for="item in drugsCategoryList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" icon="el-icon-plus">新建药品</el-button>
        <el-button type="danger" @click="handelShelfOff()" :disabled="this.dataListSelections.length <= 0">批量下架</el-button>
        <el-button type="success" @click="handelShelfOn()" :disabled="this.dataListSelections.length <= 0">批量上架</el-button>
        <el-button type="success" @click="importExcel()">批量导入</el-button>
      </el-form-item>
    </el-form>

    <!-- chenxiHeight命名法 -->
    <el-table
      @selection-change="selectionChangeHandle"
      :height="chenxiHeight"
      :data="dataList"
      border stripe
      v-loading="dataListLoading"
      :row-class-name="ownTableRowClassName"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      :cell-class-name="ownColumnStyle"
      style="width: 100%;" class="ownScrollbar">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column type="index" label="排序" align="center" width="50"></el-table-column>
      <el-table-column prop="CategoryName" header-align="center" align="left" label="种类" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="编码" width="85" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="Id" header-align="center" align="center" label="ID" width="50"></el-table-column>-->
      <el-table-column header-align="right" align="right" label="药典" width="70" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="text-decoration: underline">{{scope.row.Name}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="left" align="left" label="库存" width="70" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="text-decoration: underline">{{scope.row.ShowName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="left" align="left" label="拼音/别名" min-width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="">[{{scope.row.SpellName}}] {{scope.row.Keywords}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="Unit" header-align="center" align="center" label="单位" min-width="50" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Specification" header-align="center" align="center" label="规格" width="" :show-overflow-tooltip="true"></el-table-column>

      <!--<el-table-column header-align="center" align="center" label="进货价" min-width="70" :show-overflow-tooltip="true">-->
        <!--<template slot-scope="scope">-->
          <!--<span style="">{{scope.row.CostPrice.toFixed(2)}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column header-align="center" align="center" label="零售价" min-width="70" :show-overflow-tooltip="true">-->
        <!--<template slot-scope="scope">-->
          <!--<span style="">{{scope.row.SalePrice.toFixed(2)}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column prop="BrandName" header-align="center" align="center" label="物品" width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <!--<el-table-column prop="StoreName" header-align="center" align="center" label="仓库" width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <!--<el-table-column prop="ContractPrice" header-align="center" align="center" label="合同价" width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="RedLine" header-align="center" align="center" label="预警量" min-width="80" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="WebStatus" header-align="center" align="center" label="状态" width="50" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="WebStatusName" header-align="center" align="center" label="状态" min-width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <span style="padding-right: 12px;border-right: 1px solid #ccc;cursor: pointer">
            <span type="text" @click="addOrUpdateHandle(scope.row.Id)">编辑</span>
          </span>
          <span style="padding-left: 6px;cursor: pointer">
            <span v-if="scope.row.WebStatus === 1" type="text" @click="handelShelfOff(scope.row.Id)">下架</span>
            <span v-else-if="scope.row.WebStatus === 2" @click="handelShelfOn(scope.row.Id)">上架</span>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="prev, pager, next, jumper, sizes, total" background>
    </el-pagination>
    <first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></first-tab-add-or-update>
    <first-tab-excel v-if="excelPopVisible" ref="excelPop" @childExcel="getDataList"></first-tab-excel>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import { mapGetters } from 'vuex'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import FirstTabExcel from './first-tab-excel'
export default {
  name: 'drugs',
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 273, // 心累，不要动
      drugsCategoryList: [], // 先请求药品种类

      storePayInfoVisible: false, // 这个未发现用处
      addOrUpdateVisible: false,
      excelPopVisible: false,
      dataListLoading: false, // 加载

      pageSize: 100,
      pageIndex: 1,
      totalPage: 1,
      dataForm: {
        drugsName: '',
        drugsSpell: '',
        CategoryId: '' // 中草药全部、只饮片、只颗粒、只精品
      },
      dataList: [],
      dataListSelections: []
    }
  },
  components: {
    FirstTabAddOrUpdate,
    FirstTabExcel
  },
  created () { this.getDrugsCategory() },
  mounted () {
    this.getDataList()
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 273 // 273 测试老半天的值，苦逼，重新整理vue的计算属性和属性监听玩法
    }
  },
  methods: {
    selectionChangeHandle (val) {
      this.dataListSelections = val
      // console.log(this.dataListSelections)
    },
    // 先请求药品种类提供给下拉列表
    getDrugsCategory () {
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryList = result.data.slice(1)
        }
      })
    },
    getDataList () {
      var params = {
        name: this.dataForm.drugsName,
        SpellName: this.dataForm.drugsSpell,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: true,
        CategoryId: this.dataForm.CategoryId
      }
      this.dataListLoading = true
      API.drugs.getDrugsList(params).then(result => {
        if (result.code === '0000') {
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
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },

    // 下架 批量下架
    handelShelfOff (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => item.Id)
      var dataJSON = {ids: ids.join()}
      // console.log(dataJSON)
      this.$confirm(`确定对[ids=${ids.join()}]进行[${id === undefined ? '批量下架' : '下架'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(dataJSON.ids)
        API.drugs.drugsOff(dataJSON).then((result) => {
          if (result.code === '0000') {
            this.$message({
              type: 'success',
              message: '下架成功!',
              duration: 1000,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(result.message)
          }
        })
      })
    },
    // 上架 批量上架
    handelShelfOn (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => item.Id)
      var dataJSON = {ids: ids.join()}
      this.$confirm(`确定对[ids=${ids.join()}]进行[${id === undefined ? '批量上架' : '上架'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(dataJSON.ids)
        API.drugs.drugsOn(dataJSON).then((result) => {
          if (result.code === '0000') {
            this.$message({
              type: 'success',
              message: '上架成功!',
              duration: 1000,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(result.message)
          }
        })
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
      if (columnIndex === 5 || columnIndex === 4 || columnIndex === 11) {
        if (row.WebStatus === 1) {
          return 'highlightColumn'
        } else if (row.WebStatus === 2) {
          return 'dimColumn'
        }
      }
    },
    importExcel () {
      this.excelPopVisible = true
      this.$nextTick(() => {
        this.$refs.excelPop.init()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-table /deep/ {
  .on-row {
    color: #606266;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
  .off-row {
    color: #ccc;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
  .highlightColumn { color: #409EFF } /*这儿只管上架状态的列的样式，‘未上架的列的样式’ 干脆全跟着 ‘未上架的行的样式’ 混*/
}
</style>
