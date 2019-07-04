<template>
  <div class="mod-member">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="普通会员列表" name="first">
        <first-tab></first-tab>
      </el-tab-pane>
      <el-tab-pane label="…" name="second"><!--disabled="true"-->
        超级会员
        <br>
        <br>
        <br>
        <br>
        <br>
      </el-tab-pane>
      <el-tab-pane label="…" name="third">
        熊猫会员
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
  &-member /deep/ {
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
.mod-member /deep/ {
  .el-form-item { margin-bottom: 14px; }
  .el-dialog__body { padding-top: 10px; }
  /*表头高重写35高*/
  .el-table--medium th, & .el-table--medium td, .el-table th, .el-table td,
  .el-table--medium th, & .el-table--medium td, .el-table th, .el-table td {
    padding: 0 !important;
  }
}
</style>
