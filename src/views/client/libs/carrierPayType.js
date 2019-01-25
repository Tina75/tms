export const carrierPayType = [
  { name: '按单结', value: 1 },
  { name: '月结', value: 2 }
]

export function carrierPayTypeFindName (value) {
  for (const item of carrierPayType) {
    if (item.value === value) return item.name
  }
  return '-'
}

export default carrierPayType
