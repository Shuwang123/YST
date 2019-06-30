<template>
  <div class="doctor-recipel">
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="80px" size="mini">
      <el-container style="padding-left: 20px">
        <el-aside width="75%" style="border-right: 1px solid #DCDFE6; padding-right: 5px;min-width: 700px;">
          <div id="leftHeightPatient">
            <p style="text-align: center;font-size: 16px; padding: 5px 0 20px 0;">
              <!--꧁<span style="position: relative; top: 10px;font-size: 18px; font-weight: 600;"> 处方笺 </span>꧂-->
              <span style="position: relative; top: 10px;font-size: 18px; font-weight: 600;cursor: pointer"
                    @click="cutOut = !cutOut" :title="cutOut ? '点击收起' : '点击展开'"> 处方笺
                <b style="font-weight: 700;font-size: 12px;color: #409EFF;
                   text-decoration: underline">{{cutOut ? '点击收起' : '点击展开'}}</b>
              </span>
            </p>
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名" prop="UserName">
                  <el-input v-model="dataForm.UserName" placeholder="选择患者" style="width: 94px" disabled></el-input>
                  <!--{{$route.query.patientId}}-->
                  <span v-if="$route.query.MobilePhone === '0'"
                        class="iconfont icon-renwu-zengjia" style="display: inline-block;width: 40px;height: 30px;font-size: 26px;font-weight: 900;color: #1EA57B; margin-left: 7px; vertical-align: top"
                        @click="openPatientList(); $store.commit('setRegisterStep', 2)">
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别">
                  <el-input v-model="dataForm.Sex" placeholder="只读" style="width: 80px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年龄">
                  <el-input v-model="dataForm.BirthDate" placeholder="只读" style="width:70px" disabled></el-input>
                  <div class="recipelAgeUnit">
                    <el-select v-model="dataForm.ageUnit" style="width: 45px" disabled >
                      <el-option label="岁" value="1"></el-option>
                      <el-option label="月" value="0"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <transition>
              <div v-show="cutOut">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="电话">
                      <el-input v-model="dataForm.MobilePhone" placeholder="只读" style="width: 140px" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="地址">
                      <el-input v-model="dataForm.Address" placeholder="请输入地址" style="width: 140px" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="病历号">
                      <el-input v-model="dataForm.Code" placeholder="请输入病历号" style="width: 140px" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="看诊类型">
                      <el-radio-group v-model="dataForm.DiagnosisType">
                        <el-radio-button label="1">初诊</el-radio-button>
                        <el-radio-button label="2">复诊</el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="一级药态">
                      <el-radio-group v-model="dataForm.CategoryOne"  @change="handleChange" size="mini">
                        <el-radio label="1" border>汤剂</el-radio>
                        <el-radio label="3" border>制膏</el-radio>
                        <el-radio label="4" border>水泛丸</el-radio>
                        <el-radio label="5" border>水蜜丸</el-radio>
                        <el-radio label="2" border>外用</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!--<el-form-item label="发病时间">-->
                  <!--<el-date-picker type="date" placeholder="请选择发病时间" style="width: 144px"-->
                                  <!--v-model="dataForm.DiseaseTime" value-format="yyyy-MM-dd">-->
                  <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="主诉" prop="MainSuit" :inline-message="true">
                      <el-input v-model="dataForm.MainSuit"
                                placeholder="请选择或输入主诉" style="width: 85%"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </transition>
            <el-row>
              <el-col :span="24">
                <el-form-item label="诊断结果" prop="DiseaseInfo" :inline-message="true">
                  <el-select
                    v-model="dataForm.DiseaseInfo"
                    multiple
                    filterable allow-create reserve-keyword
                    default-first-option
                    :popper-append-to-body="false"
                    placeholder="请选择或输入诊断信息" style="width: 85%"
                    @visible-change="selHide()">
                    <el-option v-for="item in options" :key="item.value"
                      :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="border-bottom: 1px solid #E6E6E6; font-weight: 500">R:</div>
          </div>

          <!--左侧开方：直接用组件的引用名切换-->
          <el-table
            :height="chenxiHeight"
            :data="leftTableData"
            stripe
            v-loading="dataListLoading"
            row-class-name="purchaseListRow"
            :header-cell-style="$cxObj.tableHeaderStyle30px"
            style="width: 100%;">
            <component :is="this.leftTable" ref="leftCurrentTable"
                       @tableEvent="delDrugs" @tableNumberEvent="consoleTable"
                       @blurEvent="$refs.customInput.focus()">
            </component>
            <!--v-if="addOrUpdateVisible" ref="patientListPop" @childEven="zairuFun"-->
          </el-table>
        </el-aside>

        <!--右侧药材：tabs标签页切换引导组件切换-->
        <!---->
        <!--其实这儿感觉可以不用传递一级药态dataForm.CategoryOne，直接传递-2查询全部，因为载入后我做了相应的自动切换药态的功能-->
        <!---->
        <el-main width="25%" style="padding: 0 10px 40px; border-bottom: 1px solid #DCDFE6;">
          <div style="margin: 5px 0;width: 279px;overflow: hidden;cursor: pointer">
            <el-button type="warning" plain size="mini" @click="openAgreementRecipelList('40', '-2')">协定方</el-button>
            <el-button type="warning" plain size="mini" @click="openAgreementRecipelList('41', '-2')">经典方</el-button>
            <el-button type="warning" plain size="mini" @click="openAgreementRecipelList('42', '-2')">理疗中成药</el-button>
            <!--<el-button type="warning" plain size="medium" disabled>名验方</el-button>-->
          </div>

          <el-autocomplete
            ref="customInput"
            popper-class="my-autocomplete"
            v-model="dataForm.SpellName"
            :fetch-suggestions="querySearch"
            :placeholder="`请输入药材拼音首字母 ${$store.getters.getAccountCurrentHandleStore}`" style="min-width: 190px; width: 100%" size="small"
            @select="addDrugs" @blur="dataForm.SpellName = ''">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <template slot-scope="{ item }">
              <div>{{ item.ShowName }} 余<span style="color: red">{{ item.Quantity }}</span></div>
            </template>
          </el-autocomplete>

          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in drugsCategoryArr" :key="item.id" :label="item.text" :name="item.id"></el-tab-pane>
          </el-tabs>
          <div class="rightUlStyle">
            <ul class="ownScrollbar xx">
              <li v-for="item in rightUlData" :key="item.Id">
                <el-tooltip class="item" effect="light" :content="item.ShowName+' [余量'+item.Quantity+']'" placement="left">
                  <el-row style="clear: both">
                    <!--<span v-text="item.ShowName === null ? '000' : item.ShowName"></span> {{item.Id}}余{{item.Quantity}}g/预{{item.RedLine}}-->

                    <!--药材名+剩余量+操作-->
                    <el-col :span="6">
                    <span v-text="item.ShowName === null ? '无' : item.ShowName"
                          style="display: inline-block; vertical-align: middle; width: 50px;overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
                    </span>
                    </el-col>
                    <el-col :span="12" :style="{color: item.Quantity - item.RedLine > 0 ? '#333' : item.Quantity === 0 ? '#ccc' : '#e4392c'}">
                    <span style="display: inline-block; vertical-align: middle;text-align: left;padding-left: 10px;
                                 overflow: hidden;width: 100px; white-space: nowrap;text-overflow: ellipsis">
                      {{item.Quantity}} / {{item.RedLine}}
                      <!--{{item.Id}} {{item.Quantity}}/{{item.RedLine}}-->
                    </span>
                    </el-col>

                    <el-col :span="6" v-if="item.Quantity > 0" style="text-align: right;padding-right: 7px">
                      <!--<el-button type="text" size="mini" @click="cutOut = false; addDrugs(item)"-->
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
              :page-sizes="[10,20,50,100]"
              :page-size="pageSize"
              :total="totalPage"
              layout="prev, pager, next" :pager-count="5" small>
              <!--layout="prev, pager, next, jumper, sizes, total" background>-->
            </el-pagination>
          </div>
        </el-main>
      </el-container>

      <el-footer height="100px" style="padding-top: 7px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="总剂数">
              <el-input-number v-model="Total" @change="countTotalPrice(leftTableData)" :min="1" :step="1" :max="30" style="width: 95px"></el-input-number> 剂
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用法：" prop="DrugRate_0">
              每日
              <el-select v-model="dataForm.DrugRate_0" style="width: 70px">
                <el-option v-for="item in DrugRateOptionsArr"
                           :key="item.lab" :label="item.lab" :value="item.val"></el-option>
              </el-select>
              剂，一剂分
              <el-select v-model="dataForm.DrugRate_1" style="width: 70px">
                <el-option v-for="item in DrugRateOptionsArr"
                           :key="item.lab" :label="item.lab" :value="item.val"></el-option>
              </el-select>
              次服
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医嘱">
              <el-input v-model="dataForm.DoctorAdvice" placeholder="请填写医嘱" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-footer>

      <div style="position: fixed;bottom: 0;left: 0px;right: 0;padding-left: 230px;background-color: #f1f2f7;z-index: 999">
        <el-row>
          <el-col :span="6" style="padding-top: 5px">
            <el-form-item label="开方医生">
              <el-input v-model="$route.query.DoctorName" placeholder="onlyReady" style="width: 110px" :disabled="true"></el-input>
            </el-form-item>
            <!--{{$route.query.DoctorId}}-->
          </el-col>
          <el-col :span="14" style="font-weight: 500; font-size: 16px; padding-top: 10px;cursor: pointer;">
            <div style="width: 540px; overflow: hidden">
              总金额：<span style="display: inline-block;color: #e4393c;font-weight: 700">￥
              {{(Number(allMoney) + dataForm.WorkAmount + dataForm.ConsultationAmount).toFixed(2)}} =</span>
              <!--1-->
              <el-tooltip placement="top">
                <div slot="content">当前药费</div>
                <span>￥{{allMoney}}</span>
              </el-tooltip>
              <!--2-->
              <el-tooltip placement="top">
                <div slot="content">加工费：<br/><br/>只针对制膏制丸</div>
                <span v-show="dataForm.CategoryOne === '3' ||
                            dataForm.CategoryOne === '4' || dataForm.CategoryOne === '5'">
                  +￥{{dataForm.WorkAmount}}</span>
              </el-tooltip>
              <!--3-->
              <el-tooltip placement="top">
                <div slot="content">医生直接开方时：<br/><br/>需填写挂号费</div>
                <span v-if="$route.query.MobilePhone === '0'">
                  + <el-input-number v-model="dataForm.ConsultationAmount" :min="1" :max="1000" style="width: 100px" size="mini"></el-input-number>
                </span>
              </el-tooltip>

              <!--药方总重量：只针对制膏制丸 [用的计算属性处理]-->
              <el-tooltip placement="top">
                <div slot="content">加工费规则：<br/><br/>1000g以下算120元，1000g以上每多100g加10元</div>
                <span v-show="dataForm.CategoryOne !== '1' &&
                        dataForm.CategoryOne !== '2' && leftTableData.length !== 0">
                ；总重量：{{categoryAllWeight}} g</span>
              </el-tooltip>

            </div>
          </el-col>
          <el-col :span="4" style="padding-top: 7px">
            <el-button type="primary" icon="iconfont icon-ico_zhongyaofangguanli_zhongyaoqingling"
                       @click="send()" size="small">&nbsp;发送给药房</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <patient-list-pop v-if="addOrUpdateVisible" ref="patientListPop" @childEven="zairuFun"></patient-list-pop>
    <agreement-dialog v-if="addOrUpdateVisibleAgreement" ref="agreementPop" @childAgreementEven="zairuFunAgreement" :indexDoctorId="$route.query.DoctorId"></agreement-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import '../common/icon/iconfont.css'
