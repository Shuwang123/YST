<template>
  <div class="mod-purchaseList">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="doctorHandle()" size="mini">
          <com-store :paramsFather="{
            'label_0': '',
            'size_1': 'mini',
            'width_2': '120px',
            'clear_3': false,
            'multiple_4': false,
            'must_5': true,
            'isTrigger': true
          }" ref="comStoreOne" @eventStore="changeStoreData"></com-store>

          <!--医生：可搜索-->
          <el-form-item v-if="isVisible[0].child">
            <el-select v-model="dataForm.AccountId" filterable style="width: 123px"
                       :disabled="$store.getters.getAccountIsDoctor ? true : false"
                       @change="doctorHandle()" :default-first-option="true" placeholder="请搜索医生">
              <el-option v-for="item in storeDoctorArr" :key="item.Id"
                         :label="`${item.Id}-${item.NickName}`" :value="item.Id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select @change="doctorHandle()" v-model="dataForm.agreementStatus" placeholder="状态" style="width: 100px">
              <el-option :label="'可用'" :value="'1,2,3,5,6'"></el-option>
              <el-option :label="'废弃'" :value="'-1'"></el-option>
              <el-option :label="'全部展示'" :value="''"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-button v-if="$store.getters.getAccountIsDoctor"
          :disabled="dataForm.AccountId === '' ? true : false"-->

          <el-form-item>
            <el-input v-model="dataForm.PrescriptionName" placeholder="处方名"
                      @clear="doctorHandle()" clearable style="width: 119px"></el-input>
          </el-form-item>
          <!--<el-input v-model="dataForm.patientNameOrMobilePhone" placeholder="处方名/主治功效" clearable style="width: 139px"></el-input>-->

          <el-form-item>
            <el-button @click="doctorHandle()" size="mini">查询</el-button>
            <el-button type="primary"
                       @click="isVisible[0].child ? addAgreement() : addClassics()">
              {{isVisible[0].child ? '添加协定方' : '添加经典方'}}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-date"></i> 协定方列表</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="second" :disabled="$store.getters.getAccountIsDoctor ? true : false"><!-- 医生没有权限编辑经典方，只有门店管理员可以编辑经典方 -->
        <span slot="label"><i class=""></i> 经典方列表</span>
        <transition name="chenxi">
          <second-tab v-if="isVisible[1].child" ref="secondTab" :fatherDataForm="dataForm"></second-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="third" disabled>
        <span slot="label"><i class=""></i> xx</span><!--<el-tab-pane label="成品药品" name="second" disabled="true">-->
        <transition name="chenxi">
          <first-tab v-if="isVisible[2].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="four" disabled>
        <span slot="label"><i class=""></i> xx</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[3].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTab from './first-tab'
import SecondTab from './second-tab'
import ComStore from '../common/com-store'
export default {
  data () {
    return {
      activeName: 'first',
      SupplierIdArr: [], // 先请求供应商数组

      dataForm: {
        AccountId: '', // 医生Id
        currentDoctorName: '', // 当前选中的医生名
        View: true, // 是否显示门店筛选组件
        StartDate: '',
        EndDate: '',
        PrescriptionName: '', // 协定方名

        agreementStatus: '1,2,3,5,6' // 协定方状态
      },
      isVisible: [
        {child: true},
        {child: false},
        {child: false},
        {child: false}
      ],
      num: 0,
      value6: [],
      storeDoctorArr: [],
      isDoctor: false
    }
  },
  components: {
    FirstTab,
    SecondTab,
    ComStore
  },
  watch: {
    'value6': function () {
      console.log(this.value6)
      if (this.value6 !== [] && this.value6 !== null) {
        this.dataForm.StartDate = this.value6[0]
        this.dataForm.EndDate = this.value6[1] // console.log(this.dataForm.StartDate) // console.log(this.dataForm.EndDate)
      } else {
        this.dataForm.StartDate = ''
        this.dataForm.EndDate = ''
      }
    }
  },
  methods: {
    // 添加协定方
    addAgreement () {
      this.$refs.firstTab.addOrUpdateHandle(undefined, 'add', this.dataForm.AccountId)
    },
    // 添加经典方
    addClassics () {
      this.$refs.secondTab.addOrUpdateHandle(undefined, 'add')
    },

    changeStoreData (choseStoreId, isMultiple) { // 任何账号 都有唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.AccountId = ''
        this.dataForm.currentDoctorName = ''
        this.getStoreAllDoctor() // 切换门店后，更新头部下拉option的选项 在这触发 初始化，不要崇拜…代替pageInit方法
      }
    },
    // 当门店改变时，获取门店下所有医生
    getStoreAllDoctor () {
      var params = {
        PageIndex: 1,
        PageSize: 10000,
        IsPaging: true,
        id: '',
        userName: '',
        nickName: '',
        roleId: this.$store.getters.getAllDoctorIdArr.join(),
        canViewStores: this.$store.getters.getAccountCurrentHandleStore
      }
      API.adminUser.adminUserList(params).then(response => {
        if (response.code === '0000') {
          this.storeDoctorArr = response.data.map(item => {
            return {Id: item.Id, NickName: item.NickName}
          })
          this.dataForm.AccountId = response.data.length === 0 ? '' : response.data[0].Id
          this.dataForm.currentDoctorName = response.data.length === 0 ? '' : response.data[0].NickName
          // 这儿存在问题，如果是药房类型账号来判断当然没问题，但如账号本身就有医生那应该是直接选择自己id的，以后处理下，应该问题不大
        } else {
          this.$message.error(response.message)
        }
        // 假如是医生类型的账号，得自动选择当前登陆的医生(如果门店下没医生自己，那就谁也不选!!!)，并且把html部分的下拉功能禁用!!!(2019.5.22解决)
        if (this.$store.getters.getAccountIsDoctor) {
          if (response.data.some(item => item.Id === Number(this.$store.getters.getAccountLoginInfoAll.AccountId))) {
            this.dataForm.AccountId = this.$store.getters.getAccountLoginInfoAll.AccountId
            this.dataForm.currentDoctorName = this.$store.getters.getAccountLoginInfoAll.NickName
          } else {
            this.dataForm.AccountId = ''
            this.dataForm.currentDoctorName = ''
          }
        }
        // this.$refs.firstTab.getDataList() // 初始化或者是说任何情况下确定AccountId这个字段完整了后，才继续更新子层页面的展示内容（这有点玄）!!!!!!!!!!
        this.doctorHandle()
      })
    },
    doctorHandle () {
      if (this.isVisible[0].child === true) {
        this.$refs.firstTab.getDataList()
      } else if (this.isVisible[1].child === true) {
        this.$refs.secondTab.getDataList()
      }
    },
    handleClick (tab, event) {
      // console.log(tab, event)
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
        case 'third':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 2 ? {child: true} : {child: false}
          })
          break
        case 'four':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 3 ? {child: true} : {child: false}
          })
          break
      }
      this.$nextTick(() => {
        this.isVisible.forEach((item, index) => {
          if (item.child === true) {
            if (index === 0) {
              this.$refs.firstTab.getDataList() // 协定方列表
            } else if (index === 1) {
              this.$refs.secondTab.getDataList() // 经典方列表
            } else if (index === 2) {
              this.$refs.threeTab.getDataList()
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
.mod-purchaseList /deep/ {
  .el-form-item { margin-bottom: 14px; }
  .el-dialog__body { padding-top: 10px; }
  /*表头高重写35高*/
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td,
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td {
    padding: 0 !important;
  }
 .purchaseListRow {
    color: #606266;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
}
</style>
