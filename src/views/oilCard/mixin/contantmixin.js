// 页面中所有常量枚举的方法
import { OPERATETYPELIST, CARDTYPELIST, ISSUERLIST, STATUSLIST } from '../constant/enum'
export default {
  data () {
    return {
      operateTypeList: OPERATETYPELIST,
      cardTypeList: CARDTYPELIST,
      issuerList: ISSUERLIST,
      statusList: STATUSLIST
    }
  },
  methods: {
    // 油卡类型
    typeToName (value) {
      return this.toName(this.cardTypeList, value)
    },
    // 状态
    statusToName (value) {
      return this.toName(this.statusList, value)
    },
    // 发卡机构
    issuerToName (value) {
      return this.toName(this.issuerList, value)
    },
    // 操作类型
    operateType (value) {
      return this.toName(this.operateTypeList, value)
    },
    // 状态 =》 名字 共有方法
    toName (array, value) {
      for (let i = 0; i < array.length; i++) {
        if (value === array[i].value) {
          return array[i].label
        }
      }
      return ''
    },
    cardFormat (card) {
      if (!card) return '-'
      return card.split('').map((item, index) => {
        if (index % 4 === 0 && index !== 0) return ' ' + item
        else return item
      }).join('')
    }
  }
}
