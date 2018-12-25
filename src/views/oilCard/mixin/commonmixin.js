import BasePage from '@/basic/BasePage'
import PageTable from '@/components/page-table'
import { OPERATETYPELIST, CARDTYPELIST, ISSUERLIST, STATUSLIST } from '../constant/enum'
export default {
  mixins: [BasePage],
  data () {
    return {
      operateTypeList: OPERATETYPELIST,
      cardTypeList: CARDTYPELIST,
      issuerList: ISSUERLIST,
      statusList: STATUSLIST
    }
  },
  computed: {
    showButtons () {
      return this.currentBtns.filter(item => {
        return this.hasPower(item.code)
      })
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
    // 状态 =》 名字 共有方法
    toName (array, value) {
      for (let i = 0; i < array.length; i++) {
        if (value === array[i].value) {
          return array[i].label
        }
      }
      return ''
    }
  },
  components: { PageTable }
}
