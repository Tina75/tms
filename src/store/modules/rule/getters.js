// 发货方规则列表
export const senderRuleSearch = (state, getters) => (data) => {
  return ruleList(state, data, 'senderRule')
}

// 承运商规则列表
export const carriesRuleSearch = (state, getters) => (data) => {
  return ruleList(state, data, 'carriesRule')
}

// 计费规则类型
export const ruleTypeList = state => {
  // console.log(ruleTypeMap)
  /* 如果返回'' 显示列默认为：重量（吨）、体积（方）、吨公里、方公里、车型 */
  if (state.ruleTypeList === '') return ['1', '2', '3', '4', '5']
  /* ['1', '2'] */
  return state.ruleTypeList
}

function ruleList (state, data, type) {
  let mid = []
  if (data.partnerId) {
    /* 将符合partnerId的匹配出来 */
    mid = state[type].filter(item => {
      return item.partnerId === data.partnerId
    })
    /* 在partnerId匹配中的模糊搜索 - 此时没有场景 */
    if (data.paramName) {
      mid = mid.filter(item => {
        return item.ruleName.includes(data.paramName) || item.partnerName.includes(data.paramName)
      })
    }
  } else {
    mid = state[type]
    /* 在所有数据中模糊搜索 */
    if (data.paramName) {
      mid = mid.filter(item => {
        return item.ruleName.includes(data.paramName) || item.partnerName.includes(data.paramName)
      })
    }
  }
  return mid
}

// let ruleTypeMapAll = {
//   '1': '重量（吨）',
//   '2': '体积（方）',
//   '3': '吨公里',
//   '4': '方公里',
//   '5': '车型',
//   '6': '公斤公里',
//   '7': '重量（公斤）'
// }
