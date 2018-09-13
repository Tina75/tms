<template>
  <div :class="['tab-item',checked?'tab-item__checked':'']">
    <Icon v-show="checked" class="tab-item__icon" type="ios-refresh" size="16" @click.stop="refresh"/>
    <span class="tab-item__name">{{name}}</span>
    <Icon v-show="closeable" class="tab-item__icon" type="ios-close" size="18" @click.stop="close"/>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
export default {
  name: 'TabNavItem',
  mixins: [ BaseComponent ],
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    closeable: function () {
      return this.checked && this.name !== '首页'
    }
  },
  mounted () {},

  methods: {
    close () {
      this.$emit('on-close', this.name)
    },
    refresh () {
      this.$emit('on-refresh', this.name)
    }
  }
}

</script>
<style lang='stylus' scoped>
.tab-item
  display inline-block
  color #EFEFEF
  max-width 120px
  min-width 80px
  line-height 30px
  margin-right 6px
  padding 0 5px 0 5px
  height 30px
  border-radius 8px 8px 0px 0px
  background #3A424B
  cursor pointer
  font-weight:500;
  text-align center
  &__icon
    display inline-block
    vertical-align middle
  &__name
    max-width 60px
    line-height 1
    text-align center
    vertical-align middle
    display inline-block
    overflow hidden
    white-space nowrap
    margin 0 4px
    text-overflow ellipsis
  &__checked
    background #EFEFEF
    color #00A4BD
</style>
