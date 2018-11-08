<template>
  <div class="tab-top-box">
    <Tabs :value="activeName" @on-click="handleChangeTab">
      <TabPane v-for="tab in list" :key="tab.name" :label="getLabel(tab)" :name="tab.name">
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
/**
 * 顶部tab选项卡切换组件
 */
export default {
  props: {
    value: String,
    type: {
      type: String,
      validator (type) {
        return ['line', 'card'].indexOf(type) !== -1
      },
      default: 'line'
    },
    size: {
      type: String,
      validator (size) {
        return ['default', 'small'].indexOf(size) !== -1
      }
    },
    /**
     * tab源
     * [
     *  {label:'标签1'， name:'tab1'， count:1}
     * ]
     */
    list: {
      type: Array,
      default: () => []
    },
    onChange: Function
  },
  data () {
    return {
      activeName: this.value || this.list[0].name || ''
    }
  },
  computed: {

  },
  created () {

  },
  methods: {
    /**
     * tab切换回调
     * @param {String} selectName 选中的选项卡名称
     */
    handleChangeTab (selectName) {
      this.$emit('on-change', selectName)
    },
    getLabel (tab) {
      return tab.label + ' ' + tab.count
    }
  }
}
</script>

<style lang="stylus" scoped>
  .tab-top-box
    margin -15px
    padding 7px 15px
    border-bottom 15px solid #f5f7f9
    /deep/ .ivu-tabs-bar
      border-bottom none
      margin-bottom 1px
      .ivu-tabs-ink-bar
        bottom 2px
</style>
