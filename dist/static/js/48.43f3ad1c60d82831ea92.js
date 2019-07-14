webpackJsonp([48],{Tqlw:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("gyMJ"),o=a("E4LH"),n={props:["purchaseFatherList"],data:function(){return{ownPurchaseFatherList:[],dataListViews:[],visible:!1,dataListLoading:!1,pageIndex:1,pageSize:10,totalPage:0,orderArr:[{text:"库存减预警（小到大）",val:"LeftRedLineAsc"},{text:"库存减预警（大到小）",val:"LeftRedLineDesc"}],categoryId:"",storeId:"",dataRule:{SpellName:Object(o.b)()},drugsCategoryList:[],dataForm:{SpellName:"",Order:""},dataList:[],dataListSelections:[],isInit:!0}},watch:{dataList:function(t,e){var a=this;this.$nextTick(function(){a.ownPurchaseFatherList=a.ownPurchaseFatherList.length>0?a.ownPurchaseFatherList:a.purchaseFatherList,a.dataList.forEach(function(t){a.ownPurchaseFatherList.forEach(function(e){t.Code===e.Code&&a.$refs.tableChild.toggleRowSelection(t,!0)})}),a.isInit=!1})}},methods:{init:function(t,e){this.categoryId=t,this.storeId=e,this.getDataList(this.categoryId,this.storeId)},sizeChangeHandle:function(t){this.pageSize=t,this.isInit=!0,this.getDataList(this.categoryId,this.storeId)},currentChangeHandle:function(t){this.pageIndex=t,this.isInit=!0,this.getDataList(this.categoryId,this.storeId)},drugsSearch:function(){var t=this;this.$refs.dataForm.validate(function(e){e&&(t.isInit=!0,t.getDataList(t.categoryId,t.storeId))})},getDataList:function(t,e){var a=this;this.dataListLoading=!0,i.a.drugs.getDrugsList({Name:"",PageIndex:this.pageIndex,PageSize:this.pageSize,IsPaging:"true",SpellName:this.dataForm.SpellName,CategoryId:t,StoreId:e,CodeOrBarCode:"",Order:this.dataForm.Order}).then(function(t){"0000"===t.code&&t.data.length>0?(a.dataList=t.data,a.totalPage=t.total,0===a.dataListViews.length?a.dataListViews=a.dataListViews.concat(t.data):a.dataListViews.some(function(e){return e.Code===t.data[0].Code||e.Code===t.data[a.pageSize-1]}).Code?a.dataListViews=a.dataListViews.concat([]):a.dataListViews=a.dataListViews.concat(t.data)):(a.dataList=[],a.$message({message:""+t.message,type:"warning",duration:3e3})),a.dataListLoading=!1}),this.visible=!0},selectionChangeHandle:function(t){var e=this;this.dataListSelections=t,!1===this.isInit&&(0!==this.ownPurchaseFatherList.length&&this.dataList.forEach(function(t){e.ownPurchaseFatherList=e.ownPurchaseFatherList.filter(function(e){return e.Code!==t.Code})}),t.forEach(function(t){e.ownPurchaseFatherList.push(t)}))},handleClose:function(){this.ownPurchaseFatherList=[],this.isInit=!0},dataFormSubmit:function(){var t=this;this.$confirm("确定将此次勾选的商品纳入采购列表?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var e=t.ownPurchaseFatherList;0!==e.length&&t.dataListViews.forEach(function(t){e=e.filter(function(e){return e.Code!==t.Code})}),t.ownPurchaseFatherList.forEach(function(t){e.push(t)}),t.$emit("refreshDataList",e),t.visible=!1})}}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mod-purchase-child"},[a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],attrs:{title:"商品导入","close-on-click-modal":!1,width:"970px",visible:t.visible},on:{"update:visible":function(e){t.visible=e},close:t.handleClose}},[a("el-form",{ref:"dataForm",attrs:{model:t.dataForm,rules:t.dataRule,"label-width":"0",inline:!0}},[a("el-form-item",{attrs:{label:"",prop:"SpellName"}},[a("el-input",{attrs:{placeholder:"拼音搜索",size:"mini",clearable:""},on:{clear:function(e){t.drugsSearch()}},model:{value:t.dataForm.SpellName,callback:function(e){t.$set(t.dataForm,"SpellName",e)},expression:"dataForm.SpellName"}})],1),t._v(" "),a("el-form-item",{attrs:{label:""}},[a("el-select",{staticStyle:{width:"120px"},attrs:{placeholder:"排序",clearable:"",size:"mini"},on:{change:function(e){t.drugsSearch()}},model:{value:t.dataForm.Order,callback:function(e){t.$set(t.dataForm,"Order",e)},expression:"dataForm.Order"}},t._l(t.orderArr,function(t){return a("el-option",{key:t.text,attrs:{label:t.text,value:t.val}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:""}},[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(e){t.drugsSearch()}}},[t._v("搜索")])],1),t._v(" "),a("br"),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.dataListLoading,expression:"dataListLoading"}],ref:"tableChild",staticStyle:{width:"100%"},attrs:{data:t.dataList,border:"",stripe:"",height:450,"header-cell-style":t.$cxObj.tableHeaderStyle40px,"row-class-name":"purchaseTableRowClass"},on:{"selection-change":t.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection","header-align":"center",align:t.$store.state.common.align,width:"50"}}),t._v(" "),a("el-table-column",{attrs:{align:t.$store.state.common.align,type:"index",label:"序号",width:"50px"}}),t._v(" "),a("el-table-column",{attrs:{prop:"CategoryName","header-align":"center",align:t.$store.state.common.align,width:"100",label:"药态","show-overflow-tooltip":!0}}),t._v(" "),a("el-table-column",{attrs:{prop:"Code","header-align":"center",align:t.$store.state.common.align,width:"100",label:"商品编码","show-overflow-tooltip":!0}}),t._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:t.$store.state.common.align,label:"药材名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{style:{color:e.row.Quantity<e.row.RedLine?"#e4393c":"#333"}},[t._v(t._s(e.row.ShowName))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"Specification","header-align":"center",align:t.$store.state.common.align,label:"规格","show-overflow-tooltip":!0}}),t._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:t.$store.state.common.align,label:"库存 (余量)","show-overflow-tooltip":!0},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{style:{color:e.row.Quantity<e.row.RedLine?"#e4393c":"#333"}},[t._v(t._s(e.row.Quantity))])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"RedLine","header-align":"center",align:t.$store.state.common.align,label:"预警量","show-overflow-tooltip":!0}})],1),t._v(" "),a("el-pagination",{attrs:{"current-page":t.pageIndex,"page-sizes":[10,20,50,100],"page-size":t.pageSize,total:t.totalPage,layout:"prev, pager, next, jumper, sizes, total"},on:{"size-change":t.sizeChangeHandle,"current-change":t.currentChangeHandle}})],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.visible=!1}}},[t._v("取消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.dataFormSubmit()}}},[t._v("确定")])],1)],1)],1)},staticRenderFns:[]};var r=a("VU/8")(n,s,!1,function(t){a("p+7H")},"data-v-15cbb406",null);e.default=r.exports},"p+7H":function(t,e){}});
//# sourceMappingURL=48.43f3ad1c60d82831ea92.js.map