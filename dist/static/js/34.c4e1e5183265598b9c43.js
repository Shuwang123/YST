webpackJsonp([34],{LaY8:function(e,t){},y2bt:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("gyMJ"),i=a("itqE"),r=(a("NYxO"),a("E4LH")),o={components:{SecondTabAddOrUpdate:i.default},name:"stockFirst",props:["fatherDataForm"],data:function(){return{chenxiHeight:document.documentElement.clientHeight-303,addOrUpdateVisible:!1,dataListLoading:!1,pageIndex:1,pageSize:17,IsPaging:!0,value6:[],dataForm:{BillCode:"",BillType:"",StartDate:"",EndDate:""},dataList:[],totalPage:1}},mounted:function(){var e=this;window.onresize=function(){e.chenxiHeight=document.documentElement.clientHeight-303}},methods:{getDataList:function(){var e=this;this.dataListLoading=!0;var t={PageIndex:this.pageIndex,PageSize:this.pageSize,IsPaging:this.IsPaging,StoreId:this.$store.getters.getAccountCurrentHandleStore,AccountId:this.fatherDataForm.AccountId,Code:"",UserName:this.fatherDataForm.patientName,MobilePhone:this.fatherDataForm.MobilePhone,WrokFrom:this.fatherDataForm.StartDate,WrokTo:this.fatherDataForm.EndDate,Status:"5",OrderType:"1"};n.a.register.getRegisterList(t).then(function(t){"0000"===t.code?(e.dataList=t.data.map(function(e){return e.BirthDate=Object(r.f)(e.BirthDate),e}),e.totalPage=t.total):e.$message.error(t.message),e.dataListLoading=!1})},getDataListChild:function(){this.getDataList()},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},addOrUpdateHandle:function(e){var t=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){t.$refs.addOrUpdate.init(e)})},handelDelete:function(e){this.$confirm("确定对[id="+e+"]的行导出excel表格吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){})},comfireDispensing:function(e){var t=this;this.$confirm("确定出库吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){n.a.register.saleOrderSubmit({saleOrderCode:e}).then(function(e){"0000"===e.code?t.getDataList():t.$message.error(e.message)})})}}},s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"storeStock-first-tab"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{height:e.chenxiHeight,data:e.dataList,border:"",stripe:"","row-class-name":"storeStockListRow","header-cell-style":e.$cxObj.tableHeaderStyle40px}},[a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"门店 / 医生","min-width":"114","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.StoreName)+" / "+e._s(t.row.DoctorName))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"UserCode","header-align":"center",align:"center",label:"病历号","min-width":"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Code","header-align":"center",align:"center",label:"挂号单","min-width":"100"}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"挂号患者","min-width":"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.UserName)+" / "+e._s(t.row.SexName)+" / "+e._s(t.row.BirthDate))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"MobilePhone","header-align":"center",align:"center",label:"手机","min-width":"110"}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"时间","min-width":"119"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("myDateFilter")(t.row.CreatedOnTime,"MM-dd hh:mm:ss")))])]}}])}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"left",label:"总金额","min-width":"147"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v("￥ "+e._s(t.row.RegisterAmount)+" / "+e._s(t.row.ConsultationAmount)+" / "+e._s(t.row.OrderAmount))])]}}])}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:"center",label:"收费状态","min-width":"260","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.DiagnosisTypeName)+" / "+e._s(t.row.RegisterStatusName?t.row.RegisterStatusName:"")+" / "+e._s(t.row.RegisterOrderStatusName))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"操作",width:"150","header-align":"center",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){e.addOrUpdateHandle(t.row.Id)}}},[e._v("查看")]),e._v(" "),a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(a){e.comfireDispensing(t.row.Code)}}},[e._v("点击出库")])]}}])})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,17,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"prev, pager, next, jumper, sizes, total",background:""},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("second-tab-add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataListChild}}):e._e()],1)},staticRenderFns:[]};var l=a("VU/8")(o,s,!1,function(e){a("LaY8")},"data-v-589c6cee",null);t.default=l.exports}});
//# sourceMappingURL=34.c4e1e5183265598b9c43.js.map