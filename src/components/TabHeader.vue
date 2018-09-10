<!--  -->
<template>
  <div class="tab-header">
    <Tabs v-model="name1" :animated="false">
      <TabPane v-for="(tab, index) in tabs" :key="index" :label="`${tab.name} ${tab.count}`" :name="tab.name"></TabPane>
    </Tabs>
  </div>
</template>

<script>
// import BasePage from '@/basic/BasePage'
export default {
  name: 'tabHeader',

  props: {
    tabs: {
      type: Array,
      default () {
        return []
      },
      require: true
    }
  },

  data () {
    return {
      name1: '全部'
    }
  },

  computed: {},

  mounted () {},

  methods: {}
}
</script>
<style lang='stylus'>
  .tab-header
    margin -15px
    padding 7px 15px
    border-bottom 15px solid #f5f7f9
    .ivu-tabs-bar
      border-bottom none
      margin-bottom 1px
      .ivu-tabs-ink-bar
        bottom 2px
</style>
