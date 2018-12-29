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

    this.cargoCost = null
    this._weight = null
    this.volume = null
    this.hasError = false
    this.errorMsg = {}
    // 1.0.9新增
    // this.dimension = {
    //   length: null,
    //   width: null,
    //   height: null
    // }
    const self = this
    this.dimension = {
      _length: null,
      _width: null,
      _height: null,
      set length (value) {
        this._length = value
        if (this._length && this._height && this._width) {
          self.volume = float.round(this._length * this._height * this._width / (1000 * 1000 * 1000), 6)
        }
      },
      get length () {
        return this._length
      },
      set width (value) {
        this._width = value
        if (this._length && this._height && this._width) {
          self.volume = float.round(this._length * this._height * this._width / (1000 * 1000 * 1000), 6)
        }
      },
      get width () {
        return this._width
      },
      set height (value) {
        this._height = value
        if (this._length && this._height && this._width) {
          self.volume = float.round(this._length * this._height * this._width / (1000 * 1000 * 1000), 6)
        }
      },
      get height () {
        return this._height
      }
    }
    this.cargoNo = null
    this.unit = null

    if (props) {
      this.id = props.id || uniqueIndex++
      this.cargoName = props.cargoName
      this.cargoNo = props.cargoNo
      // 重量，保留2位小数
      this._weight = props.weight
      this.dimension._length = props.dimension.length || null
      this.dimension._width = props.dimension.width || null
      this.dimension._height = props.dimension.height || null
      if (!transfer) {
        // 货值，整数
        this.cargoCost = props.cargoCost
      } else {
        this.cargoCost = (props.cargoCost || 0) / 100
      }
      // 体积方，保留1位小数
      this.volume = props.volume
      // 数量
      this.quantity = props.quantity || null
      // 包装, 10个字
      this.unit = props.unit
      // 备注 100
      this.remark1 = props.remark1
      this.remark2 = props.remark2
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
    this._weight = float.round(value / 1000, 3)
  }
  // set volume (value) {
  //   this._volume = value
  // }
  // get volume () {
  //   if (!this._volume) {
  //     return float.round(this.dimension.length * this.dimension.width * this.dimension.height / 1000 * 1000 * 1000,)
  //   } else {
  //     return this._volume
  //   }
  // }
  // set dimension (value) {
  //   console.log(value)
  //   this._dimension = value
  // }
  // get dimension () {
  //   return this._dimension
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
  // handleDemsion () {
  //   const obj = {}
  //   for (let i in this.dimension) {
  //     obj[i] = this.dimension[i] || null
  //   }
  //   return obj
  // }
  toJson () {
    return {
      cargoName: this.cargoName,
      weight: this.weight,
      volume: this.volume,
      cargoCost: float.round(this.cargoCost * 100),
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
}
