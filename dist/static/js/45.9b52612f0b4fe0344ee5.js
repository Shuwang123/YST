webpackJsonp([45],{"0icb":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("mvHQ"),o=a.n(i),r=a("gyMJ"),s=a("E4LH"),d={data:function(){return{siEdit:!0,nodes:[],dataTree:[],checkedKey:[],defaultProps:{children:"children",label:"label",key:"key"},visible:!1,menuList:[],menuListTreeProps:{label:"name",children:"children"},dataForm:{Id:0,Name:"",Description:"",MenuIds:""},dataRule:{Name:Object(s.a)("角色名不能为空")}}},methods:{init:function(e){var t=this;r.a.menu.getTree().then(function(e){"0000"===e.code&&(t.dataTree=JSON.parse(o()(e.data).toLowerCase()))}),this.dataForm.Id=e||0,this.visible=!0,this.$nextTick(function(){t.dataForm.Id&&r.a.role.roleDetail({id:e}).then(function(e){if("0000"===e.code){t.dataForm.Name=e.data.Name,t.dataForm.Description=e.data.Description,t.dataForm.Id=e.data.Id;var a=[];if(e.data.Items.length>0){for(var i=0;i<e.data.Items.length;i++)a.push(e.data.Items[i].MenuId);t.$refs.menuListTree.setCheckedKeys(a)}}})})},handleClose:function(){this.$refs.dataForm.resetFields(),this.$refs.menuListTree.setCheckedKeys([]),this.dataForm.Id="",this.dataForm.Description=""},dataFormSubmit:function(){var e=this;this.checkedKey=this.$refs.menuListTree.getCheckedKeys(),this.$refs.dataForm.validate(function(t){if(t){var a={id:0,Name:e.dataForm.Name,Description:e.dataForm.Description,MenuIds:e.checkedKey.join()};e.dataForm.Id&&(a.id=e.dataForm.Id),(e.dataForm.Id?r.a.role.roleEdit(a):r.a.role.roleAdd(a)).then(function(t){"0000"===t.code?e.$message({message:e.dataForm.roleId?"修改成功":"新增成功",type:"success",duration:1500,onClose:function(){e.visible=!1,e.$emit("refreshDataList")}}):e.$message.error(t.message)})}})},getNodes:function(e){if(e.length>0)for(var t=0;t<e.length;t++)e[t].children?this.getNodes(e[t].children):this.nodes.push(e[t].id)}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],staticClass:"owneldialogpaddingbottom",attrs:{title:e.dataForm.roleId?"修改":"新增",width:"700px","close-on-click-modal":!1,visible:e.visible},on:{"update:visible":function(t){e.visible=t},close:e.handleClose}},[a("el-form",{ref:"dataForm",attrs:{model:e.dataForm,rules:e.dataRule,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"角色名称",prop:"Name"}},[a("el-input",{attrs:{placeholder:"角色名称Name"},model:{value:e.dataForm.Name,callback:function(t){e.$set(e.dataForm,"Name",t)},expression:"dataForm.Name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"备注",prop:"description"}},[a("el-input",{attrs:{placeholder:"描述"},model:{value:e.dataForm.Description,callback:function(t){e.$set(e.dataForm,"Description",t)},expression:"dataForm.Description"}})],1),e._v(" "),a("el-form-item",{staticClass:"ownScrollbar",staticStyle:{"min-height":"350px","max-height":"350px","overflow-y":"scroll"},attrs:{size:"mini",label:"授权"}},[a("el-tree",{ref:"menuListTree",attrs:{"show-checkbox":"",data:e.dataTree,props:e.defaultProps,"node-key":"key","default-expand-all":!0,"default-expanded-keys":[1,2,3],"default-checked-keys":e.checkedKey}})],1)],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.visible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dataFormSubmit()}}},[e._v("确定")])],1)],1)},staticRenderFns:[]};var n=a("VU/8")(d,l,!1,function(e){a("jXl9")},"data-v-1e97ceda",null);t.default=n.exports},jXl9:function(e,t){}});
//# sourceMappingURL=45.9b52612f0b4fe0344ee5.js.map