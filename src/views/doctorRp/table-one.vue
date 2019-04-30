<template>
  <div>
    <el-table-column type="index" align="center" width="70" label="1001"></el-table-column>
    <el-table-column prop="Id" header-align="center" align="center" label="药品/规格" width="100"></el-table-column>
    <el-table-column prop="Code" header-align="center" align="center" label="剂量" width="100"></el-table-column>
    <el-table-column prop="CreatedTime" header-align="center" align="center" label="代数" width="150"></el-table-column>
    <el-table-column prop="SupplierName" header-align="center" align="center" label="单价" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="StoreName" header-align="center" align="center" label="金额"></el-table-column>
    <el-table-column prop="Quantity" header-align="center" align="center" label="用法" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="" label="操作" width="150" header-align="center" align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="addOrUpdateHandle(scope.row.Id)">就诊</el-button>
      </template>
    </el-table-column>
  </div>
</template>

<script>
export default {
  name: "table-one"
}
</script>

<style scoped>

</style>
