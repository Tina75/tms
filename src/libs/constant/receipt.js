export const RECEIPT_STATUS = [
  {
    value: -1,
    label: '待签收'
  },
  {
    value: 0,
    label: '待回收'
  },
  {
    value: 1,
    label: '待返厂'
  },
  {
    value: 2,
    label: '已返厂'
  }
]

// 回单状态
export const RECEIPT_STATUS_CODE = {
  waiting_sign: -1, // 待签收
  waiting_recovery: 0, // 待回收
  waiting_return_factory: 1, // 待返厂
  already_returned_factory: 2 // 已返厂
}

// 回单管理简易搜索下拉选项
export const RECEIPT_SIMPLE_SEARCH_LIST = [
  {
    value: 0,
    label: '客户名称'
  },
  {
    value: 1,
    label: '订单号'
  },
  {
    value: 2,
    label: '客户订单号'
  },
  {
    value: 3,
    label: '承运商名称'
  },
  {
    value: 4,
    label: '司机姓名'
  },
  {
    value: 5,
    label: '司机手机号'
  },
  {
    value: 6,
    label: '车牌号'
  }
]
