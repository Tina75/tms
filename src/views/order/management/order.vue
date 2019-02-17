<template>
  <div>
    <tab-header :name="curStatusName" :tabs="status" @tab-change="handleTabChange"></tab-header>
    <tab-content
      ref="tabContent"
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
import { mapGetters, mapMutations } from 'vuex'
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
      'ImportId',
      'OrderGlobal',
      'IsOrderGlobal'
    ])
  },
  watch: {
    /* 订单管理页面不是新打开时 */
    IsOrderGlobal (val) {
      // console.log('订单管理页面不是新打开时')
      if (val) {
        this.searchGlobal()
      }
    }
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
    /* 判断是否为全局搜索 */
    if (this.IsOrderGlobal) {
      // console.log('新打开时调用')
      this.searchGlobal()
    }
  },
  destroyed () {
    this.$store.commit('setImported', null) // 将当前导入批次号置空
  },

  methods: {
    ...mapMutations([
      'setIsOrderGlobal'
    ]),
    /**
     * 订单全局搜索
     * */
    searchGlobal () {
      if (this.IsOrderGlobal) {
        this.$refs.tabContent.keyword = {
          status: null,
          keyword: this.OrderGlobal
        }
        /* 页签回到全部 */
        this.curStatusName = '全部'
        sessionStorage.setItem('ORDER_TAB_NAME', '全部')
        /* 清除搜索条件 */
        this.$refs.tabContent.clearKeywords()
        /* 全局搜索开关关闭 */
        this.setIsOrderGlobal(false)
      }
    },
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
      this.curStatusName = val
      sessionStorage.setItem('ORDER_TAB_NAME', val)
    }
  }
}
</script>
<style lang='stylus' scoped>
</style>
<style lang="stylus">
</style>
