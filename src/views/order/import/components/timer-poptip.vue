
<template>
  <div class="timer-poptip">
    <Tooltip v-if="!hidden" :max-width="maxWidth" :content="content" always transfer>
      <slot></slot>
    </Tooltip>
    <div v-else class="timer-poptip__slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * 需要5秒之内一直显示poptip的内容，5秒后消失
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-26 09:27:18
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-12-26 11:01:40
 */
export default {
  name: 'timer-poptip',
  props: {
    maxWidth: [Number, String],
    // 默认显示5s,5s后消失
    interval: {
      type: Number,
      default: 5
    },
    // 提示内容
    content: {
      type: String,
      default: ''
    },
    // 是否启用本组件
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timer: null,
      hidden: this.disabled
    }
  },
  watch: {
    disabled (value) {
      this.hidden = value
      if (!this.hidden) {
        this.startTimer()
      }
    }
  },
  mounted () {
    if (!this.hidden) {
      this.startTimer()
    }
  },
  beforeDestory () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  methods: {
    startTimer () {
      this.timer = setTimeout(() => {
        this.hidden = true
      }, this.interval * 1000)
    }
  }
}
</script>

<style lang="stylus" scoped>
.timer-poptip
  display inline-block
  &__slot
    display inline-block
</style>
