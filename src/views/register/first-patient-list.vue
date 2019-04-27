<template>
  <div v-if="show3" class="ownScrollbar" style="min-height: 400px;max-height: 600px;overflow-y: scroll;">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="">
        <el-input v-model="dataForm.UserName" placeholder="姓名" size="mini" clearable style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="dataForm.MobilePhone" placeholder="患者电话" size="mini" clearable style="width: 120px"></el-input>
      </el-form-item>
      <el-form-item>
        <!--<el-button icon="el-icon-search" @click="getDataList()" size="mini">查询</el-button>-->
        <el-button type="primary" size="mini" @click="dataForm.UserName = ''; dataForm.MobilePhone = ''; getDataList()">重置</el-button>
        <el-button type="warning" @click="show3 = !show3; addOrUpdateHandle3(); $store.commit('setRegisterStep', 3)" size="mini">新建患者</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :height="'450px'"
      :data="dataList"
      stripe
      v-loading="dataListLoading"
      row-class-name="storeStockListRow"
      :header-cell-style="$cxObj.tableHeaderStyle30px"
      style="width: 100%;">
      <el-table-column prop="Id" header-align="center" align="center" label="ID" width="50" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="UserName" header-align="center" align="center" label="姓名" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="性别" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.Sex === 1">男</span>
          <span v-else-if="scope.row.Sex === 2">女</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" :align="$store.state.common.align" label="年龄(岁)" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.BirthDate | getAge}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="MobilePhone" header-align="center" align="center" width="150" label="电话"></el-table-column>
      <el-table-column prop="Address" header-align="left" align="left" label="地址" width="" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="" label="操作" width="80" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" plain @click="child(scope.row); $store.commit('setRegisterStep', 1)">载入</el-button>
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
  </div>
  <div v-else-if="!show3">
    <first-patient-add v-if="addOrUpdateVisible" ref="addOrUpdate" @childEven="father003"></first-patient-add>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {formatDate} from '@/utils/validate'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
// import {treeDataTranslate} from '@/utils'
import FirstPatientAdd from './first-patient-add'
export default {
  components: { FirstPatientAdd },
  filters: {
    getAge (time) {
      var age = formatDate(new Date(time.substring(6, time.length - 2) * 1), 'yyyy-MM-dd')
      var now = formatDate(new Date(), 'yyyy-MM-dd')
      var nowArr = now.split('-')
      var ageArr = age.split('-')
      // if (nowArr[0] - ageArr[0] >= 1) { console.log(nowArr[0] - ageArr[0]) }
      return `${nowArr[0] - ageArr[0]}`
    }
  },
  data () {
    return {
      visible: false,
      dataListLoading: false, // 加载
      Id: '',

      pageSize: 10,
      pageIndex: 1,
      isPaging: true,
      dataForm: {
        UserName: '',
        StoreId: 0,
        MobilePhone: ''
      },
      totalPage: 1,

      dataList: null,
      show3: true
    }
  },
  methods: {
    child (row) {
      this.$emit('childEven', row)
    },
    father003 () {
      this.show3 = !this.show3
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.isPaging,
        UserName: this.dataForm.UserName,
        StoreId: this.StoreId,
        MobilePhone: this.dataForm.MobilePhone
      }
      API.member.getMemberList(params).then(result => {
        if (result.code === '0000') {
          this.dataList = result.data
          this.totalPage = result.total
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
      })
    },
    // 获取某个采购单详情info
    init (storeId) {
      this.visible = true
      if (storeId === 0) {
        this.getDataList()
      }
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
    handleClose () {
    },

    dataFormSubmitB () { // 入库的提交 批次号
      if (this.dataList.Items.some(item => item.ProductBatchNo === 0 || item.ProductBatchNo === '' || item.ProductBatchNo === null)) {
        this.$alert('请把批次号填完!', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      var params = {
        Code: this.dataList.Code,
        Id: this.dataList.Id,
        Remark: this.dataList.Remark,
        Items: JSON.stringify(this.dataList.Items.map(item => {
          return {
            Id: item.Id, // 这是详情id，上面那个A的是药材ID
            ActualQuantity: item.Quantity,
            productBatchNo: item.ProductBatchNo
          }
          // "[{\"Id\":96,\"ActualQuantity\":1,\"productBatchNo\":123123}, ]       }))
        }))
      }
      console.log(params)
      API.purchase.editBatchNo(params).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `编辑${result.message}`,
            duration: 1000
          })
          this.$emit('refreshDataList')
          this.visible = false
        } else {
          this.$message({
            type: 'error',
            message: `${result.message}`,
            duration: 1000
          })
        }
      })
    },
    addOrUpdateHandle3 (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.ownScrollbar /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  width: 7px;
}
.ownScrollbar /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background-color: #DDDEE0;
}
.ownScrollbar /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
