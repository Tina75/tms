<template>
  <Modal v-model="visible" :width="width" :mask-closable="false" transfer class="system-upgrade" @on-visible-change="handleClose">
    <div slot="header" class="system-upgrade__title">
      <div class="system-upgrade__title-bg">
        <div class="system-upgrade__title-text">
          {{title}}
        </div>
      </div>
    </div>
    <span slot="close">
      <FontIcon type="ico-fault" color="#fff"></FontIcon>
    </span>
    </p>
    <div class="ql-editor">
      <div v-html="content"></div>
    </div>
    <div slot="footer">
      <Button type="primary" class="system-upgrade__button" @click="save">我知道了</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import FontIcon from '@/components/FontIcon'
export default {
  name: 'system-message-preiview',
  components: {
    FontIcon
  },
  mixins: [BaseDialog],
  data () {
    return {
      title: '',
      content: '',
      width: 410,
      visible: true
    }
  },
  methods: {
    save () {
      this.visible = false
    },
    handleClose () {
      this.ok()
      this.close()
    }
  }

}

</script>
<style lang='stylus' scoped>
.system-upgrade
  &__title
    text-align left
    height 84px
    line-height 84px
    position relative
  &__title-bg
    width 410px
    height 112px
    background url('../../../assets/upgrade-bg.png') no-repeat left
    background-size contain
    position absolute
    left -16px
    right 0
    top -14px
    bottom 0
    z-index 0
  &__title-text
    color #fff
    z-index 2
    position relative
    font-size 24px
    padding-left 30px
  &__button
    width 150px
.ivu-modal-close
  background-color #fff
</style>
