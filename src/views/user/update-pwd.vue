<template>
  <el-dialog v-dialogDrag ref="dialog__wrapper" title="修改密码界面" :close-on-click-modal="false" :visible.sync="visible" @close="handleClose" id='add-or-update'>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword" v-if="!id">
        <el-input v-model="dataForm.oldPassword" placeholder="请先正确填写旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword1" v-if="!id">
        <el-input v-model="dataForm.newPassword1" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword2">
        <el-input v-model="dataForm.newPassword2" placeholder="请再次输入新密码"></el-input>
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
export default {
  data () {
    var checkPhone = (rule, value, callback) => {
      if (String(value).trim() === '') {
        return callback(new Error('电话不能为空'))
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        return callback(new Error('电话号码格式不对'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      id: '',
      UserName: '',
      dataForm: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
      dataRule: {
        Password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        Password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        Password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],

      }
    }
  },
  methods: {
    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.dataForm = {
        UserName: '',
        Password: '',
        NickName: '',
        Phone: '',
        RoleId: 0, // 0
        StoreId: 0, // 0
        CanViewStores: [] // '' 1,2,3
      }
      this.id = ''
    },
    init (id) {
      this.id = id || 0
      this.visible = true
      if (this.id) {
        var obj = {id: this.id}
        console.log(obj)
        API.adminUser.adminUserDetail(obj).then(result => {
          if (result.code === '0000') {
            this.id = result.data.Id
            this.dataForm.NickName = result.data.NickName
            this.dataForm.Phone = result.data.Phone
            this.dataForm.StoreId = result.data.StoreId
            this.dataForm.RoleId = result.data.RoleId
            this.dataForm.CanViewStores = result.data.CanViewStores
            console.log(this.dataForm.CanViewStores)
            this.dataForm.CanViewStores = result.data.CanViewStores.split(',').map(item => {
              return Number(item)
            })
            console.log(this.dataForm.CanViewStores)
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var obj = {
            UserName: this.dataForm.UserName,
            Password: this.dataForm.Password,
            NickName: this.dataForm.NickName,
            RoleId: this.dataForm.RoleId,
            StoreId: this.dataForm.StoreId,
            CanViewStores: this.dataForm.CanViewStores.join(),
            Phone: this.dataForm.Phone,
            id: this.id
          }
          console.log(obj)
          var objEdit = {
            // UserName: this.dataForm.UserName,
            // Password: this.dataForm.Password,
            NickName: this.dataForm.NickName,
            RoleId: this.dataForm.RoleId,
            StoreId: this.dataForm.StoreId,
            CanViewStores: this.dataForm.CanViewStores.join(),
            Phone: this.dataForm.Phone,
            Id: this.id
          }
          // API.adminUser.adminUserAdd(obj).then(data => {
          var tick = this.id ? API.adminUser.adminUserEdit(objEdit) : API.adminUser.adminUserAdd(obj)
          tick.then(data => {
            console.log(data)
            if (data.code === '0000') {
              this.$message({
                message: `${this.id ? '修改成功' : '新增成功'}`,
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
            this.visible = false
          })
        }
      })
    }
  }
}
</script>
