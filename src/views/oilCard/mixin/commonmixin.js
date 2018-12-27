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
    }
  },
  components: { PageTable }
}
