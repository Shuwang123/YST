webpackJsonp([27],{"3GXt":function(e,t){},vwiP:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("E4LH"),r=a("gyMJ"),i=a("+R1d"),o=(a("NYxO"),{name:"stockFirst",filters:{formatDate:function(e){var t=new Date(e);return Object(n.f)(t,"yyyy-MM-dd hh:mm")}},props:["fatherDataForm"],data:function(){return{chenxiHeight:document.documentElement.clientHeight-333,addOrUpdateVisible:!1,dataListLoading:!1,pageIndex:1,pageSize:10,IsPaging:!0,dataForm:{RedLine:"",CategoryId:"",BrandId:"",Order:""},dataList:[],totalPage:1,dataListSelections:[]}},components:{FirstTabAddOrUpdate:i.default},created:function(){this.getDataList()},mounted:function(){var e=this;window.onresize=function(){e.chenxiHeight=document.documentElement.clientHeight-333}},methods:{selectionChangeHandle:function(e){this.dataListSelections=e},getDataList:function(){var e=this;this.dataListLoading=!0;var t={PageIndex:this.pageIndex,PageSize:this.pageSize,IsPaging:this.IsPaging,StoreId:this.fatherDataForm.StoreId,ProductCodeOrBarCode:this.fatherDataForm.ProductCodeOrBarCode,ProductName:this.fatherDataForm.ProductName,SpellName:this.fatherDataForm.SpellName,RedLine:this.dataForm.RedLine,CategoryId:this.dataForm.CategoryId,BrandId:this.dataForm.BrandId,Order:this.dataForm.Order};r.a.storeStock.getStoreStock(t).then(function(t){"0000"===t.code?(e.dataList=t.data,e.totalPage=t.total):e.$message.error(t.message),e.dataListLoading=!1})},getDataListChild:function(){this.getDataList()},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},handelDelete:function(e){this.$confirm("确定对[id="+e+"]的行导出excel表格吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){})}}}),l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"storeStock-first-tab"},[a("div",{staticStyle:{"background-color":"#F5F7FA","margin-bottom":"-15px","border-radius":"0 0 0 0",padding:"1px 3px"}},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.getDataList()}}},[a("el-form-item",[a("el-input",{staticStyle:{width:"120px"},attrs:{placeholder:"药品种类",size:"mini",clearable:""},model:{value:e.dataForm.CategoryId,callback:function(t){e.$set(e.dataForm,"CategoryId",t)},expression:"dataForm.CategoryId"}})],1),e._v(" "),a("el-form-item",[a("el-input",{staticStyle:{width:"120px"},attrs:{placeholder:"排序",size:"mini",clearable:""},model:{value:e.dataForm.Order,callback:function(t){e.$set(e.dataForm,"Order",t)},expression:"dataForm.Order"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{icon:"el-icon-search",size:"mini"},on:{click:function(t){e.getDataList()}}},[e._v("查询")])],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{height:e.chenxiHeight,data:e.dataList,border:"",stripe:"","row-class-name":"storeStockListRow","header-cell-style":e.$cxObj.tableHeaderStyle40px},on:{"selection-change":e.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection",align:"center",width:"50"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ProductCode","header-align":"center",align:"center",label:"药品编码",width:"90"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ProductName","header-align":"center",align:"center",label:"药名",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"StoreName","header-align":"left",align:"left",label:"门店",width:"70","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"CategoryName","header-align":"center",align:"center",label:"种类",width:"70","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"Quantity","header-align":"center",align:"center",label:"库存数",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"OccupyQuantity","header-align":"center",align:"center",label:"锁定数",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"UsableQuantity","header-align":"center",align:"center",label:"可用数",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"AvgCostPrice","header-align":"center",align:"center",label:"平均成本",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"Amount","header-align":"center",align:"center",label:"成本总价",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"SalePrice","header-align":"center",align:"center",label:"售价",width:"","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"SaleAmount","header-align":"center",align:"center",label:"售价总价",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"RedLine","header-align":"center",align:"center",label:"警戒线",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"ProfitPercent","header-align":"center",align:"center",label:"毛利",width:"80","show-overflow-tooltip":!0}})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"prev, pager, next, jumper, sizes, total",background:""},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("first-tab-add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataListChild}}):e._e()],1)},staticRenderFns:[]};var d=a("VU/8")(o,l,!1,function(e){a("3GXt")},"data-v-366a6977",null);t.default=d.exports}});
//# sourceMappingURL=27.6ea3486f094183c3c503.js.map