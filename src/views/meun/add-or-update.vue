<template>
  <el-dialog
    v-dialogDrag :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false" :visible.sync="visible"
    @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="类型：" prop="UrlType">
        <el-radio-group v-model="dataForm.urlType">
          <el-radio :label="1">菜单</el-radio>
          <!--<el-radio :label="0">目录</el-radio>-->
          <!--<el-radio :label="2">按钮</el-radio>-->
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
              node-key="key"
              show-checkbox
              :check-strictly="true"
              ref="menuListTree"

              :default-expand-all="true"
              :highlight-current="true"
              :expand-on-click-node="false"

              @check-change="handleCheckClick">
                    <!-- @check="daye" @node-click="handleNodeClick" 配置选项、唯一标识、当前选中节点变化时触发（共两个参数：当前节点数据，当前节点Node对象）
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
// import { treeDataTranslate } from '@/utils'
import {Currency} from '../../utils/validate'
export default {
  data () {
    // 自定义验证
    // var validateUrl = (rule, value, callback) => {
    //   if (this.dataForm.type === 1 && !/\S/.test(value)) {
    //     callback(new Error('菜单URL不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // menuList: [],
      visible: false,
      elPopoverElTreeVisible: false, // 控制弹出框的显隐，单击v-popover可以切换这个值

      dataForm: {
        id: 0,
        name: '',
        parentId: 0,
        url: '',
        icon: '',
        displayOrder: 0,
        urlType: 1,

        type: 1,
        parentName: ''
      },
      dataRule: {
        name: Currency('菜单名不能为空'),
        url: Currency('如果没有路径请填写#号')
        // ,menuUrl: [
        //   { validator: validateUrl, trigger: 'blur' }
        // ]
      },
      menuList: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        key: 'key'
      },
      isParentNode: false,
      oldNodeKey: ''
    }
  },
  methods: {
    handleClose () {
      this.dataForm = {
        id: 0,
        name: '',
        parentId: 0,
        url: '',
        icon: '',
        displayOrder: 0,
        urlType: 1,

        type: 1,
        parentName: ''
      }
      this.$refs['dataForm'].resetFields() // 不加s单个，加s整个表单重置
      this.menuList = []
    },
    // 下面这个方法，绕圈指数9星，请做好心里准备
    handleCheckClick (data, checked, childchecked) {
      if (checked === true) {
        this.$refs.menuListTree.setCheckedNodes([data])
        this.dataForm.parentId = Number(data.key) // data.key是字符串1影响===判断
        this.dataForm.parentName = data.label
        if (this.dataForm.id === this.dataForm.parentId) {
          this.dataForm.parentId = 0
          this.dataForm.parentName = ''
          this.$message({
            type: 'warning',
            message: '此操作将把本级菜单设为顶级菜单'
          })
        }
        // data.children是个对象，判断当前节点有没有子节点（有子节点的那种节点getCheckedKey(true）得不到值! 就算处于选中状态)
        if (data.children.length !== 0) {
          this.isParentNode = true
        } else {
          this.isParentNode = false
        }
        this.oldNodeKey = data.key // this.elPopoverElTreeVisible = false // console.log(`${data.key}~${data.label}`)
      } else {
        // console.log(this.$refs.menuListTree.getCheckedKeys(true)) 得到是是一个key组成的数组，但无法返回有子节点的那种节点的key
        if (this.$refs.menuListTree.getCheckedKeys(true).length === 1 || this.isParentNode) {
          if (this.oldNodeKey === data.key) { // 啥也不改变噻
            this.dataForm.parentId = 0
            this.dataForm.parentName = ''
          }
        } else {
          this.dataForm.parentId = 0
          this.dataForm.parentName = ''
        }
      }
      // console.log(this.dataForm.parentId)
      // console.log(this.dataForm.parentName)
    },
    disabledTree (arr) {
      arr.forEach(item => {
        if (Number(item.key) === this.dataForm.id) {
          var str = JSON.parse(JSON.stringify(item.children).replace(/"label"/g, '"disabled":true,"label"'))
          item.children = str
          return false
        } else {
          this.disabledTree(item.children)
        }
      })
    },
    // undefined时‘添加’就用默认dataForm值，传值表示‘编辑’
    init (Id) {
      this.visible = true
      function getOneRow () {
        return API.menu.getEdit({id: Id})
      }
      function getMenuTree () {
        return API.menu.getTree() // 这个API请求未执行(百度到底咋回事，以前访问失败)
      }
      if (Id) {
        this.$ios.all([getOneRow(), getMenuTree()]).then(this.$ios.spread((result, response) => {
          if (result.code === '0000' && response.code === '0000') {
            // 请求对应单行的数据! 作为编辑弹窗的初始值（为什么弄并发请求呢? 因为程序自动选择菜单树那步可能会在完整的菜单树渲染完毕之前执行，导致此时菜单节点为空根本就无法选中）
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

            // 请求完整的菜单树
            this.menuList = JSON.parse(JSON.stringify(response.data).toLowerCase()) // 把后端的那个坑货的大写字母转小写方便直接用 key label children
            // 如果是编辑，还要禁用相应的菜单之下的子节点
            this.disabledTree(this.menuList)

            this.$nextTick(() => {
              this.menuListTreeSetCurrentNode()
            })
          }
        }))
      } else {
        API.menu.getTree().then(response => {
          if (response.data) {
            // var toptree = {'parentId': -1, 'id': -9999, 'name': '顶级目录', 'type': 0, children: alltree}
            // this.menuList = [toptree]
            this.menuList = JSON.parse(JSON.stringify(response.data).toLowerCase()) // 把后端的那个坑货的大写字母转小写方便直接用
            // this.$nextTick(() => {
            //   this.menuListTreeSetCurrentNode()
            // })
          }
        })
      }
    },
    menuListTreeSetCurrentNode () {
      // this.$refs.menuListTree.setCheckedKeys([this.dataForm.parentId])
      this.$refs.menuListTree.setChecked(this.dataForm.parentId, true)
      // this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['label'] // 获取当前被选中的节点的 data，若没有节点被选中则返回 null
      this.dataForm.parentName = (this.$refs.menuListTree.getNode(this.dataForm.parentId) || {})['label']
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // if (this.dataForm.parentId === -9999) {
          //   this.dataForm.parentId = null
          // }
          var tick = !this.dataForm.id ? API.menu.add(this.dataForm) : API.menu.edit(this.dataForm)
          this.visible = false
          tick.then(response => {
            if (response.code === '0000') {
              this.$message({
                message: `${this.dataForm.id ? '修改成功' : '新增成功'}`,
                type: 'success',
                duration: 3000,
                onClose: () => {
                  this.$emit('refreshDataList')
                }
              })
              // console.log(this.dataForm.menuUrl)
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
