<template>
  <el-dialog
    v-dialogDrag
    :title="'采购单详情'" :width="isAddActive === false ? '1005px' : '85%'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <!--<el-col><div style="border-top: 1px dashed #ccc;padding-top: 10px;font-weight: 900">别名（选填）</div></el-col>-->
    <el-container v-loading="dataListLoading"><!-- display: none -->
      <el-aside :width="isAddActive === false ? '100%' : '60%'">
        <div class="ownScrollbar" ref="ownOnscroll" @scroll="scroll"
             style="min-height: 500px;max-height: 500px;overflow-y: scroll;">

          <!--头部状态-->
          <el-row>
            <el-col style="padding: 0 50px">
              <el-steps :active="stepActive" process-status="success" finish-status="success" align-center>
                <el-step title="待收货(已创建采购单)" description="药房还未录入实际到货量、采购价、门店售价"></el-step>
                <el-step title="未入库" description="药房还未录入商品批次号"></el-step>
                <el-step title="已入库" description="整个采购计划已完毕"></el-step>
              </el-steps>
            </el-col>
          </el-row>
          <!--头部采购单其他信息-->
          <el-row>
            <el-col :span="8"><p>采购人：<span v-if="dataList !== null">{{dataList.CreatedByName}}</span></p></el-col>
            <el-col :span="8"><p>供应商：<span v-if="dataList !== null">{{dataList.SupplierName}}</span></p></el-col>
            <el-col :span="8">
              <p style="width: 190px;">门店：
                <span v-if="dataList !== null" style="display: inline-block; vertical-align: bottom; width: 134px; overflow: hidden; text-overflow:ellipsis;white-space:nowrap;">{{dataList.StoreName}}</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8"><p>联系人：<span v-if="dataList !== null">{{dataList.Buyer}}</span></p></el-col>
            <el-col :span="8"><p>电话：<span v-if="dataList !== null">{{dataList.Phone}}</span></p></el-col>
            <el-col :span="8"><p>地址：<span v-if="dataList !== null">{{dataList.Address}}</span></p></el-col>
          </el-row>
          <el-row>
            <el-col :span="8"><p>创建时间：<span v-if="dataList !== null">{{dataList.CreatedTime | myDateFilter('yyyy-MM-dd hh:mm:ss')}}</span></p></el-col>
            <el-col :span="15"><p>备注：<span v-if="dataList !== null">{{dataList.Remark}}</span></p></el-col>
          </el-row>
          <el-row>
            <el-col><div style="padding-top: 5px;font-weight: 900;color: #1CA579">药品：<b v-text="categoryName"></b></div></el-col>
          </el-row>

          <!--主体：列表展示-->
          <el-table  v-if="dataList !== null" :key="Math.random()"
                     :data="dataList.Items"
                     stripe
                     row-class-name="purchaseListRow"
                     :header-cell-style="$cxObj.tableHeaderStyle40px"
                     style="width: 100%;">
            <!--<el-table-column prop="Id" align="center" label="ID" width="50"></el-table-column>-->
            <el-table-column type="index" align="center" label="序号" fixed width="50"></el-table-column>
            <el-table-column prop="ProductCode" align="center" label="商品编码" fixed min-width="85" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="CategoryName" header-align="center" align="center" label="药态" fixed min-width="70" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ProductName" header-align="center" align="center" label="药品名称" fixed min-width="80" :show-overflow-tooltip="true"></el-table-column>

            <!--采购数量-->
            <el-table-column v-if="editType === 'A'" :key="Math.random()" label="采购数量" header-align="center" :align="$store.state.common.align" width="115">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.Quantity"
                                 :step="1" :min="1" :max="50000" size="mini" controls-position="right" style="width: 105px"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-else prop="Quantity" :key="Math.random()" label="采购数量" header-align="center" align="center"></el-table-column>

            <!--前采购价-->
            <el-table-column prop="LastCostPirce" header-align="center" align="center" label="前采购价"></el-table-column>

            <!--现采购价：就是进价!!!-->
            <el-table-column v-if="editType === 'A'" :key="Math.random()" label="现采购价" header-align="center" :align="$store.state.common.align" width="115">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.CostPrice" :precision="4" :step="0.01" :min="0.001" :max="1000" size="mini" controls-position="right" style="width: 105px"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column v-else prop="CostPrice" header-align="center" label="现采购价" align="center"></el-table-column>

            <!--门店售价填写-->
            <!--<el-table-column v-if="editType === 'B'" :key="Math.random()" label="售价填写" prop="" header-align="center" :align="$store.state.common.align" width="110">-->
              <!--<template slot-scope="scope">-->
                <!--<el-input-number v-model="scope.row.StoreSalePrice" :precision="2" :step="0.01" :min="0.01" :max="1000" size="mini" controls-position="right" style="width: 100px"></el-input-number>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column v-if="editType !== 'B'" prop="StoreSalePrice" label="售价" header-align="center" align="center"></el-table-column>-->

            <!--生产日期 填写：2019.07.01-->
            <el-table-column v-if="editType === 'B'" :key="Math.random()" label="生产日期" header-align="center" :align="$store.state.common.align" width="140">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.ProductionDate"
                  align="right"
                  type="date" size="mini"
                  placeholder="生产日期"
                  :picker-options="pickerOptions_0" style="width: 128px">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column v-if="dataList.Status !== 1 && dataList.Status !== -1 && editType !== 'B'" :key="Math.random()" label="生产日期" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.ProductionDate === null">未填写</span>
                <span v-else>{{scope.row.ProductionDate | myDateFilter('yyyy-MM-dd')}}</span>
              </template>
            </el-table-column>

            <!--保质期 填写：2019.07.01-->
            <el-table-column v-if="editType === 'B'" :key="Math.random()" label="有效期" header-align="center" :align="$store.state.common.align" width="140">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.ExpiryDate" @focus="ExpiryDateFocus(scope.row.ProductionDate)"
                  align="right"
                  type="date" size="mini"
                  placeholder="有效期"
                  :picker-options="pickerOptions_1" style="width: 128px">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column v-if="dataList.Status !== 1 && dataList.Status !== -1 && editType !== 'B'" :key="Math.random()" label="有效期" header-align="center" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.ExpiryDate === null">未填写</span>
                <span v-else>{{scope.row.ExpiryDate | myDateFilter('yyyy-MM-dd')}}</span>
              </template>
            </el-table-column>

            <!--翻页：批号录入-->
            <!--<el-table-column prop="Amount" header-align="center" align="center" label="总价"></el-table-column>-->
            <el-table-column v-if="editType === 'B'" :key="Math.random()" prop="" header-align="center" :align="$store.state.common.align" label="批号填写" width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.lll" placeholder="批号录入" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="dataList.Status === 10" prop="ProductBatchNo" header-align="center" align="center" label="批号"></el-table-column>

            <el-table-column v-if="editType === 'A'" prop="" label="操作" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="leftRemove(scope.row.ProductId)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <p style="font-size: 16px;height: 40px;line-height: 40px">采购单总金额：￥
            <span style="color: #e4393c">{{OrderTotalPrice.toFixed(2)}}</span>
          </p>
        </div>

        <!--24.10：9.31cm-->
        <!--打印层 -->
        <!--打印层 -->
        <!--打印层 财务（入库单）--><!-- style="display: none" -->
        <div id="chenxiPrint" v-if="dataList !== null" style="display: none">
          <div v-for="index in pages" :key="index" style="font-size: 12px;"> <!-- 循环开始 -->
            <div>
              <div style="text-align: center;font-size: 18px;font-weight: 900">重庆渝北一善堂中医门诊部（入库单）</div>
              <div>
                <div style="display: inline-block;width: 30%;text-align: left">供货企业：{{dataList.SupplierName}}</div>
                <div style="display: inline-block;width: 25%;text-align: right">入库时间：{{dataList.CreatedTime | myDateFilter('yyyy-MM-dd')}}</div>
                <div style="display: inline-block;width: 40%;text-align: right">单据编号：{{dataList.Code}}</div>
              </div>
            </div>
            <table border="1" style="border-collapse: collapse;border-sizing: border-box" width="100%">
              <tbody style="text-align: center;line-height: 16px">
              <tr style="font-size: 12px">
                <td height="16"><p>排序</p></td>
                <td>商品编码</td>
                <td>商品名称</td>
                <td>规格</td>
                <td>生成厂家</td>

                <td>单位</td>
                <td>数量</td>
                <td>进价</td>
                <td>金额</td>
                <td>批号</td>
              </tr>
              <tr  style="font-size: 12px" v-for="(item, ind) in dataList.Items.slice((index - 1) * 10, (index * 10))" :key="item.ProductCode">
                <td width="50" height="16">{{ind + (index - 1) * 10 + 1}}</td>
                <td width="70">{{item.ProductCode}}</td>
                <td width="100" align="center"><p style="width: 100px;margin: 0 5px;white-space: nowrap;overflow: hidden;">{{item.ProductName}}</p></td>
                <td width="70" align="center"><p style="width: 70px;margin: 0 5px;white-space: nowrap;overflow: hidden;">{{item.Specification}}</p></td>
                <td width="100" align="center"><p style="width: 100px;margin: 0 5px;white-space: nowrap;overflow: hidden;">{{dataList.SupplierName}}</p></td>

                <td width="50">{{item.Unit}}</td>
                <td width="70">{{item.Quantity}}</td>
                <td width="70">{{item.CostPrice.toFixed(4)}}</td>
                <td width="70">{{(item.Quantity * item.CostPrice).toFixed(2)}}</td>
                <td width="100" align="center"><p style="width: 100px;white-space: nowrap;overflow: hidden;">{{item.ProductBatchNo}}</p></td>
              </tr>
              <tr style="font-size: 12px">
                <td colspan="2" align="center" height="16">总 {{dataList.Items.length}} 笔</td>
                <td colspan="6" align="left" style="padding: 0 10px;font-weight: bold">{{index === pages ? '全部总计：￥' + sumCountAll(dataList.Items) +
                  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大写：' + sumCountChinese(sumCountAll(dataList.Items)) : ''}}</td>
                <td colspan="2" align="center">本页合计：{{sumCount(index)}}</td>
              </tr>
              </tbody>
            </table>
            <div>
              <div style="display: inline-block;width: 30%;text-align: left">创建人：{{dataList.CreatedByName}}</div>
              <div style="display: inline-block;width: 25%;text-align: right">入库人：{{$store.getters.getAccountLoginInfoAll.NickName}}</div>
              <div style="display: inline-block;width: 40%;text-align: right;">第 {{index}} 页，共 {{pages}} 页</div>
            </div>
            <div style="page-break-after: always"></div>
          </div>
        </div>

        <!--导出excel功能-->
        <table ref="myExportExcelPurchase" style="display: none">
          <tr>
            <th v-for="val in thPurchaseArr" v-text="val"></th>
          </tr>
          <tr v-if="dataList !== null" :data="dataList.Items"
              v-for="(item, index) in dataList.Items">
            <td v-text="index"></td>
            <td v-text="item.ProductCode"></td>
            <td v-text="item.CategoryName"></td>
            <td v-text="item.ProductName"></td>
            <td v-text="item.Quantity"></td>
            <td v-text="item.CostPrice"></td>
          </tr>
        </table>
        <!--<table ref="myExportExcelCaiwu" style="display: none">-->
        <!--<tr>-->
        <!--<th v-for="val in thCaiwuArr" v-text="val"></th>-->
        <!--</tr>-->
        <!--<tr v-for="item in dataList">-->
        <!--&lt;!&ndash;<td v-for="val in item">{{val}}</td>&ndash;&gt;-->
        <!--<td v-text="item.StoreName"></td>-->
        <!--<td v-text="item.ProductId"></td>-->
        <!--<td v-text="item.ProductCode"></td>-->
        <!--<td v-text="item.ProductName"></td>-->
        <!--<td v-text="item.CategoryId"></td>-->
        <!--<td v-text="item.CategoryName"></td>-->
        <!--<td v-text="item.Quantity"></td>-->
        <!--<td v-text="item.YBQuantity"></td>-->
        <!--<td v-text="item.ZFQuantity"></td>-->
        <!--<td v-text="item.StoreSalePrice"></td>-->
        <!--</tr>-->
        <!--</table>-->
      </el-aside>

      <!--右侧：追加药材-->
      <el-main v-if="isAddActive" style="padding: 0 0 0 5px !important; border-left: 1px solid #E6E6E6">
        <!--<el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="0" :inline="true">-->
        <!--<el-form class="purchaseListInfo" :model="dataForm" ref="dataForm" label-width="0" :inline="true">-->
          <!--<el-form-item label="" prop="SpellName">-->
            <!--<el-input v-model="dataForm.SpellName" placeholder="拼音搜索" size="mini" clearable>-->
              <!--<el-button slot="append" icon="el-icon-search" @click="drugsSearch()"></el-button>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
          <!--&lt;!&ndash;@selection-change="selectionChangeHandle"&ndash;&gt;-->
          <!--&lt;!&ndash;<el-table-column type="selection" header-align="center" :align="$store.state.common.align" width="50"></el-table-column>&ndash;&gt;-->
          <!--<el-table-->
            <!--:data="dataListAdd" ref="tableChild" :key="Math.random()"-->
            <!--stripe-->
            <!--:height="450"-->
            <!--v-loading="dataListLoading"-->
            <!--:header-cell-style="$cxObj.tableHeaderStyle40px"-->
            <!--row-class-name="purchaseTableRowClass"-->
            <!--style="width: 100%;">-->
            <!--<el-table-column :align="$store.state.common.align" type="index" label="序号" width="50px"></el-table-column>-->
            <!--<el-table-column prop="Code" header-align="center" :align="$store.state.common.align" width="90" label="商品编码" :show-overflow-tooltip="true"></el-table-column>-->
            <!--<el-table-column prop="CategoryName" header-align="center" :align="$store.state.common.align" width="" label="药态" :show-overflow-tooltip="true"></el-table-column>-->
            <!--<el-table-column prop="ShowName" header-align="center" :align="$store.state.common.align" label="药名" width="70" :show-overflow-tooltip="true"></el-table-column>-->
            <!--&lt;!&ndash;<el-table-column prop="Specification" header-align="center" :align="$store.state.common.align" label="规格" :show-overflow-tooltip="true"></el-table-column>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-table-column prop="Unit" header-align="center" :align="$store.state.common.align" label="单位"></el-table-column>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-table-column prop="RedLine" header-align="center" :align="$store.state.common.align" label="预警量" :show-overflow-tooltip="true"></el-table-column>&ndash;&gt;-->
            <!--<el-table-column prop="Quantity" header-align="center" :align="$store.state.common.align" label="库存" :show-overflow-tooltip="true"></el-table-column>-->
            <!--<el-table-column prop="" label="操作" width="50" header-align="center" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-button type="text" @click="rightAdd(scope.row)">添加</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
        <!--</el-form>-->
      </el-main>
    </el-container>

    <!--底部：footer按钮-->
    <span v-if="editType !== ''" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <!--<el-button v-if="editType === 'A'" type="primary" @click="dataFormAdd()">新增药材</el-button>-->
      <el-button v-if="editType === 'A'" type="primary" @click="dataFormSubmitA()"
                 :disabled="rukuIsDisabled">保存
      </el-button>
      <el-button v-else-if="editType === 'B'" type="primary" @click="dataFormSubmitB()"
                 :disabled="rukuIsDisabled">确定入库
      </el-button>
    </span>
    <span v-else-if="stepActive === 0" slot="footer" class="dialog-footer">
      <el-button @click="excelExports('purchase')">导出Excel(采购单)</el-button>
    </span>
    <span v-else-if="stepActive === 2" slot="footer" class="dialog-footer">
      <el-button @click="chenxiPrint()">打印入库单</el-button>
      <!--<el-button @click="excelExports('caiwu')">导出Excel(财务入库单)</el-button>-->
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
// import {treeDataTranslate} from '@/utils'
import {myExportExcel} from '@/utils'

export default {
  components: {
  },
  watch: {
    'dataList.Items': function (val, oldval) {
      this.pages = parseInt(val.length / 10 + 1) // 循环打印相关参数
      if (val.length !== 0 && (val.length % 10) === 0) {
        this.pages-- // 针对刚好10条那种
      }
    }
  },
  data () {
    return {
      stepActive: -1,
      visible: false,
      dataListLoading: false, // 加载
      Id: '',
      dataForm: {
        SpellName: ''
      },
      dataList: null,
      thPurchaseArr: ['序号','商品编码','商品种类','商品名称','采购量','采购价'],
      // thCaiwuArr: ['门店','商品Id','商品编码','商品名称','分类编码'],

      editType: '', // 状态A表示待收货编辑、B表示未入库编辑、其他的表示查看
      categoryName: '',
      categoryId: '',

      isAddActive: false,
      dataListAdd: [],
      OrderTotalPrice: 0, // 采购单总价显示
      pickerOptions_0: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{ // 快捷方式
          text: '1月前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 24 * 30 * 1000)
            picker.$emit('pick', date)
          }
        }, {
          text: '6月前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 24 * 180 * 1000)
            picker.$emit('pick', date)
          }
        }, {
          text: '1年前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 24 * 365 * 1000)
            picker.$emit('pick', date)
          }
        }]
      },
      pickerOptions_1: null,
      pages: 1, // 打印循环 相关参数

      rukuIsDisabled: false, // 入库时防止双击带来一些bug
      lastPosition: 0
    }
  },
  updated () {
    this.scrollFun()
  },
  methods: {
    // 处理采购弹窗在input输入值之后，数据变化时滚动上的一些缺陷
    scroll () {
      this.lastPosition = event.target.scrollTop
      // console.log('scroll', event.target.scrollTop)
    },
    scrollFun () {
      this.$refs.ownOnscroll.scrollTo(0, this.lastPosition)
    },

    // 打印页，每页的合计金额
    sumCount (n) {
      return this.dataList.Items.slice((n - 1) * 10, n * 10).map(item => item.CostPrice * item.Quantity).reduce((pren, nextm) => pren + nextm).toFixed(2)
    },
    // 所有页的合计金额
    sumCountAll (arr) {
      return arr.map(item => item.CostPrice * item.Quantity).reduce((pren, nextm) => pren + nextm).toFixed(2)
    },
    // 总的合计金额转中文大写
    sumCountChinese (n) {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法'
      var unit = '千百拾亿千百拾万千百拾元角分'
      var str = ''
      n += '00'
      var p = n.indexOf('.')
      if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2)
      unit = unit.substr(unit.length - n.length)
      for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
      return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整')
    },

    ExpiryDateFocus (ProductionDate) {
      // 有效期聚焦的时候，会获取当前行前面的生成日期，如果生成日期有值的时候
      // 就会以本行的生成日期为基础，计算相对于此生产日期之后 半年，一年，三年后的有效期
      var preProductionDate = ProductionDate === null ? new Date() : ProductionDate
      this.pickerOptions_1 = { // 快捷方式
        shortcuts: [{
          text: '3个月',
          onClick (picker) {
            const date = new Date(preProductionDate)
            date.setTime(date.getTime() + 3600 * 24 * 30 * 3 * 1000 + 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '6个月',
          onClick (picker) {
            const date = new Date(preProductionDate)
            date.setTime(date.getTime() + 3600 * 24 * 30 * 6 * 1000 + 3600 * 24 * 3 * 1000)
            picker.$emit('pick', date)
          }
        }, {
          text: '1年（12月）',
          onClick (picker) {
            const date = new Date(preProductionDate)
            date.setTime(date.getTime() + 3600 * 24 * 30 * 12 * 1000 + 3600 * 24 * 7 * 1000)
            picker.$emit('pick', date)
          }
        }, {
          text: '1年半（18月）',
          onClick (picker) {
            const date = new Date(preProductionDate)
            date.setTime(date.getTime() + 3600 * 24 * 30 * 18 * 1000 + 3600 * 24 * 10 * 1000)
            picker.$emit('pick', date)
          }
        }, {
          text: '2年',
          onClick (picker) {
            const date = new Date(preProductionDate)
            date.setTime(date.getTime() + 3600 * 24 * 30 * 24 * 1000 + 3600 * 24 * 14 * 1000)
            picker.$emit('pick', date)
          }
        }, {
          text: '3年',
          onClick (picker) {
            const date = new Date(preProductionDate)
            date.setTime(date.getTime() + 3600 * 24 * 30 * 36 * 1000 + 3600 * 24 * 21 * 1000)
            picker.$emit('pick', date)
          }
        }]
      }
    },

    comFunction () {
      // 这请求起点 药材的接口要改成，请求对应门店库存的接口（这个后来崩了） 后来 又改回老接口了
      API.drugs.getDrugsList({
        Name: '',
        PageIndex: 1,
        PageSize: 10000,
        IsPaging: 'false',
        SpellName: this.dataForm.SpellName,
        CategoryId: this.categoryId,
        StoreId: this.dataList.StoreId,
        CodeOrBarCode: ''
      }).then(result => {
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
    // 先初始化 右边 待添加的药材列表
    // dataFormAdd () {
    //   this.isAddActive = !this.isAddActive // 点击'[添加药材]'按钮
    //   if (this.isAddActive === false) {
    //     return false
    //   }
    //   this.comFunction()
    // },
    leftRemove (ProductId) {
      this.dataList.Items = this.dataList.Items.filter(item => {
        return item.ProductId !== ProductId
      })
      // if (this.isAddActive === true) {
      //   this.comFunction()
      // }
    },
    // rightAdd (row) {
    //   // 这为什么要发个请求呢，看起来没必要，但其实左右el-table的详情展示不同（来源的接口也不同），右边无法直接传递自己的值给左边
    //   API.drugs.getDrugsList({name: '', PageIndex: 1, PageSize: 10000, IsPaging: 'false', SpellName: this.dataForm.SpellName, CategoryId: this.categoryId}).then(result => {
    //     if (result.code === '0000') {
    //       result.data.forEach(item => {
    //         if (item.Code === row.Code) {
    //           // this.dataList.Items.push(item) // 左边右边的table中row的详情不一样，脑壳大……
    //           this.dataList.Items.push({
    //             Id: '', // 这个明细id啥时候才起作用 CategoryName
    //             ProductId: item.Id, // need 这儿为什么需要商品id而不需要明细id
    //             SapProductCode: item.Code, // need
    //             ProductCode: item.Code, // need
    //             ProductName: item.ShowName, // need
    //             Specification: null,
    //             Unit: 'g',
    //             CostPrice: item.SalePrice, // need
    //             SalePrice: 0,
    //             Preferential: 0,
    //             CategoryId: '',
    //             CategoryName: item.CategoryName, // need
    //             Quantity: item.Quantity, // need
    //             Amount: 0.33,
    //             ActualShipAmount: 0,
    //             ActualAmount: 0,
    //             ActualShipQuantity: 0,
    //             ActualQuantity: 0,
    //             BgColor: 'bg-danger',
    //             SupplierId: 0, // ???取不到哦
    //             SupplierCode: null, // ???取不到哦
    //             SupplierName: null,
    //             InventoryQuantity: 0,
    //             BatchNo: 0,
    //             ProductBatchNo: null,
    //             CargoFee: 0,
    //             Pictures: [
    //               '/Content/AdminLTE/img/default-50x50.gif',
    //               '/Content/AdminLTE/img/default-50x50.gif',
    //               '/Content/AdminLTE/img/default-50x50.gif'
    //             ],
    //             StoreId: '', // ???取不到哦,这个貌似确定取不到
    //             SapStoreCode: null,
    //             ShippedQuantityByInventory: 0,
    //             ShippedQuantityByFactory: 0,
    //             ActualOrderQuantity: 0
    //           })
    //           console.log(this.dataList.Items)
    //           return false
    //         }
    //       })
    //       this.$nextTick(() => {
    //         if (this.isAddActive === true) {
    //           this.comFunction()
    //         }
    //       })
    //     }
    //   })
    // },
    // 获取某个采购单详情info
    init (id, type) {
      this.visible = true
      this.dataListLoading = true
      this.editType = type !== undefined ? type : '' // A B 不同编辑类型页面会展示不同的input和‘按钮’
      if (id !== undefined) {
        API.purchase.getPurchaseInfo({id: id}).then(result => {
          if (result.code === '0000') {
            result.data.Items.map(item => {
              item.lll = '' // 这个lll本来就是ProductBatchNo，但不晓得为嘛子就是要在输入的时候光标强行失去焦点，脑壳真的大，换个字段就行（为啥突然冒出个lll的原因），真不晓得这是啥子chicken的bug
              return item
            })
            this.dataList = result.data
            console.log(result.data.Items)

            // 2019.06.01 展示采购单总价
            this.dataList.Items.forEach(item => {
              this.OrderTotalPrice += item.Quantity * item.CostPrice
            })

            this.categoryId = this.dataList.Items[0].CategoryId
            this.categoryName = this.dataList.Items[0].CategoryName // 返回的采购单详情里每个药材对象中都包含药态，所以这儿取下巧
            switch (result.data.Status) {
              case -1:
                this.stepActive = -1
                break
              case 1:
                this.stepActive = 0
                break
              case 4:
                this.stepActive = 1
                break
              case 10:
                this.stepActive = 2
                break
            }
            this.dataListLoading = false
          }
        })
      }
    },
    // 导出功能
    excelExports (excelType) {
      var domTick
      switch (excelType) {
        case 'purchase': // 药房 采购单导出，发厂商用
          domTick = this.$refs.myExportExcelPurchase
          break
        case 'caiwu': // 财务 导出
          domTick = this.$refs.myExportExcelCaiwu
          break
      }
      this.$prompt('请输入Excel表名（不填默认为sheet）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.*/,
        inputErrorMessage: '未输入表名'
      }).then(({ value }) => {
        myExportExcel(domTick, value) // 需要传入两个参数，一个table的dom节点，还有表格名称
        // 上面这个方法执行失败的话也会触发后面的catch，取消时也触发，如果有这方面的需求，要重新优化细节
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消导出Excel操作'
        })
      })
    },
    // 打印功能
    chenxiPrint () {
      // console.log('陈希', this.$refs.chenPrint)
      var printHTML = document.getElementById('chenxiPrint').innerHTML // 获取要打印的内容
      var page = window.open('', '_blank') // 打开一个新窗口，用于打印
      page.document.write(printHTML) // 写入打印页面的内容
      page.print() // 打印
      var userAgent = navigator.userAgent
      if ((userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) || (userAgent.indexOf('Edge') > -1) || (userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1)) {
        page.document.execCommand('print')
      } else {
        console.log('not IE')
      }
      page.close() // 关闭打印窗口
      this.innerVisible = false
    },
    // 打印功能结束

    handleClose () {
      this.editType = ''
      this.isAddActive = false
      this.OrderTotalPrice = 0
      this.rukuIsDisabled = false
    },
    dataFormSubmitA () { // 编辑的提交 采购数量和价格
      this.rukuIsDisabled = true
      var params = {
        Address: this.dataList.Address,
        Buyer: this.dataList.Buyer,
        Phone: this.dataList.Phone,
        OrderType: this.dataList.OrderType,
        Remark: this.dataList.Remark,
        StoreId: this.dataList.StoreId,
        StoreCode: this.dataList.StoreCode,
        Id: this.dataList.Id,
        SupplierId: this.dataList.SupplierId,
        SupplierCode: this.dataList.SupplierCode,
        Items: JSON.stringify(this.dataList.Items.map(item => {
          return {
            ProductId: item.ProductId,

            LastCostPirce: item.LastCostPrice, // 瞄一下，有点点小用

            CostPrice: item.CostPrice, // 进价售价：
            // StoreSalePrice: item.StoreSalePrice, // 门店售价：这三个值，直接来源于添加药材那，用来作为初始值在创建采购单的时候直接传递给后端
            Quantity: item.Quantity, // 采购量手填

            SapProductCode: item.SapProductCode,
            SupplierId: this.dataList.SupplierId,
            SupplierCode: this.dataList.SupplierCode // 这儿接口9返回的item.SupplierId用为零，导致不得不去获取总表的那个返回值
          }
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
          this.$emit('refreshDataList')
          this.visible = false
        } else {
          this.rukuIsDisabled = false
          this.$message({
            type: 'error',
            message: `${result.message}`,
            duration: 1000
          })
        }
      })
    },
    dataFormSubmitB () { // 入库的提交 批次号
      this.rukuIsDisabled = true

      //  想取消批次号和生产日期的必填验证，就注释下面两个if即可，对代码其他模块没影响
      if (this.dataList.Items.some(item => item.lll === 0 || item.lll === '' || item.lll === null)) {
        this.$alert('批次号未完整录入!', '提示', {
          confirmButtonText: '确定'
        })
        this.rukuIsDisabled = false
        return false
      }
      if (this.dataList.Items.some(item => item.ProductionDate === null)) {
        this.$alert('检测有商品的生成日期未填写!', '提示', {
          confirmButtonText: '确定'
        })
        this.rukuIsDisabled = false
        return false
      }

      var params = {
        Code: this.dataList.Code,
        Id: this.dataList.Id,
        Remark: this.dataList.Remark,
        Items: JSON.stringify(this.dataList.Items.map(item => {
          return {
            Id: item.Id, // 这是详情id，上面那个A的是药材ID
            ActualQuantity: item.Quantity,
            productBatchNo: item.lll, // 批次号初始值可以直接在这写个字符串 比如：'20190901'
            ProductionDate: item.ProductionDate, // 生产日期
            ExpiryDate: item.ExpiryDate // 有效期
            // ProductionDate: new Date(), // 生产日期 这个玩意直接给生产日期默认一个值，方便一些及时需要的批量操作，减少手填批次号和生产日期的麻烦步骤
            // ExpiryDate: new Date() // 有效期
          }
        }))
      }
      // console.log(params)
      API.purchase.editBatchNo(params).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `编辑${result.message}`,
            duration: 1000
          })
          this.$emit('refreshDataList')
          this.visible = false
        } else {
          this.rukuIsDisabled = false // 请求失败，按钮状态变为可再次点击
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
