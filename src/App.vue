<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  .el-loading-mask{
    z-index: 1;
  }
  #app{
    height: 100%;
  }
  /*不可用input 样式修改*/
  .el-input.is-disabled .el-input__inner {
    background-color: #ffffff;
    border-color: #e4e7ed;
    color: #606266;
    cursor: not-allowed;
  }
</style>
