<template>
  <el-dialog class="owneldialogpaddingbottom"
    v-dialogDrag
    :title="!dataForm.roleId ? '新增' : '修改'" width="700px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" v-loading="dataListLoading" label-width="80px">
      <!--<el-form-item label="角色编码" prop="roleCode">-->
        <!--<el-input v-model="dataForm.Id" placeholder="角色编码Id" :disabled="true"></el-input>-->
        <!--&lt;!&ndash;<el-input v-model="dataForm.Id" placeholder="角色编码Id" :disabled="dataForm.Id == 0"></el-input>&ndash;&gt;-->
      <!--</el-form-item>-->
      <el-form-item label="角色名称" prop="Name">
        <el-input v-model="dataForm.Name" placeholder="角色名称Name"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.Description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item class="ownScrollbar" size="mini" label="授权"
                    style="min-height: 350px;max-height: 350px;overflow-y: scroll;">
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
import {Currency} from '../../utils/validate'
export default {
  data () {
    return {
      dataListLoading: false,
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
        Id: 0,
        Name: '',
        Description: '',
        MenuIds: ''
      },
      dataRule: {
        Name: Currency('角色名不能为空')
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
      this.$nextTick(() => {
        if (this.dataForm.Id) {
          this.dataListLoading = true
          // 根据角色的id获取那个角色的单独的：固定Id Name Desctiption 并且返回Items（其中有这个角色以前的权限：RoleId+MenuId）
          API.role.roleDetail({id: id}).then(result => {
            if (result.code === '0000') {
              this.dataForm.Name = result.data.Name
              this.dataForm.Description = result.data.Description
              this.dataForm.Id = result.data.Id
              var arr = []
              if (result.data.Items.length > 0) { // 有权限的才处理初始选中
                for (var i = 0; i < result.data.Items.length; i++) {
                  arr.push(result.data.Items[i].MenuId)
                }
                this.$refs.menuListTree.setCheckedKeys(arr) // 上面那个思路貌似同理，但实际上好像不稳定，有时候出不来
              }
              this.dataListLoading = false
            }
          })
        }
      })
    },
    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.$refs.menuListTree.setCheckedKeys([])
      this.dataForm.Id = ''
      this.dataForm.Description = '' // 上面的清空表单，这个貌似没被清掉，不知道为啥子
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
            id: 0, // 传递0后端自动生成了一个id，挨个排序的
            Name: this.dataForm.Name,
            Description: this.dataForm.Description,
            MenuIds: this.checkedKey.join()
          }
          if (this.dataForm.Id) {
            params.id = this.dataForm.Id // 传递了本行的id的哟
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
<style rel="stylesheet/scss" lang="scss" scoped>
.owneldialogpaddingbottom /deep/ {
  .el-dialog__body {padding-bottom: 0}
  .ownScrollbar {margin-bottom: 0}
}
.ownScrollbar:hover::-webkit-scrollbar { width: 7px; }
.ownScrollbar::-webkit-scrollbar { width: 0; }
.ownScrollbar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background-color: #DDDEE0;
}
.ownScrollbar::-webkit-scrollbar-track {
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
