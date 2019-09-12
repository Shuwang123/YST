<template>
    <div class="mod-report-form">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: 0;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm" size="mini" @keyup.enter.native="comTabFunction()">
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
                <el-select v-model="dataForm.CategoryId" placeholder="药品种类" @change="comTabFunction()"
                           clearable @clear="comTabFunction()" style="width: 110px" size="mini">
                  <el-option v-for="item in drugsCategoryList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-input v-model="dataForm.ProductCodeOrBarCode" placeholder="商品编码"
                          clearable @clear="comTabFunction()" style="width: 110px" size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="dataForm.ProductName" placeholder="商品名字"
                          clearable @clear="comTabFunction()" style="width: 110px" size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  size="mini"
                  v-model="valueTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 260px"
                  @change="comTabFunction()"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button @click="comTabFunction()" size="mini">查询</el-button>
                <el-button icon="el-icon-document" @click="handleDownload" size="mini">Export Excel</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-tab-pane label="" name="first" style="margin-top: 1px">
        <span slot="label"><i class="el-icon-document"></i> 药品使用统计</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
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
  components: {
    ComStore,
    FirstTab
  },
  data () {
    return {
      activeName: 'first',
      drugsCategoryList: [], // 先请求药品种类

      dataForm: {
        CategoryId: '',
        ProductCodeOrBarCode: '',
        ProductName: '',
        StartDate: '',
        EndDate: ''
      },
      isVisible: [
        {child: true}
      ],
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
        }],
        disabledDate (time) {
          return time.getTime() > Date.now() + 3600 * 24 * 0 * 1000
        }
      }
    }
  },
  watch: {
    valueTime (arr, oldarr) {
      this.dataForm.StartDate = arr[0]
      this.dataForm.EndDate = arr[1]
    }
  },
  created () {
    this.choseCurrentDay()
    this.getDrugsCategory()
  },
  methods: {
    // 先请求药品种类提供给下拉列表
    getDrugsCategory () {
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryList = result.data.slice(1)
        }
      })
    },

    // 默选当天的时间
    choseCurrentDay () {
      function myFormat (s) {
        var y = s.getFullYear()
        var m = s.getMonth() + 1 < 10 ? '0' + (s.getMonth() + 1) : s.getMonth() + 1
        var d = s.getDate() < 10 ? '0' + s.getDate() : s.getDate()
        return `${y}-${m}-${d}`
      }
      var curDate = myFormat(new Date())
      var nextDate = myFormat(new Date(new Date().getTime() + 3600 * 24 * 1000 * 0))
      this.valueTime = [curDate, nextDate]
    },

    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.choseCurrentDay()
        this.comTabFunction()
      }
    },
    comTabFunction () {
      // 后刷新页面
      this.$nextTick(() => { // 等待watch那计算完毕才执行查询
        if (this.isVisible[0].child === true) {
          this.$refs.firstTab.getDataList()
        }
      })
    },
    // 导出excel
    handleDownload () {
      if (this.isVisible[0].child === true) {
        this.$refs.firstTab.handleDownload()
      }
    },
    // 且换tabs标签页时
    handleClick (tab, event) {
      switch (tab.name) {
        case 'first':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 0 ? {child: true} : {child: false}
          })
          break
      }
      this.comTabFunction()
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
  &-report-form /deep/ {
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
.mod-report-form /deep/ {
  .el-form-item { margin-bottom: 0; }
  .el-dialog__body { padding-top: 10px; }
  /*表头高重写35高*/
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td,
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td {
    padding: 0 !important;
  }
  .storeStockListRow {
    color: #606266;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
  .el-date-editor .el-range__close-icon { display: none; }
}
</style>
