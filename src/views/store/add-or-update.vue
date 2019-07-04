<template>
  <el-dialog
    v-dialogDrag width="700px"
    :title="!dataForm.id ? '新增' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" v-loading="dataListLoading" label-width="80px">
      <el-form-item label="门店名称" prop="Name">
        <el-input v-model="dataForm.Name" placeholder="名店名称Name"></el-input>
      </el-form-item>

      <Address :lastCode="dataForm.AreaId" ref="comAddress" @chenxi="updataAddress"></Address>

      <el-form-item label="详细地址" prop="AddressInfo">
        <el-input v-model="dataForm.AddressInfo" placeholder="详细AddressInfo"></el-input>
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
import {Currency, Phone} from '../../utils/validate'

export default {
  components: {
    Address
  },
  data () {
    return {
      nodes: [],
      visible: false,
      dataListLoading: false,
      dataForm: {
        id: 0,
        Name: '',
        AreaId: '', // 最后一层的区域id
        AddressInfo: '',
        Contact: '',
        Phone: ''
      },
      dataRule: {
        Name: Currency('名称必填'),
        // Address: Currency('区级地址必填'),
        AddressInfo: Currency('详细地址必填'),
        Phone: Phone()
      }
    }
  },
  methods: {
    updataAddress (childCode) {
      // console.log(childCode)
      this.dataForm.AreaId = childCode
    },
    // 新增，编辑时获取单行详情info
    init (id) {
      this.visible = true
      this.dataForm.id = id || 0
      // 门店这的弹窗细心点会发现弹窗明显会慢一些，因为地址组件那个东东的缘故，js所执行的地区的那对象太大了，2019.05.23去掉了这的this.$nextTick(()=>{}),如果以后有啥问题，可以从这思考
      if (this.dataForm.id) {
        this.dataListLoading = true
        API.store.getStoreRow({id: this.dataForm.id}).then(result => {
          if (result.code === '0000') {
            this.dataForm = {
              id: result.data.Id,
              Name: result.data.Name,
              AreaId: result.data.AreaId,
              AddressInfo: result.data.Address,
              Contact: result.data.Contact,
              Phone: result.data.Phone
            }
          }
          this.$refs.comAddress.getAddress(this.dataForm.AreaId) // 调用自定义的全国统一地址子组件，上面有nextTick别看漏了
          this.dataListLoading = false
        })
      } else {
        this.$refs.comAddress.getAddress()
      }
    },

    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.dataForm = {
        id: 0,
        Name: '',
        AreaId: '',
        AddressInfo: '',
        Contact: '',
        Phone: ''
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            id: this.dataForm.id,
            Name: this.dataForm.Name,
            AreaId: this.dataForm.AreaId,
            Address: this.dataForm.AddressInfo,
            Contact: this.dataForm.Contact,
            Phone: this.dataForm.Phone
          }
          var tick = !this.dataForm.id ? API.store.addSubmit(params) : API.store.editSubmit(params)
          console.log(params)
          tick.then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: `${this.dataForm.id ? '编辑成功' : '新增成功'}`,
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

  }
}
</script>
