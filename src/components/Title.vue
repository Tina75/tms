<template>
  <h3 :style="titleStyle" class="header-h3">
    <div class="header-h3-title">
      <span :style="lineStyle" class="header-h3-line"></span>
      <span :style="textStyle" class="header-h3-text">
        <slot></slot>
      </span>
      <div v-if="$slots.float" class="header-h3-float">
        <slot name="float" ></slot>
      </div>
    </div>
  </h3>
</template>
<script>
export default {
  props: {
    /**
     * 文字大小
     * 竖线高度
     */
    size: {
      type: [String, Number],
      default: 24
    },
    /**
     * 底边border风格
     */
    border: {
      type: String,
      validator (value) {
        return ['solid', 'dashed', 'ridge', 'double', 'dotted', 'inset', 'unset'].indexOf(value) > -1
      },
      default: 'dashed'
    }
  },
  computed: {
    titleStyle () {
      /**
       * 设置border-style
       */
      return { borderBottomStyle: this.border }
    },
    lineStyle () {
      /**
       * 1. 24px字 - 25px
       * 2. 16px字 - 20px
       */
      return { height: this.size === '24' ? this.size + 'px' : '20px' }
    },
    textStyle () {
      return { fontSize: this.size + 'px' }
    }
  }
}
</script>

<style lang="stylus" scoped>
.header-h3
  border-bottom-width 1px
  border-bottom-color #CBCED3
  color #333333
  &-title
    padding 16px 0
  &-text
    font-weight bolder
  &-line
    margin-right 15px
    display inline-block
    width 5px
    background #00a4bd
    border-radius 3px
    vertical-align text-bottom
  &-float
    float right
    margin-right 20px
    margin-top -5px
</style>
