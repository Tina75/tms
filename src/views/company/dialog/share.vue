<template>
  <div>
    <Modal v-model="visiable" :mask-closable="false" transfer width="570" @on-visible-change="close">
      <p slot="header" class="ModalTitle">
        {{ title }}
      </p>
      <Row>
        <Col :span="18">
        <Input id="shareUrl" v-model="shareUrl" disabled></Input>
        </Col>
        <Col :span="4">
        <Button
          v-clipboard:copy="shareUrl"
          v-clipboard:success="copyBtn"
          v-clipboard:error="onError"
          class="copyBtn"
          type="primary">复制
        </Button>
        </Col>
      </Row>
      <div class="shareFont">
        <span>分享至：</span>
        <div class="fontIconItems">
          <span @click="weixinShare"><FontIcon type="weixin" size="35" color="#04D102" class="weixinIcon"></FontIcon></span>
          <span @click="QQShare"><FontIcon type="qq" size="35" class="qqIcon" color="#08A2DF"></FontIcon></span>
        </div>
      </div>
      <div v-show="qrcodeShow" class="weixinShareDiv">
        <div id="qrcodeDom" ref="qrcode">
          <img v-if="imagLogoSrc" :src="imagLogoSrc" class="imagLogo"/>
        </div>
        <p>打开微信扫一扫</p>
        <p>打开网页后点击右上角分享按钮</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="viewShare">查看分享</Button>
        <Button type="default" @click="close">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import VueClipboard from 'vue-clipboard2'
import FontIcon from '@/components/FontIcon'
import QRCode from 'qrcodejs2'
import Vue from 'vue'

Vue.use(VueClipboard)
export default {
  name: 'shareCompany',
  components: { FontIcon, QRCode },
  mixins: [BaseDialog],
  data () {
    return {
      shareUrl: '',
      basePath: '',
      clipboard: null,
      qrcodeInit: null,
      qrcodeShow: false,
      isQrcodeShow: false
    }
  },
  mounted () {
    this.basePath = process.env.VUE_APP_SHARE
    this.shareUrl = this.basePath + 'company-pc.html?shareOutNo=' + this.shareOutNo
  },
  methods: {
    viewShare () {
      window.open(this.shareUrl)
      this.close()
    },
    copyBtn (e) {
      this.$Message.success('复制成功')
    },
    onError (e) {
      this.$Message.error('复制失败，请使用Ctrl-C手动复制')
    },
    weixinShare () {
      this.qrcodeShow = true
      if (this.isQrcodeShow) return
      this.qrcodeInit = new QRCode('qrcodeDom', {
        width: 125, // 设置宽度
        height: 125, // 设置高度
        text: this.basePath + 'company-phone.html?shareOutNo=' + this.shareOutNo
      })
      this.isQrcodeShow = true
    },
    QQShare () {
      window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + this.shareUrl)
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
  .fontIconItems
    margin -10px 0 0 65px
    .qqIcon
      margin-left 10px
      cursor pointer
    .weixinIcon
      cursor pointer
.weixinShareDiv
  text-align center
  #qrcodeDom
    margin-left calc(50% - 62px)
    margin-bottom 10px
    .imagLogo
      width 40px
      height 40px
      position absolute
      margin 42.5px
      display block
  p
    color #333333
    font-size 14px
</style>
