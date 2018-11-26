<template>
  <div id="set-up-container" class="set-up-container temAll">
    <div id="temAll">
      <!--公司设置-->
      <Form ref="formCompany" :model="formCompany" :rules="ruleCompany" :label-width="140" label-position="right">
        <div class="borderBottomLine">
          <span class="iconRightTitle"></span>
          <span class="iconRightTitleP">基本信息</span>
        </div>
        <span class="rightConfBtn">
          <Button class="buttonSty" @click="shareBtn">分享</Button>
          <Button type="primary" class="buttonSty" @click="editCompanyInfo">编辑</Button>
        </span>
        <Row>
          <Col :span="8">
          <FormItem label="公司全称：" prop="name">
            <Input v-if="isEdit" v-model="formCompany.name" :maxlength="25" placeholder="请输入公司名称"></Input>
            <span v-else>{{formCompany.name}}</span>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="公司简称：" prop="contactPhone">
            <Row v-if="isEdit">
              <Col :span="18">
              <Input v-model="formCompany.contactPhone" :maxlength="11" placeholder="请输入联系方式"></Input>
              </Col>
              <Col :span="4">
              <Tooltip
                class="unitSpan"
                max-width="220"
                transfer
                content="简称将用于短信推广、品牌展示等">
                <Icon type="ios-alert" class="ios-alert"/>
              </Tooltip>
              </Col>
            </Row>
            <span v-else>{{formCompany.contactPhone}}</span>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="公司联系人：" prop="contact">
            <Input v-if="isEdit" v-model="formCompany.contact" :maxlength="10" placeholder="请输入公司联系人"></Input>
            <span v-else>{{formCompany.contact}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
          <FormItem label="联系方式：" prop="contactPhone">
            <Input v-if="isEdit" v-model="formCompany.contactPhone" :maxlength="11" placeholder="请输入联系方式"></Input>
            <span v-else>{{formCompany.contactPhone}}</span>
          </FormItem>
          </Col>
          <Col :span="16">
          <FormItem label="公司地址：" prop="address">
            <Col v-if="isEdit" :span="8">
            <CitySelect v-model="formCompany.cityId" clearable></CitySelect>
            </Col>
            <Col v-if="isEdit" :span="16" class="areaRight">
            <AreaInput v-model="formCompany.address" :city-code="formCityCode" :maxlength="60" placeholder="请输入公司地址" @latlongt-change="latlongtChange"></AreaInput>
            </Col>
            <Col v-if="!isEdit" :span="24">
            <span>{{formCompany.address}}</span>
            </Col>
          </FormItem>
          </Col>
        </Row>
        <div class="borderBottomLine">
          <span class="iconRightTitle"></span>
          <span class="iconRightTitleP">公司介绍</span>
        </div>
        <FormItem label="公司简介：" prop="contact" class="labelClassSty">
          <Input v-if="isEdit" v-model="formCompany.contact" :maxlength="200" type="textarea" placeholder="请输入公司简介"></Input>
          <span v-else>{{formCompany.contact}}</span>
        </FormItem>
        <FormItem label="公司LOGO：">
          <span class="imageTips">尺寸80*80像素，大小不超过1M</span>
        </FormItem>
        <FormItem>
          <div class="imageLogo">
            <up-load ref="uploadLogo" crop></up-load>
          </div>
        </FormItem>
        <FormItem label="其他照片：">
          <span class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过2MB</span>
        </FormItem>
        <FormItem>
          <up-load ref="upLoads" :multiple="true" max-count="10" multiple-width="style='width:100%'"></up-load>
        </FormItem>
          <!-- 图片集合 -->
        </FormItem>
        <div v-if="isEdit" class="configBtn">
          <Button type="primary" class="buttonSty" @click="companySubmit('formCompany')">保存</Button>
          <Button class="buttonSty" @click="companyCancel">取消</Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import AreaInput from '@/components/AreaInput'
import CitySelect from '@/components/SelectInputForCity'
import UpLoad from '@/components/upLoad/index.vue'
import { CHECK_NAME_COMPANY, CHECK_NAME, CHECK_PHONE } from './validator'
export default {
  name: 'companySetting',
  components: {
    AreaInput,
    CitySelect,
    UpLoad
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '公司设置'
  },
  data () {
    return {
      isEdit: false,
      // 公司
      formCompany: {},
      formCompanyInit: {},
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
    formCityCode () {
      return this.formCompany.cityId
    }
  },
  mounted () {
    this.getCompanyInfo()
  },
  methods: {
    getCompanyInfo () {
      let vm = this
      Server({
        url: 'set/companyInfo',
        method: 'get'
      }).then(({ data }) => {
        vm.formCompany = Object.assign({}, data.data)
        vm.formCompanyInit = Object.assign({}, data.data)
      }).then(() => {
        // LOGO
        vm.$refs.uploadLogo.progress = 1
        vm.$refs.uploadLogo.uploadImg = vm.formCompany.logoUrl
        // 公司其他照片
        let fileUrls = []
        fileUrls.push({
          url: vm.formCompany.logoUrl,
          progress: 1
        })
        vm.$refs.upLoads.uploadImgList = fileUrls
      }).then(() => {
        // 图片样式修改，LOGO必须为正方形
        let imageDiv = document.getElementsByClassName('demo-upload-list')[0]
        if (imageDiv) imageDiv.children[0].style.height = '110px'
      })
    },
    // 公司
    companySubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formCompany.logoUrl = this.$refs.uploadLogo.uploadImg
          if (this.formCompany.address === this.formCompanyInit.address &&
              this.formCompany.contact === this.formCompanyInit.contact &&
              this.formCompany.contactPhone === this.formCompanyInit.contactPhone &&
              this.formCompany.id === this.formCompanyInit.id &&
              this.formCompany.logoUrl === this.formCompanyInit.logoUrl &&
              this.formCompany.name === this.formCompanyInit.name &&
              Number(this.formCompany.cityId) === Number(this.formCompanyInit.cityId)) {
            this.$Message.info('您还未变更任何信息，无需保存')
            return
          }
          let params = Object.assign({}, this.formCompany)
          Server({
            url: 'set/company',
            method: 'post',
            data: params
          }).then(({ data }) => {
            if (data.code === 10000) {
              this.$Message.success('保存成功!')
              this.isEdit = false
            }
          })
        }
      })
    },
    // 点击取消做数据还原操作
    companyCancel () {
      this.formCompany = Object.assign({}, this.formCompanyInit)
      this.$refs.formCompany.resetFields()
      this.isEdit = false
    },
    // 编辑
    editCompanyInfo () {
      this.isEdit = true
    },
    // 分享
    shareBtn () {
      const vm = this
      vm.openDialog({
        name: 'company/dialog/share',
        data: {
          title: '获取链接成功，复制链接分享给朋友吧'
        },
        methods: {
          ok (node) {
          }
        }
      })
    },
    latlongtChange ({ lat, lng }) {
      this.formCompany.latitude = lat
      this.formCompany.longitude = lng
      this.formCompany.mapType = 1
    }
  }
}
</script>
<style lang='stylus' scoped>
>>>.imageLogo .demo-upload-list
>>>.imageLogo .ivu-upload .ivu-upload-drag
  width 100px
  height 100px
.temAll
  margin -20px -15px
  padding 0 40px
.borderBottomLine
  border-bottom: 1px solid #e9e9e9;
  padding-bottom:10px;
  margin-top: 15px;
  margin-right: 20px;
  margin-bottom: 35px;
  .iconRightTitle
    width: 5px;
    height: 20px;
    background: #00a4bd;
    margin-top: 1px;
    border-radius:3px;
    float: left
  .iconRightTitleP
   margin-left:20px
   font-size: 16px
   font-weight:600
.rightConfBtn
  float:right;
  margin-top:-75px;
  margin-right:20px;
.areaRight
  padding-left: 15px
  margin-top:1px
.buttonSty
  margin-left 20px
  width 86px
.configBtn
  text-align: center
  margin-bottom 30px
.imageTips
  color #999999
  font-size 13px
.unitSpan
  margin-left 5px
.ios-alert
  font-size 20px
  color #FFBB44
  margin-top -3px
</style>
