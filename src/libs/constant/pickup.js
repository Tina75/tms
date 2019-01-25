const pickup = [
  { name: '小车上门提货', value: 1 },
  { name: '大车直送客户', value: 2 }
]

/**
 * @Description:
 * 将提货方式拼接成键值对对象，如下：
 * {
 *     1:  '小车上门提货',
 *     2:  '大车直送客户'
 * }
 * @Date 2019/1/25
 */
export const pickupSattusToName = pickup.reduce((map, option) => {
  map[option.value] = option.name
  return map
}, {})
export default pickup
