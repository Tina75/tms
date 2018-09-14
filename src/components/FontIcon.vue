<template>
  <i :class="classes"></i>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
      default: ''
    },
    color: String,
    size: [String, Number]
  },
  computed: {
    classes () {
      return ['icon', 'font_family', this.type ? `icon-${this.type}` : '']
    },
    styles () {
      let style = {}
      if (this.color) {
        style.color = this.color
      }
      if (this.size) {
        style['font-size'] = `${this.size}px`
      }
      return style
    }
  }
}
</script>

<style>

</style>
