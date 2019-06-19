<template>
  <el-dialog
    v-dialogDrag
    :title="'门店库存调价'" :width="'667px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <div class="ownScrollbar" v-loading="dataListLoading" style="min-height: 400px;max-height: 400px;overflow-y: scroll;">
      <div v-if="dataList.length > 0">
        <el-row style="height: 35px;line-height: 35px">
          <el-col :span="24">
            <p style="width: 190px;"><span>门店：</span>{{dataList[0].StoreName}}</p>
          </el-col>
          <el-col :span="24"><p><span>商品编码：</span>{{dataList[0].ProductCode}}</p></el-col>
        </el-row>
        <el-row style="height: 35px;line-height: 35px">
          <el-col :span="8"><p><span>药材名称：</span>{{dataList[0].ProductName}}</p></el-col>
          <el-col :span="8"><p><span>药材拼音：</span>{{dataList[0].SpellName}}</p></el-col>
          <el-col :span="8"><p><span>余量：</span>{{dataList[0].Quantity}}</p></el-col>
        </el-row>
        <el-row style="height: 35px;line-height: 35px">
          <el-col :span="8"><p><span>规格：</span>{{dataList[0].Specification}}</p></el-col>
          <el-col :span="8"><p><span>预警值：</span>{{dataList[0].RedLine}}</p></el-col>
          <el-col :span="8"><p><span>售价：</span>{{dataList[0].StoreSalePrice}}</p></el-col>
          <el-col :span="8" :offset="16">修改售价：
            <el-input @blur="salePriceBlur()" v-model="dataForm.SalePrice" style="width: 100px" size="small"></el-input>
          </el-col>
        </el-row>
        <!--<el-row>-->
        <!--<el-col :span="24"><p>修改时间：<span>{{dataList.CreatedTime}}</span></p></el-col>-->
        <!--<el-col :span="24"><p>操作人：<span>{{dataList.Remark}}</span></p></el-col>-->
        <!--</el-row>-->
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
// import {treeDataTranslate} from '@/utils'
export default {
  watch: {
    'dataForm.SalePrice': function (newval, oldval) {
      // console.log(newval)
      if (newval.replace(/\s/g, '').length !== newval.length) {
        this.$alert('此处禁止填写‘空格’ ! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.SalePrice = ''
          }
        })
      }
      if (Number(newval) === 0) { return false }

      if (!this.ownReg.test(newval)) {
        this.$alert('你输入的金额不合规范! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.SalePrice = ''
          }
        })
      }
    }
  },
  data () {
    return {
      visible: false,
      dataListLoading: false, // 加载

      ownReg: /^\d+\.?\d{0,2}$/,
      dataList: [],
      dataForm: {
        SalePrice: 0
      }
    }
  },
  methods: {

    // 根据药品的编码，获取某个药品的info，虽然最后是改商品的售价
    init (row) {
      this.visible = true
      var params = {
        PageIndex: 1,
        PageSize: 10,
        IsPaging: true,
        StoreId: this.$store.getters.getAccountCurrentHandleStore,
        ProductCodeOrBarCode: row.ProductCode,
        ProductName: '',
        SpellName: '',
        Order: '',
        BrandId: '',
        RedLine: '',
        CategoryId: String(row.CategoryId)
      }
      this.dataListLoading = true
      API.storeStock.getStoreStock(params).then(result => {
        if (result.code === '0000') {
          this.dataList = result.data
          this.dataForm.SalePrice = result.data[0].StoreSalePrice
          console.log('陈希', result.data)
          this.dataListLoading = false
        }
      })
    },
    handleClose () {
      this.dataList = []
      this.dataForm = {
        SalePrice: 0
      }
    },
    salePriceBlur () {
      if (Number(this.dataForm.SalePrice) === 0 && this.dataForm.SalePrice.trim() !== '') {
        this.$alert('售价不能为0! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.SalePrice = ''
          }
        })
      }
    },
    // 提交商品新的售价
    dataFormSubmit () {
      if (this.dataForm.SalePrice === '') {
        this.$alert('未输入售价! ', '输入提示', {
          confirmButtonText: '确定',
        })
        return false
      }
      var params = {
        id: this.dataList[0].ProductId,
        storeSalePrice: Number(this.dataForm.SalePrice)
      }
      console.log(params)
      API.storeStock.editStoreStockSalePrice(params).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `编辑${result.message}`,
            duration: 1000
          })
          this.$emit('refreshDataList')
          this.visible = false
        }
      })
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.ownScrollbar::-webkit-scrollbar,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  width: 7px;
}
.ownScrollbar::-webkit-scrollbar-thumb,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background-color: #DDDEE0;
}
.ownScrollbar::-webkit-scrollbar-track,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
