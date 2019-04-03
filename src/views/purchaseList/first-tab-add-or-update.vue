<template>
  <el-dialog
    v-dialogDrag
    :title="'采购单详情'" :width="isAddActive === false ? '60%' : '80%'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <!--<el-col><div style="border-top: 1px dashed #ccc;padding-top: 10px;font-weight: 900">别名（选填）</div></el-col>-->
    <el-container>
      <el-aside :width="isAddActive === false ? '100%' : '60%'">
        <div class="ownScrollbar" style="min-height: 500px;max-height: 500px;overflow-y: scroll;">
          <el-row>
            <el-col style="padding: 0 50px">
              <el-steps :active="1" finish-status="success" align-center>
                <el-step title="(待收货)已完成"></el-step>
                <el-step title="(未入库)进行中"></el-step>
                <el-step title="(已入库)步骤 3"></el-step>
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
            <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">药品：<b v-text="categoryName"></b></div></el-col>
          </el-row>
          <el-table  v-if="dataList !== null"
                     :data="dataList.Items"
                     stripe
                     v-loading="dataListLoading"
                     row-class-name="purchaseListRow"
                     :header-cell-style="$cxObj.tableHeaderStyle40px"
                     style="width: 100%;">
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column prop="ProductName" header-align="center" align="center" label="药品名称"></el-table-column>

            <el-table-column v-if="editType === 'A'" :key="Math.random()" prop="" header-align="center" :align="$store.state.common.align" label="采购数量" width="120">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.Quantity" :step="1" :min="1" :max="1000" size="mini" controls-position="right" style="width: 105px"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-else :key="Math.random()" prop="Quantity" header-align="center" align="center" label="采购数量"></el-table-column>

            <el-table-column v-if="editType === 'A'" :key="Math.random()" prop="" header-align="center" :align="$store.state.common.align" label="采购价格" width="110">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.CostPrice" :precision="2" :step="0.01" :min="0.01" :max="1000" size="mini" controls-position="right" style="width: 100px"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-else prop="CostPrice" header-align="center" align="center" label="采购价格"></el-table-column>

            <el-table-column prop="Amount" header-align="center" align="center" label="总价"></el-table-column>
            <el-table-column v-if="editType === 'B'" :key="Math.random()" prop="" header-align="center" :align="$store.state.common.align" label="批号填写">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.BatchNo" :step="1" :min="0" :max="10000" size="mini" controls-position="right"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-else prop="BatchNo" header-align="center" align="center" label="批号"></el-table-column>
            <el-table-column v-if="editType === 'A'" prop="" label="操作" width="50" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="leftRemove(scope.row.Id)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-aside>

      <el-main v-if="isAddActive" style="padding: 0 0 0 5px !important; border-left: 1px solid #E6E6E6">
        <!--<el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="0" :inline="true">-->
        <el-form :model="dataForm" ref="dataForm" label-width="0" :inline="true">
          <el-form-item label="" prop="SpellName">
            <el-input v-model="dataForm.SpellName" placeholder="拼音搜索" size="mini" clearable>
              <el-button slot="append" icon="el-icon-search" @click="drugsSearch()"></el-button>
            </el-input>
          </el-form-item>
          <!--@selection-change="selectionChangeHandle"-->
          <!--<el-table-column type="selection" header-align="center" :align="$store.state.common.align" width="50"></el-table-column>-->
          <el-table
            :data="dataListAdd" ref="tableChild"
            stripe
            :height="450"
            v-loading="dataListLoading"
            :header-cell-style="$cxObj.tableHeaderStyle40px"
            row-class-name="purchaseTableRowClass"
            style="width: 100%;">
            <el-table-column :align="$store.state.common.align" type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="Code" header-align="center" :align="$store.state.common.align" width="90" label="商品编码" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="CategoryName" header-align="center" :align="$store.state.common.align" width="" label="药态" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ShowName" header-align="center" :align="$store.state.common.align" label="药名" width="70" :show-overflow-tooltip="true"></el-table-column>
            <!--<el-table-column prop="Specification" header-align="center" :align="$store.state.common.align" label="规格" :show-overflow-tooltip="true"></el-table-column>-->
            <!--<el-table-column prop="Unit" header-align="center" :align="$store.state.common.align" label="单位"></el-table-column>-->
            <!--<el-table-column prop="RedLine" header-align="center" :align="$store.state.common.align" label="预警量" :show-overflow-tooltip="true"></el-table-column>-->
            <el-table-column prop="" label="操作" width="50" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="rightAdd(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-main>
    </el-container>
    <span v-if="editType !== ''" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="editType === 'A'" type="primary" @click="dataFormAdd()">新增药材</el-button>
      <el-button v-if="editType === 'A'" type="primary" @click="dataFormSubmitA()">保存</el-button>
      <el-button v-else-if="editType === 'B'" type="primary" @click="dataFormSubmitB()">确定入库</el-button>
    </span>
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
        SpellName: ''
      },
      dataList: null,
      editType: '', // 这个状态A表示待收货的编辑、B表示未入库的编辑、其他的表示查看
      categoryName: '',
      categoryId: '',

      isAddActive: false,
      dataListAdd: []
    }
  },
  methods: {
    comFunction () {
      API.drugs.getDrugsList({name: '', PageIndex: 1, PageSize: 10000, IsPaging: 'false', SpellName: this.dataForm.SpellName, CategoryId: this.categoryId}).then(result => {
        if (result.code === '0000') {
          this.dataListAdd = result.data
          this.dataList.Items.forEach(item0 => {
            this.dataListAdd = this.dataListAdd.filter(item => {
              return item0.ProductCode !== item.Code
            })
          })
        } else {
          this.$message({ message: '查询结果为空', type: 'warning', duration: 3000 })
        }
      })
    },
    dataFormAdd () {
      this.isAddActive = !this.isAddActive // 点击'[添加药材]'按钮
      if (this.isAddActive === false) {
        return false
      }
      this.comFunction()
    },
    leftRemove (Id) {
      this.dataList.Items = this.dataList.Items.filter(item => {
        return item.Id !== Id
      })
      if (this.isAddActive === true) {
        this.comFunction()
      }
    },
    rightAdd (row) {
      API.drugs.getDrugsList({name: '', PageIndex: 1, PageSize: 10000, IsPaging: 'false', SpellName: this.dataForm.SpellName, CategoryId: this.categoryId}).then(result => {
        if (result.code === '0000') {
          result.data.forEach(item => {
            if (item.Code === row.Code) {
              // this.dataList.Items.push(item) // 左边右边的table中row的详情不一样，脑壳大……
              this.dataList.Items.push({
                ActualAmount: 0,
                ActualOrderQuantity: 0,
                ActualQuantity: 0,
                ActualShipAmount: 0,
                ActualShipQuantity: 0,
                Amount: '',
                BatchNo: 0,
                BgColor: 'bg-danger',
                CargoFee: 0,
                Id: 127,
                InventoryQuantity: 0,
                Pictures: Array(3),
                Preferential: 0,
                ProductBatchNo: null,
                ProductCode: item.Code,
                ProductId: item.Id,
                ProductName: item.Name,
                SalePrice: 0,
                SapStoreCode: null,
                ShippedQuantityByFactory: 0,
                ShippedQuantityByInventory: 0,
                Specification: null,
                StoreId: 0,

                Quantity: item.Quantity,
                SapProductCode: item.Code,
                CostPrice: item.CostPrice,
                SupplierCode: item.SupplierCode,
                SupplierId: item.SupplierId,
                SupplierName: null,
                Unit: null
              })
              console.log(this.dataList.Items)
              return false
            }
          })
          this.$nextTick(() => {
            console.log('这儿没执行？')
            if (this.isAddActive === true) {
              this.comFunction()
            }
          })
        }
      })
    },
    // 获取某个采购单详情info
    init (id, type) {
      this.visible = true
      this.dataListLoading = true
      this.editType = type !== undefined ? type : ''
      if (id !== undefined) {
        API.purchase.getPurchaseInfo({id: id}).then(result => {
          if (result.code === '0000') {
            this.dataList = result.data
          }
          this.$nextTick(() => {
            API.drugs.getDrugsList({name: this.dataList.Items[0].ProductName, PageIndex: 1, PageSize: 1000, IsPaging: 'true', SpellName: '', CategoryId: ''}).then(result => {
              if (result.code === '0000') {
                result.data.forEach(item => {
                  if (item.Code === this.dataList.Items[0].ProductCode) {
                    this.categoryName = item.CategoryName
                    return false
                  }
                })
                API.drugs.getDrugsCategory().then(response => {
                  response.data.forEach(item => {
                    if (item.text === this.categoryName) {
                      this.categoryId = item.id
                      return false
                    }
                  })
                  this.dataListLoading = false
                })
              }
            })
          })
        })
      }
    },
    handleClose () {
      this.editType = ''
      this.isAddActive = false
    },
    dataFormSubmitA () { // 编辑的提交
      var params = {
        Address: this.dataList.Address,
        Buyer: this.dataList.Buyer,
        Phone: this.dataList.Phone,
        OrderType: this.dataList.OrderType,
        Remark: this.dataList.Remark,
        StoreId: this.dataList.StoreId,
        StoreCode: this.dataList.StoreCode,
        Items: JSON.stringify(this.dataList.Items.map(item => {
          return {
            ProductId: item.Id,
            CostPrice: item.CostPrice,
            Quantity: item.Quantity,
            SapProductCode: item.SapProductCode,
            SupplierId: item.SupplierId,
            SupplierCode: item.SupplierCode
          }
          // [{\"ProductId\":23,\"CostPrice\":0,\"Quantity\":3,\"SapProductCode\":\"10000109\",\"SupplierId\":1,\"SupplierCode\":\"6006\"}
        }))
      }
      console.log(params)
      API.purchase.editNumberAndPrice(params).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `编辑${result.message}`,
            duration: 1000
          })
          this.visible = false
        } else {
          this.$message({
            type: 'error',
            message: `${result.message}`,
            duration: 1000
          })
        }
      })
    },
    dataFormSubmitB () { // 入库的提交
      var params = {
        Code: this.dataList.Code,
        Id: this.dataList.Id,
        Remark: this.dataList.Remark,
        Items: JSON.stringify(this.dataList.Items.map(item => {
          return {
            Id: item.Id,
            ActualQuantity: item.Quantity,
            productBatchNo: item.BatchNo
          }
          // "[{\"Id\":96,\"ActualQuantity\":1,\"productBatchNo\":123123}, ]       }))
        }))
      }
      console.log(params)
      API.purchase.editBatchNo(params).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `编辑${result.message}`,
            duration: 1000
          })
          this.visible = false
        } else {
          this.$message({
            type: 'error',
            message: `${result.message}`,
            duration: 1000
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
