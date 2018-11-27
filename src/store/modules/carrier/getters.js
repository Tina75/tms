// 承运商列表
export const carriers = (state) => state.carriers.map((user) => ({ name: user.carrierName, value: user.carrierName, id: user.carrierId }))

// 承运商车辆信息
export const carrierCars = (state) => state.cars.map((car) => ({ name: car.carNO, value: car.carNO, id: car.carId }))

// 承运商司机信息
export const carrierDrivers = (state) => state.drivers.map((driver) => ({ name: driver.driverName, value: driver.driverName, id: driver.driverId, driverPhone: driver.driverPhone }))
