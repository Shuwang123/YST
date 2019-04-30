<template>
  <div class="doctor-recipel">
    <el-form ref="form" :rules="dataRule" :model="dataForm" label-width="80px" size="mini">
      <el-container style="padding-left: 20px">
        <el-aside width="75%" style="border-right: 1px solid #DCDFE6; padding-right: 5px">
          <!--<h1>开方：</h1>-->
          <p style="text-align: center;font-size: 16px; padding: 5px 0 20px 0; cursor: pointer"
             @click="cutOut = !cutOut" title="点击展开或收起">
            ꧁<span style="position: relative; top: 10px;font-size: 18px; font-weight: 600;"> 处方笺 </span>꧂
          </p>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="UserName">
                <el-input v-model="dataForm.UserName" placeholder="选择患者" style="width: 94px" disabled></el-input>
                <!--<el-button type="warning" icon="iconfont icon-renwu-zengjia" @click="send()" size="mini"></el-button>-->
                <!--{{$route.query.patientId}}-->
                <span v-if="$route.query.MobilePhone === '0'"
                  class="iconfont icon-renwu-zengjia" style="display: inline-block;width: 40px;height: 30px;
                  font-size: 26px;font-weight: 900;color: #1EA57B; margin-left: 7px; vertical-align: top"
                      @click="openPatientList(); $store.commit('setRegisterStep', 2)"></span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别">
                <el-input v-model="dataForm.Sex" placeholder="只读" style="width: 80px" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄">
                <el-input-number v-model="dataForm.BirthDate" :min="1" :step="1" :max="100" style="width: 95px"></el-input-number>
                <!--<el-input-number v-model="dataForm.age" :min="1" :step="1" :max="12" style="width: 95px"></el-input-number>-->
                <div class="recipelAgeUnit">
                  <el-select v-model="dataForm.ageUnit" style="width: 45px">
                    <el-option :label="'岁'" :value="'岁'"></el-option>
                    <el-option :label="'月'" :value="'月'"></el-option>
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
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="发病时间">
                    <el-date-picker type="date" placeholder="请选择发病时间" v-model="dataForm.morbidityTime"  style="width: 144px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="过敏史">
                    <el-input v-model="dataForm.name" placeholder="请输入过敏史" style="width: 144px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="主诉">
                    <el-input v-model="dataForm.name" placeholder="请选择或输入主诉" style="width: 75%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="现病史">
                    <el-input v-model="dataForm.name" placeholder="从起病到就诊时疾病的发生、发展及其他变化的经过和诊疗情况" style="width: 75%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="诊断信息">
                    <el-input v-model="dataForm.name" placeholder="请选择或输入诊断信息" style="width: 75%"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </transition>

          <div style="border-bottom: 1px solid #E6E6E6; font-weight: 500">R:</div>
          <el-table
            :height="chenxiHeight"
            :data="dataList"
            stripe
            v-loading="dataListLoading"
            row-class-name="purchaseListRow"
            :header-cell-style="$cxObj.tableHeaderStyle30px"
            style="width: 100%;">
            <!--组件切换，直接控制组件的引用名-->
            <component :is="this.leftTable"></component>
            <!--<div>-->
              <!--<el-table-column type="index" align="center" width="50" label="序号"></el-table-column>-->
              <!--<el-table-column prop="Id" header-align="center" align="center" label="药品/规格" width="100"></el-table-column>-->
              <!--<el-table-column prop="Code" header-align="center" align="center" label="剂量" width="100"></el-table-column>-->
              <!--<el-table-column prop="CreatedTime" header-align="center" align="center" label="代数" width="150"></el-table-column>-->
              <!--<el-table-column prop="SupplierName" header-align="center" align="center" label="单价" :show-overflow-tooltip="true"></el-table-column>-->
              <!--<el-table-column prop="StoreName" header-align="center" align="center" label="金额"></el-table-column>-->
              <!--<el-table-column prop="Quantity" header-align="center" align="center" label="用法" :show-overflow-tooltip="true"></el-table-column>-->
              <!--<el-table-column prop="" label="操作" width="150" header-align="center" align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button type="text" @click="addOrUpdateHandle(scope.row.Id)">就诊</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</div>-->
          </el-table>
        </el-aside>

        <el-main style="padding: 10px; border-bottom: 1px solid #DCDFE6">
          <el-input v-model="dataForm.name" placeholder="请输入要查询要的药材" style="width: 100%" size="small" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <!--右上角tabs标签页切换-->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in drugsCategoryArr" :key="item.id" :label="item.text" :name="item.id"></el-tab-pane>
          </el-tabs>
          <ul style="min-height: 500px; background-color: #f1f2f6;width: 90%;position: relative;">
            <li v-for="item in rightUlData" :key="item.Id" style="clear: both">
              <span style="display: inline-block;width: 60px">{{item.ShowName}}</span>
              [余{{item.Quantity}}]-{{item.Code}}+++{{item.Id}}
              <el-button type="text" size="mini" style="float: right;margin-top: -3px">添加</el-button>
            </li>
            <ol style="position: absolute;top: 0;right: -30px;width: 30px;background-color: pink;text-align: center;font-weight: 900">
              <li style="height: 20px;line-height: 20px">A</li>
              <li style="height: 20px;line-height: 20px">B</li>
              <li style="height: 20px;line-height: 20px">C</li>
              <li style="height: 20px;line-height: 20px">D</li>
              <li style="height: 20px;line-height: 20px">E</li>
              <li style="height: 20px;line-height: 20px">F</li>
              <li style="height: 20px;line-height: 20px">G</li>
              <li style="height: 20px;line-height: 20px">H</li>
              <li style="height: 20px;line-height: 20px">I</li>
              <li style="height: 20px;line-height: 20px">J</li>
              <li style="height: 20px;line-height: 20px">K</li>
              <li style="height: 20px;line-height: 20px">M</li>
              <li style="height: 20px;line-height: 20px">L</li>
              <li style="height: 20px;line-height: 20px">N</li>
              <li style="height: 20px;line-height: 20px">O</li>
              <li style="height: 20px;line-height: 20px">P</li>
              <li style="height: 20px;line-height: 20px">Q</li>
              <li style="height: 20px;line-height: 20px">R</li>
              <li style="height: 20px;line-height: 20px">S</li>
              <li style="height: 20px;line-height: 20px">T</li>
              <li style="height: 20px;line-height: 20px">U</li>
              <li style="height: 20px;line-height: 20px">V</li>
              <li style="height: 20px;line-height: 20px">W</li>
              <li style="height: 20px;line-height: 20px">X</li>
              <li style="height: 20px;line-height: 20px">Y</li>
              <li style="height: 20px;line-height: 20px">Z</li>
            </ol>
          </ul>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="prev, pager, next, total" background :pager-count="3">
            <!--layout="prev, pager, next, jumper, sizes, total" background :pager-count="2">-->
          </el-pagination>
        </el-main>
      </el-container>

      <el-footer height="100px" style="padding-top: 7px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="总剂数">
              <el-input-number v-model="dataForm.age" :min="1" :step="1" :max="30" style="width: 95px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用药方法">
              <el-select v-model="dataForm.ageUnit" style="width: 144px" placeholder="请选择用药方法">
                <el-option :label="'一日一次饭后服'" :value="'岁'"></el-option>
                <el-option :label="'一日一次饭前服…'" :value="'月'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医嘱">
              <el-input v-model="dataForm.age" placeholder="请填写医嘱" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="开方医生">
              <el-input v-model="$route.query.DoctorName" placeholder="onlyReady" style="width: 110px" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="font-weight: 500; font-size: 16px">
            &nbsp;&nbsp;&nbsp;总金额：￥0 -
            <el-input-number v-model="dataForm.date1" controls-position="right"
                             :min="1" :max="10000" style="width: 100px" size="mini"></el-input-number>
            = x￥
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="success" icon="iconfont icon-ico_zhongyaofangguanli_zhongyaoqingling" @click="send()" size="medium">&nbsp;发送给药房</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-footer>
    </el-form>
    <patient-list-pop v-if="addOrUpdateVisible" ref="patientListPop" @childEven="zairuFun"></patient-list-pop>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import '../common/icon/iconfont.css'
