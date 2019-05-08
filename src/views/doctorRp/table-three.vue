<template>
  <div>
    <el-table-column type="index" align="center" width="70" label="1003"></el-table-column>
    <el-table-column prop="CategoryName" header-align="center" align="center" label="药态" width="150"></el-table-column>
    <el-table-column prop="ShowName" header-align="center" align="center" label="药名" width="100"></el-table-column>
    <el-table-column prop="Id" header-align="center" align="center" label="Id标识" width="100"></el-table-column>
    <el-table-column prop="Quantity" header-align="center" align="center" label="余量" :show-overflow-tooltip="true"></el-table-column>

    <el-table-column prop="Code" header-align="center" align="center" label="编码" width="100"></el-table-column>
    <el-table-column prop="" header-align="center" align="center" label="开药数量" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="SalePrice" header-align="center" align="center" label="售价"></el-table-column>
    <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="addOrUpdateHandle(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </div>
</template>

<script>
export default {
  name: 'table-one',
  methods: {
    addOrUpdateHandle (row) {
      // this.visible = false
      this.$emit('tableEvent', row)
    }
  }
}
</script>

<style scoped>

</style>
