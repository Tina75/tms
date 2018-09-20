let uniqueIndex = 0
export default class Cargo {
  constructor (props) {
    this.quantity = 1
    this.editable = false
    this.index = uniqueIndex++
    if (props) {
      this.cargoName = props.cargoName
      // 重量，保留2位小数
      this.weight = props.weight
      // 体积方，保留1位小数
      this.volume = props.volume
      // 货值，整数
      this.cargoCost = props.cargoCost
      // 数量
      this.quantity = props.quantity || 1
      // 包装, 10个字
      this.unit = props.unit
      // 备注 100
      this.remark1 = props.remark1
      this.remark2 = props.remark2
    }
  }
  validate () {
    if (!this.cargoName) {
      return { success: false, message: '请输入货物名称' }
    }
    if (!this.weight && !this.volume) {
      return { success: false, message: '货物重量和体积至少填写一项' }
    }
    return { success: true }
  }

  toJson () {
    return {
      cargoName: this.cargoName,
      weight: this.weight,
      volume: this.volume,
      cargoCost: this.cargoCost * 100,
      quantity: this.quantity,
      unit: this.unit,
      remark1: this.remark1,
      remark2: this.remark2
    }
  }
}
