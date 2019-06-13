<template>
  <el-dialog
    v-dialogDrag
    :title="openType === 'add' ? '创建协定方' : openType === 'see' ? '查看协定方' : '编辑协定方'" :width="'1200px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="registerIndex">
    <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="80px" size="mini">
      <el-container class="doctor-recipel" style="padding-left: 20px">
        <el-aside width="67%" style="border-right: 1px solid #DCDFE6; padding-right: 5px;min-width: 700px;">
          <div id="leftHeightPatient">
            <p style="text-align: center;font-size: 16px; padding: 5px 0 20px 0;">
              <span style="position: relative; top: 10px;font-size: 18px; font-weight: 600;cursor: pointer"
                    @click="cutOut = !cutOut" :title="cutOut ? '点击收起' : '点击展开'"> 医生协定方
                <b style="font-weight: 700;font-size: 12px;color: #409EFF;
                   text-decoration: underline">{{cutOut ? '点击收起' : '点击展开'}}</b>
              </span>
            </p>

            <transition>
              <div v-show="cutOut">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="名称">
                      <el-input v-model="dataForm.PrescriptionName" placeholder="请输入名称" style="width: 75%" :disabled="openType === 'see' ? true : false"></el-input>
                    </el-form-item>
                  </el-col>
                  <!--<el-col :span="12">-->
                    <!--<el-form-item label="科室">-->
                      <!--<el-input v-model="dataForm.AgoIllness" placeholder="请输入科室" style="width: 75%" :disabled="openType === 'see' ? true : false"></el-input>-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="主治">
                      <el-input v-model="dataForm.MainCure" placeholder="请输入主治" style="width: 75%" :disabled="openType === 'see' ? true : false"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="功效">
                      <el-input v-model="dataForm.Effect" placeholder="请输入功效" style="width: 75%" :disabled="openType === 'see' ? true : false"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="说明">
                      <el-input v-model="dataForm.Explain" placeholder="请输入说明" style="width: 75%" :disabled="openType === 'see' ? true : false"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="用法" prop="DrugRate">
                      <el-input v-model="dataForm.DrugRate" placeholder="请输入用法" style="width: 75%" :disabled="openType === 'see' ? true : false"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </transition>
            <div style="border-bottom: 1px solid #E6E6E6; font-weight: 500">R:</div>
          </div>
          <!--左侧开方：直接用组件的引用名切换-->
          <el-table
            :height="chenxiHeight"
            :data="leftTableData"
            stripe
            v-loading="dataListLoading"
            row-class-name="purchaseListRow"
            :header-cell-style="$cxObj.tableHeaderStyle30px"
            style="width: 100%;">
            <component :is="leftTable" ref="leftCurrentTable" @tableEvent="delDrugs" @tableNumberEvent="consoleTable"
                       :fatherDataForm="openType"></component>
          </el-table>
        </el-aside>

        <!--右侧药材：tabs标签页切换引导组件切换-->
        <el-main width="30%" style="padding: 10px 10px 0; border-bottom: 1px solid #DCDFE6;">
          <el-input v-model="dataForm.SpellName" @blur="dataForm.SpellName = ''"
                    :placeholder="`请输入要查询的药材, 门店：${$store.getters.getAccountCurrentHandleStore}`"
                    style="min-width: 190px; width: 100%" size="small" clearable><i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in drugsCategoryArr" :key="item.id" :label="item.text" :name="item.id" :disabled="openType === 'see' ? true : false"></el-tab-pane>
          </el-tabs>
          <div class="rightUlStyle">
            <ul class="ownScrollbar xx">
              <li v-for="item in rightUlData" :key="item.Id">
                <el-tooltip class="item" effect="light" :content="item.ShowName+' [余量'+item.Quantity+']'" placement="left">
                  <el-row style="clear: both">
                    <!--<span v-text="item.ShowName === null ? '000' : item.ShowName"></span> {{item.Id}}余{{item.Quantity}}g/预{{item.RedLine}}-->

                    <!--药材名+剩余量+操作-->
                    <el-col :span="6">
                    <span v-text="item.ShowName === null ? '无' : item.ShowName"
                          style="display: inline-block; vertical-align: middle; width: 50px;overflow: hidden; white-space: nowrap;text-overflow: ellipsis">
                    </span>
                    </el-col>
                    <el-col :span="12" :style="{color: item.Quantity - item.RedLine > 0 ? '#333' : item.Quantity === 0 ? '#ccc' : '#e4392c'}">
                    <span style="display: inline-block; vertical-align: middle;text-align: left;padding-left: 10px;
                                 overflow: hidden;width: 100px; white-space: nowrap;text-overflow: ellipsis">
                      {{item.Quantity}} / {{item.RedLine}}
                      <!--{{item.Id}} {{item.Quantity}}/{{item.RedLine}}-->
                    </span>
                    </el-col>

                    <el-col :span="6" style="text-align: right;padding-right: 7px">
                      <el-button type="text" size="mini" @click="addDrugs(item)"
                                 style="font-size: 15px;font-weight: 600" v-if="openType === 'see' ? false : true">添加</el-button>
                      <!--<el-button type="text" size="mini" @click="cutOut = false; addDrugs(item)">添加</el-button>-->
                    </el-col>
                  </el-row>
                </el-tooltip>
              </li>
            </ul>

            <!--A B C D...字母按钮-->
            <ol>
              <li v-for="(item, ind) in litterArr" :key="item.content" :class="[item.isActive ? 'isActive' : '']"
                  v-text="item.content" @click="activeLitter(item.content, ind)">
              </li>
            </ol>
          </div>

          <div class="rightPageCounterContainer">
            <div class="rightPageCounter">
              <el-pagination @size-change="sizeChangeHandle"
                             @current-change="currentChangeHandle"
                             :current-page="pageIndex"
                             :page-sizes="[10,20,50,100]"
                             :page-size="pageSize"
                             :total="totalPage"
                             layout="prev, pager, next" :pager-count="5" small>
                <!--layout="prev, pager, next, jumper, sizes, total" background>-->
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button v-if="openType !== 'see'" type="primary" @click="send()" size="medium">保存协定方</el-button>
      <el-button v-if="openType !== 'see'" @click="visible = false">取消</el-button>
      <el-button v-if="openType === 'see'" @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import '../common/icon/iconfont.css'
