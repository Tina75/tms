/** 路由列表 */
export const BreadCurmd = (state) => state.breadlist
/** tab导航列表 */
// export const TabNavList = state => state.tabNavList
/** 用户信息 */
export const UserInfo = state => state.userInfo
/** 权限数据 */
export const Permissions = state => state.permissions
// 用户是否登录，并保存了用户信息
export const IsUserLogin = (state, getters) => !!getters.UserInfo.id && getters.Permissions.length !== 0
/** 消息数量 */
export const MsgCount = (state) => state.messageCount
/** 自定义table列表信息 */
export const TableColumns = (state) => state.customTableColumns
/** document-body的高度 */
export const DocumentHeight = (state) => state.documentHeight
// 开单设置选项，1：吨；2：公斤
export const WeightOption = (state) => state.orderSet.weightTonOption
/** 开单设置 */
export const OrderSet = (state) => state.orderSet
/** 派车设置 */
export const DispatchSet = (state) => state.dispatchSet
/** 短信设置 */
export const SmsSet = (state) => state.smsSet
/** 分摊策略 */
export const AllocationStrategy = (state) => state.allocationStrategy
/** 常发货物 */
export const tmsCargoDto = (state) => state.tmsCargoDto
/** 异常货物信息（少货、货损） */
export const AbnormalCargoInfos = (state) => state.abnormalCargoInfos
/** 异常货物信息(多货) */
export const AbnormalAddCargoInfos = (state) => state.abnormalAddCargoInfos
/** 导入订单批次号 */
export const ImportId = (state) => state.importId
/** 公司设置 */
export const CompanyInfo = (state) => state.companyInfo
