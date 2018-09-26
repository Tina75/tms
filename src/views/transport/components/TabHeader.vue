<template>
  <div class="tab-header">
    <Tabs v-model="current" :animated="false" @on-click="handleChangeTab">
      <TabPane v-for="(tab, index) in tabs" :key="index" :label="`${tab.name} ${tab.count}`" :name="tab.name"></TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: 'TabHeader',
  props: {
    type: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array,
      default: () => [],
      require: true
    }
  },

  data () {
    return {
      current: this.tabs[0].name
    }
  },

  created () {
    const current = window.sessionStorage['TABHEADER_' + this.type]
    if (current) {
      this.current = current
      this.handleChangeTab(this.current)
    }
  },

  methods: {
    handleChangeTab (name) {
      window.sessionStorage.setItem('TABHEADER_' + this.type, name)
      this.$emit('on-change', name)
    }
  }
}
</script>
<style lang='stylus'>
  .tab-header
    margin -15px
    padding 7px 15px
    border-bottom 15px solid #efefef
    .ivu-tabs-bar
      border-bottom none
      margin-bottom 1px
      .ivu-tabs-ink-bar
        bottom 2px
</style>
