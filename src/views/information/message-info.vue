<template>
  <div id="message-detail-container" class="messageDivAll">
    <h1 class="title">{{messageInfo.title}}</h1>
    <p class="dateTime">{{ formatDate(messageInfo.createTime) }}
      <Button class="msgRemoveBtn" @click="removeBtn">
        <span><i class="icon font_family icon-shanchu1"></i></span>
        <span class="msgConfigBtn">删除</span>
      </Button>
    </p>
    <div class="ql-editor" style="line-height:1.8;width:800px;">
      <div v-html="messageInfo.content"></div>
    </div>
    <Modal v-model="visibaleRemove" type="warning" width="360">
      <p slot="header" class="modalTitle">
        <span>提示</span>
      </p>
      <i class="icon font_family icon-bangzhuzhongxin"></i>
      <p class="modalContent">确定要删除“{{messageInfo.title}}”消息吗?</P>
      <div slot="footer">
        <Button type="primary" @click="removeSubForm(messageInfo)">确定</Button>
        <Button  @click="removeCancelForm">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
export default {
  name: 'message-info',
  components: {},
  mixins: [ BasePage ],
  metaInfo: {
    title: '消息详情'
  },
  data () {
    return {
      visibaleRemove: false,
      messageInfo: {}
    }
  },
  mounted: function () {
    this.messageInfo = this.$route.query.message
    if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
      document.getElementById('message-detail-container').style.maxHeight = (document.body.clientHeight - 80) + 'px'
    }
  },
  methods: {
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    removeBtn () {
      this.visibaleRemove = true
    },
    removeCancelForm () {
      this.visibaleRemove = false
    },
    removeSubForm (msg) {
      let params = {}
      params.ids = [msg.id]
      Server({
        url: 'message/del',
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data.code === 10000) {
          this.$Message.success('删除成功!')
          this.visibaleRemove = false
          this.ema.fire('closeTab', this.$route)
        }
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.messageDivAll
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #fff;
  padding: 20px 200px;
  .title
    font-weight:500;
    text-align:left;
    font-size:16px;
    font-weight:bold;
    line-height:22px;
    color: #2F323E;
  .dateTime
    color: #9DA1B0;
    font-size:12px;
    font-weight:400;
    line-height:17px;
    margin: 15px 0;
  .msgRemoveBtn
    float: right;
    margin: -20px 20px;
    width: 70px;
    height: 28px;
    padding: 0;
    .icon-shanchu1
      font-size:14px;
      color:#9DA1B0;
    .msgConfigBtn
      margin: 0 4px;
      font-size:12px;
      color:#2F323E
  .msgInfo
    clear: both;
    margin-top: 20px;
    text-indent:25px;
    color: #777B89;
    font-weight:400;
    font-size:12px;
    line-height:17px;
    font-family: PingFangSC-Regular;
  .msgInfoHrefDiv
    width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .msgInfoHrefa
      color: #9DA1B0
      .messageInfoUrl
        color:#418DF9;
.modalTitle
  text-align:center;
  font-size: 16px;
  font-weight: bold;
.icon-bangzhuzhongxin
  font-size:28px;
  background: white;
  color: #FFBB44;
  float:left;
.modalContent
  margin-top:12px;
  margin-left:40px;
  font-size:14px;
  margin-bottom: 20px;
</style>
