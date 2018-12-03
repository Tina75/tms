
export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          carNo: '', // 车牌号
          carType: '', // 车型
          carLength: '', // 车长
          driverName: '', // 主司机姓名
          driverPhone: '', // 主司机手机号
          assistantDriverName: '', // 副司机姓名
          assistantDriverPhone: '' // 副司机手机号

        }
      }
    },
    onCreate: Object
  },
  mounted () {
    // console.log('viewmode: ', this.viewMode)
  }
}
