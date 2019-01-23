<template>
  <div name="fade" mode="out-in">
    <div v-if="show" :class="prefixClass">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const prefix = 'vertical-tab-item'
export default {
  name: 'vertical-tab-item',
  props: {
    name: {
      type: String
    },
    label: {
      type: [String, Function],
      default: ''
    },
    icon: {
      type: Object
    }
  },
  data () {
    return {
      prefixClass: prefix,
      show: false
    }
  },
  mounted () {
    this.updateTabs()
  },
  methods: {
    updateTabs () {
      this.$parent.$parent.$parent.updateTabs(this)
    },
    fadeIn () {
      if (!this.show) {
        this.show = true
      }
    },
    fadeOut () {
      if (this.show) {
        this.show = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.vertical-tab-item
  color #333
  font-size 14px
  position relative
  margin 20px 20px 0
  display block
</style>
