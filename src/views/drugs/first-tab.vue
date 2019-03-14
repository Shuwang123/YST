<template>
  <div class="first-tab">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.drugsName" placeholder="药名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.drugsSpell" placeholder="拼音" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.CategoryId" placeholder="药品种类" clearable>
          <el-option v-for="item in drugsCategoryList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()" icon="el-icon-plus">新建药品</el-button>
      </el-form-item>
    </el-form>

    <!-- chenxiHeight命名法 -->
    <el-table
      :height="chenxiHeight"
      :data="dataList"
      border stripe :row-class-name="$cxObj.tableRowClassName"
      v-loading="dataListLoading"
      :header-cell-style="$cxObj.tableHeaderStyle40px"
      style="width: 100%;">
      <el-table-column type="index" label="排序" align="center" width="50"></el-table-column>
      <el-table-column prop="CategoryName" header-align="center" align="center" label="种类" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Code" header-align="center" align="center" label="编码" width="100" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="Id" header-align="center" align="center" label="ID" width="50"></el-table-column>-->
      <el-table-column header-align="center" align="center" label="药典" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="color: #409EFF;text-decoration: underline">{{scope.row.Name}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="库存" width="100" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="color: #409EFF;text-decoration: underline">{{scope.row.ShowName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="SpellName" header-align="center" align="center" width="80" label="拼音"></el-table-column>
      <el-table-column prop="Keywords" header-align="center" align="center" label="别名" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Unit" header-align="center" align="center" label="单位" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Specification" header-align="center" align="center" label="规格" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="CostPrice" header-align="center" align="center" label="进货单价" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="SalePrice" header-align="center" align="center" label="零售价" width="" :show-overflow-tooltip="true"></el-table-column>

      <!--<el-table-column prop="BrandName" header-align="center" align="center" label="物品" width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <!--<el-table-column prop="StoreName" header-align="center" align="center" label="仓库" width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <!--<el-table-column prop="ContractPrice" header-align="center" align="center" label="合同价" width="80" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="RedLine" header-align="center" align="center" label="预警量" :show-overflow-tooltip="true"></el-table-column>
      <!--<el-table-column prop="WebStatus" header-align="center" align="center" label="状态" width="100" :show-overflow-tooltip="true"></el-table-column>-->
      <el-table-column prop="WebStatusName" header-align="center" align="center" label="状态" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
        <template slot-scope="scope">
          <span style="padding-right: 6px;border-right: 1px solid #ccc"><el-button type="text" @click="addOrUpdateHandle(scope.row.Id)">编辑</el-button></span>
          <span><el-button type="text" @click="handelShelf(scope.row.Id)">下架</el-button></span>
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
import { mapGetters } from 'vuex'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
export default {
  name: 'drugs',
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 273, // 心累，不要动
      drugsCategoryList: [], // 先请求药品种类

      storePayInfoVisible: false, // 这个未发现用处
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载

      pageSize: 20,
      pageIndex: 1,
      totalPage: 1,
      dataForm: {
        drugsName: '',
        drugsSpell: '',
        CategoryId: '' // 中草药全部、只饮片、只颗粒、只精品
      },
      dataList: []
    }
  },
  components: { FirstTabAddOrUpdate },
  created () { this.getDrugsCategory() },
  mounted () {
    this.getDataList()
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 273 // 273 测试老半天的值，苦逼，重新整理vue的计算属性和属性监听玩法
    }
  },
  methods: {

    // 先请求药品种类提供给下拉列表
    getDrugsCategory () {
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryList = result.data
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





    // 删除
    handelShelf (id) {
      // var dataJSON = {ids: ids.join()}
      // this.$confirm(`确定对[ids=${ids.join()}]进行[${id === undefined ? '批量删除' : '删除'}]操作?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   console.log(dataJSON.ids)
      //   API.store.deleteSubmit(dataJSON).then((result) => {
      //     if (result.code === '0000') {
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!',
      //         duration: 1000,
      //         onClose: () => {
      //           this.getDataList()
      //         }
      //       })
      //     } else {
      //       this.$message.error(result.message)
      //     }
      //   })
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
