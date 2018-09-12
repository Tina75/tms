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
    }
  },
  computed: {
    classes () {
      return ['icon', 'icon-family', this.type ? `icon-${this.type}` : '']
    }
  }
}
</script>

<style>

</style>
