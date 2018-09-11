// 发货联系人
export const consigners = ({order}) => order.consigners
export const consignerContacts = ({order}, getters) => getters.consigners.map(user => ({name: user.contact, value: user.contact, id: user.id}))
export const consignerPhones = (state, getters) => getters.consigners(user => ({
  name: user.phone,
  value: user.phone,
  id: user.id
}))
// 发货地址
export const consignerAddresses = ({order}) => order.addresses.map(item => ({name: item.address, value: item.address, id: item.id}))
// 收货方数据，下面分拆
export const consignees = ({order}) => order.consignees
// 收货方联系人列表
export const consigneeContacts = (state, getters) => getters.consignees.map((user) => ({
  name: user.contact + ',' + user.phone,
  value: user.contact,
  id: user.id
}))
// 收货方手机
export const consigneePhones = (state, getters) => getters.consignees.map((user) => ({
  name: user.phone,
  value: user.phone,
  id: user.id
}))
// 收货地址
export const consigneeAddresses = (state, getters) => getters.consignees.map((user) => ({
  name: user.address,
  value: user.address,
  id: user.id
}))
export const cargoes = ({order}) => order.cargoes

export const sumRow = (state, getters) => {
  return getters.cargoes.reduce((sum, cargo) => {
    // 读取临时数据

    sum.weight = (cargo.weight || 0) + sum.weight
    sum.volume = (cargo.volume || 0) + sum.volume
    sum.cargoCost = (cargo.cargoCost || 0) + sum.cargoCost
    sum.quantity = (cargo.quantity || 0) + sum.quantity
    return sum
  }, {
    weight: 0,
    volume: 0,
    cargoCost: 0,
    quantity: 0
  })
}
