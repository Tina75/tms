export const pickups = [
  { name: '小车上门提货', value: 1 },
  { name: '大车直送客户', value: 2 }
]

export function pickupsFindName (value) {
  for (const item of pickups) {
    if (item.value === value) return item.name
  }
  return '-'
}

export default pickups
