// 是否开票
export const invoiceList = [
  {
    name: '是',
    value: 1
  },
  {
    name: '否',
    value: 0
  }
]
// 拓展渠道
export const exploiteChannel = [
  {
    name: '公司开拓',
    value: 1
  },
  {
    name: '个人开拓',
    value: 2
  }
]
export function exploiteChannelFindName (value) {
  let name = '-'
  exploiteChannel.find((item) => {
    if (value === item.value) name = item.name
  })
  return name
}
