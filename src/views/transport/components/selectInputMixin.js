export default {
  data () {
    return {
      carrierId: void 0, // 承运商id
      defaultDriver: void 0, // 默认司机信息
      keyFields: 'info',
      linkageFields: ['driverName', 'driverPhone', 'carType', 'carLength', 'carNo'],
      linkage: true // 数据是否联动显示
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
