<template>
  <div class="ivu-card ivu-card-bordered tms-home__card-border">
    <div :style="backgroundLinear" class="tms-home__card-header-linear"></div>
    <div class="ivu-card-head tms-home__card-header">
      <slot name="title">
        <div class="tms-home__card-header-title">
          {{title}}
        </div>
        <div class="tms-home__card-header-label">
          {{label}}
        </div>
      </slot>
    </div>
    <div class="ivu-card-extra">
      <span :style="totalStyle" class="tms-home__card-header-total">
        {{extra}}
      </span>
    </div>
    <div class="ivu-card-body tms-home__card-body">
      <CellGroup>
        <Cell v-for="item in data" :key="item.value" :title="item.name" :extra="item.value">
          <Icon slot="icon" :color="theme" type="ios-play"></Icon>
        </Cell>
      </CellGroup>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    label: String,
    extra: [String, Number],
    range: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: '#333333'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    totalStyle () {
      return {
        color: this.theme
      }
    },
    backgroundLinear () {
      return {
        'background': [
          `-webkit-linear-gradient(left, ${this.range[0]} , ${this.range[1]})`,
          `-o-linear-gradient(right, ${this.range[0]}, ${this.range[1]})`,
          `-moz-linear-gradient(right, ${this.range[0]}, ${this.range[1]})`,
          `linear-gradient(right,#FFB897,${this.range[0]}, ${this.range[1]})`
        ]
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.tms-home
  &__card-border
    position relative
    border-top none
  &__card-header-linear
    height 10px
    border-top-left-radius 4px
    border-top-right-radius 4px
    position absolute
    top 0
    left -1px
    right -1px
  &__card-header
    padding-top 26px
    border-bottom-style dashed
    &-title
      padding-left 0
      color #333333
      font-size 16px
      font-weight bold
      margin-bottom 4px
    &-label
      font-size 12px
      color #999999
    &-total
      font-weight bold
      font-size 30px
  &__card-body
    padding 16px 0
    height 184px
    overflow hidden
</style>
