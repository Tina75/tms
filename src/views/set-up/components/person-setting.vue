<template>
  <div class="person-setting">
    <div class="person-setting-form">
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
    </div>
  </div>
</template>

<script>
/**
 * 设置=》个人设置
 */
import { CHECK_NAME } from '../util/validator.js'
import Server from '@/libs/js/server'
import UpLoad from '@/components/upLoad/index.vue'
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
import BaseComponent from '@/basic/BaseComponent'
export default {
  name: 'person-setting',
  components: {
    UpLoad
  },
  mixins: [BaseComponent],
  data () {
    return {
      // 个人
      formPersonal: {
        name: '',
        phone: '',
        roleName: '',
        avatarPic: ''
      },
      // 个人
      rulePersonal: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: CHECK_NAME, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['UserInfo'])
  },
  mounted () {
    this.initPerson()
  },
  methods: {
    ...mapMutations(['initUserInfo']),
    initPerson () {
      this.formPersonal = _.cloneDeep(this.UserInfo)
      this.$nextTick(() => {
        if (this.formPersonal.avatarPic) {
          this.$refs.upLoadsPerson.progress = 1
          this.$refs.upLoadsPerson.uploadImg = this.formPersonal.avatarPic
        }
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.person-setting
  .person-setting-form
    width 450px
    margin 0 auto
  .personPic
    margin-top: -20px
    margin-bottom: -10px
  .inputClassSty
    width 300px
  .updatePhone
    color: #00A4BD
    margin-left 25px
    cursor pointer
  .imageTips
    color #999999
    font-size 14px
    position: relative;
    top: 1px;
</style>
