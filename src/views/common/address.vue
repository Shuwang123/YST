<template>
  <div>
    <el-form-item prop="Address" label="门店地址">
      <el-cascader
        :options="allAddressList"
        placeholder="选择地区"
        filterable
        @change="handleChange"
        v-model="init"
      ></el-cascader>
    </el-form-item>
  </div>
</template>

<script>
import API from '@/api'
export default {
  data () {
    return {
      allAddressList: [], // 服务器传递过来的全国统一list
      init: [], // 根据父组件编辑时传递过来的lastCode计算出的三级地址数组，初始化弹窗的地址内容
      childCode: '' // handleChange时，地址改变时，此子组件将来会传递给父组件的地址编码
    }
  },
  props: ['lastCode'], // 如果是编辑时父组件传递过来的地址编码（新增是undefined）
  // mounted () {  //   this.getAddress() 貌似行不通  // },
  methods: {
    getAddress () {
      // 获得哥给的未排版地址 list，全部都是同层的
      API.store.getAddress().then(result => {
        if (result.code === '0000') {
          var arr = []
          var addr = JSON.parse(result.data)
          console.log(addr)

          addr.forEach(item => {
            console.log(this.lastCode)
            if (this.lastCode === item.id) {
              this.init.unshift(item.id)
              this.init.unshift(item.pId)
            }
            if (item.pId === null) { arr.push({value: item.id, label: item.name.slice(9), children: []}) }
          })
          addr.forEach(item => {
            if (this.init[0] === item.id) { this.init.unshift(item.pId) }
          })
          console.log(this.init)
          addr.forEach(item => {
            if (item.pId !== null) {
              arr.forEach(i => {
                if (i.value === item.pId) {
                  i.children.push({value: item.id, label: item.name.slice(9), children: []})
                  return false
                }
              })
            }
          })
          console.log(arr)
          addr.forEach(item => {
            if (item.pId !== null) {
              arr.forEach(i => {
                i.children.forEach(j => {
                  if (j.value === item.pId) {
                    j.children.push({value: item.id, label: item.name.slice(9)})
                    return false
                  }
                })
              })
            }
          })
          console.log(arr)

          this.allAddressList = arr // 三级级联地址的所有官方数据
          // console.log(this.arr)
          this.childCode = this.init[2]
        }
      })
    },
    handleChange (val) {
      // console.log(val)// console.log(this.arr) el-cascader中的v-model='arr' 和此处val同一个值，都是数组
      this.childCode = val[2]
      this.$emit('chenxi', this.childCode)
    }

  }
}
</script>

<style scoped>

</style>
