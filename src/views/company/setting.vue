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
          <Button v-if="!isEdit" class="buttonSty" @click="shareBtn">分享</Button>
          <Button v-if="!isEdit" type="primary" class="buttonSty" @click="editCompanyInfo">编辑</Button>
        </span>
        <Row>
          <Col :span="8">
          <FormItem label="公司全称：" prop="name">
            <Input v-if="isEdit" v-model="formCompany.name" :maxlength="25" placeholder="请输入公司名称"></Input>
            <span v-else>{{formCompany.name}}</span>
          </FormItem>
          </Col>
          <Col :span="8">
          <FormItem label="公司简称：">
            <Row v-if="isEdit">
              <Col :span="18">
              <Input v-model="formCompany.shortName" :maxlength="6" placeholder="请输入公司简称，最多6个字"></Input>
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
            <span v-else>{{formCompany.shortName}}</span>
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
            <Row v-if="isEdit">
              <Col :span="16">
              <AreaInput v-model="formCompany.address" @city-select="latlongtChange"></AreaInput>
              </Col>
              <Col :span="7" class="areaRight">
              <Input :maxLength="50" v-model="formCompany.userAddress" placeholder="补充地址（楼号-门牌等）"></Input>
              </Col>
              <Col :span="1" class="areaRight">
              <Tooltip :max-width="200" content="详细地址只支持从下拉推荐地址中选择" transfer>
                <Icon class="vermiddle" type="ios-information-circle" size="16" color="#FFBB44"></Icon>
              </Tooltip>
              </Col>
            </Row>
            <Row v-if="!isEdit">
              <Col :span="24">
              <span>{{ formCompany.address }} {{ formCompany.userAddress }}</span>
            </Col>
            </Row>
          </FormItem>
          </Col>
        </Row>
        <div class="borderBottomLine">
          <span class="iconRightTitle"></span>
          <span class="iconRightTitleP">公司介绍</span>
        </div>
        <FormItem label="公司简介：" class="labelClassSty">
          <Input v-if="isEdit" :rows="5" v-model="formCompany.companyProfile" :maxlength="500" type="textarea" placeholder="请输入公司简介"></Input>
          <pre v-else class="companyProfileSty">{{formCompany.companyProfile}}</pre>
        </FormItem>
        <FormItem label="公司LOGO：">
          <span v-if="isEdit" class="imageTips">尺寸100*100像素，大小不超过10M</span>
          <span v-if="!isEdit && !formCompany.logoUrl" class="imageTips">上传公司LOGO照片，有利于宣传公司品牌哦</span>
        </FormItem>
        <FormItem class="imageFontItem">
          <span class="imageLogo">
            <up-load v-show="isEdit" ref="uploadLogo" max-size="10" crop></up-load>
            <div
              :style="(formCompany.logoUrl && !isEdit) ? 'height: 90px;width: 96px;background-image: url(' + formCompany.logoUrl + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position:center;cursor:pointer;' : ''"
              class="imageLogoDiv"
              @click="handleView(0, 'logo')">
            </div>
          </span>
        </FormItem>
        <FormItem label="公司照片：">
          <span v-if="isEdit" class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过10MB</span>
          <span v-if="!isEdit && infoImageList.length < 1" class="imageTips">82%的企业上传了公司照片，提高了客户的信任感</span>
        </FormItem>
        <FormItem class="imageFontItem">
          <image-title
            v-show="isEdit"
            ref="upLoads"
            :multiple="true"
            max-count="10"
            max-size="10"
            multiple-width="style='width:100%'">
          </image-title>
          <div v-for="(img,index) in infoImageList" v-show="!isEdit" :key="img.key" class="infoImage">
            <div
              :style="'height: 90px;background-image: url(' + img.url + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
              class="fileImage"
              @click="handleView(index)">
            </div>
            <p v-show="!isEdit" class="titleInput">{{ img.title }}</p>
          </div>
        </FormItem>
          <!-- 图片集合 -->
        </FormItem>
        <div v-if="isEdit" class="configBtn">
          <Button :loading="loading" type="primary" class="buttonSty" @click="companySubmit('formCompany')">保存</Button>
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
import ImageTitle from '@/components/upLoad/ImageTitle.vue'
import { CHECK_NAME_COMPANY, CHECK_NAME, CHECK_PHONE } from './validator'
import prepareOpenSwipe from '@/components/swipe/index'
export default {
  name: 'companySetting',
  components: {
    AreaInput,
    CitySelect,
    UpLoad,
    prepareOpenSwipe,
    ImageTitle
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '公司设置'
  },
  data () {
    return {
      loading: false,
      isEdit: false,
      fileUrls: [],
      shareOutNo: '',
      // 公司
      formCompany: {},
      formCompanyInit: {},
      // 公司
      ruleCompany: {
        name: [
          { required: true, message: '请输入公司名称' },
          { validator: CHECK_NAME_COMPANY }
        ],
        contact: [
          { required: true, message: '请输入公司联系人' },
          { validator: CHECK_NAME }
        ],
        contactPhone: [
          { required: true, message: '请输入联系方式' },
          { validator: CHECK_PHONE, trigger: 'blur' }
        ],
        cityId: [
          { required: true, message: '请选择所在省市' }
        ],
        address: [
          { required: true, message: '请输入公司地址' }
        ]
      },
      infoImageList: []
    }
  },
  computed: {
    formCityCode () {
      return this.formCompany.cityId
    },
    imageLogo () {
      return [
        {
          title: 'LOGO',
          src: this.formCompany.logoUrl,
          msrc: this.formCompany.logoUrl
        }
      ]
    }
  },
  mounted () {
    this.getCompanyInfo()
  },
  methods: {
    // 图片初始化
    initImage () {
      // LOGO
      this.$refs.uploadLogo.progress = 1
      this.$refs.uploadLogo.uploadImg = this.formCompany.logoUrl
      // 公司其他照片
      // 编辑状态
      if (this.formCompany.otherInfo) {
        let infoImageListInit = JSON.parse(this.formCompany.otherInfo)
        this.$refs.upLoads.uploadImgList = infoImageListInit
        // 预览状态
        this.infoImageList = []
        for (let index = 0; index < infoImageListInit.length; index++) {
          const element = infoImageListInit[index]
          element.src = element.url
          this.infoImageList.push(element)
        }
        setTimeout(() => {
          if (this.formCompany.logoUrl) this.openSwipeLogo = prepareOpenSwipe(this.imageLogo)
          if (this.infoImageList.length > 0) this.openSwipeInfo = prepareOpenSwipe(this.infoImageList)
        }, 10)
      }
    },
    // 获取公司信息
    getCompanyInfo () {
      let vm = this
      Server({
        url: 'set/companyInfo',
        method: 'get'
      }).then(({ data }) => {
        vm.formCompany = Object.assign({}, data.data)
        vm.formCompanyInit = Object.assign({}, data.data)
      }).then(() => {
        vm.initImage()
      })
    },
    // 公司
    companySubmit (name) {
      let isChanged = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formCompany.logoUrl = this.$refs.uploadLogo.uploadImg
          this.formCompany.otherInfo = JSON.stringify(this.$refs.upLoads.getImageList())
          for (const key in this.formCompanyInit) {
            if (this.formCompany[key] !== this.formCompanyInit[key]) {
              isChanged = false
            }
          }
          if (isChanged) {
            this.$Message.info('您还未变更任何信息，无需保存')
            return
          }
          this.loading = true
          let params = Object.assign({}, this.formCompany)
          Server({
            url: 'set/company',
            method: 'post',
            data: params
          }).then(({ data }) => {
            this.loading = false
            this.$Message.success('保存成功!')
            this.isEdit = false
            this.getCompanyInfo()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 点击取消做数据还原操作
    companyCancel () {
      this.getCompanyInfo()
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
      Server({
        url: '/set/sharecompany',
        method: 'post'
      }).then(({ data }) => {
        if (data.code === 10000) {
          vm.shareOutNo = data.data.shareOutNo
        }
      }).then(() => {
        vm.openDialog({
          name: 'company/dialog/share',
          data: {
            title: '获取链接成功，复制链接分享给朋友吧',
            shareOutNo: vm.shareOutNo,
            imagLogoSrc: vm.formCompany.logoUrl
          },
          methods: {
            ok (node) {
            }
          }
        })
      })
    },
    // 查看大图LOGO
    handleView (index, type) {
      if (type) {
        this.openSwipeLogo(index)
      } else {
        this.openSwipeInfo(index)
      }
    },
    // 省市区位置获取
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
>>>.imageLogo .ivu-upload .ivu-upload-input
  width 96px
  height 90px
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
.fileImage
  width 160px
  height 90px
  float left
  margin-right 15px
  cursor pointer
.infoImage
  float left
  text-align center
.titleInput
  width 160px
  display block
  line-height 36px
.companyProfileSty
  font-family PingFangSC-Regular
  margin-top 5px
  line-height 22px
  white-space pre-wrap
  word-wrap break-word
.imageFontItem
  margin-top -25px
</style>
