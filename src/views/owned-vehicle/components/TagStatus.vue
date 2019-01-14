<template>
  <TagText :color="textColor" :background-color="bgcolor">
    <slot></slot>
  </TagText>
</template>

<script>
import TagText from './TagText.js'
export default {
  name: 'tag-status',
  components: {
    TagText
  },
  props: {
    type: {
      type: String,
      validator (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'info', 'danger'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      info: {
        bgcolor: '#E9FCFF',
        color: '#00A4BD'
      },
      warning: {
        bgcolor: '#FFF7E6',
        color: '#FA8C15'
      },
      success: {
        bgcolor: '#E5FFF3',
        color: '#00C185'
      },
      danger: {
        bgcolor: '#FFF1F0',
        color: '#EE2017'
      }
    }
  },
  computed: {
    textColor () {
      return this[this.type].color
    },
    bgcolor () {
      return this[this.type].bgcolor
    }
  }
}
</script>

<style>

</style>
