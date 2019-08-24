<template>
  <el-dialog
    v-dialogDrag
    :title="'协定方列表'"
    width="1100px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <div v-if="show3" class="ownScrollbar" style="min-height: 400px;max-height: 600px;">
      <!--协定方查询输入框-->
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="">
          <el-input v-model="dataForm.PrescriptionName" placeholder="请输入处方名" size="mini"
                    @clear="getDataList()" clearable style="width: 117px"></el-input>
        </el-form-item>
        <!--<el-form-item label="">-->
          <!--<el-input v-model="dataForm.MobilePhone" placeholder="请输入协定方主治、功效" size="mini" clearable style="width: 171px"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button @click="getDataList()" size="mini">查询</el-button>
          <el-button type="primary" size="mini" @click="dataForm.PrescriptionName = ''; getDataList()">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :height="'450'"
        :data="dataList"
        stripe
        v-loading="dataListLoading"
        row-class-name="all-row"
        :header-cell-style="$cxObj.tableHeaderStyle30px"
        style="width: 100%;">
        <el-table-column prop="Id" header-align="center" align="center" label="ID" width="60" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Code" header-align="center" align="center" label="编码" min-width="100"></el-table-column>
        <el-table-column prop="PrescriptionName" header-align="center" align="center" label="处方名" min-width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="CategoryOneName" header-align="center" align="center" label="一级药态" min-width="110" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="MainCure" header-align="center" align="center" label="主治" min-width="110"></el-table-column>
        <el-table-column prop="Effect" header-align="center" align="center" label="功效" min-width="110"></el-table-column>
        <el-table-column prop="DrugRate" header-align="center" align="center" label="用法" min-width="110"></el-table-column>
        <el-table-column prop="Explain" header-align="center" align="center" label="说明" min-width="110"></el-table-column>
        <el-table-column header-align="center" align="center" label="更新时间" min-width="119">
          <template slot-scope="scope">
            <span>{{ scope.row.CreatedOnTime | myDateFilter('MM-dd hh:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="80" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" plain @click="child(scope.row.Id)">
              载入协定方</el-button>
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
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {calcAge} from '@/utils/validate'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
export default {
  props: ['indexDoctorId'],
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
        MobilePhone: '',
        PrescriptionName: ''
      },
      totalPage: 1,

      dataList: null,
      show3: true,
      num: 40,
      Category: '-2' // 一级药态 1内服2外用3制膏4水丸5水蜜丸
    }
  },
  methods: {
    child (agreementId) {
      this.visible = false
      this.$emit('childAgreementEven', agreementId)
    },
    getDataList () {
      this.dataListLoading = true
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.isPaging,
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店Id（必须）
        Code: '', // 挂号单
        UserName: '', // 患者姓名
        MobilePhone: '', // 患者电话
        AccountId: this.num === '40' ? this.indexDoctorId : '', // 账户Id,医生Id 如果是经典方，那是属于门店，不需要绑定医生id；而协定方是绑定给医生id+门店的
        WrokFrom: '', // 开始时间
        WrokTo: '', // 结束时间
        Status: '1,2,3,5,6', // -1作废（已废除的协定方不查询）1初始 2只支付挂号费 待就诊（候诊）3已就诊-待收费 5已收费6已发货  -2全部 ''表示协定方
        OrderType: this.num, // 40表示协定方 41表示经典方
        PrescriptionName: this.dataForm.PrescriptionName,
        CategoryOne: this.Category // 药态一级分类 1内服2外用3制膏4水丸5水蜜丸 -2的时候就是请求全部协定方或者全部经典方
      }
      // console.log(params)
      API.register.getRegisterList(params).then(result => { // 获取协定方列表
        if (result.code === '0000') {
          this.dataList = result.data.map(item => {
            // item.BirthDate = calcAge(item.BirthDate)
            return item
          })
          this.totalPage = result.total
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
      })
    },
    // 获取某个采购单详情info
    init (typeNum, Category) {
      this.num = typeNum
      this.Category = Category
      this.visible = true
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
    handleClose () {
      this.editType = ''
      this.isAddActive = false
      this.dataForm = {
        UserName: '',
        MobilePhone: '',
        PrescriptionName: ''
      }
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
