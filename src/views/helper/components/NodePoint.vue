<template>
  <div :style="nodeStyle" class="node-point">
    <Poptip v-model="visible" :content="poptip" transfer word-wrap placement="top" trigger="hover" class="node-point-poptip">
      <div :class="iconClass" @click="jumpto">
        <FontIcon v-if="type" :type="type" :color="access? '#00A4BD' : '#9DA1B0'" size="30"></FontIcon>
      </div>
    </Poptip>
    <span class="node-point-text">{{text}}</span>
  </div>
</template>

<script>
import FontIcon from '@/components/FontIcon'
import BasePage from '@/basic/BasePage'
export default {
  components: {
    FontIcon
  },
  mixins: [BasePage],
  props: {
    poptip: String, // 泡框提示内容
    x: [Number, String], // 距离左边距离
    y: [Number, String], // 距离顶部距离
    type: String, // icon类型
    text: String, // 文字
    url: Object, // 跳转链接
    access: { // 权限
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    iconClass () {
      return [
        'node-point-icon',
        { 'node-point-icon-bg': this.access }
      ]
    },
    nodeStyle () {
      return {
        left: this.x,
        top: this.y
      }
    }
  },
  methods: {
    jumpto (e) {
      if (this.access && this.url) {
        this.visible = false
        this.openTab(this.url)
      } else {
        this.$Message.warning('你的账号没有此节点查看权限，请联系贵公司账号管理员开通')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.node-point
  width 56px
  position absolute
  &-poptip
    text-align center
    display block
  &-icon
    display block
    width 42px
    height 42px
    cursor pointer
  &-icon-bg
    &:hover
      box-shadow 0px 0px 0px 15px #C7E8ED inset
      -webkit-box-shadow 0px 0px 0px 15px #C7E8ED inset
      -moz-box-shadow 0px 0px 0px 15px #C7E8ED inset
      border-radius 50%
      -webkit-border-radius 50%
      -moz-border-radius 50%
  &-text
    color #333
    font-size 14px
    display block
    text-align center
</style>
