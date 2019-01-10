<template>
  <div id="set-up-container" class="set-up-container temAll">
    <Row id="temAll" :style="styleHeight">
      <Col span="1" class="menuCol">
      <!-- <Menu :active-name="rightKey != 3 ? rightTitle : '系统设置'" class="menuList" style="width:160px">
        <MenuItem v-for="menu in setUpMenu" v-if="hasPower(menu.code)" :key="menu.id" :name="menu.name" @click.native="clickMenu(menu)">
        <p class="menuTitle">{{menu.name}}</p>
        </MenuItem>
      </Menu> -->
      <!-- <VerticalTabs value="11">
        <VerticalTabItem key="1" :icon="{type:'ico-discovery',color:'#00a4bd'}" label="test1" name="11">123</VerticalTabItem>
        <VerticalTabItem key="2" label="test2" name="22">456</VerticalTabItem>
      </VerticalTabs> -->
      <VerticalTabs :value="rightKey != '3' ? rightKey : '3'" @on-select="clickMenu">
        <VerticalTabItem
          v-for="menu in setUpMenu"
          v-if="hasPower(menu.code)"
          :key="menu.id"
          :name="menu.id"
          :label="menu.name">
        </VerticalTabItem>
      </VerticalTabs>
      </Col>
      <Col span="20" class="contentDiv">
      <div v-if="3 != rightKey" class="borderBottomLine">
        <span class="iconRightTitle"></span>
        <span class="iconRightTitleP">{{rightTitle}}</span>
      </div>
      <Tabs v-else :value="tabName" style="margin-top: 10px" @on-click="tabChange">
        <TabPane label="分摊策略" name="apport"></TabPane>
        <TabPane label="开单设置" name="order"></TabPane>
      </Tabs>
      <!--密码设置-->
      <div v-if="0 === this.rightKey" key="1" class="divSetContent">
        <Col span="10" class="setConf">
        <Form ref="formPwd" :model="formPwd" :rules="rulePwd" :label-width="100" label-position="right">
          <FormItem label="原始密码：" prop="oldPassword">
            <Input v-model="formPwd.oldPassword" type="password" placeholder="请输入原始密码" class="inputClassSty"></Input>
          </FormItem>
          <FormItem label="新密码：" prop="password">
            <Input v-model="formPwd.password" type="password" placeholder="请输入新密码" class="inputClassSty"></Input>
          </FormItem>
          <FormItem label="确认密码：" prop="confirmPassword">
            <Input v-model="formPwd.confirmPassword" type="password" placeholder="请再次输入新密码" class="inputClassSty"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" style="width:86px;" @click="pwdSubmit('formPwd')">保存</Button>
          </FormItem>
        </Form>
          </Col>
      </div>
      <!--个人设置-->
      <div v-show="1 === this.rightKey" key="2" class="divSetContent">
        <Col span="20" class="setConf">
        <Form ref="formPersonal" :model="formPersonal" :rules="rulePersonal" :label-width="100" label-position="right">
          <FormItem label="账号：">
            <span class="labelContent">{{formPersonal.phone}}<span class="updatePhone" @click="updatePhone">修改</span></span>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input v-model="formPersonal.name" :maxlength="10" placeholder="请输入姓名" class="inputClassSty"></Input>
          </FormItem>
          <FormItem label="角色：">
            <span class="labelContent">{{formPersonal.roleName}}</span>
          </FormItem>
          <FormItem label="个人头像：">
            <span class="imageTips">尺寸100*100像素，大小不超过10MB</span>
          </FormItem>
          <FormItem>
            <up-load ref="upLoadsPerson" max-size="10" crop class="personPic"></up-load>
          </FormItem>
          <FormItem>
            <Button type="primary" style="width:86px;"  @click="personalSubmit('formPersonal')">保存</Button>
          </FormItem>
        </Form>
          </Col>
      </div>
      <!--短信设置-->
      <div v-if="2 === this.rightKey" key="3" style="margin-left:-125px;" class="divSetContent">
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
      <!--系统设置-->
      <div v-else-if="3 === this.rightKey" key="4" class="system-set">
        <div v-if="tabName != 'order'" class="setup-allocation">
          <allocation-strategy ref="orderAllocation" allocation-label="订单：" source="order"></allocation-strategy>
          <div class="allocation-tips">选择以后订单拆单将默认选择此运费分摊策略</div>
          <allocation-strategy ref="transportAllocation" allocation-label="运单&提货单：" source="transport"></allocation-strategy>
          <div class="allocation-tips">选择以后运单和提货单将默认选择此运费分摊策略</div>
          <Button type="primary" class="msgSaveBtn" style="width:86px;left: 22%;" @click="handleSaveAllocation">保存</Button>
        </div>
        <div v-else>
          <Unit />
        </div>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import AreaInput from '@/components/AreaInput'
