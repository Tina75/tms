<template>
  <div>
    <Tabs value="dispatchFreight">
      <TabPane label="运货调度" name="dispatchFreight">
        <DispatchFreight />
      </TabPane>
      <TabPane label="提货调度" name="dispatchPickup">
        <DispatchPickup />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import DispatchFreight from './views/dispatchFreight'
import DispatchPickup from './views/dispatchPickup'

export default {
  name: 'dispatch',
  metaInfo: {
    title: '调度工作台'
  },
  components: { DispatchFreight, DispatchPickup },
  mixins: [ BasePage ],
  data () {
    return {
    }
  },

  computed: {},

  mounted: function () {},

  methods: {}
}
</script>
<style lang='stylus' scoped>

</style>
