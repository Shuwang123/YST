webpackJsonp([20,50],{"+Flq":function(e,t){},Ktvk:function(e,t){},Pfqn:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("NGEn"),i=a.n(n),r=a("gyMJ"),l=(a("0xDb"),{name:"meun",computed:{},components:{AddOrUpdate:a("UMHY").default},data:function(){return{addOrUpdateVisible:!1,dataListLoading:!1,dataForm:{},dataMenu:[],checked:!1,input4:"",objMenu:{name:"",pageIndex:1,pageSize:13,IsPaging:!0},allMenus:0}},mounted:function(){this.getNewMenuList()},methods:{postMenu:function(){var e=this;this.dataListLoading=!0,r.a.menu.getMenu(this.objMenu).then(function(t){"0000"===t.code&&(e.allMenus=t.total,e.dataMenu=t.data),e.dataListLoading=!1})},searchMenu:function(){""===this.objMenu.name.trim()&&this.$message({message:"查询关键字不能为空",type:"warning",duration:1500}),this.postMenu()},getNewMenuList:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.objMenu.pageIndex=e,this.postMenu()},getNewPageSizes:function(e){this.objMenu.pageSize=e,this.postMenu()},getDataList:function(){this.dataMenu=[],this.postMenu()},toggleHandle:function(e,t){this.hasChild(t)&&(this.dataList[e]._expanded=!this.dataList[e]._expanded,this.dataList[e]._expanded?this.dataList=this.dataList.splice(0,e+1).concat(t.children).concat(this.dataList):this.dataList=this.removeChildNode(this.dataList,t.id))},removeChildNode:function(e,t){var a=i()(t)?t:[t];if(t.length<=0)return e;for(var n=[],r=0;r<e.length;r++)-1!==a.indexOf(e[r].parentId)&&-1===a.indexOf(e[r].id)&&(n.push(e.splice(r,1)[0].id),r--);return this.removeChildNode(e,n)},hasChild:function(e){return i()(e.children)&&e.children.length>=1||!1},iconStyles:function(e){return{visibility:this.hasChild(e)?"visible":"hidden"}},childStyles:function(e){return{"padding-left":(e._level>1?10*e._level:0)+"px"}},iconClasses:function(e){return[e._expanded?"el-icon-caret-bottom":"el-icon-caret-right"]},addOrUpdateHandle:function(e){var t=this;this.addOrUpdateVisible=!0,this.$nextTick(function(){var a=void 0===e?null:e.Id;t.$refs.addOrUpdate.init(a)})},handelDelete:function(e,t){var a=this,n=[t.Id],i={ids:n.join(",")};this.$confirm("确定对[id="+n.join(",")+"]进行["+(t?"删除":"批量删除")+"]操作?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){r.a.menu.deletes(i).then(function(e){"0000"===e.code?a.$message({type:"success",message:"删除成功!",duration:1e3,onClose:function(){a.getDataList()}}):a.$message.error(e.message)})})}}}),o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"mod-meun"},[a("el-form",{attrs:{inline:!0,model:e.dataForm},nativeOn:{submit:function(t){return t.preventDefault(),e.searchMenu(t)}}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"菜单名称",clearable:""},on:{clear:e.searchMenu},model:{value:e.objMenu.name,callback:function(t){e.$set(e.objMenu,"name",t)},expression:"objMenu.name"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{icon:"el-icon-search"},on:{click:e.searchMenu}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:function(t){e.addOrUpdateHandle()}}},[e._v("新增菜单")])],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],staticStyle:{width:"100%","text-align":"center"},attrs:{data:e.dataMenu,stripe:"",border:"",height:e.$store.state.documentClientIFRMAE,"header-cell-style":e.$cxObj.tableHeaderStyle}},[a("el-table-column",{attrs:{type:"selection","header-align":"center",align:"center",width:"50"}}),e._v(" "),a("el-table-column",{attrs:{type:"index",label:"序号",width:"50","header-align":"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Id",label:"ID",width:"50","header-align":"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Name",label:"菜单名字",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"Url",label:"菜单链接","min-width":"100",align:"center","show-overflow-tooltip":!0}}),e._v(" "),a("el-table-column",{attrs:{prop:"Icon",label:"图标","show-overflow-tooltip":!0,align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ParentId",label:"父级ID",width:"100","header-align":"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"DisplayOrder",label:"排序",width:"100","header-align":"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"UrlType",label:"1表示菜单2表示按钮",width:"150","header-align":"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:"操作",width:"190","header-align":"center",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary",size:"mini",plain:"",icon:"el-icon-edit"},on:{click:function(a){e.addOrUpdateHandle(t.row)}}},[e._v("编辑\n        ")]),e._v(" "),a("el-button",{attrs:{type:"danger",size:"mini",plain:"",icon:"el-icon-delete"},on:{click:function(a){e.handelDelete(t.$index,t.row)}}},[e._v("删除\n        ")])]}}])})],1),e._v(" "),a("div",{staticClass:"slz-footer"},[a("el-pagination",{attrs:{background:"",total:e.allMenus,"current-page":e.objMenu.pageIndex,"page-size":e.objMenu.pageSize,"page-sizes":[10,13,20,30,100],layout:"prev,pager,next,jumper,sizes,total"},on:{"current-change":e.getNewMenuList,"size-change":e.getNewPageSizes}})],1),e._v(" "),e.addOrUpdateVisible?a("add-or-update",{ref:"addOrUpdate",on:{refreshDataList:e.getDataList}}):e._e()],1)},staticRenderFns:[]};var d=a("VU/8")(l,o,!1,function(e){a("Ktvk")},"data-v-6539b35e",null);t.default=d.exports},UMHY:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("mvHQ"),i=a.n(n),r=a("gyMJ"),l=a("E4LH"),o={data:function(){return{visible:!1,dataListLoading:!1,elPopoverElTreeVisible:!1,dataForm:{id:0,name:"",parentId:0,url:"",icon:"",displayOrder:0,urlType:1,type:1,parentName:""},dataRule:{name:Object(l.a)("菜单名不能为空"),url:Object(l.a)("如果没有路径请填写#号")},menuList:[],defaultProps:{children:"children",label:"label",key:"key"},isParentNode:!1,oldNodeKey:""}},methods:{handleClose:function(){this.dataForm={id:0,name:"",parentId:0,url:"",icon:"",displayOrder:0,urlType:1,type:1,parentName:""},this.$refs.dataForm.resetFields(),this.menuList=[]},handleCheckClick:function(e,t,a){!0===t?(this.$refs.menuListTree.setCheckedNodes([e]),this.dataForm.parentId=Number(e.key),this.dataForm.parentName=e.label,this.dataForm.id===this.dataForm.parentId&&(this.dataForm.parentId=0,this.dataForm.parentName="",this.$message({type:"warning",message:"此操作将把本级菜单设为顶级菜单"})),0!==e.children.length?this.isParentNode=!0:this.isParentNode=!1,this.oldNodeKey=e.key):1===this.$refs.menuListTree.getCheckedKeys(!0).length||this.isParentNode?this.oldNodeKey===e.key&&(this.dataForm.parentId=0,this.dataForm.parentName=""):(this.dataForm.parentId=0,this.dataForm.parentName="")},disabledTree:function(e){var t=this;e.forEach(function(e){if(Number(e.key)===t.dataForm.id){var a=JSON.parse(i()(e.children).replace(/"label"/g,'"disabled":true,"label"'));return e.children=a,!1}t.disabledTree(e.children)})},init:function(e){var t=this;this.visible=!0,e?(this.dataListLoading=!0,this.$ios.all([r.a.menu.getEdit({id:e}),r.a.menu.getTree()]).then(this.$ios.spread(function(e,a){if("0000"===e.code&&"0000"===a.code){var n={id:e.data.Id,name:e.data.Name,parentId:e.data.ParentId,url:e.data.Url,icon:e.data.Icon,displayOrder:e.data.DisplayOrder,urlType:e.data.UrlType,type:e.data.UrlType,parentName:""};t.dataForm=n,t.menuList=JSON.parse(i()(a.data).toLowerCase()),t.disabledTree(t.menuList),t.$nextTick(function(){t.menuListTreeSetCurrentNode()}),t.dataListLoading=!1}}))):r.a.menu.getTree().then(function(e){e.data&&(t.menuList=JSON.parse(i()(e.data).toLowerCase()))})},menuListTreeSetCurrentNode:function(){this.$refs.menuListTree.setChecked(this.dataForm.parentId,!0),this.dataForm.parentName=(this.$refs.menuListTree.getNode(this.dataForm.parentId)||{}).label},dataFormSubmit:function(){var e=this;this.$refs.dataForm.validate(function(t){if(t){var a=e.dataForm.id?r.a.menu.edit(e.dataForm):r.a.menu.add(e.dataForm);e.visible=!1,a.then(function(t){"0000"===t.code&&e.$message({message:e.dataForm.id?"修改成功":"新增成功",type:"success",duration:3e3,onClose:function(){e.$emit("refreshDataList")}})})}})}}},d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{directives:[{name:"dialogDrag",rawName:"v-dialogDrag"}],attrs:{title:e.dataForm.id?"修改":"新增",width:"700px","close-on-click-modal":!1,visible:e.visible},on:{"update:visible":function(t){e.visible=t},close:e.handleClose}},[a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.dataListLoading,expression:"dataListLoading"}],ref:"dataForm",attrs:{model:e.dataForm,rules:e.dataRule,"label-width":"80px"},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.dataFormSubmit()}}},[a("el-form-item",{attrs:{label:"类型：",prop:"UrlType"}},[a("el-radio-group",{model:{value:e.dataForm.urlType,callback:function(t){e.$set(e.dataForm,"urlType",t)},expression:"dataForm.urlType"}},[a("el-radio",{attrs:{label:1}},[e._v("菜单")])],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"菜单名称",prop:"name"}},[a("el-input",{attrs:{placeholder:"菜单名称或按钮名称"},model:{value:e.dataForm.name,callback:function(t){e.$set(e.dataForm,"name",t)},expression:"dataForm.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"上级菜单",prop:"parentName"}},[a("el-popover",{ref:"menuListPopover",attrs:{placement:"bottom-end",trigger:"click"},model:{value:e.elPopoverElTreeVisible,callback:function(t){e.elPopoverElTreeVisible=t},expression:"elPopoverElTreeVisible"}},[a("div",{staticStyle:{"overflow-y":"auto",width:"200px",height:"200px"}},[a("el-tree",{ref:"menuListTree",attrs:{data:e.menuList,props:e.defaultProps,"node-key":"key","show-checkbox":"","check-strictly":!0,"default-expand-all":!0,"highlight-current":!0,"expand-on-click-node":!1},on:{"check-change":e.handleCheckClick}})],1)]),e._v(" "),a("el-input",{directives:[{name:"popover",rawName:"v-popover:menuListPopover",arg:"menuListPopover"}],attrs:{readonly:!0,placeholder:"点击选择上级菜单"},model:{value:e.dataForm.parentName,callback:function(t){e.$set(e.dataForm,"parentName",t)},expression:"dataForm.parentName"}})],1),e._v(" "),1===e.dataForm.urlType?a("el-form-item",{attrs:{label:"菜单URL",prop:"url"}},[a("el-input",{attrs:{placeholder:"没有路径的请填写'#'，有路径的必须'/'开头"},model:{value:e.dataForm.url,callback:function(t){e.$set(e.dataForm,"url",t)},expression:"dataForm.url"}})],1):e._e(),e._v(" "),2===e.dataForm.urlType?a("el-form-item",{attrs:{label:"对应接口",prop:"menuUrl"}},[a("el-input",{attrs:{placeholder:"多个用逗号分隔, 如: /api/adminuser/add,/api/role/select/add"},model:{value:e.dataForm.menuUrl,callback:function(t){e.$set(e.dataForm,"menuUrl",t)},expression:"dataForm.menuUrl"}})],1):e._e(),e._v(" "),2===e.dataForm.urlType?a("el-form-item",{attrs:{label:"授权标识",prop:"identifier"}},[a("el-input",{attrs:{placeholder:"如: user_list"},model:{value:e.dataForm.identifier,callback:function(t){e.$set(e.dataForm,"identifier",t)},expression:"dataForm.identifier"}})],1):e._e(),e._v(" "),2!==e.dataForm.urlType?a("el-form-item",{attrs:{label:"排序号",prop:"showOrder"}},[a("el-input-number",{attrs:{"controls-position":"right",min:1,label:"排序号"},model:{value:e.dataForm.displayOrder,callback:function(t){e.$set(e.dataForm,"displayOrder",t)},expression:"dataForm.displayOrder"}})],1):e._e(),e._v(" "),2!==e.dataForm.urlType?a("el-form-item",{attrs:{label:"菜单图标",prop:"icon"}},[a("el-input",{attrs:{placeholder:"菜单图标"},model:{value:e.dataForm.icon,callback:function(t){e.$set(e.dataForm,"icon",t)},expression:"dataForm.icon"}})],1):e._e()],1),e._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.visible=!1}}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dataFormSubmit()}}},[e._v("确定")])],1)],1)},staticRenderFns:[]};var s=a("VU/8")(o,d,!1,function(e){a("+Flq")},null,null);t.default=s.exports}});
//# sourceMappingURL=20.598764216152068d72bb.js.map