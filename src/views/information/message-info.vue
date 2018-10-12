<template>
  <div class="messageDivAll">
    <h1 class="title">{{messageInfo.title}}</h1>
    <p class="dateTime">{{ formatDate(messageInfo.createTime) }}
      <Button class="msgRemoveBtn" @click="removeBtn">
        <span class="msgConfigBtn"><i class="icon font_family icon-shanchu1" style="font-size:14px;color:#9DA1B0;"></i></span>
        <span style="margin: 0 4px;font-size:12px;color:#2F323E">删除</span>
      </Button>
    </p>
    <pre class="msgInfo">{{messageInfo.content}}</pre>
    <div v-if="this.messageInfo.url !== ''" class="msgInfoHrefDiv"><span style="color: #9DA1B0">活动链接：</span>
      <a :href="messageInfo.url" style="color:#418DF9;">{{messageInfo.url}}</a>
    </div>
    <Modal v-model="visibaleRemove" type="warning" width="360">
      <p slot="header" style="text-align:center;font-size: 16px;">
        <span>提示</span>
      </p>
      <i class="icon font_family icon-bangzhuzhongxin" style="font-size:28px; background: white; color: #FFBB44;float:left;"></i>
      <p style="margin-top:13px; margin-left:40px;">确定要删除“{{messageInfo.title}}”消息吗?</P>
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
        } else {
          this.$Message.success(data.msg)
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
</style>
