webpackJsonp([30],{ONWY:function(e,t){},vwiP:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("gyMJ"),n=a("+R1d"),i=(a("NYxO"),{name:"stockFirst",components:{FirstTabAddOrUpdate:n.default},props:["fatherDataForm"],data:function(){return{chenxiHeight:document.documentElement.clientHeight-303,addOrUpdateVisible:!1,dataListLoading:!1,pageIndex:1,pageSize:20,IsPaging:!0,dataForm:{CategoryId:"",RedLine:"",BrandId:"",Order:""},orderArr:[{text:"库存减预警（小到大）",val:"LeftRedLineAsc"},{text:"库存减预警（大到小）",val:"LeftRedLineDesc"}],dataList:[],totalPage:1,dataListSelections:[],categoryTypeArr:[]}},mounted:function(){var e=this;window.onresize=function(){e.chenxiHeight=document.documentElement.clientHeight-303}},methods:{selectionChangeHandle:function(e){this.dataListSelections=e},getDataList:function(){var e=this;this.dataListLoading=!0;var t={PageIndex:this.pageIndex,PageSize:this.pageSize,IsPaging:this.IsPaging,StoreId:this.fatherDataForm.StoreId,ProductCodeOrBarCode:this.fatherDataForm.ProductCodeOrBarCode,ProductName:this.fatherDataForm.ProductName,SpellName:this.fatherDataForm.SpellName,RedLine:this.dataForm.RedLine,BrandId:this.dataForm.BrandId,CategoryId:this.dataForm.CategoryId,Order:this.dataForm.Order};r.a.storeStock.getStoreStock(t).then(function(t){"0000"===t.code&&(e.dataList=t.data.map(function(e){return e.RedLine=Number(e.RedLine),e}),e.totalPage=t.total,r.a.drugs.getDrugsCategory().then(function(t){"0000"===t.code&&(e.categoryTypeArr=t.data.map(function(e){return{text:e.text,value:e.text,id:e.id}}).filter(function(e){return e.id>10}),e.dataListLoading=!1)}))})},tableColumnFilter:function(e){var t=this;void 0===e.CategoryId[0]?this.dataForm.CategoryId="":this.categoryTypeArr.forEach(function(a){a.value===e.CategoryId[0]&&(t.dataForm.CategoryId=a.id)}),this.getDataList()},anyCellDblclick:function(e,t,a,r){if("门店售价"!==t.label)return!1;this.dataList.forEach(function(t){t.ProductCode===e.ProductCode&&(t.isDblclick=!0)}),this.dataList.push()},tableInputBlur:function(e){var t=this;this.$set(e,"isDblclick",!1),this.dataList.push(),r.a.storeStock.editStoreStockSalePrice({id:e.Id,storeSalePrice:e.StoreSalePrice}).then(function(e){"0000"===e.code&&t.$message({type:"success",message:"操作成功",duration:3e3})})},getDataListChild:function(){this.getDataList()},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},addOrUpdateHandle:function(e){var t=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){t.$refs.addOrUpdate.init(e)})},handleCurrentChange:function(e){}}}),o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"storeStock-first-tab"},[a("div",{staticStyle:{"background-color":"#F5F7FA","margin-bottom":"-15px","border-radius":"0 0 0 0",padding:"1px 3px"}},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.getDataList()}}},[a("el-form-item",{attrs:{label:""}},[a("el-select",{staticStyle:{width:"120px"},attrs:{placeholder:"排序",size:"mini",clearable:""},on:{change:function(t){e.getDataList()}},model:{value:e.dataForm.Order,callback:function(t){e.$set(e.dataForm,"Order",t)},expression:"dataForm.Order"}},e._l(e.orderArr,function(e){return a("el-option",{key:e.text,attrs:{label:e.text,value:e.val}})}))],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{icon:"el-icon-search",size:"mini"},on:{click:function(t){e.pageIndex=1,e.getDataList()}}},[e._v("查询")])],1)],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{height:e.chenxiHeight,data:e.dataList,border:"","highlight-current-row":"","header-cell-style":e.$cxObj.tableHeaderStyle40px},on:{"selection-change":e.selectionChangeHandle,"current-change":e.handleCurrentChange,"filter-change":e.tableColumnFilter,"cell-dblclick":e.anyCellDblclick}},[a("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-form",{staticClass:"demo-table-expand",attrs:{"label-position":"left",inline:""}},[a("el-form-item",{attrs:{label:"门店："}},[a("span",[e._v(e._s(t.row.StoreName))])]),e._v(" "),a("el-form-item",{attrs:{label:"药品编码："}},[a("span",[e._v(e._s(t.row.ProductCode))])]),e._v(" "),a("el-form-item",{attrs:{label:"药名："}},[a("span",[e._v(e._s(t.row.ProductName))])]),e._v(" "),a("el-form-item",{attrs:{label:"余量："}},[a("span",[e._v(e._s(t.row.Quantity))])]),e._v(" "),a("el-form-item",{attrs:{label:"单价："}},[a("span",[e._v(e._s(t.row.StoreSalePrice))])]),e._v(" "),a("el-form-item",{attrs:{label:"预警值："}},[a("span",[e._v(e._s(t.row.RedLine))])]),e._v(" "),a("el-form-item",{attrs:{label:"药态："}},[a("span",[e._v(e._s(t.row.CategoryName))])])],1)]}}])}),e._v(" "),a("el-table-column",{attrs:{type:"selection",align:"center",width:"50"}}),e._v(" "),a("el-table-column",{attrs:{prop:"StoreName","header-align":"left",align:"left",label:"门店",width:"70","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"CategoryName","header-align":"center",align:"center",label:"药态",width:"70","show-overflow-tooltip":!0,"column-key":"CategoryId",filters:e.categoryTypeArr,"filter-multiple":!1,"filter-placement":"bottom"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ProductCode","header-align":"center",align:"center",label:"药品编码",width:"90"}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"药名","min-width":"80"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{style:{color:t.row.Quantity-t.row.RedLine<=0?"#e4393c":""}},[e._v(e._s(t.row.ProductName))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"OccupyQuantity","header-align":"center",align:"center",label:"锁定","min-width":"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"UsableQuantity","header-align":"center",align:"center",label:"可用","min-width":"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"成本 (avg)",width:"120","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.AvgCostPrice.toFixed(2)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"门店售价","min-width":"139","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[!0===t.row.isDblclick?a("el-input-number",{attrs:{precision:2,min:.1,step:.01,max:1e4,size:"mini"},on:{blur:function(a){e.tableInputBlur(t.row)}},model:{value:t.row.StoreSalePrice,callback:function(a){e.$set(t.row,"StoreSalePrice",a)},expression:"scope.row.StoreSalePrice"}}):a("span",[e._v(e._s(Number(t.row.StoreSalePrice).toFixed(2)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"库存 (余量)",width:"120","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{style:{color:t.row.Quantity-t.row.RedLine<=0?"#e4393c":""}},[e._v(e._s(t.row.Quantity))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"RedLine","header-align":"center",align:"center",label:"预警值",width:"100","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"操作","min-width":"80","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.addOrUpdateHandle(t.row)}}},[e._v("编辑")])]}}])})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"prev, pager, next, jumper, sizes, total",background:""},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("first-tab-add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataListChild}}):e._e()],1)},staticRenderFns:[]};var l=a("VU/8")(i,o,!1,function(e){a("ONWY")},"data-v-ced26e28",null);t.default=l.exports}});
//# sourceMappingURL=30.0c9e97bb7fb00bb53f10.js.map