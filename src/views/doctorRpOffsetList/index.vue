<template>
  <div class="mod-offset-list">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
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

          <el-form-item v-if="isVisible[0].child">
            <el-select v-model="dataForm.RoStatus" placeholder="请选择状态" @change="doctorHandle()" style="width: 100px">
              <el-option label="全部" value="-1,2,3"></el-option>
              <el-option label="待审" value="2"></el-option>
              <el-option label="已审" value="3"></el-option>
              <el-option label="作废" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.Code" placeholder="请输入单据编号"
                      @clear="doctorHandle()" clearable style="width: 119px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
                    size="mini"
                    v-model="valueTime" @change="doctorHandle()"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    style="width: 260px"
                    :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="doctorHandle()">查询</el-button>
            <el-button @click="
              $router.push({
                  name: 'offsetPage',
                  params: {
                    type: 'create',
                    row: null
              }})">跳转退方页</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-date"></i> 全部</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="second">
        <span slot="label"><i class="el-icon-date"></i> 待审</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[1].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="third">
        <span slot="label"><i class=""></i> 已完成</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[2].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="four">
        <span slot="label"><i class=""></i> 已废弃</span>
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
          RoStatus: '-1,2,3', // 单据状态 -1 2 3 待审，作废，完成
          Code: '', // 挂号单Code 挂号单Id
          Id: '',
          StartDate: '',
          EndDate: '',
          CategoryOne: ''
        },
        isVisible: [
          {child: true},
          {child: false},
          {child: false},
          {child: false}
        ],
        loading: false, // 加载

        valueTime: [],
        pickerOptions: { // 报表时间范围查询，快速选择
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '前天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() > Date.now() + 3600 * 24 * 0 * 1000
          }
        }
      }
    },
    components: {
      FirstTab,
      ComStore
    },
    watch: {
      'valueTime': function () {
        if (this.valueTime !== [] && this.valueTime !== null) {
          this.dataForm.StartDate = this.valueTime[0]
          this.dataForm.EndDate = this.valueTime[1]
        } else {
          this.dataForm.StartDate = ''
          this.dataForm.EndDate = ''
        }
      }
    },
    methods: {
      choseCurrentDay () { // 默选当天的时间
        function myFormat (s) {
          var y = s.getFullYear()
          var m = s.getMonth() + 1 < 10 ? '0' + (s.getMonth() + 1) : s.getMonth() + 1
          var d = s.getDate() < 10 ? '0' + s.getDate() : s.getDate()
          return `${y}-${m}-${d}`
        }
        var curDate = myFormat(new Date())
        var nextDate = myFormat(new Date(new Date().getTime() + 3600 * 24 * 1000 * 0))
        this.valueTime = [curDate, nextDate]
        this.doctorHandle()
      },
      changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
        if (isMultiple === false) {
          this.valueTime = null
          this.choseCurrentDay() // 门店切换时，重置默选当天的时间
        }
      },

      // 封装下，少些几行代码
      comTabFunction (num) {
        this.isVisible = this.isVisible.map((item, index) => {
          return index === num ? {child: true} : {child: false}
        })
      },
      handleClick (tab, event) {
        // console.log(tab, event)
        switch (tab.name) {
          case 'first':
            this.comTabFunction(0) // 封装下，少些几行代码
            break
          case 'second':
            this.comTabFunction(1)
            break
          case 'third':
            this.comTabFunction(2)
            break
          case 'four':
            this.comTabFunction(3)
            break
        }
        this.doctorHandle()
      },
      doctorHandle () {
        this.$nextTick(() => {
          this.isVisible.forEach((item, index) => {
            if (item.child === true) {
              if (index === 0) {
                this.$refs.firstTab.getDataList(this.dataForm.RoStatus) // 待审  -1，1,2,3 （单据状态 -1作废1初始2待审核3已审核 全部传"" 多个1,2,3,）
              } else if (index === 1) {
                this.$refs.firstTab.getDataList(2) // 已完成
              } else if (index === 2) {
                this.$refs.firstTab.getDataList(3) // 已废弃
              } else if (index === 3) {
                this.$refs.firstTab.getDataList(-1) // 已废弃
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
    &-offset-list /deep/ {
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
  .mod-offset-list /deep/ {
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
