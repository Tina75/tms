<template>
  <div>
    <Modal v-model="visiable" :mask-closable="false" transfer width="570" @on-visible-change="close">
      <p slot="header" class="ModalTitle">
        {{title}}
      </p>
      <Row>
        <Col :span="18">
        <Input id="shareUrl" :value="shareUrl" disabled></Input>
        </Col>
        <Col :span="4">
        <Button type="primary" class="copyBtn" data-clipboard-target = "#shareUrl" @click="copyBtn">复制</Button>
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
        <div id="qrcodeDom" ref="qrcode"></div>
        <p>打开微信扫一扫</p>
        <p>打开网页后点击右上角分享按钮</p>
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
import FontIcon from '@/components/FontIcon'
import QRCode from 'qrcodejs2'
export default {
  name: 'shareCompany',
  components: { FontIcon, Clipboard, QRCode },
  mixins: [BaseDialog],
  data () {
    return {
      shareUrl: 'https://yzg.tms5566.com',
      clipboard: null,
      qrcodeInit: null,
      qrcodeShow: false,
      isQrcodeShow: false,
      urlPath: 'https://yzg.tms5566.com/'
    }
  },
  mounted () {
    this.clipboard = new Clipboard('.copyBtn')
  },
  methods: {
    save () {
      window.open('http://localhost:8080/#/company')
      this.close()
    },
    copyBtn () {
      this.clipboard.on('success', e => {
        this.$Message.success('复制成功')
        this.clipboard.destroy() //  使用destroy可以清楚缓存
      })
      this.clipboard.on('error', e => {
        this.$Message.error('复制失败')
        this.clipboard.destroy()
      })
    },
    weixinShare () {
      this.qrcodeShow = true
      if (this.isQrcodeShow) return
      this.qrcodeInit = new QRCode('qrcodeDom', {
        width: 125, // 设置宽度
        height: 125, // 设置高度
        text: this.urlPath,
        src: 'http://pic1.cxtuku.com/00/07/42/b03695caf529.jpg',
        background: 'red'
      })
      this.isQrcodeShow = true
    },
    QQShare () {
      window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + this.urlPath)
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
  p
    color #333333
    font-size 14px
</style>
