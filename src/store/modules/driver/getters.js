/**
 * 车辆信息
 * @param {object} state
 */
export const ownCars = (state) => state.cars.map((car) => {
  return {
    name: car.carNo,
    value: car.carNo,
    id: car.id,
    carStatus: car.carStatus, // 车辆状态，1： 空闲，2：运输中
    driverName: car.driverName,
    driverId: car.driverId,
    driverStatus: car.driverStatus, // 司机状态，1： 空闲，2：运输中
    carLength: car.carLength, // 车长
    carType: car.carType, // 车型
    assistantDriverName: car.assistantDriverName,
    assistantDriverId: car.assistantDriverId
  }
})
/**
 * 司机信息
 * @param {object} state
 */
export const ownDrivers = (state) => state.drivers.map((driver) => {
  return {
    name: driver.driverName,
    value: driver.driverName,
    driverPhone: driver.driverPhone,
    driverStatus: driver.driverStatus, // 司机状态，1： 空闲，2：运输中
    id: driver.id,
    type: driver.type
  }
})
