<!--  -->
<template>
  <div class="tab-header">
    <Tabs v-model="name" :animated="false" @on-click="handleChangeTab">
      <TabPane v-for="(tab, index) in tabs" :key="index" :label="`${tab.name} ${tab.count}`" :name="tab.name"></TabPane>
    </Tabs>
  </div>
</template>

<script>
// import BasePage from '@/basic/BasePage'
export default {
  name: 'tabHeader',

  props: {
    name: {
      type: String,
      require: true
    },
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
    }
  },

  computed: {},

  mounted () {
  },

  methods: {
    handleChangeTab (val) {
      let operateVal = sessionStorage.getItem('operateVal')
      if (val !== operateVal) {
        this.$emit('tabChange', val)
        sessionStorage.setItem('operateVal', val)
      }
    }
  }
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
