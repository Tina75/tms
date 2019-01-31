<template>
  <div class="collect-fee">
    <TabHeader :name="activeTab" :tabs="tabs" @tab-change="handleChangeTab" />
    <div class="collect-fee__content">
      <WaitCollect v-if="activeTab === '未收'"></WaitCollect>
      <WaitPay v-if="activeTab === '已收未付'"></WaitPay>
      <Paied v-if="activeTab === '已付款'"></Paied>
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
import TabHeader from '@/components/TabHeader'
import WaitCollect from '../components/WaitCollect.vue'
import WaitPay from '../components/WaitPay.vue'
import Paied from '../components/Paied.vue'
import { CollectTabs } from '../constant/tabs.js'

export default {
  name: 'finance-collect-fee',
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
      activeTab: '未收'
    }
  },
  methods: {
    /**
     * 切换tab
     */
    handleChangeTab (activeName) {
      this.activeTab = activeName
    }
  }
}
</script>

<style lang="stylus" scoped>
.collect-fee
  &__content
    margin 35px 0 0
</style>
