/**
 * @Description:
 * 包括订单状态、提货单状态、运单状态、外传单状态
 * @Author: gaoting
 * @Date: 2019/1/25
 */

/**
 * @Description: 订单状态
 */
const orderStatusMap = {
  10: '待提货',
  20: '待调度',
  30: '在途 ',
  40: '已到货',
  50: '已回单',
  100: '删除'
}
/**
 * @Description: 提货单状态
 */

const loadbillStatusMap = {
  1: '待提货',
  2: '提货中',
  3: '已提货'
}

/**
 * @Description: 运单状态
 */
const waybillStatusMap = {
  1: '待派车',
  2: '待发运',
  3: '在途',
  4: '已到货'
}

/**
 * @Description: 外转单状态
 */
const transbillStatusMap = {
  1: '待发运',
  2: '在途',
  3: '到货'
}

/**
 * @Description: 回单状态
 */
const receiptStatusMap = {
  0: '待回收',
  1: '待返厂',
  2: '已返厂'
}

export default { orderStatusMap, loadbillStatusMap, waybillStatusMap, transbillStatusMap, receiptStatusMap }
