/**
 * Created by dx on 18/3/19.
 */
// 手机盘点相关接口
import * as common from './modules/common' // 登录退出
import * as store from './modules/store' // 门店管理
import * as role from './modules/role' // 角色管理
import * as permission from './modules/permission' // 权限管理
import * as adminUser from './modules/adminUser' // 用户管理

import * as menu from './modules/menu/menu' // 菜单管理（cx）
import * as drugs from './modules/drugs/drugs' // 进销存管理（cx）
import * as supplier from './modules/drugs/supplier' // 供应商管理（cx）
import * as purchase from './modules/drugs/purchase' // 采购单创建以及状态管理管理（cx）
import * as storeStock from './modules/drugs/storeStock' // 门店库存管理（cx）[药材, ...]

export default {
  // 手机盘点及相关接口
  common,
  store,
  role,
  permission,
  adminUser,

  menu,
  drugs,
  supplier,
  purchase,
  storeStock
}
