<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.roleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="dataForm.Id" placeholder="角色编码Id" :disabled="dataForm.Id == 0"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="Name">
        <el-input v-model="dataForm.Name" placeholder="角色名称Name"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.Description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          show-checkbox

          :data="dataTree"
          :props="defaultProps"
          ref="menuListTree"

          node-key="key"
          :default-expand-all="true"

          :default-expanded-keys="[1,2,3]"
          :default-checked-keys="checkedKey"
          >
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
// import {treeDataTranslate} from '@/utils'
export default {
  data () {
    return {
      siEdit: true,
      nodes: [],

      dataTree: [], // 菜单树
      checkedKey: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        key: 'key'
      },

      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        code: '', // 角色编码
        RoleType: '',
        RoleId: '',

        Id: 0,
        Name: '',
        Description: ''
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
      // 先获取整棵 最完整的：菜单树 转换后全小写key label children
      API.menu.getTree().then(result => {
        if (result.code === '0000') {
          this.dataTree = JSON.parse(JSON.stringify(result.data).toLowerCase())
        }
      })
      this.dataForm.Id = id || 0
      this.visible = true
      // console.log(id)
      this.$nextTick(() => {
        if (this.dataForm.Id) {
          // this.isEdit = false
          // 根据角色的id获取那个角色的单独的：固定Id Name Desctiption 并且返回Items（其中有这个角色以前的权限：RoleId+MenuId）
          API.role.roleDetail({id: id}).then(result => {
            console.log(result)
            if (result.code === '0000') {
              this.dataForm.Name = result.data.Name
              this.dataForm.Description = result.data.Description
              this.dataForm.Id = result.data.Id
              var arr = []
              if (result.data.Items.length > 0) { // 有权限的才处理初始选中
                for (var i = 0; i < result.data.Items.length; i++) {
                  arr.push(result.data.Items[i].MenuId)
                }
                console.log(arr.join())
                // this.checkedKey = arr
                this.$refs.menuListTree.setCheckedKeys(arr) // 上面那个思路貌似同理，但实际上好像不稳定，有时候出不来
              }
            }
            // if (response.code === '0000' && response.data && response.data.permissionList) {
            //   this.data2 = treeDataTranslate(response.data.permissionList, 'id')
            //   console.log(this.data2)
            // }
          })
        } else {
          // API.role.rolePermissonList().then(response => {
          //   console.log(response)
          //   if (response.code === '0000' && response.data.permissionList) {
          //     this.data2 = treeDataTranslate(response.data.permissionList, 'id')
          //     console.log(this.data2)
          //   }
          // })
        }
      })
    },
    handleClose () {
      // this.checkedKey = []
      this.$refs['dataForm'].resetFields()
      this.$refs.menuListTree.setCheckedKeys([])
      this.dataForm.Id = ''
      this.dataForm.Description = '' // 上面的清空表单，这个貌似没被清掉，不知道为啥子
      // this.isEdit = true
    },
    // 表单提交
    dataFormSubmit () {
      this.checkedKey = this.$refs.menuListTree.getCheckedKeys()
      // var halfpermissions = this.$refs.menuListTree.getHalfCheckedKeys() // 半选中？
      // var checkpermissions = checkedKeys.concat(halfpermissions)
      console.log(this.checkedKey)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            id: 0, // 空 这个后端貌似不用  传递0后端自动生成了一个id，挨个排序的
            Name: this.dataForm.Name,
            Description: this.dataForm.Description,
            MenuIds: this.checkedKey.join()
          }
          if (this.dataForm.Id) {
            params.id = this.dataForm.Id
          }
          var tick = !this.dataForm.Id ? API.role.roleAdd(params) : API.role.roleEdit(params)
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
