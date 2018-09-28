<template>
  <div class="temAll">
    <Col span="3">
    <Menu active-name="修改密码" style="width: 100%;">
      <MenuItem v-for="menu in setUpMenu" v-if="hasPower(menu.code)" :key="menu.id" :name="menu.name" @click.native="clickLeftMenu(menu.id, menu.name)">
      <p class="menuTitle">{{menu.name}}</p>
      </MenuItem>
    </Menu>
    </Col>
    <Col span="18">
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:10px;margin-top: 14px;">
      <span class="iconRightTitle" style="width: 5px;height: 20px;background: #00a4bd; position: absolute; left: 20px;"></span>
      <span style="margin-left:35px; font-size: 16px;">{{rightTitle}}</span>
    </div>
    <!--密码设置-->
    <div v-if="'1' === this.rightKey" key="1" style="height:530px;">
      <Col span="10" class="setConf">
      <Form ref="formPwd" :model="formPwd" :rules="rulePwd" :label-width="90" label-position="left">
        <FormItem label="原始密码：" prop="oldPassword">
          <Input v-model="formPwd.oldPassword" type="password" placeholder="请输入原始密码"></Input>
        </FormItem>
        <FormItem label="新密码：" prop="password">
          <Input v-model="formPwd.password" type="password" placeholder="请输入新密码"></Input>
        </FormItem>
        <FormItem label="确认密码：" prop="confirmPassword">
          <Input v-model="formPwd.confirmPassword" type="password" placeholder="请再次输入新密码"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="pwdSubmit('formPwd')">保存</Button>
        </FormItem>
      </Form>
      </Col>
    </div>
    <!--个人设置-->
    <div v-else-if="'2' === this.rightKey" key="2" style="height:530px;">
      <Col span="10" class="setConf">
      <Form ref="formPersonal" :model="formPersonal" :rules="rulePersonal" :label-width="90" label-position="left">
        <FormItem label="账号：">
          <span>{{formPersonal.phone}}</span>
        </FormItem>
        <FormItem label="姓名：" prop="name" style="margin-left: -9px;">
          <Input v-model="formPersonal.name" placeholder="请输入姓名" style="margin-left: 9px;"></Input>
        </FormItem>
        <FormItem label="角色：">
          <span>{{formPersonal.roleName}}</span>
        </FormItem>
        <!-- <FormItem label="头像："> -->
        <!--个人设置-图片相关-->
        <!-- <div class="demo-upload-list">
            <img :src="uploadList.url">
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
            style="display: inline-block;width:58px; color:#00a4bd"
          >
            修改头像
          </Upload> -->
        <!--个人设置-图片相关-->
        <!-- </FormItem>
        <FormItem>
          <p style="color:rgba(153,153,153,1);">尺寸60*60像素，大小不超过1M</p>
        </FormItem> -->
        <FormItem>
          <Button type="primary" @click="personalSubmit('formPersonal')">保存</Button>
        </FormItem>
      </Form>
      </Col>
    </div>
    <!--短信设置-->
    <div v-else-if="'3' === this.rightKey" key="3" style="height:530px;">
      <Col span="20" class="setConf">
      <Card dis-hover>
        <div solt="title" class="msgCardTitle">
          开启短信提醒
          <i-switch v-model="switchMsg" style="margin-left:20px;" @on-change="changeCheckBoxGroup" />
        </div>
        <div v-for="msg in this.messageList" :key="msg.title" class="mesDiv">
          <p style="font-weight: bold">{{msg.title}}</p>
          <p>{{msg.message}}</p>
          <p>{{msg.messageReturn}}</p>
          <p>接收人：
            <Checkbox
              v-for="checkBtn in msg.checkBox"
              :key="checkBtn.index"
              v-model="checkBtn.model"
              style="margin-left:15px;"
              @on-change="checkBtnBox()">
              {{checkBtn.label}}
            </Checkbox>
          </p>
        </div>
      </Card>
      <Button type="primary" class="msgSaveBtn" @click="msgSaveBtn">保存</Button>
      </Col>
    </div>
    <!--公司设置-->
    <div v-else-if="'4' === this.rightKey" key="4" style="height:530px;">
      <Col span="10" class="setConf">
      <Form ref="formCompany" :model="formCompany" :rules="ruleCompany" :label-width="120" label-position="left">
        <FormItem label="公司名称：" prop="name">
          <Input v-model="formCompany.name" placeholder="请输入公司名称"></Input>
        </FormItem>
        <FormItem label="公司联系人：" prop="contact">
          <Input v-model="formCompany.contact" placeholder="请输入公司联系人"></Input>
        </FormItem>
        <FormItem label="联系方式：" prop="contactPhone">
          <Input v-model="formCompany.contactPhone" placeholder="请输入联系方式"></Input>
        </FormItem>
        <FormItem label="所在省市：" prop="cityId">
          <AreaSelect v-model="formCompany.cityId" :deep="true"></AreaSelect>
        </FormItem>
        <FormItem label="公司地址：" prop="address">
          <Input v-model="formCompany.address" placeholder="请输入公司地址"></Input>
        </FormItem>
        <!-- <FormItem label="公司LOGO："> -->
        <!--公司设置-图片相关-->
        <!-- <div class="demo-upload-list">
            <img :src="uploadListCompany.url">
          </div>
          <Upload
            ref="uploadCompany"
            :show-upload-list="false"
            :on-success="handleSuccessCompany"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatErrorCompany"
            :on-exceeded-size="handleMaxSizeCompany"
            :before-upload="handleBeforeUploadCompany"
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
            style="display: inline-block;width:58px; color:#00a4bd">
            点击上传
          </Upload> -->
        <!--公司设置-图片相关-->
        <!-- </FormItem>
        <FormItem>
          <p style="color:rgba(153,153,153,1);">尺寸60*60像素，大小不超过1M</p>
        </FormItem> -->
        <FormItem>
          <Button type="primary" @click="companySubmit('formCompany')">保存</Button>
        </FormItem>
      </Form>
        </Col>
    </div>
    </Col>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import AreaSelect from '@/components/AreaSelect'
