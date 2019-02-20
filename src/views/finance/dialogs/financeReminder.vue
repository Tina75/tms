<template>
  <Modal v-model="visiable" :mask-closable="true" transfer width="440" class="finance-reminder"  @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">账期提醒设置</p>
    <Form ref="$reminderForm" :model="reminderForm" :rules="ruleInline" inline>
      <div>
        <FormItem label="每月" prop="periodDay">
          <TagNumberInput :min="1" :show-chinese="false" v-model="reminderForm.periodDay" placeholder="1-28" class="input-number"></TagNumberInput>
        </FormItem>

        <FormItem label="号，提前" prop="moveDay">
          <TagNumberInput :min="0" :show-chinese="false" v-model="reminderForm.moveDay" placeholder="最大值为10" class="input-number"></TagNumberInput>
        </FormItem>
        <FormItem class="i-mr-0">
          <label class="form-item-label">个自然日消息提醒</label>
        </FormItem>
      </div>
      <div class="i-warning">
        <span class="i-status-warning">
          注：
        </span>
        消息提醒在设置的天数中，每天都将在早上10点提醒一次
      </div>
    </Form>
    <div slot="footer" style="text-align:center">
      <Button :loading="loading" type="primary" @click="onOk">确定</Button>
      <Button @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
/**
 * 账期提醒设置
 */
import BaseDialog from '@/basic/BaseDialog'
import TagNumberInput from '@/components/TagNumberInput'
import Server from '@/libs/js/server'
export default {
  name: 'financeReminder',
  components: {
    TagNumberInput
  },
  mixins: [BaseDialog],
  data () {
    // 1-28
    const dateValidate = (rule, value, callback) => {
      if (value && value > 28) {
        callback(new Error('账期日不能超过28号'))
      } else if (!value) {
        callback(new Error('请输入账期日'))
      } else {
        callback()
      }
    }
    // 0-10
    const aheadValidate = (rule, value, callback) => {
      if (value && value > 10) {
        callback(new Error('天数不能超过10天，请重新设置'))
      } else if (!value && value !== 0) {
        callback(new Error('请输入提醒天数'))
      } else {
        callback()
      }
    }
    return {
      reminderForm: {
        periodDay: null,
        moveDay: null
      },
      loading: false,
      partnerName: '',
      partnerType: 1, // 1-发货方 2-承运商
      ruleInline: {
        periodDay: [
          {
            validator: dateValidate
          }
        ],
        moveDay: [
          {
            validator: aheadValidate
          }
        ]
      }
    }
  },
  created () {
    const vm = this
    // 查询发货方/承运商的账期配置
    Server({
      url: 'period/query',
      method: 'POST',
      data: {
        partnerName: this.partnerName,
        partnerType: this.partnerType
      }
    }).then((resp) => {
      const { data } = resp.data
      if (data !== '') {
        vm.reminderForm = {
          periodDay: data.periodDay,
          moveDay: data.moveDay,
          id: data.id
        }
      }
    })
  },
  methods: {
    /**
     * 校验并保存
     */
    onOk () {
      const vm = this
      this.$refs.$reminderForm.validate((valid) => {
        if (valid) {
          vm.save(vm.close)
        }
      })
    },
    /**
     * 保存配置
     * 1. 第一次保存配置，id为空，后端会根据id是否空来判断是新增或修改
     */
    async save (callback) {
      const vm = this
      try {
        vm.loading = true

        await Server({
          url: 'period/update',
          method: 'post',
          data: {
            partnerName: vm.partnerName,
            partnerType: vm.partnerType,
            ...vm.reminderForm
          }
        })
        vm.loading = false
        vm.$Message.success('保存成功')
        callback.call(vm)
      } catch (error) {
        vm.loading = false
        throw error
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.finance-reminder
  .form-item-label
    text-align right
    vertical-align middle
    float left
    font-size 12px
    color #333333
    line-height 1
    padding 10px 0px
    box-sizing border-box
  .input-number
    width 80px
    text-align center
    >>> input
          text-align center
  .i-warning
    color #757C7E
    margin-left 16px
  >>> .ivu-form-item-label
        color #333333
  >>> .ivu-form-item-content
        display inline-block
        .ivu-form-item-error-tip
          white-space nowrap
  >>> .ivu-modal-body
        padding-right 20px
</style>
