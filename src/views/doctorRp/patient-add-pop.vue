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
      <el-form-item label="年龄" prop="BirthDateAge" style="margin-top: 15px">
        <el-input v-model="dataForm.BirthDateAge" @blur="stampCalc(dataForm.BirthDateAge, dataForm.BirthDateUnit)" placeholder="只读" style="width: 91px" clearable></el-input>
        <el-select v-model="dataForm.BirthDateUnit" @change="stampCalc(dataForm.BirthDateAge, dataForm.BirthDateUnit)" style="width: 66px;margin-right: 10px">
          <el-option label="岁" value="1"></el-option>
          <el-option label="月" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生" prop="BirthDate" style="margin-top: 15px">
        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="dataForm.BirthDate"
                        placeholder="请选择出生日期" style="width: 160px">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="电话" prop="MobilePhone" style="margin-top: 15px">
        <el-input v-model="dataForm.MobilePhone" placeholder="请输入电话" style="width: 160px"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="患者来源" prop="Source">
        <el-select v-model="dataForm.Source" style="width: 160px">
          <el-option v-for="item in memberOrigin" :key="item.lab"
                     :label="item.lab" :value="item.val">
          </el-option>
        </el-select>
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
      <el-button type="primary" @click="isOKClick = true; $store.commit('setRegisterStep', 2); dataFormSubmit()"
                 :disabled="isOKClick">新增</el-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {formatDate, calcAge, calcTimeStamp} from '@/utils/validate'
import {Currency, Phone, NumberInt} from '../../utils/validate'
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
        Source: '20', // 患者来源
        Address: ''
      },
      memberOrigin: [
        {lab: '医生介绍', val: '1'},
        {lab: '广告', val: '2'},
        {lab: '宣传单', val: '3'},
        {lab: '网络渠道', val: '4'},
        {lab: '美团', val: '5'},
        {lab: '熟人介绍', val: '6'},
        {lab: '其他', val: '20'}
      ],
      dataRule: {
        UserName: Currency('此为必填项'),
        BirthDateAge: NumberInt(),
        BirthDate: Currency('此为必填项'),
        Source: Currency('此为必填项'),
        MobilePhone: Phone(1)
      },
      dataList: null,
      isOKClick: false
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
    // 通过age去计算时间戳
    stampCalc (age, unit) {
      if (unit === '1' && age > 120) { // 输入大小的限制，120岁最大
        this.dataForm.BirthDateUnit = '1'
        this.dataForm.BirthDateAge = ''
        return false
      } else if (unit === '0' && age > 12) { // 输入大小的限制，12月最大
        this.dataForm.BirthDateUnit = '1'
        this.dataForm.BirthDateAge = ''
        return false
      }

      if (age === '' || age === '0' || !/^\d+$/.test(age)) {
        this.dataForm.BirthDateUnit = '1'
        this.dataForm.BirthDateAge = ''
        return false
      }
      this.dataForm.BirthDate = calcTimeStamp(age, unit)
    },
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
        Address: '',
        Source: '20' // 患者来源
      }
      this.isOKClick = false
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
            Address: this.dataForm.Address,
            Source: this.dataForm.Source
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
