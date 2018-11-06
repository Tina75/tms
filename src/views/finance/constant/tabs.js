/**
 * 代收货款tab选项
 */
export const CollectTabs = [
  {
    label: '未收',
    name: 'WAIT_COLLECT',
    count: ''
  },
  {
    label: '已收未付',
    name: 'WAIT_PAY',
    count: ''
  },
  {
    label: '已付',
    name: 'PAIED',
    count: ''
  }
]
/**
 * key value
 * {WAIT_COLLECT: 'WAIT_COLLECT'}
 */
export const CollectTabMap = CollectTabs.reduce((map, item) => {
  map[item.name] = item.name
  return map
}, {})
