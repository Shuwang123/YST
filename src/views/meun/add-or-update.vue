<template>
  <el-dialog
    v-dialogDrag :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" :visible.sync="visible"
    @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="类型：" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="0">目录</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="菜单名称或按钮名称"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
                ref="menuListPopover"
                placement="bottom-end"
                trigger="click" v-model="visible2">
          <div style="overflow-y:auto; width:200px; height:200px;">
            <el-tree
                    :data="data"
                    :props="menuListTreeProps"
                    node-key="id"
                    ref="menuListTree"
                    @current-change="menuListTreeCurrentChangeHandle"
                    :default-expand-all="true"
                    :highlight-current="true"
                    :expand-on-click-node="false">
            </el-tree>
            <!--<el-tree :data="data" :props="menuListTreeProps" @node-click="handleNodeClick"></el-tree>-->
          </div>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.type === 1" label="菜单URL" prop="menuUrl">
        <el-input v-model="dataForm.menuUrl" placeholder="菜单URL"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.type === 2" label="对应接口" prop="url">
        <el-input v-model="dataForm.url" placeholder="多个用逗号分隔, 如: /api/adminuser/add,/api/role/select/add"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 2" label="授权标识" prop="identifier">
        <el-input v-model="dataForm.identifier" placeholder="如: user_list"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="showOrder">
        <el-input-number v-model="dataForm.showOrder" controls-position="right" :min="1" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="菜单图标"></el-input>
      </el-form-item>

      <el-form-item label="菜单描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="菜单描述"></el-input>
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
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      menuList: [],
      visible: false,
      visible2: false,
      dataForm: {
        id: 0,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '陈希',
        menuUrl: '',
        url: '',
        showOrder: 0,
        icon: '',
        description: '',
        identifier: ''
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        menuUrl: [
          { validator: validateUrl, trigger: 'blur' }
        ]
      }
      ,
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }],
      menuListTreeProps: {
        label: '三级',
        children: 'children'
      }
    }
  },
  methods: {
    handleClose () {
      this.dataForm = {
        id: 0,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '',
        menuUrl: '',
        url: '',
        showOrder: 0,
        icon: '',
        identifier: '',
        description: ''
      }
      this.$refs['dataForm'].resetFields()
    },
    init (item) {
      this.visible = true
      if (item) {
        this.dataForm = item
        if (!this.dataForm.parentId) {
          this.dataForm.parentId = -9999
        }
      }
      API.permission.addlist().then(response => {
        console.log(response)
        if (response.data) {
          var alltree = treeDataTranslate(response.data.permissionList, 'id')
          console.log(alltree)
          var toptree = {'parentId': -1, 'id': -9999, 'name': '顶级目录', 'type': 0, children: alltree}
          console.log(toptree)
          this.menuList = [toptree]
        }
        this.$nextTick(() => {
          this.menuListTreeSetCurrentNode()
        })
      });
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
      this.visible2 = false
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },



    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.parentId === -9999) {
            this.dataForm.parentId = null
          }
          var tick = !this.dataForm.id ? API.permission.add(this.dataForm) : API.permission.edit(this.dataForm)
          console.log("陈工0：这儿能执行");

          // this.$http.post('/proxyApi/YstApiMenu/Create',{
          //   ParentId: this.dataForm.parentId,
          //   Name: this.dataForm.name,
          //   Url: this.dataForm.url,
          //   Icon: this.dataForm.icon,
          //   DisplayOrder: this.dataForm.showOrder,
          //   UrlType: this.dataForm.type
          // },{emulateJSON:true}).then(response => {
          tick.then(response => {
            console.log("陈1");
            console.log(response.body.code)
            if(response.code === '0000') {
              console.log("陈3");
              this.$message({
                message: `${this.dataForm.id ? '修改成功' : '新增成功'}`,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
