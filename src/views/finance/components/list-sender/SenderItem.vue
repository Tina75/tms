<template>
  <div :class="classes" @click.prevent="handleClick">
    <div class="sender-item__ll">
      <span class="sender-item__icon">
        <FontIcon :type="icon" ></FontIcon>
      </span>
      <div class="sender-item__content">
        <p class="sender-item__content-name">
          {{title}}
        </p>
        <p class="sender-item__content-sup-name">
          <slot name="supName">
          </slot>
        </p>
        <slot name="extra">
          <span v-if="extra" class="sender-item__extra">
            {{extra}}单
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import FontIcon from '@/components/FontIcon'
export default {
  components: {
    FontIcon
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    title: String,
    icon: {
      type: String,
      default: 'ico-company'
    },
    extra: [Number, String]
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    classes () {
      return [
        'sender-item',
        { 'sender-item__active': this.active }
      ]
    }
  },
  methods: {
    handleClick (e) {
      if (this.active) {
        return
      }
      this.active = true
      this.$parent.handleClick(this.item)
    },
    toggleActive () {
      this.active = !this.active
    }
  }
}
</script>

<style lang="stylus" scoped>
.sender-item
  padding 8px
  border-bottom 1px solid #E4E7EC
  cursor pointer
  height 60px
  &:hover, &__active
      background-color #E9FCFF
  &__ll
    position relative
  &__icon
    float left
    margin-left 7px
    margin-top 5px
    display inline-block
    background-color #F9F9F9
    width 30px
    height 30px
    line-height 30px
    text-align center
    border-radius 50%
    -webkit-border-radius 50%
    -moz-border-radius 50%
  &__content
    width 209px
    margin-left 52px
  &__extra
    color #666666
    position absolute
    right 2px
    top 2px
  &__content-name
    width 160px
    color #333333
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    font-weight 500
  &__content-sup-name
    color #999
    line-height 25px
    margin-top 2px
    white-space nowrap
    text-overflow ellipsis
    overflow hidden

</style>
