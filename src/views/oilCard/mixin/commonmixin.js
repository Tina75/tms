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
    setFetchParams () {
      let obj = {}
      for (let key in this.queryParams) {
        if (key === 'systemDate' || key === 'operateDate') {
          this.queryParams[key] ? (obj[key] = new Date(this.queryParams[key]).Format('yyyy-MM-dd')) : (obj[key] = undefined)
        } else {
          this.queryParams[key] ? (obj[key] = this.queryParams[key]) : (obj[key] = undefined)
        }
      }
      return obj
    },
    clearParams () {
      for (let key in this.queryParams) {
        if (this.queryParams[key]) {
          this.queryParams[key] = ''
        }
      }
      this.fetchData()
    }
  },
  components: { PageTable }
}
