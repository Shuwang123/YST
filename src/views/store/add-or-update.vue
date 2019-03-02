<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.roleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="dataForm.Id" placeholder="角色编码Id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="Name">
        <el-input v-model="dataForm.Name" placeholder="角色名称Name"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.Description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-cascader
          :options="options"
          change-on-select
        ></el-cascader>
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
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    }
  },
  methods: {
    init (id) {
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
                // console.log(arr.join())
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
      API.store.getAddress().then(result => {
        if (result.code === '0000') {
          console.log("激励大家")
          console.log(result.data)
          var data = JSON.parse(JSON.stringify(result.data).replace(/name/ig, 'label').replace(/id/ig, 'value'))
          this.options = data
        }
      })
    },
    handleClose () {
      // this.checkedKey = []
      this.$refs['dataForm'].resetFields()
      this.$refs.menuListTree.setCheckedKeys([])
      this.dataForm.Id = ''
      this.dataForm.Description = '' // 上面的清空表单，这个貌似没被清掉，不知道为啥子
    },
    // 表单提交
    dataFormSubmit () {
      this.checkedKey = this.$refs.menuListTree.getCheckedKeys()
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
