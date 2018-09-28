<template>
  <Modal v-model="visibale" :mask-closable="true" width="440" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">核销</p>
    <div class="create-rule-form">
      <Form ref="createRuleForm" :model="createRuleForm" :rules="validate" :label-width="100">
        <FormItem label="规则名称：" prop="ruleName">
          <Input v-model="createRuleForm.ruleName" placeholder="请输入" />
        </FormItem>
        <FormItem label="发货方：" prop="partnerName">
          <Select v-model="createRuleForm.partnerName">
            <Option value="1">重量</Option>
            <Option value="2">体积</Option>
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
export default {
  name: 'createRule',
  mixins: [BaseDialog],
  data () {
    return {
      createRuleForm: {
        ruleName: '',
        partnerName: ''
      },
      validate: {
        ruleName: { required: true, message: '请填写规则名称', trigger: 'blur' },
        partnerName: { required: true, message: '请选择发货方', trigger: 'change' }
      },
      visibale: true
    }
  },
  methods: {
    save () {
      this.$refs['createRuleForm'].validate((valid) => {
        if (valid) {
          this.ok()
          this.visibale = false
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
