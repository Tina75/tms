<template>
  <div>
    <Modal v-model="visiable" :mask-closable="false" transfer width="570" @on-visible-change="close">
      <p slot="header" class="ModalTitle">
        {{title}}
      </p>
      <Row>
        <Col :span="18">
        <Input id="shareUrl" v-model="shareUrl" disabled></Input>
        </Col>
        <Col :span="4">
        <Button type="primary" class="copyBtn" data-clipboard-target = "#shareUrl" @click="copyBtn">复制</Button>
        </Col>
      </Row>
      <div class="shareFont">
        <span>分享至：</span>
        <i class="icon font_family icon-weixin"></i>
        <i class="icon font_family icon-qq"></i>
        <span>微信</span>
        <span>QQ</span>
      </div>
      <div slot="footer">
        <Button type="primary" @click="save">查看分享</Button>
        <Button type="default" @click="close">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import Clipboard from 'clipboard'
export default {
  name: 'shareCompany',
  mixins: [BaseDialog],
  data () {
    return {
      shareUrl: 'www.tmssdfsafd.com'
    }
  },
  mounted () {
  },
  methods: {
    save () {
      this.close()
    },
    copyBtn () {
      let clipboard = new Clipboard('.copyBtn')
      clipboard.on('success', e => {
        this.$Message.success('复制成功')
        clipboard.destroy() //  使用destroy可以清楚缓存
      })
      clipboard.on('error', e => {
        this.$Message.error('复制失败')
        clipboard.destroy()
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
>>> .ivu-form-item-error-tip
  width: 370px;
.dialog
  p
    text-align center
.ModalTitle
  text-align center
  font-size 16px
  font-weight 500
  line-height 22px
.copyBtn
  width 86px
  margin-left 20px
.shareFont
  font-size 14px
  color #333333
  line-height 20px
  margin-top 30px
  margin-bottom 20px
</style>
