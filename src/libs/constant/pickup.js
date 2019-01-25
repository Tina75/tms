export const pickups = [
  { name: '小车上门提货', value: 1 },
  { name: '大车直送客户', value: 2 }
]

export function pickupsFindName (value) {
  let name = '-'
  pickups.find((item) => {
    if (value === item.value) name = item.name
  })
  return name
}

export default pickups
