<template>
  <div class="mod-purchase-child">
    <el-dialog
      v-dialogDrag
      :title="'商品导入'"
      :close-on-click-modal="false" width="970px"
      :visible.sync="visible"
      @close="handleClose">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="0" :inline="true">
        <el-form-item label="" prop="SpellName">
          <el-input v-model="dataForm.SpellName" placeholder="拼音搜索" @keyup.enter.native="drugsSearch()"
                    size="mini" clearable @clear="drugsSearch()"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="dataForm.Order" placeholder="排序" clearable @change="drugsSearch()" size="mini" style="width: 120px">
            <el-option v-for="item in orderArr" :key="item.text" :label="item.text" :value="item.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="drugsSearch()" size="mini">搜索</el-button>
        </el-form-item>
        <br>
        <el-table
          :data="dataList" ref="tableChild"
          border stripe
          :height="450"
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          :header-cell-style="$cxObj.tableHeaderStyle40px"
          row-class-name="purchaseTableRowClass"
          style="width: 100%;">
          <el-table-column type="selection" header-align="center" :align="$store.state.common.align" width="50"></el-table-column>
          <el-table-column :align="$store.state.common.align" type="index" label="序号" width="50px"></el-table-column>
          <el-table-column prop="CategoryName" header-align="center" :align="$store.state.common.align" width="100" label="药态" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="Code" header-align="center" :align="$store.state.common.align" width="100" label="商品编码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column header-align="center" :align="$store.state.common.align" label="药材名称">
            <template slot-scope="scope">
              <span :style="{color: scope.row.Quantity < scope.row.RedLine ? '#e4393c' : '#333'}">{{ scope.row.ShowName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Dosage" header-align="center" :align="$store.state.common.align" label="剂型" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="Specification" header-align="center" :align="$store.state.common.align" label="规格" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="Unit" header-align="center" :align="$store.state.common.align" label="单位" :show-overflow-tooltip="true"></el-table-column>
          <!--<el-table-column prop="Unit" header-align="center" :align="$store.state.common.align" label="单位"></el-table-column>-->
          <el-table-column header-align="center" :align="$store.state.common.align" label="库存 (余量)" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span :style="{color: scope.row.Quantity < scope.row.RedLine ? '#e4393c' : '#333'}">{{ scope.row.Quantity }}</span>
            </template>
          </el-table-column>
          <!--<el-table-column prop="CostPrice" header-align="center" :align="$store.state.common.align" label="上一次的进价" width="116"></el-table-column>-->
          <el-table-column prop="RedLine" header-align="center" :align="$store.state.common.align" label="预警量" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[50, 100, 150]"
          :page-size="pageSize"
          :total="totalPage"
          layout="prev, pager, next, jumper, sizes, total">
        </el-pagination>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
// import {treeDataTranslate} from '@/utils'
import {Letter} from '../../utils/validate'
export default {
  props: ['purchaseFatherList'],
  data () {
    return {
      ownPurchaseFatherList: [], // 所有勾选过的的商品 分页记忆
      dataListViews: [], // 所有看过的商品 分页记忆

      visible: false,
      dataListLoading: false, // 加载v-loading
      pageIndex: 1,
      pageSize: 100,
      totalPage: 0,
      orderArr: [{
        text: '库存减预警（小到大）',
        val: 'LeftRedLineAsc'
      }, {
        text: '库存减预警（大到小）',
        val: 'LeftRedLineDesc'
      }],

      categoryId: '',
      storeId: '',

      dataRule: {
        SpellName: Letter()
      },
      drugsCategoryList: [], // 先请求药品种类列表
      dataForm: {
        SpellName: '',
        Order: ''
        // CategoryId: ''
      },
      dataList: [],
      dataListSelections: [],
      // purchaseRegistered: [], // 入库单注册记名列表
      isInit: true
    }
  },
  watch: {
    dataList (n, o) {
      this.$nextTick(() => {
        this.ownPurchaseFatherList = this.ownPurchaseFatherList.length > 0 ? this.ownPurchaseFatherList : this.purchaseFatherList
        // console.log(this.ownPurchaseFatherList)
        this.dataList.forEach(item => {
          // console.log('这儿执行就有问题')
          this.ownPurchaseFatherList.forEach(row => {
            if (item.Code === row.Code) {
              this.$refs.tableChild.toggleRowSelection(item, true) // 默认初始isInit勾选
            }
          })
        })
        this.isInit = false
      })
    }
  },
  methods: {
    init (id0, id1) {
      this.categoryId = id0
      this.storeId = id1
      // debugger
      this.getDataList(this.categoryId, this.storeId)
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val // this.pageIndex = 1
      this.isInit = true
      this.getDataList(this.categoryId, this.storeId)
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.isInit = true
      this.getDataList(this.categoryId, this.storeId)
    },
    drugsSearch () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isInit = true
          this.getDataList(this.categoryId, this.storeId)
        }
      })
    },
    getDataList (categoryid, storeid) {
      this.dataListLoading = true
      // ※ 为什么给注释了呢：本来打算弄门店库存接口（可根据库存量勾选），但后来还是用的老创建药材列表界面的获取接口
      // API.storeStock.getStoreStock({ // 药材来源门店库存
      //   PageIndex: this.pageIndex,
      //   PageSize: this.pageSize,
      //   IsPaging: 'true',
      //   SupplierId: '',
      //   StoreId: storeid, // 父组件传递（用于请求对应门店自身的库存列表）且必填项!!!
      //   CategoryId: categoryid, // 父组件传递
      //
      //   SpellName: this.dataForm.SpellName, // 子组件的input
      //   ProductName: '', // 子组件的input
      //   RedLine: '', // 子组件的input
      //
      //   BrandId: '', // 品牌ID 忽略
      //   ProductCodeOrBarCode: '', // 商品编码 忽略
      //   Order: '' //
      API.drugs.getDrugsList({
        Name: '',
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: 'true',
        SpellName: this.dataForm.SpellName,
        CategoryId: categoryid,
        StoreId: storeid, // 传不传门店id决定了是否返回库存余量!!!
        CodeOrBarCode: '', // 多个商品编码,查询
        Order: this.dataForm.Order, // 排序  ---LeftRedLineDesc  LeftRedLineAsc库存量-警告值 排序
        WebStatus: 1
      }).then(result => {
        if (result.code === '0000' && result.data.length > 0) {
          this.dataList = result.data
          this.totalPage = result.total
          // console.log(result.data)
          if (this.dataListViews.length === 0) {
            this.dataListViews = this.dataListViews.concat(result.data) // 会打散拼接到尾巴，旧数组不变
          } else if (this.dataListViews.some(item => item.Code === result.data[0].Code || item.Code === result.data[this.pageSize - 1]).Code) {
            this.dataListViews = this.dataListViews.concat([])
          } else {
            this.dataListViews = this.dataListViews.concat(result.data)
          }
        } else {
          // this.$message({ message: '查询结果为空', type: 'warning', duration: 3000 })
          this.dataList = []
          this.$message({ message: `${result.message}`, type: 'warning', duration: 3000 })
        }
        this.dataListLoading = false
      })
      this.visible = true
    },

    selectionChangeHandle (val) {
      this.dataListSelections = val
      if (this.isInit === false) {
        if (this.ownPurchaseFatherList.length !== 0) { // 先删
          this.dataList.forEach(row => {
            this.ownPurchaseFatherList = this.ownPurchaseFatherList.filter(item => {
              return item.Code !== row.Code
            })
          })
        }
        val.forEach(item => {
          this.ownPurchaseFatherList.push(item)
        })
      }
    },
    handleClose () {
      // this.dataList = [] 这两行注释的还不能写，不然又有bug，你可以把注释取消了看看
      // this.dataListViews = []
      this.ownPurchaseFatherList = []
      this.isInit = true // 儿豁，这个true这一句，精神处于崩溃边缘
    },
    // 表单提交
    dataFormSubmit () {
      this.$confirm(`确定将此次勾选的商品纳入采购列表?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var fatherChecked = this.ownPurchaseFatherList // 因为父组件传递给子组件的值vue官网不推荐直接修改
        if (fatherChecked.length !== 0) { // 假如首次导入，父组件传递的选中列表就为空，那么就不执行删除而跳过此语句
          this.dataListViews.forEach(row => {
            fatherChecked = fatherChecked.filter(item => {
              return item.Code !== row.Code
            })
          })
        }
        this.ownPurchaseFatherList.forEach(item => {
          fatherChecked.push(item)
        })
        this.$emit('refreshDataList', fatherChecked)
        this.visible = false
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-purchase-child /deep/ {
    margin:10px;
    .el-dialog {width: 70%}
    .el-dialog__body {padding: 0 20px}
    .purchaseTableRowClass {
      height: 30px;
      line-height: 30px;
    }
    .el-pagination {
      margin-top: 5px;
      margin-left: -15px;
      text-align: left;
    }
  }
}
</style>
