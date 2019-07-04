<template>
    <div class="mod-storeRegister">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: 0;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm" size="mini" @keyup.enter.native="comBranch()">
          <el-row style="height: 35px;line-height: 35px">
            <el-col :span="21">
              <com-store :paramsFather="{
                'label_0': '',
                'size_1': 'mini',
                'width_2': '120px',
                'clear_3': false,
                'multiple_4': false,
                'must_5': true,
                'isTrigger': true
              }" ref="comStoreOne" @eventStore="changeStoreData"></com-store>

              <el-form-item v-show="isVisible[0].child">
                <el-input v-model="dataForm.doctorName" placeholder="请输入医生姓名"
                          @clear="comBranch()" clearable style="width: 119px"></el-input>
              </el-form-item>

              <span v-show="isVisible[1].child || isVisible[2].child">
                <el-form-item>
                  <el-select v-model="dataForm.AccountId" placeholder="选择医生" clearable style="width: 100px">
                    <el-option v-for="item in storeDoctorArr" :key="item.Id"
                               :label="`${item.Id} ${item.NickName}`" :value="item.Id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="dataForm.patientNameOrMobilePhone" placeholder="患者/患者电话"
                            clearable @clear="comBranch()" style="width: 119px"></el-input>
                </el-form-item>
                <!--<el-form-item>-->
                  <!--<el-input v-model="dataForm.MobilePhone" placeholder="患者电话" clearable style="width: 119px"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item>
                  <el-date-picker
                    size="mini"
                    v-model="valueTime" @change="comBranch()"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    style="width: 260px">
                  </el-date-picker>
                </el-form-item>
              </span>

              <el-form-item>
                <el-button @click="comBranch()" size="mini">查询</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;padding-right: 10px">
              <el-button  type="primary" @click="$router.push(`/doctor/treatment`)" size="mini">辅助开方</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-tab-pane label="" name="first">
        <span slot="label"><i class=""></i> 挂号</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="second">
        <span slot="label"><i class=""></i> 挂号列表</span>
        <transition name="chenxi">
          <second-tab v-if="isVisible[1].child" ref="secondTab" :fatherDataForm="dataForm"></second-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="three">
        <span slot="label"><i class=""></i> 退费列表</span>
        <transition name="chenxi">
          <three-tab v-if="isVisible[2].child" ref="threeTab" :fatherDataForm="dataForm"></three-tab>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTab from './first-tab'
import SecondTab from './second-tab'
import ThreeTab from './three-tab'
import ComStore from '../common/com-store'
export default {
  watch: {
    'dataForm.AccountId': function () {
      if (this.isVisible[1].child === true) {
        this.$refs.secondTab.getDataList()
      } else if (this.isVisible[2].child === true) {
        this.$refs.threeTab.getDataList()
      }
    },
    'dataForm.patientNameOrMobilePhone': function (val, oldval) {
      var reg = /\d{11}/ig
      if (reg.test(val) === true && val.length === 11) { // 验证通过表示输入的是手机号
        this.dataForm.patientName = ''
        this.dataForm.MobilePhone = val
      } else {
        this.dataForm.patientName = val
        this.dataForm.MobilePhone = ''
      }
    },
    valueTime (val, oldval) {
      console.log(val)
      if (val !== [] && val !== null) {
        this.dataForm.StartDate = val[0]
        this.dataForm.EndDate = val[1]
      } else {
        this.dataForm.StartDate = ''
        this.dataForm.EndDate = ''
      }
    }
  },
  data () {
    return {
      activeName: 'first',
      drugsCategoryList: [],
      dataForm: { // 三个子组件共有的查询条件：门店，商品编码、商品名称、商品拼音
        AccountId: '', // 医生Id
        patientNameOrMobilePhone: '', // 合一
        patientName: '', // 患者
        MobilePhone: '', // 电话 这几个信息只是父组件传递给子组件的查询字段而已
        StartDate: '',
        EndDate: '',

        doctorName: '' // 医生姓名search
      },
      isVisible: [
        {child: true},
        {child: false},
        {child: false}
      ],
      valueTime: [],
      storeDoctorArr: []
    }
  },
  components: {
    ComStore,
    FirstTab,
    SecondTab,
    ThreeTab
  },
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.AccountId = '' // 门店切换时，选择的医生筛选条件当然也清空
        this.dataForm.patientNameOrMobilePhone = ''
        this.valueTime = null
        this.getStoreAllDoctor() // 门店切换时，获取对应门店下所有医生
        this.comBranch()
      }
    },
    // 共同的分支方法
    comBranch () {
      this.$nextTick(() => { // 等待watch那计算完毕才执行查询
        if (this.isVisible[0].child === true) {
          this.$refs.firstTab.getDataList()
        } else if (this.isVisible[1].child === true) {
          this.$refs.secondTab.getDataList()
        } else if (this.isVisible[2].child === true) {
          this.$refs.threeTab.getDataList()
        }
      })
    },
    // 当门店改变时，获取门店下所有医生（只是给表头的查询下拉option赋初始值而已）
    getStoreAllDoctor () {
      var params = {
        PageIndex: 1,
        PageSize: 10000,
        IsPaging: true,
        id: '',
        userName: '',
        nickName: '',
        roleId: this.$store.getters.getAllDoctorIdArr.join(),
        canViewStores: this.$store.getters.getAccountCurrentHandleStore // 门店ID// storeId: this.dataForm.StoreId // 门店ID
      }
      API.adminUser.adminUserList(params).then(response => {
        if (response.code === '0000') {
          if (response.data) {
            this.storeDoctorArr = response.data.map(item => {
              return {Id: item.Id, NickName: item.NickName}
            })
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 且换tabs标签页时
    handleClick (tab, event) {
      switch (tab.name) {
        case 'first':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 0 ? {child: true} : {child: false}
          })
          break
        case 'second':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 1 ? {child: true} : {child: false}
          })
          break
        case 'three':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 2 ? {child: true} : {child: false}
          })
          break
      }
      this.$nextTick(() => {
        this.isVisible.forEach((item, index) => {
          if (item.child === true) {
            if (index === 0) {
              this.$refs.firstTab.getDataList()
            } else if (index === 1) {
              this.$refs.secondTab.getDataList() // 挂号列表
            } else if (index === 2) {
              this.$refs.threeTab.getDataList() // 挂号列表
            }
            return false
          }
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/*vue过渡初次尝试*/
.chenxi-enter {
  transform: translate(40px, 30px);
  opacity: 0;
}
.chenxi-enter-active,
.chenxi-leave-active {
  transition: all 0.6s ease;
}

.mod {
  &-storeRegister /deep/ {
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
.mod-storeRegister /deep/ {
  .el-form-item { margin-bottom: 0px; }
  .el-dialog__body { padding-top: 10px; }
  /*表头高重写35高*/
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td,
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td {
    padding: 0 !important;
  }
  /*& /deep/ .el-tabs__content {background-color: #F0F0F0}*/
  .storeStockListRow {
    color: #606266;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
}
</style>
