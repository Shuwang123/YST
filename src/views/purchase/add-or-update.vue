<template>
  <div class="mod-purchase-child">
    <el-dialog
      v-dialogDrag
      :title="'商品导入'"
      :close-on-click-modal="false"
      :visible.sync="visible" @close="handleClose">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="0" :inline="true">
        <el-form-item label="" prop="CategoryText">
          <el-radio-group v-model="dataForm.CategoryText" size="mini" @change="categoryTextHandle">
            <el-radio-button v-for="item in drugsCategoryList" :key="item.id"
                             :label="item.text" :disabled="!clickOk"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" prop="SpellName">
          <el-input v-model="dataForm.SpellName" placeholder="拼音搜索" size="mini" clearable>
            <el-button slot="append" icon="el-icon-search" @click="drugsSearch()"></el-button>
          </el-input>
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
          <el-table-column prop="Code" header-align="center" :align="$store.state.common.align" width="100" label="商品编码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="ShowName" header-align="center" :align="$store.state.common.align" label="药材名称"></el-table-column>
          <el-table-column prop="Specification" header-align="center" :align="$store.state.common.align" label="规格" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="Unit" header-align="center" :align="$store.state.common.align" label="单位"></el-table-column>
          <el-table-column prop="RedLine" header-align="center" :align="$store.state.common.align" label="预警量" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
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
      pageSize: 10,
      totalPage: 0,

      dataRule: {
        SpellName: Letter()
      },
      drugsCategoryList: [], // 先请求药品种类列表
      dataForm: {
        SpellName: '',
        CategoryId: '', // 先请求药品种类
        CategoryText: ''
      },
      dataList: [],
      dataListSelections: [],
      purchaseRegistered: [], // 采购单注册记名列表
      isInit: true,
      clickOk: true
    }
  },
  watch: {
    dataList (n, o) {
      this.$nextTick(() => {
        this.ownPurchaseFatherList = this.ownPurchaseFatherList.length > 0 ? this.ownPurchaseFatherList : this.purchaseFatherList
        this.dataList.forEach(item => {
          // console.log('这儿执行就有问题')
          this.ownPurchaseFatherList.forEach(row => {
            if (item.Code === row.Code) {
              this.$refs.tableChild.toggleRowSelection(item, true) // 默认初始isInit勾选
            }
          })
        })
        this.isInit = false
        // }
      })
    }
    // SpellName (val) {
    //   this.dataForm.SpellName = val
    //   this.$nextTick(() => {
    //     this.getDataList()
    //   })
    // }
  },
  methods: {
    init (id) {
      this.getDataList()
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryList = result.data
          this.dataForm.CategoryText = this.drugsCategoryList[0].text
          this.dataForm.CategoryId = this.drugsCategoryList[0].id
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val // this.pageIndex = 1
      this.isInit = true
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.isInit = true
      this.getDataList()
    },
    drugsSearch () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isInit = true
          this.getDataList()
        }
      })
    },
    getDataList () {
      this.dataListLoading = true
      API.drugs.getDrugsList({name: '', PageIndex: this.pageIndex, PageSize: this.pageSize, IsPaging: 'true', SpellName: this.dataForm.SpellName, CategoryId: this.dataForm.CategoryId}).then(result => {
        if (result.code === '0000' && result.data.length > 0) {
          this.dataList = result.data
          this.totalPage = result.total
          if (this.dataListViews.length === 0) {
            this.dataListViews = this.dataListViews.concat(result.data) // 会打散拼接到尾巴，旧数组不变
          } else if (this.dataListViews.some(item => item.Code === result.data[0].Code || item.Code === result.data[this.pageSize - 1]).Code) {
            this.dataListViews = this.dataListViews.concat([])
          } else {
            this.dataListViews = this.dataListViews.concat(result.data)
          }
        } else {
          this.$message({
            message: '查询结果为空',
            type: 'warning',
            duration: 3000
          })
        }
        this.dataListLoading = false
      })
      this.visible = true
    },

    selectionChangeHandle (val) {
      this.dataListSelections = val
      console.log(val)
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
          console.log(this.ownPurchaseFatherList)
        })
      }
    },
    handleClose () {
      // this.$refs['dataForm'].resetFields()
      // this.dataForm.Id = ''
      this.ownPurchaseFatherList = []
      this.isInit = true // 儿豁，这个true这一句，精神处于崩溃边缘
    },
    categoryTextHandle (text) {
      this.clickOk = false
      this.drugsCategoryList.forEach(item => {
        if (item.text === text) {
          this.dataForm.CategoryId = item.id
          console.log(item.id)
          this.isInit = true
          this.getDataList()
          var time = setTimeout(() => { // 切换的时候如果点太快，貌似循环太多运行不够快的情况下会有些冲突的漏洞产生，所以弄了个0.5s的禁用间隔
            this.clickOk = true
            clearTimeout(time)
          }, 500)
        }
      })
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
  &-purchase-child {
    margin:10px;
    & /deep/ .el-dialog {width: 70%}
    & /deep/ .el-dialog__body {padding: 0 20px}
    & /deep/ .purchaseTableRowClass {
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