import {Currency} from '@/utils/validate' // 自定义的计算年龄的方法，精确到月，至于精确到天，那种才生下来的娃，一个月不到不太可能中医
import TableOne from './table-one'
import TableTwo from './table-two'
import TableThree from './table-three'
import TableFour from './table-four'
export default {
  components: {
    TableOne,
    TableTwo,
    TableThree,
    TableFour
  },
  // Error in callback for watcher "$route": "TypeError: Cannot read property 'id' of undefined"
  // 报错不要怕，因为没有创建路由页面的对应菜单造成的，无关紧要
  watch: {
    'cutOut': function (newval, oldval) {
      if (newval === true) {
        this.chenxiHeight = 0
        setTimeout(() => {
          let youHeight = getComputedStyle(document.getElementsByClassName('el-main')[0]).height
          let zuoHeight = getComputedStyle(document.getElementById('leftHeightPatient')).height
          this.chenxiHeight = parseInt(youHeight) - parseInt(zuoHeight)
        }, 450)
      } else {
        setTimeout(() => {
          let youHeight = getComputedStyle(document.getElementsByClassName('el-main')[0]).height
          let zuoHeight = getComputedStyle(document.getElementById('leftHeightPatient')).height
          this.chenxiHeight = parseInt(youHeight) - parseInt(zuoHeight)
        }, 450)
      }
    },
    'dataForm.SpellName': function (val, oldval) { // 只有清空SpellName，激活了的字母按钮都要清空样式
      if (val === '') {
        this.litterArr.forEach(item => {
          item.isActive = false
        })
      }
      this.getStoreCategorytypeStock()
    }
  },
  data () {
    return {
      cutOut: true, // 收起，显示
      litterArr: [
        {content: 'A', isActive: false}, {content: 'N', isActive: false},
        {content: 'B', isActive: false}, {content: 'O', isActive: false},
        {content: 'C', isActive: false}, {content: 'P', isActive: false},
        {content: 'D', isActive: false}, {content: 'Q', isActive: false},
        {content: 'E', isActive: false}, {content: 'R', isActive: false},
        {content: 'F', isActive: false}, {content: 'S', isActive: false},
        {content: 'G', isActive: false}, {content: 'T', isActive: false},
        {content: 'H', isActive: false}, {content: 'U', isActive: false},
        {content: 'I', isActive: false}, {content: 'V', isActive: false},
        {content: 'J', isActive: false}, {content: 'W', isActive: false},
        {content: 'K', isActive: false}, {content: 'X', isActive: false},
        {content: 'L', isActive: false}, {content: 'Y', isActive: false},
        {content: 'M', isActive: false}, {content: 'Z', isActive: false}],
      drugsCategoryArr: [], // 先请求药品种类
      oldTabsName: '1001',
      activeName: '1001',
      dataList: [],
      leftTable: 'TableOne', // 左侧表格 组件的引用名切换哟，这的值决定
      leftTableData: [], // 左侧表格的数据
      rightUl: '', // 右侧列表
      rightUlData: [], // 右侧列表的数据

      dataListLoading: false, // 加载
      chenxiHeight: 390, // 这个是测试出来的固定值，用于第一次初始化页面吧，如果以后页面的格式需要调整，可以测试一个初始值来填在这就行了
      pageIndex: 1,
      pageSize: 30, // 50 标准
      totalPage: 1,
      dataForm: {
        SpellName: '',
        agreementRecipelId: '', // 协定方id

        // StoreId: '', // 门店
        AccountId: '', // 医生

        MainCure: '', // 主治
        Effect: '', // 功效
        Explain: '', // 说明
        PrescriptionName: '', // 处方名
        DrugRate: '', // 用法
        OrderType: '40' // 创建协定方
      },
      dataRule: {
        UserName: Currency('此为必填项'),
        DrugRate: Currency('此为必填项')
      },
      visible: false,
      openType: 'add' // add see edit
    }
  },
  mounted () {
    var youHeight = getComputedStyle(document.getElementsByClassName('el-main')[0]).height
    var zuoHeight = getComputedStyle(document.getElementById('leftHeightPatient')).height
    this.chenxiHeight = parseInt(youHeight) - parseInt(zuoHeight)
  },
  methods: {
    // 通用封装的门店子组件绑定的父组件的返回方法（开方页面的上层已提前决定了门店，这儿还能改变门店吗？？？？？？？？？？？？？？？？？？？）
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      // if (isMultiple === false) { this.dataForm.StoreId = choseStoreId }
    },
    handleClose () {
      this.visible = false
      this.dataForm = {
        SpellName: '',
        agreementRecipelId: '', // 协定方id
        AccountId: '', // 医生
        MainCure: '', // 主治
        Effect: '', // 功效
        Explain: '', // 说明
        PrescriptionName: '', // 处方名
        DrugRate: '', // 用法
        OrderType: '40' // 创建协定方
      }
      this.leftTableData = []
      this.oldTabsName = '1001'
      this.activeName = '1001'
    },
    pageInit (agreementRecipelId, type, AccountId) { // type 'add see edit'
      this.visible = true
      this.dataListLoading = true
      this.openType = type
      this.dataForm.AccountId = AccountId

      // 先请求药品种类提供给下拉列表
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          this.drugsCategoryArr = result.data.filter((item, ind) => {
            return ind > 0
          })
        }
      })

      if (agreementRecipelId) { // 查看、和 编辑 都需要初始化
        this.dataForm.agreementRecipelId = agreementRecipelId
        API.register.getRegisterInfo({id: this.dataForm.agreementRecipelId}).then(result => {
          if (result.code === '0000') {
            console.log(result.data)
            this.dataForm.SpellName = ''
            this.dataForm.agreementRecipelId = result.data.Id // 协定方id
            // StoreId: '' // 门店
            // this.dataForm.AccountId = result.data.AccountId // 医生
            this.dataForm.MainCure = result.data.MainCure // 主治
            this.dataForm.Effect = result.data.Effect // 功效
            this.dataForm.Explain = result.data.Explain // 说明
            this.dataForm.PrescriptionName = result.data.PrescriptionName // 处方名
            this.dataForm.DrugRate = result.data.DrugRate // 用法
          }
          // 左边table 字段转换下
          this.leftTableData = result.data.SaleOrderItems.map(item => {
            item.CategoryName = item.CategoryName.substring(4)
            item.Id = item.ProductId // 这个字段为什么要转换，可能看起来很懵逼，就是后端的接口一会那个字段一会这个字段搞出来的，如果不转化一下，编辑提交的情况下有bug
            item.myNum = item.Quantity
            item.ShowName = item.ProductName
            item.Code = item.ProductCode
            return item
          })

          this.getStoreCategorytypeStock()

          // 根据协定方的药态，控制右边药态的初始选中值
          this.oldTabsName = String(result.data.SaleOrderItems[0].CategoryId)
          this.activeName = String(result.data.SaleOrderItems[0].CategoryId)
          // console.log(this.dataForm.agreementRecipelId)
          // console.log(this.leftTableData)
        })
      } else {
        // 后初始化页面的右上角：
        this.getStoreCategorytypeStock() // 这往上的代码都必须执行，不能写在下面的代码的后面，以免被return false影响
      }

      // 如果是直接开方，传递的电话就是0了，还请求屁的患者信息，因为请求结果肯定是[]没有的
      // if (this.$route.query.MobilePhone === '0') {
      //   return false
      // }
      this.dataListLoading = false
    },

    // 右侧‘添加’药材的小模块：获取 对应门店 对应药态下的 对应药材库
    getStoreCategorytypeStock () {
      API.drugs.getDrugsList({
        Name: '',
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsPaging: true,
        SpellName: this.dataForm.SpellName,
        CategoryId: this.activeName, // 被激活的tabs标签页的药材大方向的种类的类型id 1001
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 传不传门店id决定了是否返回库存余量!!!（另外这儿可以能有点问题要处理，因为可能是药房的账号进来，那这样的话如果药房的权限大于医生，那门店库存也更正变大了，这是个要考虑的地方）
        CodeOrBarCode: '' // 暂无
      }).then(result => {
        if (result.code === '0000' && result.data.length > 0) {
          this.dataList = result.data // 这个dataList有啥子用哟？好像没用起来
          this.rightUlData = result.data
          this.totalPage = result.total
        } else {
          this.dataList = []
          this.rightUlData = []
          this.totalPage = 0
          this.$message({ message: `${result.message}`, type: 'warning', duration: 3000 })
        }
        // this.dataListLoading = false
      })
    },

    // 1.当点击右侧药材列表的‘添加’按钮的时候
    addDrugs (row) {
      console.log(row)
      if (this.leftTableData.some(item => item.Code === row.Code)) {
        // this.$alert(`[${row.ShowName}] 已添加！`, '提示', {
        this.$alert(`<b style="color: #409EFF;font-size: 14px;font-weight: 500">[${row.ShowName}]</b> 已添加！`, '提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          closeOnClickModal: true,
          closeOnPressEscape: true
        })
        return false
      }
      row.myNum = 1 // 让后端加字段要改所有的类型的，这自己加，就没这种问题了myNum
      this.leftTableData.push(row)
    },
    // 2.当点击左边table的‘删除’按钮的时候
    delDrugs (row) {
      console.log(this.leftTableData, row)
      this.leftTableData.forEach((item, i) => {
        if (item.Code === row.Code) {
          this.leftTableData.splice(i, 1)
          return false
        }
      })
    },
    // 3.改变myNum
    consoleTable () {
      this.leftTableData.push() // 这个可能会非常懵逼，目的是每次改变任何的myNum的值都会重新渲染左边的table，把push()拿掉就能找到问题在哪，这就是这个push()没任何实际参数但还是要写一个在这的原因
    },

    handleClick (tab, event) {
      if (this.leftTableData.length === 0) { // 没开任何药材时直接切换直接加载呗，都没药材记录还提示啥子嘛
        switch (tab.name) {
          case '1001':
            this.leftTable = 'TableOne'
            this.rightUl = 'ul-one'
            break
          case '1002':
            this.leftTable = 'TableTwo'
            this.rightUl = 'ul-one'
            break
          case '1003':
            this.leftTable = 'TableThree'
            this.rightUl = 'ul-one'
            break
          case '1004':
            this.leftTable = 'TableFour'
            this.rightUl = 'ul-one'
            break
        }
        this.oldTabsName = this.activeName
        this.getStoreCategorytypeStock()
      } else { // 有的时候提示是否确定切换tabs
        this.$confirm('切换药品将清空已经加入的药品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          switch (tab.name) {
            case '1001':
              this.leftTable = 'TableOne'
              this.rightUl = 'ul-one'
              break
            case '1002':
              this.leftTable = 'TableTwo'
              this.rightUl = 'ul-one'
              break
            case '1003':
              this.leftTable = 'TableThree'
              this.rightUl = 'ul-one'
              break
            case '1004':
              this.leftTable = 'TableFour'
              this.rightUl = 'ul-one'
              break
          }
          this.oldTabsName = this.activeName
          this.getStoreCategorytypeStock()
          this.leftTableData = [] // 不只切换，还需要清空左边table信息
        }).catch(() => {
          this.activeName = this.oldTabsName // 依靠oldTabsName切回上一步，table、ul、和tableData都不需要变了，就是取消切换药态的操作
        })
      }
    },
    // A B C D...字母按钮
    activeLitter (txt, ind) {
      this.dataForm.SpellName = txt
      this.litterArr.forEach((item, indx) => {
        if (indx === ind) {
          this.litterArr[indx].isActive = true
        } else {
          this.litterArr[indx].isActive = false
        }
      })
    },

    // 每页数 (右侧的药材添加列表可以有分页哈，是指的那个)
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getStoreCategorytypeStock()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getStoreCategorytypeStock()
    },
    // 开方提交
    send () {
      // 你不是医生，无权创建协定方？？？？？？？？？？？？？？？需要限制吗，通过，vuex里的状态来判断

      if (this.leftTableData.length === 0) {
        this.$alert(`处方为空不能提交！`, '提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          closeOnClickModal: true,
          closeOnPressEscape: true
        })
        return false
      }
      console.log(this.leftTableData)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 编辑协定方，调用旧的正常开方里编辑挂号信息的接口，是另一个接口，编辑挂号信息
          var paramsEdit = {
            id: this.dataForm.agreementRecipelId, // 协定方id，查看和编辑时候都有（不过这儿只可能是编辑提交）
            // StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店
            // AccountId: this.dataForm.AccountId, // 医生id
            // OrderType: '40', // 创建协定方

            MainCure: this.dataForm.MainCure, // 主治
            Effect: this.dataForm.Effect, // 功效
            Explain: this.dataForm.Explain, // 说明
            PrescriptionName: this.dataForm.PrescriptionName, // 处方名
            DrugRate: this.dataForm.DrugRate, // 用法
            ItemsJson: JSON.stringify(this.leftTableData.map(item => {
              var obj = {
                ProductId: item.Id,
                ProductCode: item.Code,
                ProductName: item.ShowName,
                CostPrice: item.CostPrice,
                SalePrice: item.SalePrice,
                RealPrice: item.SalePrice,
                Quantity: item.myNum,
                SupplierId: 0,
                SupplierCode: 0 // 库存的药材不是合并了的嘛，哪还能确定供应商啊
              }
              return obj
            }))
          }

          // 创建协定方，调用旧的创建挂号单的接口
          var paramsCreate = {
            StoreId: this.$store.getters.getAccountCurrentHandleStore, // 门店
            AccountId: this.dataForm.AccountId, // 医生id
            OrderType: '40', // 创建协定方

            MainCure: this.dataForm.MainCure, // 主治
            Effect: this.dataForm.Effect, // 功效
            Explain: this.dataForm.Explain, // 说明
            PrescriptionName: this.dataForm.PrescriptionName, // 处方名
            DrugRate: this.dataForm.DrugRate, // 用法
            ItemsJson: JSON.stringify(this.leftTableData.map(item => {
              var obj = {
                ProductId: item.Id,
                ProductCode: item.Code,
                ProductName: item.ShowName,
                CostPrice: item.CostPrice,
                SalePrice: item.SalePrice,
                RealPrice: item.SalePrice,
                Quantity: item.myNum,
                SupplierId: 0,
                SupplierCode: 0 // 库存的药材不是合并了的嘛，哪还能确定供应商啊
              }
              return obj
            }))
          }
          console.log(paramsEdit) // 编辑协定方后 = 挂号编辑提交
          console.log(paramsCreate) // 创建协定方后 = 挂号创建提交
          var tick = this.openType === 'add' ? API.register.registerSubmit(paramsCreate) : API.register.sendRecipelToEdit(paramsEdit)
          tick.then((data) => {
            if (data.code === '0000') {
              this.$message({
                message: `${'成功'}`,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
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
.doctor-recipel /deep/ {
  background-color: #fff;
  margin: 0 10px;
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 9px;
  }
  .el-main {position: relative;}
  .el-main::-webkit-scrollbar { width: 0px; }

  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar, .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar, .ownScrollbar::-webkit-scrollbar {
    width: 7px;
    /*z-index: -1;*/
  }
  .ownScrollbar:hover::-webkit-scrollbar {
    /*display: block;*/
  }
  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-thumb, .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar-thumb, .ownScrollbar::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    background-color: #eee;
  }
  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-track, .el-table__body-wrapper.is-scrolling-left::-webkit-scrollbar-track, .ownScrollbar::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: inset 0 0 5px rgba(0,0,0,0);
    background-color: rgba(0,0,0,0);
  }

  /*rightUlStyle 容器div*/
  .rightUlStyle {
    position: relative;
    width: 80%;
    min-width: 190px;
    ul {
      width: 100%;
      min-height: 480px; // 拿尺子对着电脑屏幕量过，就这个值吧
      max-height: 480px;
      overflow-y: scroll;
      background-color: #fff;
      box-shadow: 0 0 10px 1px #f1f2f7 inset;
      li {
        min-width: 180px;
        height: 30px;
        line-height: 30px;
        padding-left: 5px;
        font-weight: 600;
        font-size: 15px;
      }
    }
    ol {
      position: absolute;
      top: 0;
      right: -56px;
      color: #050505;
      font-size: 14px;
      font-weight: 700;
      width: 51px;
      text-align: center;
      border-left: 1px solid #dedede;
      border-top: 1px solid #dedede;
      li {
        float: left;
        width: 25px;
        height: 25px;
        line-height: 25px;
        cursor: pointer;
        border-right: 1px solid #dedede;
        border-bottom: 1px solid #dedede;
        &.isActive {
          background-color: #409EFF;
          color: #fff;
        }
      }
    }
  }
  .rightPageCounterContainer {
    text-align: center;
    .rightPageCounter {
      display: inline-block;
    }
  }
  .el-pagination.el-pagination--small {padding: 0 5px}
}
/*以下样式cx重写的，改变form中内部控件的行间距等默认22px太高*/
.doctor-recipel /deep/ {
  .el-form-item {
    margin-bottom: 7px;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  /*表头高重写35高*/
  .el-table--medium th, .el-table--medium td, & .el-table th, & .el-table td,
  .el-table--medium th, .el-table--medium td, & .el-table th, & .el-table td {
    padding: 0 !important;
  }
  /*& /deep/ .el-tabs__content {background-color: #F0F0F0}*/
  .purchaseListRow {
    color: #606266;
    td {padding: 0;}
    td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
  /*cutOut剪纸show切换动画*/
  .v-enter, .v-leave-to {opacity: 0}
  .v-enter-active, .v-leave-active {transition: all 0.4s ease}
  .v-enter-to, .v-leave {opacity: 1}
}
</style>
