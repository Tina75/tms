export const ORDER_STATUS = [
  {
    value: 10,
    label: '待提货'
  },
  {
    value: 20,
    label: '待送货'
  },
  {
    value: 30,
    label: '在途'
  },
  {
    value: 40,
    label: '已到货'
  },
  {
    value: 50,
    label: '已回单'
  },
  {
    value: 100,
    label: '回收站'
  }
]

// 订单状态
export const ORDER_STATUS_CODE = {
  pickup: 10, // 待提货
  dispatch: 20, // 待送货
  transit: 30, // 在途中
  arrive: 40, // 已到货
  receipt: 50, // 已回单
  recycle: 100 // 回收站
}

// 订单管理简易搜索下拉选项
export const ORDER_SIMPLE_SEARCH_LIST = [
  {
    value: 0,
    label: '客户名称'
  },
  {
    value: 3,
    label: '客户订单号'
  },
  {
    value: 1,
    label: '订单号'
  },
  {
    value: 2,
    label: '运单号'
  }
]
