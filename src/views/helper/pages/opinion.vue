<template>
  <div>
    <Form ref="opinionForm" :model="opinionForm" :rules="ruleOpinion" :label-width="125" label-position="right">
      <FormItem label="建议类型：" prop="type">
        <RadioGroup v-model="opinionForm.type">
          <span v-for="item in opinionTypeList" :key="item.id" class="radioSty">
            <Radio :label="item.id"><span>{{item.label}}</span></Radio>
          </span>
        </RadioGroup>
      </FormItem>
      <FormItem label="建议内容：" prop="content">
        <TextAreaNumber
          v-model="opinionForm.content"
          :rows="5"
          :maxlength="500"
          class="textArea"
          placeholder="请输入您的宝贵意见">
        </TextAreaNumber>
      </FormItem>
      <FormItem label="上传图片：" class="imageForm">
        <span class="imageTips">照片格式必须为jpeg、jpg、gif、png，且最多上传10张，每张不能超过10MB</span>
        <up-load ref="upLoadsOpinion" multiple max-count="10" max-size="10"></up-load>
      </FormItem>
      <div class="configBtn">
        <Button :loading="loading" type="primary" class="buttonSty" @click="opinionSubmit('opinionForm')">提交</Button>
      </div>
    </Form>
  </div>
</template>

<script>
/**
 * 意见建议
 */
import BasePage from '@/basic/BasePage'
import TextAreaNumber from '@/components/TextAreaNumber'
import UpLoad from '@/components/upLoad/index.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    TextAreaNumber,
    UpLoad
  },
  mixins: [BasePage],
  metaInfo: { title: '意见建议' },
  data () {
    return {
      loading: false,
      opinionTypeList: [
        { id: '1', label: '功能异常' },
        { id: '2', label: '体验建议' },
        { id: '3', label: '新功能建议' },
        { id: '4', label: '其他' }
      ],
      opinionForm: {
        type: '1',
        source: '3',
        pictureUrl: []
      },
      ruleOpinion: {
        type: [
          { required: true, message: '请选择建议类型' }
        ],
        content: [
          { required: true, message: '请填写建议内容' }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['saveOpinion']),
    opinionSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$refs.upLoadsOpinion.uploadImgList.forEach(element => {
            this.opinionForm.pictureUrl.push(element.url)
          })
          let params = this.opinionForm
          this.saveOpinion(params).then(({ data }) => {
            this.$Message.success('提交成功，感谢您的宝贵意见!')
            this.opinionForm = {
              type: '1',
              source: '3',
              pictureUrl: []
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
>>>.ivu-form-item-label
  font-size: 14px
  color: #000
>>>textarea.ivu-input
  min-height 160px!important

.radioSty
  margin-right 40px
  color: #333333
.textArea
  margin-top: 1px
.imageTips
  color #999999
  font-size 14px
  position relative
  top 1px
.imageForm.ivu-form-item
  margin-top: -25px;
.configBtn
  text-align: center
  margin-top 40px
  .buttonSty
    width 86px
</style>
