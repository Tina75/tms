import validator from '@/libs/js/validate'
import float from '@/libs/js/float'
let uniqueIndex = 0
export default class Cargo {
  /**
   *
   * @param {Object} props
   * @param {Boolean} transfer 需要除以100转换为元
   */
  constructor (props, transfer = false) {
    this.quantity = null
    this.editable = false
    // inputnumber 控件不会默认设置1了
    this.cargoCost = null
    this.weight = null
    this.weightKg = null
    this.volume = null
    this.hasError = false
    this.errorMsg = {}
    if (props) {
      this.id = props.id || uniqueIndex++
      this.cargoName = props.cargoName
      // 重量，保留2位小数
      this.weight = props.weight
      this.weightKg = float.floor(this.weight * 1000)
      // 体积方，保留1位小数
      this.volume = props.volume
      if (!transfer) {
        // 货值，整数
        this.cargoCost = props.cargoCost
      } else {
        this.cargoCost = (props.cargoCost || 0) / 100
      }

      // 数量
      this.quantity = props.quantity || null
      // 包装, 10个字
      this.unit = props.unit
      // 备注 100
      this.remark1 = props.remark1
      this.remark2 = props.remark2
    }
  }
  // get weight () {

  // }
  // set weight (value) {
  //   this.weightKg = value * 1000
  // }
  validate () {
    if (!this.cargoName) {
      return { success: false, message: '请输入货物名称' }
    }
    return { success: true }
  }

  validateField (field) {
    if (field === 'cargoName') {
      if (!this.cargoName) {
        this.errorMsg[field] = '请输入货物名称'
      } else {
        delete this.errorMsg[field]
      }
    }
    if (field === 'cargoCost' && this.cargoCost) {
      if (!validator.fee(this.cargoCost)) {
        this.errorMsg[field] = '费用整数位最多输入9位'
      } else {
        delete this.errorMsg[field]
      }
    }
    this.hasError = false
    for (let name in this.errorMsg) {
      if (name) {
        this.hasError = true
        break
      }
    }
  }
  toJson () {
    return {
      cargoName: this.cargoName,
      weight: this.weight,
      volume: this.volume,
      cargoCost: float.round(this.cargoCost * 100),
      quantity: this.quantity,
      unit: this.unit,
      remark1: this.remark1,
      remark2: this.remark2
    }
  }
}
