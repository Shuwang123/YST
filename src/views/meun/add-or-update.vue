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
                trigger="click" v-model="elPopoverElTreeVisible">
          <div style="overflow-y:auto; width:200px; height:200px;">
            <el-tree
                    :data="menuList"
                    :props="defaultProps"
                    node-key="Key"
                    ref="menuListTree"
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
        id: 0,
        type: 1,
        // type: 1菜单、2 按钮
        name: '',
        parentId: 0,
        parentName: '',
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
      },
      menuList: [{
        id: 0,
        label: '一级 1',
        children: [{
          id: 11,
          label: '二级 1-1',
          children: [{
            id: 111,
            label: '三级 1-1-1'
          },{
            id: 112,
            label: '三级 1-1-2'
          }]
        },{
          id: 21,
          label: '二级 2-1',
          children: [{
            id: 211,
            label: '三级 1-2-1'
          },{
            id: 212,
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
      this.$refs['dataForm'].resetFields()  //  整个表单重置,不加s单个
    },
    // 这个init怎么在父组件中被调用的，看不懂this.$refs.addOrUpdate.init(item)?
    init (item) {
      // 如果item不为undefined表示‘编辑’，那dataForm就应该有一个初始值来调用；如果为‘添加’，那dataForm就用默认的初始空值
      this.visible = true
      if (item) {
        var obj = {
          id: item.Id,
          type: item.UrlType, // 1菜单、2 按钮
          name: item.Name,
          parentId: item.ParentId,
          parentName: '',
          menuUrl: item.Url,
          url: '', // 接口的路径
          showOrder: '',
          icon: item.Icon,
          description: '',
          identifier: ''
        }
        this.dataForm = obj
        if (!this.dataForm.parentId) {
          this.dataForm.parentId = -9999
        }
      }
      // 请求el-tree的节点内容，并填充这个el-tree
      API.menu.getTree().then(response => {
        if (response.data) {
          // var alltree = treeDataTranslate(response.data.permissionList, 'id')
          // var alltree = treeDataTranslate(response.data, 'id')
          // var toptree = {'parentId': -1, 'id': -9999, 'name': '顶级目录', 'type': 0, children: alltree}
          // this.menuList = [toptree] // 这儿就是el-tree那个数据的规范结构嘛，外层一个数组，数组的值就直接通过字面量的方式就传入了一个对象作为值
          this.menuList = response.data
          // console.log(toptree)
          // console.log(alltree)
          console.log(this.menuList)
        }
        // 因为改变了数据并且重新渲染了dom，所以this.$nextTick(()=>{})等待渲染结束后立马调用新的代码
        this.$nextTick(() => {
          this.menuListTreeSetCurrentNode()
        })
      });
    },
    // 菜单树选中  参数：当前节点数据，当前节点Node对象span cx
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.Key
      this.dataForm.parentName = data.Label
      console.log(`${data.Key}~${data.Label}`) // 都能获得当前选中节点的text
      this.elPopoverElTreeVisible = false
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['Label']
      // 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
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
