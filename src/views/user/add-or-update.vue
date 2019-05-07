<template>
  <el-dialog v-dialogDrag ref="dialog__wrapper" :title="id === 0 ? '申请账号' : '编辑账号'" :close-on-click-modal="false" :visible.sync="visible" @close="handleClose" id='add-or-update'>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="UserName" v-if="!id">
        <el-input v-model="dataForm.UserName" placeholder="请填写用户名（算登陆账号，数字或字母以后不可更改）"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="Password" v-if="!id">
        <el-input v-model="dataForm.Password" placeholder="填写密码或修改密码"></el-input>
      </el-form-item>
      <el-form-item label="别名" prop="NickName">
        <el-input v-model="dataForm.NickName" placeholder="请填别名（汉字昵称）"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="Phone">
        <el-input v-model="dataForm.Phone" placeholder="请填写电话"></el-input>
      </el-form-item>
      <com-store :paramsFather="{
        'label_0': '归属门店',
        'size_1': '',
        'width_2': '400px',
        'clear_3': false,
        'multiple_4': false,
        'must_5': false,
        'isTrigger': false
      }" ref="comStoreOne" @eventStore="changeStoreData">
      </com-store>
      <el-form-item label="角色ID" prop="RoleId">
        <el-select v-model="dataForm.RoleId" placeholder="此账号的角色ID（一个账号只能对应一个角色）" style="width: 400px">
          <el-option v-for="item in roleArr" :key="item.value"
                     :value="item.value" :label="'['+item.value+'] '+item.label">
          </el-option>
        </el-select>
      </el-form-item>

      <com-store :paramsFather="{
        'label_0': '可控门店',
        'size_1': '',
        'width_2': '400px',
        'clear_3': false,
        'multiple_4': true,
        'must_5': false,
        'isTrigger': false
      }" ref="comStoreSome" @eventStore="changeStoreData">
      </com-store>
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
import {Currency, Phone} from '../../utils/validate'
import ComStore from '../common/com-store'

export default {
  data () {
    return {
      visible: false,
      id: '',
      dataForm: {
        UserName: '',
        Password: '',
        NickName: '',
        Phone: '',

        StoreId: 0, // 0 归属门店
        RoleId: 0, // 0
        CanViewStores: '' // '' 1,2,3 可以控制的门店，有关账号的权限范围
      },
      roleArr: [], // 角色选项
      dataRule: {
        UserName: Currency('账号不能为空'),
        Password: Currency('密码不能为空'),
        NickName: Currency('别名必填'),
        Phone: Phone(1)
        // StoreId: Currency('门店必选'),
        // RoleId: Currency('角色必选')
      }
    }
  },
  components: {
    ComStore
  },
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === true) {
        this.dataForm.CanViewStores = choseStoreId
      } else if (isMultiple === false) {
        this.dataForm.StoreId = choseStoreId
      }
    },
    getRoleInit () {
      var parmet = {pageIndex: 1, pageSize: 100, isPaging: false} // 请求角色的
      API.role.jueseList(parmet).then((result) => {
        if (result.code === '0000') {
          this.roleArr = result.data.map(item => {
            return {value: item.Id, label: item.Name}
          })
          console.log(this.roleArr)
        }
      })
    },
    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.roleArr = []
      this.dataForm = {
        UserName: '',
        Password: '',
        NickName: '',
        Phone: '',
        RoleId: 0, // 0
        StoreId: 0, // 0
        CanViewStores: '' // '' 1,2,3
      }
      this.id = ''
    },
    // 如果是编辑账号初始化弹窗，如果新建账号，弹窗内容空
    init (id) {
      this.id = id || 0
      this.visible = true
      this.getRoleInit()
      if (this.id) {
        var obj = {id: this.id}
        API.adminUser.adminUserDetail(obj).then(result => {
          if (result.code === '0000') {
            this.id = result.data.Id
            // this.dataForm.UserName = result.data.UserName
            // this.dataForm.Password = result.data.Password
            this.dataForm.NickName = result.data.NickName
            this.dataForm.Phone = result.data.Phone

            this.dataForm.RoleId = result.data.RoleId
            this.dataForm.StoreId = result.data.StoreId
            this.$refs.comStoreOne.pageInit(result.data.StoreId)
            this.dataForm.CanViewStores = result.data.CanViewStores // 响应的是一个字串
            this.$refs.comStoreSome.pageInit(result.data.CanViewStores.split(',').map(item => {
              return Number(item)
            }))
          }
        })
      }
      // 这儿不要注释哟，重复弹窗可以清空上次弹窗的操作记录
      this.$nextTick(() => {
        this.$refs.comStoreOne.pageInit('')
        this.$refs.comStoreSome.pageInit([]) // 多选的时候清空子组件不要传''了，不然子组件后续的选择调用push方法时有bug，而且你还找不出来，恶心死人
      })
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
            Password: md5(this.dataForm.Password),
            NickName: this.dataForm.NickName,
            RoleId: this.dataForm.RoleId,
            StoreId: this.dataForm.StoreId,
            CanViewStores: this.dataForm.CanViewStores,
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
            CanViewStores: this.dataForm.CanViewStores,
            Phone: this.dataForm.Phone,
            Id: this.id
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
