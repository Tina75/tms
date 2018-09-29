import City from '@/libs/js/City'
import { CAR_TYPE, CAR_LENGTH, getCarType, getCarLength } from '@/libs/constant/carInfo'

const FORMATTERS = {
  // 格式化时间
  timeFormatter (timestamp) {
    if (!timestamp) return ''
    return new Date(timestamp).Format('yyyy-MM-dd hh:mm:ss')
  },

  // 格式化城市
  cityFormatter (code) {
    if (!code) return ''
    return Array.from(new Set(City.codeToFullName(code, 3, '-').split('-'))).join('')
  },

  // 格式化车型
  carTypeFormatter: getCarType,

  // 格式化车长
  carLengthFormatter: getCarLength
}

export default {
  data () {
    return {
      carType: CAR_TYPE, // 车型选择框
      carLength: CAR_LENGTH // 车长选择框
    }
  },

  filters: {
    ...FORMATTERS
  },

  methods: {
    ...FORMATTERS
  }
}
