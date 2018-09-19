<template>
  <div class="messageDivAll">
    <h1 style="text-align:left;">{{messageInfo.title}}</h1>
    <p>{{ this.formatDate(messageInfo.createTime) }}
      <Button class="msgRemoveBtn" @click="removeBtn">
        <span class="msgConfigBtn" @click="msgRemoveBtn(msg)">
        <i class="icon font_family icon-shanchu1"></i></span><span style="margin:0 5px;">删除
        </span>
      </Button>
    </p>
    <p class="msgInfo">{{messageInfo.content}}</p>
    <p v-if="this.messageInfo.url !== ''" class="msgInfoHref">活动链接：<a :href="messageInfo.url">{{messageInfo.url}}</a></p>

  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
export default {
  name: 'message-info',
  components: {},
  mixins: [ BasePage ],
  metaInfo: {
    title: '消息详情'
  },
  data () {
    return {
      messageInfo: {}
    }
  },
  mounted: function () {
    debugger
    this.messageInfo = this.$route.query.message
  },
  methods: {
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    removeBtn () {
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
