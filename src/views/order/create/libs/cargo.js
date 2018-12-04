import validator from '@/libs/js/validate'
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
    this.volume = null
    this.hasError = false
    this.errorMsg = {}
    if (props) {
      this.id = props.id || uniqueIndex++
      this.cargoName = props.cargoName
      // 重量，保留2位小数
      this.weight = props.weight
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
  validate () {
    if (!this.cargoName) {
      return { success: false, message: '请输入货物名称' }
    }
    // if (!this.weight && this.weight !== 0 && !this.volume && this.volume !== 0) {
    //   return { success: false, message: '货物重量和体积至少填写一项' }
    // }
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
    // if (field === 'weight' || field === 'volume') {
    //   if (!this.volume && this.volume !== 0 && !this.weight && this.weight !== 0) {
    //     if (!this.errorMsg['weight']) {
    //       this.errorMsg['weight'] = '货物重量和体积至少填写一项'
    //     }
    //   } else {
    //     delete this.errorMsg['weight']
    //     // delete this.errorMsg['volume']
    //   }
    // }
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
      cargoCost: parseInt(this.cargoCost * 100),
      quantity: this.quantity,
      unit: this.unit,
      remark1: this.remark1,
      remark2: this.remark2
    }
  }
}
