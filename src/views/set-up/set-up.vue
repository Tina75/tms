<template>
  <div class="temAll">
    <Col span="3">
    <Menu active-name="修改密码" class="leftMenu" style="width: 150px;  background: rgba(248,248,248,1);">
      <MenuItem v-for="menu in setUpMenu" :key="menu.id" :name="menu.name" @click.native="clickLeftMenu(menu.id, menu.name)">
      <p class="menuTitle">{{menu.name}}</p>
        </MenuItem>
    </Menu>
    </Col>
    <Col span="18">
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:10px;margin-top: 14px;">
      <span class="iconRightTitle" style="width: 5px;height: 20px;background: #00a4bd; position: absolute;"></span>
      <span style="margin-left:25px; font-size: 16px;">{{rightTitle}}</span>
    </div>
    <!--密码设置-->
    <div v-if="'1' === this.rightKey" style="height:250px;">
      <Col span="10" class="setConf">
      <Form ref="formPwd" :model="formPwd" :rules="rulePwd" :label-width="90">
        <FormItem label="原始密码：" prop="originalPwd">
          <Input v-model="formPwd.originalPwd" type="password" placeholder="请输入原始密码"></Input>
        </FormItem>
        <FormItem label="新密码：" prop="password">
          <Input v-model="formPwd.password" type="password" placeholder="请输入新密码"></Input>
        </FormItem>
        <FormItem label="确认密码：" prop="passwordConfirm">
          <Input v-model="formPwd.passwordConfirm" type="password" placeholder="请再次输入新密码"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="pwdSubmit('formPwd')">保存</Button>
        </FormItem>
      </Form>
        </Col>
    </div>
    <!--个人设置-->
    <div v-if="'2' === this.rightKey" style="height:350px;">
      <Col span="10" class="setConf">
      <Form ref="formPersonal" :model="formPersonal" :rules="rulePersonal" :label-width="90">
        <FormItem label="账号：">
          <span>{{formPersonal.account}}</span>
        </FormItem>
        <FormItem label="姓名：" prop="name">
          <Input v-model="formPersonal.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="角色：">
          <span>{{formPersonal.role}}</span>
        </FormItem>
        <FormItem label="头像：">
          <!--个人设置-图片相关-->
          <div class="demo-upload-list">
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
          </Upload>
          <!--个人设置-图片相关-->
        </FormItem>
        <FormItem>
          <p style="color:rgba(153,153,153,1);">尺寸60*60像素，大小不超过1M</p>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="personalSubmit('formPersonal')">保存</Button>
        </FormItem>
      </Form>
        </Col>
    </div>
    <!--短信设置-->
    <div v-if="'3' === this.rightKey">
      <Col span="18" class="setConf">
      <Card dis-hover>
        <div solt="title" class="msgCardTitle">
          开启短信提醒
          <i-switch v-model="switchMsg" @on-change="changeCheckBoxGroup" />
        </div>
        <div v-for="msg in this.messageList" :key="msg.title" class="mesDiv">
          <p style="font-weight: bold">{{msg.title}}</p>
          <p>{{msg.message}}</p>
          <p>接收人：
            <Checkbox
              v-for="checkBtn in msg.checkBox"
              :key="checkBtn.index"
              v-model="checkBtn.model"
              style="margin-left:15px;"
              @on-change="checkBtnBox(checkBtn.model)">
              {{checkBtn.label}}
            </Checkbox>
          </p>
        </div>
      </Card>
      <Button type="primary" class="msgSaveBtn">保存</Button>
        </Col>
    </div>
    <!--公司设置-->
    <div v-if="'4' === this.rightKey" style="height:530px;">
      <Col span="10" class="setConf">
      <Form ref="formCompany" :model="formCompany" :rules="ruleCompany" :label-width="120">
        <FormItem label="公司名称：" prop="name">
          <Input v-model="formCompany.name" placeholder="请输入公司名称"></Input>
        </FormItem>
        <FormItem label="公司联系人：" prop="contacts">
          <Input v-model="formCompany.contacts" placeholder="请输入公司联系人"></Input>
        </FormItem>
        <FormItem label="联系方式：" prop="contactsType">
          <Input v-model="formCompany.contactsType" placeholder="请输入联系方式"></Input>
        </FormItem>
        <FormItem label="所在省市：" prop="province">
          <Input v-model="formCompany.province" placeholder="请选择所在省市"></Input>
        </FormItem>
        <FormItem label="公司地址：" prop="address">
          <Input v-model="formCompany.address" placeholder="请输入公司地址"></Input>
        </FormItem>
        <FormItem label="公司LOGO：">
          <!--公司设置-图片相关-->
          <div class="demo-upload-list">
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
          </Upload>
          <!--公司设置-图片相关-->
        </FormItem>
        <FormItem>
          <p style="color:rgba(153,153,153,1);">尺寸60*60像素，大小不超过1M</p>
        </FormItem>
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
export default {
  name: 'set-up',
  mixins: [ BasePage ],
  metaInfo: {
    title: '设置'
  },
  data () {
    return {
      setUpMenu: [{
        name: '修改密码',
        id: '1'
      }, {
        name: '个人设置',
        id: '2'
      }, {
        name: '短信设置',
        id: '3'
      }, {
        name: '公司设置',
        id: '4'
      }],
      rightTitle: '修改密码',
      rightKey: '1',
      // 密码
      formPwd: {
        originalPwd: '',
        password: '',
        passwordConfirm: ''
      },
      // 个人
      formPersonal: {
        account: '1513165411813354',
        name: '士大夫似',
        role: '管理员'
      },
      // 公司
      formCompany: {
        name: '士大夫似',
        contacts: '管理员',
        contactsType: '156131351513',
        province: '江苏',
        address: '江苏南京雨花台区'
      },
      // 短信
      switchMsg: false,
      messageList: [{
        title: '发运提醒',
        message: '提醒内容： 【智加云TMS公司】XX公司，您的货物已装车，由车牌号XXXX司机姓名XXXX司机电话XXXX派送。',
        checkBox: [{
          label: '发货人',
          model: false
        }, {
          label: '发货人',
          model: false
        }]
      }, {
        title: '到货提醒',
        message: '提醒内容： 【智加云TMS公司】XX公司，您的货物已签收，由车牌号XXXX司机姓名XXXX司机电话XXXX完成派送。',
        checkBox: [{
          label: '发货人',
          model: false
        }, {
          label: '发货人',
          model: false
        }]
      }, {
        title: '指派司机提醒',
        message: '发货提醒： 【智加云TMS公司】XX公司给您发了新的指派运单，请再司机端查看。',
        checkBox: [{
          label: '司机',
          model: false
        }]
      }],
      // 校验相关
      // 密码
      rulePwd: {
        originalPwd: [
          { required: true, message: '请输入原始密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      },
      // 个人
      rulePersonal: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      // 公司
      ruleCompany: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '请输入公司联系人', trigger: 'blur' }
        ],
        contactsType: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择所在省市', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ]
      },
      // 图片相关-个人
      uploadList: {
        'name': 'bc7521e033abdd1e92222d733590f104',
        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
      },
      // 图片相关-公司
      uploadListCompany: {
        'name': 'a42bdcc1178e62b4694c830f028db5c0',
        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
      }
    }
  },
  mounted: function () {
    // this.uploadList = this.$refs.upload.fileList
    // this.uploadListCompany = this.$refs.uploadCompany.fileList
  },
  methods: {
    clickLeftMenu (id, menuName) {
      this.rightTitle = menuName
      this.rightKey = id
    },
    // 密码
    pwdSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    // 个人
    personalSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    // 公司
    companySubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
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
    checkBtnBox (model) {
      let statusList = []
      let checkNum = 0
      for (const checkList of this.messageList) {
        checkList.checkBox.forEach(element => {
          checkNum++
          if (element.model) {
            statusList.push(element.model)
          }
        })
        this.switchMsg = (statusList.length === checkNum)
      }
    },
    // 图片相关 -个人
    handleSuccess (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
      file.name = 'a42bdcc1178e62b4694c830f028db5c0'
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload (file) {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    },
    // 图片相关 -公司
    handleSuccessCompany (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
    },
    handleFormatErrorCompany (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSizeCompany (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUploadCompany () {
      const check = this.uploadListCompany.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    }
  }
}
</script>
<style lang='stylus' scoped>
.temAll
  margin: 20px;
  .setConf
    margin-top: 20px;
    left: 50%;
    margin-left: -35%
.mesDiv
  height: 100px;
  width: 670px;
  padding: 15px 0;
  border-top: 1px solid rgba(201,206,217,1);
  cursor: hand;
  P
    font-size: 12px;
    margin-top: 5px;
.msgSaveBtn
    position: absolute;
    left: 50%;
    margin-left: -35px;
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
