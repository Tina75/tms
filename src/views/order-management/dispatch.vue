<template>
  <Tabs value="dispatchFreight">
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

export default {
  name: 'dispatch',
  metaInfo: {
    title: '调度工作台'
  },
  components: { DispatchFreight, DispatchPickup }
}
</script>

<style lang='stylus' scoped>

</style>
