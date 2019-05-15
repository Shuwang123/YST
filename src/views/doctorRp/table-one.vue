<template>
  <div>
    <el-table-column prop="" label="操作" width="" header-align="center" align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="addOrUpdateHandle(scope.row)">删除</el-button>
      </template>
    </el-table-column>

    <el-table-column prop="Code" header-align="center" align="center" label="编码" width="100"></el-table-column>
    <el-table-column prop="CategoryName" header-align="center" align="center" label="药态" width="70"></el-table-column>
    <el-table-column type="index" align="center" width="70" label="序号"></el-table-column>
    <el-table-column prop="ShowName" header-align="center" align="center" label="药名" width="80"></el-table-column>

    <!--<el-table-column prop="Id" header-align="center" align="center" label="Id标识" width="70"></el-table-column>-->
    <!--<el-table-column prop="Quantity" header-align="center" align="center" label="余量" :show-overflow-tooltip="true"></el-table-column>-->
    <el-table-column prop="SalePrice" header-align="center" align="center" label="单价" width="70"></el-table-column>
    <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="数量" min-width="150">
      <template slot-scope="scope">
        <el-input-number v-model="scope.row.myNum" :step="1" @change="handleChange" :min="1" :max="1000" size="mini"></el-input-number> g
      </template>
    </el-table-column>
    <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="总价" min-width="70">
      <template slot-scope="scope">
        {{scope.row.SalePrice * scope.row.myNum}}
      </template>
    </el-table-column>
    <!--<el-table-column prop="SalePrice" header-align="center" align="center" label="总价" width="70"></el-table-column>-->
  </div>
</template>

<script>
export default {
  name: 'table-one',
  methods: {
    addOrUpdateHandle (row) {
      // this.visible = false
      this.$emit('tableEvent', row)
    },
    handleChange () {
      // this.$nextTick(() => {})
      this.$emit('tableNumberEvent')
    }
  }
}
</script>

<style scoped>

</style>
