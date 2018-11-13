// 客户公司名称列表
export const clients = ({ order }) => order.clients.map((user) => ({ name: user.name, value: user.name, id: user.id }))

// 发货联系人
export const consigners = ({ order }) => order.consigners
// 发货地址
export const consignerAddresses = ({ order }) => order.addresses.map(item => ({ name: item.address, value: item.address, id: item.id, lat: item.latitude, lng: item.longitude }))
// 收货方数据，下面分拆
export const consignees = ({ order }) => order.consignees
// 收货方联系人列表
export const consigneeContacts = (state, getters) => getters.consignees.map((user) => ({
  name: user.contact + ',' + user.phone,
  value: user.contact,
  phone: user.phone,
  id: user.id,
  address: user.address,
  cityCode: user.cityCode
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
export const cargoes = ({ order }) => order.cargoes

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
// 承运商列表
export const carriers = ({ order }) => order.carriers.map((user) => ({ name: user.carrierName, value: user.carrierName, id: user.carrierId }))

// 承运商车辆信息
export const carrierCars = ({ order }) => order.carrierCars.map((car) => ({ name: car.carNO, value: car.carNO, id: car.carId }))

// 承运商司机信息
export const carrierDrivers = ({ order }) => order.carrierDrivers.map((driver) => ({ name: driver.driverName, value: driver.driverName, id: driver.driverId }))

// 外转方信息
export const transferees = ({ order }) => order.transferees.map((user) => ({ name: user.name, value: user.name, id: user.id, payType: user.payType }))
