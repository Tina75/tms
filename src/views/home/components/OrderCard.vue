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
        <Cell v-for="(item, index) in data" :key="index" :to="item.url">
          <span slot="icon" class="ivu-badge ivu-badge-status">
            <span :style="{'background-color':theme}" class="ivu-badge-status-dot"></span>
          </span>
          <span slot="extra" class="tms-home__cell-extra">
            {{item.value.toString()}}
          </span>
          <span class="tms-home__cell-item" >
            {{item.name}}
          </span>
        </spanclass="tms-home__cell-item"></Cell>
      </CellGroup>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    label: String,
    to: String,
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
    position relative
    padding-top 34px
    padding-bottom 22px
    border-bottom-style dashed
    &:before,&:after
      position absolute
      content ' '
      background-color #efefef
      bottom -5px
      padding 5px
      border-radius 50%
      -webkit-border-radius 50%
      -moz-border-radius 50%
    &:before
      left -5px
    &:after
      right -5px
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
    height 188px
    overflow hidden
  &__cell-item
    font-size 12px
  &__cell-extra
    font-size 16px
.ivu-card-extra
  top 24px
</style>
