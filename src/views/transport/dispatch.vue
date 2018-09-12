<template>
  <div>
    <Tabs value="dispatchFreight">
      <TabPane label="运货调度" name="dispatchFreight">
        <dispatchFreight />
      </TabPane>
      <TabPane label="提货调度" name="dispatchPickup">

      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import dispatchFreight from './views/dispatchFreight'

export default {
  name: 'dispatch',
  metaInfo: {
    title: '调度工作台'
  },
  components: { dispatchFreight },
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
