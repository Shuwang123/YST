<template>
  <el-dialog
    v-dialogDrag
    :title="'采购单详情'" width="50%"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <!--<el-col><div style="border-top: 1px dashed #ccc;padding-top: 10px;font-weight: 900">别名（选填）</div></el-col>-->
    <div style="min-height: 500px;max-height: 500px;">
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
        <el-col :span="8"><p>采购人：<span>{{dataList.CreatedByName !== null ? dataList.CreatedByName : '无'}}</span></p></el-col>
        <el-col :span="8"><p>供应商：<span>{{dataList.SupplierName}}</span></p></el-col>
        <el-col :span="8"><p>门店：<span>{{dataList.StoreName}}</span></p></el-col>
        <el-col :span="8"><p>联系人：<span>{{dataList.Buyer}}</span></p></el-col>
        <el-col :span="8"><p>电话：<span>{{dataList.Phone}}</span></p></el-col>
        <el-col :span="8"><p>地址：<span>{{dataList.Address}}</span></p></el-col>
        <el-col :span="16"><p>创建时间：<span>{{dataList.CreatedTime}}</span></p></el-col>
        <el-col :span="8"><p>备注：<span>{{dataList.CreatedByName}}</span></p></el-col>
      </el-row>
      <el-row>
        <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">药品信息：<b>饮片</b></div></el-col>
      </el-row>
      <el-table
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
      // this.dataForm = {
      // }
    }
  }
}
</script>
