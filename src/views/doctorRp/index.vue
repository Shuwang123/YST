<template>
  <div class="doctor-recipel">
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="80px" size="mini">
      <el-container style="padding-left: 20px">
        <el-aside width="75%" style="border-right: 1px solid #DCDFE6; padding-right: 5px;min-width: 700px;">
          <div id="leftHeightPatient">
            <p style="text-align: center;font-size: 16px; padding: 5px 0 20px 0;">
              <span style="position: relative; top: 10px;font-size: 18px; font-weight: 600;cursor: pointer"
                    @click="cutOut = !cutOut" :title="cutOut ? '点击收起' : '点击展开'"> 处方笺
                <b style="font-weight: 700;font-size: 12px;color: #409EFF;
                   text-decoration: underline">{{cutOut ? '点击收起' : '点击展开'}}
                </b>
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
            </el-row>

            <transition>
              <div v-show="cutOut">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="电话" prop="MobilePhone">
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
                    <el-form-item label="看诊类型" prop="DiagnosisType">
                      <el-radio-group v-model="dataForm.DiagnosisType">
                        <el-radio-button label="1">初诊</el-radio-button>
                        <el-radio-button label="2">复诊</el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="一级药态" prop="CategoryOne">
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
                    @visible-change="selHide1()">
                    <el-option v-for="item in zhenduanOptions" :key="item.value"
                      :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="border-bottom: 1px solid #E6E6E6; font-weight: 500">
              R: [{{dataForm.oldCategoryOneName}}] - [{{oldTwoTabsName}}]</div>
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
                       @blurEvent="$refs.customInput.focus()"
                       @tableEvent="delDrugs"
                       @tableNumberEvent="consoleTable">
            </component>
            <!---->
            <!--v-if="addOrUpdateVisible" ref="patientListPop" @childEven="zairuFun"-->
          </el-table>
        </el-aside>

        <!--右侧药材：tabs标签页切换引导组件切换-->
        <!---->
        <!--其实这儿感觉可以不用传递一级药态dataForm.CategoryOne，直接传递-2查询全部，因为载入后我做了相应的自动切换药态的功能-->
        <!--名验方-->
        <el-main width="25%" style="padding: 0 10px 40px; border-bottom: 1px solid #DCDFE6;">
          <div style="margin: 5px 0;width: 279px;overflow: hidden;cursor: pointer">
            <el-button type="warning" plain size="mini" @click="openAgreementRecipelList('40', '-2')">协定方</el-button>
            <el-button type="warning" plain size="mini" @click="openAgreementRecipelList('41', '-2')">经典方</el-button>
            <el-button type="warning" plain size="mini" @click="openAgreementRecipelList('42', '-2')">理疗产品</el-button>
          </div>

          <!--<el-autocomplete 这用组件实现的时候聚焦的时候玩不动，最后自己实现了一个类似的功能，下面挨着的那个-->
            <!--ref="customnput"-->
            <!--popper-class="my-autocomplete"-->
            <!--v-model="dataForm.SpellName"-->
            <!--:fetch-suggestions="querySearch"-->
            <!--:placeholder="`请输入药材拼音首字母 ${$store.getters.getAccountCurrentHandleStore}`" style="min-width: 190px; width: 100%" size="small"-->
            <!--@select="addDrgs" @blur="dataForm.SpellName = ''">-->
            <!--<i slot="prefix" class="el-input__icon el-icon-search"></i>-->
            <!--<template slot-scope="{ item }">-->
              <!--<div>{{ item.ShowName }} 余<span style="color: red">{{ item.Quantity }}</span></div>-->
            <!--</template>-->
          <!--</el-autocomplete>-->
          <div style="position: relative">
            <el-input v-model="dataForm.SpellName"
                      ref="customInput"
                      @blur="rightTopInputBlur()"
                      @focus="rightIsFocus = true"

                      @keyup.38.native="autoSelectUpper()"
                      @keyup.40.native="autoSelectDown()"
                      @keyup.enter.native="addDrugs"
                      placeholder="请输入药材拼音首字母" style="min-width: 190px; width: 100%" size="small"></el-input>
            <ul v-show="rightIsFocus && dataForm.SpellName !== ''"
                class="own-methods"
                ref="ownMethods">
              <li v-for="(item, index) in rightUlData" :key="item.Id"
                  :class="[index === keyCode_40Count ? 'isLi' : '']" @click="addDrugs(item)">
                <span style="display: inline-block; vertical-align: middle; width: 60px;overflow: hidden; white-space: nowrap;text-overflow: ellipsis">{{ item.ShowName }}</span>
                <span style="color: #e4393c;">{{item.CategoryId === '1002' ? '精品' : ''}}</span>
                余<span style="color: red">{{ item.Quantity }}</span>
              </li>
            </ul>
          </div>

          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in drugsCategoryArr" :key="item.id" :label="item.text" :name="item.id"></el-tab-pane>
          </el-tabs>
          <div class="rightUlStyle">
            <ul class="ul-true">
              <li v-for="item in rightUlData" :key="item.Id">
                <el-tooltip class="item" effect="light" :content="`${item.ShowName} [余量${item.Quantity}]${item.CategoryId === '1002' ? '精' : ''}`" placement="left">
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
                        {{item.Quantity}} {{item.CategoryId === '1002' ? '精品' : ''}} <!--{{item.Id}} {{item.RedLine}}-->
                      </span>
                    </el-col>

                    <el-col :span="6" v-if="item.Quantity > 0" style="text-align: right;padding-right: 7px">
                      <!--<el-button type="text" size="mini" @click="cutOut = false; adDrugs(item)"-->
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

      <el-footer height="126px" style="padding-top: 7px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="总剂数">
              <el-input-number v-model="Total" @change="countTotalPrice(leftTableData)" :min="1" :step="1" :max="30" style="width: 95px"></el-input-number> 剂
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="用法：" prop="DrugRate_0">
              <span v-if="!unitIsG">
                每日
                <el-select v-model="dataForm.DrugRate_0" style="width: 70px">
                  <el-option v-for="item in DrugRateOptionsArr_step0"
                             :key="item.lab" :label="item.lab" :value="item.val"></el-option>
                </el-select>
                剂，分
                <el-select v-model="dataForm.DrugRate_1" style="width: 70px">
                  <el-option v-for="item in DrugRateOptionsArr"
                             :key="item.lab" :label="item.lab" :value="item.val"></el-option>
                </el-select>
                次，
              </span>
              <span v-else>
                每日
                <el-select v-model="dataForm.DrugRate_0" style="width: 70px">
                  <el-option v-for="item in DrugRateOptionsArr"
                             :key="item.lab" :label="item.lab" :value="item.val"></el-option>
                </el-select>
                次，一次
                <el-select v-model="dataForm.DrugRate_2" style="width: 70px">
                  <el-option v-for="item in DrugRateOptionsArr_step5"
                             :key="item.lab" :label="item.lab" :value="item.val"></el-option>
                </el-select>
                克，
              </span>

              <el-select v-model="dataForm.DrugRate_3" style="width: 117px">
                <el-option label="空腹" value="空腹"></el-option>
                <el-option label="晨起" value="晨起"></el-option>
                <el-option label="睡前" value="睡前"></el-option>
                <el-option label="饭前1小时" value="饭前1小时"></el-option>
                <el-option label="饭后1小时" value="饭后1小时"></el-option>
              </el-select> 服。
            </el-form-item>
          </el-col>
          <el-col :span="24" class="yizhuCss">
            <el-form-item label="医生嘱咐" prop="DoctorAdvice" :inline-message="true">
              <el-select
                v-model="dataForm.DoctorAdvice"
                multiple
                filterable allow-create reserve-keyword :collapse-tags="false"
                default-first-option
                :popper-append-to-body="false"
                placeholder="请填写医嘱" style="width: 100%"
                @visible-change="selHide4()">
                <el-option v-for="item in yizhuOptions" :key="item.value"
                           :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-footer>

      <div style="position: fixed;bottom: 0;left: 0px;right: 0;height: 49px;line-height: 49px;border-top: 1px solid #DEDEDE;
                  padding-left: 230px;background-color: #f1f2f7;z-index: 999">
        <el-row>
          <el-col :span="6">
            <el-form-item label="开方医生" style="margin-top: 11px">
              <el-input v-model="$route.query.DoctorName" placeholder="onlyReady" style="width: 110px" :disabled="true"></el-input>
            </el-form-item>
            <!--{{$route.query.DoctorId}}-->
          </el-col>
          <el-col :span="14" style="font-weight: 500; font-size: 16px;cursor: pointer;">
            <div style="width: 540px; overflow: hidden;text-align: center">
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
                  + <el-input-number v-model="dataForm.ConsultationAmount" :min="0" :max="1000" style="width: 100px" size="mini"></el-input-number>
                </span>
              </el-tooltip>

              <!--药方总重量：只针对制膏制丸 [用的计算属性处理]-->
              <el-tooltip placement="top">
                <div slot="content">加工费规则：<br/><br/>待编辑</div>
                <span v-show="dataForm.CategoryOne !== '1' &&
                        dataForm.CategoryOne !== '2' && leftTableData.length !== 0">
                ；总重量：{{categoryAllWeight}} g</span>
              </el-tooltip>

            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="iconfont icon-ico_zhongyaofangguanli_zhongyaoqingling"
                       @click="send()" size="mini" style="margin-top: 11px">&nbsp;发送给药房</el-button>
            <span style="font-weight: 700;font-size: 12px;color: #409EFF;cursor: pointer;
                   text-decoration: underline" @click="$refs.dataForm.clearValidate()">重置校验</span>
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
  // 离开开方页
  beforeRouteLeave (to, from, next) {
    if (from.path === '/doctor/recipel' && this.leftTableData.join() !== '' && this.dataForm.MobilePhone !== '' && this.isSubmit === false) {
      this.$confirm(`是否在离开页面前保存临时处方？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        var arr = {
          // StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店
          doctorId: this.$route.query.DoctorId, // 医生
          memberPhone: this.dataForm.MobilePhone, // 会员号（患者）

          oneDrugCategory: this.dataForm.oldCategoryOne,
          childDrugCategory: this.oldTabsName,
          zhusu: this.dataForm.MainSuit,
          zhenduan: this.dataForm.DiseaseInfo,

          recipelItems: this.leftTableData, // 处方明细
          agent: this.Total, // 剂
          uses: [this.dataForm.DrugRate_0, this.dataForm.DrugRate_1, this.dataForm.DrugRate_2, this.dataForm.DrugRate_3], // 用法
          yizhu: this.dataForm.DoctorAdvice}
        this.$store.commit('setRecipelSaveFiles', arr)
        next()
      }).catch(() => {
        this.$message({type: 'info', message: '放弃处方'})
        next()
      })
    } else {
      next()
    }
  },
  // 进入开方页
  beforeRouteEnter (to, from, next) {
    if (to.path === '/doctor/recipel') {
      next(vm => {
        // vm，都不晓得哪冒出来的，居然可以直接用，这查查资料
        if (vm.$store.getters.getRecipelSaveFiles.some(item => {
          return item.memberPhone === vm.$route.query.MobilePhone && item.doctorId === vm.$route.query.DoctorId
        })) {
          vm.$confirm(`你有历史开方记录，是否调用？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            type: 'warning'
          }).then(() => {
            var sessionRecipel = vm.$store.getters.getRecipelSaveFiles
            console.log(sessionRecipel)
            sessionRecipel.forEach((item, index) => {
              if (item.memberPhone === vm.$route.query.MobilePhone && item.doctorId === vm.$route.query.DoctorId) {
                vm.dataForm.oldCategoryOne = sessionRecipel[index].oneDrugCategory
                vm.dataForm.CategoryOne = sessionRecipel[index].oneDrugCategory
                vm.oldTabsName = sessionRecipel[index].childDrugCategory
                vm.activeName = sessionRecipel[index].childDrugCategory
                vm.getStoreCategorytypeStock()

                vm.leftTableData = sessionRecipel[index].recipelItems // 还原处方
                // 患者信息不用还原，不管是直接开方进来后选患者，还是就诊进来，都自己就有患者信息了，所以不用利用session中的患者电话重新查询了
                vm.dataForm.MainSuit = sessionRecipel[index].zhusu
                vm.dataForm.DiseaseInfo = sessionRecipel[index].zhenduan
                vm.Total = sessionRecipel[index].agent
                vm.dataForm.DrugRate_0 = sessionRecipel[index].uses[0]
                vm.dataForm.DrugRate_1 = sessionRecipel[index].uses[1]
                vm.dataForm.DrugRate_2 = sessionRecipel[index].uses[2]
                vm.dataForm.DrugRate_3 = sessionRecipel[index].uses[3]
                vm.dataForm.DoctorAdvice = sessionRecipel[index].yizhu

                vm.$store.commit('delRecipelSaveFiles', index)
                return false
              }
            })
          }).catch(() => {
            var sessionRecipel = vm.$store.getters.getRecipelSaveFiles
            sessionRecipel.forEach((item, index) => {
              if (item.memberPhone === vm.$route.query.MobilePhone && item.doctorId === vm.$route.query.DoctorId) {
                vm.$store.commit('delRecipelSaveFiles', index)
                return false
              }
            })
          })
        }
        next()
      })
    }
  },
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
      // console.log(val)
      var isEmpty = val === '' ? true : false // 右上角输入
      this.getStoreCategorytypeStock()

      if (isEmpty) { // 输入框被清空时，要清空已激活的字母按钮的样式
        this.litterArr.forEach(item => { item.isActive = false })
      }
      // console.log(this.rightUlData)
    },
    Total (val, oldval) {
      if (val === undefined) {
        // console.log(val)
        this.Total = 1
      }
    },
    // 监听药费的变化，及时算出当前药材总重量，最后搭配一级药态计算出：水丸（水泛丸）、水蜜丸、39制膏 它三的加工费
    allMoney (val, oldval) {
      // 当前处方药材累计总重量
      var drugWeight = this.categoryAllWeight

      // 999颗粒制膏：加工费 <=2000g全算100元,之后每增加200g算10元，零头100<=x<200算5元
      var limit2000g = drugWeight <= 2000
      if (!limit2000g)
        var percent200 = (drugWeight - 2000) % 200 >= 100 ? 1 : 0

      // 饮片制水泛丸：加工费 <=1000g全算80元,之后每增加100g算8元，零头50<=x<100算4元
      // 饮片制水蜜丸：加工费 <=1000g全算100元,之后每增加100g算10元，零头50<=x<100算5元
      var limit1000g = drugWeight <= 1000
      if (!limit1000g)
        var percent100 = (drugWeight - 1000) % 100 >= 50 ? 1 : 0

      // console.log(drugWeight, limit2000g, percent200, limit1000g, percent100)
      if (this.dataForm.CategoryOne === '3') { // 999颗粒：制膏
        this.dataForm.WorkAmount = limit2000g ? 100 : 100 + Math.floor((drugWeight - 2000) / 200) * 10 + percent200 * 5
      } else if (this.dataForm.CategoryOne === '4') { // 饮片制丸：水泛丸
        this.dataForm.WorkAmount = limit1000g ? 80 : 80 + Math.floor((drugWeight - 1000) / 100) * 8 + percent100 * 4
      } else if (this.dataForm.CategoryOne === '5') { // 饮片制丸：水蜜丸
        this.dataForm.WorkAmount = limit1000g ? 100 : 100 + Math.floor((drugWeight - 1000) / 100) * 10 + percent100 * 5
      } else { // 其他的那些没有加工费
        this.dataForm.WorkAmount = 0
      }
    },
    oldTabsName (val, oldval) {
      switch (val) {
        case '1001':
          this.oldTwoTabsName = '饮片'
          break
        case '1002':
          this.oldTwoTabsName = '精品饮片'
          break
        case '1003':
          this.oldTwoTabsName = '饮片3'
          break
        case '1004':
          this.oldTwoTabsName = '饮片4'
          break
      }
    }
  },
  data () {
    return {
      isActiveLi: true, // 右上角的药材拼音输入框的下拉样式
      zhenduanOptions: [ // 诊断结果的下拉
        {
          value: '无',
          label: '无'
        }, {
          value: '咳嗽',
          label: '咳嗽'
        }, {
          value: '头痛',
          label: '头痛'
        }, {
          value: '眩晕',
          label: '眩晕'
        }, {
          value: '痹症',
          label: '痹症'
        }, {
          value: '胸痛',
          label: '胸痛'
        }, {
          value: '肋痛',
          label: '肋痛'
        }, {
          value: '胸脘痛',
          label: '胸脘痛'
        }, {
          value: '腹痛',
          label: '腹痛'
        }, {
          value: '呕吐',
          label: '呕吐'
        }, {
          value: '泄泻',
          label: '泄泻'
        }, {
          value: '痛经',
          label: '痛经'
        }, {
          value: '月经',
          label: '月经'
        }, {
          value: '先期',
          label: '先期'
        }, {
          value: '月经后期',
          label: '月经后期'
        }, {
          value: '停经',
          label: '停经'
        }, {
          value: '月经先后无定期',
          label: '月经先后无定期'
        }, {
          value: '湿疹',
          label: '湿疹'
        }, {
          value: '荨麻疹',
          label: '荨麻疹'
        }, {
          value: '汗疹',
          label: '汗疹'
        }, {
          value: '气虚',
          label: '气虚'
        }, {
          value: '气血虚',
          label: '气血虚'
        }, {
          value: '血瘀',
          label: '血瘀'
        }, {
          value: '脾虚',
          label: '脾虚'
        }, {
          value: '肾虚',
          label: '肾虚'
        }, {
          value: '乳癖',
          label: '乳癖'
        }, {
          value: '郁诊',
          label: '郁诊'
        }, {
          value: '痛风',
          label: '痛风'
        }, {
          value: '厌食',
          label: '厌食'
        }, {
          value: '感冒',
          label: '感冒'
        }, {
          value: '失眠',
          label: '失眠'
        }
      ],
      yizhuOptions: [ // 医嘱的下拉
        {
          value: '无',
          label: '无'
        }, {
          value: '忌辛辣',
          label: '忌辛辣'
        }, {
          value: '忌油腻',
          label: '忌油腻'
        }, {
          value: '忌生冷',
          label: '忌生冷'
        }, {
          value: '忌烟酒',
          label: '忌烟酒'
        }, {
          value: '忌发物',
          label: '忌发物'
        }, {
          value: '忌荤腥',
          label: '忌荤腥'
        }, {
          value: '忌酸涩',
          label: '忌酸涩'
        }, {
          value: '忌刺激性食物',
          label: '忌刺激性食物'
        }, {
          value: '忌光敏性食物',
          label: '忌光敏性食物'
        }, {
          value: '忌难消化食物',
          label: '忌难消化食物'
        }, {
          value: '备孕禁服',
          label: '备孕禁服'
        }, {
          value: '怀孕禁服',
          label: '怀孕禁服'
        }, {
          value: '经期停服',
          label: '经期停服'
        }, {
          value: '感冒停服',
          label: '感冒停服'
        }, {
          value: '忌与西药同服',
          label: '忌与西药同服'
        }
      ],
      DrugRateOptionsArr_step0: [
        {lab: '0.5', val: '0.5'},{lab: '1', val: '1'}, {lab: '2', val: '2'}, {lab: '3', val: '3'},
        {lab: '4', val: '4'}, {lab: '5', val: '5'}, {lab: '6', val: '6'},
        {lab: '7', val: '7'}, {lab: '8', val: '8'}, {lab: '9', val: '9'}
      ],
      DrugRateOptionsArr: [
        {lab: '1', val: '1'}, {lab: '2', val: '2'}, {lab: '3', val: '3'},
        {lab: '4', val: '4'}, {lab: '5', val: '5'}, {lab: '6', val: '6'},
        {lab: '7', val: '7'}, {lab: '8', val: '8'}, {lab: '9', val: '9'}
      ],
      unitIsG: false, // 除了丸子用法是g之外，用法都是次
      DrugRateOptionsArr_step5: [
        {lab: '5', val: '5'},
        {lab: '6', val: '6'},
        {lab: '7', val: '7'},
        {lab: '8', val: '8'},
        {lab: '9', val: '9'},
        {lab: '10', val: '10'},
        {lab: '11', val: '11'},
        {lab: '12', val: '12'},
        {lab: '13', val: '13'},
        {lab: '14', val: '14'},
        {lab: '15', val: '15'},
        {lab: '16', val: '16'},
        {lab: '17', val: '17'},
        {lab: '18', val: '18'},
        {lab: '19', val: '19'},
        {lab: '20', val: '20'},
        {lab: '21', val: '21'},
        {lab: '22', val: '22'},
        {lab: '23', val: '23'},
        {lab: '24', val: '24'},
        {lab: '25', val: '25'},
        {lab: '26', val: '26'},
        {lab: '27', val: '27'},
        {lab: '28', val: '28'},
        {lab: '29', val: '29'},
        {lab: '30', val: '30'},
        {lab: '31', val: '31'},
        {lab: '32', val: '32'},
        {lab: '33', val: '33'},
        {lab: '34', val: '34'},
        {lab: '35', val: '35'},
        {lab: '36', val: '36'},
        {lab: '37', val: '37'},
        {lab: '38', val: '38'},
        {lab: '39', val: '39'},
        {lab: '40', val: '40'},
        {lab: '41', val: '41'},
        {lab: '42', val: '42'},
        {lab: '43', val: '43'},
        {lab: '44', val: '44'},
        {lab: '45', val: '45'},
        {lab: '46', val: '46'},
        {lab: '47', val: '47'},
        {lab: '48', val: '48'},
        {lab: '49', val: '49'},
        {lab: '50', val: '50'}
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
      oldTwoTabsName: '饮片', // 二级药态记录
      activeName: '1001',

      leftTable: 'TableOne', // 左侧表格 组件的引用名切换哟，这的值决定
      leftTableData: [], // 左侧表格的数据
      rightUl: '', // 右侧列表
      rightUlData: [], // 右侧列表的数据

      addOrUpdateVisibleAgreement: false,
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

        DiagnosisType: '1', // 看诊类型
        oldCategoryOne: '1', // 一级药态记录
        oldCategoryOneName: '汤剂', // 一级药态记录 ???
        CategoryOne: '1', // 一级药态类型
        // DiseaseTime: '', // 发病时间
        // AgoIllness: '', // 过敏史
        // NowIllness: '', // 现病史
        MainSuit: '', // 主诉
        DiseaseInfo: [], // 诊断信息

        SpellName: '',
        // Dte: '', // 用药间隔
        DrugRate_0: '1', // 每日几剂，几次 搭配计算属性
        DrugRate_1: '3', // 一剂分几次服
        DrugRate_2: '5', // 一次几克

        DrugRate_3: '饭后1小时', // 饭前服、饭后服、睡前服...
        DoctorAdvice: [], // 医嘱
        RegisterAmount: 0, // 挂号费
        ConsultationAmount: 0, // 诊疗费
        WorkAmount: 0 // 加工费 （只有一级药态为制膏、制丸的情况下才有）
      },
      dataRule: {
        UserName: Currency('必填项'),
        Sex: Currency('必填项'),
        BirthDate: Currency('必填项'),
        MobilePhone: Currency('必填项'),

        MainSuit: Currency('主诉必填'),
        DiseaseInfo: Currency('诊断结果必填'),
        DiagnosisType: Currency('出诊复诊必填'),
        CategoryOne: Currency('一级药态必填'),
        DrugRate_0: Currency('用法必填')
      },
      Total: 1, // 剂数
      allMoney: 0,

      isClickRightAddButton: false, // 搭配 updated () {} 聚焦
      rightIsFocus: false, // 判断右上角输入框是否处于聚焦状态
      keyCode_40Count: 0, // 在右上角的输入框中按下‘↓’键，总次数统计
      isSubmit: false // 退出保存判断
    }
  },
  computed: {
    // 服用方法
    'DrugRate': function () {
      if (!this.unitIsG) {
        return `每日${this.dataForm.DrugRate_0}剂，分${this.dataForm.DrugRate_1}次，${this.dataForm.DrugRate_3}服`
      } else {
        return `每日${this.dataForm.DrugRate_0}次，一次${this.dataForm.DrugRate_2}克，${this.dataForm.DrugRate_3}服`
      }
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
  // 右上角的输入框按下enter的时候（或者单击add按钮的时候），左边的table最后行聚焦
  updated () {
    if (this.isClickRightAddButton) {
      this.$refs.leftCurrentTable.$refs.chd.focus()
      this.isClickRightAddButton = false // 搭配 updated () {} 聚焦
    }
  },
  methods: {
    selHide1 () { // 当前select的下拉option块部分 隐藏的时候触发此方法
      var txt = document.getElementsByClassName('el-select-dropdown__list')[1]
        .firstElementChild.firstElementChild.innerHTML
      // [n] n受到整个页面中所有select的个数的影响，比如页头月、岁、页底的服用方法的下拉
      if (txt === this.zhenduanOptions[0].value || this.dataForm.DiseaseInfo.some((item) => { // some阻止重复输入
        return item === txt
      })) { return false } // *关键点这步*
      this.dataForm.DiseaseInfo.push(txt)
    },
    selHide4 () { // 当前select的下拉option块部分 隐藏的时候触发此方法
      var txt = document.querySelector('.yizhuCss .el-select-dropdown__list')
        .firstElementChild.firstElementChild.innerHTML
      // [n] n受到整个页面中所有select的个数的影响，比如页头月、岁、页底的服用方法的下拉
      if (txt === this.yizhuOptions[0].value || this.dataForm.DoctorAdvice.some((item) => { // some阻止重复输入
        return item === txt
      })) { return false } // *关键点这步*
      this.dataForm.DoctorAdvice.push(txt)
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
      // console.log(row)
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

      // 调用历史处方
      if (this.$store.getters.getRecipelSaveFiles.some(item => {
        return item.memberPhone === this.dataForm.MobilePhone && item.doctorId === this.$route.query.DoctorId
      })) {
        this.$confirm(`你有历史开方记录，是否调用？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          var sessionRecipel = this.$store.getters.getRecipelSaveFiles
          sessionRecipel.forEach((item, index) => {
            if (item.memberPhone === this.dataForm.MobilePhone && item.doctorId === this.$route.query.DoctorId) {
              this.dataForm.oldCategoryOne = sessionRecipel[index].oneDrugCategory
              this.dataForm.CategoryOne = sessionRecipel[index].oneDrugCategory
              this.oldTabsName = sessionRecipel[index].childDrugCategory
              this.activeName = sessionRecipel[index].childDrugCategory
              this.getStoreCategorytypeStock()

              this.leftTableData = sessionRecipel[index].recipelItems // 还原处方
              // 患者信息不用还原，不管是直接开方进来后选患者，还是就诊进来，都自己就有患者信息了，所以不用利用session中的患者电话重新查询了
              this.dataForm.MainSuit = sessionRecipel[index].zhusu
              this.dataForm.DiseaseInfo = sessionRecipel[index].zhenduan
              this.Total = sessionRecipel[index].agent
              this.dataForm.DrugRate_0 = sessionRecipel[index].uses[0]
              this.dataForm.DrugRate_1 = sessionRecipel[index].uses[1]
              this.dataForm.DrugRate_2 = sessionRecipel[index].uses[2]
              this.dataForm.DrugRate_3 = sessionRecipel[index].uses[3]
              this.dataForm.DoctorAdvice = sessionRecipel[index].yizhu

              this.$store.commit('delRecipelSaveFiles', index)
              return false
            }
          })
        }).catch(() => {
          var sessionRecipel = this.$store.getters.getRecipelSaveFiles
          sessionRecipel.forEach((item, index) => {
            if (item.memberPhone === this.dataForm.MobilePhone && item.doctorId === this.$route.query.DoctorId) {
              this.$store.commit('delRecipelSaveFiles', index)
              return false
            }
          })
        })
      }
    },
    // 打开协定方列表接口
    openAgreementRecipelList (typeNum, Category) {
      this.addOrUpdateVisibleAgreement = true
      this.$nextTick(() => {
        this.$refs.agreementPop.init(typeNum, Category)
      })
    },
    // 一级药态切换后，右边的4个二级药态也要重新排列
    comOneCategoryChangeFunction (one) { // one：一级药态 - [饮片1001、颗粒1002、精品1003、三九1004]
      switch (one) {
        case '1':
          this.filterCategory(['1001', '1002', '1003', '1004']) // 汤剂
          this.dataForm.oldCategoryOneName = '汤剂'
          this.unitIsG = false
          this.dataForm.DrugRate_0 = '1'
          break
        case '3':
          this.filterCategory(['1003']) // 制膏只有三九
          this.dataForm.oldCategoryOneName = '制膏'
          this.unitIsG = false
          this.dataForm.DrugRate_0 = '1'
          break
        case '4':
          this.filterCategory(['1001', '1002']) // 制丸只有饮片
          this.dataForm.oldCategoryOneName = '水泛丸'
          this.unitIsG = true
          this.dataForm.DrugRate_0 = '3'
          break
        case '5':
          this.filterCategory(['1001', '1002']) // 制丸只有饮片
          this.dataForm.oldCategoryOneName = '水蜜丸'
          this.unitIsG = true
          this.dataForm.DrugRate_0 = '3'
          break
        case '2':
          this.filterCategory(['1001', '1002', '1003', '1004']) // 外用
          this.dataForm.oldCategoryOneName = '外用'
          this.unitIsG = false
          this.dataForm.DrugRate_0 = '1'
          break
      }
    },
    // 二级药态相关，重新排列计算
    filterCategory (arr) {
      var brr = []
      for (let i = 0; i < arr.length; i++) {
        this.drugsCategoryArrCopy.forEach(item => {
          if (item.id === arr[i]) { brr.push(item) }
        })
      }
      this.drugsCategoryArr = brr
    },
    zairuFunAgreement (agreementId) {
      API.register.getRegisterInfo({id: agreementId}).then(result => {
        if (result.code === '0000') {
          console.log(result.data)
          // this.dataForm.MainCure = result.data.MainCure // 主治
          // this.dataForm.Effect = result.data.Effect // 功效
          // this.dataForm.Explain = result.data.Explain // 说明
          this.dataForm.oldCategoryOne = String(result.data.CategoryOne) // 药态一级记录 1内服2外用3制膏4水丸5水蜜丸
          this.dataForm.CategoryOne = String(result.data.CategoryOne) // 药态一级分类 1内服2外用3制膏4水丸5水蜜丸
          this.comOneCategoryChangeFunction(this.dataForm.CategoryOne)
          // 1、把协定方里保存的药材克数存下来
          this.leftTableData = result.data.SaleOrderItems.map(item => {
            item.myNum = item.Quantity

            item.Id = item.ProductId
            item.Code = item.ProductCode
            item.ShowName = item.ProductName
            return item
          })

          // 根据协定方的药态，控制右边 子药态 的初始选中值
          if (result.data.SaleOrderItems.some(item => String(item.CategoryId) === '1002')) { // 如果是精品类型的协定方，就要避免第一味药就出现普通饮片的可能
            this.oldTabsName = '1002'
            this.activeName = '1002'
          } else {
            this.oldTabsName = String(result.data.SaleOrderItems[0].CategoryId)
            this.activeName = String(result.data.SaleOrderItems[0].CategoryId)
          }
          this.comTwoCategoryChangeFunction(this.activeName) // table也要切换 子级药态
          this.getStoreCategorytypeStock()

          // 2、用协定方里的药材编码请求库存里最新的药材售价
          // 因为协定方的SalePrice是保存的旧的售价，之后如果售价有更新，那协定方计算价格就错误了，所以这需要使用协定方里保存的
          // 药材的编码重新请求一次门店库存接口，目的就是拿到最新的药材售价
          this.$nextTick(() => {
            API.storeStock.getStoreStock({
              PageIndex: 1,
              PageSize: 100, // 协定方上的药材应该只有30味左右吧，100够了 搭配的下面的ProductCodeOrBarCode查询应该不可能超出100味，如果出问题可以留意这
              IsPaging: true,
              StoreId: this.$store.getters.getAccountCurrentHandleStore, // 传不传门店id决定了是否返回库存余量!!!（另外这儿可以能有点问题要处理，因为可能是药房的账号进来，那这样的话如果药房的权限大于医生，那门店库存也更正变大了，这是个要考虑的地方）
              ProductCodeOrBarCode: result.data.SaleOrderItems.map(item => {
                return item.ProductCode
              }).join(), // 通过批量的药材编码查询出最新的门店里库存药品的信息（主要目的拿到最新的价格）
              CategoryId: this.activeName === '1002' ? '1001,1002' : this.activeName, // 被激活的tabs标签页的药材大方向的种类的类型id 1001 ？？？ 这是精品的时候还有问题
              SearchType: 2 // 1表示才够用2查询库存用
            }).then(response => {
              if (response.code === '0000' && response.data.length > 0) {
                console.log(response.data)
                // 左边table 字段转换下
                // 搭配上面的1、（温馨提示）这的逻辑比较乱也比较复杂，超级需要耐心
                // 搭配上面的1、（温馨提示）这的逻辑比较乱也比较复杂，超级需要耐心
                // 搭配上面的1、（温馨提示）这的逻辑比较乱也比较复杂，超级需要耐心
                this.leftTableData.forEach(item => { // 搭配上面的1、（温馨提示）这的逻辑比较乱也比较复杂，超级需要耐心
                  response.data.forEach(inner => {
                    if (item.Code === inner.ProductCode) {
                      item.CostPrice = inner.LastCostPrice
                      item.StoreSalePrice = inner.StoreSalePrice
                      return false
                    }
                  })
                })
                this.countTotalPrice(this.leftTableData) // 载入协定方后立马计算价格
                this.leftTableData.push()
                // console.log(this.leftTableData)
              } else {
                this.$message({ message: `${result.message}`, type: 'warning', duration: 3000 })
              }
            })
          })
        }
      })
    },

    // 通用封装的门店子组件绑定的父组件的返回方法（开方页面的上层已提前决定了门店，这儿还能改变门店吗？？？？？？？？？？？？？？？？？？？）
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      // if (isMultiple === false) { this.dataForm.StoreId = choseStoreId }
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
      // console.log(params)
      API.member.getMemberList(params).then(result => {
        // console.log(result.data) // 如果是医生直接开方这儿会报错的因为是[][0].xx空数组报错的!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
      this.rightUlData = [] // 网速可能差时，响应的值可以能与操作对应不上，就容易出现bug
      // this.totalPage = 0 // 注释的这样影响分页
      this.keyCode_40Count = 0 // 在右上角的输入框中按下‘↓’键，总次数统计
      var params = {
        Name: '',
        PageIndex: this.pageIndex,
        PageSize: 50,
        IsPaging: true,
        SpellName: this.dataForm.SpellName,
        CategoryId: this.activeName === '1002' ? '1001,1002' : this.activeName, // 被激活的tabs标签页的药材大方向的种类的类型id 1001 (20190719 如果是精品类型的，需要请求精品 和 普通 特殊处理)
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 传不传门店id决定了是否返回库存余量!!!（另外这儿可以能有点问题要处理，因为可能是药房的账号进来，那这样的话如果药房的权限大于医生，那门店库存也更正变大了，这是个要考虑的地方）
        CodeOrBarCode: ''} // 暂无
      API.drugs.getDrugsList(params).then(result => {
        if (result.code === '0000' && result.data.length > 0) {
          this.rightUlData = result.data
          this.totalPage = result.total
          // console.log(result.data)
        } else {
          // this.$message({ message: '查询结果为空', type: 'warning', duration: 3000 })
          this.rightUlData = []
          this.totalPage = 0
          this.$message({ message: `${result.message}`, type: 'warning', duration: 3000 })
        }
        this.dataListLoading = false
      })
    },

    // 右上角的下拉options展示
    // querySearch (keyWord, callback) {
    //   if (keyWord === '') {
    //     callback([]) // return false
    //   } else { // 这个返回的内容 就是 下拉options的内容
    //     setTimeout(() => { callback(this.rightUlData) }, 400)
    //   }
    // },
    // ‘上’ 键
    autoSelectUpper () {
      if (this.keyCode_40Count > 0) {
        this.keyCode_40Count--
        if (this.keyCode_40Count >= 5) {
          this.$refs.ownMethods.scrollBy(0, -30) // 30px的高度是根据li的高度来定的
        }
      }
    },
    // ‘下’ 键
    autoSelectDown () {
      var len = this.rightUlData.length
      if (this.keyCode_40Count < len - 1) {
        this.keyCode_40Count++
        if (this.keyCode_40Count > 6) {
          this.$refs.ownMethods.scrollBy(0, 30)
        }
      }
    },
    // 鼠标点击时，输入框失去焦点，其实li就没被点中，导致click=addDrugs并没有触发，所以li延迟一下才消失比较好
    rightTopInputBlur () {
      setTimeout(() => {
        this.rightIsFocus = false
        this.dataForm.SpellName = ''
      }, 100)
    },
    // 后面有三个方法会共同调用这个方法：计算总价
    countTotalPrice (obj) {
      var sum = 0
      obj.forEach(item => {
        sum += item.StoreSalePrice * item.myNum
      })
      this.allMoney = (sum * this.Total).toFixed(2)
    },
    // 1.当点击右侧药材列表的‘添加’按钮的时候
    addDrugs (row) {
      var selectRow = this.rightUlData[this.keyCode_40Count]
      // console.log(row, selectRow)
      // row 有可能是enter事件的obj对象，也有可能就是被click时当行的row

      // 通过enter添加：此时row代表enter事件的obj对象
      if (row.Code === undefined) {
        if (!selectRow) { return false } // 没有搜索结果的时候敲回车不让执行
        if (this.dataForm.SpellName === '') { return false } // 在查询关键字为空的是以后敲回车也不让执行
        if (this.leftTableData.some(item => item.Code === selectRow.Code)) { // 发现重复添加的药材时也不让执行
          this.$message(`[${selectRow.ShowName}] 已添加！`)
          return false
        }
        if (selectRow.Quantity <= 0) { // 发现重复添加的药材时也不让执行
          this.$message(`[${selectRow.ShowName}] 没有库存！`)
          return false
        }
        this.isClickRightAddButton = true // 搭配 updated () {} 聚焦
        this.leftTableData.push(selectRow)
      } else { // 通过click添加：此时row代表一行的数据
        if (this.leftTableData.some(item => item.Code === row.Code)) {
          this.$message(`[${row.ShowName}] 已添加！`)
          return false
        }
        if (row.Quantity <= 0) { // 发现重复添加的药材时也不让执行
          this.$message(`[${selectRow.ShowName}] 没有库存！`)
          return false
        }
        this.isClickRightAddButton = true
        this.leftTableData.push(row)
      }
      // row.myNum = 0 // 让后端加字段，要改所有的类型的，这自己加，就没这种问题了myNum
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
      this.leftTableData.push() // 这个可能会非常懵逼，目的是每次改变任何的myNum的值都会重新渲染左边的table，把push()拿掉就能找到问题在哪，这就是这个push()没任何实际参数但还是要写一个在这的原因；别的方法vue的$set也行
      this.countTotalPrice(this.leftTableData) // console.log(this.leftTableData)
    },

    // 二级 子级 药态被锁定时：其之后的相关的逻辑需要重新跑一次
    comTwoCategoryChangeFunction (two) {
      this.pageIndex = 1 // 切换药态时，都重置为第一页
      switch (two) {
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
    },
    // 一级药态被点击时
    handleChange (leftLab) {
      // console.log(leftLab)
      if (this.leftTableData.length === 0) { // 没开任何药材时直接切换直接加载呗，都没药材记录还提示啥子嘛
        this.comOneCategoryChangeFunction(leftLab) // 一级药态切换后，右边的4个二级药态也要重新排列

        this.activeName = this.drugsCategoryArr[0].id
        this.comTwoCategoryChangeFunction(this.activeName) // 二级药态被锁定时：其之后的相关的逻辑需要重新跑一次

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
          this.comOneCategoryChangeFunction(leftLab)

          this.activeName = this.drugsCategoryArr[0].id
          this.comTwoCategoryChangeFunction(this.activeName) // 二级药态被锁定时：其之后的相关的逻辑需要重新跑一次

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
      // console.log(this.dataForm.CategoryOne, this.dataForm.olCategoryOne, this.activeName, this.oldTabsName)
    },

    // 二级药态被点击时
    handleClick (tab, event) {
      // console.log(tab, event)
      // console.log(this.leftTableData)
      this.rightCategoryChangeClick(tab.name)
    },
    rightCategoryChangeClick (categroyId) {
      if (this.leftTableData.length === 0) { // 没开任何药材时直接切换直接加载呗，都没药材记录还提示啥子嘛
        this.comTwoCategoryChangeFunction(categroyId) // 二级药态被锁定时：其之后的相关的逻辑需要重新跑一次

        this.oldTabsName = this.activeName
        this.getStoreCategorytypeStock()
        this.countTotalPrice(this.leftTableData) // 切换药态后立马清空价格
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
          this.$confirm('请检查<i style="color: #409EFF">总剂数、服用方法</i>等是否已填写完毕！ </br>点击确认即可发送', '小助手提示', {
            dangerouslyUseHTMLString: true,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isSubmit = true // 提交之后的退出，不用保存处方了（退出保存控制）
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
              DoctorAdvice: this.dataForm.DoctorAdvice.join('， '), // 医嘱
              Total: this.Total, // 总剂数
              ItemsJson: JSON.stringify(this.leftTableData.map(item => {
                var obj = {
                  ProductId: item.Id,
                  ProductCode: item.Code,
                  ProductName: item.ShowName,
                  CostPrice: item.CostPrice,
                  SalePrice: item.StoreSalePrice,
                  RealPrice: item.StoreSalePrice,
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
              DoctorAdvice: this.dataForm.DoctorAdvice.join('，'),
              DrugRate: this.DrugRate,
              Total: this.Total,
              ItemsJson: JSON.stringify(this.leftTableData.map(item => {
                var obj = {
                  ProductId: item.Id,
                  ProductCode: item.Code,
                  ProductName: item.ShowName,
                  CostPrice: item.CostPrice,
                  SalePrice: item.StoreSalePrice,
                  RealPrice: item.StoreSalePrice,
                  Quantity: item.myNum,
                  SupplierId: 0,
                  SupplierCode: 0 // 库存的药材不是合并了的嘛，哪还能确定供应商啊
                }
                return obj
              })),
              CategoryOne: this.dataForm.CategoryOne,
              WorkAmount: this.dataForm.WorkAmount // 加工费
            }
            // console.log(paramsEdit) // 电话为0表示直接开方模式应该提交费create接口、如果有正常的电话那应该是正常的开方模式应该提交到edit接口
            // console.log(paramsCreate) // 电话为0表示直接开方模式应该提交费create接口、如果有正常的电话那应该是正常的开方模式应该提交到edit接口
            // var tick = API.register.sendRecipelToEdit(paramsEdit)
            var tick = this.$route.query.MobilePhone === '0' ? API.register.registerSubmit(paramsCreate) : API.register.sendRecipelToEdit(paramsEdit)
            // console.log(this.$route.query.MobilePhone)
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
.doctor-recipel /deep/ {
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

  /*诊断结果的样式*/
  .el-select-dropdown__wrap {padding-bottom: 5px;}
  .el-select-dropdown__item {float: left; display: block !important;}
  .el-select-dropdown__item.selected::after {right: 5px}

  /*yizhu 医生嘱咐的样式*/
  .yizhuCss {
    .popper__arrow { display: none } // 把三角尖隐藏
    .el-select-dropdown.el-popper.is-multiple {
      min-width: 660px !important;
      width: 660px !important;
      top: -140px !important;
      left: 0 !important;
    }
  }

  /*一级药态的样式*/
  .el-radio.is-bordered + .el-radio.is-bordered {margin-left: 5px}
  .el-radio__label {padding-left: 5px}
  .el-radio--mini.is-bordered {padding: 6px 10px 0 10px}
}

.doctor-recipel /deep/ {
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
.doctor-recipel /deep/ {
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
  /*cutOut剪纸show切换动画*/
  .v-enter, .v-leave-to {opacity: 0}
  .v-enter-active, .v-leave-active {transition: all 0.4s ease}
  .v-enter-to, .v-leave {opacity: 1}
}
</style>
