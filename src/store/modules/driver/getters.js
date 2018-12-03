/**
 * 车辆信息
 * @param {object} state
 */
export const ownCars = (state) => state.cars.map((car) => {
  return {
    name: car.carNo,
    value: car.carNo,
    id: car.id,
    driverName: car.driverName,
    driverId: car.driverId,
    carLength: car.carLength, // 车长
    carType: car.carType // 车型
  }
})
/**
 * 司机信息
 * @param {object} state
 */
export const ownDrivers = (state) => state.drivers.map((driver) => {
  return {
    name: driver.driverName + ' ' + driver.driverPhone,
    value: driver.driverName,
    id: driver.id
  }
})
