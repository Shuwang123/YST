<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.roleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="dataForm.code" placeholder="角色编码"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          ref="menuListTree"
          :data="data2"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps">
        </el-tree>
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
import {treeDataTranslate} from '@/utils'
export default {
  data () {
    return {
      nodes: [],
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        code: '', // 角色编码
        id: 0,
        roleId: '',
        name: '',
        description: '',
        roleType: ''
      },
      dataRule: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.roleId = id || 0
      this.visible = true
      if (this.dataForm.roleId) {
        API.role.roleDetail({'roleId': id}).then(response => {
          console.log(response)
          if (response.code === '0000') {
            this.dataForm.name = response.data.roleMap.role.name
            this.dataForm.description = response.data.roleMap.role.description
            this.dataForm.code = response.data.roleMap.role.code
            if (response.data.roleMap.permissions.length > 0) {
              var permissions = treeDataTranslate(response.data.roleMap.permissions, 'id')
              this.getNodes(permissions)
              this.$refs.menuListTree.setCheckedKeys(this.nodes)
            }
          }
          if (response.code === '0000' && response.data && response.data.permissionList) {
            this.data2 = treeDataTranslate(response.data.permissionList, 'id')
            console.log(this.data2)
          }
        })
      } else {
        API.role.rolePermissonList().then(response => {
          console.log(response)
          if (response.code === '0000' && response.data.permissionList) {
            this.data2 = treeDataTranslate(response.data.permissionList, 'id')
            console.log(this.data2)
          }
        })
      }
    },
    handleClose () {
      this.nodes = []
      this.$refs['dataForm'].resetFields()
      this.$refs.menuListTree.setCheckedKeys([])
      this.dataForm.code = ''
    },
    // 表单提交
    dataFormSubmit () {
      var checkedKeys = this.$refs.menuListTree.getCheckedKeys()
      var halfpermissions = this.$refs.menuListTree.getHalfCheckedKeys()
      var checkpermissions = checkedKeys.concat(halfpermissions)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            permissionIds: checkpermissions.join(','),
            code: this.dataForm.code,
            roleName: this.dataForm.name,
            description: this.dataForm.description,
            roleId: this.dataForm.roleId
          }
          if (this.dataForm.roleId) {
            params.roleId = this.dataForm.roleId
          }
          var tick = !this.dataForm.roleId ? API.role.roleAdd(params) : API.role.roleEdit(params)
          tick.then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: `${this.dataForm.roleId ? '修改成功' : '新增成功'}`,
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
    },
    // 递归获取节点
    getNodes (treenodes) {
      if (treenodes.length > 0) {
        for (var i = 0; i < treenodes.length; i++) {
          if (treenodes[i].children) {
            this.getNodes(treenodes[i].children)
          } else {
            this.nodes.push(treenodes[i].id)
          }
        }
      }
    }
  }
}
</script>
