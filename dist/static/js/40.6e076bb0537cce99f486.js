webpackJsonp([40],{"L+1H":function(e,t){},vwiP:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("gyMJ"),i=a("+R1d"),r=(a("NYxO"),{name:"stockFirst",props:["fatherDataForm"],data:function(){return{chenxiHeight:document.documentElement.clientHeight-303,addOrUpdateVisible:!1,dataListLoading:!1,pageIndex:1,pageSize:17,IsPaging:!0,OrderArr:[{text:"库存从大--\x3e小",val:"Quantity"},{text:"暂用量或可使用量排序",val:"OccupyQuantityUsableQuantity"}],dataForm:{RedLine:"",BrandId:"",Order:""},dataList:[],totalPage:1,dataListSelections:[]}},components:{FirstTabAddOrUpdate:i.default},mounted:function(){var e=this;window.onresize=function(){e.chenxiHeight=document.documentElement.clientHeight-303}},methods:{selectionChangeHandle:function(e){this.dataListSelections=e},getDataList:function(){var e=this;this.dataListLoading=!0;var t={PageIndex:this.pageIndex,PageSize:this.pageSize,IsPaging:this.IsPaging,StoreId:this.fatherDataForm.StoreId,ProductCodeOrBarCode:this.fatherDataForm.ProductCodeOrBarCode,ProductName:this.fatherDataForm.ProductName,SpellName:this.fatherDataForm.SpellName,RedLine:this.dataForm.RedLine,CategoryId:"10"===this.fatherDataForm.CategoryId?"":this.fatherDataForm.CategoryId,BrandId:this.dataForm.BrandId,Order:this.dataForm.Order};n.a.storeStock.getStoreStock(t).then(function(t){"0000"===t.code?(e.dataList=t.data,e.totalPage=t.total):e.$message.error(t.message),e.dataListLoading=!1})},getDataListChild:function(){this.getDataList()},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},handelDelete:function(e){this.$confirm("确定对[id="+e+"]的行导出excel表格吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){})}}}),o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"storeStock-first-tab"},[a("div",{staticStyle:{"background-color":"#F5F7FA","margin-bottom":"-15px","border-radius":"0 0 0 0",padding:"1px 3px"}},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.getDataList()}}},[a("el-form-item",{attrs:{label:""}},[a("el-select",{staticStyle:{width:"120px"},attrs:{placeholder:"排序",size:"mini",clearable:""},model:{value:e.dataForm.Order,callback:function(t){e.$set(e.dataForm,"Order",t)},expression:"dataForm.Order"}},e._l(e.OrderArr,function(e){return a("el-option",{key:e.text,attrs:{label:e.text,value:e.val}})}))],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{icon:"el-icon-search",size:"mini"},on:{click:function(t){e.pageIndex=1,e.getDataList()}}},[e._v("查询")])],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{height:e.chenxiHeight,data:e.dataList,border:"",stripe:"","row-class-name":"storeStockListRow","header-cell-style":e.$cxObj.tableHeaderStyle40px},on:{"selection-change":e.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection",align:"center",width:"50"}}),e._v(" "),a("el-table-column",{attrs:{prop:"StoreName","header-align":"left",align:"left",label:"门店",width:"70","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"CategoryName","header-align":"center",align:"center",label:"药态",width:"70","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"ProductCode","header-align":"center",align:"center",label:"药品编码",width:"90"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ProductName","header-align":"center",align:"center",label:"药名","min-width":"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Quantity","header-align":"center",align:"center",label:"库存 (余量)","min-width":"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"OccupyQuantity","header-align":"center",align:"center",label:"锁定","min-width":"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"UsableQuantity","header-align":"center",align:"center",label:"可用","min-width":"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"成本 (avg)","min-width":"80","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.AvgCostPrice.toFixed(2)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"StoreSalePrice","header-align":"center",align:"center",label:"门店售价","min-width":"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"RedLine","header-align":"center",align:"center",label:"预警值","min-width":"80","show-overflow-tooltip":!0}})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,17,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"prev, pager, next, jumper, sizes, total",background:""},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("first-tab-add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataListChild}}):e._e()],1)},staticRenderFns:[]};var l=a("VU/8")(r,o,!1,function(e){a("L+1H")},"data-v-35748aa9",null);t.default=l.exports}});
//# sourceMappingURL=40.6e076bb0537cce99f486.js.map