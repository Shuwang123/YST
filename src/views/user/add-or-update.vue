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

      <el-form-item label="门店ID" prop="StoreId">
        <el-select v-model="dataForm.StoreId" placeholder="门店ID，选择B999为全门店"
          filterable collapse-tags style="width: 400px" @change="mendian(dataForm.StoreId)">
          <el-option v-for="item in mdoptions" :key="item.value"
                     :value="item.value" :label="'['+item.value+'] '+item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色ID" prop="RoleId">
        <el-select v-model="dataForm.RoleId" placeholder="此账号的角色ID（一个账号只能对应一个角色）"
          filterable collapse-tags style="width: 400px" @change="juese(dataForm.RoleId)">
          <el-option v-for="item in jsoptions" :key="item.value"
                     :value="item.value" :label="'['+item.value+'] '+item.label">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="可看门店">
        <el-select v-model="dataForm.CanViewStores" multiple placeholder="查看名店值多选"
          filterable style="width: 400px" @change="mendianview(dataForm.CanViewStores)">
          <!--collapse-tags -->
          <el-option v-for="item in mdoptions"
                     :key="item.value"
                     :label="'['+item.value+']'+item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item size="mini" label="角色">
        <el-checkbox-group v-model="roleList">
          <el-checkbox :label="item.id" v-for="(item,index) in allroleList" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        &lt;!&ndash;<el-radio-group v-model="roleList">
          <el-radio v-for="(item,index) in allroleList" :key="index" :label="item.id">{{item.id}}</el-radio>
        </el-radio-group>&ndash;&gt;
      </el-form-item>-->
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Phone} from '../../utils/validate'

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

        RoleId: 0, // 0
        StoreId: 0, // 0
        CanViewStores: [] // '' 1,2,3

        // id: 0 // 系统默认生成
      },
      dataRule: {
        UserName: Currency('账号不能为空'),
        Password: Currency('密码不能为空'),
        NickName: Currency('别名必填'),
        Phone: Phone(1)
        // ,StoreId: Currency('门店必选'),
        // RoleId: Currency('角色必选')
      },
      mdoptions: [], // 门店options
      jsoptions: [], // 角色options

      allroleList: [],
      roleList: [], // 角色列表
      mdoptionsList: []
    }
  },
  mounted () {
    this.getStore()
    /* this.getRole() */
  },
  methods: {
    mendian (data) {
      // console.log(data) 获得的是门店的id值
      this.dataForm.storeId = data
      console.log(this.dataForm.storeId) // [看起来输入框的东西是文字，实际值传递的1，2，3]
    },
    juese (data) {
      this.dataForm.RoleId = data
      console.log(this.dataForm.RoleId)
    },
    mendianview (data) {
      console.log(data)
      this.dataForm.CanViewStores = data
      console.log(this.dataForm.CanViewStores)
    },
    getStore () {
      var parmet0 = {pageIndex: 1, pageSize: 100, isPaging: false} // 请求门店的
      var parmet1 = {pageIndex: 1, pageSize: 100, isPaging: false} // 请求角色的
      function getStore () { return API.store.storeAll(parmet0) }
      function getRole () { return API.role.jueseList(parmet1) }
      this.$ios.all([getStore(), getRole()]).then(this.$ios.spread((result0, result1) => {
        if (result0.code === '0000' && result1.code === '0000') {
          // 存门店的options
          var arr0 = []
          result0.data.forEach(item => {
            arr0.unshift({value: item.Id, label: item.Name})
          })
          this.mdoptions = arr0
          console.log(this.mdoptions)

          // 存角色的options
          var arr1 = []
          result1.data.forEach(item => {
            arr1.unshift({value: item.Id, label: item.Name})
          })
          this.jsoptions = arr1
        }
      }))
    },
    /* getRole () {
      API.role.roleListAdd().then(response => {
        if (response.data && response.data.roleList.length > 0) {
          this.allroleList = response.data.roleList
          console.log(this.allroleList)
        }
      })
    }, */
    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.allroleList = []
      this.roleList = []
      this.mdoptionsList = []

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
            // this.dataForm.UserName = result.data.UserName
            // this.dataForm.Password = result.data.Password
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

<!--<el-form-item label="岗位">-->
<!--<el-select v-model="roleList" multiple placeholder="岗位只能选择一个" filterable style="width: 400px" @change="gangwei(roleList)">-->
<!--<el-option-->
<!--v-for="item in allroleList"-->
<!--:key="item.id"-->
<!--:label="'['+item.code+']'+item.name"-->
<!--:value="item.id">-->
<!--</el-option>-->
<!--</el-select>-->
<!--</el-form-item>-->
