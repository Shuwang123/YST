<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.id ? '新增药品信息' : '修改药品信息'" width="600px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px" size="small" :inline="true">
      <el-form-item label="药典名称" prop="Name">
        <el-input v-model="dataForm.Name" placeholder="药典规范名称"></el-input>
      </el-form-item>
      <el-form-item label="药品类别">
        <el-select v-model="dataForm.CategoryName" placeholder="药品种类" @change="categoryChange" style="width: 184px">
          <el-option v-if="item.pId !== null" v-for="item in drugsCategoryList" :key="item.id" :label="item.text" :value="item.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存药名" prop="ShowName">
          <el-input v-model="dataForm.ShowName" placeholder="药库自定名称"></el-input>
      </el-form-item>
      <el-form-item label="字母拼音" prop="SpellName">
          <el-input v-model="dataForm.SpellName" placeholder="首字母拼音缩写"></el-input>
      </el-form-item>

      <el-form-item label="单位">
        <el-select v-model="dataForm.Unit" placeholder="请选择药品单位" style="width: 184px">
          <el-option label="克" value="g"></el-option>
          <el-option label="毫升" value="ML"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格" prop="Specification">
        <el-input v-model="dataForm.Specification" placeholder="x*x/g"></el-input>
      </el-form-item>
      <el-form-item label="建议售价">
        <el-input v-model="dataForm.SalePrice" placeholder="建议零售价"></el-input>
      </el-form-item>
      <el-form-item label="预警量">
        <el-input v-model="dataForm.RedLine" placeholder="预警量"></el-input>
      </el-form-item>

      <!---->
      <el-row>
        <el-col><div style="border-top: 1px dashed #ccc;padding-top: 10px;font-weight: 900">别名（选填）</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords[0]" placeholder="中文名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords[1]" placeholder="拼音码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords[2]" placeholder="中文名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords[3]" placeholder="拼音码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords[4]" placeholder="中文名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords[5]" placeholder="拼音码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定添加</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
// import {treeDataTranslate} from '@/utils'
export default {
  components: {
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
      visible: false,
      drugsCategoryList: [], // 初始化药品种类

      Id: '',
      dataForm: {
        Name: '', // 药典名
        CategoryId: '1001',
        CategoryName: '饮片',

        ShowName: '', // 自己药库的名
        SpellName: '',
        Unit: '',
        Specification: '',
        SalePrice: '',
        RedLine: '',

        Keywords: ['', '', '', '', '', ''] // 别名
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
    // 新增，编辑时获取单行详情info
    init (id) {
      this.visible = true
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryList = result.data
          this.$nextTick(() => {
            if (id) {
              API.drugs.getEdit({id: id}).then(result => {
                if (result.code === '0000') {
                  this.dataForm = {
                    Name: result.data.Name, // 药典名
                    CategoryId: result.data.CategoryId,
                    CategoryName: result.data.CategoryName,

                    ShowName: result.data.ShowName, // 自己药库的名
                    SpellName: result.data.SpellName,
                    Unit: result.data.Unit,
                    Specification: result.data.Specification,
                    SalePrice: result.data.SalePrice,
                    RedLine: result.data.RedLine,
                    Keywords: result.data.Keywords.split(',') // 别名
                  }
                  this.Id = result.data.Id
                }
                console.log(this.dataForm)
              })
            }
          })
        }
      })
    },

    handleClose () {
      this.$refs['dataForm'].resetFields()
      this.Id = ''
      this.dataForm = {
        Name: '', // 药典名
        CategoryId: '1001',
        CategoryName: '饮片',
        ShowName: '', // 自己药库的名
        SpellName: '',
        Unit: '',
        Specification: '',
        SalePrice: '',
        RedLine: '',
        Keywords: ['', '', '', '', '', ''] // 别名
      }
    },
    categoryChange (text) {
      this.drugsCategoryList.forEach(item => {
        if (item.text === text) {
          this.dataForm.CategoryId = item.id
          return false
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            Id: this.Id,
            Name: this.dataForm.Name, // 药典名
            CategoryId: this.dataForm.CategoryId,
            CategoryName: this.dataForm.CategoryName,

            ShowName: this.dataForm.ShowName,
            SpellName: this.dataForm.SpellName,
            Unit: this.dataForm.Unit,
            Specification: this.dataForm.Specification,
            SalePrice: this.dataForm.SalePrice,
            RedLine: this.dataForm.RedLine,
            Keywords: this.dataForm.Keywords.join()
          }
          console.log(params)
          var tick = !this.Id ? API.drugs.createDrugs(params) : API.drugs.submitEdit(params)
          tick.then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: `${this.id ? '编辑成功' : '新增成功'}`,
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
