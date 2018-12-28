import BasePage from '@/basic/BasePage'
import PageTable from '@/components/page-table'
export default {
  mixins: [BasePage],
  // data () {
  //   return {
  //   }
  // },
  computed: {
    showButtons () {
      return this.currentBtns.filter(item => {
        return this.hasPower(item.code)
      })
    }
  },
  methods: {
    // 到详情页
    toDetail (p) {
      this.openTab({
        title: p.row.number,
        path: '/oilCard/detail/detail',
        query: {
          shipperOrderId: p.row.id
        }
      })
    },
    setFetchParams () {
      let obj = {}
      for (let key in this.queryParams) {
        this.queryParams[key] ? (obj[key] = this.queryParams[key]) : (obj[key] = undefined)
      }
      return obj
    },
    clearParams () {
      for (let key in this.queryParams) {
        if (this.queryParams[key]) {
          this.queryParams[key] = ''
        }
      }
    }
  },
  components: { PageTable }
}
