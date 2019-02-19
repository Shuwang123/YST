<template>
  <div class="mod-sql">
    <el-table
      :data="tableData6"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="amount1"
        label="数值 1（元）">
      </el-table-column>
      <el-table-column
        prop="amount2"
        label="数值 2（元）">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="数值 3（元）">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'sql',
  data () {
    return {
      tableData6: [{
        id: '12987122',
        name: '王小虎',
        amount1: '234',
        amount2: '3.2',
        amount3: 10
      }, {
        id: '12987123',
        name: '王小虎',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '12987124',
        name: '王小虎',
        amount1: '324',
        amount2: '1.9',
        amount3: 9
      }, {
        id: '12987125',
        name: '王小虎',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '12987126',
        name: '王小虎',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }]
    }
  },
  mounted () {
    this.goto()
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 4 === 0) {
          return {
            rowspan: 4,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 笛卡尔乘积开始
    goto () {
      // 笛卡儿积组合
      function descartes (list) {
        // parent上一级索引;count指针计数
        var point = {}
        var result = []
        var pIndex = null
        var tempCount = 0
        var temp = []
        // 根据参数列生成指针对象
        for (var index in list) {
          if (typeof list[index] === 'object') {
            point[index] = {'parent': pIndex, 'count': 0}
            pIndex = index
          }
        }
        // 单维度数据结构直接返回
        if (pIndex == null) {
          return list
        }
        // 动态生成笛卡尔积
        while (true) {
          for (index in list) {
            tempCount = point[index]['count']
            temp.push(list[index][tempCount])
          }
          // 压入结果数组
          result.push(temp)
          temp = []
          // 检查指针最大值问题
          while (true) {
            if (point[index]['count'] + 1 >= list[index].length) {
              point[index]['count'] = 0
              pIndex = point[index]['parent']
              if (pIndex == null) {
                return result
              }
              // 赋值parent进行再次检查
              index = pIndex
            } else {
              point[index]['count']++
              break
            }
          }
        }
      }
      var data = descartes({'color': ['红色', '白色'], 'daxiao': ['S', 'M']})
      console.log(data)
      // 笛卡尔乘积完
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mod {
  &-sql {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
