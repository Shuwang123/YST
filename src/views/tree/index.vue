<template>
  <div class="app-container" style="padding: 10px;">
    <tree-table :data="data" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border>
      <el-table-column label="品类名称">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{scope.row.label}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="message(scope.row)">点击</el-button>
        </template>
      </el-table-column>
    </tree-table>
  </div>

</template>

<script>
  import treeTable from './custom'
  import treeToArray from './customEval'
  import axios from 'axios'
  export default {
    name: 'customTreeTableDemo',
    components: { treeTable },
    data() {
      return {
        func: treeToArray,
        expandAll: false,
        data: [],
        args: [null, null, 'timeLine'],
        dataForm: {
          categoryCode: ''
        }
      }
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        axios.get('https://easy-mock.com/mock/5b3d6f6ee40bed4edc62fea9/tree').then(response => {
          console.log(response)
          this.data = response.data.config
          console.log(this.data)
        })
      },
      message (row) {
        this.id = row.id
        console.log(this.id)
        this.$message.info(row.label)
      },
    }
  }
</script>
