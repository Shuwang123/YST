webpackJsonp([26],{FAgW:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("gyMJ"),i=(a("NYxO"),{name:"drugs",data:function(){return{chenxiHeight:document.documentElement.clientHeight-273,drugsCategoryList:[],storePayInfoVisible:!1,addOrUpdateVisible:!1,dataListLoading:!1,pageSize:18,pageIndex:1,totalPage:1,dataForm:{drugsName:"",drugsSpell:"",CategoryId:""},dataList:[],dataListSelections:[]}},components:{FirstTabAddOrUpdate:a("osy7").default},created:function(){this.getDrugsCategory()},mounted:function(){var e=this;this.getDataList(),window.onresize=function(){e.chenxiHeight=document.documentElement.clientHeight-273}},methods:{selectionChangeHandle:function(e){this.dataListSelections=e},getDrugsCategory:function(){var e=this;n.a.drugs.getDrugsCategory().then(function(t){"0000"===t.code&&(e.drugsCategoryList=t.data)})},getDataList:function(){var e=this,t={name:this.dataForm.drugsName,SpellName:this.dataForm.drugsSpell,PageIndex:this.pageIndex,PageSize:this.pageSize,IsPaging:!0,CategoryId:this.dataForm.CategoryId};this.dataListLoading=!0,n.a.drugs.getDrugsList(t).then(function(t){"0000"===t.code?(e.dataList=t.data,e.totalPage=t.total):e.$message.error(t.message),e.dataListLoading=!1})},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},addOrUpdateHandle:function(e){var t=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){t.$refs.addOrUpdate.init(e)})},handelShelfOff:function(e){var t=this,a=e?[e]:this.dataListSelections.map(function(e){return e.Id}),i={ids:a.join()};this.$confirm("确定对[ids="+a.join()+"]进行["+(void 0===e?"批量下架":"下架")+"]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){n.a.drugs.drugsOff(i).then(function(e){"0000"===e.code?t.$message({type:"success",message:"下架成功!",duration:1e3,onClose:function(){t.getDataList()}}):t.$message.error(e.message)})})},handelShelfOn:function(e){var t=this,a=e?[e]:this.dataListSelections.map(function(e){return e.Id}),i={ids:a.join()};this.$confirm("确定对[ids="+a.join()+"]进行["+(void 0===e?"批量上架":"上架")+"]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){n.a.drugs.drugsOn(i).then(function(e){"0000"===e.code?t.$message({type:"success",message:"上架成功!",duration:1e3,onClose:function(){t.getDataList()}}):t.$message.error(e.message)})})},ownTableRowClassName:function(e){var t=e.row,a=e.rowIndex;return a>=0&&1===t.WebStatus?"on-row":a>=0&&2===t.WebStatus?"off-row":""},ownColumnStyle:function(e){var t=e.row,a=(e.column,e.rowIndex,e.columnIndex);if(5===a||4===a||12===a){if(1===t.WebStatus)return"highlightColumn";if(2===t.WebStatus)return"dimColumn"}}}}),o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"first-tab"},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.getDataList()}}},[a("el-form-item",[a("el-input",{staticStyle:{width:"150px"},attrs:{placeholder:"药名",clearable:""},model:{value:e.dataForm.drugsName,callback:function(t){e.$set(e.dataForm,"drugsName",t)},expression:"dataForm.drugsName"}})],1),e._v(" "),a("el-form-item",[a("el-input",{staticStyle:{width:"150px"},attrs:{placeholder:"拼音",clearable:""},model:{value:e.dataForm.drugsSpell,callback:function(t){e.$set(e.dataForm,"drugsSpell",t)},expression:"dataForm.drugsSpell"}})],1),e._v(" "),a("el-form-item",[a("el-select",{staticStyle:{width:"110px"},attrs:{placeholder:"药品种类",clearable:""},model:{value:e.dataForm.CategoryId,callback:function(t){e.$set(e.dataForm,"CategoryId",t)},expression:"dataForm.CategoryId"}},e._l(e.drugsCategoryList,function(e){return a("el-option",{key:e.id,attrs:{label:e.text,value:e.id}})}))],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{icon:"el-icon-search"},on:{click:function(t){e.getDataList()}}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:function(t){e.addOrUpdateHandle()}}},[e._v("新建药品")]),e._v(" "),a("el-button",{attrs:{type:"danger",disabled:this.dataListSelections.length<=0},on:{click:function(t){e.handelShelfOff()}}},[e._v("批量下架")]),e._v(" "),a("el-button",{attrs:{type:"success",disabled:this.dataListSelections.length<=0},on:{click:function(t){e.handelShelfOn()}}},[e._v("批量上架")])],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticClass:"ownScrollbar",staticStyle:{width:"100%"},attrs:{height:e.chenxiHeight,data:e.dataList,border:"",stripe:"","row-class-name":e.ownTableRowClassName,"header-cell-style":e.$cxObj.tableHeaderStyle40px,"cell-class-name":e.ownColumnStyle},on:{"selection-change":e.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection",align:"center",width:"50"}}),e._v(" "),a("el-table-column",{attrs:{type:"index",label:"排序",align:"center",width:"50"}}),e._v(" "),a("el-table-column",{attrs:{prop:"CategoryName","header-align":"center",align:"left",label:"种类",width:"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"Code","header-align":"center",align:"center",label:"编码",width:"85","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"right",align:"right",label:"药典",width:"70","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticStyle:{"text-decoration":"underline"}},[e._v(e._s(t.row.Name))])]}}])}),e._v(" "),a("el-table-column",{attrs:{"header-align":"left",align:"left",label:"库存",width:"70","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticStyle:{"text-decoration":"underline"}},[e._v(e._s(t.row.ShowName))])]}}])}),e._v(" "),a("el-table-column",{attrs:{"header-align":"left",align:"left",label:"拼音/别名","min-width":"100","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{},[e._v("["+e._s(t.row.SpellName)+"] "+e._s(t.row.Keywords))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"Unit","header-align":"center",align:"center",label:"单位","min-width":"50","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"Specification","header-align":"center",align:"center",label:"规格",width:"","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"零售价","min-width":"70","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{},[e._v(e._s(t.row.SalePrice.toFixed(2)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"RedLine","header-align":"center",align:"center",label:"预警量","min-width":"80","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"WebStatusName","header-align":"center",align:"center",label:"状态","min-width":"70","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"操作",width:"150","header-align":"center",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticStyle:{"padding-right":"12px","border-right":"1px solid #ccc",cursor:"pointer"}},[a("span",{attrs:{type:"text"},on:{click:function(a){e.addOrUpdateHandle(t.row.Id)}}},[e._v("编辑")])]),e._v(" "),a("span",{staticStyle:{"padding-left":"6px",cursor:"pointer"}},[1===t.row.WebStatus?a("span",{attrs:{type:"text"},on:{click:function(a){e.handelShelfOff(t.row.Id)}}},[e._v("下架")]):2===t.row.WebStatus?a("span",{on:{click:function(a){e.handelShelfOn(t.row.Id)}}},[e._v("上架")]):e._e()])]}}])})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,18,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"prev, pager, next, jumper, sizes, total",background:""},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("first-tab-add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataList}}):e._e()],1)},staticRenderFns:[]};var l=a("VU/8")(i,o,!1,function(e){a("QDz5")},"data-v-e33d9f00",null);t.default=l.exports},QDz5:function(e,t){}});
//# sourceMappingURL=26.9b65efc21053c7787ba0.js.map