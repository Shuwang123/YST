<template>
  <el-dialog v-dialogDrag ref="dialog__wrapper" title="账户管理" :close-on-click-modal="false" :visible.sync="visible" @close="handleClose" id='add-or-update'>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.UserName" placeholder="请填写用户名（编辑时不可改）"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="dataForm.Password" placeholder="填写密码或修改密码"></el-input>
      </el-form-item>
      <el-form-item label="别名" prop="NickName">
        <el-input v-model="dataForm.NickName" placeholder="请填别名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="Phone">
        <el-input v-model="dataForm.Phone" placeholder="请填写电话（编辑时不可改）"></el-input>
      </el-form-item>

      <el-form-item label="门店ID" prop="storeId">
        <el-select v-model="dataForm.StoreId" multiple placeholder="门店ID，选择B999为全门店" filterable collapse-tags style="width: 400px" @change="mendian(dataForm.StoreId)">
          <el-option v-for="item in mdoptions"
            :key="item.code"
            :label="'['+item.code+']'+item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色ID" prop="RoleId">
        <el-input v-model="dataForm.RoleId" placeholder="此账号的角色ID"></el-input>
      </el-form-item>
      <!--<el-form-item size="mini" label="角色">
       <el-checkbox-group v-model="roleList">
         <el-checkbox :label="item.id" v-for="(item,index) in allroleList" :key="index">{{item.name}}</el-checkbox>
       </el-checkbox-group>
       &lt;!&ndash;<el-radio-group v-model="roleList">
         <el-radio v-for="(item,index) in allroleList" :key="index" :label="item.id">{{item.id}}</el-radio>
       </el-radio-group>&ndash;&gt;
      </el-form-item>-->

      <el-form-item label="能查看的门店">
        <el-select v-model="dataForm.CanViewStores" multiple placeholder="查看名店值多选" filterable collapse-tags style="width: 400px" @change="mendian(dataForm.StoreId)">
          <el-option v-for="item in mdoptions"
                     :key="item.code"
                     :label="'['+item.code+']'+item.name"
                     :value="item.code">
          </el-option>
        </el-select>
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
      dataForm: {
        UserName: '',
        Password: '',
        Phone: '',
        NickName: '',

        StoreId: '',
        RoleId: '',
        CanViewStores: '',

        id: '' // 系统默认生成
      },
      dataRule: {
        username: [
          { required: true, message: '账户名称不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        Phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        storeId: [
          { required: true, message: '门店ID不能为空', trigger: 'blur' }
        ],
        RoleId: [
          { required: true, message: '角色ID不能为空', trigger: 'blur' }
        ]
      },
      allroleList: [],
      roleList: [], // 角色列表
      mdoptions: [], // 门店列表
      mdoptionsList: []
    }
  },
  mounted () {
    this.getStore()
    /* this.getRole() */
  },
  methods: {
    mendian (data) {
      console.log(data)
    },
    gangwei (data) {
      console.log(data)
    },
    getStore () {
      API.store.storeAll({}).then(response => {
        if (response.data && response.data.storeList.length > 0) {
          this.mdoptions = response.data.storeList
          console.log(this.mdoptions)
        }
      })
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
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      API.adminUser.roleListAdd({}).then(data => {
        if (data.data && data.data.roleList.length > 0) {
          this.allroleList = data.data.roleList
        }
        if (this.dataForm.id) {
          API.adminUser.adminUserDetail({'id': id}).then(data => {
            console.log(data)
            if (data.data) {
              this.dataForm.UserName = data.data.account.username
              this.dataForm.Password = data.data.account.phone
              this.dataForm.Phone = data.data.account.description
              this.dataForm.NickName = data.data.account.description
              this.dataForm.StoreId = data.data.account.description
              this.dataForm.RoleId = data.data.account.description
              this.dataForm.CanViewStores = data.data.account.description

              this.dataForm.id = data.data.account.description
            }

            if (data.data.accountRoleList && data.data.accountRoleList.length > 0) {
              var ids = data.data.accountRoleList.map(function (item) {
                return item.roleId
              })
              this.roleList = ids
              console.log(this.roleList)
            }
            if (data.data.accountStoreList && data.data.accountStoreList.length > 0) {
              var idss = data.data.accountStoreList.map(function (item1) {
                return item1.storeCode
              })
              this.mdoptionsList = idss
              console.log(this.mdoptionsList)
            }
          })
        }
      })
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {

          }
          if (this.dataForm.id) {
            params.id = this.dataForm.id
          }
          var tick = !this.dataForm.id ? API.adminUser.adminUserAdd(params) : API.adminUser.adminUserEdit(params)
          tick.then(data => {
            console.log(data)
            if (data.code === '200') {
              this.$message({
                message: `${this.dataForm.id ? '保存成功' : '新增成功'}`,
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
