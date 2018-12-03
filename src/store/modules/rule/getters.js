// 发货方规则列表
export const senderRuleSearch = (state, getters) => (data) => {
  if (!data.partnerId && !data.paramName) {
    return state.senderRule
  }
  if (data.partnerId && data.paramName) {
    let mid = []
    mid = state.senderRule.filter(item => {
      return item.partnerId === data.partnerId
    })
    mid = mid.filter(item => {
      return item.ruleName.includes(data.paramName) || item.partnerName.includes(data.paramName)
    })
    return mid
  }
  if (data.partnerId) {
    return state.senderRule.filter(item => {
      return item.partnerId === data.partnerId
    })
  }
  if (data.paramName) {
    return state.senderRule.filter(item => {
      // console.log(item.ruleName.includes(data.paramName) || item.partnerName.includes(data.paramName))
      return item.ruleName.includes(data.paramName) || item.partnerName.includes(data.paramName)
    })
  }
}

// 承运商规则列表
export const carriesRuleSearch = (state, getters) => (data) => {
  if (!data.partnerId && !data.paramName) {
    return state.carriesRule
  }
  if (data.partnerId && data.paramName) {
    let mid = []
    mid = state.carriesRule.filter(item => {
      return item.partnerId === data.partnerId
    })
    mid = mid.filter(item => {
      return item.ruleName.includes(data.paramName) || item.partnerName.includes(data.paramName)
    })
    return mid
  }
  if (data.partnerId) {
    return state.carriesRule.filter(item => {
      return item.partnerId === data.partnerId
    })
  }
  if (data.paramName) {
    return state.carriesRule.filter(item => {
      // console.log(item.ruleName.includes(data.paramName) || item.partnerName.includes(data.paramName))
      return item.ruleName.includes(data.paramName) || item.partnerName.includes(data.paramName)
    })
  }
}