import { CHECK_PWD, CHECK_PWD_SAME, CHECK_NAME, CHECK_NAME_COMPANY, CHECK_PHONE, PSW_RIGHT } from './validator'
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import CitySelect from '@/components/SelectInputForCity'
import Unit from '../components/unit.vue'
import AllocationStrategy from '@/views/transport/components/AllocationStrategy.vue'
import VerticalTabs from '@/components/vertical-tabs/index'
import UpLoad from '@/components/upLoad/index.vue'
export default {
  name: 'set-up',
  components: {
    AreaInput,
    CitySelect,
    Unit,
    AllocationStrategy,
    VerticalTabs,
    VerticalTabItem: VerticalTabs.TabItem,
    UpLoad
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
      rightKey: 0,
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
          { validator: PSW_RIGHT, trigger: 'blur' }
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
      },
      tabName: ''
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight', 'UserInfo', 'SmsSet']),
    styleHeight () {
      return { height: this.DocumentHeight + 'px' }
    },
    formCityCode () {
      return this.formCompany.cityId
    },
    // 受理开单来的参数
    isFromOrder () {
      return this.$route.query.tab
    }
  },
  created () {
    // 受理开单来的
    if (this.isFromOrder) {
      this.rightKey = 3
      this.tabName = 'order'
    }
  },
  mounted: function () {
    this.messageListInit = _.cloneDeep(this.messageList)
    this.initPerson()
    if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
      document.getElementById('set-up-container').style.maxHeight = (document.body.clientHeight - 80) + 'px'
    }
  },
  methods: {
    ...mapMutations(['initUserInfo', 'smsSetting', 'allocationStrategySetting']),
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
    clickMenu (param) {
      this.rightTitle = param.label
      this.rightKey = parseInt(param.name)
      switch (this.rightKey) {
        case 1:
          this.initPerson()
          break
        case 2:
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
      let isChanged = true
      this.formPersonal.avatarPic = this.$refs.upLoadsPerson.uploadImg
      this.$refs[name].validate((valid) => {
        if (valid) {
          for (const key in this.UserInfo) {
            if (this.formPersonal[key] !== this.UserInfo[key]) {
              isChanged = false
            }
          }
          if (isChanged) {
            this.$Message.info('您还未变更任何信息，无需保存')
            return
          }
          let param = {}
          param.name = this.formPersonal.name
          param.avatarPic = this.formPersonal.avatarPic
          Server({
            url: 'set/person',
            method: 'post',
            data: param
          }).then(({ data }) => {
            if (data.code === 10000) {
              this.initUserInfo(this.formPersonal)
              this.$Message.success('保存成功!')
              this.formPersonal = _.cloneDeep(this.UserInfo)
            }
          })
        }
      })
    },
    initPerson () {
      this.formPersonal = _.cloneDeep(this.UserInfo)
      if (this.formPersonal.avatarPic) {
        this.$refs.upLoadsPerson.progress = 1
        this.$refs.upLoadsPerson.uploadImg = this.formPersonal.avatarPic
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
          this.msgCheckBoxListInit = _.cloneDeep(this.msgSlectCheckBox)
        }
      })
    },
    tabChange (name) {
      this.tabName = name
    },
    handleSaveAllocation () {
      const data = {
        orderStrategy: this.$refs.orderAllocation.getAllocation(),
        waybillStrategy: this.$refs.transportAllocation.getAllocation()
      }
      Server({
        url: '/set/updateUserAllocationStrategy',
        method: 'post',
        data
      }).then((res) => {
        this.allocationStrategySetting(data)
        this.$Message.success('设置成功')
      })
    },
    updatePhone () {
      const vm = this
      this.openDialog({
        name: 'set-up/dialog/update-phone',
        data: {
          title: '更换手机号',
          phone: vm.formPersonal.phone,
          person: vm.formPersonal
        },
        methods: {
          ok () {
            vm.initPerson()
            location.reload() // 更新账号，刷新浏览器
          }
        }
      })
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
  background: #fff
  margin: -20px -15px;
  .setConf
    margin-top: 20px;
    left: 50%;
    margin-left: -35%
    .inputClassSty
      width:300px;
.menuCol
  width:160px
  height:100%
  background-color:#f3f5f9
  overflow:hidden
  padding-top: 20px
.menuList
  background:rgba(243,245,249,1);
  color: #333;
.contentDiv
  background:#fff;
  padding-left:20px;
  height: 100%;
.borderBottomLine
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 12px;
  margin-top: 18px;
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
    margin-top: 25px;
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
.system-set
  min-height 400px
.allocation-tips
  font-size 12px
  font-family 'PingFangSC-Regular'
  color rgba(236,78,78,1)
  margin -20px 0 30px 110px
.menuTitle
  font-size: 16px
  margin-top: 5px;
  margin-left: -10px;
.imageTips
  color #999999
  font-size 14px
  position: relative;
  top: 1px;
.updatePhone
  color: #00A4BD
  margin-left 25px
  cursor pointer
span.labelContent
  position: relative;
  top: 1px;
</style>

<style lang='stylus'>
  .setup-allocation
    width 500px
    position absolute
    top 24%
    left 50%
    transform translate(-50%, -50%)
    .ivu-form-item-label
      width 110px !important
      font-size 14px
      font-family 'PingFangSC-Regular'
      color rgba(0,0,0,1)
    .ivu-select
      width 300px !important
</style>
