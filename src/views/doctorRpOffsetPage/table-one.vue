<template>
  <div>
    <el-table-column prop="" label="操作1" header-align="center" align="center">
      <template slot-scope="scope">
        <el-button type="text" @click="addOrUpdateHandle(scope.row)">删除</el-button>
      </template>
    </el-table-column>

    <el-table-column type="index" align="center" width="70" label="序号"></el-table-column>
    <!--<el-table-column prop="Code" header-align="center" align="center" label="编码" width="100"></el-table-column>-->
    <!--<el-table-column prop="CategoryName" header-align="center" align="center" label="药态" width="70" :show-overflow-tooltip="true"></el-table-column>-->
    <el-table-column prop="ShowName" header-align="center" align="center" label="药名" min-width="100"></el-table-column>

    <!--<el-table-column prop="Id" header-align="center" align="center" label="Id标识" width="70"></el-table-column>-->
    <!--<el-table-column prop="Quantity" header-align="center" align="center" label="余量" :show-overflow-tooltip="true"></el-table-column>-->
    <el-table-column header-align="center" align="center" label="单价" min-width="100">
      <template slot-scope="scope">
        {{Number(scope.row.StoreSalePrice).toFixed(2)}}
      </template>
    </el-table-column>
    <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="数量" min-width="150">
      <template slot-scope="scope">
        <!--<el-input-number v-model="scope.row.myNum" :step="1" @change="handleChange" :min="1" :max="scope.row.Quantity" size="mini"></el-input-number>-->
        <el-input-number ref="chd" @keyup.enter.native="$emit('blurEvent')"
                         v-model="scope.row.myNum"
                         @change="handleChange"
                         :step="1" :min="1" size="mini"></el-input-number>
        <!--<div class="recipelAgeUnit">-->
        <!--<el-select v-model="categoryUnit" style="width: 45px" size="mini">-->
        <!--<el-option :label="'克'" :value="'g'"></el-option>-->
        <!--<el-option :label="'袋'" :value="'dai'"></el-option>-->
        <!--</el-select>-->
        <!--</div>-->
      </template>
    </el-table-column>
    <el-table-column prop="" header-align="center" :align="$store.state.common.align" label="总价" min-width="100">
      <template slot-scope="scope">
        {{Number(scope.row.StoreSalePrice * scope.row.myNum).toFixed(2)}}
      </template>
    </el-table-column>
    <!--<el-table-column prop="StoreSalePrice" header-align="center" align="center" label="总价" width="70"></el-table-column>-->
  </div>
</template>

<script>
  export default {
    name: 'table-one',
    data () {
      return {
        // categoryUnit: '克'
      }
    },
    methods: {
      // 删除药材时
      addOrUpdateHandle (row) {
        // this.visible = false
        this.$emit('tableEvent', row)
      },
      // 药材的数量变化时
      handleChange () {
        // this.$nextTick(() => {})
        this.$emit('tableNumberEvent')
      }
    }
  }
</script>
