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
    label: '已付款',
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
/**
 * 返现头部tab
 */
export const ReturnTabs = [
  {
    label: '待核销',
    name: 'WAIT_VERIFY',
    count: ''
  },
  {
    label: '已核销',
    name: 'VERIFIED',
    count: ''
  }
]
