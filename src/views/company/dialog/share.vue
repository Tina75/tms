<template>
  <div>
    <Modal v-model="visiable" :mask-closable="false" transfer width="570" @on-visible-change="close">
      <p slot="header" class="ModalTitle">
        {{title}}
      </p>
      <Row>
        <Col :span="18">
        <Input v-model="shareUrl" disabled="true"></Input>
        </Col>
        <Col :span="4">
        <Button type="primary" class="copyBtn" @click="copyBtn">复制</Button>
        </Col>
      </Row>
      <div class="shareFont">
        <span>分享至：</span>
        <span>QQ  weixin</span>
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
