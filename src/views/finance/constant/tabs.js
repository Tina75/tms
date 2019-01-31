/**
 * 代收货款tab选项
 */
export const CollectTabs = [
  {
    label: '未收',
    name: '未收',
    count: ''
  },
  {
    label: '已收未付',
    name: '已收未付',
    count: ''
  },
  {
    label: '已付款',
    name: '已付款',
    count: ''
  }
]
/**
 * key value
 * {WAIT_COLLECT: 'WAIT_COLLECT'}
 */
// export const CollectTabMap = CollectTabs.reduce((map, item) => {
//   map[item.name] = item.name
//   return map
// }, {})
/**
 * 返现头部tab
 */
export const ReturnTabs = [
  {
    label: '待核销',
    name: '待核销',
    count: ''
  },
  {
    label: '已核销',
    name: '已核销',
    count: ''
  }
]
