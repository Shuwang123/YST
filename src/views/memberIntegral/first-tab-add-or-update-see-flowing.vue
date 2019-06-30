<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.id ? '新增会员信息' : '编辑会员信息'" width="600px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" size="small" :inline="true">
      <el-form-item label="姓名" prop="UserName">
        <el-input v-model="dataForm.UserName" placeholder="请输入姓名" style="width: 160px"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="Sex">
        <el-radio-group v-model="dataForm.Sex" style="width: 144px">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="年龄" prop="BirthDateAge">
        <el-input v-model="dataForm.BirthDateAge" @blur="stampCalc(dataForm.BirthDateAge, dataForm.BirthDateUnit)" placeholder="只读" style="width: 91px" clearable></el-input>
        <el-select v-model="dataForm.BirthDateUnit" @change="stampCalc(dataForm.BirthDateAge, dataForm.BirthDateUnit)" style="width: 66px;margin-right: 10px">
          <el-option label="岁" value="1"></el-option>
          <el-option label="月" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生" prop="BirthDate">
        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="dataForm.BirthDate"
                        placeholder="请选择出生日期" style="width: 149px">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="电话" prop="MobilePhone">
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

      <el-form-item label="病例史" prop="AllergyHistory">
        <el-input v-model="dataForm.AllergyHistory" placeholder="请输入病例史" style="width: 413px"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="Address">
        <el-input v-model="dataForm.Address" placeholder="详细地址" style="width: 413px"></el-input>
      </el-form-item>

      <!--积分流水-->
      <div class="block">
        <div class="radio">
          排序：
          <el-radio-group v-model="reverse">
            <el-radio :label="true">倒序</el-radio>
            <el-radio :label="false">正序</el-radio>
          </el-radio-group>
        </div>

        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities" :key="index"
            :timestamp="activity.timestamp">{{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Phone, NumberInt} from '../../utils/validate'
import {formatDate, calcAge, calcTimeStamp} from '@/utils/validate'

export default {
  components: {},
  data () {
    return {
      visible: false,
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      drugsCategoryList: [], // 初始化药品种类
      memberId: '', // 会员ID，提交是判断add、edit
      dataForm: {
        UserName: '',
        Sex: '1',
        BirthDate: '',
        BirthDateAge: '',
        BirthDateUnit: '1', // 必须是str类型的
        MobilePhone: '',
        Source: '20', // 患者来源
        AllergyHistory: '', // 病例史
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
      }
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
    // 新增，编辑时获取单行详情info
    init (id) {
      this.visible = true
      this.memberId = id
      if (id !== undefined) {
        this.$nextTick(() => {
          API.member.editMemberGet({id: id}).then(result => {
            if (result.code === '0000') {
              this.dataForm.UserName = result.data.UserName
              this.dataForm.Sex = String(result.data.Sex)

              this.dataForm.BirthDate = formatDate(new Date(result.data.BirthDate
                .substring(6, result.data.BirthDate.length - 2) * 1), 'yyyy-MM-dd')
              var allAge = calcAge(this.dataForm.BirthDate) // !!!!!!这得到18岁 或 10月 1月
              if (allAge.substr(allAge.length - 1) === '月') {
                this.dataForm.BirthDateUnit = '0'
              } else if (allAge.substr(allAge.length - 1) === '岁') {
                this.dataForm.BirthDateUnit = '1'
              }
              this.dataForm.BirthDateAge = allAge.substring(0, allAge.length - 1) // !!!!!!只获取数不要单位，其实也可以parseInt

              this.dataForm.MobilePhone = result.data.MobilePhone
              this.dataForm.AllergyHistory = result.data.AllergyHistory
              this.dataForm.Address = result.data.Address
              this.dataForm.Source = String(result.data.Source)
              console.log(result.data)
              console.log(this.dataForm)
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
      this.$refs['dataForm'].clearValidate()
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
          var paramsEdit = {
            StoreId: this.$store.getters.getAccountCurrentHandleStore,
            UserName: this.dataForm.UserName,
            Sex: this.dataForm.Sex,
            BirthDate: this.dataForm.BirthDate,
            MobilePhone: this.dataForm.MobilePhone,
            AllergyHistory: this.dataForm.AllergyHistory,
            Address: this.dataForm.Address,
            Source: this.dataForm.Source,
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
                  this.$emit('refreshDataListSee')
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