import {formatDate} from '@/utils/validate'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
import PatientListPop from './patient-list-pop'
import TableOne from './table-one'
import TableTwo from './table-two'
import TableThree from './table-three'
export default {
  components: {
    PatientListPop,
    TableOne,
    TableTwo,
    TableThree
  },
  // Error in callback for watcher "$route": "TypeError: Cannot read property 'id' of undefined"
  // 报错不要怕，因为没有创建路由的对应菜单造成的，应该无关紧要
  watch: {
    'cutOut': function (newval, oldval) {
      if (newval === true) {
        // this.reduceHeight = 350
        this.chenxiHeight = document.documentElement['clientHeight'] - 550 > 350 ? document.documentElement['clientHeight'] - 550 : 350
      } else {
        // this.reduceHeight = 0
        setTimeout(() => {
          this.chenxiHeight = document.documentElement['clientHeight'] - 350 > 350 ? document.documentElement['clientHeight'] - 350 : 350
        }, 400)
      }
      console.log(this.chenxiHeight)
    }
  },
  data () {
    return {
      cutOut: true, // 收起，显示
      reduceHeight: 350,
      drugsCategoryArr: [], // 先请求药品种类
      activeName: '1001',
      leftTable: 'TableOne', // 左侧表格
      dataList: [], // 左侧表格的数据
      rightUl: '', // 右侧列表
      rightUlData: [], // 右侧列表的数据

      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      chenxiHeight: document.documentElement['clientHeight'] - 550 > 350 ? document.documentElement['clientHeight'] - 550 : 350, // 心累，不要动
      pageIndex: 1,
      pageSize: 10,
      totalPage: 1,
      dataForm: {
        UserName: '',
        Sex: '',
        BirthDate: '',
        MobilePhone: '',
        Address: '',
        UserId: [],
        Code: '',

        age: 1,
        ageUnit: '岁',
        DiagnosisType: '1', // 看诊类型
        morbidityTime: ''

      },
      dataRule: {
        UserName: Currency('此为必填项')
      }
    }
  },
  created () {
    this.pageInit() // 先初始化arr 初始化供应商列表 // 初始化门店列表
  },
  mounted () {
    window.onresize = () => {
      var newHeight = document.documentElement['clientHeight'] - 350
      this.chenxiHeight = newHeight > 350 ? newHeight : 350 // 273 测试老半天
    }
  },
  methods: {
    // 特殊的计算除年龄的方法
    countAge (time) {
      var age = formatDate(new Date(time.substring(6, time.length - 2) * 1), 'yyyy-MM-dd')
      var now = formatDate(new Date(), 'yyyy-MM-dd')
      var nowArr = now.split('-')
      var ageArr = age.split('-')
      return `${nowArr[0] - ageArr[0]}`
    },
    // 在会员子组件弹窗点击载入后返回调用这父组件的方法
    zairuFun (row) {
      this.dataForm.UserName = row.UserName
      this.dataForm.Sex = row.Sex === 1 ? '男' : '女'
      this.dataForm.BirthDate = this.countAge(row.BirthDate)
      this.dataForm.MobilePhone = row.MobilePhone
      this.dataForm.Address = row.Address
      this.dataForm.UserId = row.Id
      this.dataForm.Code = row.Code
    },
    // 打开会员弹窗
    openPatientList (storeId = 0) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.patientListPop.init(storeId)
      })
    },
    // 通用封装的门店子组件绑定的父组件的返回方法（开方页面的上层已提前决定了门店，这儿还能改变门店吗？？？？？？？？？？？？？？？？？？？）
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.StoreId = choseStoreId
      }
    },
    pageInit () {
      this.dataListLoading = true
      // 请求会员信息，根据前一层路由传递的会员电话
      var params = {
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: this.isPaging,
        UserName: '',
        StoreId: this.$route.query.StoreId,
        MobilePhone: this.$route.query.MobilePhone
      }
      console.log(params)
      API.member.getMemberList(params).then(result => {
        console.log(result.data)
        if (result.code === '0000') {
          this.dataForm.UserName = result.data[0].UserName
          this.dataForm.Sex = result.data[0].Sex === 1 ? '男' : '女'
          this.dataForm.BirthDate = this.countAge(result.data[0].BirthDate)
          this.dataForm.MobilePhone = result.data[0].MobilePhone
          this.dataForm.Address = result.data[0].Address
          this.dataForm.UserId = result.data[0].Id
          this.dataForm.Code = result.data[0].Code
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
      })
      // 先请求药品种类提供给下拉列表
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryArr = result.data.filter((item, ind) => {
            return ind > 0
          })
        }
      })
      // 获取对应门店下的对应药材库
      this.getStoreCategorytypeStock()
    },
    // 获取对应门店对应药态下的对应药材库
    getStoreCategorytypeStock () {
      API.drugs.getDrugsList({
        Name: '',
        PageIndex: this.pageIndex,
        PageSize: 30,
        IsPaging: 'true',
        SpellName: this.dataForm.SpellName,
        CategoryId: this.activeName, // 被激活的tabs标签页的药材大方向的种类的类型id 1001
        StoreId: this.$route.query.StoreId, // 传不传门店id决定了是否返回库存余量!!!
        CodeOrBarCode: '' // 暂无
      }).then(result => {
        if (result.code === '0000' && result.data.length > 0) {
          this.dataList = result.data
          this.rightUlData = result.data
          this.totalPage = result.total
          console.log(result.data)
          // if (this.dataListViews.length === 0) {
          //   this.dataListViews = this.dataListViews.concat(result.data) // 会打散拼接到尾巴，旧数组不变
          // } else if (this.dataListViews.some(item => item.Code === result.data[0].Code || item.Code === result.data[this.pageSize - 1]).Code) {
          //   this.dataListViews = this.dataListViews.concat([])
          // } else {
          //   this.dataListViews = this.dataListViews.concat(result.data)
          // }
        } else {
          // this.$message({ message: '查询结果为空', type: 'warning', duration: 3000 })
          this.dataList = []
          this.$message({ message: `${result.message}`, type: 'warning', duration: 3000 })
        }
        this.dataListLoading = false
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
      switch (tab.name) {
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
      }
      this.getStoreCategorytypeStock()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    addOrUpdateHandle (row, StoreId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row, StoreId)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.recipelAgeUnit {
  display: inline-block;
  /deep/ .el-input__inner {
    padding: 0 5px;
  }
}
.doctor-recipel /deep/ {
  background-color: #fff;
  margin: 0 10px;
  border: 1px solid #DCDFE6;
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 9px;
  }
}

.mod {
  &-purchaseList /deep/ {
    margin-left: 10px;
    /*max-height: 810px;*/
    overflow: hidden;
    .el-pagination {
      margin-top: 15px;
      text-align: left;
    }
    .nav{
      position: absolute;
      width: 100%;
    }
  }
}
/*以下样式cx重写的，改变form中内部控件的行间距等默认22px太高*/
.doctor-recipel /deep/ {
  .el-form-item {
    margin-bottom: 0px;
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
  /*cutOut剪纸show切换动画*!*/
  .v-enter, .v-leave-to {opacity: 0}
  .v-enter-active, .v-leave-active {transition: all 0.4s ease}
}
/*.mod-purchaseList {*/
  /*& /deep/ .el-dialog__header {*/
    /*background-color: #1CA579;*/
  /*}*/
/*}*/
</style>
