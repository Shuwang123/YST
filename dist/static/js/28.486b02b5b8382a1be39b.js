webpackJsonp([28],{Fjqs:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("E4LH"),n=a("gyMJ"),l=a("+R1d"),o=(a("NYxO"),{name:"stockFirst",filters:{formatDate:function(e){var t=new Date(e);return Object(i.f)(t,"yyyy-MM-dd hh:mm")}},props:["fatherDataForm"],data:function(){return{chenxiHeight:document.documentElement.clientHeight-333,addOrUpdateVisible:!1,dataListLoading:!1,pageIndex:1,pageSize:10,IsPaging:!0,value6:[],dataForm:{BillCode:"",BillType:"",StartDate:"",EndDate:""},dataList:[],totalPage:1,dataListSelections:[]}},watch:{value6:function(){this.value6!==[]&&null!==this.value6?(this.dataForm.StartDate=this.value6[0],this.dataForm.EndDate=this.value6[1]):(this.dataForm.StartDate="",this.dataForm.EndDate="")}},components:{FirstTabAddOrUpdate:l.default},created:function(){this.getDataList()},mounted:function(){var e=this;window.onresize=function(){e.chenxiHeight=document.documentElement.clientHeight-333}},methods:{selectionChangeHandle:function(e){this.dataListSelections=e},getDataList:function(){var e=this;this.dataListLoading=!0;var t={PageIndex:this.pageIndex,PageSize:this.pageSize,IsPaging:this.IsPaging,StoreId:this.fatherDataForm.StoreId,ProductCodeOrBarCode:this.fatherDataForm.ProductCodeOrBarCode,ProductName:this.fatherDataForm.ProductName,BillCode:this.dataForm.BillCode,BillType:this.dataForm.BillType,StartDate:this.dataForm.StartDate,EndDate:this.dataForm.EndDate};n.a.storeStock.getStockHistory(t).then(function(t){"0000"===t.code?(e.dataList=t.data,e.totalPage=t.total):e.$message.error(t.message),e.dataListLoading=!1})},getDataListChild:function(){this.getDataList()},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},handelDelete:function(e){this.$confirm("确定对[id="+e+"]的行导出excel表格吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){})}}}),r={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"storeStock-first-tab"},[a("div",{staticStyle:{"background-color":"#F5F7FA","margin-bottom":"-15px","border-radius":"0 0 0 0",padding:"1px 3px"}},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.getDataList()}}},[a("el-form-item",[a("el-input",{staticStyle:{width:"120px"},attrs:{placeholder:"单据编码",size:"mini",clearable:""},model:{value:e.dataForm.SpellName,callback:function(t){e.$set(e.dataForm,"SpellName",t)},expression:"dataForm.SpellName"}})],1),e._v(" "),a("el-form-item",[a("el-input",{staticStyle:{width:"120px"},attrs:{placeholder:"单据类型",size:"mini",clearable:""},model:{value:e.dataForm.RedLine,callback:function(t){e.$set(e.dataForm,"RedLine",t)},expression:"dataForm.RedLine"}})],1),e._v(" "),a("el-form-item",[a("el-date-picker",{attrs:{size:"mini",type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"yyyy-MM-dd"},model:{value:e.value6,callback:function(t){e.value6=t},expression:"value6"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{icon:"el-icon-search",size:"mini"},on:{click:function(t){e.getDataList()}}},[e._v("查询")])],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{height:e.chenxiHeight,data:e.dataList,border:"",stripe:"","row-class-name":"storeStockListRow","header-cell-style":e.$cxObj.tableHeaderStyle40px},on:{"selection-change":e.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection",align:"center",width:"50"}}),e._v(" "),a("el-table-column",{attrs:{prop:"CreateTime","header-align":"center",align:"center",label:"变动时间",width:"140","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"StoreName","header-align":"left",align:"left",label:"门店",width:"70","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"ProductCode","header-align":"center",align:"center",label:"药品编码",width:"90"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ProductName","header-align":"center",align:"center",label:"药名",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Quantity","header-align":"center",align:"center",label:"改变前",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"ChangeQuantity","header-align":"center",align:"center",label:"改变",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"CurrentQuantity","header-align":"center",align:"center",label:"剩余",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"BillId","header-align":"center",align:"center",label:"账单ID",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"BillTypeName","header-align":"center",align:"center",label:"账单类型",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"BillCode","header-align":"center",align:"center",label:"账单编码",width:"100","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"BatchNo","header-align":"center",align:"center",label:"批次号",width:"","show-overflow-tooltip":!0}})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"prev, pager, next, jumper, sizes, total",background:""},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("first-tab-add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataListChild}}):e._e()],1)},staticRenderFns:[]};var d=a("VU/8")(o,r,!1,function(e){a("y77J")},"data-v-11e4cc2d",null);t.default=d.exports},y77J:function(e,t){}});
//# sourceMappingURL=28.486b02b5b8382a1be39b.js.map