import _ from 'lodash'
export default {
  name: 'set-up',
  components: {
    AreaSelect
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '设置'
  },
  data () {
    let this_ = this
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
    var checkPwd = function (rule, value, callback) {
      if (!(/^[0-9A-Za-z].{5,16}$/.test(value))) {
        return callback(new Error('密码只能包含数字、大小写字母，至少为6位，至多为16位'))
      } else {
        callback()
      }
    }
    var checkPwdSame = function (rule, value, callback) {
      if (value !== this_.formPwd.password) {
        return callback(new Error('两次密码不一致，请重输'))
      } else {
        callback()
      }
    }
    var checkName = function (rule, value, callback) {
      if (value.length < 2 || value.length > 10) {
        return callback(new Error('姓名不能小于2个字且不能多于10个字'))
      } else {
        callback()
      }
    }
    var checkNameCompany = function (rule, value, callback) {
      if (value.length > 25) {
        return callback(new Error('公司名不能超过25个字'))
      } else {
        callback()
      }
    }
    var checkAddressCompany = function (rule, value, callback) {
      if (value.length < 5 || value.length > 40) {
        return callback(new Error('公司地址不能少于5个字也不能超过40个字'))
      } else {
        callback()
      }
    }
    var checkPhone = function (rule, value, callback) {
      if (value) {
        if (!(/^1\d{10}$/.test(value) || /^0\d{2,3}-?\d{7,8}$/.test(value))) {
          return callback(new Error('联系方式格式不正确'))
        }
        callback()
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
      }, {
        name: '公司设置',
        id: '4',
        code: '150100'
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
      formPersonalInit: {},
      // 公司
      formCompany: {},
      formCompanyInit: {},
      // 短信
      switchMsg: false,
      checkNum: 0,
      msgCheckBoxList: [],
      msgCheckBoxListInit: [],
      msgSlectCheckBox: [],
      messageListInit: [],
      messageList: [{
        title: '发运提醒',
        message: '运单：【运掌柜TMS】您的货物已由xx公司安排送货，由车牌号XXXX司机姓名XXXX司机电话XXXX派送；',
        messageReturn: '外转单：【运掌柜TMS】您的xxx货物已由xx公司安排送货。',
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
        message: '运单：【运掌柜TMS】您的货物已签收，由车牌号XXX司机姓名XXX司机电话XXXX完成配送；',
        messageReturn: '外转单：【运掌柜TMS】您的xxx货物已签收。',
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
        message: '运单：【运掌柜TMS】XX公司给您指派了新的运单，请尽快装货；',
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
          { validator: checkPwd, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' },
          { validator: checkPwdSame, trigger: 'blur' }
        ]
      },
      // 个人
      rulePersonal: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ]
      },
      // 公司
      ruleCompany: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
          { validator: checkNameCompany, trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入公司联系人', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '请选择所在省市' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' },
          { validator: checkAddressCompany, trigger: 'blur' }
        ]
      }
      // 图片相关-个人
      // uploadList: {
      //   'name': 'bc7521e033abdd1e92222d733590f104',
      //   'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
      // },
      // // 图片相关-公司
      // uploadListCompany: {
      //   'name': 'a42bdcc1178e62b4694c830f028db5c0',
      //   'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
      // }
    }
  },
  mounted: function () {
    this.messageListInit = _.cloneDeep(this.messageList)
  },
  methods: {
    getCompanyInfo () {
      Server({
        url: 'set/companyInfo',
        method: 'get'
      }).then(({ data }) => {
        this.formCompany = Object.assign({}, data.data)
        this.formCompanyInit = Object.assign({}, data.data)
      })
    },
    getUserInfo () {
      Server({
        url: 'set/userInfo',
        method: 'get'
      }).then(({ data }) => {
        this.formPersonal = Object.assign({}, data.data)
        this.formPersonalInit = Object.assign({}, data.data)
      })
    },
    smsInfo () {
      this.messageList = _.cloneDeep(this.messageListInit)
      Server({
        url: 'set/smsInfo',
        method: 'get'
      }).then(({ data }) => {
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
      })
    },
    clickLeftMenu (id, menuName) {
      this.rightTitle = menuName
      this.rightKey = id
      switch (id) {
        case '2':
          this.getUserInfo()
          break
        case '3':
          this.smsInfo()
          break
        case '4':
          this.getCompanyInfo()
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
            if (data.code === 10000) {
              this.$Message.success('保存成功!')
              this.formPwd = {}
            } else {
              this.$Message.info(data.msg)
            }
          })
        }
      })
    },
    // 个人
    personalSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formPersonal.name === this.formPersonalInit.name) {
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
              this.$Message.success('保存成功!')
              this.formPwd = {}
            } else {
              this.$Message.info(data.msg)
            }
          })
        }
      })
    },
    // 公司
    companySubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formCompany.address === this.formCompanyInit.address &&
              this.formCompany.contact === this.formCompanyInit.contact &&
              this.formCompany.contactPhone === this.formCompanyInit.contactPhone &&
              this.formCompany.id === this.formCompanyInit.id &&
              this.formCompany.logoUrl === this.formCompanyInit.logoUrl &&
              this.formCompany.name === this.formCompanyInit.name &&
              Number(this.formCompany.cityId[this.formCompany.cityId.length - 1]) === Number(this.formCompanyInit.cityId)) {
            this.$Message.info('您还未变更任何信息，无需保存')
            return
          }
          let params = Object.assign({}, this.formCompany)
          params.cityId = params.cityId[params.cityId.length - 1].toString()
          Server({
            url: 'set/company',
            method: 'post',
            data: params
          }).then(({ data }) => {
            if (data.code === 10000) {
              this.$Message.success('保存成功!')
            } else {
              this.$Message.error(data.msg)
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
          this.$Message.success('保存成功!')
        } else {
          this.$Message.error(data.msg)
        }
      })
    }
    // 图片相关 -个人
    // handleSuccess (res, file) {
    //   file.url = 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
    //   file.name = 'a42bdcc1178e62b4694c830f028db5c0'
    // },
    // handleFormatError (file) {
    //   this.$Notice.warning({
    //     title: 'The file format is incorrect',
    //     desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
    //   })
    // },
    // handleMaxSize (file) {
    //   this.$Notice.warning({
    //     title: 'Exceeding file size limit',
    //     desc: 'File  ' + file.name + ' is too large, no more than 2M.'
    //   })
    // },
    // handleBeforeUpload (file) {
    //   const check = this.uploadList.length < 5
    //   if (!check) {
    //     this.$Notice.warning({
    //       title: 'Up to five pictures can be uploaded.'
    //     })
    //   }
    //   return check
    // },
    // 图片相关 -公司
    // handleSuccessCompany (res, file) {
    //   file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
    //   file.name = '7eb99afb9d5f317c912f08b5212fd69a'
    // },
    // handleFormatErrorCompany (file) {
    //   this.$Notice.warning({
    //     title: 'The file format is incorrect',
    //     desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
    //   })
    // },
    // handleMaxSizeCompany (file) {
    //   this.$Notice.warning({
    //     title: 'Exceeding file size limit',
    //     desc: 'File  ' + file.name + ' is too large, no more than 2M.'
    //   })
    // },
    // handleBeforeUploadCompany () {
    //   const check = this.uploadListCompany.length < 5
    //   if (!check) {
    //     this.$Notice.warning({
    //       title: 'Up to five pictures can be uploaded.'
    //     })
    //   }
    //   return check
    // }
  }
}
</script>
<style lang='stylus' scoped>
.temAll
  width: 100%
  overflow: auto;
  .setConf
    margin-top: 20px;
    left: 50%;
    margin-left: -35%
.mesDiv
  height: 120px;
  width: 720px;
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
</style>
