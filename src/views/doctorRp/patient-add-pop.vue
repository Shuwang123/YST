<template>
  <div class="ownScrollbar" style="margin-left:50px;min-height: 400px;max-height: 600px;overflow-y: scroll;">
    <el-row><!--<el-col>A B C D E ...</el-col>--></el-row>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" size="small" :inline="true">
      <el-form-item label="姓名" prop="UserName" style="margin-top: 15px">
        <el-input v-model="dataForm.UserName" placeholder="请输入姓名" style="width: 160px"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="Sex" style="margin-top: 15px">
        <el-radio-group v-model="dataForm.Sex" style="width: 144px">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="BirthDate" style="margin-top: 15px">
        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="dataForm.BirthDate" placeholder="请选择出生日期" style="width: 160px"></el-date-picker>

        <el-input v-model="dataForm.BirthDateAge" placeholder="只读" style="width: 60px" disabled></el-input>
        <el-select v-model="dataForm.BirthDateUnit" style="width: 66px;margin-right: 10px" disabled>
          <el-option label="岁" value="1"></el-option>
          <el-option label="月" value="0"></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="电话" prop="MobilePhone" style="margin-top: 15px">
        <el-input v-model="dataForm.MobilePhone" placeholder="请输入电话" style="width: 160px"></el-input>
      </el-form-item>

      <el-form-item label="病例史" prop="AllergyHistory" style="margin-top: 15px">
        <el-input v-model="dataForm.AllergyHistory" placeholder="请输入病例史" style="width: 413px"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="Address" style="margin-top: 15px">
        <el-input v-model="dataForm.Address" placeholder="详细地址" style="width: 413px"></el-input>
      </el-form-item>
      <!--<el-form-item label="地址" prop="SalePrice">-->
      <!--<el-input v-model="dataForm.SalePrice" placeholder="请选择区级地址"></el-input>-->
      <!--</el-form-item>-->
    </el-form>

    <div style="text-align: right; margin-top: 210px">
      <el-button @click="$store.commit('setRegisterStep', 2); $emit('childEven')">返回</el-button>
      <el-button type="primary" @click=" $store.commit('setRegisterStep', 2); dataFormSubmit()">新增</el-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {calcAge} from '@/utils/validate'
import {Currency, Phone} from '../../utils/validate'
// import {treeDataTranslate} from '@/utils'
export default {
  data () {
    return {
      // visible: false,
      dataListLoading: false, // 加载
      dataForm: {
        UserName: '',
        Sex: '1',
        BirthDate: '',
        BirthDateAge: '',
        BirthDateUnit: '1', // 必须是str类型的
        MobilePhone: '',
        AllergyHistory: '', // 病例史
        Address: ''
      },
      dataRule: {
        UserName: Currency('此为必填项'),
        BirthDate: Currency('此为必填项'),
        MobilePhone: Phone(1)
      },
      dataList: null
    }
  },
  watch: {
    'dataForm.BirthDate': function (val, oldval) {
      if (val === null) {
        this.dataForm.BirthDateUnit = '1'
        this.dataForm.BirthDateAge = ''
      } else {
        var allAge = calcAge(val) // !!!!!!这得到18岁 或 10月 1月
        if (allAge.substr(allAge.length - 1) === '月') {
          this.dataForm.BirthDateUnit = '0'
        } else if (allAge.substr(allAge.length - 1) === '岁') {
          this.dataForm.BirthDateUnit = '1'
        }
        this.dataForm.BirthDateAge = allAge.substring(0, allAge.length - 1) // !!!!!!只取数不要单位，其实也可以parseInt
      }
    }
  },
  methods: {
    child () {
      this.$emit('childEven')
    },
    // 获取某个采购单详情info
    init () {},
    handleClose () {
      this.dataForm = {
        UserName: '',
        Sex: '1',
        BirthDate: '',
        BirthDateAge: '',
        BirthDateUnit: '1', // 必须是str类型的
        MobilePhone: '',
        AllergyHistory: '', // 病例史
        Address: ''
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var paramsAdd = {
            StoreId: this.$store.getters.getAccountCurrentHandleStore,
            UserName: this.dataForm.UserName,
            Sex: this.dataForm.Sex,
            BirthDate: this.dataForm.BirthDate,
            MobilePhone: this.dataForm.MobilePhone,
            AllergyHistory: this.dataForm.AllergyHistory,
            Address: this.dataForm.Address
          }
          console.log(paramsAdd)
          API.member.addMemberSubmit(paramsAdd).then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: `${'添加患者成功'}`,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  // this.visible = false
                  this.$emit('childEven')
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    }
    // ,
    // addOrUpdateHandle3 (id, type) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id, type)
    //   })
    // }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.ownScrollbar::-webkit-scrollbar,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  width: 7px;
}
.ownScrollbar::-webkit-scrollbar-thumb,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background-color: #DDDEE0;
}
.ownScrollbar::-webkit-scrollbar-track,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
