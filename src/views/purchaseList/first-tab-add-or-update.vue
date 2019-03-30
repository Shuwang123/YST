<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.id ? '新增药品信息' : '修改药品信息'" width="600px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <div class="ownScrollbar" style="min-height: 500px;max-height: 500px;overflow-y: scroll;">
      <el-row>
        <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">药品：<b>饮片</b></div></el-col>
      </el-row>
    </div>>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
// import {treeDataTranslate} from '@/utils'
export default {
  components: {
  },
  data () {
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

        Keywords0: '',
        Keywords1: '',
        Keywords2: '',
        Keywords3: '',
        Keywords4: '',
        Keywords5: ''
      },

      dataRule: {
        Name: Currency('此为必填项'),
        ShowName: Currency('此为必填项'),
        SpellName: Letter(1),
        Unit: Currency('必选项'),
        SalePrice: NumberFloat(),
        RedLine: NumberInt(),
        Keywords1: Letter(),
        Keywords3: Letter(),
        Keywords5: Letter()
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
                    Keywords0: result.data.Keywords.split(',')[0],
                    Keywords1: result.data.Keywords.split(',')[1],
                    Keywords2: result.data.Keywords.split(',')[2],
                    Keywords3: result.data.Keywords.split(',')[3],
                    Keywords4: result.data.Keywords.split(',')[4],
                    Keywords5: result.data.Keywords.split(',')[5],
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
        Keywords0: '',
        Keywords1: '',
        Keywords2: '',
        Keywords3: '',
        Keywords4: '',
        Keywords5: ''
      }
    },
    categoryChange (id) {
      this.drugsCategoryList.forEach(item => {
        if (item.id === id) {
          this.dataForm.CategoryName = item.text
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
            Keywords: [
              this.dataForm.Keywords0, this.dataForm.Keywords1,
              this.dataForm.Keywords2, this.dataForm.Keywords3,
              this.dataForm.Keywords4, this.dataForm.Keywords5
            ].join()
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
<style rel="stylesheet/scss" lang="scss" scoped>
.ownScrollbar::-webkit-scrollbar {
  width: 7px;
}
.ownScrollbar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background-color: #DDDEE0;
}
.ownScrollbar::-webkit-scrollbar-track {
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