import {calcAge, Currency, Letter, NumberInt, NumberFloat} from '@/utils/validate' // 自定义的计算年龄的方法，精确到月，至于精确到天，那种才生下来的娃，一个月不到不太可能中医
import AgreementDialog from './agreement-dialog'
import PatientListPop from './patient-list-pop'
import TableOne from './table-one'
import TableTwo from './table-two'
import TableThree from './table-three'
import TableFour from './table-four'
export default {
  components: {
    AgreementDialog,
    PatientListPop,
    TableOne,
    TableTwo,
    TableThree,
    TableFour
  },
  // Error in callback for watcher "$route": "TypeError: Cannot read property 'id' of undefined"
  // 报错不要怕，因为没有创建路由页面的对应菜单造成的，无关紧要
  watch: {
    'cutOut': function (newval, oldval) {
      if (newval === true) {
        this.chenxiHeight = 0
        setTimeout(() => {
          let youHeight = getComputedStyle(document.getElementsByClassName('el-main')[0]).height
          let zuoHeight = getComputedStyle(document.getElementById('leftHeightPatient')).height
          this.chenxiHeight = parseInt(youHeight) - parseInt(zuoHeight)
        }, 450)
      } else {
        setTimeout(() => {
          let youHeight = getComputedStyle(document.getElementsByClassName('el-main')[0]).height
          let zuoHeight = getComputedStyle(document.getElementById('leftHeightPatient')).height
          this.chenxiHeight = parseInt(youHeight) - parseInt(zuoHeight)
        }, 450)
      }
    },
    'dataForm.SpellName': function (val, oldval) {
      if (val === '') { // 只有清空SpellName，激活了的字母按钮都要清空样式
        this.litterArr.forEach(item => {
          item.isActive = false
        })
      }
      this.getStoreCategorytypeStock()
      // console.log(this.rightUlData)
    },
    Total (val, oldval) {
      if (val === undefined) {
        console.log(val)
        this.Total = 1
      }
    },
    allMoney (val, oldval) {
      if (this.dataForm.CategoryOne === '3' || this.dataForm.CategoryOne === '4' || this.dataForm.CategoryOne === '5') {
        this.dataForm.WorkAmount = this.categoryAllWeight <= 1000 ? 120 : Math.ceil((this.categoryAllWeight - 1000) / 100) * 10 + 120
      } else {
        this.dataForm.WorkAmount = 0
      }
    }
  },
  data () {
    return {
      rightButton: '',
      options: [{
        value: '上呼吸道感染',
        label: '上呼吸道感染'
      }, {
        value: '支气管炎',
        label: '支气管炎'
      }, {
        value: '风寒感冒',
        label: '风寒感冒'
      }, {
        value: '急性支气管炎',
        label: '急性支气管炎'
      }, {
        value: '胃炎',
        label: '胃炎'
      }, {
        value: '慢性胃炎',
        label: '慢性胃炎'
      }, {
        value: '脾肾阳虚',
        label: '脾肾阳虚'
      }, {
        value: '咽炎',
        label: '咽炎'
      }, {
        value: '风热犯肺',
        label: '风热犯肺'
      }, {
        value: '月经失调',
        label: '月经失调'
      }, {
        value: '失眠',
        label: '失眠'
      }, {
        value: '颈椎病',
        label: '颈椎病'
      }, {
        value: '气血不足',
        label: '气血不足'
      }, {
        value: '便秘',
        label: '便秘'
      }, {
        value: '扁桃体炎',
        label: '扁桃体炎'
      }, {
        value: '腰肌劳损',
        label: '腰肌劳损'
      }, {
        value: '原发性高血压',
        label: '原发性高血压'
      }, {
        value: '痤疮',
        label: '痤疮'
      }, {
        value: '带状疱疹',
        label: '带状疱疹'
      }],
      DrugRateOptionsArr: [
        {lab: '1', val: '1'}, {lab: '2', val: '2'}, {lab: '3', val: '3'},
        {lab: '4', val: '4'}, {lab: '5', val: '5'}, {lab: '6', val: '6'},
        {lab: '7', val: '7'}, {lab: '8', val: '8'}, {lab: '9', val: '9'}
      ],
      cutOut: true, // 收起，显示
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
      oldTabsName: '1001', // 二级药态记录
      activeName: '1001',
      dataList: [],
      leftTable: 'TableOne', // 左侧表格 组件的引用名切换哟，这的值决定
      leftTableData: [], // 左侧表格的数据
      rightUl: '', // 右侧列表
      rightUlData: [], // 右侧列表的数据

      addOrUpdateVisibleAgreement: false,
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      chenxiHeight: 470, // 这个是测试出来的固定值，用于第一次初始化页面吧，如果以后页面的格式需要调整，可以测试一个初始值来填在这就行了
      pageIndex: 1,
      pageSize: 30, // 50 标准
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

        DiagnosisType: '1', // 看诊类型
        oldCategoryOne: '1', // 一级药态记录
        CategoryOne: '1', // 一级药态类型
        // DiseaseTime: '', // 发病时间
        // AgoIllness: '', // 过敏史
        // NowIllness: '', // 现病史
        MainSuit: '', // 主诉
        DiseaseInfo: [], // 诊断信息

        SpellName: '',
        // Dte: '', // 用药间隔
        DrugRate_0: '1', // 每日几剂 搭配计算属性
        DrugRate_1: '1', // 一剂分几次服
        DoctorAdvice: '', // 医嘱
        RegisterAmount: 0, // 挂号费
        ConsultationAmount: 0, // 诊疗费
        WorkAmount: 0 // 加工费 （只有一级药态为制膏、制丸的情况下才有）
      },
      dataRule: {
        UserName: Currency('此为必填项'),
        MainSuit: Currency('主诉必填'),
        DiseaseInfo: Currency('诊断结果必填'),
        DrugRate_0: Currency('用药方法必填')
      },
      Total: 1, // 剂数
      allMoney: 0
    }
  },
  computed: {
    // 服用方法
    'DrugRate': function () {
      return `共${this.Total}剂，每日${this.dataForm.DrugRate_0}剂，一剂分${this.dataForm.DrugRate_1}次服`
    },
    // 药方总重量
    categoryAllWeight () {
      if (this.leftTableData.length !== 0) {
        return this.Total * this.leftTableData.map(obj => obj.myNum).reduce((pren, nextm) => pren + nextm)
      }
    }
  },
  created () {
    this.pageInit() // 先初始化
  },
  mounted () {
    // console.log(document.getElementById('leftHeightPatient').style.height) ??? 为什么得到 空无空白
    // window.onresize = () => {
    //   var newHeight = document.documentElement['clientHeight'] - 350
    //   this.chenxiHeight = newHeight > 350 ? newHeight : 350 // 273 测试老半天
    // }
    // console.log(youHeight)// console.log(zuoHeight)// console.log(this.chenxiHeight)
    var youHeight = getComputedStyle(document.getElementsByClassName('el-main')[0]).height
    var zuoHeight = getComputedStyle(document.getElementById('leftHeightPatient')).height
    this.chenxiHeight = parseInt(youHeight) - parseInt(zuoHeight)
  },
  methods: {
    selHide () { // 当前select的下拉option块部分 隐藏的时候触发此方法
      var txt = document.getElementsByClassName('el-select-dropdown__list')[1]
        .firstElementChild.firstElementChild.innerHTML
      // [n] n受到整个页面中所有select的个数的影响，比如页头月、岁、页底的服用方法的下拉
      if (txt === this.options[0].value || this.dataForm.DiseaseInfo.some((item) => { // some主要是阻止重复输入
        return item === txt
      })) { return false } // *关键点这步*
      this.dataForm.DiseaseInfo.push(txt)
    },
    // 打开会员弹窗
    openPatientList () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.patientListPop.init()
      })
    },
    // 只医生‘直接开方’才用：子组件点击载入 传给 父组件
    zairuFun (row) {
      console.log(row)
      // var allAge = calcAge(row.BirthDate) // !!!!!!这得到18岁 或 10月 1月
      var allAge = row.BirthDate // !!!!!!这得到18岁 或 10月 1月
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
      // this.dataForm.RegisterAmount = 0 // 这两个没用，就只是提交的时候直接提交
      // this.dataForm.ConsultationAmount = 0
    },

    // 打开协定方列表接口
    openAgreementRecipelList (typeNum, Category) {
      this.addOrUpdateVisibleAgreement = true
      this.$nextTick(() => {
        this.$refs.agreementPop.init(typeNum, Category)
      })
    },
    zairuFunAgreement (agreementId) {
      console.log(agreementId)
      API.register.getRegisterInfo({id: agreementId}).then(result => {
        if (result.code === '0000') {
          console.log(result.data)
          // this.dataForm.SpellName = ''
          // this.dataForm.agreementRecipelId = result.data.Id // 协定方id
          // StoreId: '' // 门店
          // this.dataForm.AccountId = result.data.AccountId // 医生
          // this.dataForm.MainCure = result.data.MainCure // 主治
          // this.dataForm.Effect = result.data.Effect // 功效
          // this.dataForm.Explain = result.data.Explain // 说明
          // this.dataForm.PrescriptionName = result.data.PrescriptionName // 处方名
          // this.dataForm.DrugRate = result.data.DrugRate // 用法
          this.dataForm.oldCategoryOne = String(result.data.CategoryOne) // 药态一级记录 1内服2外用3制膏4水丸5水蜜丸
          this.dataForm.CategoryOne = String(result.data.CategoryOne) // 药态一级分类 1内服2外用3制膏4水丸5水蜜丸
          switch (this.dataForm.CategoryOne) { // [饮片1001、颗粒1002、精品1003、三九1004]
            case '1':
              this.filterCategory(['1001', '1002', '1003', '1004']) // 汤剂
              break
            case '3':
              this.filterCategory(['1004']) // 制膏只有三九
              break
            case '4':
              this.filterCategory(['1001', '1003']) // 制丸只有饮片
              break
            case '5':
              this.filterCategory(['1001', '1003'])
              break
            case '2':
              this.filterCategory(['1001', '1002', '1003', '1004']) // 外用
              break
          }

          // 左边table 字段转换下
          this.leftTableData = result.data.SaleOrderItems.map(item => {
            item.CategoryName = item.CategoryName.substring(4)
            item.Id = item.ProductId // 这个字段为什么要转换，可能看起来很懵逼，就是后端的接口一会那个字段一会这个字段搞出来的，如果不转化一下，编辑提交的情况下有bug
            item.myNum = item.Quantity
            item.ShowName = item.ProductName
            item.Code = item.ProductCode
            return item
          })

          // 根据协定方的药态，控制右边药态的初始选中值
          this.oldTabsName = String(result.data.SaleOrderItems[0].CategoryId)
          this.activeName = String(result.data.SaleOrderItems[0].CategoryId)

          this.getStoreCategorytypeStock()
          this.countTotalPrice(this.leftTableData) // 载入协定方后立马计算价格
          console.log(this.leftTableData)
        }
      })
    },

    // 通用封装的门店子组件绑定的父组件的返回方法（开方页面的上层已提前决定了门店，这儿还能改变门店吗？？？？？？？？？？？？？？？？？？？）
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      // if (isMultiple === false) { this.dataForm.StoreId = choseStoreId }
    },

    // 二级药态相关
    filterCategory (arr) {
      var brr = []
      for (let i = 0; i < arr.length; i++) {
        this.drugsCategoryArrCopy.forEach(item => {
          if (item.id === arr[i]) { brr.push(item) }
        })
      }
      this.drugsCategoryArr = brr
    },

    pageInit () {
      // 先请求药品种类提供给下拉列表
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryArr = result.data.filter((item, ind) => {
            return ind > 0
          })
          this.drugsCategoryArrCopy = this.drugsCategoryArr
        }
      })
      // 后初始化页面的右上角：
      this.getStoreCategorytypeStock() // 这往上的代码都必须执行，不能写在下面的代码的后面，以免被return false影响

      // 如果是直接开方，传递的电话就是0了，还请求屁的患者信息，因为请求结果肯定是[]没有的
      if (this.$route.query.MobilePhone === '0') {
        return false
      }
      this.dataListLoading = true
      // 请求会员信息，根据前一层路由传递的会员电话，其实会员信息正常是 只返回一条（自动填充患者的电话、年龄、性别、姓名、病历号...）
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: true,
        UserName: '',
        StoreId: this.$store.getters.getAccountCurrentHandleStore,
        MobilePhone: this.$route.query.MobilePhone // 如果这儿接受到的是电话0，那代表是直接开方模式，0的查询结果自然为空咯
      }
      console.log(params)
      API.member.getMemberList(params).then(result => {
        console.log(result.data) // 如果是医生直接开方这儿会报错的因为是[][0].xx空数组报错的!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
          this.dataForm.RegisterAmount = 0 // 这两个没用，就只是提交的时候直接提交
          this.dataForm.ConsultationAmount = 0
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
      })
    },
    // 右侧药材列表展示的模块：获取 对应门店 对应药态下的 对应药材库
    getStoreCategorytypeStock () {
      API.drugs.getDrugsList({
        Name: '',
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: true,
        SpellName: this.dataForm.SpellName,
        CategoryId: this.activeName, // 被激活的tabs标签页的药材大方向的种类的类型id 1001
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 传不传门店id决定了是否返回库存余量!!!（另外这儿可以能有点问题要处理，因为可能是药房的账号进来，那这样的话如果药房的权限大于医生，那门店库存也更正变大了，这是个要考虑的地方）
        CodeOrBarCode: '' // 暂无
      }).then(result => {
        if (result.code === '0000' && result.data.length > 0) {
          this.dataList = result.data // 这个dataList有啥子用哟？好像没用起来
          this.rightUlData = result.data
          this.totalPage = result.total
          // console.log(result.data)
        } else {
          // this.$message({ message: '查询结果为空', type: 'warning', duration: 3000 })
          this.dataList = []
          this.rightUlData = []
          this.totalPage = 0
          this.$message({ message: `${result.message}`, type: 'warning', duration: 3000 })
        }
        this.dataListLoading = false
      })
    },

    // 右上角的下拉options展示
    querySearch (keyWord, callback) {
      if (keyWord === '') {
        let arr = []
        callback(arr)
        return false
      } else { // 这个返回的内容就是下拉options的内容
        setTimeout(() => { callback(this.rightUlData) }, 400)
      }
    },
    // 后面有三个方法会共同调用这个方法：计算总价
    countTotalPrice (obj) {
      var sum = 0
      obj.forEach(item => {
        sum += item.SalePrice * item.myNum
      })
      this.allMoney = (sum * this.Total).toFixed(2)
    },
    // 1.当点击右侧药材列表的‘添加’按钮的时候
    addDrugs (row) {
      console.log(row)
      if (this.leftTableData.some(item => item.Code === row.Code)) {
        // this.$alert(`[${row.ShowName}] 已添加！`, '提示', {
        // this.$alert(`<b style="color: #409EFF;font-size: 14px;font-weight: 500">[${row.ShowName}]</b> 已添加！`, '提示', {
        //   confirmButtonText: '确定',
        //   dangerouslyUseHTMLString: true,
        //   closeOnClickModal: true,
        //   closeOnPressEscape: true
        // })
        this.$message(`[${row.ShowName}] 已添加！`)
        return false
      }
      // row.myNum = 0 // 让后端加字段要改所有的类型的，这自己加，就没这种问题了myNum
      this.leftTableData.push(row)

      // this.$nextTick(() => {}) push数据后，需要聚焦，为什么不用nextTick，因为聚焦不了啊，弄个时间器把时间间隔弄稳定点
      setTimeout(() => {
        this.$refs.leftCurrentTable.$refs.chd.focus()
      }, 500)
      this.countTotalPrice(this.leftTableData)
    },
    // 2.当点击左边table的‘删除’按钮的时候
    delDrugs (row) {
      this.leftTableData.forEach((item, i) => {
        if (item.Code === row.Code) {
          this.leftTableData.splice(i, 1)
          return false
        }
      })
      this.countTotalPrice(this.leftTableData)
    },
    // 3.改变myNum
    consoleTable () {
      this.leftTableData.push() // 这个可能会非常懵逼，目的是每次改变任何的myNum的值都会重新渲染左边的table，把push()拿掉就能找到问题在哪，这就是这个push()没任何实际参数但还是要写一个在这的原因
      this.countTotalPrice(this.leftTableData)
      // console.log(this.leftTableData)
    },

    // 一级药态被点击时
    handleChange (leftLab) {
      console.log(leftLab)
      if (this.leftTableData.length === 0) { // 没开任何药材时直接切换直接加载呗，都没药材记录还提示啥子嘛
        switch (leftLab) { // [饮片1001、颗粒1002、精品1003、三九1004]
          case '1':
            this.filterCategory(['1001', '1002', '1003', '1004']) // 汤剂
            break
          case '3':
            this.filterCategory(['1004']) // 制膏只有三九
            break
          case '4':
            this.filterCategory(['1001', '1003']) // 制丸只有饮片
            break
          case '5':
            this.filterCategory(['1001', '1003'])
            break
          case '2':
            this.filterCategory(['1001', '1002', '1003', '1004']) // 外用
            break
        }
        this.activeName = this.drugsCategoryArr[0].id
        switch (this.activeName) {
          case '1001':
            this.leftTable = 'TableOne'
            this.rightUl = 'ul-one'
            break
          case '1002':
            this.leftTable = 'TableTwo'
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
        }
        this.dataForm.oldCategoryOne = leftLab
        this.oldTabsName = this.activeName
        this.getStoreCategorytypeStock()
        this.countTotalPrice(this.leftTableData) // 切换药态后立马清空价格
      } else { // 有的时候提示是否确定切换tabs
        this.$confirm('切换药态将清空已经加入的药品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          switch (leftLab) { // [饮片1001、颗粒1002、精品1003、三九1004]
            case '1':
              this.filterCategory(['1001', '1002', '1003', '1004']) // 汤剂
              break
            case '3':
              this.filterCategory(['1004']) // 制膏只有三九
              break
            case '4':
              this.filterCategory(['1001', '1003']) // 制丸只有饮片
              break
            case '5':
              this.filterCategory(['1001', '1003'])
              break
            case '2':
              this.filterCategory(['1001', '1002', '1003', '1004']) // 外用
              break
          }
          this.activeName = this.drugsCategoryArr[0].id
          switch (this.activeName) {
            case '1001':
              this.leftTable = 'TableOne'
              this.rightUl = 'ul-one'
              break
            case '1002':
              this.leftTable = 'TableTwo'
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
          }
          this.dataForm.oldCategoryOne = leftLab
          this.oldTabsName = this.activeName
          this.getStoreCategorytypeStock()
          this.leftTableData = [] // 不只切换，还需要清空左边table信息
          this.countTotalPrice(this.leftTableData) // 切换药态后立马清空价格
        }).catch(() => {
          this.dataForm.CategoryOne = this.dataForm.oldCategoryOne
          this.activeName = this.oldTabsName // 依靠oldTabsName切回上一步，table、ul、和tableData都不需要变了，就是取消切换药态的操作
        })
      }
      // console.log(this.dataForm.CategoryOne, this.dataForm.oldCategoryOne, this.activeName, this.oldTabsName)
      // this.rightCategoryChangeClick(this.activeName) // 切换了一节药态导致二级药态也切换，需要模拟一下点击二级药态时的一些方法
    },

    // 二级药态被点击时
    handleClick (tab, event) {
      // console.log(tab, event)
      // console.log(this.leftTableData)
      this.rightCategoryChangeClick(tab.name)
    },
    rightCategoryChangeClick (categroyId) {
      if (this.leftTableData.length === 0) { // 没开任何药材时直接切换直接加载呗，都没药材记录还提示啥子嘛
        switch (categroyId) {
          case '1001':
            this.leftTable = 'TableOne'
            this.rightUl = 'ul-one'
            break
          case '1002':
            this.leftTable = 'TableTwo'
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
        }
        this.oldTabsName = this.activeName
        this.getStoreCategorytypeStock()
        this.countTotalPrice(this.leftTableData) // 切换药态后立马清空价格
      } else { // 有的时候提示是否确定切换tabs
        this.$confirm('切换药品将清空已经加入的药品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          switch (categroyId) {
            case '1001':
              this.leftTable = 'TableOne'
              this.rightUl = 'ul-one'
              break
            case '1002':
              this.leftTable = 'TableTwo'
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
          }
          this.oldTabsName = this.activeName
          this.getStoreCategorytypeStock()
          this.leftTableData = [] // 不只切换，还需要清空左边table信息
          this.countTotalPrice(this.leftTableData) // 切换药态后立马清空价格
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
      if (this.leftTableData.length === 0) {
        this.$alert(`处方未添加药品，无法提交！`, '提示', {
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
          // 此为普通流程的开方参数，常规流程的开方的参数应该传给edit接口
          var paramsEdit = {
            id: this.$route.query.registerFormId, //
            DiagnosisType: this.dataForm.DiagnosisType, // 出诊、复诊
            RegisterStatus: '2', // 已支付（在编辑 追加的情况下，理论上是肯定收费了就不需要传递这个字段了的，但是后端有其他考虑，所以这儿还需要把这个字段传递到后端）
            Remark: '', // 备注
            FamilyIllness: '', // 家族史????
            DepartmentType: '1', // 科室???????
            PersonalIllness: '', // 个人史?????????
            AgoIllness: '', // 既往史?????????????????

            // NowIllness: this.dataForm.NowIllness, // 现病史
            // DiseaseTime: this.dataForm.DiseaseTime, // 发病时间
            MainSuit: this.dataForm.MainSuit, // 主诉
            DiseaseInfo: this.dataForm.DiseaseInfo.join('，'), // 诊断信息
            DrugRate: this.DrugRate, // 用药频率
            DoctorAdvice: this.dataForm.DoctorAdvice, // 医嘱
            Total: this.Total, // 总剂数
            ItemsJson: JSON.stringify(this.leftTableData.map(item => {
              var obj = {
                ProductId: item.Id,
                ProductCode: item.Code,
                ProductName: item.ShowName,
                CostPrice: item.CostPrice,
                SalePrice: item.SalePrice,
                RealPrice: item.SalePrice,
                Quantity: item.myNum,
                SupplierId: 0,
                SupplierCode: 0 // 库存的药材不是合并了的嘛，哪还能确定供应商啊
              }
              return obj
            })),
            CategoryOne: this.dataForm.CategoryOne,
            WorkAmount: this.dataForm.WorkAmount // 加工费
          }
          // ‘直接开方’参数，直接开方的参数应该传给create接口
          var paramsCreate = {
            StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店
            AccountId: this.$route.query.DoctorId, // 医生
            UserId: this.dataForm.UserId, // 患者
            OrderType: '1',
            DiagnosisType: this.dataForm.DiagnosisType,

            RegisterStatus: '1', // 未支付
            RegisterAmount: this.dataForm.ConsultationAmount,
            ConsultationAmount: 0,
            PaymentWay: '',
            Remark: '',
            DepartmentType: '',
            AgoIllness: '',

            MainSuit: this.dataForm.MainSuit,
            DiseaseInfo: this.dataForm.DiseaseInfo.join('，'), // 诊断结果

            // NowIllness: this.dataForm.NowIllness,
            // DiseaseTime: this.dataForm.DiseaseTime,
            DoctorAdvice: this.dataForm.DoctorAdvice,
            DrugRate: this.DrugRate,
            Total: this.Total,
            ItemsJson: JSON.stringify(this.leftTableData.map(item => {
              var obj = {
                ProductId: item.Id,
                ProductCode: item.Code,
                ProductName: item.ShowName,
                CostPrice: item.CostPrice,
                SalePrice: item.SalePrice,
                RealPrice: item.SalePrice,
                Quantity: item.myNum,
                SupplierId: 0,
                SupplierCode: 0 // 库存的药材不是合并了的嘛，哪还能确定供应商啊
              }
              return obj
            })),
            CategoryOne: this.dataForm.CategoryOne,
            WorkAmount: this.dataForm.WorkAmount // 加工费
          }
          console.log(paramsEdit) // 电话为0表示直接开方模式应该提交费create接口、如果有正常的电话那应该是正常的开方模式应该提交到edit接口
          console.log(paramsCreate) // 电话为0表示直接开方模式应该提交费create接口、如果有正常的电话那应该是正常的开方模式应该提交到edit接口
          // var tick = API.register.sendRecipelToEdit(paramsEdit)
          var tick = this.$route.query.MobilePhone === '0' ? API.register.registerSubmit(paramsCreate) : API.register.sendRecipelToEdit(paramsEdit)
          console.log(this.$route.query.MobilePhone)
          tick.then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: `${'发送成功'}`,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$router.push({path: '/doctor/treatment'})
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
.recipelAgeUnit /deep/ {
  display: inline-block;
  .el-input__inner {
    padding: 0 5px;
  }
}
.doctor-recipel /deep/ {
  /*诊断结果的样式*/
  .el-select-dropdown__wrap {padding-bottom: 5px;}
  .el-select-dropdown__item {float: left; display: block !important;}
  .el-select-dropdown__item.selected::after {right: 5px}

  /*一级药态的样式*/
  .el-radio.is-bordered + .el-radio.is-bordered {margin-left: 5px}
  .el-radio__label {padding-left: 5px}
  .el-radio--mini.is-bordered {padding: 6px 10px 0 10px}
}

.doctor-recipel /deep/ {
  /*.el-select-dropdown__item {float: left}*/
  background-color: #fff;
  margin: 0 10px;
  border: 1px solid #DCDFE6;
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 9px;
  }
  .el-main {position: relative;}
  .el-main::-webkit-scrollbar { width: 0px; }

  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar, .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar, .ownScrollbar::-webkit-scrollbar {
    width: 7px;
    /*z-index: -1;*/
  }
  .ownScrollbar:hover::-webkit-scrollbar {
    /*display: block;*/
  }
  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-thumb, .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar-thumb, .ownScrollbar::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    background-color: #eee;
  }
  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-track, .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar-track, .ownScrollbar::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: inset 0 0 5px rgba(0,0,0,0);
    background-color: rgba(0,0,0,0);
  }

  /*rightUlStyle 容器div*/
  .rightUlStyle {
    position: relative;
    width: 80%;
    min-width: 190px;
    ul {
      width: 100%;
      min-height: 550px; // 拿尺子对着电脑屏幕量过，就这个值吧
      max-height: 550px;
      overflow-y: scroll;
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
.doctor-recipel /deep/ {
  .el-form-item {
    margin-bottom: 7px;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  /*表头高重写35高*/
  .el-table--medium th, .el-table--medium td, & .el-table th, & .el-table td,
  .el-table--medium th, .el-table--medium td, & .el-table th, & .el-table td {
    padding: 0 !important;
  }
  /*& /deep/ .el-tabs__content {background-color: #F0F0F0}*/
  .purchaseListRow {
    color: #606266;
    td {padding: 0;}
    td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
  /*cutOut剪纸show切换动画*/
  .v-enter, .v-leave-to {opacity: 0}
  .v-enter-active, .v-leave-active {transition: all 0.4s ease}
  .v-enter-to, .v-leave {opacity: 1}
}
</style>
