<template>
  <div class="messageDivAll">
    <h1 style="text-align:left;">{{messageInfo.title}}</h1>
    <p>{{ formatDate(messageInfo.createTime) }}
      <Button class="msgRemoveBtn" @click="removeBtn">
        <span class="msgConfigBtn">
        <i class="icon font_family icon-shanchu1"></i></span><span style="margin:0 5px;">删除
        </span>
      </Button>
    </p>
    <pre class="msgInfo">{{messageInfo.content}}</pre>
    <pre v-if="this.messageInfo.url !== ''" class="msgInfoHref">活动链接：<a :href="messageInfo.url">{{messageInfo.url}}</a></pre>
    <Modal v-model="visibaleRemove" type="warning" width="360">
      <p slot="header" style="text-align:center">
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
  width: 800px;
  .msgRemoveBtn
    float: right;
    margin: -10px 20px;
  .msgInfo
    clear: both;
    margin-top: 20px;
    text-indent:25px;
  .msgInfoHref
    margin-top: 20px;
</style>
