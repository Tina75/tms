<template>
  <div class="list-sender">
    <slot></slot>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    listKey: {
      type: String,
      required: true
    },
    onClick: Function
  },
  data () {
    return {
      activeKey: ''
    }
  },
  methods: {
    /**
     * 点击某一个发货方
     */
    handleClick (item) {
      if (this.activeKey) {
        this.toggleActive()
      }
      this.activeKey = item[this.listKey]
      this.$emit('on-click', item)
    },
    /**
     * 上一次选中的项目取消选中
     */
    toggleActive () {
      for (let i in this.$slots.default) {
        if (typeof this.$slots.default[i] === 'object') {
          let _childvm = this.$slots.default[i].componentInstance
          if (_childvm.item[this.listKey] === this.activeKey) {
            _childvm.toggleActive()
            break
          }
        }
      }
    },
    /**
     * 清除activekey
     * 1. 在列表搜索的时候
     * 2. 在核销之后，有可能触发
     */
    clearActiveKey () {
      if (this.activeKey) {
        this.toggleActive()
        this.activeKey = ''
      }
    }
  }
}
</script>

<style>

</style>
