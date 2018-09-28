<template>
  <div ref="$box">
    <Tabs value="dispatchFreight">
      <TabPane label="送货调度" name="dispatchFreight">
        <DispatchFreight :width="tabWidth" />
      </TabPane>
      <TabPane label="提货调度" name="dispatchPickup">
        <DispatchPickup :width="tabWidth" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import DispatchFreight from './dispatch/dispatchFreight'
import DispatchPickup from './dispatch/dispatchPickup'

export default {
  name: 'dispatch',
  metaInfo: {
    title: '调度工作台'
  },
  components: { DispatchFreight, DispatchPickup },
  mixins: [ BasePage ],
  data () {
    return {
      tabWidth: 0
    }
  },

  mounted () {
    this.computeTabWidth()
  },

  methods: {
    computeTabWidth () {
      const $box = this.$refs.$box
      this.tabWidth = $box.offsetWidth
      window.onresize = () => {
        this.tabWidth = $box.offsetWidth
      }
    }
  }
}
</script>

<style lang='stylus' scoped>

</style>
