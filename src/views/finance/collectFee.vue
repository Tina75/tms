<template>
  <div class="collect-fee">
    <TabHeader :value="activeTab" :list="tabs" @on-change="handleChangeTab" />
    <div class="collect-fee__content">
      <WaitCollect v-if="activeTab === 'WAIT_COLLECT'"></WaitCollect>
      <WaitPay v-if="activeTab === 'WAIT_PAY'"></WaitPay>
      <Paied v-if="activeTab === 'PAIED'"></Paied>
    </div>
  </div>
</template>

<script>
/**
 * 代收货款对账
 * v1.3确定，v1.4上线
 * created by mys 2018-11-2
 */
import BasePage from '@/basic/BasePage'
import TabHeader from './components/TabHeader'
import WaitCollect from './components/WaitCollect.vue'
import WaitPay from './components/WaitPay.vue'
import Paied from './components/Paied.vue'
import { CollectTabs, CollectTabMap } from './constant/tabs.js'

export default {
  components: {
    TabHeader,
    WaitCollect, // 未收
    WaitPay, // 已收未付
    Paied // 已付款
  },
  metaInfo: {
    title: '代收货款对账'
  },
  mixins: [BasePage],
  data () {
    return {
      tabs: CollectTabs,
      activeTab: 'WAIT_COLLECT'
    }
  },
  methods: {
    /**
     * 切换tab
     */
    handleChangeTab (activeName) {
      this.activeTab = activeName
      if (CollectTabMap.WAIT_COLLECT === activeName) {
        // 未收
        console.log(activeName)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.collect-fee
  margin-bottom -20px
  &__content
    margin 35px 0 0
</style>
