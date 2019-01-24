/**
 * 结算方式
 */
const settlements = [
  { name: '现付', value: 1 },
  { name: '到付', value: 2 },
  { name: '回付', value: 3 },
  { name: '月结', value: 4 }
]
/**
 * 将结算方式拼接成键值对对象，如下：
 * {
 *  1: '现付',
 *  2: '到付',
 *  3: '回付',
 *  4: '月结'
 * }
 */
export const settlementStatusToName = settlements.reduce((map, option) => {
  map[option.value] = option.name
  return map
}, {})

export default settlements
