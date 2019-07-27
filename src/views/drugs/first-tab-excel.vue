<template>
  <el-dialog
    v-dialogDrag
    :title="'Excel表批量导入'" width="850px"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose">
    <el-container>
      <el-aside width="600px">
        <el-table
          :data="targetData"
          height="600px"
          style="width: 100%"
          :header-cell-style="headerRowStyle">
          <el-table-column prop="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="drugName" label="药名" width="100"></el-table-column>
          <el-table-column prop="pinyin" label="拼音"></el-table-column>
          <el-table-column prop="category" label="药态"></el-table-column>
          <el-table-column prop="unit" label="单位" width="60"></el-table-column>
          <el-table-column prop="specification" label="规格"></el-table-column>
          <el-table-column prop="tipsVal" label="预警值"></el-table-column>
        </el-table>
      </el-aside>

      <el-main>
        <input type="file" @change="importExcel()" ref="myinput" style="width: 150px"/>
        <h3>批量导入说明：</h3>
        <p style="height: 500px;text-align: justify;">
          导入文件限制后缀为.xls 或 .xlsx，
          Excel第一行标题名必须是：<span style="color: #e4393c">index、drugName、pinyin、category、unit、specification、tipsVal（严格区分大小写，顺序无限制）;</span>
          分别表示：序号，药名，药材拼音，药态，药品单位，规格，预警值；
          导入文件后请仔细对照左侧生成的列表是否符合实际情况，确认后点击确认即可
        </p>
        <span>当前 {{targetData.length}}</span>
      </el-main>
    </el-container>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitExcel()" :disabled="isOKClick">提交</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import API from '@/api'
import {Currency} from '../../utils/validate'
import XLSX from 'xlsx'
export default {
  data () {
    return {
      visible: false,
      headerRowStyle: {
        backgroundColor: '#409EFF'
      },

      isOKClick: false,
      rABS: false,
      targetData: [] // 导入excel的目标数据
    }
  },
  methods: {
    // 打开弹层
    init () {
      this.visible = true
    },
    // 关闭弹层
    handleClose () {
      this.isOKClick = false
      this.targetData = []
    },

    // 读取文件
    importExcel () {
      var obj = this.$refs.myinput
      if (!obj.files) {
        return false
      }
      var f = obj.files[0]
      var name = f.name
      if (name.search(/.xls[x]?/i) === -1) {
        this.$message.error('上传文件只能是 xls/xlsx 格式!')
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        var data = e.target.result
        var wb
        if (this.rABS) {
          wb = XLSX.read(data, { type: 'binary' })
        } else {
          var arr = this.viewData(data) // 处理下数据
          wb = XLSX.read(btoa(arr), { type: 'base64' })
        }
        this.targetData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) // 目标数据
        console.log(this.targetData)
      }
      if (this.rABS) reader.readAsBinaryString(f)
      else reader.readAsArrayBuffer(f)
    },
    // 处理下数据
    viewData (data) {
      var o = ''
      var l = 0
      var w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },

    // 批量导入提交
    submitExcel () {
      this.isOKClick = true
      setTimeout(() => {
        this.isOKClick = false
      }, 1000)
      var params = {}
      // API.drugs.drugsBatchExcel(params).then((result) => {
      //   if (result.code === '0000') {
      //     this.$message({
      //       type: 'success',
      //       message: '批量导入成功!',
      //       duration: 1000,
      //       onClose: () => {
      //         this.visible = false
      //         this.$emit('childExcel')
      //       }
      //     })
      //   } else {
      //     this.$message.error(result.message)
      //   }
      // })
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
