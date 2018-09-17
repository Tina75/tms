<template>
  <div class="messageDivAll">
    <h1 style="text-align:left;">{{messageInfo.title}}</h1>
    <p>{{messageInfo.dataTime}}
      <Button class="msgRemoveBtn" @click="removeBtn">
        <span class="msgConfigBtn" @click="msgRemoveBtn(msg)">
        <i class="icon font_family icon-shanchu1"></i></span><span style="margin:0 5px;">删除
        </span>
      </Button>
    </p>
    <p class="msgInfo">{{messageInfo.message}}</p>
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
      messageInfo: {
        title: '系统升级通知',
        message: '尊敬的客户您好。。撒娇傅雷家书链接发的垃圾受到法律的框架‘大法官书链接发的垃圾受到法律的框架‘大法官书链接发的垃圾受到法律的框架‘大法官垃圾的逻辑啊师傅阿斯顿激发距离首府' +
                '活动地址：<a href="http://www.baidu.com">file</a>asdfasdfsadfsadfsadfsad垃圾受到法律的框架‘大法官书链接发的垃圾受到法律的框架‘大',
        id: '1',
        dataTime: '2018-05-08 11:30:08',
        url: 'http://www.baidu.com'
      }
    }
  },
  methods: {
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
