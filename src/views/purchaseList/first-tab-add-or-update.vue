<template>
  <el-dialog
    v-dialogDrag
    :title="'采购单详情'" width="50%"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <!--<el-col><div style="border-top: 1px dashed #ccc;padding-top: 10px;font-weight: 900">别名（选填）</div></el-col>-->
    <div class="ownScrollbar" style="min-height: 500px;max-height: 500px;overflow-y: scroll;">
      <el-row>
        <el-col style="padding: 0 50px">
          <el-steps :active="1" finish-status="success" align-center>
            <el-step title="已完成"></el-step>
            <el-step title="进行中"></el-step>
            <el-step title="步骤 3"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><p>采购人：<span v-if="dataList !== null">{{dataList.CreatedByName}}</span></p></el-col>
        <el-col :span="8"><p>供应商：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
        <el-col :span="8"><p>门店：<span v-if="dataList !== null">{{dataList.StoreName}}</span></p></el-col>
      </el-row>
      <el-row>
        <el-col :span="8"><p>联系人：<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
        <el-col :span="8"><p>电话：<span v-if="dataList !== null">{{dataList.Phone}}</span></p></el-col>
        <el-col :span="8"><p>地址：<span v-if="dataList !== null">{{dataList.Address}}</span></p></el-col>
      </el-row>
      <el-row>
        <el-col :span="16"><p>创建时间：<span v-if="dataList !== null">{{dataList.CreatedTime}}</span></p></el-col>
        <el-col :span="8"><p>备注：<span v-if="dataList !== null">{{dataList.Remark}}</span></p></el-col>
      </el-row>
      <el-row>
        <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">药品：<b>饮片</b></div></el-col>
      </el-row>
      <el-table  v-if="dataList !== null"
        :data="dataList.Items"
        stripe
        v-loading="dataListLoading"
        row-class-name="purchaseListRow"
        :header-cell-style="$cxObj.tableHeaderStyle40px"
        style="width: 100%;">
        <el-table-column type="index" align="center" label="序号" width=""></el-table-column>
        <el-table-column prop="ProductName" header-align="center" align="center" label="药品名称"></el-table-column>
        <el-table-column prop="Quantity" header-align="center" align="center" label="采购数量"></el-table-column>
        <el-table-column prop="CostPrice" header-align="center" align="center" label="采购价格"></el-table-column>
        <el-table-column prop="Amount" header-align="center" align="center" label="总价"></el-table-column>
      </el-table>
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="visible = false">取消</el-button>-->
        <!--<el-button type="primary" @click="dataFormSubmit()">确定添加</el-button>-->
      <!--</span>-->
    </div>
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
      dataListLoading: false, // 加载
      Id: '',
      dataForm: {
      },
      dataList: null
    }
  },
  methods: {
    // 获取某个采购单详情info
    init (id) {
      this.visible = true
      this.dataListLoading = true
      if (id !== undefined) {
        API.purchase.getPurchaseInfo({id: id}).then(result => {
          if (result.code === '0000') {
            this.dataList = result.data
            console.log(this.dataList)
            this.dataListLoading = false
          }
        })
      }
    },
    handleClose () {
      // this.$refs['dataForm'].resetFields()
      // this.Id = ''
      // this.dataForm = {}
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
