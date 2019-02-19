<template>
  <div class="app-container" style="padding: 10px;">
    <tree-table :data="data" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border>
      <el-table-column label="品类名称">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{scope.row.event}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="message(scope.row)">点击</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <div style="width: 100%;">
      <div style="width: 30%;float: left;height: 500px;background-color: #ffffff">
        <el-tree
          :props="props1"
          :load="loadNode1"
          node-key="categoryCode"
          ref="tree"
          lazy
          @node-click="handleNodeClick">
        </el-tree>
      </div>
    </div>
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
        props1: {
          label: 'name',
          children: [],
          isLeaf: 'leaf'
        },

        func: treeToArray,
        expandAll: false,
        data:
          {
            id: 1,
            event: '事件1',
            timeLine: 100,
            comment: '无',
            children: [
              {
                id: 2,
                event: '事件2',
                timeLine: 10,
                comment: '无'
              },
              {
                id: 3,
                event: '事件3',
                timeLine: 90,
                comment: '无',
                children: [
                  {
                    id: 4,
                    event: '事件4',
                    timeLine: 5,
                    comment: '无'
                  },
                  {
                    id: 5,
                    event: '事件5',
                    timeLine: 10,
                    comment: '无'
                  },
                  {
                    id: 6,
                    event: '事件6',
                    timeLine: 75,
                    comment: '无',
                    children: [
                      {
                        id: 7,
                        event: '事件7',
                        timeLine: 50,
                        comment: '无',
                        children: [
                          {
                            id: 71,
                            event: '事件71',
                            timeLine: 25,
                            comment: 'xx'
                          },
                          {
                            id: 72,
                            event: '事件72',
                            timeLine: 5,
                            comment: 'xx'
                          },
                          {
                            id: 73,
                            event: '事件73',
                            timeLine: 20,
                            comment: 'xx'
                          }
                        ]
                      },
                      {
                        id: 8,
                        event: '事件8',
                        timeLine: 25,
                        comment: '无'
                      }
                    ]
                  }
                ]
              }
            ]
          },
        args: [null, null, 'timeLine'],
        dataForm: {
          categoryCode: ''
        }
      }
    },
    mounted () {
    },
    methods: {
      handleNodeClick (data) {
        console.log(data)
      },
      loadNode1 (node, resolve) {
        if (node.level === 0) {
          this.requestTree(resolve)
        }
        if (node.level >= 1) {
          this.getIndex(node, resolve)
        }
      },
      // 首次加载一级节点数据函数
      requestTree (resolve) {
        axios.post('http://192.168.199.234:8300/stocktaking/admin/category/subcategory', {'categoryCode': this.dataForm.categoryCode, 'pageIndex': String(this.pageIndex), 'pageSize': String(this.pageSize)}).then(res => {
          if (res.data.code === '0000') {
            // 处理节点是否是叶子节点
            res.data.data.forEach(et => {
              if (et.isIndex === '1') {
                et.leaf = true
              } else {
                et.leaf = false
              }
            })
            let data = res.data.data
            console.log(data)
            resolve(data)
          }
        })
      },
      // 异步加载叶子节点数据函数
      getIndex (node, resolve) {
        axios.post('http://192.168.199.234:8300/stocktaking/admin/category/subcategory', {'categoryCode': node.data.code, 'pageIndex': String(this.pageIndex), 'pageSize': String(this.pageSize)}).then(res => {
          if (res.data.code === '0000') {
            // 处理节点是否是叶子节点
            res.data.data.forEach(et => {
              if (et.isIndex === '1') {
                et.leaf = true
              } else {
                et.leaf = false
              }
            })
            let data = res.data.data
            console.log(data)
            resolve(data)
          }
        })
      },
      message(row) {
        this.$message.info(row.event)
      }
    }
  }
</script>
