webpackJsonp([19,48],{BsaQ:function(e,t){},Tqlw:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("gyMJ"),r=a("E4LH"),i={props:["purchaseFatherList"],data:function(){return{ownPurchaseFatherList:[],dataListViews:[],visible:!1,dataListLoading:!1,pageIndex:1,pageSize:10,totalPage:0,orderArr:[{text:"库存减预警（小到大）",val:"LeftRedLineAsc"},{text:"库存减预警（大到小）",val:"LeftRedLineDesc"}],categoryId:"",storeId:"",dataRule:{SpellName:Object(r.b)()},drugsCategoryList:[],dataForm:{SpellName:"",Order:""},dataList:[],dataListSelections:[],isInit:!0}},watch:{dataList:function(e,t){var a=this;this.$nextTick(function(){a.ownPurchaseFatherList=a.ownPurchaseFatherList.length>0?a.ownPurchaseFatherList:a.purchaseFatherList,a.dataList.forEach(function(e){a.ownPurchaseFatherList.forEach(function(t){e.Code===t.Code&&a.$refs.tableChild.toggleRowSelection(e,!0)})}),a.isInit=!1})}},methods:{init:function(e,t){this.categoryId=e,this.storeId=t,this.getDataList(this.categoryId,this.storeId)},sizeChangeHandle:function(e){this.pageSize=e,this.isInit=!0,this.getDataList(this.categoryId,this.storeId)},currentChangeHandle:function(e){this.pageIndex=e,this.isInit=!0,this.getDataList(this.categoryId,this.storeId)},drugsSearch:function(){var e=this;this.$refs.dataForm.validate(function(t){t&&(e.isInit=!0,e.getDataList(e.categoryId,e.storeId))})},getDataList:function(e,t){var a=this;this.dataListLoading=!0,o.a.drugs.getDrugsList({Name:"",PageIndex:this.pageIndex,PageSize:this.pageSize,IsPaging:"true",SpellName:this.dataForm.SpellName,CategoryId:e,StoreId:t,CodeOrBarCode:"",Order:this.dataForm.Order}).then(function(e){"0000"===e.code&&e.data.length>0?(a.dataList=e.data,a.totalPage=e.total,0===a.dataListViews.length?a.dataListViews=a.dataListViews.concat(e.data):a.dataListViews.some(function(t){return t.Code===e.data[0].Code||t.Code===e.data[a.pageSize-1]}).Code?a.dataListViews=a.dataListViews.concat([]):a.dataListViews=a.dataListViews.concat(e.data)):(a.dataList=[],a.$message({message:""+e.message,type:"warning",duration:3e3})),a.dataListLoading=!1}),this.visible=!0},selectionChangeHandle:function(e){var t=this;this.dataListSelections=e,!1===this.isInit&&(0!==this.ownPurchaseFatherList.length&&this.dataList.forEach(function(e){t.ownPurchaseFatherList=t.ownPurchaseFatherList.filter(function(t){return t.Code!==e.Code})}),e.forEach(function(e){t.ownPurchaseFatherList.push(e)}))},handleClose:function(){this.ownPurchaseFatherList=[],this.isInit=!0},dataFormSubmit:function(){var e=this;this.$confirm("确定将此次勾选的商品纳入采购列表?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var t=e.ownPurchaseFatherList;0!==t.length&&e.dataListViews.forEach(function(e){t=t.filter(function(t){return t.Code!==e.Code})}),e.ownPurchaseFatherList.forEach(function(e){t.push(e)}),e.$emit("refreshDataList",t),e.visible=!1})}}},s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"mod-purchase-child"},[a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],attrs:{title:"商品导入","close-on-click-modal":!1,width:"970px",visible:e.visible},on:{"update:visible":function(t){e.visible=t},close:e.handleClose}},[a("el-form",{ref:"dataForm",attrs:{model:e.dataForm,rules:e.dataRule,"label-width":"0",inline:!0}},[a("el-form-item",{attrs:{label:"",prop:"SpellName"}},[a("el-input",{attrs:{placeholder:"拼音搜索",size:"mini",clearable:""},on:{clear:function(t){e.drugsSearch()}},model:{value:e.dataForm.SpellName,callback:function(t){e.$set(e.dataForm,"SpellName",t)},expression:"dataForm.SpellName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:""}},[a("el-select",{staticStyle:{width:"120px"},attrs:{placeholder:"排序",clearable:"",size:"mini"},on:{change:function(t){e.drugsSearch()}},model:{value:e.dataForm.Order,callback:function(t){e.$set(e.dataForm,"Order",t)},expression:"dataForm.Order"}},e._l(e.orderArr,function(e){return a("el-option",{key:e.text,attrs:{label:e.text,value:e.val}})}))],1),e._v(" "),a("el-form-item",{attrs:{label:""}},[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(t){e.drugsSearch()}}},[e._v("搜索")])],1),e._v(" "),a("br"),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],ref:"tableChild",staticStyle:{width:"100%"},attrs:{data:e.dataList,border:"",stripe:"",height:450,"header-cell-style":e.$cxObj.tableHeaderStyle40px,"row-class-name":"purchaseTableRowClass"},on:{"selection-change":e.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection","header-align":"center",align:e.$store.state.common.align,width:"50"}}),e._v(" "),a("el-table-column",{attrs:{align:e.$store.state.common.align,type:"index",label:"序号",width:"50px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"CategoryName","header-align":"center",align:e.$store.state.common.align,width:"100",label:"药态","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"Code","header-align":"center",align:e.$store.state.common.align,width:"100",label:"商品编码","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:e.$store.state.common.align,label:"药材名称"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{style:{color:t.row.Quantity<t.row.RedLine?"#e4393c":"#333"}},[e._v(e._s(t.row.ShowName))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"Specification","header-align":"center",align:e.$store.state.common.align,label:"规格","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:e.$store.state.common.align,label:"库存 (余量)","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{style:{color:t.row.Quantity<t.row.RedLine?"#e4393c":"#333"}},[e._v(e._s(t.row.Quantity))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"RedLine","header-align":"center",align:e.$store.state.common.align,label:"预警量","show-overflow-tooltip":!0}})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"prev, pager, next, jumper, sizes, total"},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}})],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.visible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dataFormSubmit()}}},[e._v("确定")])],1)],1)],1)},staticRenderFns:[]};var n=a("VU/8")(i,s,!1,function(e){a("p+7H")},"data-v-15cbb406",null);t.default=n.exports},hNmR:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("mvHQ"),r=a.n(o),i=a("Tqlw"),s=a("gyMJ"),n=(a("E4LH"),a("j66d")),d={name:"role",data:function(){return{addOrUpdateVisible:!1,dataListLoading:!1,pageSize:10,pageIndex:1,totalPage:1,dataForm:{Name:"",supplierId:"0",supplierCode:"",isOriginHistory:!1,StoreId:"0",StoreCode:"",Buyer:"",Phone:"",Address:"",CategoryText:"",CategoryId:"",Remark:""},oldCategoryText:"",supplierArr:[],drugsCategoryList:[],dataListSelections:[],dataList:[],purchaseFormal:[]}},components:{AddOrUpdate:i.default,ComStore:n.default},computed:{},beforeRouteEnter:function(e,t,a){"/drugs/purchase"===e.path&&a(function(e){"[]"!==window.sessionStorage.getItem("modPurchaseList")&&""!==JSON.parse(window.sessionStorage.getItem("modPurchaseList"))&&void 0!==window.sessionStorage.getItem("modPurchaseList")&&null!==window.sessionStorage.getItem("modPurchaseList")&&e.$confirm("系统有历史保存信息，是否调用？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",closeOnClickModal:!1,closeOnPressEscape:!1,type:"warning"}).then(function(){e.dataList=JSON.parse(window.sessionStorage.getItem("modPurchaseList")),e.purchaseFormal=JSON.parse(window.sessionStorage.getItem("modPurchaseList")),e.dataForm.StoreId=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).StoreId,e.isOriginHistory=!0,e.$refs.comStore.pageInit(e.dataForm.StoreId),e.dataForm.Buyer=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).Buyer,e.dataForm.Phone=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).Phone,e.dataForm.Address=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).Address,e.dataForm.Remark=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).Remark,e.dataForm.supplierId=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).supplierId,e.dataForm.supplierCode=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).supplierCode,e.dataForm.CategoryText=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).CategoryText,e.dataForm.CategoryId=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).CategoryId,e.oldCategoryText=JSON.parse(window.sessionStorage.getItem("modPurchasePeopleInfo")).oldCategoryText,window.sessionStorage.setItem("modPurchaseList",r()([])),window.sessionStorage.setItem("modPurchasePeopleInfo","")}).catch(function(){window.sessionStorage.setItem("modPurchaseList",r()([])),window.sessionStorage.setItem("modPurchasePeopleInfo","")}),a()})},beforeRouteLeave:function(e,t,a){var o=this;"/drugs/purchase"===t.path&&""!==this.dataList.join()?this.$confirm("检测到未保存的内容，是否在离开页面前保存修改？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",closeOnClickModal:!1,closeOnPressEscape:!1,type:"warning"}).then(function(){window.sessionStorage.setItem("modPurchaseList",r()(o.dataList));var e={StoreId:o.dataForm.StoreId,Buyer:o.dataForm.Buyer,Phone:o.dataForm.Phone,Address:o.dataForm.Address,Remark:o.dataForm.Remark,supplierId:o.dataForm.supplierId,supplierCode:o.dataForm.supplierCode,CategoryText:o.dataForm.CategoryText,CategoryId:o.dataForm.CategoryId,oldCategoryText:o.oldCategoryText};window.sessionStorage.setItem("modPurchasePeopleInfo",r()(e)),a()}).catch(function(){o.$message({type:"info",message:"放弃保存并离开页面"}),window.sessionStorage.setItem("modPurchaseList",r()([])),window.sessionStorage.setItem("modPurchasePeopleInfo",""),a()}):a()},mounted:function(){this.pageInit()},methods:{changeStoreData:function(e,t){var a=this;if(!1===t){if(this.dataForm.StoreId=e,""===this.dataForm.StoreId)return this.dataForm.StoreId="",this.dataForm.StoreCode="",this.dataForm.Buyer="",this.dataForm.Phone="",this.dataForm.Address="",this.getDataList(),!1;if(!0===this.isOriginHistory)return this.isOriginHistory=!1,!1;s.a.store.storeAll({name:"",PageIndex:1,PageSize:1e3,IsPaging:!0,code:"",canViewStores:this.dataForm.StoreId}).then(function(e){"0000"===e.code&&(a.dataForm.StoreId=e.data[0].Id,a.dataForm.StoreCode=e.data[0].Code,a.dataForm.Buyer=e.data[0].Contact,a.dataForm.Phone=e.data[0].Phone,a.dataForm.Address=e.data[0].Address,a.getDataList())})}},pageInit:function(){var e=this;this.dataListLoading=!0,this.$ios.all([s.a.supplier.getSupplierList({name:"",PageIndex:"1",PageSize:"1000",IsPaging:!0,code:""}),s.a.drugs.getDrugsCategory()]).then(this.$ios.spread(function(t,a){"0000"===t.code&&"0000"===a.code&&(e.supplierArr=t.data,e.drugsCategoryList=a.data.filter(function(e,t){return t>0}),e.dataForm.CategoryText=e.drugsCategoryList[0].text,e.dataForm.CategoryId=e.drugsCategoryList[0].id,e.oldCategoryText=e.drugsCategoryList[0].text,e.dataListLoading=!1)}))},categoryTextHandle:function(e){var t=this;this.$confirm("此操作将清空之前的记录! 是否要继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.getDataList(),t.drugsCategoryList.forEach(function(a){a.text===e&&(t.dataForm.CategoryId=a.id,t.oldCategoryText=a.text)})}).catch(function(){t.dataForm.CategoryText=t.oldCategoryText})},handleSupplier:function(e){var t=this.supplierArr.filter(function(t){return t.Id===e});this.dataForm.supplierId=t[0].Id,this.dataForm.supplierCode=t[0].Code},selectionChangeHandle:function(e){this.dataListSelections=e},getDataList:function(e){"[]"===String(e)||void 0===e?(this.dataList=[],this.purchaseFormal=[]):(e.forEach(function(e){e.myNum="1"}),this.dataList=e,this.purchaseFormal=e)},addOrUpdateHandle:function(e,t){var a=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){a.$refs.addOrUpdate.init(e,t)})},deleteHandle:function(e){var t=this;this.$confirm((void 0===e?"批量":"")+"移除Id为["+(void 0===e?this.dataListSelections.map(function(e){return e.Id}).join():e)+"]的项?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){if(void 0===e)for(var a=0;a<t.dataListSelections.length;a++)t.purchaseFormal=t.dataList=t.purchaseFormal.filter(function(e){return e.Id!==t.dataListSelections[a].Id});else t.purchaseFormal=t.dataList=t.purchaseFormal.filter(function(t){return t.Id!==e})})},handleChange:function(){this.dataList.push()},savePurchase:function(){var e=this;if(String(this.dataList)!==[]&&""!==String(this.dataList)){var t={Buyer:this.dataForm.Buyer,Phone:this.dataForm.Phone,Address:this.dataForm.Address,Remark:this.dataForm.Remark,OrderType:1,StoreId:this.dataForm.StoreId,StoreCode:this.dataForm.StoreCode,Items:r()(this.dataList.map(function(t){return{ProductId:t.Id,SapProductCode:t.Code,LastCostPirce:t.LastCostPrice,CostPrice:t.CostPrice,StoreSalePrice:t.StoreSalePrice,Quantity:t.myNum,SupplierId:e.dataForm.supplierId,SupplierCode:e.dataForm.supplierCode}})),SupplierId:this.dataForm.supplierId,SupplierCode:this.dataForm.supplierCode};if("0"===String(t.StoreId)||"0"===t.SupplierId)return this.$alert("您没有选择供应商、门店!","提示",{confirmButtonText:"确定"}),!1;s.a.purchase.submitPurchase(t).then(function(t){"0000"===t.code?(e.$message({message:t.message,type:"success",duration:3e3}),e.dataForm={Name:"",UserName:"",View:!0,supplierId:"0",supplierCode:"",StoreId:"0",StoreCode:"",Buyer:"",Phone:"",Address:"",CategoryText:"",CategoryId:"",Remark:""},e.oldCategoryText="",e.pageInit(),e.dataList=[],e.purchaseFormal=[]):e.$alert(""+t.message,"提示",{confirmButtonText:"确定"})})}else this.$alert("你还啥都没填呢!","提示",{confirmButtonText:"确定"})}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"mod-purchase"},[a("el-form",{ref:"dataForm",attrs:{inline:!0,model:e.dataForm,"label-width":"80px"}},[a("el-form-item",[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(t){e.savePurchase()}}},[e._v("保存采购单")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"mini",icon:"el-icon-plus",disabled:!(e.dataForm.StoreId>0)},on:{click:function(t){e.addOrUpdateHandle(e.dataForm.CategoryId,e.dataForm.StoreId)}}},[e._v("商品导入")]),e._v(" "),a("el-button",{attrs:{type:"danger",icon:"el-icon-delete",disabled:e.dataListSelections.length<=0,size:"mini"},on:{click:function(t){e.deleteHandle()}}},[e._v("批量移除")])],1),e._v(" "),a("br"),e._v(" "),a("div",{staticStyle:{"background-color":"#F5F7FA","margin-bottom":"-5px","border-radius":"5px 5px 0 0"}},[a("el-form-item",{attrs:{label:"操作账号",prop:""}},[a("el-input",{staticStyle:{width:"100px"},attrs:{placeholder:"操作账号",clearable:"",size:"mini",disabled:!0},model:{value:e.$store.getters.getAccountLoginInfoAll.NickName,callback:function(t){e.$set(e.$store.getters.getAccountLoginInfoAll,"NickName",t)},expression:"$store.getters.getAccountLoginInfoAll.NickName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"",prop:"CategoryText"}},[a("el-radio-group",{attrs:{size:"mini"},on:{change:e.categoryTextHandle},model:{value:e.dataForm.CategoryText,callback:function(t){e.$set(e.dataForm,"CategoryText",t)},expression:"dataForm.CategoryText"}},e._l(e.drugsCategoryList,function(e){return a("el-radio-button",{key:e.id,attrs:{label:e.text}})}))],1),e._v(" "),a("el-form-item",{attrs:{label:"",prop:""}},[a("el-select",{staticStyle:{width:"150px"},attrs:{placeholder:"供应厂商",size:"mini"},on:{change:e.handleSupplier},model:{value:e.dataForm.supplierId,callback:function(t){e.$set(e.dataForm,"supplierId",t)},expression:"dataForm.supplierId"}},e._l(e.supplierArr,function(e){return a("el-option",{key:e.Id,attrs:{label:e.ShortName,value:e.Id}})}))],1),e._v(" "),a("com-store",{ref:"comStore",attrs:{paramsFather:{label_0:"",size_1:"mini",width_2:"150px",clear_3:!0,multiple_4:!1,must_5:!1,isTrigger:!1}},on:{eventStore:e.changeStoreData}})],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:e.dataList,border:"",stripe:"",height:e.$store.state.documentClientIFRMAE,"header-cell-style":e.$cxObj.tableHeaderStyle40px,"row-class-name":"purchaseTableRowClass"},on:{"selection-change":e.selectionChangeHandle}},[a("el-table-column",{attrs:{type:"selection","header-align":"center",align:e.$store.state.common.align,width:"50"}}),e._v(" "),a("el-table-column",{attrs:{align:e.$store.state.common.align,type:"index",label:"序号",width:"50px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Code","header-align":"center",align:e.$store.state.common.align,width:"100",label:"商品编码"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ShowName","header-align":"center",align:e.$store.state.common.align,label:"药材名称"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Specification","header-align":"center",align:e.$store.state.common.align,label:"规格","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"Quantity","header-align":"center",align:e.$store.state.common.align,label:"库存 (余量)","min-width":"110"}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:e.$store.state.common.align,label:"采购量","min-width":"110"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-input-number",{attrs:{precision:2,step:1,min:.1,max:1e4,size:"mini"},on:{change:e.handleChange},model:{value:t.row.myNum,callback:function(a){e.$set(t.row,"myNum",a)},expression:"scope.row.myNum"}})]}}])}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:e.$store.state.common.align,width:"190",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"mini",plain:""},on:{click:function(a){e.deleteHandle(t.row.Id)}}},[e._v("移除\n        ")])]}}])})],1),e._v(" "),a("el-input",{staticStyle:{width:"80px"},attrs:{placeholder:"联系人",size:"mini"},model:{value:e.dataForm.Buyer,callback:function(t){e.$set(e.dataForm,"Buyer",t)},expression:"dataForm.Buyer"}}),e._v(" "),a("el-input",{staticStyle:{width:"120px"},attrs:{placeholder:"联系电话",size:"mini"},model:{value:e.dataForm.Phone,callback:function(t){e.$set(e.dataForm,"Phone",t)},expression:"dataForm.Phone"}}),e._v(" "),a("el-input",{staticStyle:{width:"160px"},attrs:{placeholder:"门店地址",size:"mini"},model:{value:e.dataForm.Address,callback:function(t){e.$set(e.dataForm,"Address",t)},expression:"dataForm.Address"}}),e._v(" "),a("el-input",{staticStyle:{width:"300px"},attrs:{size:"mini",type:"textarea",autosize:{minRows:1,maxRows:4},placeholder:"请输入进货备注"},model:{value:e.dataForm.Remark,callback:function(t){e.$set(e.dataForm,"Remark",t)},expression:"dataForm.Remark"}}),e._v(" "),e.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",attrs:{purchaseFatherList:e.purchaseFormal},on:{refreshDataList:e.getDataList}}):e._e()],1)},staticRenderFns:[]};var c=a("VU/8")(d,l,!1,function(e){a("BsaQ")},"data-v-59579aa9",null);t.default=c.exports},"p+7H":function(e,t){}});
//# sourceMappingURL=19.097ad1056482e9ff7765.js.map