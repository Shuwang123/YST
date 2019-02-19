<template>
  <div class="site-content">
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-icon-wrapper icon-people">
            <i class="el-icon-edit"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">会员数量</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="102400" :duration="2600"></count-to>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <i class="el-icon-message"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">信息数量</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="81212" :duration="3000"></count-to>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <i class="el-icon-edit-outline"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">收益数量</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="9280" :duration="3200"></count-to>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <i class="el-icon-goods"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">订单数量</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="13600" :duration="3600"></count-to>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row class="panel-group" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8" class="card-panel-col">
        <el-card class="box-card">
          <e-charts :options="option" :auto-resize="true" style="width: 100%;"></e-charts>
        </el-card>

      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" class="card-panel-col">
        <el-card class="box-card">
          <e-charts :options="option1" :auto-resize="true" style="width: 100%;"></e-charts>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" class="card-panel-col">
        <el-card class="box-card">
          <e-charts :options="option2" :auto-resize="true" style="width: 100%;"></e-charts>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
import CountTo from 'vue-count-to'
import ECharts from 'vue-echarts'
export default {
  components: {
    CountTo,
    ECharts,
  },
  name: 'dashboard',
  data () {
   var data = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];
    var dateList = data.map(item => {
      return item[0];
    });
    var valueList = data.map(item => {
      return item[1];
    });
    var xAxisData =[];
    var yAxisData =[];
    for (var i =0;i<10;i++){
      xAxisData.push('2018-5-'+i);
      yAxisData.push(Math.random()*100);
    }
    return {
      option:{
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 400
      }, {
        show: false,
        type: 'continuous',
        seriesIndex: 1,
        dimension: 0,
        min: 0,
        max: dateList.length - 1
      }],
      title: [{
        left: 'center',
        text: '在线用户量'
      }, {
        top: '55%',
        left: 'center',
        text: '总用户量'
      }],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [{
        data: dateList
      }, {
        data: dateList,
        gridIndex: 1
      }],
      yAxis: [{
        splitLine: {show: false}
      }, {
        splitLine: {show: false},
        gridIndex: 1
      }],
      grid: [{
        bottom: '60%'
      }, {
        top: '60%'
      }],
      series: [{
        type: 'line',
        showSymbol: false,
        data: valueList
      }, {
        type: 'line',
        showSymbol: false,
        data: valueList,
        xAxisIndex: 1,
        yAxisIndex: 1
      }]
    },
      option1:{
        title: {
          text: '订单销售量'
        },
        tooltip: {},
        legend: {
          data:['日期']
        },
        xAxis: {
         data:xAxisData
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data:yAxisData
        }]
      },
      option2:{
      title : {
        text: '分区销售量',
        x:'center'
      },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },
      series : [
        {
          name: '分区销售量',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:335, name:'渝中区'},
            {value:310, name:'渝北区'},
            {value:234, name:'沙坪坝区'},
            {value:135, name:'万州区'},
            {value:214, name:'南坪区'},
            {value:1002, name:'大渡口区'},
            {value:564, name:'江北区'},
            {value:1548, name:'九龙坡区'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    },
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col{
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .el-icon-edit, .el-icon-message, .el-icon-edit-outline, .el-icon-goods {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  table.dataintable {
    border-collapse: collapse;
    border: 1px solid #eeeeee;
    width: 100%;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  table.dataintable td {
    vertical-align: text-top;
    padding: 6px 15px 6px 6px;
    border: 1px solid #eeeeee;
  }
</style>

