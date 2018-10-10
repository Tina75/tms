<template>
  <div class="ivu-card ivu-card-bordered tms-home__card-border">
    <div :style="backgroundLinear" class="tms-home__card-header-linear"></div>
    <div class="ivu-card-head tms-home__card-header">
      <slot name="title">
        <div class="tms-home__card-header-title">
          {{title}}
        </div>
        <div class="tms-home__card-header-label">
          <!-- {{label}} -->
        </div>
      </slot>
    </div>
    <div class="ivu-card-extra">
      <span :style="totalStyle" class="tms-home__card-header-total">
        <CountTo :start-value="Math.ceil(extra/2)" :end-val="extra" :duration="3000"></CountTo>
      </span>
    </div>
    <div class="ivu-card-body tms-home__card-body">
      <CellGroup @on-click="push">
        <Cell v-for="(item, index) in data" :key="index" :to="item.url" :name="JSON.stringify({tab: item.tab, url: item.href, title: item.title})">
          <span slot="icon" class="ivu-badge ivu-badge-status">
            <span :style="{'background-color':theme}" class="ivu-badge-status-dot"></span>
          </span>
          <span slot="extra" class="tms-home__cell-extra">
            <CountTo :start-val="Math.ceil(item.value/2)" :end-val="item.value" :duration="2000"></CountTo>
          </span>
          <span class="tms-home__cell-item" >
            {{item.name}}
          </span>
        </Cell>
      </CellGroup>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import CountTo from 'vue-count-to'
const theme = {
  '#418DF9': ['#418DF9', '#76E7FD'],
  '#FFBB44': ['#FFBB44', '#FFB897'],
  '#00A4BD': ['#00A4BD', '#00E0CD']
}
let themeIndex = 0
export default {
  components: {
    CountTo
  },
  mixins: [BasePage],
  props: {
    title: String,
    label: String,
    to: String,
    extra: [String, Number],
    pageTitle: String,
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      theme: Object.keys(theme)[themeIndex]
    }
  },
  computed: {
    range () {
      return theme[this.theme]
    },
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
  },
  created () {
    themeIndex++
    if (themeIndex > 2) {
      themeIndex = 0
    }
  },
  methods: {
    push (str) {
      const obj = JSON.parse(str)
      if (!obj.url) {
        return
      }
      this.openTab({
        path: obj.url,
        title: obj.title || this.title || '',
        query: {
          tab: obj.tab
        }
      })
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
      height 12px
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
