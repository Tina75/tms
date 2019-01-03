<template>
  <div id="set-up-container" class="set-up-container temAll">
    <div id="temAll">
      <!--公司设置-->
      <div v-if="isEdit && contactListShow" class="addContacts" @click="addContacts">
        <br/>
        <FontIcon type="lianxiren" size="30" color="#9DA1B0"></FontIcon>
        <p class="addContacts-p">添加更多联系人</p>
      </div>
      <Form ref="formCompany" :model="formCompany" :rules="ruleCompany" :label-width="125" label-position="right">
        <div class="borderBottomLine">
          <span class="iconRightTitle"></span>
          <span class="iconRightTitleP">基本信息
            <span class="content-p">完善并分享公司名片，有利于提升品牌影响力哦</span>
          </span>
        </div>
        <span class="rightConfBtn">
          <Button v-if="!isEdit" class="buttonSty" @click="shareBtn">分享</Button>
          <Button v-if="!isEdit" type="primary" class="buttonSty" @click="editCompanyInfo">编辑</Button>
        </span>
        <Row>
          <Col :span="20">
          <Row>
            <Col :span="12">
            <FormItem label="公司全称：" prop="name">
              <Input v-if="isEdit" v-model="formCompany.name" :maxlength="25" placeholder="请输入公司名称"></Input>
              <span v-else class="formConten-p">{{formCompany.name}}</span>
            </FormItem>
            </Col>
            <Col :span="12">
            <FormItem label="公司简称：">
              <Row v-if="isEdit">
                <Input v-model="formCompany.shortName" :maxlength="6" placeholder="请输入公司简称，最多6个字"></Input>
              </Row>
              <span v-else class="formConten-p blockContent">{{formCompany.shortName}}</span>
            </FormItem>
            </Col>
          </Row>
          </Col>
          <Col :span="1">
          <Tooltip
            v-if="isEdit"
            class="unitSpan"
            max-width="220"
            transfer
            content="简称将用于短信推广、品牌展示等">
            <Icon type="ios-alert" class="ios-alert"/>
          </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col :span="10">
          <FormItem label="公司联系人：" prop="contact">
            <Input v-if="isEdit" v-model="formCompany.contact" :maxlength="20" placeholder="请输入公司联系人"></Input>
            <span v-else class="formConten-p">{{formCompany.contact}}</span>
          </FormItem>
          </Col>
          <Col :span="10">
          <FormItem label="联系方式：" prop="contactPhone">
            <SelectInput v-if="isEdit" v-model="formCompany.contactPhone" :formatter="formatePhoneNum" :maxlength="phoneLength(formCompany.contactPhone)" placeholder="请输入手机号或座机号"></SelectInput>
            <!-- <Input v-if="isEdit" v-model="formCompany.contactPhone" :maxlength="40" placeholder="请输入手机号或座机号"></Input> -->
            <span v-else class="formConten-p">{{formCompany.contactPhone}}</span>
          </FormItem>
          </Col>
        </Row>
        <Row v-for="(item, index) in (formCompany.busiContact)" :key="index">
          <Col :span="10">
          <FormItem
            v-show="(item.name && !isEdit) || isEdit"
            :label="'业务联系人' + (index + 1) + '：'"
            :rules="[{required: true, message: '请输入业务联系人'},
                     {type: 'string', message: '姓名不能小于2个字且不能多于20个字', pattern: /^.{2,20}$/}]"
            :prop="'busiContact.' + index + '.name'">
            <Input v-if="isEdit" v-model="item.name" :maxlength="20" placeholder="请输入业务联系人"></Input>
            <span v-else class="formConten-p">{{item.name}}</span>
          </FormItem>
          </Col>
          <Col :span="10">
          <FormItem
            v-show="(item.phone && !isEdit) || isEdit"
            :rules="[{required: true, message: '请输入联系方式'},
                     {type: 'string',
                      message: '请输入正确的手机号或座机号',
                      pattern: /(^1\d{10}$)|(^[^1]((\(|（)?\d{2,4}(\)|）)?)?-?((\d+)?(\(|（)\d{1,14}(\)|）)(\d+)?|\d{1,16})$)/g}]"
            :prop="'busiContact.' + index + '.phone'"
            label="联系方式：">
            <SelectInput v-if="isEdit" v-model="item.phone" :formatter="formatePhoneNum" :maxlength="phoneLength(item.phone)" placeholder="请输入手机号或座机号"></SelectInput>
            <!-- <Input v-if="isEdit" v-model="item.phone" :maxlength="40" placeholder="请输入手机号或座机号"></Input> -->
            <span v-else class="formConten-p">{{item.phone}}</span>
          </FormItem>
          </Col>
          <Col :span="1">
          <span v-if="isEdit" @click="removeContact(index)">
            <FontIcon
              v-if="formCompany.busiContact.length > 0 && isEdit"
              type="ico_cancel"
              size="18"
              color="#EC4E4E"
              class="removeContact">
            </FontIcon>
          </span>
          </Col>
        </Row>
        <Row>
          <Col :span="20">
          <FormItem label="公司地址：" prop="address">
            <Row v-if="isEdit">
              <Col :span="15">
              <AreaInput v-model="formCompany.address" @city-select="latlongtChange"></AreaInput>
              </Col>
              <Col :span="8" offset="1">
              <Input :maxlength="50" v-model="formCompany.userAddress" placeholder="补充地址（楼号-门牌等）"></Input>
              </Col>
            </Row>
            <Row v-if="!isEdit">
              <Col :span="20">
              <span class="formConten-p">{{ formCompany.address }} {{ formCompany.userAddress }}</span>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col :span="1">
          <Tooltip v-if="isEdit" :max-width="200" content="详细地址只支持从下拉推荐地址中选择" transfer>
            <Icon type="ios-alert" class="ios-alert vermiddle"/>
          </Tooltip>
          </Col>
        </Row>
        </Col>
        </Row>
        <div class="borderBottomLine">
          <span class="iconRightTitle"></span>
          <span class="iconRightTitleP">公司介绍</span>
        </div>
        <Row>
          <Col :span="20">
          <FormItem label="公司简介：" style="margin-bottom:10px">
            <TextAreaNumber
              v-if="isEdit"
              :rows="5"
              v-model="formCompany.companyProfile"
              :maxlength="500"
              class="textArea"
              placeholder="请输入公司简介">
            </TextAreaNumber>
            <span v-if="!isEdit && !formCompany.companyProfile" class="imageTips">完善公司简介，有利于客户了解贵公司业务组成</span>
            <pre v-if="!isEdit" class="companyProfileSty">{{formCompany.companyProfile}}</pre>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="20">
          <FormItem label="公司LOGO：">
            <span v-if="isEdit" class="imageTips">尺寸100*100像素，大小不超过10M</span>
            <span v-if="!isEdit && !formCompany.logoUrl" class="imageTips">上传公司LOGO照片，有利于宣传公司品牌哦</span>
          </FormItem>
          <FormItem :class="isEdit ? 'imageFontItem' : 'imageFontItemBlock'">
            <span class="imageLogo">
              <up-load v-show="isEdit" ref="uploadLogo" max-size="10" crop></up-load>
              <div
                :style="(formCompany.logoUrl && !isEdit) ? 'height: 90px;width: 96px;background-image: url(' + formCompany.logoUrl + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position:center;cursor:pointer;' : ''"
                class="imageLogoDiv"
                @click="handleView(0, 'logo')">
              </div>
            </span>
          </FormItem>
          </Col>
        </Row>
        <!-- 公司介绍图片集合 -->
        <Row>
          <Col :span="20">
          <FormItem label="业务介绍：">
            <TextAreaNumber v-if="isEdit" :rows="5" v-model="formCompany.busiIntroduce" :maxlength="500" type="textarea" placeholder="请输入业务介绍" class="textArea"></TextAreaNumber>
            <span v-if="!isEdit && !formCompany.busiIntroduce && !busiIntroducePic.length" class="imageTips">完善业务介绍，有利于客户了解贵公司业务组成</span>
            <pre v-if="!isEdit && formCompany.busiIntroduce" class="companyProfileSty">{{formCompany.busiIntroduce}}</pre><br/>
            <span v-if="isEdit" class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过10MB</span>
          </FormItem>
          <FormItem :class="isEdit ? 'imageFontItem' : 'imageFontItemBlock'">
            <image-title
              v-show="isEdit"
              ref="upLoadsBusiness"
              :multiple="true"
              max-count="10"
              max-size="10"
              multiple-width="style='width:100%'">
            </image-title>
            <div v-for="(img,index) in busiIntroducePic" v-show="!isEdit" :key="img.key" class="infoImage">
              <div
                :style="'height: 90px;background-image: url(' + img.url + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
                class="fileImage"
                @click="handleView(index, 'InfoIntro')">
              </div>
              <p v-show="!isEdit" class="titleInput">{{ img.title }}</p>
            </div>
          </FormItem>
          </Col>
        </Row>
        <!-- 服务优势图片集合 -->
        <Row>
          <Col :span="20">
          <FormItem label="服务优势：">
            <TextAreaNumber v-if="isEdit" :rows="5" v-model="formCompany.busiAdvantce" :maxlength="500" type="textarea" placeholder="请输入服务优势" class="textArea"></TextAreaNumber>
            <span v-if="!isEdit && !busiAdvantcePic.length && !formCompany.busiAdvantce" class="imageTips">完善服务优势，有利于提升客户对贵公司的好感度</span>
            <pre v-if="!isEdit && formCompany.busiAdvantce" class="companyProfileSty">{{formCompany.busiAdvantce}}</pre><br/>
            <span v-if="isEdit" class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过10MB</span>
          </FormItem>
          <FormItem :class="isEdit ? 'imageFontItem' : 'imageFontItemBlock'">
            <image-title
              v-show="isEdit"
              ref="upLoadsService"
              :multiple="true"
              max-count="10"
              max-size="10"
              multiple-width="style='width:100%'">
            </image-title>
            <div v-for="(img,index) in busiAdvantcePic" v-show="!isEdit" :key="img.key" class="infoImage">
              <div
                :style="'height: 90px;background-image: url(' + img.url + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
                class="fileImage"
                @click="handleView(index, 'Advantce')">
              </div>
              <p v-show="!isEdit" class="titleInput">{{ img.title }}</p>
            </div>
          </FormItem>
          </Col>
        </Row>
        <!-- 公司风貌图片集合 -->
        <Row>
          <Col :span="20">
          <FormItem label="公司风貌：">
            <span v-if="isEdit" class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过10MB</span>
            <span v-if="!isEdit && !companyPhoto.length" class="imageTips">上传公司风貌照片，有利于传递给客户专业的印象</span>
          </FormItem>
          <FormItem :class="isEdit ? 'imageFontItem' : 'imageFontItemBlock'">
            <image-title
              v-show="isEdit"
              ref="upLoadsStyle"
              :multiple="true"
              max-count="10"
              max-size="10"
              multiple-width="style='width:100%'">
            </image-title>
            <div v-for="(img,index) in companyPhoto" v-show="!isEdit" :key="img.key" class="infoImage">
              <div
                :style="'height: 90px;background-image: url(' + img.url + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
                class="fileImage"
                @click="handleView(index, 'company')">
              </div>
              <p v-show="!isEdit" class="titleInput">{{ img.title }}</p>
            </div>
          </FormItem>
          </Col>
        </Row>
        <!-- 微信二维码图片集合 -->
        <div>
          <Row>
            <Col :span="20">
            <FormItem label="微信二维码：">
              <span v-if="isEdit" class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传2张，每张不能超过10MB</span>
              <span v-if="!isEdit && !wxQrPic.length" class="imageTips">上传微信二维码，有利于后续微信营销</span>
            </FormItem>
            <FormItem :class="isEdit ? 'imageFontItem' : 'imageFontItemBlock'">
              <image-title
                v-show="isEdit"
                ref="upLoadsWX"
                :multiple="true"
                :maxlength="6"
                max-count="2"
                max-size="10"
                class="wxImaages"
                multiple-width="style='width:50%'">
              </image-title>
              <div v-for="(img,index) in wxQrPic" v-show="!isEdit" :key="img.key" class="infoImage">
                <div
                  :style="'height: 90px;width: 96px;background-image: url(' + img.url + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
                  class="fileImage"
                  @click="handleView(index, 'wx')">
                </div><br/>
                <p v-show="!isEdit" class="titleInput wxTitle">{{ img.title }}</p>
              </div>
            </FormItem>
            </Col>
          </Row>
        </div>
        <!-- 公司首页形象 -->
        <Row>
          <Col :span="20">
          <FormItem label="公司首页形象图：">
            <span v-if="isEdit" class="imageTips">照片格式必须为jpeg、jpg、gif、png，且只支持上传1张，每张不能超过10MB</span>
            <span v-if="!isEdit && !formCompany.homeBanner" class="imageTips">上传公司形象图，有利于宣传公司品牌</span>
          </FormItem>
          <FormItem :class="isEdit ? 'imageFontItem' : 'imageFontItemBlock'">
            <up-load v-show="isEdit" ref="upLoadsBanner" :multiple="true" max-count="1" max-size="10"></up-load>
            <div v-if="formCompany.homeBanner && !isEdit" class="infoImage">
              <div
                :style="'height: 90px;background-image: url(' + formCompany.homeBanner + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
                class="fileImage"
                @click="handleView(0, 'banner')">
              </div>
            </div>
          </FormItem>
          </Col>
        </Row>
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
import FontIcon from '@/components/FontIcon'
import TextAreaNumber from '@/components/TextAreaNumber'
import { formatePhone } from '@/libs/js/formate'
import SelectInput from '@/components/SelectInput.vue'
export default {
  name: 'company-setting',
  components: {
    AreaInput,
    CitySelect,
    UpLoad,
    prepareOpenSwipe,
    ImageTitle,
    FontIcon,
    TextAreaNumber,
    SelectInput
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '公司设置',
    meta: [{ // set meta
      name: 'keyWords1',
      content: 'My Example App1'
    }]
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
          { validator: CHECK_PHONE }
        ],
        cityId: [
          { required: true, message: '请选择所在省市' }
        ],
        address: [
          { required: true, message: '请输入公司地址' }
        ]
      },
      infoImageList: [],
      busiIntroducePic: [],
      busiAdvantcePic: [],
      companyPhoto: [],
      wxQrPic: [],
      homeBanner: [],
      contactListShow: true
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
    formatePhoneNum (temp) {
      return formatePhone(temp)
    },
    phoneLength (value) {
      return /^1/.test(value) ? 13 : this.$fieldLength.telephone
    },
    // 图片初始化
    async initImage () {
      // LOGO
      this.$refs.uploadLogo.progress = 1
      this.$refs.uploadLogo.uploadImg = this.formCompany.logoUrl
      // 公司banner 当前需求只有一张
      if (this.formCompany.homeBanner) this.$refs.upLoadsBanner.uploadImgList = [{ url: this.formCompany.homeBanner, progress: 1 }]
      // 公司其他照片
      if (this.formCompany.busiIntroducePic) this.busiIntroducePic = await this.editStatusImage(this.formCompany.busiIntroducePic, 'upLoadsBusiness') // 业务
      if (this.formCompany.busiAdvantcePic) this.busiAdvantcePic = await this.editStatusImage(this.formCompany.busiAdvantcePic, 'upLoadsService') // 服务
      if (this.formCompany.companyPhoto) this.companyPhoto = await this.editStatusImage(this.formCompany.companyPhoto, 'upLoadsStyle') // 风貌
      if (this.formCompany.wxQrPic) this.wxQrPic = await this.editStatusImage(this.formCompany.wxQrPic, 'upLoadsWX') // 微信
      setTimeout(() => {
        if (this.formCompany.logoUrl) this.openSwipeLogo = prepareOpenSwipe(this.imageLogo)
        if (this.formCompany.busiIntroducePic) this.openSwipeInfoIntroduce = prepareOpenSwipe(this.busiIntroducePic)
        if (this.formCompany.busiAdvantcePic) this.openSwipeInfoAdvantce = prepareOpenSwipe(this.busiAdvantcePic)
        if (this.formCompany.companyPhoto) this.openSwipeInfoCompany = prepareOpenSwipe(this.companyPhoto)
        if (this.formCompany.wxQrPic) this.openSwipeInfoWX = prepareOpenSwipe(this.wxQrPic)
        if (this.formCompany.homeBanner) this.openSwipeInfoBanner = prepareOpenSwipe([{ title: 'banner', src: this.formCompany.homeBanner }])
      }, 10)
    },
    editStatusImage (images, upLoads) {
      // 编辑状态
      if (images) {
        let imageListInit = JSON.parse(images)
        this.$refs[upLoads].uploadImgList = imageListInit
        // 预览状态
        let imageList = []
        for (let index = 0; index < imageListInit.length; index++) {
          const element = imageListInit[index]
          element.src = element.url
          imageList.push(element)
        }
        return imageList
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
        vm.formCompany.busiContact = []
        if (data.data.busiContact) { // 后加入字段（兼容老用户）
          vm.formCompany.busiContact = JSON.parse(data.data.busiContact)
        }
      }).then(() => {
        try {
          vm.initImage()
        } catch (error) {
        }
      })
    },
    initImageUrl () {
      this.formCompany.logoUrl = this.$refs.uploadLogo.uploadImg // logo
      this.formCompany.busiContact = JSON.stringify(this.formCompany.busiContact) // 格式转换
      this.formCompany.busiIntroducePic = JSON.stringify(this.$refs.upLoadsBusiness.getImageList()) // 业务介绍
      this.formCompany.busiAdvantcePic = JSON.stringify(this.$refs.upLoadsService.getImageList()) // 服务优势
      this.formCompany.companyPhoto = JSON.stringify(this.$refs.upLoadsStyle.getImageList()) // 公司风貌
      this.formCompany.wxQrPic = JSON.stringify(this.$refs.upLoadsWX.getImageList()) // 微信二维码
      // 公司首页形象图
      if (this.$refs.upLoadsBanner.uploadImgList[0]) this.formCompany.homeBanner = this.$refs.upLoadsBanner.uploadImgList[0].url
      else this.formCompany.homeBanner = ''
    },
    // 公司
    companySubmit (name) {
      let isChanged = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          try {
            if (!this.formCompany.cityId) {
              this.$Message.error('详细地址只支持从下拉推荐地址中选择')
              return false
            }
            this.initImageUrl()
            for (const key in this.formCompanyInit) {
              if (this.formCompany[key] !== this.formCompanyInit[key]) {
                isChanged = false
              }
            }
            if (isChanged) {
              this.$Message.info('您还未变更任何信息，无需保存')
              this.formCompany.busiContact = JSON.parse(this.formCompany.busiContact) // 格式转换
              return
            }
            this.loading = true
            let params = Object.assign({}, this.formCompany)
            this.formCompany.busiContact = JSON.parse(this.formCompany.busiContact) // 格式转换
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
          } finally {
            this.formCompany.busiContact = JSON.parse(this.formCompany.busiContact) // 格式转换
          }
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
            imagLogoSrc: vm.formCompany.logoUrl,
            shareTitle: vm.formCompany.shortName || vm.formCompany.name,
            shareSummary: '提供专业可靠物流运输服务，期待携手合作！'
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
      if (type === 'logo') {
        this.openSwipeLogo(index)
      } else if (type === 'InfoIntro') {
        this.openSwipeInfoIntroduce(index)
      } else if (type === 'Advantce') {
        this.openSwipeInfoAdvantce(index)
      } else if (type === 'company') {
        this.openSwipeInfoCompany(index)
      } else if (type === 'wx') {
        this.openSwipeInfoWX(index)
      } else if (type === 'banner') {
        this.openSwipeInfoBanner(index)
      }
    },
    // 省市区位置获取
    latlongtChange ({ lat, lng, cityCode }) {
      this.formCompany.latitude = lat
      this.formCompany.longitude = lng
      this.formCompany.mapType = 1
      this.formCompany.cityId = cityCode
    },
    addContacts () {
      this.contactListShow = true
      this.formCompany.busiContact.push({
        name: '',
        phone: ''
      })
      if (this.formCompany.busiContact.length >= 3) {
        this.contactListShow = false
      } else {
        this.contactListShow = true
      }
    },
    removeContact (item) {
      this.formCompany.busiContact.splice(item, 1)
      this.contactListShow = true
    }
  }
}
</script>
<style lang='stylus' scoped>
>>>.imageLogo .demo-upload-list
>>>.imageLogo .ivu-upload .ivu-upload-drag
>>>.imageLogo .ivu-upload .ivu-upload-input
>>>.wxImaages .demo-upload-list
>>>.wxImaages .ivu-upload .ivu-upload-drag
>>>.wxImaages .ivu-upload-input
  width 96px
  height 90px
