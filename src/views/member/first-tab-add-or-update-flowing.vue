<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.id ? '新增会员信息' : '编辑会员信息'" width="900px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-row v-loading="dataListLoading">
      <el-col :span="15">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" size="small" :inline="true">
          <el-form-item label="姓名" prop="UserName">
            <el-input v-model="dataForm.UserName" placeholder="请输入姓名" disabled style="width: 160px"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="Sex">
            <el-radio-group v-model="dataForm.Sex" disabled style="width: 144px">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="年龄" prop="BirthDateAge">
            <el-input v-model="dataForm.BirthDateAge" @blur="stampCalc(dataForm.BirthDateAge, dataForm.BirthDateUnit)" disabled placeholder="只读" style="width: 91px"></el-input>
            <el-select v-model="dataForm.BirthDateUnit" @change="stampCalc(dataForm.BirthDateAge, dataForm.BirthDateUnit)" disabled style="width: 66px;margin-right: 10px">
              <el-option label="岁" value="1"></el-option>
              <el-option label="月" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生" prop="BirthDate">
            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="dataForm.BirthDate"
                            placeholder="请选择出生日期" disabled style="width: 149px">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="电话" prop="MobilePhone">
            <el-input v-model="dataForm.MobilePhone" placeholder="请输入电话" disabled style="width: 160px"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="患者来源" prop="Source">
            <el-select v-model="dataForm.Source" disabled style="width: 160px">
              <el-option v-for="item in memberOrigin" :key="item.lab"
                         :label="item.lab" :value="item.val">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="介绍人" prop="UsersIntroducePeople">
            <el-input v-model="dataForm.UsersIntroducePeople" disabled placeholder="请输入介绍人" style="width: 160px"></el-input>
          </el-form-item>

          <el-form-item label="病例史" prop="AllergyHistory">
            <el-input v-model="dataForm.AllergyHistory" placeholder="请输入病例史" disabled style="width: 413px"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="Address">
            <el-input v-model="dataForm.Address" placeholder="详细地址" disabled style="width: 413px"></el-input>
          </el-form-item>

          <!--积分相关-->
          <el-form-item label="当前积分" prop="Points">
            <el-input v-model="dataForm.Points" disabled></el-input>
          </el-form-item>
          <el-form-item label="操作" prop="EditPoints">
            <el-input-number v-model="dataForm.EditPoints"
                             :min="-dataForm.Points" :max="10000" :step="100"></el-input-number>
          </el-form-item>
          <el-form-item label="兑换描述" prop="Remark">
            <el-input
              type="textarea" style="width: 410px"
              placeholder="请输入兑换的商品或别的描述内容"
              v-model="dataForm.Remark"
              maxlength="150"
              :rows="3"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="9">
        <!--积分时间轴-->
        <h3>积分兑换流水：<span style="color: #e4393c">当前积分 {{dataForm.Points}}</span></h3>
        <div class='time-line' v-if="testList.length > 0">
          <div v-for='item in testList' :key="item.time" class='time-line-items'>
            <i></i><strong></strong>
            <!--<span>{{item.time | myDateFilter('yyyy/MM/dd hh:mm:ss')}}</span>-->
            <span>{{item.time | myDateFilter('yyyy/MM/dd hh')}} 时</span>
            <div>
              <p><b>操作人：</b>{{item.people}}</p>
              {{item.text}}
            </div>
          </div>
        </div>
        <div class='time-line' v-else style="line-height: 450px;height: 450px;text-align: center;color: #e4393c">暂无记录 ＞﹏＜</div>
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isOKClick">确认兑换</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Phone, NumberInt} from '../../utils/validate'
import {formatDate, calcAge, calcTimeStamp} from '@/utils/validate'

