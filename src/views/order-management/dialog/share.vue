<template>
  <Modal v-model="visiable" :mask-closable="true" transfer class="share-dialog" width="660" @on-visible-change="close">
    <Tabs v-model="shareType" @on-click="handleTabChange">
      <TabPane label="普通分享">
        <p class="share-tip">无需密码，拥有链接的客户都可以直接查看</p>
        <div class="share-info">客户名称： <span class="value">{{ id[0].consignerName + suffix }}</span></div>
        <div class="share-info share-margin">订单数量： <span class="value">{{ id.length }}单</span></div>
        <div>
          <Tooltip :transfer="true" max-width="450" placement="bottom">
            <p class="share-url common">
              <span class="label">链接：</span>
              <span>{{ disencrypt.message }}</span>
            </p>
            <div slot="content" class="share-tooltip">
              {{ disencrypt.message }}
            </div>
          </Tooltip>
          <Button
            v-clipboard:copy="disencrypt.message"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            :disabled="isDisabled"
            type="primary">{{ isDisabled ? '复制成功' : '复制链接'}}</Button>
        </div>
      </TabPane>
      <TabPane label="加密分享">
        <p class="share-tip">查看需要输入密码，更加隐私安全！</p>
        <div class="share-info">客户名称： <span class="value">{{ id[0].consignerName + suffix }}</span></div>
        <div class="share-info share-margin">订单数量： <span class="value">{{ id.length }}单</span></div>
        <div>
          <Tooltip :transfer="true" max-width="340" placement="bottom">
            <p class="share-url encrypt">
              <span class="label">链接：</span>
              <span>{{ encrypt.message }}</span>
            </p>
            <div slot="content" class="share-tooltip">
              {{ encrypt.message }}
            </div>
          </Tooltip>
          <p class="share-url password">
            <span class="label">密码：</span>
            <span>{{ encrypt.password }}</span>
          </p>
          <Button
            v-clipboard:copy="encrypt.messageAndPwd"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            :disabled="isDisabled"
            type="primary">{{ isDisabled ? '复制成功' : '复制链接及密码'}}</Button>
        </div>
      </TabPane>
    </Tabs>
    <div slot="footer" class="share-footer">
      <div>您可以复制链接，在QQ、微信上发送给您的客户</div>
      <div>
        <a :href="shareType ? encrypt.message : disencrypt.message" target="_blank" style="margin-right: 20px;">查看分享</a>
        <a @click="close">关闭</a>
      </div>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
export default {
  name: 'Share',

  mixins: [BaseDialog],

  data () {
    return {
      shareType: 0,
      encrypt: {
        message: '',
        messageAndPwd: '',
        password: '',
        sharecode: ''
      },
      disencrypt: {
        message: '',
        sharecode: ''
      },
      isDisabled: false
    }
  },

  computed: {
    orderIds () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.id)
      })
      return arr
    }
  },

  created () {
    if (this.id.length > 1) {
      this.encrypt.message = process.env.VUE_APP_SHARE + 'order-list.html'
      this.disencrypt.message = process.env.VUE_APP_SHARE + 'order-list.html'
    } else {
      this.encrypt.message = process.env.VUE_APP_SHARE + 'order-detail.html'
      this.disencrypt.message = process.env.VUE_APP_SHARE + 'order-detail.html'
    }
  },

  mounted () {
    console.log(this.id)
    this.createShare(0)
    this.createShare(1)
  },

  methods: {
    checkShare () {
      console.log('分享')
      if (this.shareType) {
        window.location.href = this.encrypt.message
      } else {
        window.location.href = this.disencrypt.message
      }
    },
    handleTabChange (val) {
      this.isDisabled = false
      console.log(this.encrypt.message)
    },
    onCopy (e) {
      console.log('You just copied: ' + e.text)
      this.$Message.success('复制成功')
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 3000)
    },
    onError (e) {
      this.$Message.error('复制失败，请使用Ctrl-C手动复制')
    },
    createShare (type) {
      Server({
        url: 'order/createshare',
        method: 'post',
        data: {
          orderIds: this.orderIds,
          shareType: type // 分享形式：1有查看密码；0无查看密码
        }
      }).then((res) => {
        if (type) {
          this.encrypt.password = res.data.data.password
          this.encrypt.sharecode = res.data.data.shareOutNo
          this.encrypt.message = this.encrypt.message + '?sharecode=' + this.encrypt.sharecode + '&encrypt=true'
          this.encrypt.messageAndPwd = this.encrypt.message + '    密码：' + this.encrypt.password
        } else {
          this.disencrypt.sharecode = res.data.data.shareOutNo
          this.disencrypt.message = this.disencrypt.message + '?sharecode=' + this.disencrypt.sharecode
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
  .share-tip
    font-size 12px
    font-family 'PingFangSC-Regular'
    color #666
    padding 12px 0 11px 10px
    background-color #D8FAFF
    margin-bottom 30px
  .share-info
    font-size 14px
    font-family 'PingFangSC-Regular'
    color #666
    line-height 20px
    .value
      color #333
  .share-margin
    margin 9px 0 19px
  .share-url
    font-size 12px
    font-family 'PingFangSC-Regular'
    color #333
    padding 6px 12px 6px 10px
    background-color #F8F8F9
    border 1px solid #DCDEE2
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    .label
      color #999
  .common
    width 450px
  .encrypt
    width 340px
  .password
    width 100px
    display inline-block
    margin-left 10px
  .ivu-btn
    width 120px
    margin-left 20px
    vertical-align top
  .share-footer
    border-top 1px solid #EDF1F5
    display flex
    justify-content space-between
    font-size 12px
    font-family 'PingFangSC-Regular'
    color #999
    padding-top 18px
    div
      display inline-block
  .ivu-btn-primary[disabled]
    background-color #00C185
    color #fff
  .share-tooltip
    white-space normal
    word-break break-all
</style>
<style lang='stylus'>
  .share-dialog
    .ivu-modal-body
      padding 10px 40px 30px 30px
      .ivu-tabs-bar
        margin-bottom 30px
        .ivu-tabs-tab
          font-size 16px
          font-family 'PingFangSC-Medium'
          font-weight 500
          line-height 22px
          padding 10px 16px 12px
    .ivu-modal-footer
      padding 0 40px 31px 30px
    .ivu-tooltip-inner-with-width
      white-space normal
</style>
