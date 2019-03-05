<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.Id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">
      <el-form-item label="门店名称" prop="Name">
        <el-input v-model="dataForm.Name" placeholder="名店名称Name"></el-input>
      </el-form-item>
      <el-form-item label="门店编码" prop="Code">
        <el-input v-model="dataForm.Code" placeholder="门店编码Code（勿必纯数字）"></el-input>
      </el-form-item>

      <!--这儿貌似还有bug，就是提交后返回一个很长的代码的错误，$message的方式，猜想是prop的值没有搭配v-model造成的，但是后来自己又好了，没找到根本原因-->
      <el-form-item prop="Address" label="门店地址">
        <el-cascader
          :options="allAddress"
          placeholder="选择地址"
          filterable
          @change="handleChange"
        ></el-cascader>
        <!--v-model="dataForm.arr" 这个值arr必须是个数组，字串时报错，当初被坑过-->
        <!--change-on-select-->
      </el-form-item>

      <el-form-item label="联系人" prop="Contact">
        <el-input v-model="dataForm.Contact" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="Phone">
        <el-input v-model="dataForm.Phone" placeholder="电话"></el-input>
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
      nodes: [],
      visible: false,
      dataForm: {
        Id: '0',
        Name: '',
        Code: '',
        Address: '',
        Contact: '',
        Phone: ''
        // arr: []
      },
      dataRule: {
        Name: [
          { required: true, message: '门店名称不能为空', trigger: 'blur' }
        ],
        Code: [
          { required: true, message: '门店编号不能为空', trigger: 'blur' }
        ],
        Address: [
          { required: true, message: '门店地址不能为空', trigger: 'blur' }
        ],
        Phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      allAddress: []
    }
  },
  methods: {
    handleChange (val) {
      // console.log(val)
      // console.log(this.dataForm.arr) el-cascader中的v-model='dataForm.arr' 这行值和上一行是同一个值，都必须是数组不然报错
      var province = ''
      var district = ''
      this.allAddress.forEach(item => {
        if (item.value === val[0]) {
          province = item.label
          item.children.forEach(item2 => {
            if (item2.value === val[1]) {
              district = item2.label
            }
          })
          this.dataForm.Address = `${province}/${district}`
          return false
        }
      })
    },
    init (id) {
      this.visible = true
      this.dataForm.Id = id || 0
      this.$nextTick(() => {
        if (this.dataForm.Id) {
          API.store.getStoreRow({id: this.dataForm.Id}).then(result => {
            console.log(result) // 方法调用返回110？？？
            console.log('陈工')
            if (result.code === '0000') {
              this.dataForm.Name = result.data // ???
            }
          })
        } else {
        //  添加，就啥也不做只打开窗口无初始值
        }
      })

      // 获得哥给的未排版地址 list，全部都是同层的
      API.store.getAddress().then(result => {
        if (result.code === '0000') {
          // var data = JSON.parse(JSON.stringify(result.data).replace(/name/ig, 'label').replace(/id/ig, 'value').replace())
          var arr = []
          result.data.forEach(item => {
            if (item.pId === null) {
              arr.push({value: item.id, label: item.name.slice(9), children: []})
            }
          })
          // setTimeout(function () {
          result.data.forEach(item => {
            if (item.pId !== null) {
              arr.forEach(i => {
                if (i.value === item.pId) {
                  i.children.push({value: item.id, label: item.name.slice(9), children: []})
                  return false
                }
              })
            }
          })
          console.log(arr)
          // }, 3000)
          // setTimeout(function () {
          result.data.forEach(item => {
            if (item.pId !== null) {
              arr.forEach(i => {
                i.children.forEach(j => {
                  if (j.value === item.pId) {
                    j.children.push({value: item.id, label: item.name.slice(9)})
                    return false
                  }
                })
              })
            }
          })
          console.log(arr)
          // }, 10000)
          // console.log(result.data)
          console.log(arr)
          this.allAddress = arr
          setTimeout(() => {
            this.allAddress = arr
          }, 11000)
        }
      })
    },
    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.dataForm = {
        Id: '0',
        Name: '',
        Code: '',
        Address: '',
        Contact: '',
        Phone: ''
      }
      this.address = [] // 这有bug吗，仔细想想以后
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            id: this.dataForm.Id,
            Name: this.dataForm.Name,
            AreaId: this.dataForm.Code,
            Address: this.dataForm.Address,
            Contact: this.dataForm.Contact,
            Phone: this.dataForm.Phone
          }
          var tick = !this.dataForm.Id ? API.store.addSubmit(params) : API.store.editSubmit(params)
          tick.then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: `${this.dataForm.Id ? '编辑成功' : '新增成功'}`,
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
    // 递归获取节点
    // getNodes (treenodes) {
    //   if (treenodes.length > 0) {
    //     for (var i = 0; i < treenodes.length; i++) {
    //       if (treenodes[i].children) {
    //         this.getNodes(treenodes[i].children)
    //       } else {
    //         this.nodes.push(treenodes[i].id)
    //       }
    //     }
    //   }
    // }
  }
}
</script>
