<!--  -->
<template>
  <div class="tab-header">
    <Tabs v-model="tabName" :animated="false" @on-click="handleChangeTab">
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
      tabName: '待提货'
    }
  },

  computed: {},

  mounted () {
    this.tabName = this.name
  },

  methods: {
    handleChangeTab (val) {
      if (this.$route.path === '/order/management/order') {
        let orderTabName = sessionStorage.getItem('ORDER_TAB_NAME')
        if (val !== orderTabName) {
          this.$emit('tabChange', val)
          sessionStorage.setItem('ORDER_TAB_NAME', val)
        }
      } else if (this.$route.path === '/transport/receipt') {
        let receiptTabName = sessionStorage.getItem('RECEIPT_TAB_NAME')
        if (val !== receiptTabName) {
          this.$emit('tabChange', val)
          sessionStorage.setItem('RECEIPT_TAB_NAME', val)
        }
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
