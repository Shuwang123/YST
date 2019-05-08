<template>
    <div class="mod-storeRegister">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: 0;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="mini">
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
              <el-form-item>
                <el-select v-model="dataForm.AccountId" placeholder="医生" clearable style="width: 100px">
                  <el-option v-for="item in storeDoctorArr" :key="item.Id"
                             :label="`${item.Id} ${item.NickName}`" :value="item.Id"></el-option>
                </el-select>
              </el-form-item>
              <span v-show="isVisible[1].child">
                <el-form-item>
                <el-input v-model="dataForm.patientName" placeholder="患者" clearable style="width: 70px"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="dataForm.MobilePhone" placeholder="患者电话" clearable style="width: 119px"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    size="mini"
                    v-model="value6"
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
                <el-button
                  @click="isVisible[0].child ===  true ? $refs.firstTab.getDataList() : $refs.secondTab.getDataList()"
                  size="mini">查询
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;padding-right: 10px">
              <el-button  type="primary" @click="$router.push(`/doctor/treatment`)" size="mini">辅助开方</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-upload"></i> 挂号</span>
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
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTab from './first-tab'
import SecondTab from './second-tab'
import ComStore from '../common/com-store'
export default {
  watch: {
    'value6': function () {
      console.log(this.value6)
      if (this.value6 !== [] && this.value6 !== null) {
        this.dataForm.StartDate = this.value6[0]
        this.dataForm.EndDate = this.value6[1]
        // console.log(this.dataForm.StartDate)
        // console.log(this.dataForm.EndDate)
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
        patientName: '', // 患者
        MobilePhone: '', // 电话 这几个信息只是父组件传递给子组件的查询字段而已
        StartDate: '',
        EndDate: ''
      },
      isVisible: [
        {child: true},
        {child: false}
      ],
      value6: [],
      storeDoctorArr: []
    }
  },
  components: {
    ComStore,
    FirstTab,
    SecondTab
  },
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.AccountId = '' // 门店切换时，选择的医生筛选条件当然也清空
        this.getStoreAllDoctor() // 门店切换时，获取对应门店下所有医生
        if (this.isVisible[0].child === true) {
          this.$refs.firstTab.getDataList()
        } else {
          this.$refs.secondTab.getDataList()
        }
      }
    },
    // 当门店改变时，获取门店下所有医生（只是给表头的查询下拉option赋初始值而已）
    getStoreAllDoctor () {
      var params = { // 这个接口貌似请求失败了？？？？？？？？？？？？？？？？？？？？？？？？？5.7号，别忘了
        PageIndex: 1,
        PageSize: 10000,
        IsPaging: true,
        id: '',
        userName: '',
        nickName: '',
        roleId: '', // 就是这个字段，这个列表应该只能是当前门店下所有的医生类型账号，这个地方要重新处理
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
      }
      this.$nextTick(() => {
        this.isVisible.forEach((item, index) => {
          if (item.child === true) {
            if (index === 0) {
              this.num = 0
              this.$refs.firstTab.getDataList()
            } else if (index === 1) {
              this.num = 1
              this.$refs.secondTab.getDataList() // 挂号列表
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
.mod-storeRegister{
  & /deep/ .el-form-item {
    margin-bottom: 0px;
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
  & /deep/ .storeStockListRow {
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