>>>.wxImaages input.ivu-input.ivu-input-default
>>>.wxImaages .ivu-input-wrapper .ivu-input-wrapper-default .ivu-input-type
  width 98px
>>>.ivu-form-item-label
  font-size: 14px
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
  margin-top:1px
.buttonSty
  margin-left 20px
  width 86px
.configBtn
  text-align: center
  margin-bottom 30px
.imageTips
  color #999999
  font-size 14px
  position relative
  top 1px
.unitSpan
  margin-left 5px
.ios-alert
  font-size 20px
  color #FFBB44
  margin-top 6px
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
.wxTitle
  width 96px
  display block
  line-height 36px
  clear both
.companyProfileSty
  font-family PingFangSC-Regular
  margin-top 7px
  line-height 22px
  white-space pre-wrap
  word-wrap break-word
  font-size: 14px
.imageFontItem
  margin-top -18px
.imageFontItemBlock
  margin-top -45px
.formConten-p
  font-size 14px
  position: absolute;
  top: 2px;
  // left: -16px;
.content-p
  position relative
  top -2px
  color #333333
  font-size 12px
  font-weight 400
  background-color #e6f7ff
  padding 10px 7px 8px 7px
  margin-left 20px
.addContacts
  width 100px
  height 100px
  background-color #F9F9F9
  float: right;
  position: relative;
  left: -2%;
  top: 70px;
  cursor: pointer;
  text-align: center;
  z-index: 100;
  .addContacts-p
    color #00A4BD
    text-align center
    line-height 28px
.removeContact
  cursor: pointer;
  padding-left 5px
  margin-top: 6px
.vermiddle
  padding-left 5px
.textArea
  margin-top 10px
  margin-bottom -20px
</style>
