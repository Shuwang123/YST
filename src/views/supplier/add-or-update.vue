<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.roleId ? '创建供应商' : '编辑供应商'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" v-loading="dataListLoading"
             class="supplier-dialog" label-width="100px">
      <el-form-item label="供应商" prop="ShortName">
        <el-input v-model="dataForm.ShortName" placeholder="请输入供应商"></el-input>
      </el-form-item>
      <el-form-item label="厂家" prop="Name">
        <el-input v-model="dataForm.Name" placeholder="请输入厂家名"></el-input>
      </el-form-item>
      <!--<el-form-item label="供应商编码" prop="Code">-->
        <!--<el-input v-model="dataForm.Code" placeholder="请输入供应商编码"></el-input>-->
      <!--</el-form-item>-->

      <el-form-item label="联系人" prop="Contact">
        <el-input v-model="dataForm.Contact" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <!--<el-form-item label="QQ" prop="QQ">-->
        <!--<el-input v-model.number="dataForm.QQ" placeholder="请输入QQ"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="联系电话" prop="Phone">
        <el-input v-model="dataForm.Phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="供应商地址" prop="Address">
        <el-input v-model="dataForm.Address" placeholder="请输入地址"></el-input>
      </el-form-item>

      <!--<el-form-item label="开户行" prop="Bank">-->
        <!--<el-input v-model="dataForm.Bank" placeholder="请输入开户行"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="税号" prop="TaxNo">-->
        <!--<el-input v-model="dataForm.TaxNo" placeholder="请输入税号"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="开户行账号" prop="BankAccount">-->
        <!--<el-input v-model.number="dataForm.BankAccount" placeholder="请输入开户行账号"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="开户名" prop="BankAccountName">-->
        <!--<el-input v-model="dataForm.BankAccountName" placeholder="请输入开户名"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="执照编号" prop="LicenseNo">-->
        <!--<el-input v-model="dataForm.LicenseNo" placeholder="请输入执照编号"></el-input>-->
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
// import {treeDataTranslate} from '@/utils'
import {Currency, Phone} from '../../utils/validate'
export default {
  data () {
    return {
      visible: false,
      dataListLoading: false,
      dataForm: {
        Name: '',
        ShortName: '',
        Contact: '',
        Phone: '',
        Address: '',

        Code: '', // 编辑时父层会提供
        QQ: '',
        Bank: '',
        TaxNo: '',
        BankAccount: '',
        BankAccountName: '',
        LicenseNo: ''
      },
      dataRule: {
        ShortName: Currency('供应商不能为空'),
        Name: Currency('厂家不能为空'),
        Code: Currency('供应商编码不能为空'),
        Contact: Currency('联系人不能为空'),
        Phone: Phone(1),
        BankAccount: [
          {required: true, message: '银行账号必填'},
          {type: 'number', message: '账号必须为数字'}
        ]
      }
    }
  },
  methods: {
    init (Code) {
      this.dataForm.Code = Code || ''
      this.visible = true
      if (this.dataForm.Code) {
        var parmet = {
          PageIndex: 1,
          PageSize: 10,
          IsPaging: true,
          name: '',
          Code: this.dataForm.Code
        }
        this.dataListLoading = true
        API.supplier.getSupplierList(parmet).then(response => {
          if (response.code === '0000') {
            this.dataForm = response.data[0]
          }
          this.dataListLoading = false
        })
      }
    },
    handleClose () {
      this.dataForm = {
        Name: '',
        ShortName: '',
        Contact: '',
        Phone: '',
        Address: '',

        Code: '', // 编辑时父层会提供
        QQ: '',
        Bank: '',
        TaxNo: '',
        BankAccount: '',
        BankAccountName: '',
        LicenseNo: ''
      }
      this.$refs.dataForm.clearValidate() // 移除校验结果，并重置为初始值
    },
    // 提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var paramsCreate = {

            Name: this.dataForm.Name,
            ShortName: this.dataForm.ShortName,
            Contact: this.dataForm.Contact,
            Phone: this.dataForm.Phone,
            Address: this.dataForm.Address,

            // Code: '',
            QQ: '',
            Bank: '',
            TaxNo: '',
            BankAccount: '',
            BankAccountName: '',
            LicenseNo: ''}
          var paramsEdit = {
            id: this.dataForm.Id,

            Name: this.dataForm.Name,
            ShortName: this.dataForm.ShortName,
            Contact: this.dataForm.Contact,
            Phone: this.dataForm.Phone,
            Address: this.dataForm.Address,

            Code: this.dataForm.Code,
            QQ: '',
            Bank: '',
            TaxNo: '',
            BankAccount: '',
            BankAccountName: '',
            LicenseNo: ''}
          console.log(paramsCreate, paramsEdit)
          let tick = !this.dataForm.Code ? API.supplier.createSupplier(paramsCreate) : API.supplier.editSupplier(paramsEdit)
          tick.then(data => {
            if (data.code === '0000') {
              this.$message({
                message: `新增成功`,
                type: 'success',
                duration: 1500
              })
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.supplier-dialog /deep/ {
  text-align: center;
}
</style>
