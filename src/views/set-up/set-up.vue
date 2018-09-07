<template>
  <div class="temAll">
    <Tabs size="small">
      <TabPane label="密码修改">
        <Col span="14" class="setConf">
        <Card style="height:250px;">
          <Col span="16" class="setConf">
          <Form ref="formPwd" :model="formPwd" :rules="rulePwd" :label-width="90">
            <FormItem label="原始密码：" prop="originalPwd">
              <Input v-model="formPwd.originalPwd" type="password" placeholder="Enter your name"></Input>
            </FormItem>
            <FormItem label="新密码：" prop="password">
              <Input v-model="formPwd.password" type="password" placeholder="Enter your e-mail"></Input>
            </FormItem>
            <FormItem label="确认密码：" prop="passwordConfirm">
              <Input v-model="formPwd.passwordConfirm" type="password" placeholder="Enter your e-mail"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="pwdSubmit('formPwd')">保存</Button>
            </FormItem>
          </Form>
                </Col>
        </Card>
          </Col>
      </TabPane>
      <TabPane label="个人设置">
        <Col span="14" class="setConf">
        <Card style="height:350px;">
          <Col span="16" class="setConf">
          <Form ref="formPersonal" :model="formPersonal" :rules="rulePersonal" :label-width="90">
            <FormItem label="账号：">
              <span>{{formPersonal.account}}</span>
            </FormItem>
            <FormItem label="姓名：" prop="name">
              <Input v-model="formPersonal.name" placeholder="Enter your name"></Input>
            </FormItem>
            <FormItem label="角色：">
              <span>{{formPersonal.role}}</span>
            </FormItem>
            <FormItem label="头像：">
              <!--图片相关-->
              <div v-for="item in uploadList" :key="item.index" class="demo-upload-list">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal v-model="visible" title="View Image">
                <img v-if="visible" :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" style="width: 100%">
              </Modal>
              <!--图片相关-->
            </FormItem>
            <FormItem>
              <Button type="primary" @click="personalSubmit('formPersonal')">保存</Button>
            </FormItem>
          </Form>
                </Col>
        </Card>
          </Col>
      </TabPane>
      <TabPane label="公司设置">
        <Col span="14" class="setConf">
        <Card style="height:530px;">
          <Col span="16" class="setConf">
          <Form ref="formCompany" :model="formCompany" :rules="ruleCompany" :label-width="120">
            <FormItem label="公司名称：" prop="name">
              <Input v-model="formCompany.name" placeholder="Enter your name"></Input>
            </FormItem>
            <FormItem label="公司联系人：" prop="contacts">
              <Input v-model="formCompany.contacts" placeholder="Enter your e-mail"></Input>
            </FormItem>
            <FormItem label="联系方式：" prop="contactsType">
              <Input v-model="formCompany.contactsType" placeholder="Enter your e-mail"></Input>
            </FormItem>
            <FormItem label="所在省市：" prop="province">
              <Input v-model="formCompany.province" placeholder="Enter your e-mail"></Input>
            </FormItem>
            <FormItem label="公司地址：" prop="address">
              <Input v-model="formCompany.address" placeholder="Enter your e-mail"></Input>
            </FormItem>
            <FormItem label="公司LOGO：">
              <!--图片相关-->
              <div v-for="item in uploadList" :key="item.index" class="demo-upload-list">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal v-model="visible" title="View Image">
                <img v-if="visible" :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" style="width: 100%">
              </Modal>
              <!--图片相关-->
            </FormItem>
            <FormItem>
              <p>尺寸140*60像素，大小不超过1M</p>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="companySubmit('formCompany')">保存</Button>
            </FormItem>
          </Form>
                </Col>
        </Card>
          </Col>
      </TabPane>
      <TabPane label="短信设置">
        <Col span="14" class="setConf">
        <Card style="height:250px;">
          <Col span="16" class="setConf">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
              :indeterminate="msgIndeterminate"
              :value="msgCheckAll"
              @click.prevent.native="msgHandleCheckAll">
              开启短信提醒
            </Checkbox>
          </div>
          <CheckboxGroup v-model="msgCheckAllGroup" @on-change="msgCheckAllGroupChange">
            <Checkbox label="香蕉"></Checkbox>
            <Checkbox label="苹果"></Checkbox>
            <Checkbox label="西瓜"></Checkbox>
          </CheckboxGroup>
                </Col>
        </Card>
          </Col>
      </TabPane>
      <TabPane label="提示设置">
        <Col span="14" class="setConf">
        <Card style="height:250px;">
          <Col span="16" class="setConf">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
              :indeterminate="tipsIndeterminate"
              :value="tipsCheckAll"
              @click.prevent.native="tipsHandleCheckAll">
              全选
            </Checkbox>
          </div>
          <CheckboxGroup v-model="tipsCheckAllGroup" @on-change="tipsCheckAllGroupChange">
            <Checkbox label="香蕉x"></Checkbox>
            <Checkbox label="苹果x"></Checkbox>
            <Checkbox label="西瓜x"></Checkbox>
          </CheckboxGroup>
                </Col>
        </Card>
          </Col>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: 'set-up',
  data () {
    return {
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
      msgIndeterminate: true,
      msgCheckAll: false,
      msgCheckAllGroup: ['香蕉', '西瓜'],
      // 提醒
      tipsIndeterminate: true,
      tipsCheckAll: false,
      tipsCheckAllGroup: ['香蕉x', '西瓜x'],
      // 校验相关
      // 密码
      rulePwd: {
        originalPwd: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
        ]
      },
      // 个人
      rulePersonal: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ]
      },
      // 公司
      ruleCompany: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
        ],
        contactsType: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
        ],
        province: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
        ]
      },
      // 图片相关
      defaultList: [
        {
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        }],
      imgName: '',
      visible: false,
      uploadList: []
    }
  },
  mounted: function () {
    this.uploadList = this.$refs.upload.fileList
  },
  methods: {
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
    msgHandleCheckAll () {
      if (this.msgIndeterminate) {
        this.msgCheckAll = false
      } else {
        this.msgCheckAll = !this.msgCheckAll
      }
      this.msgIndeterminate = false

      if (this.msgCheckAll) {
        this.msgCheckAllGroup = ['香蕉', '苹果', '西瓜']
      } else {
        this.msgCheckAllGroup = []
      }
    },
    msgCheckAllGroupChange (data) {
      if (data.length === 3) {
        this.msgIndeterminate = false
        this.msgCheckAll = true
      } else if (data.length > 0) {
        this.msgIndeterminate = true
        this.msgCheckAll = false
      } else {
        this.msgIndeterminate = false
        this.msgCheckAll = false
      }
    },
    // 提示
    tipsHandleCheckAll () {
      if (this.tipsIndeterminate) {
        this.tipsCheckAll = false
      } else {
        this.tipsCheckAll = !this.tipsCheckAll
      }
      this.tipsIndeterminate = false

      if (this.tipsCheckAll) {
        this.tipsCheckAllGroup = ['香蕉x', '苹果x', '西瓜x']
      } else {
        this.tipsCheckAllGroup = []
      }
    },
    tipsCheckAllGroupChange (data) {
      if (data.length === 3) {
        this.tipsIndeterminate = false
        this.tipsCheckAll = true
      } else if (data.length > 0) {
        this.tipsIndeterminate = true
        this.tipsCheckAll = false
      } else {
        this.tipsIndeterminate = false
        this.tipsCheckAll = false
      }
    },
    // 图片相关
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
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
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
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
    left: 50%
    margin-left: -30%
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
