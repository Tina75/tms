<template>
  <div class="collect-fee">
    <TabHeader :list="tabs" @on-change="handleChangeTab" />
    <div class="collect-fee__content">
      <WaitCollect></WaitCollect>
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
import { CollectTabs, CollectTabMap } from './constant/tabs.js'
export default {
  components: {
    TabHeader,
    WaitCollect
  },
  metaInfo: {
    title: '代收货款对账'
  },
  mixins: [BasePage],
  data () {
    return {
      tabs: CollectTabs
    }
  },
  methods: {
    /**
     * 切换tab
     */
    handleChangeTab (activeName) {
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
  &__content
    margin 35px 0 15px
</style>
