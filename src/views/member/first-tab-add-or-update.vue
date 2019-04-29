<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.id ? '新增会员信息' : '编辑会员信息'" width="600px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px" size="small" :inline="true">
      <el-form-item label="姓名" prop="UserName">
        <el-input v-model="dataForm.UserName" placeholder="请输入姓名" style="width: 160px"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="Sex">
        <el-radio-group v-model="dataForm.Sex" style="width: 144px">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="BirthDate">
        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="dataForm.BirthDate" placeholder="请选择出生日期" style="width: 160px"></el-date-picker>
        <!--<el-input-number v-model="sizeForm.age" :min="1" :step="1" :max="12" style="width: 95px"></el-input-number>-->
        <!--<el-input-number v-model="dataForm.BirthDate" :min="1" :step="1" :max="100" style="width: 95px"></el-input-number>-->
        <!--<el-select v-model="dataForm.BirthDateUnit" style="width: 45px">-->
          <!--<el-option :label="'岁'" :value="'岁'"></el-option>-->
          <!--<el-option :label="'月'" :value="'月'"></el-option>-->
        <!--</el-select>-->
      </el-form-item>
      <el-form-item label="电话" prop="MobilePhone">
        <el-input v-model="dataForm.MobilePhone" placeholder="请输入电话" style="width: 160px"></el-input>
      </el-form-item>

      <el-form-item label="病例史" prop="AllergyHistory">
        <el-input v-model="dataForm.AllergyHistory" placeholder="请输入病例史" style="width: 413px"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="Address">
        <el-input v-model="dataForm.Address" placeholder="详细地址" style="width: 413px"></el-input>
      </el-form-item>
      <!--<el-form-item label="地址" prop="SalePrice">-->
      <!--<el-input v-model="dataForm.SalePrice" placeholder="请选择区级地址"></el-input>-->
      <!--</el-form-item>-->
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消StoreId</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定添加</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Phone} from '../../utils/validate'
import {formatDate} from '@/utils/validate'

export default {
  filters: {
    formatDate (time) {
      var day = new Date(time.substring(6, time.length - 2) * 1)
      return formatDate(day, 'yyyy-MM-dd')
    }
  },
  components: {
  },
  data () {
    return {
      visible: false,
      drugsCategoryList: [], // 初始化药品种类
      memberId: '', // 会员ID，提交是判断add、edit
      dataForm: {
        StoreId: '',
        UserName: '',
        Sex: '1',
        BirthDate: '',
        MobilePhone: '',
        AllergyHistory: '', // 病例史
        Address: ''
      },
      dataRule: {
        UserName: Currency('此为必填项'),
        BirthDate: Currency('此为必填项'),
        MobilePhone: Phone(1)
      },
    }
  },
  methods: {
    // 新增，编辑时获取单行详情info
    init (id, StoreId) {
      this.visible = true
      this.memberId = id
      this.dataForm.StoreId = StoreId
      console.log(this.dataForm.StoreId)
      if (id !== undefined) {
        this.$nextTick(() => {
          API.member.editMemberGet({id: id}).then(result => {
            if (result.code === '0000') {
              this.dataForm.UserName = result.data.UserName
              this.dataForm.Sex = String(result.data.Sex)
              this.dataForm.BirthDate = formatDate(new Date(result.data.BirthDate
                .substring(6, result.data.BirthDate.length - 2) * 1), 'yyyy-MM-dd')
              this.dataForm.MobilePhone = result.data.MobilePhone
              this.dataForm.AllergyHistory = result.data.AllergyHistory
              this.dataForm.Address = result.data.Address
              // console.log(result.data)
              // console.log(this.dataForm)
              this.memberId = result.data.Id
            }
          })
        })
      }
    },
    handleClose () {
      // this.$refs['dataForm'].resetFields()
      this.Id = ''
      this.dataForm = {
        StoreId: '',
        UserName: '',
        Sex: '1',
        BirthDate: '',
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
            StoreId: this.dataForm.StoreId,
            UserName: this.dataForm.UserName,
            Sex: this.dataForm.Sex,
            BirthDate: this.dataForm.BirthDate,
            MobilePhone: this.dataForm.MobilePhone,
            AllergyHistory: this.dataForm.AllergyHistory,
            Address: this.dataForm.Address
          }
          var paramsEdit = {
            StoreId: this.dataForm.StoreId,
            UserName: this.dataForm.UserName,
            Sex: this.dataForm.Sex,
            BirthDate: this.dataForm.BirthDate,
            MobilePhone: this.dataForm.MobilePhone,
            AllergyHistory: this.dataForm.AllergyHistory,
            Address: this.dataForm.Address,
            Id: this.memberId
          }
          console.log(paramsAdd)
          console.log(paramsEdit)
          var tick = this.memberId ? API.member.editMemberSubmit(paramsEdit) : API.member.addMemberSubmit(paramsAdd)
          tick.then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: `${this.memberId ? '编辑成功' : '会员添加成功'}`,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    }

  }
}
</script>
