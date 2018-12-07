<template>
  <div id="set-up-container" class="set-up-container temAll">
    <Row id="temAll" :style="styleHeight">
      <Col span="3">
      <Menu active-name="修改密码" class="menuList" style="width:100%">
        <MenuItem v-for="menu in setUpMenu" v-if="hasPower(menu.code)" :key="menu.id" :name="menu.name" @click.native="clickLeftMenu(menu.id, menu.name)">
        <p class="menuTitle">{{menu.name}}</p>
          </MenuItem>
      </Menu>
      </Col>
      <Col span="21" class="contentDiv">
      <div class="borderBottomLine">
        <span class="iconRightTitle"></span>
        <span class="iconRightTitleP">{{rightTitle}}</span>
      </div>
      <!--密码设置-->
      <div v-if="'1' === this.rightKey" key="1" class="divSetContent">
        <Col span="10" class="setConf">
        <Form ref="formPwd" :model="formPwd" :rules="rulePwd" :label-width="90" label-position="right">
          <FormItem label="原始密码：" prop="oldPassword" class="labelClassSty">
            <Input v-model="formPwd.oldPassword" type="password" placeholder="请输入原始密码" class="inputClassSty"></Input>
          </FormItem>
          <FormItem label="新密码：" prop="password" class="labelClassSty">
            <Input v-model="formPwd.password" type="password" placeholder="请输入新密码" class="inputClassSty"></Input>
          </FormItem>
          <FormItem label="确认密码：" prop="confirmPassword" class="labelClassSty">
            <Input v-model="formPwd.confirmPassword" type="password" placeholder="请再次输入新密码" class="inputClassSty"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" style="width:86px;" @click="pwdSubmit('formPwd')">保存</Button>
          </FormItem>
        </Form>
          </Col>
      </div>
      <!--个人设置-->
      <div v-else-if="'2' === this.rightKey" key="2" class="divSetContent">
        <Col span="10" class="setConf">
        <Form ref="formPersonal" :model="formPersonal" :rules="rulePersonal" :label-width="90" label-position="right">
          <FormItem label="账号：" class="labelClassSty">
            <span>{{formPersonal.phone}}</span>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input v-model="formPersonal.name" :maxlength="10" placeholder="请输入姓名" style="margin-left: 9px;" class="inputClassSty"></Input>
          </FormItem>
          <FormItem label="角色：" class="labelClassSty">
            <span>{{formPersonal.roleName}}</span>
          </FormItem>
          <FormItem>
            <Button type="primary" style="width:86px;"  @click="personalSubmit('formPersonal')">保存</Button>
          </FormItem>
        </Form>
          </Col>
      </div>
      <!--短信设置-->
      <div v-else-if="'3' === this.rightKey" key="3" style="margin-left:-125px;" class="divSetContent">
        <Col span="20" class="setConf">
        <Card dis-hover>
          <div solt="title" class="msgCardTitle">
            开启短信提醒
            <i-switch v-model="switchMsg" style="margin-left:20px;" @on-change="changeCheckBoxGroup" />
          </div>
          <div v-for="msg in this.messageList" :key="msg.title" class="mesDiv">
            <p style="font-weight: bold">{{msg.title}}</p>
            <p v-if="msg.messageTitle">{{msg.messageTitle}}<span style="margin-left:12px;">{{msg.message}}</span></p>
            <p v-if="msg.messageReturn">{{msg.messageReturn}}</p>
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
        <Button type="primary" class="msgSaveBtn test111" style="width:86px;" @click="msgSaveBtn">保存</Button>
        </Col>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import AreaInput from '@/components/AreaInput'
