<template>
  <div>
    <el-table-column prop="" label="操作2" width="" header-align="center" align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="addOrUpdateHandle(scope.row)" :disabled="fatherDataForm === 'see' ? true : false">删除</el-button>
      </template>
    </el-table-column>

    <el-table-column type="index" align="center" width="70" label="序号"></el-table-column>
    <el-table-column prop="CategoryName" header-align="center" align="center" label="药态" width="119" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="ProductCode" header-align="center" align="center" label="编码" width="119"></el-table-column>
    <el-table-column prop="ProductName" header-align="center" align="center" label="药名" width="80"></el-table-column>

    <el-table-column header-align="center" :align="$store.state.common.align" label="数量" min-width="150">
      <template slot-scope="scope">
        <el-input-number v-model="scope.row.myNum" :step="1" @change="handleChange" :min="1" :max="10000" size="mini" :disabled="fatherDataForm === 'see' ? true : false"></el-input-number>
      </template>
    </el-table-column>
  </div>
</template>

<script>
export default {
  name: 'table-two',
  props: ['fatherDataForm'],
  data () {
    return {
      categoryUnit: '克'
    }
  },
  methods: {
    addOrUpdateHandle (row) {
      this.$emit('tableEvent', row)
    },
    handleChange () {
      this.$emit('tableNumberEvent')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recipelAgeUnit /deep/ {
    display: inline-block;
    .el-input__inner {
      padding: 0 5px;
    }
  }
</style>
