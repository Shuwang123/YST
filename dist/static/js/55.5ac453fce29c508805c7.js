webpackJsonp([55],{eW40:function(a,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var d=t("gyMJ"),o=t("84O6"),r=t("E4LH"),s={components:{Address:o.default},data:function(){return{nodes:[],visible:!1,dataListLoading:!1,dataForm:{id:0,Name:"",AreaId:"",AddressInfo:"",Contact:"",Phone:""},dataRule:{Name:Object(r.a)("名称必填"),AddressInfo:Object(r.a)("详细地址必填"),Phone:Object(r.d)()}}},methods:{updataAddress:function(a){this.dataForm.AreaId=a},init:function(a){var e=this;this.visible=!0,this.dataForm.id=a||0,this.dataForm.id?(this.dataListLoading=!0,d.a.store.getStoreRow({id:this.dataForm.id}).then(function(a){"0000"===a.code&&(e.dataForm={id:a.data.Id,Name:a.data.Name,AreaId:a.data.AreaId,AddressInfo:a.data.Address,Contact:a.data.Contact,Phone:a.data.Phone}),e.$refs.comAddress.getAddress(e.dataForm.AreaId),e.dataListLoading=!1})):this.$refs.comAddress.getAddress()},handleClose:function(){this.$refs.dataForm.resetFields(),this.dataForm={id:0,Name:"",AreaId:"",AddressInfo:"",Contact:"",Phone:""}},dataFormSubmit:function(){var a=this;this.$refs.dataForm.validate(function(e){if(e){var t={id:a.dataForm.id,Name:a.dataForm.Name,AreaId:a.dataForm.AreaId,Address:a.dataForm.AddressInfo,Contact:a.dataForm.Contact,Phone:a.dataForm.Phone};(a.dataForm.id?d.a.store.editSubmit(t):d.a.store.addSubmit(t)).then(function(e){"0000"===e.code?a.$message({message:a.dataForm.id?"编辑成功":"新增成功",type:"success",duration:1500,onClose:function(){a.visible=!1,a.$emit("refreshDataList")}}):a.$message.error(e.message)})}})}}},i={render:function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],attrs:{width:"700px",title:a.dataForm.id?"编辑":"新增","close-on-click-modal":!1,visible:a.visible},on:{"update:visible":function(e){a.visible=e},close:a.handleClose}},[t("el-form",{directives:[{name:"loading",rawName:"v-loading",value:a.dataListLoading,expression:"dataListLoading"}],ref:"dataForm",attrs:{model:a.dataForm,rules:a.dataRule,"label-width":"80px"}},[t("el-form-item",{attrs:{label:"门店名称",prop:"Name"}},[t("el-input",{attrs:{placeholder:"名店名称Name"},model:{value:a.dataForm.Name,callback:function(e){a.$set(a.dataForm,"Name",e)},expression:"dataForm.Name"}})],1),a._v(" "),t("Address",{ref:"comAddress",attrs:{lastCode:a.dataForm.AreaId},on:{chenxi:a.updataAddress}}),a._v(" "),t("el-form-item",{attrs:{label:"详细地址",prop:"AddressInfo"}},[t("el-input",{attrs:{placeholder:"详细AddressInfo"},model:{value:a.dataForm.AddressInfo,callback:function(e){a.$set(a.dataForm,"AddressInfo",e)},expression:"dataForm.AddressInfo"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"联系人",prop:"Contact"}},[t("el-input",{attrs:{placeholder:"联系人"},model:{value:a.dataForm.Contact,callback:function(e){a.$set(a.dataForm,"Contact",e)},expression:"dataForm.Contact"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"电话",prop:"Phone"}},[t("el-input",{attrs:{placeholder:"电话"},model:{value:a.dataForm.Phone,callback:function(e){a.$set(a.dataForm,"Phone",e)},expression:"dataForm.Phone"}})],1)],1),a._v(" "),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:function(e){a.visible=!1}}},[a._v("取消")]),a._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:function(e){a.dataFormSubmit()}}},[a._v("确定")])],1)],1)},staticRenderFns:[]},n=t("VU/8")(s,i,!1,null,null,null);e.default=n.exports}});
//# sourceMappingURL=55.5ac453fce29c508805c7.js.map