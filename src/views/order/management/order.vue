<template>
  <div>
    <tab-header :name="curStatusName" :tabs="status" @tab-change="handleTabChange"></tab-header>
    <tab-content
      :tab-status="curStatusName"
      @refresh-tab="getOrderNum">
    </tab-content>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from '@/components/TabHeader'
import Server from '@/libs/js/server'
import TabContent from './components/TabContent'
import SearchMixin from './searchMixin'
// import jsCookie from 'js-cookie'
import { mapGetters } from 'vuex'
export default {
  name: 'order-management',

  components: {
    TabHeader,
    TabContent
  },
  mixins: [ BasePage, SearchMixin ],
  metaInfo: { title: '订单管理' },
  data () {
    return {
      status: [
        { name: '全部', count: '' },
        { name: '待提货', count: '' },
        { name: '待送货', count: '' },
        { name: '在途', count: '' },
        { name: '已到货', count: '' },
        { name: '已回单', count: '' },
        { name: '回收站', count: '' }
      ],
      curStatusName: ''
    }
  },

  computed: {
    ...mapGetters([
      'ImportId'
    ])
  },

  created () {
    // 刷新页面停留当前tab页
    if (!this.ImportId) {
      if (sessionStorage.getItem('ORDER_TAB_NAME')) {
        this.curStatusName = sessionStorage.getItem('ORDER_TAB_NAME')
      } else {
        sessionStorage.setItem('ORDER_TAB_NAME', '全部')
        this.curStatusName = '全部'
      }
    } else { // 批量导入点查看进入的传importId字段，订单列表显示《全部》tab页
      sessionStorage.setItem('ORDER_TAB_NAME', '全部')
      this.curStatusName = '全部'
    }
  },

  mounted () {
    this.getOrderNum()
  },

  destroyed () {
    this.$store.commit('setImported', null) // 将当前导入批次号置空
  },

  methods: {
    // 获取各状态订单数目
    getOrderNum () {
      Server({
        url: '/order/getOrderNumByStatusNew',
        method: 'get',
        data: {
          importId: this.ImportId || null
        }
      }).then((res) => {
        let list = res.data.data
        this.status = [
          { name: '全部', count: '' },
          { name: '待提货', count: list.pickup },
          { name: '待送货', count: list.dispatch },
          { name: '在途', count: list.transit },
          { name: '已到货', count: list.arrive },
          { name: '已回单', count: list.receipt },
          { name: '回收站', count: list.recycle }
        ]
      })
    },
    // tab状态栏切换
    handleTabChange (val) {
      let orderTabName = sessionStorage.getItem('ORDER_TAB_NAME')
      if (val !== orderTabName) {
        this.curStatusName = val
        sessionStorage.setItem('ORDER_TAB_NAME', val)
      }
    }
  }
}
</script>
<style lang='stylus' scoped>
</style>
<style lang="stylus">
</style>
