<template>
  <el-dialog
    v-dialogDrag :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" :visible.sync="visible"
    @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="类型：" prop="UrlType">
        <el-radio-group v-model="dataForm.urlType">
          <!--<el-radio :label="0">目录</el-radio>-->
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
                trigger="click" v-model="elPopoverElTreeVisible">
          <div style="overflow-y:auto; width:200px; height:200px;">
            <el-tree
                    :data="menuList"
                    :props="defaultProps"
                    ref="menuListTree"

                    node-key="key"
                    @current-change="menuListTreeCurrentChangeHandle"
                    :default-expand-all="true"
                    :highlight-current="true"
                    :expand-on-click-node="false">
                    <!--配置选项、唯一标识、当前选中节点变化时触发（共两个参数：当前节点数据，当前节点Node对象）
                    是否默认展开所有节点、是否高亮当前选中节点、是否在点击节点的时候展开或者收缩节-->
            </el-tree>
          </div>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.urlType === 1" label="菜单URL" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单URL"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.urlType === 2" label="对应接口" prop="menuUrl">
        <el-input v-model="dataForm.menuUrl" placeholder="多个用逗号分隔, 如: /api/adminuser/add,/api/role/select/add"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.urlType === 2" label="授权标识" prop="identifier">
        <el-input v-model="dataForm.identifier" placeholder="如: user_list"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.urlType !== 2" label="排序号" prop="showOrder">
        <el-input-number v-model="dataForm.displayOrder" controls-position="right" :min="1" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.urlType !== 2" label="菜单图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="菜单图标"></el-input>
      </el-form-item>
      <!--<el-form-item label="菜单描述" prop="description">-->
        <!--<el-input v-model="dataForm.description" placeholder="菜单描述"></el-input>-->
      <!--</el-form-item>-->
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
    // 这个是卅，有点看不懂
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      // menuList: [],
      visible: false, // 整个 ‘新增、编辑’ 对话框的显隐
      elPopoverElTreeVisible: false, // 控制弹出框的显隐，单击v-popover可以切换这个值

      dataForm: {
        // id: 0,
        // type: 1, // type: 1菜单、2 按钮
        // name: '',
        // parentId: 0,
        // parentName: '',
        // menuUrl: '',
        // url: '',
        // showOrder: 0,
        // icon: '',
        // description: '',
        // identifier: ''
        id: 0,
        name: '',
        parentId: 3,
        url: '',
        icon: '',
        displayOrder: 0,
        urlType: 1,

        type: 1,
        parentName: ''
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
      },
      menuList: [{
        key: 0,
        label: '一级 1',
        children: [{
          key: 11,
          label: '二级 1-1',
          children: [{
            key: 111,
            label: '三级 1-1-1'
          },{
            key: 112,
            label: '三级 1-1-2'
          }]
        },{
          key: 21,
          label: '二级 2-1',
          children: [{
            key: 211,
            label: '三级 1-2-1'
          },{
            key: 212,
            label: '三级 1-2-2'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleClose () {
      this.dataForm = {
        id: 0,
        name: '',
        parentId: 3,
        url: '',
        icon: '',
        displayOrder: 0,
        urlType: 1,

        type: 1,
        parentName: ''
      }
      this.$refs['dataForm'].resetFields() // 不加s单个，加s整个表单重置
    },
    init (Id) {
      // 如果item不为undefined表示‘编辑’，那dataForm就应该有一个初始值来调用；如果为‘添加’，那dataForm就用默认的初始空值
      this.visible = true
      if (Id) {
        // console.log(Id)
        var o = {'id': Id}
        console.log(o) // 这行执行了
        API.menu.getEdit(o).then(result => { // 这个API请求未执行
          console.log('123123')
          if (result.code === '0000') {
            console.log("测过")

            var obj = {
              id: result.data.Id,
              name: result.data.Name,
              parentId: result.data.ParentId,
              url: result.data.Url,
              icon: result.data.Icon,
              displayOrder: result.data.DisplayOrder,
              urlType: result.data.UrlType,
              type: result.data.UrlType, // 这两个后台并不使用
              parentName: ''
            }
            this.dataForm = obj
            // console.log(obj)
          }
        })
        if (!this.dataForm.parentId) {
          this.dataForm.parentId = -9999
        }
      }
      // 请求el-tree的节点内容，并填充这个el-tree
      API.menu.getTree().then(response => {
        if (response.data) {
          // var toptree = {'parentId': -1, 'id': -9999, 'name': '顶级目录', 'type': 0, children: alltree}
          // this.menuList = [toptree]
          this.menuList = JSON.parse(JSON.stringify(response.data).toLowerCase()) // 把后端的那个坑货的大写字母转小写方便直接用
        }
        this.$nextTick(() => {
          this.menuListTreeSetCurrentNode()
        })
      })
      console.log("怎么弄")
    },
    // 菜单树选中  参数：当前节点数据，当前节点Node对象span cx
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.key
      this.dataForm.parentName = data.label
      console.log(`${data.key}~${data.label}`) // 都能获得当前选中节点的text
      this.elPopoverElTreeVisible = false
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId) // 通过 key 设置对应节点激活为选中状态，此方法必须搭配 node-key 属性
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode(this.dataForm.parentId) || {})['label']
      // 获取当前被选中节点的 data，若没有节点被选中则返回 null
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.parentId === -9999) {
            this.dataForm.parentId = null
          }
          var tick = !this.dataForm.id ? API.menu.add(this.dataForm) : API.menu.edit(this.dataForm)
          tick.then(response => {
            if (response.code === '0000') {
              this.$message({
                message: `${this.dataForm.id ? '修改成功' : '新增成功'}`,
                type: 'success',
                duration: 3000,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
              console.log(this.dataForm.menuUrl)
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
