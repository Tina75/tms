import validator from '@/libs/js/validate'
import float from '@/libs/js/float'
import { NumberPrecesion, divideFee, multiplyFee } from '@/libs/js/config'
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

    this.cargoCost = null
    this._weight = null
    this.volume = null
    this.hasError = false
    this.errorMsg = {}

    const self = this
    this.dimension = {
      _length: null,
      _width: null,
      _height: null,
      set length (value) {
        this._length = value
        if (this._length && this._height && this._width) {
          self.volume = float.round(this._length * this._height * this._width / (1000 * 1000 * 1000), NumberPrecesion.volume)
        }
      },
      get length () {
        return this._length
      },
      set width (value) {
        this._width = value
        if (this._length && this._height && this._width) {
          self.volume = float.round(this._length * this._height * this._width / (1000 * 1000 * 1000), NumberPrecesion.volume)
        }
      },
      get width () {
        return this._width
      },
      set height (value) {
        this._height = value
        if (this._length && this._height && this._width) {
          self.volume = float.round(this._length * this._height * this._width / (1000 * 1000 * 1000), NumberPrecesion.volume)
        }
      },
      get height () {
        return this._height
      }
    }
    this.cargoNo = null
    this.unit = null

    this.orderNo = null

    if (props) {
      this.id = props.id || uniqueIndex++
      this.cargoName = props.cargoName
      this.cargoNo = props.cargoNo

      if (props.dimension) {
        this.dimension._length = props.dimension.length || null
        this.dimension._width = props.dimension.width || null
        this.dimension._height = props.dimension.height || null
      }
      if (!transfer) {
        // 货值，整数
        this.cargoCost = props.cargoCost || null
      } else {
        this.cargoCost = divideFee(props.cargoCost || 0)
      }
      this._weight = props.weight || null
      this.volume = props.volume || null
      // 数量
      this.quantity = props.quantity || null
      // 包装
      this.unit = props.unit || null
      // 备注 100
      this.remark1 = props.remark1 || null
      this.remark2 = props.remark2 || null
      this.orderNo = props.orderNo || null
    }
  }
  get weight () {
    return this._weight
  }
  set weight (value) {
    this._weight = value
  }
  get weightKg () {
    return this._weight === null ? null : float.round(this._weight * 1000)
  }
  set weightKg (value) {
    this._weight = float.round(value / 1000, NumberPrecesion.weight)
  }

  validate () {
    if (!this.cargoName) {
      return { success: false, message: '请输入货物名称' }
    }
    if (this.cargoCost && !validator.fee(this.cargoCost)) {
      return { success: false, message: '货值整数位最多输入9位,4位小数' }
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
        this.errorMsg[field] = '货值整数位最多输入9位,4位小数'
      } else {
        delete this.errorMsg[field]
      }
    }
    // if (field === 'orderNo') {
    //   if (!this.orderNo) {
    //     this.errorMsg[field] = '请输入订单号'
    //   } else {
    //     delete this.errorMsg[field]
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
      cargoCost: multiplyFee(this.cargoCost),
      quantity: this.quantity,
      unit: this.unit,
      remark1: this.remark1,
      remark2: this.remark2,
      cargoNo: this.cargoNo,
      dimension: {
        height: this.dimension.height || null,
        width: this.dimension.width || null,
        length: this.dimension.length || null
      }
    }
  }
  // 异常货物信息
  toExceptionJson () {
    return {
      cargoName: this.cargoName,
      orderId: this.orderNo,
      weight: this.weight,
      weightKg: this.weightKg,
      volume: this.volume,
      cargoCost: multiplyFee(this.cargoCost),
      quantity: this.quantity,
      unit: this.unit,
      cargoNo: this.cargoNo || '-',
      dimension: {
        height: this.dimension.height || null,
        width: this.dimension.width || null,
        length: this.dimension.length || null
      }
    }
  }
  validateExp () {
    if (!this.cargoName) {
      return { success: false, message: '请输入货物名称' }
    }
    if (!this.orderNo) {
      return { success: false, message: '请输入订单号' }
    }
    if (this.cargoCost && !validator.fee(this.cargoCost)) {
      return { success: false, message: '货值整数位最多输入9位,4位小数' }
    }
    return { success: true }
  }
}
