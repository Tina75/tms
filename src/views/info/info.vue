<template>
  <div class="temAll">
    <Col span="3">
    <Menu active-name="系统消息" class="leftMenu" style="width: 150px;  background: rgba(248,248,248,1);">
      <MenuItem v-for="menu in menuList" :key="menu.id" :name="menu.name" @click.native="clickLeftMenu(menu.id, menu.name)">
      <p class="menuTitle">{{menu.name}}</p>
        </MenuItem>
    </Menu>
    </Col>
    <Col span="18">
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:10px;margin-top: 14px;">
      <span class="iconRightTitle" style="width: 5px;height: 20px;background: #00a4bd; position: absolute;"></span>
      <span style="margin-left:25px; font-size: 16px;">{{rightTitle}}</span>
    </div>
    <!--系统消息-->
    <div v-if="'1' === this.rightKey" style="height:250px;">
      <Col span="24">
      <div class="mesDivAll">
        <div v-for="msg in this.messageList" :key="msg.id" class="megDiv">
          <div class="msgImg">
            <i class="icon font_family icon-xitongxiaoxi" style="font-size:28px; background: white; color: #FFBB44;"></i>
          </div>
          <div class="msgContent">
            <p class="msgContentTitle">{{msg.title}}</p>
            <p class="msgContentText">{{msg.message}}</p>
          </div>
          <div class="msgConfigDiv">
            <p>{{msg.dataTime}}</p>
            <span class="msgConfigBtn" @click="msgRemoveBtn(msg)"><i class="icon font_family icon-shanchu1"></i></span>
          </div>
        </div>
      </div>
        </Col>
    </div>
    <!--订单消息-->
    <div v-if="'2' === this.rightKey" style="height:250px;">
      <Col span="24">
      <div class="mesDivAll">
        <div v-for="msg in this.messageList" :key="msg.id" class="megDiv">
          <div class="msgImg">
            <i class="icon font_family icon-dingdanxiaoxi" style="font-size:28px; background: white; color: #418DF9;"></i>
            <!-- <img src="@/assets/info-sys.png"> -->
          </div>
          <div class="msgContent">
            <p class="msgContentTitle">{{msg.title}}</p>
            <p class="msgContentText">{{msg.message}}</p>
          </div>
          <div class="msgConfigDiv">
            <p>{{msg.dataTime}}</p>
            <span class="msgConfigBtn" @click="msgRemoveBtn(msg)"><i class="icon font_family icon-shanchu1"></i></span>
          </div>
        </div>
      </div>
        </Col>
    </div>
    <!--运输消息-->
    <div v-if="'3' === this.rightKey" style="height:250px;">
      <Col span="24">
      <div class="mesDivAll">
        <div v-for="msg in this.messageList" :key="msg.id" class="megDiv">
          <div class="msgImg">
            <i class="icon font_family icon-yunshuxiaoxi" style="font-size:28px; background: white; color: #00A4BD;"></i>
            <!-- <img src="@/assets/info-sys.png"> -->
          </div>
          <div class="msgContent">
            <p class="msgContentTitle">{{msg.title}}</p>
            <p class="msgContentText">{{msg.message}}</p>
          </div>
          <div class="msgConfigDiv">
            <p>{{msg.dataTime}}</p>
            <span class="msgConfigBtn" @click="msgRemoveBtn(msg)"><i class="icon font_family icon-shanchu1"></i></span>
          </div>
        </div>
      </div>
        </Col>
    </div>
    </Col>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
export default {
  name: 'info',
  components: {},
  mixins: [ BasePage ],
  metaInfo: {
    title: '消息'
  },
  data () {
    return {
      rightTitle: '系统消息',
      rightKey: '1',
      menuList: [{
        name: '系统消息',
        id: '1'
      }, {
        name: '订单消息',
        id: '2'
      }, {
        name: '运输消息',
        id: '3'
      }],
      messageList: [{
        title: '系统升级通知',
        message: '尊敬的客户您好。。撒娇傅雷家书链接发的垃圾受到法律的框架‘大法官书链接发的垃圾受到法律的框架‘大法官书链接发的垃圾受到法律的框架‘大法官垃圾的逻辑啊师傅阿斯顿激发距离首府',
        id: '1',
        dataTime: '2018-05-08 11:30:08'
      }, {
        title: '运大大活动邀请',
        message: '尊敬的客户您好。。撒娇傅雷家书链接发的垃圾受到法律的框架‘大法官垃圾的逻辑啊师傅阿斯顿激发距离首府',
        id: '2',
        dataTime: '2018-05-08 11:30:08'
      }, {
        title: '系统升级通知',
        message: '尊敬的客户您好。。撒娇傅雷家书链接发的垃圾受到法律的框架‘大法官垃圾的逻辑啊师傅阿斯顿激发距离首府',
        id: '3',
        dataTime: '2018-05-08 11:30:08'
      }, {
        title: '运大大活动邀请',
        message: '尊敬的客户您好。。撒娇傅雷家书链接发的垃圾受到法律的框架‘大法官垃圾的逻辑啊师傅阿斯顿激发距离首府',
        id: '4',
        dataTime: '2018-05-08 11:30:08'
      }, {
        title: '系统升级通知',
        message: '尊敬的客户您好。。撒娇傅雷家书链接发的垃圾受到法律的框架‘大法官垃圾的逻辑啊师傅阿斯顿激发距离首府',
        id: '5',
        dataTime: '2018-05-08 11:30:08'
      }]
    }
  },
  methods: {
    clickLeftMenu (id, menuName) {
      this.rightTitle = menuName
      this.rightKey = id
    },
    msgRemoveBtn (message) {
      console.log(message)
    }
  }
}

</script>
<style lang='stylus' scoped>
.temAll
  margin: 20px;
  .megDiv
    clear: both;
    height: 55px;
    margin: 20px 15px;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom:10px;
    margin-top: 25px;
  .msgImg
    float: left;
    margin-right: 20px;
  .msgContentTitle
    font-weight: bold;
    margin-bottom: 5px;
  .msgConfigDiv
    float: right;
    margin-top: -38px;
  .msgContentText
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 630px;
  .msgContent
    cursor: pointer;
  .msgConfigBtn
    cursor: pointer;
    float: right;
</style>
