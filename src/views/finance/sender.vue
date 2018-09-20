<template>
  <div class="finance-list">
    <TabHeader :tabs="tabList" @tabChange="tabChanged"></TabHeader>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import { mapGetters, mapActions } from 'vuex'
import TabHeader from '@/components/TabHeader'

export default {
  name: 'account-list',
  metaInfo: {
    title: '发货方对账'
  },
  mixins: [ BasePage ],
  components: {TabHeader},
  data () {
    return {
      tabList: [
        { name: '待核销', count: '' },
        { name: '对账单', count: '' },
        { name: '已核销', count: '' }
      ]
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapActions([]),
    tabChanged () {}
  }
}
</script>
<style lang="stylus" scoped>
.account-list
  padding: 20px
  .block
    background-color: #ffffff
    padding: 20px
    box-shadow: 0 3px 5px 0 #cccccc
    margin-bottom: 15px
    .ivu-select
      width: 100px
  .data-block
    text-align: right
    .ivu-table-wrapper
      margin-top: 20px
      margin-bottom: 20px
</style>