import { CHECK_PWD, CHECK_PWD_SAME, CHECK_NAME, CHECK_NAME_COMPANY, CHECK_PHONE } from './validator'
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import CitySelect from '@/components/SelectInputForCity'
export default {
  name: 'set-up',
  components: {
    AreaInput,
    CitySelect
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '设置'
  },
  data () {
    var pswRight = function (rule, value, callback) {
      if (value) {
        let params = {}
        params.oldPassword = value
        Server({
          url: 'set/pswRight',
          method: 'get',
          data: params
        }).then(({ data }) => {
          callback()
        }).catch(() => {
          return callback(new Error('原始密码错误，请重输'))
        })
      } else {
        callback()
      }
    }
    return {
      setUpMenu: [{
        name: '修改密码',
        id: '1'
      }, {
        name: '个人设置',
        id: '2'
      }, {
        name: '短信设置',
        id: '3',
        code: '150200'
      }],
      rightTitle: '修改密码',
      rightKey: '1',
      // 密码
      formPwd: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      // 个人
      formPersonal: {},
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
      }],
      // 校验相关
      // 密码
      rulePwd: {
        oldPassword: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
          { validator: pswRight, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: CHECK_PWD, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: CHECK_PWD_SAME, trigger: 'blur', vm: this }
        ]
      },
      // 个人
      rulePersonal: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: CHECK_NAME, trigger: 'blur' }
        ]
      },
      // 公司
      ruleCompany: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { validator: CHECK_NAME_COMPANY, trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入公司联系人', trigger: 'blur' },
          { validator: CHECK_NAME, trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: CHECK_PHONE, trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '请选择所在省市' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight', 'UserInfo']),
    styleHeight () {
      return { height: this.DocumentHeight + 'px' }
    },
    formCityCode () {
      return this.formCompany.cityId
    }
  },
  mounted: function () {
    this.messageListInit = _.cloneDeep(this.messageList)
    if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
      document.getElementById('set-up-container').style.maxHeight = (document.body.clientHeight - 80) + 'px'
    }
  },
  methods: {
    ...mapMutations(['initUserInfo']),
    smsInfo () {
      this.messageList = _.cloneDeep(this.messageListInit)
      Server({
        url: 'set/smsInfo',
        method: 'get'
      }).then(({ data }) => {
        if (data.data.smsCode) {
          this.msgCheckBoxList = data.data.smsCode === '' ? [] : data.data.smsCode
          this.msgCheckBoxListInit = data.data.smsCode === '' ? [] : data.data.smsCode
          for (const checkList of this.messageList) {
            checkList.checkBox.forEach(element => {
              if (this.msgCheckBoxList.includes(element.model)) {
                element.model = true
                this.switchMsg = true
              }
            })
          }
        }
      })
    },
    clickLeftMenu (id, menuName) {
      this.rightTitle = menuName
      this.rightKey = id
      switch (id) {
        case '2':
          this.formPersonal = _.cloneDeep(this.UserInfo)
          break
        case '3':
          this.smsInfo()
          break
      }
    },
    // 密码
    pwdSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formPwd.oldPassword === this.formPwd.password) {
            this.$Message.info('您还未变更任何信息，无需保存')
            return
          }
          Server({
            url: 'set/updatePsw',
            method: 'post',
            data: this.formPwd
          }).then(({ data }) => {
            this.$Message.success('保存成功!')
            this.formPwd = {}
          })
        }
      })
    },
    // 个人
    personalSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formPersonal.name === this.UserInfo.name) {
            this.$Message.info('您还未变更任何信息，无需保存')
            return
          }
          let param = {}
          param.name = this.formPersonal.name
          param.avatarPic = ''
          Server({
            url: 'set/person',
            method: 'post',
            data: param
          }).then(({ data }) => {
            if (data.code === 10000) {
              this.initUserInfo(this.formPersonal)
              this.$Message.success('保存成功!')
              this.formPwd = {}
            }
          })
        }
      })
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
          this.msgCheckBoxListInit = _.cloneDeep(this.msgSlectCheckBox)
          this.$Message.success('保存成功!')
          this.msgCheckBoxListInit = _.cloneDeep(this.msgSlectCheckBox)
        }
      })
    }
  }
}
</script>
<style lang='stylus' scoped>
.set-up-container
  overflow auto
>>> .ivu-menu-vertical.ivu-menu-light:after
  background: #fff;
>>> .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    background: #fff;
    color: #333333;
    font-weight: bold;
.temAll
  width: 100%
  height: 100%;
  background:rgba(243,245,249,1);
  margin: -20px -15px;
  .setConf
    margin-top: 20px;
    left: 50%;
    margin-left: -35%
    .inputClassSty
      width:300px;
    .labelClassSty
      font-weight: bold;
.menuList
  background:rgba(243,245,249,1);
  color: #333;
.contentDiv
  background:#fff;
  padding-left:20px;
  height: 100%;
.borderBottomLine
  border-bottom: 1px solid #e9e9e9;
  padding-bottom:10px;
  margin-top: 14px;
  margin-right: 20px;
  .iconRightTitle
    width: 5px;
    height: 20px;
    background: #00a4bd;
    position: absolute;
    left: 20px;
    margin-top: 2px;
    border-radius:3px;
  .iconRightTitleP
   margin-left:20px;
   font-size: 16px;
   font-weight:600;
.mesDiv
  min-height: 120px;
  width: 100%;
  padding: 15px 0;
  border-top: 1px solid rgba(201,206,217,1);
  cursor: hand;
  P
    font-size: 12px;
    margin-top: 5px;
.msgSaveBtn
    position: absolute;
    left: 30%;
    margin-top: 20px;
.msgCardTitle
  margin-bottom: 15px;
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
.divSetContent
  width: 70%;
  min-height:400px;
  margin-top:40px;
  left: 15%;
  position: absolute;
</style>
