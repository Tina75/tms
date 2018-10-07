import City from '@/libs/js/City'
import { CAR_TYPE, CAR_LENGTH, getCarType, getCarLength } from '@/libs/constant/carInfo'

const FORMATTERS = {
  // 格式化时间
  timeFormatter (timestamp) {
    if (!timestamp) return ''
    return new Date(timestamp).Format('yyyy-MM-dd hh:mm')
  },

  // 格式化城市
  cityFormatter (code) {
    if (!code) return ''
    return Array.from(new Set(City.codeToFullName(code, 3, '-').split('-'))).join('')
  },

  // 格式化车型
  carTypeFormatter: getCarType,

  // 格式化车长
  carLengthFormatter: getCarLength,

  // 格式化支付方式
  payTypeFormatter (type, isTransfer) {
    let text = ''
    switch (Number(type)) {
      case 1:
        text = isTransfer ? '现付' : '按单结'
        break
      case 2:
        text = isTransfer ? '到付' : '月结'
        break
      case 3:
        text = '回单付'
        break
      case 4:
        text = '月结'
        break
      default: break
    }
    return text
  }

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
    ...FORMATTERS,

    // 表格内容渲染方法
    // 当text内容长度大于12时截取显示...并使用tooltip
    // 当text无内容时替换为-
    tableDataRender (h, text, unEllipsis) {
      text = text.toString()
      let showText = (text.length > 12 && !unEllipsis) ? text.substr(0, 12) + '...' : text
      showText = showText || '-'
      if (text.length <= 12 || unEllipsis) {
        return h('span', showText)
      } else {
        return h('Tooltip', {
          props: {
            content: text
          }
        }, showText)
      }
    }
  }
}
