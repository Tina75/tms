
export default {
  props: {
    /**
     * 是否校验司机绑定其他车辆
     * 新增，修改车辆都需要加
     */
    isValidate: {
      type: Boolean,
      default: false
    },
    /**
     * 需要忽略的司机编号列表，修改车辆的时候需要添加
     */
    filteredValidate: {
      type: Array,
      default: () => []
    },
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
