<template>
  <Modal v-model="visiable" :mask-closable="true" width="440" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">新增规则</p>
    <div class="create-rule-form">
      <Form ref="createRuleForm" :model="createRuleForm" :rules="validate" :label-width="100">
        <FormItem label="规则名称：" prop="ruleName">
          <Input v-model="createRuleForm.ruleName" maxlength="30" placeholder="请输入" />
        </FormItem>
        <FormItem :label="sceneMap[scene] + '：'" prop="partnerName">
          <Select v-model="createRuleForm.partnerName">
            <Option v-for="(item, index) in partnerList" :key="index" :value="item">{{item}}</Option>
          </Select>
        </FormItem>
      </Form>
    </div>
    <div slot="footer" style="text-align:center">
      <Button type="primary" @click="save">确定</Button>
      <Button type="default" @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
export default {
  name: 'createRule',
  mixins: [BaseDialog],
  data () {
    const partnerNameValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`请选择${this.sceneMap[this.scene]}`))
      } else {
        callback()
      }
    }
    return {
      sceneMap: {
        1: '发货方',
        2: '承运商',
        3: '外转方'
      },
      createRuleForm: {
        ruleName: '',
        partnerName: ''
      },
      validate: {
        ruleName: [
          { required: true, message: '请填写规则名称', trigger: 'blur' },
          { type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' }
        ],
        partnerName: { required: true, validator: partnerNameValidate, trigger: 'change' }
      },
      partnerList: []
    }
  },
  mounted () {
    this.getPartnerList()
  },
  methods: {
    getPartnerList () {
      Server({
        url: '/finance/charge/getPartners',
        method: 'get',
        params: {
          partnerType: this.scene
        }
      }).then(res => {
        this.partnerList = res.data.data
      }).catch(err => console.error(err))
    },
    save () {
      this.$refs['createRuleForm'].validate((valid) => {
        if (valid) {
          Server({
            url: '/finance/charge/addRule',
            method: 'post',
            data: {
              partnerName: this.createRuleForm.partnerName,
              partnerType: this.scene,
              ruleName: this.createRuleForm.ruleName
            }
          }).then(res => {
            this.close()
            this.ok()
          }).catch(err => console.error(err))
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog-title
  font-size 14px
.dialog-content
  font-size:12px;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:17px;
  background:rgba(249,249,249,1);
  border-radius:8px;
  margin-top 15px
  padding 10px
  li
    margin-left 15px
    line-height 2
.dialog-footer
  text-align center
  margin-top 30px
  color rgba(153,153,153,1);
  a
    font-size 20px
    font-weight 500
    .icon-ico-call
      font-size 22px
</style>
