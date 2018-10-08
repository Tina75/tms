<template>
  <div class="finance-list">
    <div class="tab-box">
      <Tabs v-model="active">
        <TabPane label="待核销" name="1" />
        <TabPane label="对账单" name="2" />
        <TabPane label="已核销" name="3" />
      </Tabs>
    </div>
    <div class="data-container">
      <writing-off v-if="active === '1'" :scene="3"></writing-off>
      <checking-order v-if="active === '2'" :scene="3"></checking-order>
      <Written-Off v-if="active === '3'" :scene="3"></Written-Off>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import { mapGetters, mapActions } from 'vuex'
import WritingOff from './components/WritingOff'
import CheckingOrder from './components/CheckingOrder'
import WrittenOff from './components/WrittenOff'

export default {
  name: 'transferList',
  metaInfo: {
    title: '外转方对账'
  },
  components: {CheckingOrder, WritingOff, WrittenOff},
  mixins: [ BasePage ],
  data () {
    return {
      active: '1'
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapActions([]),
    tabChanged (tab) {
      console.log(tab)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .tab-box
    margin -15px
    padding 7px 15px
    border-bottom 15px solid #f5f7f9
    /deep/ .ivu-tabs-bar
      border-bottom none
      margin-bottom 1px
      .ivu-tabs-ink-bar
        bottom 2px
</style>
