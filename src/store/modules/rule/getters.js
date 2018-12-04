// 发货方规则列表
export const senderRuleSearch = (state, getters) => (data) => {
  return ruleList(state, data, 'senderRule')
}

// 承运商规则列表
export const carriesRuleSearch = (state, getters) => (data) => {
  return ruleList(state, data, 'carriesRule')
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
