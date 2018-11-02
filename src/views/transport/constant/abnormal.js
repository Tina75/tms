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
