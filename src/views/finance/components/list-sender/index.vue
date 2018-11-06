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
  mounted () {

  },
  methods: {
    /**
     * 点击某一个发货方
     */
    handleClick (item) {
      if (this.activeKey) {
        for (let i in this.$slots.default) {
          let _childvm = this.$slots.default[i].componentInstance
          if (_childvm.item[this.listKey] === this.activeKey) {
            _childvm.toggleActive()
            break
          }
        }
      }
      this.activeKey = item[this.listKey]
      this.$emit('on-click', item)
    }
  }
}
</script>

<style>

</style>
