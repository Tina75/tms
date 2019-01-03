// 客户公司名称列表
export const clients = (state) => state.senders.map((user) => ({ name: user.name, value: user.name, id: user.id }))

// 发货联系人
export const consigners = (state) => state.contacts
// 发货地址
export const consignerAddresses = (state) => state.addresses.map(item => ({ name: item.address, value: item.address, id: item.id, lat: item.latitude, lng: item.longitude, consignerHourseNumber: item.consignerHourseNumber }))
// 收货方数据，下面分拆
export const consignees = (state) => state.consignees
// 收货方联系人列表
export const consigneeContacts = (state, getters) => getters.consignees.map((user) => ({
  name: user.contact + ',' + user.phone,
  value: user.contact,
  phone: user.phone,
  id: user.id,
  address: user.address,
  cityCode: user.cityCode,
  latitude: user.latitude,
  longitude: user.longitude,
  consignerHourseNumber: user.consignerHourseNumber,
  consigneeCompanyName: user.consigneeCompanyName
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
  id: user.id,
  lat: user.latitude,
  lng: user.longitude
}))
export const cargoes = (state) => state.cargoes

// export const consignerCargoes = ({ order }) => order.consignerCargoes
// 下拉框选择货物
export const cargoOptions = (state, getters) => {
  return getters.cargoes.map(cargo => {
    let name = [
      cargo.cargoName,
      `${cargo.weight}吨`,
      `${cargo.volume}方`
    ]
    if (cargo.cargoCost) {
      name.push(`${cargo.cargoCost}元`)
    }
    if (cargo.unit) {
      name.push(cargo.unit)
    }
    return {
      name: name.join('，'),
      value: cargo.cargoName,
      id: cargo.id
    }
  })
}
