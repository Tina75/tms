<template>
  <div class="sms-setting">
    <div class="sms-setting-form">
      <Card dis-hover>
        <div solt="title" class="msgCardTitle">
          开启短信提醒
          <i-switch v-model="switchMsg" style="margin-left:20px;" @on-change="changeCheckBoxGroup" />
        </div>
        <div v-for="msg in messageList" :key="msg.title" class="mesDiv">
          <p class="bold">{{msg.title}}</p>
          <p v-if="msg.messageTitle">{{msg.messageTitle}}<span style="margin-left:12px;">{{msg.message}}</span></p>
          <p v-if="msg.messageReturn">{{msg.messageReturn}}</p>
          <p v-if="msg.message2">{{msg.message2}}</p>
          <p v-if="msg.message3">{{msg.message3}}</p>
          <p>接收人：
            <Checkbox
              v-for="checkBtn in msg.checkBox"
              :key="checkBtn.index"
              v-model="checkBtn.model"
              style="margin-left:5px;"
              @on-change="checkBtnBox()">
              {{checkBtn.label}}
            </Checkbox>
          </p>
        </div>
      </Card>
      <div class="van-center">
        <Button type="primary" class="msgSaveBtn" style="width:86px;" @click="msgSaveBtn">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 设置=>短信设置
 */
import Server from '@/libs/js/server'
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'sms-setting',
  components: {
  },
  data () {
    return {
      // 短信
      switchMsg: false,
      checkNum: 0,
      msgCheckBoxList: [],
      msgCheckBoxListInit: [],
      msgSlectCheckBox: [],
      messageListInit: [],
      messageList: [{
        title: '发运提醒',
        messageTitle: '运单：',
        message: '【运掌柜TMS】您的货物已由xx公司安排送货，由车牌号XXXX司机姓名XXXX司机电话XXXX派送；',
        // messageReturn: '外转单：【运掌柜TMS】您的xxx货物已由xx公司安排送货。',
        checkBox: [{
          label: '发货人',
          model: '1',
          key: '1'
        }, {
          label: '收货人',
          model: '2',
          key: '2'
        }]
      }, {
        title: '到货提醒',
        messageTitle: '运单：',
        message: '【运掌柜TMS】您的货物已签收，由车牌号XXX司机姓名XXX司机电话XXXX完成配送；',
        // messageReturn: '外转单：【运掌柜TMS】您的xxx货物已签收。',
        checkBox: [{
          label: '发货人',
          model: '3',
          key: '3'
        }, {
          label: '收货人',
          model: '4',
          key: '4'
        }]
      }, {
        title: '指派司机提醒',
        messageTitle: '运单：',
        message: '【运掌柜TMS】XX公司给您指派了新的运单，请尽快装货；',
        messageReturn: '提货单：【运掌柜TMS】XX公司给您指派了新的提货单，请尽快提货。',
        checkBox: [{
          label: '司机',
          model: '5',
          key: '5'
        }]
      }, {
        title: '年检到期提醒',
        messageTitle: '文案：',
        message: '如果当天只有一辆车需要到期提醒：【运掌柜TMS】您的车辆xxx（车牌号），还剩xx天即将年检，请提前安排车辆年检；',
        message2: '如果当天有小于等于3俩车需要到期提醒：【运掌柜TMS】您的车辆：xxx（车牌号），还剩xx天即将年检；xxx（车牌号），还剩xx天即将年检；xxx（车牌号），还剩xx天即将年检；请提前安排车辆年检；',
        message3: '如果当天有大于3辆车需要到期提醒：【运掌柜TMS】您有xx俩车即将年检，请提前安排车辆年检；',
        checkBox: [{
          label: '拥有车辆年检中新增年检权限的员工',
          model: '6',
          key: '6'
        }]
      }]
    }
  },
  computed: {
    ...mapGetters(['SmsSet'])
  },
  created () {
    this.messageListInit = _.cloneDeep(this.messageList)
  },
  mounted () {
    this.smsInfo()
  },
  methods: {
    ...mapMutations(['smsSetting']),
    smsInfo () {
      this.messageList = _.cloneDeep(this.messageListInit)
      this.msgCheckBoxList = this.SmsSet === '' ? [] : _.clone(this.SmsSet)
      this.msgCheckBoxListInit = this.SmsSet === '' ? [] : _.clone(this.SmsSet)
      for (const checkList of this.messageList) {
        checkList.checkBox.forEach(element => {
          if (this.msgCheckBoxList.includes(element.model)) {
            element.model = true
            this.switchMsg = true
          }
        })
      }
    },
    // 短信
    changeCheckBoxGroup (status) {
      for (const checkList of this.messageList) {
        checkList.checkBox.forEach(element => {
          element.model = status
        })
      }
    },
    checkBtnBox () {
      let statusList = []
      this.checkNum = 0
      let listInit = new Set()
      for (const checkList of this.messageList) {
        checkList.checkBox.forEach(element => {
          statusList.push(element.model)
          if (element.model === true) {
            listInit.add(element.key)
            this.checkNum++
          }
        })
        this.switchMsg = this.checkNum > 0
      }
      this.msgSlectCheckBox = Array.from(listInit)
    },
    msgSaveBtn () {
      this.checkBtnBox()
      let params = {}
      params.smsCode = this.msgSlectCheckBox
      if (this.msgSlectCheckBox.sort().toString() === this.msgCheckBoxListInit.sort().toString()) {
        this.$Message.info('您还未变更任何信息，无需保存')
        return
      }
      Server({
        url: 'set/sms',
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data.code === 10000) {
          this.smsSetting(params.smsCode)
          this.msgCheckBoxListInit = _.cloneDeep(this.msgSlectCheckBox)
          this.$Message.success('保存成功!')
          // this.msgCheckBoxListInit = _.cloneDeep(this.msgSlectCheckBox)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.sms-setting
  .sms-setting-form
    width 80%
    margin 0 auto
  .mesDiv
    min-height: 120px;
    width: 100%;
    padding: 15px 0;
    border-top: 1px solid rgba(201,206,217,1);
    P
      font-size: 12px;
      color #555
      margin-top: 5px;
    .bold
      font-weight bold
      color #000
  .msgSaveBtn
    margin-top: 25px;
  .msgCardTitle
    margin-bottom: 15px;

</style>
