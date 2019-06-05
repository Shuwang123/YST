<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="94px">
      <el-form-item label="当前账号">
        <span style="color: red">{{ $store.state.user.name }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="dataForm.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import API from '@/api'
import md5 from 'js-md5'
import { mapMutations } from 'vuex'
import {removeStore, removeAccountData} from '@/utils'

export default {
  data () {
    var validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.newPassword !== value) {
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        currentUser: '',
        name: '',

        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      dataRule: {
        oldPassword: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认新密码不能为空', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['DELETE_CONTENT_TABS']),
    // 初始化
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            // 'adminName': this.$store.state.user.name, // ???
            // 'currentUser': this.dataForm.currentUser,
            'oldPassword': '',
            'newPassword': ''
          }
          if (this.dataForm.oldPassword) {
            params.oldPassword = this.dataForm.oldPassword
            // params.oldPassword = md5(this.dataForm.oldPassword)
          }
          if (this.dataForm.newPassword) {
            params.newPassword = this.dataForm.newPassword
            // params.newPassword = md5(this.dataForm.newPassword)
          }
          console.log(params)
          API.role.changePassword(params).then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$nextTick(() => {
                    // this.DELETE_CONTENT_TABS([])
                    // this.$cookie.delete('token')

                    // 修改密码后要清空cookie等并且自动跳转登录页
                    this.DELETE_CONTENT_TABS([])
                    removeStore('userInfo')
                    // 2019.5.8 cx新增移除登陆账号的三个信息：账号详情+账号是否是医生类型+账号当前锁定的手选门店
                    // (本来的确是三个的)，但后来发现只需要移除当前锁定的手选门店字段，其他两个（当前账号的登录信息，和当前账号是否为医生类型）在登陆时会用覆盖的方式解决，想了解去(login/first-tab-add-or-update.vue)看代码
                    // 并且还发现这儿就算把session删了，还是没达到目的，因为session是手工删除了，但其实退出操作时浏览器实际上并没有关闭的，导致你的Vuex并没有销毁，所以Vuex也要处理掉
                    // removeAccountData('accountCurrentHandleStore') 后来发现自己的代码结构太优秀，连这句都可以省了
                    this.$store.commit('setAccountCurrentHandleStore', null)
                    this.$router.replace({ name: 'login' })
                  })
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
