<template>
  <div class="mod-drugs">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="中草药品" name="first">
        <first-tab></first-tab>
      </el-tab-pane>
      <el-tab-pane label="成品药品" name="second">
        成品药品
        <br>
        <br>
        <br>
        <br>
        <br>
      </el-tab-pane>
      <el-tab-pane label="其他商品" name="third"><!--disabled="true"-->
        其他商品
        <br>
        <br>
        <br>
        <br>
        <br>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import FirstTab from './first-tab'
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  components: {
    FirstTab
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-drugs /deep/ {
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
.mod-drugs /deep/ {
  .el-form-item { margin-bottom: 14px; }
  .el-dialog__body { padding-top: 10px; }
  /*表头高重写35高*/
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td,
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td {
    padding: 0 !important;
  }
}
.mod-drugs /deep/ .ownScrollbar {
  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar { width: 7px; }
  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    background-color: #eee;
  }
  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: inset 0 0 5px rgba(0,0,0,0);
    background-color: rgba(0,0,0,0);
  }
}
</style>
