<template>
  <Tabs :value="current">
    <TabPane label="送货调度" name="dispatchFreight">
      <DispatchFreight />
    </TabPane>
    <TabPane label="提货调度" name="dispatchPickup">
      <DispatchPickup />
    </TabPane>
  </Tabs>
</template>

<script>
import DispatchFreight from './dispatch/dispatchFreight'
import DispatchPickup from './dispatch/dispatchPickup'

let hasTabCode = false

export default {
  name: 'dispatch',
  metaInfo: {
    title: '调度工作台'
  },
  components: { DispatchFreight, DispatchPickup },
  data () {
    return {
      current: 'dispatchFreight'
    }
  },
  created () {
    if (this.$route.query.tab && !hasTabCode) {
      hasTabCode = true
      this.current = Number(this.$route.query.tab) === 2 ? 'dispatchPickup' : 'dispatchFreight'
    }
  },
  destroyed () { hasTabCode = false }
}
</script>

<style lang='stylus' scoped>

</style>
