<template>
  <el-dialog
    v-dialogDrag
    :title="!dataForm.id ? '新增药品信息' : '修改药品信息'" width="600px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="80px" size="small" :inline="true" v-loading="dataListLoading">
      <el-form-item label="药典名称" prop="Name">
        <el-input v-model="dataForm.Name" placeholder="药典规范名称"></el-input>
      </el-form-item>
      <el-form-item label="药品类别">
        <el-select v-model="dataForm.CategoryId" placeholder="药品种类" @change="categoryChange" style="width: 184px">
          <el-option v-if="item.pId !== null" v-for="item in drugsCategoryList" :key="item.id" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存药名" prop="ShowName">
          <el-input v-model="dataForm.ShowName" placeholder="药库自定名称"></el-input>
      </el-form-item>
      <el-form-item label="字母拼音" prop="SpellName">
          <el-input v-model="dataForm.SpellName" placeholder="首字母拼音缩写"></el-input>
      </el-form-item>

      <el-form-item label="单位" prop="Unit">
        <el-autocomplete popper-class="my-autocomplete" placeholder="请输入或选择单位" style="width: 184px"
          v-model="dataForm.Unit" :fetch-suggestions="querySearch" :popper-append-to-body="false"
          @select="handleSelect">
          <template slot-scope="{ item }">
            <div>
              <el-row>
                <el-col :span="6">{{ item.key }}</el-col>
                <el-col :span="18"><span style="font-size: 12px; color: #b4b4b4;">{{ item.val }}</span></el-col>
              </el-row>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>

      <el-form-item label="规格" prop="Specification">
        <el-input v-model="dataForm.Specification" placeholder="x*x/g"></el-input>
      </el-form-item>
      <!--<el-form-item label="建议售价" prop="SalePrice">-->
        <!--<el-input v-model="dataForm.SalePrice" placeholder="小数点后只能必须写2位"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="预警量" prop="RedLine">
        <el-input v-model="dataForm.RedLine" placeholder="预警量"></el-input>
      </el-form-item>

      <!---->
      <el-row>
        <el-col><div style="border-top: 1px dashed #ccc;padding-top: 10px;font-weight: 900">别名（选填）</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords0" placeholder="中文名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="Keywords1">
            <el-input v-model="dataForm.Keywords1" placeholder="拼音码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords2" placeholder="中文名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="Keywords3">
            <el-input v-model="dataForm.Keywords3" placeholder="拼音码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="6">
          <el-form-item label="">
            <el-input v-model="dataForm.Keywords4" placeholder="中文名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="Keywords5">
            <el-input v-model="dataForm.Keywords5" placeholder="拼音码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isOKClick">确定添加</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat, pinyinChenXi} from '../../utils/validate'
export default {
  components: {},
  watch: {
    'dataForm.ShowName': function (val, oldval) {
      var pinyin = pinyinChenXi() // 这个方法会返回一个拼音相关的对象
      this.dataForm.SpellName = pinyin.getCamelChars(val)
    }
  },
  data () {
    return {
      visible: false,
      dataListLoading: false,
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
        RedLine: 0,

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
        // SpellName: Letter(1),
        Unit: Currency('必选项'),
        // SalePrice: NumberFloat(),
        RedLine: NumberInt(),
        Keywords1: Letter(),
        Keywords3: Letter(),
        Keywords5: Letter()
      },
      unitArr: [
        { key: 'g', val: 'g' }, // key作用在搜索，val作用在取值
        { key: '条', val: '条' },
        { key: 'ML', val: 'ML' }
      ],
      isOKClick: false
    }
  },
  methods: {
    querySearch(str, cb) {
      var unitArr = this.unitArr
      var unitArr = str ? unitArr.filter(this.createFilter(str)) : unitArr
      // 调用 callback 返回建议列表的数据
      cb(unitArr)
    },
    createFilter(str) {
      return (item) => {
        return (item.key.toLowerCase().indexOf(str.toLowerCase()) === 0)
      }
    },

    handleSelect(item) {
      console.log(item)
      this.dataForm.Unit = item.val
    },

    // 新增，编辑时获取单行详情info
    init (id) {
      this.visible = true
      this.dataListLoading = true
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryList = result.data
          this.$nextTick(() => {
            if (id) {
              this.dataListLoading = true
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
                    SalePrice: '',
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
                this.dataListLoading = false
                // console.log(this.dataForm)
              })
            }
          })
          this.dataListLoading = false
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
        RedLine: 0,
        Keywords0: '',
        Keywords1: '',
        Keywords2: '',
        Keywords3: '',
        Keywords4: '',
        Keywords5: ''
      }
      this.isOKClick = false
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
      this.isOKClick = true
      setTimeout(() => {
        this.isOKClick = false
      }, 2000)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            Id: this.Id,
            Name: this.dataForm.Name.replace(/\s/g, ''), // 药典名
            CategoryId: this.dataForm.CategoryId,
            CategoryName: this.dataForm.CategoryName,

            ShowName: this.dataForm.ShowName.replace(/\s/g, ''), // 全部都要去空格
            SpellName: this.dataForm.SpellName.replace(/\s/g, ''), // 全部都要去空格
            Unit: this.dataForm.Unit,
            Specification: this.dataForm.Specification,
            SalePrice: '',
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

</style>
