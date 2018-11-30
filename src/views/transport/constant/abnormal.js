import TMSUrl from '@/libs/constant/url'

export const TAB_LIST = [
  // { name: '全部', count: '' },
  { name: '全部', count: '' },
  { name: '未处理', count: '' },
  { name: '已处理', count: '' }
]
// tab数量
export function setTabList (data) {
  return [
    { name: '全部', count: '' },
    { name: '未处理', count: data.untreated || 0 },
    { name: '已处理', count: data.processed || 0 }
  ]
}
// tab 表头按钮
export const BUTTON_LIST = vm => [
  {
    tab: '全部',
    btns: [{
      name: '导出',
      code: 120403,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '未处理',
    btns: [{
      name: '导出',
      code: 120403,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '已处理',
    btns: [{
      name: '导出',
      code: 120403,
      func: () => {
        vm.billExport()
      }
    }]
  }
]

export const TABLE_COLUMNS = vm => [
  {
    type: 'selection',
    width: 50,
    align: 'center'
  },
  {
    title: '单据号',
    key: 'billNo',
    render: (h, p) => {
      return h('a', {
        style: {
          color: '#418DF9'
        },
        on: {
          click: () => {
            vm.openTab({
              title: p.row.billNo,
              path: p.row.billType === 1 ? TMSUrl.PICKUP_ORDER_DETAIL : TMSUrl.TRANSPORT_ORDER_DETAIL,
              query: {
                id: p.row.billId,
                abnormal: 1
              }
            })
          }
        }
      }, p.row.billNo)
    }
  },
  {
    title: '单据类型',
    key: 'billType',
    render: (h, p) => {
      return vm.tableDataRender(h, vm.billTypeToName(p.row.billType))
    }
  },
  {
    title: '异常次数',
    key: 'abnormalCnt'
  },
  {
    title: '承运商',
    key: 'carrierName',
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.carrierName)
    }
  },
  {
    title: '车牌号',
    key: 'carNo'
  },
  {
    title: '是否修改运费',
    key: 'updateFee',
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.updateFee === 1 ? '是' : '否')
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (h, p) => {
      return vm.tableDataRender(h, vm.timeFormatter(p.row.createTime), true)
    }
  }
]

// 向下兼容异常环节
export const ABNORMAL_TIMINGS = {
  '1': [
    { value: '1', label: '装货环节' }
  ],
  '2': [
    { value: '1', label: '装货环节' },
    { value: '2', label: '送货环节' }
  ],
  '3': [
    { value: '1', label: '装货环节' },
    { value: '2', label: '送货环节' },
    { value: '3', label: '卸货环节' }
  ]
}

// 不同的异常环节下的异常类型选项  key对应异常环节的value
export const ABNORMAL_TYPE_CODES = {
  // 装货环节
  '1': [
    { value: '1', label: '货损' },
    { value: '2', label: '货单不符' },
    { value: '3', label: '超重超方' },
    { value: '4', label: '投诉' },
    { value: '5', label: '其他' }
  ],
  // 送货环节
  '2': [
    { value: '1', label: '货损' },
    { value: '2', label: '少货' },
    { value: '3', label: '多货' },
    { value: '4', label: '超时' },
    { value: '5', label: '投诉' },
    { value: '6', label: '其他' }
  ],
  // 卸货环节
  '3': [
    { value: '1', label: '货损' },
    { value: '2', label: '少货' },
    { value: '3', label: '多货' },
    { value: '4', label: '超时' },
    { value: '5', label: '拒收' },
    { value: '6', label: '投诉' },
    { value: '7', label: '其他' }
  ]
}