export default {
  data () {
    return {
      testList: [],
      visible: false,
      dataListLoading: false, // 加载

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
      memberId: ' ', //  会员ID，提交是判断add、edit
      dataForm: {
        UserName: '',
        Sex: '1',
        BirthDate: '',
        BirthDateAge: '',
        BirthDateUnit: '1', // 必须是str类型的
        MobilePhone: '',
        Source: '20', // 患者来源
        UsersIntroducePeople: '', // 介绍人，可以为空
        AllergyHistory: '', // 病例史
        Address: '',

        Points: '',
        EditPoints: '',
        Remark: ''
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
        MobilePhone: Phone(1),
        Points: Currency('此为必填项'),
        EditPoints: Currency('此为必填项'),
        Remark: Currency('此为必填项')
      },
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
    // 新增，编辑时获取单行详情info
    init (id) {
      this.visible = true
      this.dataListLoading = true
      this.memberId = id
      if (id !== undefined) {
        this.$nextTick(() => {
          function memberInfo () { return API.member.editMemberGet({id: id}) }
          function seeIntegral () { return API.member.seeIntegral({id: id}) }
          this.$ios.all([memberInfo(), seeIntegral()]).then(this.$ios.spread((result, response) => {
            if (result.code === '0000' && response.code === '0000') {
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
              this.dataForm.BirthDateAge = allAge.substring(0, allAge.length - 1) // !!!!!! 只获取数不要单位，其实也可以parseInt

              this.dataForm.MobilePhone = result.data.MobilePhone
              this.dataForm.AllergyHistory = result.data.AllergyHistory
              this.dataForm.Address = result.data.Address
              this.dataForm.Source = String(result.data.Source)
              this.dataForm.UsersIntroducePeople = result.data.UsersIntroducePeople

              this.dataForm.Points = result.data.Points
              this.memberId = result.data.Id


              // 积分相关的返回
              // console.log(result.data, response.data)
              this.testList = response.data.map(item => {
                return {
                  people: item.CreatedByName,
                  time: item.CreatedOn,
                  text: item.Remark
                }
              }).reverse()
              this.dataListLoading = false
            }
          }))
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
        Source: '20', // 患者来源
        UsersIntroducePeople: '', // 介绍人
        Points: '',

        EditPoints: '',
        Remark: ''
      }
      this.isOKClick = false
      this.$refs['dataForm'].clearValidate()
    },
    // 表单提交
    dataFormSubmit () {
      this.isOKClick = true
      setTimeout(() => {
        this.isOKClick = false
      }, 1000)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            Id: this.memberId,
            // Points: this.dataForm.Points, // 总积分
            EditPoints: this.dataForm.EditPoints,
            Remark: this.dataForm.Remark
          }
          // console.log(params)
          API.member.editIntegral(params).then((data) => {
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

<style rel="stylesheet/scss" lang="scss" scoped>
.time-line {
  min-height: 500px;
  height:500px;
  overflow: scroll;
  &::-webkit-scrollbar { width: 0; }
  &:hover::-webkit-scrollbar { width: 7px; }
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    background-color: #DDDEE0;
  }
  &:hover::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: inset 0 0 5px rgba(0,0,0,0);
    background-color: rgba(0,0,0,0);
  }
  div.time-line-items {
    position:relative;
    width: 315px;
    padding: 0 10px 20px 39px;
    &:nth-child(1) i {
      background-color: #409EFF;
      box-shadow: 0 0 5px 1px #409EFF;
    }
    i {
      position: absolute;
      left: 4px;
      top: 7px;
      width: 12px;
      height: 12px;
      background-color: #E4E7ED;
      border-radius: 50%;
    }
    strong {
      position: absolute;
      left: 9px;
      top: 19px;
      width: 2px;
      height: 119px;
      background-color: #E4E7ED;
    }
    span {color: #909399;}
    div {
      height: 90px;
      padding: 7px 10px;
      overflow: hidden;
      border-radius: 5px;
      border: 1px solid #EBEEF5;
      box-shadow: 0 0 10px 0 #EBEEF5;
      p {font-size:14px;color: #333}
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
