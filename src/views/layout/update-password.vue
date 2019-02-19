<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="账号">
        <span>{{ $store.state.user.name }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="dataForm.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
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
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick( () =>{
          this.$refs['dataForm'].resetFields();
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              /*'oldPassword': this.dataForm.oldPassword,
              'newPassword': this.dataForm.newPassword,*/
              'adminName': this.$store.state.user.name,
              /*'currentUser': this.dataForm.currentUser*/
            }
            if (this.dataForm.oldPassword){
              params.oldPassword=md5(this.dataForm.oldPassword);
            }
            if (this.dataForm.newPassword){
              params.newPassword=md5(this.dataForm.newPassword);
            }
            API.role.updatePassword(params).then((data) => {
              if (data.code == 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(() => {
                      this.DELETE_CONTENT_TABS([])
                      this.$cookie.delete('token')
                      this.$router.replace({ name: 'login' })
                    })
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      ...mapMutations(['DELETE_CONTENT_TABS'])
    }
  }
</script>

