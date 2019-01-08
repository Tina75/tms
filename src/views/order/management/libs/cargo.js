export default class Cargo {
  /**
   *
   * @param {Object} props
   */
  constructor (props) {
    this.id = props.id || null
    this.orderId = props.orderId || null
    this.packing = props.packing || null
    this.quantity = props.quantity || null
    this.dimension = props.dimension || null
    this.companyId = props.companyId || null
    this.cargoName = props.cargoName || null
    this.cargoCost = props.cargoCost || null
    this.volume = props.volume || null
    this.cargoNo = props.cargoNo || null
    this.unit = props.unit || null
    this.weight = props.weight || null
    this.weightKg = props.weightKg || null
    this.createTime = props.createTime || null

    this.remark1 = props.remark1 || null
    this.remark2 = props.remark2 || null
  }
}
