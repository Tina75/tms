export default {
  data () {
    return {
      carrierId: void 0, // 承运商id
      defaultDriver: void 0, // 默认司机信息
      linkage: true, // 数据是否联动显示
      keyFields: 'info', // 联动时用来展示数据的字段名
      linkageFields: ['driverName', 'driverPhone', 'carType', 'carLength', 'carNo'] // 联动时需要被展示的具体字段
    }
  },
  methods: {
    selectCarrierHandler ({ row }) {
      this.carrierId = row.carrierId
      if (this.linkage) this.driverOptionLoaded()
    },

    driverOptionLoaded (drivers) {
      if (drivers && drivers.length) this.defaultDriver = drivers[0]
      if (this.defaultDriver) {
        this.autoComplete({ row: this.defaultDriver })
        this[this.keyFields].carNo = this.defaultDriver.carNo
      } else {
        this.linkageFields.forEach(key => {
          this[this.keyFields][key] = ''
        })
      }
    },

    autoComplete ({ row }) {
      this.linkageFields.forEach(key => {
        this[this.keyFields][key] = row[key]
      })
    }
  }
}
