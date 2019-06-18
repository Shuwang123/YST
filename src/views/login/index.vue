<template>
  <div class="content-box">
    <div class="box-main" align="center">
      <div class="main-left">
        <img src="@/assets/logo/login-img.png" class="main-left-img"/>
      </div>
      <div class="main-right">

        <div class="main-right-logo">
          <img src="@/assets/logo/login_logo.png" class="main-right-logo-img"/>
        </div>
        <div class="main-right-title">
          <p class="main-right-title-p">一善堂</p>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" @keyup.enter.native="submitForm('ruleForm')">
          <el-form-item label="账号" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入登陆账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" placeholder="请输入登陆密码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import API from '@/api'
import md5 from 'js-md5'
import {setStore, setAccountData} from '@/utils'
export default {
  data () {
    return {
      ruleForm: {
        name: 'superman',
        pass: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // var passMd5 = md5(this.ruleForm.pass)
          // console.log(passMd5)
          // API.common.login({userName: this.ruleForm.name, password: passMd5, remmberMe: false}).then(data => {
          console.log(this.ruleForm.pass)
          API.common.login({userName: this.ruleForm.name, password: this.ruleForm.pass, remmberMe: false}).then(data => {
            // this.$ios.get('../static/data/data.json').then(result => {
            if (data.code === '0000') {
              function funMenu () { return API.common.leftMenuTreeList() } // 返回登陆后menu权限
              function funLoginInfo () { return API.purchase.getLoginInfo() } // 返回登陆后store的相关内容
              // [76, Id, Id, ...]全是医生类型角色的Id
              function getAllDoctorTypeId () { return API.role.jueseList({pageIndex: 1, pageSize: 1000, isPaging: true, Name: ''}) }
              this.$ios.all([funMenu(), funLoginInfo(), getAllDoctorTypeId()]).then(this.$ios.spread((response, result, doctorId) => {
                if (response.code === '0000' && result.code === '0000' && doctorId.code === '0000') {
                  setStore('userInfo', response.data) // 保存当前账号的 菜单树
                  this.$router.push({name: 'dashboard'})

                  // 2019.5.5 新增start 登陆详情处理，把登陆后返回的store相关信息保存在session 陈希
                  // "AccountId": 1,
                  // "UserName": "superman",
                  // "NickName": "系统管理员",
                  // "RoleId": 1,
                  // "RoleName": "系统管理员",
                  // "StoreName": "",
                  // "StoreId": 0,
                  // "CanViewStores": "",
                  // "StoreCode": "",
                  // "View": true

                  // console.log(response)
                  // console.log(result)
                  this.$store.commit('setAccountLoginInfoAll', result.data) // ①当前账号的 门店所有详情(先存给Vuex，后在Vuex的commit中存给store，同时转存给session)
                  var isDoctor = result.data.RoleName.includes('医生') // es6返回true或false
                  this.$store.commit('setIsDoctor', isDoctor) // ②判断是否是医生
                  // setAccountData('accountCurrentHandleStore', '') // ③当前的手动选择门店，这个后来感觉应该在采购单等往后的模块处理就放弃了

                  // 2019.5.20 又tm新增了一个，存储角色类型为医生时所对应的全部医生类型的Id 角色：只针对医生类型：[医生Aid，医生Bid，医生Cid]
                  var doctorArr = []
                  doctorId.data.forEach(item => {
                    if (item.Name.includes('医生')) {
                      doctorArr.push(item.Id)
                    }
                  })
                  this.$store.commit('setAllDoctorIdArr', doctorArr)
                } else {
                  this.$message.error('获取菜单失败')
                }
              }))
            } else {
              this.$message.error('账号或者密码错误，请重新登录！')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .content-box{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background-color: #93defe;
  }
  .box-main{
    width: 1100px;height: 100%;padding-top: 120px;margin: auto;overflow: hidden;
  }
  .main-left{
    float:left;width: 432px;height: 440px;margin-left: 50px;
  }
  .main-left-img{
    width: 500px;height: 440px;
  }
  .main-right{
    height: 360px;width: 400px;padding: 50px;background-color: #ffffff;border-radius: 6px;box-sizing: border-box;float: right;margin-right: 50px;position: relative;margin-top: 50px;
  }
  .main-right-logo{
    width: 120px;height: 120px;border:5px solid #93defe;border-radius: 100px;background-color: #ffffff;line-height: 110px;position: absolute;top: -60px;right: 140px;
  }
  .main-right-logo-img{
    width: 60px;height: 60px;display: inline-block;vertical-align: middle;
  }
  .main-right-title{
    width:100%;float: left;text-align: center;
  }
  .main-right-title-p{
    width: 100%;text-align: center;font-size: 18px;color: #444;padding: 10px 0 20px;
  }

  .main-footer{
    font-size: 14px;color: #ffffff;display: block;width: 100%;float: left;text-align: center;margin-top: 60px;
  }
</style>
<style>
  .content-box .el-form-item__content{
    margin-left: 50px;
  }
</style>
