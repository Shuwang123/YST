<template>
  <el-dialog v-dialogDrag ref="dialog__wrapper" title="角色分配" :close-on-click-modal="false" :visible.sync="visible" @close="handleClose" id='add-or-update'>
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="请填写用户名" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="请填写电话" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="门店">
        <el-select v-model="mdoptionsList" multiple placeholder="选择B999则为全部门店" filterable collapse-tags style="width: 400px" @change="mendian(mdoptionsList)">
          <el-option
            v-for="item in mdoptions"
            :key="item.code"
            :label="'['+item.code+']'+item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
      <!--<el-form-item size="mini" label="角色">
        <el-checkbox-group v-model="roleList">
          <el-checkbox :label="item.id" v-for="(item,index) in allroleList" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        &lt;!&ndash;<el-radio-group v-model="roleList">
          <el-radio v-for="(item,index) in allroleList" :key="index" :label="item.id">{{item.id}}</el-radio>
        </el-radio-group>&ndash;&gt;
      </el-form-item>-->
      <el-form-item label="岗位">
        <el-select v-model="roleList" multiple placeholder="岗位只能选择一个" filterable style="width: 400px" @change="gangwei(roleList)">
          <el-option
            v-for="item in allroleList"
            :key="item.id"
            :label="'['+item.code+']'+item.name"
            :value="item.id">
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
    return {
      visible: false,
      dataForm: {
        merchantStoreIds: '',
        id: 0,
        username: '',
        phone: '',
        role: '',
        description: ''
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
      API.role.roleListAdd({}).then(data => {
        if (data.data && data.data.roleList.length > 0) {
          this.allroleList = data.data.roleList
        }
        if (this.dataForm.id) {
          API.adminUser.adminUserDetail({'accountId': id}).then(data => {
            console.log(data)
            if (data.data.account) {
              this.dataForm.username = data.data.account.username
              this.dataForm.phone = data.data.account.phone
              this.dataForm.description = data.data.account.description
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
            /* username: this.dataForm.username,
            phone: this.dataForm.phone, */
            description: this.dataForm.description,
            roleId: this.roleList.join(','),
            storeCodes: this.mdoptionsList.join(',')
          }
          if (this.dataForm.id) {
            params.accountId = this.dataForm.id
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
