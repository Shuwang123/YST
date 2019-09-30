<template>
  <div class="doctor-offset-page">
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="80px" size="mini">
      <el-container style="padding-left: 20px">

        <!--左侧-->
        <el-aside width="75%" style="border-right: 1px solid #DCDFE6; padding-right: 5px;min-width: 700px;">
          <div id="leftHeightPatient">
            <p style="text-align: center;font-size: 16px; padding: 5px 0 20px 0;">
              <span style="position: relative; top: 10px;font-size: 18px; font-weight: 600;cursor: pointer"> 退单笺</span>
            </p>
            <el-row>
              <el-col :span="8">
                <el-form-item label="操作人" style="width: 94px">
                  <el-input v-model="$store.getters.getAccountLoginInfoAll.NickName" :disabled="true" style="width: 110px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="退单患者" prop="UserName">
                  <el-input v-model="dataForm.UserName" placeholder="选择患者" style="width: 94px" disabled></el-input>
                  <!--{{$route.query.patientId}}-->
                  <span v-if="$route.params.type === 'create'" class="iconfont icon-renwu-zengjia"
                        style="display: inline-block;width: 40px;height: 30px;font-size: 26px;font-weight: 900;color: #1EA57B; margin-left: 7px; vertical-align: top;cursor: pointer"
                        @click="openPatientList(); $store.commit('setRegisterStep', 2)">
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别" prop="Sex">
                  <el-input v-model="dataForm.Sex" placeholder="只读" style="width: 80px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年龄" prop="BirthDate">
                  <el-input v-model="dataForm.BirthDate" placeholder="只读" style="width:70px" disabled></el-input>
                  <div class="recipelAgeUnit">
                    <el-select v-model="dataForm.ageUnit" style="width: 45px" disabled >
                      <el-option label="岁" value="1"></el-option>
                      <el-option label="月" value="0"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电话" prop="MobilePhone">
                  <el-input v-model="dataForm.MobilePhone" placeholder="只读" style="width: 140px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <div style="min-width: 660px">
                  <el-form-item label="一级药态" prop="CategoryOne">
                    <el-radio-group v-model="dataForm.CategoryOne"  @change="handleChange" size="mini">
                      <el-radio label="1" border>汤剂</el-radio>
                      <el-radio label="3" border>制膏</el-radio>
                      <el-radio label="4" border>水泛丸</el-radio>
                      <el-radio label="5" border>水蜜丸</el-radio>
                      <el-radio label="2" border>外用</el-radio>

                      <el-radio label="41" border>理疗</el-radio>
                      <el-radio label="11" border>西药</el-radio>
                      <el-radio label="21" border>产品</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!--西药11，二级1008-->
                  <!--产品21，二级1007--> <!--为什么理疗一级药态41，理疗二级药态1006--><!--1~10留给中草药，方便以后扩展-->
                </div>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="Remark" :inline-message="true">
                  <el-input v-model="dataForm.Remark"
                            placeholder="请输入退单备注" style="width: 85%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="border-bottom: 1px solid #E6E6E6; font-weight: 500">
              R: [{{dataForm.oldCategoryOneName}}] - [{{oldTwoTabsName}}]</div>
          </div>

          <!--table组件-->
          <el-table
            :height="chenxiHeight"
            :data="leftTableData"
            stripe
            v-loading="dataListLoading"
            row-class-name="purchaseListRow"
            :header-cell-style="$cxObj.tableHeaderStyle30px"
            style="width: 100%;">
            <component :is="this.leftTable" ref="leftCurrentTable"
                       @blurEvent="$refs.customInput.focus()"
                       @tableEvent="delDrugs"
                       @tableNumberEvent="consoleTable">
            </component>
          </el-table>
        </el-aside>

        <!--右侧-->
        <el-main width="25%" style="padding: 15px 10px 40px; border-bottom: 1px solid #DCDFE6;">
          <div style="position: relative">
            <el-input v-model="dataForm.SpellName"
                      ref="customInput"
                      @blur="rightTopInputBlur()"
                      @focus="rightIsFocus = true"

                      @keydown.38.native="autoSelectUpper()"
                      @keydown.40.native="autoSelectDown()"
                      @keyup.enter.native="addDrugs"
                      placeholder="请输入药材名或拼音首字母" style="min-width: 190px; width: 100%" size="small"></el-input>
            <ul v-show="rightIsFocus && dataForm.SpellName !== ''"
                class="own-methods"
                ref="ownMethods">
              <li v-for="(item, index) in rightUlData" :key="item.Id" :title="item.ShowName"
                  :class="[index === keyCode_40Count ? 'isLi' : '']" @click="addDrugs(item)">
                <span style="display: inline-block; vertical-align: middle; width: 60px;overflow: hidden; white-space: nowrap;text-overflow: ellipsis">{{ item.ShowName }}</span>
                <span style="color: #e4393c;">{{item.CategoryId === '1002' ? '精品' : ''}}{{item.CategoryId === '1005' ? '贵细' : ''}}</span>
                余<span style="color: red">{{ item.Quantity }}</span>
                <span style="float: right;width: 60px">{{ item.StoreSalePrice.toFixed(2) }}</span>
              </li>
            </ul>
          </div>

          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in drugsCategoryArr" :key="item.id" :label="item.text" :name="item.id"></el-tab-pane>
          </el-tabs>
          <div class="rightUlStyle">
            <ul class="ul-true">
              <li v-for="item in rightUlData" :key="item.Id">
                <el-tooltip class="item" effect="light"
                            :content="`${item.ShowName} [余量${item.Quantity}]${item.CategoryId === '1002' ? '精' : ''}${item.CategoryId === '1005' ? '贵' : ''}`" placement="left">
                  <el-row style="clear: both">

                    <!--药材名+剩余量+操作-->
                    <el-col :span="6">
                      <span v-text="item.ShowName === null ? '无' : item.ShowName"
                            style="display: inline-block; vertical-align: middle; width: 50px;overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
                      </span>
                    </el-col>
                    <el-col :span="12" :style="{color: item.Quantity - item.RedLine > 0 ? '#333' : item.Quantity === 0 ? '#ccc' : '#e4392c'}">
                      <span style="display: inline-block; vertical-align: middle;text-align: left;padding-left: 10px;
                                   overflow: hidden;width: 100px; white-space: nowrap;text-overflow: ellipsis">
                        {{item.Quantity}} {{item.CategoryId === '1002' ? '精品' : ''}}{{item.CategoryId === '1005' ? '贵细' : ''}} <!--{{item.Id}} {{item.RedLine}}-->
                      </span>
                    </el-col>

                    <el-col :span="6" style="text-align: right;padding-right: 7px">
                      <el-button type="text" size="mini" @click="addDrugs(item)"
                                 style="font-size: 15px;font-weight: 600">添加</el-button>
                    </el-col>
                  </el-row>
                </el-tooltip>
              </li>
            </ul>

            <!--A B C D...字母按钮-->
            <ol>
              <li v-for="(item, ind) in litterArr" :key="item.content" :class="[item.isActive ? 'isActive' : '']"
                  v-text="item.content" @click="activeLitter(item.content, ind)">
              </li>
            </ol>
          </div>
          <div class="rightPageCounter">
            <el-pagination @size-change="sizeChangeHandle"
                           @current-change="currentChangeHandle"
                           :current-page="pageIndex"
                           :page-sizes="[50,100]"
                           :page-size="pageSize"
                           :total="totalPage"
                           layout="prev, pager, next" :pager-count="5" small>
              <!--layout="prev, pager, next, jumper, sizes, total" background>-->
            </el-pagination>
          </div>
        </el-main>
      </el-container>

      <el-footer height="126px" style="padding-top: 7px;position: relative">
        <el-row>
          <el-col :span="6">
            <el-form-item label="总剂数" prop="Total">
              <el-input-number v-model="dataForm.Total" @change="countTotalPrice()" :min="1" :step="1" :max="100" style="width: 95px"></el-input-number> 剂
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="折扣" prop="Discount">
              <el-input-number v-model="dataForm.Discount" @change="countTotalPrice()" :min="0" :step="1" :max="100" style="width: 95px"></el-input-number> %
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总金额">
              <el-input v-model="allMoney" style="width: 105px" disabled></el-input> ￥
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付方式" prop="PaymentWay">
              <el-select v-model="dataForm.PaymentWay" style="width: 95px">
                <el-option label="现金" value="1"></el-option>
                <el-option label="支付宝" value="2"></el-option>
                <el-option label="微信现场扫码" value="3"></el-option>
                <el-option label="银行卡" value="4"></el-option>
                <el-option label="医保卡" value="5"></el-option>
                <el-option label="微信客服手机" value="6"></el-option>
                <el-option label="代金券" value="7"></el-option>
                <el-option label="会员卡" value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="position: absolute;top: 7px;right: 7px;width: 100px;height: 40px;line-height: 40px;text-align: center;
                    border-top-left-radius: 20px;border-bottom-left-radius: 20px;background-color: #409EFF;cursor: pointer"
             @click="send()">
          <i class="iconfont icon-ico_zhongyaofangguanli_zhongyaoqingling" style="color: #fff;font-weight: 700"></i>
          <span style="color: #fff;font-weight: 700">生成退单</span>
        </div>
      </el-footer>
    </el-form>
    <patient-list-pop v-if="addOrUpdateVisible" ref="patientListPop" @childEven="zairuFun"></patient-list-pop>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@/api'

  // import axios from 'axios'
  import {setAccountData, getAccountData} from '@/utils'
  import qs from 'qs'
  import request from '../../api/request'

  import '../common/icon/iconfont.css'
  import {calcAge, Currency, Letter, NumberInt, NumberFloat} from '@/utils/validate' // 自定义的计算年龄的方法，精确到月，至于精确到天，那种才生下来的娃，一个月不到不太可能中医

  import PatientListPop from './patient-list-pop'
  import TableOne from './table-one'
  import TableTwo from './table-two'
  import TableThree from './table-three'
  import TableFour from './table-four'
  export default {
    components: {
      PatientListPop,
      TableOne, TableTwo, TableThree, TableFour },
    data () {
      return {
        isActiveLi: true, // 右上角的药材拼音输入框的下拉样式
        litterArr: [
          {content: 'A', isActive: false}, {content: 'N', isActive: false},
          {content: 'B', isActive: false}, {content: 'O', isActive: false},
          {content: 'C', isActive: false}, {content: 'P', isActive: false},
          {content: 'D', isActive: false}, {content: 'Q', isActive: false},
          {content: 'E', isActive: false}, {content: 'R', isActive: false},
          {content: 'F', isActive: false}, {content: 'S', isActive: false},
          {content: 'G', isActive: false}, {content: 'T', isActive: false},
          {content: 'H', isActive: false}, {content: 'U', isActive: false},
          {content: 'I', isActive: false}, {content: 'V', isActive: false},
          {content: 'J', isActive: false}, {content: 'W', isActive: false},
          {content: 'K', isActive: false}, {content: 'X', isActive: false},
          {content: 'L', isActive: false}, {content: 'Y', isActive: false},
          {content: 'M', isActive: false}, {content: 'Z', isActive: false}],
        drugsCategoryArr: [], // 先请求药品种类
        drugsCategoryArrCopy: [], // 初始化的时候就保存一个保存有全部信息的副本，以后用于提取
        oldTabsName: '1002', // 二级药态记录
        oldTwoTabsName: '精品饮片', // 二级药态记录
        activeName: '1002',

        leftTable: 'TableTwo', // 左侧表格 组件的引用名切换哟，这的值决定
        leftTableData: [], // 左侧表格的数据
        rightUl: '', // 右侧列表
        rightUlData: [], // 右侧列表的数据

        addOrUpdateVisible: false,
        dataListLoading: false, // 加载
        chenxiHeight: 479, // 这个是测试出来的固定值，用于第一次初始化页面吧，如果以后页面的格式需要调整，可以测试一个初始值来填在这就行了
        pageIndex: 1,
        pageSize: 50, // 50 标准
        totalPage: 1,
        dataForm: {
          UserName: '',
          Sex: '',
          BirthDate: '',
          MobilePhone: '',
          Address: '',
          UserId: '',
          Code: '',
          ageUnit: '1', // val='1' label岁 '0'月

          oldCategoryOne: '1', // 一级药态记录
          oldCategoryOneName: '汤剂', // 一级药态记录 ???
          CategoryOne: '1', // 一级药态类型
          SpellName: '',

          Remark: '', // 备注
          Total: 1, // 总剂数
          Discount: 100, // 折扣
          PaymentWay: '1' // 退单支付方法（要退单，那得把钱退给别人，对方返回药，正常逻辑）
        },
        allMoney: 0, // 药材金额 * 百分比
        dataRule: {
          // UserName: Currency('必填项'),
          // Sex: Currency('必填项'),
          // BirthDate: Currency('必填项'),
          // MobilePhone: Currency('必填项'),
          Total: Currency('总剂数必填'),
          Discount: Currency('折扣必填'),
          PaymentWay: Currency('支付方式必填')
        },

        isClickRightAddButton: false, // 搭配 updated () {} 聚焦
        rightIsFocus: false, // 判断右上角输入框是否处于聚焦状态
        keyCode_40Count: 0, // 在右上角的输入框中按下‘↓’键，总次数统计
        source: null // 上一次请求对象
      }
    },
    watch: {
      'dataForm.SpellName': function (val, oldval) {
        // console.log(val)
        var isEmpty = val === '' ? true : false // 右上角输入
        if (isEmpty) {
          this.litterArr.forEach(item => { // 重置 ABC 按钮
            item.isActive = false
          })
        }
        this.pageIndex = 1
        this.getStoreCategorytypeStock() // console.log(this.rightUlData)
      },
      'dataForm.Total': function (val, oldval) {
        if (val === undefined) {
          this.dataForm.Total = 1 // console.log(val)
        }
      },
      oldTabsName (val, oldval) { // 这个监听最终只是用来显示 R: 那而已
        switch (val) {
          case '1002':
            this.oldTwoTabsName = '精品饮片'// case '1001': this.oldTwoTabsName = '饮片' break 贵细1005
            break
          case '1003':
            this.oldTwoTabsName = '饮片3'
            break
          case '1004':
            this.oldTwoTabsName = '饮片4'
            break
          case '1006':
            this.oldTwoTabsName = '理疗'
            break
          case '1007':
            this.oldTwoTabsName = '产品'
            break
          case '1008':
            this.oldTwoTabsName = '西药'
            break
        }
      }
    },
    created () { this.pageInit() }, // 先初始化
    mounted () {
      var youHeight = getComputedStyle(document.getElementsByClassName('el-main')[0]).height
      var zuoHeight = getComputedStyle(document.getElementById('leftHeightPatient')).height
      this.chenxiHeight = parseInt(youHeight) - parseInt(zuoHeight)
    },
    // 右上角的输入框按下enter的时候（或者单击add按钮的时候），左边的table最后行聚焦
    updated () {
      if (this.isClickRightAddButton) {
        this.$refs.leftCurrentTable.$refs.chd.focus()
        this.isClickRightAddButton = false // 搭配 updated () {} 聚焦
      }
    },
    methods: {
      pageInit () {
        // 先请求并保存所有二级药态到drugsCategoryArrCopy，然后扣除我们所需要二级药态使用
        API.drugs.getDrugsCategory().then(result => {
          if (result.code === '0000') { // 最初 [10,1001,1002,1003,1004,1005,1006]
            this.drugsCategoryArrCopy = result.data.filter((item, ind) => {
              return ind > 0 // 不需要10中草药
            }).slice(1, 8)// 不需要饮片1001
            this.drugsCategoryArrCopy.splice(3,1)  // 这一步去除1005贵细 最后变成 [1002,1003,1004,1006] 1007产 1008西
            this.filterCategory(['1002', '1003', '1004']) // console.log(result.data, this.drugsCategoryArrCopy, this.drugsCategoryArr)
            // 在filterCategory方法中会给this.drugsCategoryArr赋值，所以就不在这赋值了

            // 白手起家不要原单据直接创建退单 （那就只：初始化请求页面右上角药材列表）
            if (this.$route.params.type === 'create') {
              console.log('create类型')
              this.getStoreCategorytypeStock()
            } else if (this.$route.params.type === 'edit') { // 在收银列表（已收费且已出库：点击退单进来的，需要利用单据的一些信息了）
              let row = this.$route.params.row
              console.log('edit类型', row)
              // ① 先处理患者信息
              var obj = {
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                IsPaging: true,
                UserName: '',
                StoreId: this.$store.getters.getAccountCurrentHandleStore,
                MobilePhone: row.MobilePhone }
              API.member.getMemberList(obj).then(result => {
                if (result.code === '0000') {
                  var allAge = calcAge(result.data[0].BirthDate) // !!!!!!这得到18岁 或 10月 1月
                  if (allAge.substr(allAge.length - 1) === '月') {
                    this.dataForm.ageUnit = '0'
                  } else if (allAge.substr(allAge.length - 1) === '岁') {
                    this.dataForm.ageUnit = '1'
                  }
                  this.dataForm.UserName = result.data[0].UserName
                  this.dataForm.Sex = result.data[0].Sex === 1 ? '男' : '女'
                  this.dataForm.BirthDate = allAge.substring(0, allAge.length - 1) // !!!!!!只取数不要单位，其实也可以parseInt
                  this.dataForm.MobilePhone = result.data[0].MobilePhone
                  this.dataForm.Address = result.data[0].Address
                  this.dataForm.UserId = result.data[0].Id
                  this.dataForm.Code = result.data[0].Code
                } else {
                  this.$message.error(result.message)
                }
              })

              // ② 后处理药态信息：一级药态是有直接记录的，直接调用
              this.dataForm.oldCategoryOne = String(row.CategoryOne)
              this.dataForm.CategoryOne = String(row.CategoryOne)
              // 注：这用到二级药态的原始模版（为保证用时模版肯定存在），那整个if语句都应该放到API的内部
              this.comOneCategoryChangeFunction(this.dataForm.CategoryOne)

              // 二级药态的确定，需要稍微处理下
              if (row.SaleOrderItems.some(item => {
                return String(item.CategoryId) === '1002' || String(item.CategoryId) === '1001' || String(item.CategoryId) === '1005'
              })) { // 如果是精品类型的协定方，就要避免第一味药就出现普通饮片的可能
                this.oldTabsName = '1002'
                this.activeName = '1002'
              } else {
                this.oldTabsName = String(row.SaleOrderItems[0].CategoryId)
                this.activeName = String(row.SaleOrderItems[0].CategoryId)
              }
              this.comTwoCategoryChangeFunction(this.activeName) // 把table切换了来哟
              this.getStoreCategorytypeStock() //

              // 然后历史处方里的开方g数可以直接使用
              console.log(row.SaleOrderItems)
              this.leftTableData = row.SaleOrderItems.map(item => {
                item.myNum = item.Quantity
                item.Id = item.ProductId
                item.Code = item.ProductCode
                item.ShowName = item.ProductName

                item.CostPrice = item.RealPrice
                item.StoreSalePrice = item.RealPrice
                return item
              })
              // ③ 处理处方的药态，g数，售价等
              // 再次开方时，调用的旧处方，保存的那些药材的历史售价，是有可能变化的，// 所以需要从新请求一次每个药材对应的最新的售价，来重新覆盖
              this.$nextTick(() => {
                API.storeStock.getStoreStock({
                  PageIndex: 1,
                  PageSize: 100, // 协定方上的药材应该只有30味左右吧，100够了 搭配的下面的ProductCodeOrBarCode查询应该不可能超出100味，如果出问题可以留意这
                  IsPaging: true,
                  StoreId: this.$store.getters.getAccountCurrentHandleStore, // 传不传门店id决定了是否返回库存余量!!!（另外这儿可以能有点问题要处理，因为可能是药房的账号进来，那这样的话如果药房的权限大于医生，那门店库存也更正变大了，这是个要考虑的地方）
                  ProductCodeOrBarCode: row.SaleOrderItems.map(item => {
                    return item.ProductCode
                  }).join(), // 通过批量的药材编码查询出最新的门店里库存药品的信息（主要目的拿到最新的价格）
                  CategoryId: this.activeName === '1002' ? '1001,1002,1005' : this.activeName, // 被激活的tabs标签页的药材大方向的种类的类型id 1001 ？？？ 这是精品的时候还有问题
                  SearchType: 2 // 1表示采购用 2查询库存用
                }).then(response => {
                  if (response.code === '0000' && response.data.length > 0) {
                    // 左边table 字段转换下
                    // 搭配上面的1、（温馨提示）这需要耐心
                    // edit 类型的是原单退价，这种情况需直接调用原单的价格来计算
                    // edit 类型的是原单退价，这种情况需直接调用原单的价格来计算
                    // edit 类型的是原单退价，这种情况需直接调用原单的价格来计算
                    // this.leftTableData.forEach(item => { // 搭配上面的1、（温馨提示）这需要耐心
                    //   response.data.forEach(inner => {
                    //     if (item.Code === inner.ProductCode) {
                    //       item.CostPrice = inner.LastCostPrice
                    //       item.StoreSalePrice = inner.StoreSalePrice
                    //       return false
                    //     }
                    //   })
                    // })
                    this.countTotalPrice() // 显示计算价格
                    this.leftTableData.push() // console.log(this.leftTableData)
                  } else {
                    this.$message({ message: `${response.message}`, type: 'warning', duration: 3000 })
                  }
                })
              })
              // ④ 最后处理零散的字段，剂数
              this.dataForm.Total = row.Total
              this.dataForm.Discount = row.Discount * 100 // 后端返回的不能直接用，需 * 100
            }
          }
        })
      },

      // 打开患者弹窗
      openPatientList () {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.patientListPop.init()
        })
      },
      // 患者子弹窗的‘载入’按钮点击后
      zairuFun (row) {
        var allAge = row.BirthDate // !!!!!!这得到18岁 或 10月 1月 // var allAge = calcAge(row.BirthDate) // !!!!!!这得到18岁 或 10月 1月
        if (allAge.substr(allAge.length - 1) === '月') {
          this.dataForm.ageUnit = '0'
        } else if (allAge.substr(allAge.length - 1) === '岁') {
          this.dataForm.ageUnit = '1'
        }
        this.dataForm.UserName = row.UserName
        this.dataForm.Sex = row.Sex === 1 ? '男' : '女'
        this.dataForm.BirthDate = allAge.substring(0, allAge.length - 1) // !!!!!!只获取数不要单位，其实也可以parseInt
        this.dataForm.MobilePhone = row.MobilePhone
        this.dataForm.Address = row.Address
        this.dataForm.UserId = row.Id
        this.dataForm.Code = row.Code
      },

      // 一级药态切换后，右边的4个二级药态也要重新排列
      comOneCategoryChangeFunction (one) { // one：一级药态 - [饮片1001、颗粒1002、精品1003、三九1004]
        switch (one) {
          case '1':
            this.filterCategory(['1002', '1003', '1004']) // 汤剂
            this.dataForm.oldCategoryOneName = '汤剂'
            break
          case '2':
            this.filterCategory(['1002', '1003', '1004']) // 外用
            this.dataForm.oldCategoryOneName = '外用'
            break
          case '3':
            this.filterCategory(['1003']) // 制膏只有 三九
            this.dataForm.oldCategoryOneName = '制膏'
            break
          case '4':
            this.filterCategory(['1002']) // 制丸只有 饮片
            this.dataForm.oldCategoryOneName = '水泛丸'
            break
          case '5':
            this.filterCategory(['1002']) // 制丸只有 饮片
            this.dataForm.oldCategoryOneName = '水蜜丸'
            break
          case '41':
            this.filterCategory(['1006']) // 理疗只有 理疗
            this.dataForm.oldCategoryOneName = '理疗'
            break
          case '11':
            this.filterCategory(['1008']) //
            this.dataForm.oldCategoryOneName = '西药'
            break
          case '21':
            this.filterCategory(['1007']) //
            this.dataForm.oldCategoryOneName = '产品'
            break
        }
      },
      // 二级药态相关，重新排列计算
      filterCategory (arr) {
        var brr = []
        for (let i = 0; i < arr.length; i++) {
          this.drugsCategoryArrCopy.forEach(item => {
            if (item.id === arr[i]) { brr.push(item) }
          })}
        this.drugsCategoryArr = brr
      },

      // 右侧药材请求：对应门店 对应药态下的 对应药库
      getStoreCategorytypeStock () {
        this.rightUlData = [] // this.totalPage = 0 // 注释这影响分页
        this.keyCode_40Count = 0 // 在右上角的输入框中按下‘↓’键，总次数统计 $ios
        if (this.source !== null) { this.source.cancel('取消上一次请求') } // console.log('此处执行时如果上一次请求已结束，则无法取消...')
        var params = {
          Name: '',
          PageIndex: this.pageIndex,
          PageSize: 50,
          IsPaging: true,
          SpellName: this.dataForm.SpellName,
          CategoryId: this.activeName === '1002' ? '1001,1002,1005' : this.activeName,
          StoreId: this.$store.getters.getAccountCurrentHandleStore,
          CodeOrBarCode: ''} // 暂无
        console.log(params)
        this.source = this.$ios.CancelToken.source()
        console.log(request.baseURL)
        this.$ios.post(request.baseURL + '/YstApiProduct/LoadData', qs.stringify(params), {
          headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
          cancelToken: this.source.token
        }).then(result => {
          result = result.data
          if (result.code === '0000' && result.data.length > 0) {
            this.rightUlData = result.data
            this.totalPage = result.total
          } else {
            this.rightUlData = []
            this.totalPage = 0
            this.$message({ message: `${result.message}`, type: 'warning', duration: 3000 })
          }
          this.dataListLoading = false
        }).catch(res => {
          console.log(res) // 取消上一次请求，成功提示
        })
      },

      autoSelectUpper () { // ‘上’ 键
        if (this.keyCode_40Count > 0) {
          this.keyCode_40Count--
          if (this.keyCode_40Count >= 5) {
            this.$refs.ownMethods.scrollBy(0, -30) // 30px的高度是根据li的高度来定的
          }}
      },
      autoSelectDown () { // ‘下’ 键
        var len = this.rightUlData.length
        if (this.keyCode_40Count < len - 1) {
          this.keyCode_40Count++
          if (this.keyCode_40Count > 6) {
            this.$refs.ownMethods.scrollBy(0, 30)
          }}
      },
      // 鼠标点击时，输入框失去焦点，其实li就没被点中，导致click=addDrugs并没有触发，所以li延迟一下才消失比较好
      rightTopInputBlur () {
        setTimeout(() => {
          this.rightIsFocus = false
          this.dataForm.SpellName = ''}, 200)
      },

      // 后面有三个方法会共同调用这个方法：计算总价
      countTotalPrice () {
        var sum = 0
        this.leftTableData.forEach(item => {
          sum += item.StoreSalePrice * item.myNum
        })
        this.allMoney = (sum * this.dataForm.Total * (this.dataForm.Discount / 100)).toFixed(2)
      },
      // 1.当点击右侧药材列表的‘添加’按钮的时候
      addDrugs (row) {
        var selectRow = this.rightUlData[this.keyCode_40Count]
        // console.log(row, selectRow)
        // row 有可能是enter事件的obj对象，也有可能就是被click时当行的row
        // 通过enter添加：此时row代表enter事件的obj对象
        if (row.Code === undefined) {
          if (!selectRow) { return false } // 没有搜索结果的时候敲回车不让执行
          if (this.dataForm.SpellName === '') { return false } // 在查询关键字为空时，敲回车也不让执行
          if (this.leftTableData.some(item => item.Code === selectRow.Code)) { // 发现重复添加的药材时也不让执行
            this.$message(`[${selectRow.ShowName}] 已添加！`)
            return false
          }
          this.isClickRightAddButton = true // 搭配 updated () {} 聚焦
          this.leftTableData.push(selectRow)
        } else { // 通过click添加：此时row代表一行的数据
          if (this.leftTableData.some(item => item.Code === row.Code)) {
            this.$message(`[${row.ShowName}] 已添加！`)
            return false
          }
          this.isClickRightAddButton = true
          this.leftTableData.push(row)
        } // row.myNum = 0 // 让后端加字段，要改所有的类型的，这自己加，就没这种问题了myNum
        this.countTotalPrice()
      },
      // 2.当点击左边table的‘删除’按钮的时候
      delDrugs (row) {
        this.leftTableData.forEach((item, i) => {
          if (item.Code === row.Code) {
            this.leftTableData.splice(i, 1)
            return false }
        })
        this.countTotalPrice()
      },
      // 3.改变myNum
      consoleTable () {
        this.leftTableData.push()
        this.countTotalPrice()
      },

      // 二级 子级 药态被锁定时：其之后的相关的逻辑需要重新跑一次
      comTwoCategoryChangeFunction (two) {
        this.pageIndex = 1 // 切换药态时，都重置为第一页
        switch (two) {
          case '1002':
            this.leftTable = 'TableTwo' // case '1001': // 后面结构改变后1001和1005、饮片和贵细这种情况是不可能点击出来的，所以tableOne的组件不可能调用
            this.rightUl = 'ul-one'
            break
          case '1003':
            this.leftTable = 'TableThree'
            this.rightUl = 'ul-one'
            break
          case '1004':
            this.leftTable = 'TableFour'
            this.rightUl = 'ul-one'
            break
          case '1006': // 1006这种情况是理疗，调用tableTwo那个吧
            this.leftTable = 'TableTwo'
            this.rightUl = 'ul-one'
            break

          case '1008': // 1008这种情况是西药，调用tableTwo那个吧
            this.leftTable = 'TableTwo'
            this.rightUl = 'ul-one'
            break
          case '1007': // 1007这种情况是产品，调用tableTwo那个吧
            this.leftTable = 'TableTwo'
            this.rightUl = 'ul-one'
            break
        }
      },
      // 一级药态被点击时
      handleChange (leftLab) { // console.log(leftLab)
        if (this.leftTableData.length === 0) { // 没开任何药材时直接切换直接加载呗，都没药材记录还提示啥子嘛
          this.comOneCategoryChangeFunction(leftLab) // 一级药态切换后，右边的4个二级药态也要重新排列

          // console.log(this.drugsCategoryArr, '?????')
          this.activeName = this.drugsCategoryArr[0].id
          this.comTwoCategoryChangeFunction(this.activeName) // 二级药态被锁定时：其之后的相关的逻辑需要重新跑一次

          this.dataForm.oldCategoryOne = leftLab
          this.oldTabsName = this.activeName
          this.getStoreCategorytypeStock()
          this.countTotalPrice() // 切换药态后立马清空价格
        } else { // 有的时候提示是否确定切换tabs
          this.$confirm('切换药态将清空已经加入的药品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.comOneCategoryChangeFunction(leftLab)

            this.activeName = this.drugsCategoryArr[0].id
            this.comTwoCategoryChangeFunction(this.activeName) // 二级药态被锁定时：其之后的相关的逻辑需要重新跑一次

            this.dataForm.oldCategoryOne = leftLab
            this.oldTabsName = this.activeName
            this.getStoreCategorytypeStock()
            this.leftTableData = [] // 不只切换，还需要清空左边table信息
            this.countTotalPrice() // 切换药态后立马清空价格
          }).catch(() => {
            this.dataForm.CategoryOne = this.dataForm.oldCategoryOne
            this.activeName = this.oldTabsName // 依靠oldTabsName切回上一步，table、ul、和tableData都不需要变了，就是取消切换药态的操作
          })
        }
        // console.log(this.dataForm.Categoryne, this.dataForm.olCategoryne, this.activeName, this.oldTabsName)
      },

      // 二级药态被点击时
      handleClick (tab, event) {
        // console.log(tab, event, this.leftTableData)
        this.rightCategoryChangeClick(tab.name)
      },
      rightCategoryChangeClick (categroyId) {
        if (this.leftTableData.length === 0) { // 没开任何药材时直接切换直接加载呗，都没药材记录还提示啥子嘛
          this.comTwoCategoryChangeFunction(categroyId) // 二级药态被锁定时：其之后的相关的逻辑需要重新跑一次

          this.oldTabsName = this.activeName
          this.getStoreCategorytypeStock()
          this.countTotalPrice() // 切换药态后立马清空价格
        } else { // 有的时候提示是否确定切换tabs
          this.$confirm('切换药品将清空已经加入的药品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.comTwoCategoryChangeFunction(categroyId) // 二级药态被锁定时：其之后的相关的逻辑需要重新跑一次

            this.oldTabsName = this.activeName
            this.getStoreCategorytypeStock()
            this.leftTableData = [] // 不只切换，还需要清空左边table信息
            this.countTotalPrice() // 切换药态后立马清空价格
          }).catch(() => {
            this.activeName = this.oldTabsName // 依靠oldTabsName切回上一步，table、ul、和tableData都不需要变了，就是取消切换药态的操作
          })
        }
      },

      // A B C D...字母按钮
      activeLitter (txt, ind) {
        this.dataForm.SpellName = txt
        this.litterArr.forEach((item, indx) => {
          if (indx === ind) {
            this.litterArr[indx].isActive = true
          } else {
            this.litterArr[indx].isActive = false
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getStoreCategorytypeStock()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getStoreCategorytypeStock()
      },

      // 开方提交
      send () {
        // 提交前简单验证
        if (this.leftTableData.length === 0) {
          this.$alert(`退单未编辑药品，无法提交！`, '提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            closeOnClickModal: true,
            closeOnPressEscape: true
          })
          return false
        } else if (this.leftTableData.some(item => {
          return item.myNum === undefined
        })) {
          this.$alert(`药材未编辑数量，无法提交！`, '提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            closeOnClickModal: true,
            closeOnPressEscape: true
          })
          return false
        }

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$confirm('确认创建退单? ', '小助手提示', {
              dangerouslyUseHTMLString: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // edit create 参数合并
              // console.log(this.$route.params.row)
              var params = {
                SourceSaleOrderCode: this.$route.params.type === 'create' ? '' : this.$route.params.row.Code, // 白手起家新建就没有单据Id传''，利用就单据生成退单的那种就有就单据的Id信息
                StoreId: this.$store.getters.getAccountCurrentHandleStore,
                OrderType: 2, // 退单
                PaymentWay: this.dataForm.PaymentWay, // 支付方式
                Remark: this.dataForm.Remark, // 备注
                Total: this.dataForm.Total, // 总剂数
                Discount: this.dataForm.Discount / 100, // 折扣 后端吗没自己除100

                UserId: this.dataForm.UserId, // 患者Id 可能有可能没有，看操作人创建时选不选患者，患者选择做的非必填项
                CategoryOne: this.dataForm.CategoryOne, // 一级药态
                ItemsJson: JSON.stringify(this.leftTableData.map(item => {
                  return {
                    ProductId: item.Id,
                    ProductCode: item.Code,
                    ProductName: item.ShowName,
                    CostPrice: item.CostPrice,
                    SalePrice: item.StoreSalePrice,
                    RealPrice: item.StoreSalePrice,
                    Quantity: item.myNum,
                    SupplierId: 0,
                    SupplierCode: 0 }
                }))
              }
              var tick = API.offset.createOffset(params)
              console.log(params, tick)
              tick.then((data) => {
                if (data.code === '0000') {
                  this.$message({
                    message: `${'发送成功'}`,
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.$router.push({path: '/offsetList'})
                    }
                  })
                } else {
                  this.$message.error(data.message)
                }
              })
            }).catch(() => {
            })
          }
        })
      }

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recipelAgeUnit /deep/ {
    display: inline-block;
    .el-input__inner {
      padding: 0 5px;
    }
  }
  .doctor-offset-page /deep/ {
    /*2019 07 18 实现聚焦功能的时候，发现官网给的组件使用不方便，自己大概模拟的一个*/
    .own-methods {
      position: absolute;
      top: 36px;
      width: 100%;
      min-height: 231px;
      max-height: 231px;
      padding: 7px 0 0;
      border: 1px solid #EBEEF5;
      border-radius: 5px;
      -webkit-box-shadow: 0 0 10px 0 #EBEEF5;
      box-shadow: 0 0 10px 0 #EBEEF5;
      z-index: 999;
      overflow: scroll;
      background-color: #fff;
      li {
        box-sizing: content-box;
        height: 20px;
        line-height: 20px;
        padding: 5px 0 5px 10px;
        &:hover {
          cursor: pointer;
          background-color: bisque;
        }
      }
      .isLi {
        background-color: bisque;
      }
      &::-webkit-scrollbar {width: 7px;}
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
        background-color: #eee;
      }
      &::-webkit-scrollbar-track {
        border-radius: 0;
        box-shadow: inset 0 0 5px rgba(0,0,0,0);
        background-color: rgba(0,0,0,0);
      }
    }

    /*一级药态的样式*/
    .el-radio.is-bordered + .el-radio.is-bordered {margin-left: 5px}
    .el-radio__label {padding-left: 5px}
    .el-radio--mini.is-bordered {padding: 6px 10px 0 10px}
  }

  .doctor-offset-page /deep/ {
    background-color: #fff;
    margin: 0 10px;
    border: 1px solid #DCDFE6;
    .el-radio-button--mini .el-radio-button__inner { padding: 7px 9px; }
    .el-main {position: relative;}
    .el-main::-webkit-scrollbar { width: 0; }

    .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar,
    .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar { width: 0; }
    .el-table__body-wrapper.is-scrolling-none:hover::-webkit-scrollbar,
    .el-table__body-wrapper.is-scrolling-left:hover::-webkit-scrollbar { width: 7px; }
    .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-thumb,
    .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar-thumb {
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
      background-color: #eee;
    }
    .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-track,
    .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar-track {
      border-radius: 0;
      box-shadow: inset 0 0 5px rgba(0,0,0,0);
      background-color: rgba(0,0,0,0);
    }

    /*ul滚动条*/
    .ul-true::-webkit-scrollbar { width: 7px; opacity: 0}
    .ul-true:hover::-webkit-scrollbar {
      width: 7px; opacity: 1;
    }
    .ul-true::-webkit-scrollbar-thumb {
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
      background-color: #eee;
    }
    .ul-true::-webkit-scrollbar-track {
      border-radius: 0;
      box-shadow: inset 0 0 5px rgba(0,0,0,0);
      background-color: rgba(0,0,0,0);
    }

    /*rightUStyle 容器div*/
    .rightUlStyle {
      position: relative;
      width: 80%;
      min-width: 190px;
      ul {
        width: 15vw;
        min-height: 550px; // 拿尺子对着电脑屏幕量过，就这个值吧
        max-height: 550px;
        overflow-y: scroll;
        overflow-x: hidden !important;
        background-color: #fff;
        box-shadow: 0 0 10px 1px #f1f2f7 inset;
        li {
          min-width: 180px;
          height: 30px;
          line-height: 30px;
          padding-left: 5px;
          font-weight: 600;
          font-size: 15px;
        }
      }

      ol {
        position: absolute;
        top: 0;
        right: -56px;
        color: #050505;
        font-size: 14px;
        font-weight: 700;
        width: 51px;
        text-align: center;
        border-left: 1px solid #dedede;
        border-top: 1px solid #dedede;
        li {
          float: left;
          width: 25px;
          height: 25px;
          line-height: 25px;
          cursor: pointer;
          border-right: 1px solid #dedede;
          border-bottom: 1px solid #dedede;
          &.isActive {
            background-color: #409EFF;
            color: #fff;
          }
        }
      }
    }
    .rightPageCounter {
      position: absolute;
      left: 0;
      bottom: 10px;
      width: 90%;
      margin: 0 auto;
      text-align: center;
      background-color: #fff;
    }
    .el-pagination.el-pagination--small {padding: 0 5px}
  }
  /*以下样式cx重写的，改变form中内部控件的行间距等默认22px太高*/
  .doctor-offset-page /deep/ {
    .el-form-item__label {font-weight: 700}
    .el-form-item { margin-bottom: 7px; }
    .el-dialog__body { padding-top: 10px; }
    /*表头高重写35高*/
    .el-table--medium th, .el-table--medium td, & .el-table th, & .el-table td,
    .el-table--medium th, .el-table--medium td, & .el-table th, & .el-table td {
      padding: 0 !important;
    }
    .purchaseListRow {
      color: #606266;
      td {padding: 0;}
      td .cell{
        height: 35px;
        line-height: 35px;
      }
    }
  }
</style>
