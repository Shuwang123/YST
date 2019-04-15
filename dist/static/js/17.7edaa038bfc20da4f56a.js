webpackJsonp([17,29],{Tg2t:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("gyMJ"),o=a("NC6I"),n=a.n(o),i=a("E4LH"),s={data:function(){return{visible:!1,id:"",dataForm:{UserName:"",Password:"",NickName:"",Phone:"",StoreId:0,RoleId:0,CanViewStores:""},roleArr:[],dataRule:{UserName:Object(i.a)("账号不能为空"),Password:Object(i.a)("密码不能为空"),NickName:Object(i.a)("别名必填"),Phone:Object(i.e)(1)}}},components:{ComStore:a("j66d").default},methods:{changeStoreData:function(e,t){!0===t?this.dataForm.CanViewStores=e:!1===t&&(this.dataForm.StoreId=e)},getRoleInit:function(){var e=this;r.a.role.jueseList({pageIndex:1,pageSize:100,isPaging:!1}).then(function(t){"0000"===t.code&&(e.roleArr=t.data.map(function(e){return{value:e.Id,label:e.Name}}))})},handleClose:function(){this.$refs.dataForm.resetFields(),this.roleArr=[],this.dataForm={UserName:"",Password:"",NickName:"",Phone:"",RoleId:0,StoreId:0,CanViewStores:""},this.id=""},init:function(e){var t=this;if(this.id=e||0,this.visible=!0,this.getRoleInit(),this.id){var a={id:this.id};r.a.adminUser.adminUserDetail(a).then(function(e){"0000"===e.code&&(t.id=e.data.Id,t.dataForm.NickName=e.data.NickName,t.dataForm.Phone=e.data.Phone,t.dataForm.RoleId=e.data.RoleId,t.dataForm.StoreId=e.data.StoreId,t.$refs.comStoreOne.pageInit(e.data.StoreId),t.dataForm.CanViewStores=e.data.CanViewStores,t.$refs.comStoreSome.pageInit(e.data.CanViewStores.split(",").map(function(e){return Number(e)})))})}this.$nextTick(function(){t.$refs.comStoreOne.pageInit(""),t.$refs.comStoreSome.pageInit([])})},dataFormSubmit:function(){var e=this;if(0===this.dataForm.StoreId||""===this.dataForm.StoreId)return this.$alert("没有选择账号的归属门店","提示",{confirmButtonText:"确定",callback:function(e){}}),!1;this.$refs.dataForm.validate(function(t){if(""===e.dataForm.CanViewStores?e.dataForm.CanViewStores=e.dataForm.StoreId:String(e.dataForm.CanViewStores).split(",").some(function(t){return e.dataForm.StoreId===Number(t)})||(e.dataForm.CanViewStores=e.dataForm.CanViewStores.split(",").concat(e.dataForm.StoreId).join()),t){var a={UserName:e.dataForm.UserName,Password:n()(e.dataForm.Password),NickName:e.dataForm.NickName,RoleId:e.dataForm.RoleId,StoreId:e.dataForm.StoreId,CanViewStores:e.dataForm.CanViewStores,Phone:e.dataForm.Phone,id:e.id},o={NickName:e.dataForm.NickName,RoleId:e.dataForm.RoleId,StoreId:e.dataForm.StoreId,CanViewStores:e.dataForm.CanViewStores,Phone:e.dataForm.Phone,Id:e.id};(e.id?r.a.adminUser.adminUserEdit(o):r.a.adminUser.adminUserAdd(a)).then(function(t){"0000"===t.code?e.$message({message:e.id?"修改成功":"新增成功",type:"success",duration:1500,onClose:function(){e.visible=!1,e.$emit("refreshDataList")}}):e.$message.error(t.message),e.visible=!1})}})}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],ref:"dialog__wrapper",attrs:{title:0===e.id?"申请账号":"编辑账号","close-on-click-modal":!1,visible:e.visible,id:"add-or-update"},on:{"update:visible":function(t){e.visible=t},close:e.handleClose}},[a("el-form",{ref:"dataForm",attrs:{model:e.dataForm,rules:e.dataRule,"label-width":"80px"},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.dataFormSubmit()}}},[e.id?e._e():a("el-form-item",{attrs:{label:"用户名",prop:"UserName"}},[a("el-input",{attrs:{placeholder:"请填写用户名（算登陆账号，数字或字母以后不可更改）"},model:{value:e.dataForm.UserName,callback:function(t){e.$set(e.dataForm,"UserName",t)},expression:"dataForm.UserName"}})],1),e._v(" "),e.id?e._e():a("el-form-item",{attrs:{label:"密码",prop:"Password"}},[a("el-input",{attrs:{placeholder:"填写密码或修改密码"},model:{value:e.dataForm.Password,callback:function(t){e.$set(e.dataForm,"Password",t)},expression:"dataForm.Password"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"别名",prop:"NickName"}},[a("el-input",{attrs:{placeholder:"请填别名（汉字昵称）"},model:{value:e.dataForm.NickName,callback:function(t){e.$set(e.dataForm,"NickName",t)},expression:"dataForm.NickName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"电话",prop:"Phone"}},[a("el-input",{attrs:{placeholder:"请填写电话"},model:{value:e.dataForm.Phone,callback:function(t){e.$set(e.dataForm,"Phone",t)},expression:"dataForm.Phone"}})],1),e._v(" "),a("com-store",{ref:"comStoreOne",attrs:{paramsFather:{label_0:"归属门店",size_1:"",width_2:"400px",clear_3:!0,disabled_4:!1,multiple_5:!1}},on:{eventStore:e.changeStoreData}}),e._v(" "),a("el-form-item",{attrs:{label:"角色ID",prop:"RoleId"}},[a("el-select",{staticStyle:{width:"400px"},attrs:{placeholder:"此账号的角色ID（一个账号只能对应一个角色）"},model:{value:e.dataForm.RoleId,callback:function(t){e.$set(e.dataForm,"RoleId",t)},expression:"dataForm.RoleId"}},e._l(e.roleArr,function(e){return a("el-option",{key:e.value,attrs:{value:e.value,label:"["+e.value+"] "+e.label}})}))],1),e._v(" "),a("com-store",{ref:"comStoreSome",attrs:{paramsFather:{label_0:"可控门店",size_1:"",width_2:"400px",clear_3:!1,disabled_4:!1,multiple_5:!0}},on:{eventStore:e.changeStoreData}})],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.visible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dataFormSubmit()}}},[e._v("确定")])],1)],1)},staticRenderFns:[]},d=a("VU/8")(s,l,!1,null,null,null);t.default=d.exports},m0Ez:function(e,t){},md3T:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("E4LH"),o=a("Tg2t"),n=a("j66d"),i=a("gyMJ"),s={name:"user",filters:{formatDate:function(e){var t=new Date(e);return Object(r.f)(t,"yyyy-MM-dd hh:mm")}},computed:{},components:{AddOrUpdate:o.default,ComStore:n.default},data:function(){return{addOrUpdateVisible:!1,dataListLoading:!1,pageSize:10,pageIndex:1,totalPage:1,dataForm:{userName:"",pageIndex:1,pageSize:10,isPaging:!0,nickName:"",id:"",storeId:"",roleId:""},roleArr:[],dataList:[]}},mounted:function(){this.getDataList(),this.initID()},methods:{changeStoreData:function(e){this.dataForm.storeId=e},initID:function(){var e=this;i.a.role.jueseList({PageIndex:1,PageSize:1e3,IsPaging:!0}).then(function(t){"0000"===t.code&&t.data.forEach(function(t){e.roleArr.push({name:t.Name,id:t.Id})})})},addOrUpdateHandle:function(e){var t=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){t.$refs.addOrUpdate.init(e)})},resetHandle:function(e){var t=this;this.$confirm("确定将[id="+e.Id+"][账号名="+e.UserName+"]的账户的密码重置为123456吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){i.a.role.resetPassword({id:e.Id}).then(function(e){"0000"===e.code?t.$message({type:"success",message:"重置密码成功!",duration:1e3,onClose:function(){t.getDataList()}}):t.$message.error(e.message)})})},getDataList:function(){var e=this,t={userName:this.dataForm.userName,PageIndex:this.dataForm.pageIndex,PageSize:this.dataForm.pageSize,IsPaging:!0,nickName:this.dataForm.nickName,id:this.dataForm.id,storeId:""===this.dataForm.storeId?0:this.dataForm.storeId,roleId:this.dataForm.roleId};this.dataListLoading=!0,i.a.adminUser.adminUserList(t).then(function(t){"0000"===t.code?(t.data&&(e.dataList=t.data),e.totalPage=t.total):e.$message.error(t.message),e.dataListLoading=!1})},sizeChangeHandle:function(e){this.pageSize=e,this.pageIndex=1,this.getDataList()},currentChangeHandle:function(e){this.pageIndex=e,this.getDataList()},handelDelete:function(e){var t=this;i.a.adminUser.adminUserDelete({id:e}).then(function(e){"0000"===e.code&&(t.$message({type:"success",message:"禁用成功",duration:1500}),t.getDataList())})},handelStart:function(e){var t=this;i.a.adminUser.adminUserStart({id:e}).then(function(e){"0000"===e.code&&(t.$message({type:"success",message:"激活成功",duration:1500}),t.getDataList())})}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"mod-user"},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.getDataList()}}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"账号",clearable:""},model:{value:e.dataForm.userName,callback:function(t){e.$set(e.dataForm,"userName",t)},expression:"dataForm.userName"}})],1),e._v(" "),a("el-form-item",[a("el-input",{attrs:{placeholder:"账号别名（text）",clearable:""},model:{value:e.dataForm.nickName,callback:function(t){e.$set(e.dataForm,"nickName",t)},expression:"dataForm.nickName"}})],1),e._v(" "),a("com-store",{ref:"comStore",attrs:{paramsFather:{label_0:"",size_1:"",width_2:"180px",clear_3:!0,disabled_4:!1,multiple_5:!1}},on:{eventStore:e.changeStoreData}}),e._v(" "),a("el-form-item",[a("el-select",{attrs:{placeholder:"请选择角色ID",clearable:""},model:{value:e.dataForm.roleId,callback:function(t){e.$set(e.dataForm,"roleId",t)},expression:"dataForm.roleId"}},e._l(e.roleArr,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}))],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{icon:"el-icon-search"},on:{click:function(t){e.getDataList()}}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:function(t){e.addOrUpdateHandle()}}},[e._v("申请账号")])],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%"},attrs:{data:e.dataList,border:"",stripe:"",height:e.$store.state.documentClientIFRMAE,"header-cell-style":e.$cxObj.tableHeaderStyle}},[a("el-table-column",{attrs:{type:"index",label:"序号",align:e.$store.state.common.align,width:"50px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"UserName","header-align":"center",align:e.$store.state.common.align,label:"账号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"NickName","header-align":"center",align:e.$store.state.common.align,label:"昵称",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Phone","header-align":"center",align:e.$store.state.common.align,label:"电话",width:"150"}}),e._v(" "),a("el-table-column",{attrs:{prop:"StoreName","header-align":"center",align:e.$store.state.common.align,label:"门店","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"RoleName","header-align":"center",align:e.$store.state.common.align,label:"角色"}}),e._v(" "),a("el-table-column",{attrs:{"header-align":"center",align:e.$store.state.common.align,label:"创建时间",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e._f("formatDate")(t.row.CreatedOn)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"StatusName","header-align":"center",align:e.$store.state.common.align,label:"状态",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Status","header-align":"center",align:e.$store.state.common.align,label:"1,3",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"260","header-align":"center",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary",size:"mini",plain:"",icon:"el-icon-edit"},on:{click:function(a){e.addOrUpdateHandle(t.row.Id)}}},[e._v("编辑\n        ")]),e._v(" "),a("el-button",{attrs:{type:"primary",size:"mini",plain:""},on:{click:function(a){e.resetHandle(t.row)}}},[e._v("重置")]),e._v(" "),a("el-button",{attrs:{type:1===t.row.Status?"success":"danger",size:"mini",plain:"",icon:""},on:{click:function(a){1===t.row.Status?e.handelDelete(t.row.Id):e.handelStart(t.row.Id)}}},[e._v("\n          "+e._s(1===t.row.Status?"禁用":"启用")+"\n        ")])]}}])})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pageIndex,"page-sizes":[10,20,50,100],"page-size":e.pageSize,total:e.totalPage,layout:"prev, pager, next, jumper, sizes, total",background:""},on:{"size-change":e.sizeChangeHandle,"current-change":e.currentChangeHandle}}),e._v(" "),e.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataList}}):e._e()],1)},staticRenderFns:[]};var d=a("VU/8")(s,l,!1,function(e){a("m0Ez")},"data-v-33708c32",null);t.default=d.exports}});
//# sourceMappingURL=17.7edaa038bfc20da4f56a.js.map