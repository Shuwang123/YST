<template>
  <el-dialog v-dialogDrag ref="dialog__wrapper" :width="'600px'"
             :title="'编辑医生排班'"
             :close-on-click-modal="false" :visible.sync="visible"
             @close="handleClose" id='add-or-update'>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             v-loading="dataListLoading"
             @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="登陆账号" prop="UserName" v-if="!id">
            <el-input v-model="dataForm.UserName" placeholder="请填写用户名（登陆账号，限数字或字母以后不可更改）"></el-input>
          </el-form-item>
          <!--<el-form-item label="密码" prop="Password" v-if="!id">-->
          <!--<el-input v-model="dataForm.Password" placeholder="填写密码或修改密码"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="医生" prop="NickName">
            <el-input v-model="dataForm.NickName" placeholder="请填写别名" disabled></el-input>
          </el-form-item>

          <!--这申请账号时如果没有选择角色ID，默认0，提交后会导致申请账号失败-->
          <el-form-item label="角色ID" prop="RoleId" style="display: none">
            <el-select v-model="dataForm.RoleId"
                       placeholder="一个账号只能对应单个角色且必填" style="width: 350px">
              <el-option v-for="item in roleArr" :key="item.value"
                         :value="item.value" :label="'['+item.value+'] '+item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <!--医生类型的账号，会设置挂号费 2019.07.01-->
          <el-form-item label="挂号费" prop="RegisterAmount">
            <el-input-number v-model="dataForm.RegisterAmount" :precision="2" :min="1" :step="0.1" :max="1000"></el-input-number>
          </el-form-item>
          <el-form-item label="诊室" prop="Room">
            <el-input v-model="dataForm.Room" placeholder="诊室"></el-input>
          </el-form-item>
          <el-form-item label="排班" prop="OrderWork">
            <el-input v-model="dataForm.OrderWork" placeholder="排班"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import md5 from 'js-md5'
import {Currency, Phone} from '../../utils/validate'
import ComStore from '../common/com-store'

export default {
  watch: {
    'dataForm.RoleId': function (val, oldval) {
      setTimeout(() => {
        var isDoctor = this.roleArr.some(item => {
          return (item.value === val && item.label.includes('医生'))
        })
        if (isDoctor) {
          this.RegisterAmountInputNumber = true
        } else {
          this.RegisterAmountInputNumber = false
          this.dataForm.RegisterAmount = ''
          this.dataForm.Room = ''
          this.dataForm.OrderWork = ''
        }
        console.log(val, this.dataForm.RegisterAmount, this.RegisterAmountInputNumber)
      }, 50)
    }
  },
  data () {
    return {
      visible: false,
      dataListLoading: false,
      id: '',
      dataForm: {
        UserName: '',
        // Password: '', // 申请账号的时候不需要提供密码了，后端统一初始化123456，这先注释放着
        NickName: '',
        Phone: '',
        StoreId: 0, // 0 归属门店
        RoleId: 0, // 0
        CanViewStores: '', // '' 1,2,3 可以控制的门店，有关账号的权限范围

        RegisterAmount: '', // 医生挂号费
        Room: '', // 医生诊室
        OrderWork: '' // 医生排班
      },
      RegisterAmountInputNumber: false,
      roleArr: [], // 角色选项
      dataRule: {
        UserName: Currency('账号不能为空'),
        // Password: Currency('密码不能为空'),
        NickName: Currency('别名必填'),
        Phone: Phone(1),
        RegisterAmount: Currency('挂号费必填'),
        Room: Currency('医生诊室必填'),
        OrderWork: Currency('排班信息必填')
        // StoreId: Currency('门店必选'),
        // RoleId: Currency('角色必选')
      }
    }
  },
  components: {
    ComStore
  },
  methods: {
    getRoleInit () {
      var parmet = {pageIndex: 1, pageSize: 100, isPaging: false} // 请求角色的
      API.role.jueseList(parmet).then((result) => {
        if (result.code === '0000') {
          this.roleArr = result.data.map(item => {
            return {value: item.Id, label: item.Name}
          })
        }
      })
    },
    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.roleArr = []
      this.dataForm = {
        UserName: '',
        // Password: '',
        NickName: '',
        Phone: '',
        RoleId: 0, // 0
        RegisterAmount: '', // 医生挂号费
        Room: '', // 医生诊室
        OrderWork: '', // 医生排班
        StoreId: 0, // 0
        CanViewStores: '' // '' 1,2,3
      }
      this.id = ''
      this.RegisterAmountInputNumber = false
    },
    // 如果是编辑账号初始化弹窗，如果新建账号，弹窗内容空
    init (id) {
      this.id = id || 0
      this.visible = true
      this.getRoleInit()
      if (this.id) {
        this.dataListLoading = true
        var obj = {id: this.id}
        API.adminUser.adminUserDetail(obj).then(result => {
          if (result.code === '0000') {
            this.id = result.data.Id
            // this.dataForm.UserName = result.data.UserName
            // this.dataForm.Password = result.data.Password
            this.dataForm.NickName = result.data.NickName
            this.dataForm.Phone = result.data.Phone

            this.dataForm.RoleId = result.data.RoleId
            this.dataForm.RegisterAmount = result.data.RegisterAmount // 医生类型的账号会有挂号费
            this.dataForm.Room = result.data.Room // 医生类型的账号会有诊室
            this.dataForm.OrderWork = result.data.OrderWork // 医生类型的账号会有排班

            this.dataForm.StoreId = result.data.StoreId

            this.dataListLoading = false
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      if (this.dataForm.StoreId === 0 || this.dataForm.StoreId === '') {
        this.$alert('没有选择账号的归属门店', '提示', {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return false
      }
      this.$refs['dataForm'].validate((valid) => {
        if (this.dataForm.CanViewStores === '') {
          this.dataForm.CanViewStores = this.dataForm.StoreId
        } else if (
          String(this.dataForm.CanViewStores).split(',').some(item => {
            return this.dataForm.StoreId === Number(item)
          })
        ) {
        } else {
          this.dataForm.CanViewStores = this.dataForm.CanViewStores.split(',').concat(this.dataForm.StoreId).join()
        }

        if (valid) {
          var obj = {
            UserName: this.dataForm.UserName,
            // Password: this.dataForm.Password,
            // Password: md5(this.dataForm.Password),
            NickName: this.dataForm.NickName,
            RoleId: this.dataForm.RoleId,
            RegisterAmount: this.dataForm.RegisterAmount,
            Room: this.dataForm.Room,
            OrderWork: this.dataForm.OrderWork,

            StoreId: this.dataForm.StoreId,
            CanViewStores: this.dataForm.CanViewStores,
            Phone: this.dataForm.Phone,
            id: this.id
          }
          console.log(obj)
          var objEdit = {
            Id: this.id,
            // UserName: this.dataForm.UserName,
            // Password: this.dataForm.Password,
            NickName: this.dataForm.NickName,
            RoleId: this.dataForm.RoleId,
            StoreId: this.dataForm.StoreId,
            RegisterAmount: this.dataForm.RegisterAmount,
            Room: this.dataForm.Room,
            OrderWork: this.dataForm.OrderWork,

            CanViewStores: this.dataForm.CanViewStores,
            Phone: this.dataForm.Phone
          }
          console.log(objEdit)
          var tick = this.id ? API.adminUser.adminUserEdit(objEdit) : API.adminUser.adminUserAdd(obj)
          tick.then(data => {
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
