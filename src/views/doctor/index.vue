<template>
  <div class="mod-purchaseList">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
        <!--<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->
        <el-form :inline="true" :model="dataForm" size="mini">
          <com-store :paramsFather="{
            'label_0': '',
            'size_1': 'mini',
            'width_2': '120px',
            'clear_3': false,
            'multiple_4': false,
            'must_5': true,
            'isTrigger': true
          }" ref="comStoreOne" @eventStore="changeStoreData"></com-store>
          <el-form-item>
            <el-select @change="doctorHandle()" v-model="dataForm.AccountId" placeholder="医生" style="width: 100px">
              <el-option v-for="item in storeDoctorArr" :key="item.Id"
                         :label="`${item.Id}-${item.NickName}`" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-if="$store.getters.getAccountIsDoctor"
            @click="$router.push(`/doctor/recipel?MobilePhone=0&DoctorName=${dataForm.currentDoctorName}&DoctorId=${dataForm.AccountId}`)">
              直接就诊</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!--<el-tab-pane label="成品药品" name="second" disabled="true">-->
      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-date"></i> 待就诊患者</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="second">
        <span slot="label"><i class=""></i> xx</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[1].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="third">
        <span slot="label"><i class=""></i> xx</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[2].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="four">
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
        EndDate: ''
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
    ComStore
  },
  watch: {
    'value6': function () {
      console.log(this.value6)
      if (this.value6 !== [] && this.value6 !== null) {
        this.dataForm.StartDate = this.value6[0]
        this.dataForm.EndDate = this.value6[1]
        // console.log(this.dataForm.StartDate) // console.log(this.dataForm.EndDate)
      } else {
        this.dataForm.StartDate = ''
        this.dataForm.EndDate = ''
      }
    }
  },
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.AccountId = ''
        this.dataForm.currentDoctorName = ''
        this.getStoreAllDoctor() // 切换门店后，更新头部下拉option的选项 在这触发 初始化，不要崇拜…代替pageInit方法
        // if (this.isVisible[0].child === true) {
        //   this.$refs.firstTab.getDataList()
        // } else {
        //   this.$refs.secondTab.getDataList()
        // }
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
        roleId: '', // ?????????????????有问题哟!!!!!!!!!!!!!!!!!!!!!!!!
        canViewStores: this.$store.getters.getAccountCurrentHandleStore
      }
      API.adminUser.adminUserList(params).then(response => {
        if (response.code === '0000') {
          this.storeDoctorArr = response.data.map(item => {
            return {Id: item.Id, NickName: item.NickName}
          })
          this.dataForm.AccountId = response.data[0].Id
          console.log('ls')
          console.log(this.dataForm.AccountId)
          this.dataForm.currentDoctorName = response.data[0].NickName // 这儿存在问题，如果是药房类型账号来判断当然没问题，但如账号本身就有医生那应该是直接选择自己id的，以后处理下，应该问题不大
        } else {
          this.$message.error(response.message)
        }
        this.$refs.firstTab.getDataList() // 初始化或者是说任何情况下确定AccountId这个字段完整了后，才继续更新子层页面的展示内容（这有点玄）!!!!!!!!!!
      })
    },
    doctorHandle () {
      this.$refs.firstTab.getDataList()
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
      // // console.log(this.isVisible)
      // this.$nextTick(() => {
      //   this.isVisible.forEach((item, index) => {
      //     if (item.child === true) {
      //       if (index === 0) {
      //         this.num = 0
      //         this.$refs.firstTab.getDataList(this.num)
      //       } else if (index === 1) {
      //         this.num = 1
      //         this.$refs.firstTab.getDataList(this.num) // 待收货
      //       } else if (index === 2) {
      //         this.num = 4
      //         this.$refs.firstTab.getDataList(this.num) // 已到货未入库
      //       } else if (index === 3) {
      //         this.num = 10
      //         this.$refs.firstTab.getDataList(this.num) // 已入库（已完成）
      //       }
      //     }
      //     return false
      //   })
      // })
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
/*.chenxi-enter-to, .chenxi-leave {
transform: translate(0, 0);
opacity: 1;
}*/
.chenxi-enter-active,
.chenxi-leave-active {
  transition: all 0.6s ease;
}
/*.chenxi-leave-to {
  transform: translateX(-100px, 0);
}*/

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
.mod-purchaseList {
  & /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  & /deep/ .el-dialog__body {
    padding-top: 10px;
  }
  /*表头高重写35高*/
  & /deep/ .el-table--medium th, & /deep/ .el-table--medium td, & /deep/ .el-table th, & /deep/ .el-table td,
  & /deep/ .el-table--medium th, & /deep/ .el-table--medium td, & /deep/ .el-table th, & /deep/ .el-table td {
    padding: 0 !important;
  }
  /*& /deep/ .el-tabs__content {background-color: #F0F0F0}*/
  & /deep/ .purchaseListRow {
    color: #606266;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
}
/*.mod-purchaseList {*/
  /*& /deep/ .el-dialog__header {*/
    /*background-color: #1CA579;*/
  /*}*/
/*}*/
</style>
