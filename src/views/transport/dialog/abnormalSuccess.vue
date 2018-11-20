<template>
  <div>
    <Modal v-model="visiable" :mask-closable="false" transfer class="abnormal-success-dialog" width="460" @on-visible-change="close">
      <p slot="header" class="dialog-title">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>上报异常</span>
      </p>
      <div class="tip-text">
        <Icon type="ios-checkmark-circle" color="#00c185" size="28" style="margin-top: -3px;margin-right: 10px"></Icon>
        <p class="content">异常信息上报成功，将会在异常管理菜单下生成异常单，是否去查看异常单？</p>
      </div>
      <div slot="footer">
        <Button  type="primary"  @click="save">是</Button>
        <Button  type="default"  @click="close">否</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'abnormalSuccess',
  mixins: [BaseDialog],
  data () {
    return {
    }
  },

  mounted: function () {
  },

  methods: {
    save () {
      if (!this.hasPower(120400)) {
        this.$Message.warning('您没有异常管理菜单权限，请联系系统管理员开通')
        return
      }
      this.close()
      this.openTab({
        title: '异常管理',
        path: '/transport/abnormalOrder',
        query: {
          tab: 1
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog-title
  text-align center
  font-size 16px
  font-family 'PingFangSC-Medium'
  font-weight 700
  color rgba(47,50,62,1)
.content
  font-size 14px
  font-family 'PingFangSC-Regular'
  font-weight 400
  color rgba(0,0,0,1)
  line-height 20px
.tip-text
  display: flex;
  display -ms-flexbox
</style>
<style lang='stylus'>
.abnormal-success-dialog
  .ivu-modal-body
    padding 28px 50px
</style>
