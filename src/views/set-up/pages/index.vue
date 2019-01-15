<template>
  <div id="set-up-container" class="set-up-container temAll">
    <div id="temAll" :style="styleHeight">
      <VerticalTabs :value="rightKey" @on-select="clickMenu">
        <VerticalTabItem key="0" name="0" label="修改密码">
          <Title size="16" border="solid" class="title">
            修改密码
          </Title>
          <Password class="setConf"></Password>
        </VerticalTabItem>
        <VerticalTabItem key="1" name="1" label="个人设置">
          <Title size="16" border="solid" class="title">
            个人设置
          </Title>
          <PersonSetting class="setConf"></PersonSetting>
        </VerticalTabItem>
        <VerticalTabItem key="2" name="2" label="短信设置">
          <Title size="16" border="solid" class="title">
            短信设置
          </Title>
          <SmsSetting class="setConf"></SmsSetting>
        </VerticalTabItem>
        <VerticalTabItem key="3" name="3" label="系统设置">
          <SystemSetting :value="tabName" class="setting"></SystemSetting>
        </VerticalTabItem>
        <VerticalTabItem key="4" name="4" label="清除数据">
          <Title size="16" border="solid" class="title">
            清除数据
          </Title>
          <clearData></clearData>
        </VerticalTabItem>
      </VerticalTabs>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import { mapGetters } from 'vuex'
import VerticalTabs from '@/components/vertical-tabs/index'
import Password from '../components/password.vue'
import PersonSetting from '../components/person-setting.vue'
import SmsSetting from '../components/sms-setting.vue'
import SystemSetting from '../components/system-setting.vue'
import clearData from '../components/clear-data.vue'
import Title from '@/components/Title'
export default {
  name: 'set-up',
  components: {
    VerticalTabs,
    VerticalTabItem: VerticalTabs.TabItem,
    Password,
    PersonSetting,
    SmsSetting,
    SystemSetting,
    Title,
    clearData
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '设置'
  },
  data () {
    return {
      setUpMenu: [{
        name: '修改密码',
        id: '0'
      }, {
        name: '个人设置',
        id: '1'
      }, {
        name: '短信设置',
        id: '2',
        code: '150200'
      }, {
        name: '系统设置',
        id: '3',
        code: '150300'
      }],
      rightTitle: '修改密码',
      rightKey: '0',

      tabName: 'apport'
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight']),
    styleHeight () {
      return { height: this.DocumentHeight + 'px' }
    },
    // 受理开单来的参数
    isFromOrder () {
      return this.$route.query.tab === 'order'
    },
    // 派车
    isFromDispatch () {
      return this.$route.query.tab === 'dispatch'
    }
  },
  created () {
    // 受理开单来的
    if (this.isFromOrder) {
      this.rightKey = '3'
      this.tabName = 'order'
    } else if (this.isFromDispatch) {
      this.rightKey = '3'
      this.tabName = 'dispatch'
    }
  },
  mounted: function () {
    if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
      document.getElementById('set-up-container').style.maxHeight = (document.body.clientHeight - 80) + 'px'
    }
  },
  methods: {
    clickMenu (param) {
      this.rightTitle = param.label
      this.rightKey = parseInt(param.name)
      // switch (this.rightKey) {
      //   case 1:
      //     this.initPerson()
      //     break
      //   case 2:
      //     this.smsInfo()
      //     break
      // }
    }
  }
}
</script>
<style lang='stylus' scoped>
>>>.personPic .demo-upload-list
>>>.personPic .ivu-upload .ivu-upload-drag
>>>.personPic .ivu-upload-input
  width 96px
  height 90px
>>>.ivu-form .ivu-form-item-label
>>>.ivu-form .ivu-form-item-content
  font-size: 14px
  color #000000
.personPic
  margin-top: -20px
  margin-bottom: -10px
.set-up-container
  overflow auto
.temAll
  margin: -20px -15px;
  .title
    margin-top -20px
  .setConf
    margin-top: 48px;
    .inputClassSty
      width:300px;
  .setting
    margin-top -10px
  //图片相关
.demo-upload-list
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
.demo-upload-list img
  width: 100%;
  height: 100%;
.demo-upload-list-cover
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
.demo-upload-list:hover .demo-upload-list-cover
  display: block;
.demo-upload-list-cover i
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
.menuTitle
  font-size: 16px
  margin-top: 5px;
  margin-left: -10px;

span.labelContent
  position: relative;
  top: 1px;
</style>
