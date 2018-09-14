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
      this.remark = props.remark
    }
  }

  // set weight (value) {
  //   this.weight = value ? value.toFixed(2) : value
  // }
  // set volume (value) {
  //   this.volume = value ? value.toFixed(1) : value
  // }
  // set cargoCost (value) {
  //   this.cargoCost = value ? parseInt(value) : value
  // }
  // set quantity (value) {
  //   this.quantity = value ? parseInt(value) : value
  // }
}
