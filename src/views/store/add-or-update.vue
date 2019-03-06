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

      <Address :lastCode="dataForm.AreaId" ref="comAddress" @chenxi="updataAddress"></Address>

      <el-form-item label="详细地址" prop="Address">
        <el-input v-model="dataForm.Address" placeholder="详细address"></el-input>
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
import Address from '../common/address'
// import {treeDataTranslate} from '@/utils'
export default {
  components: {
    Address
  },
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
        id: 0,
        Name: '',
        AreaId: '', // 最后一层的区域id
        Address: '',
        Contact: '',
        Phone: ''
      },
      dataRule: {
        Name: [
          { required: true, message: '门店名称不能为空', trigger: 'blur' }
        ],
        Address: [
          { required: true, message: '门店地址不能为空', trigger: 'blur' }
        ],
        Phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    updataAddress (childCode) {
      console.log(childCode)
      this.dataForm.AreaId = childCode
      console.log(this.dataForm.AreaId)
    },
    // 新增，编辑时获取单行详情info
    init (id) {
      this.visible = true
      this.dataForm.id = id || 0
      this.$nextTick(() => {
        if (this.dataForm.id) {
          API.store.getStoreRow({id: this.dataForm.id}).then(result => {
            if (result.code === '0000') {
              this.dataForm = {
                id: result.data.Id,
                Name: result.data.Name,
                AreaId: result.data.AreaId,
                Address: result.data.Address,
                Contact: result.data.Contact,
                Phone: result.data.Phone
              }
            }
            this.$refs.comAddress.getAddress() // 调用自定义的全国统一地址子组件
          })
        } else { this.$refs.comAddress.getAddress() }
      })
    },

    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.dataForm = {
        id: 0,
        Name: '',
        AreaId: '',
        Address: '',
        Contact: '',
        Phone: ''
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            id: this.dataForm.Id,
            Name: this.dataForm.Name,
            AreaId: this.dataForm.AreaId,
            Address: this.dataForm.Address,
            Contact: this.dataForm.Contact,
            Phone: this.dataForm.Phone
          }
          var tick = !this.dataForm.Id ? API.store.addSubmit(params) : API.store.editSubmit(params)
          console.log(params)
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
