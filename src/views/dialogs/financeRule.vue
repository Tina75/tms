<template>
  <Modal v-model="visiable" :z-index="zIndex" :mask-closable="false" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">计费规则</p>
    <Form v-if="!ruleEmpty" ref="$form" :model="ruleForm" :rules="rules" :label-width="80">
      <FormItem label="计费规则：" prop="ruleIndex">
        <Select v-model="ruleForm.ruleIndex" @on-change="ruleChanged">
          <Option v-for="(item, key) in ruleOptions" :key="key" :value="key">{{ item.ruleName }}</Option>
        </Select>
      </FormItem>
    </Form>

    <div v-else class="i-pb-10 i-pt-10" style="text-align: center;">
      <span>
        <Icon type="md-alert" size="26" color="#FFBB44"></Icon>
        您还未给此客户设置计费规则
      </span>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button v-if="ruleEmpty" type="primary" @click="gotoSetRules">去设置</Button>
      <Button v-else type="primary" @click="save">确定</Button>
      <Button type="default" class="i-ml-10" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'

export default {
  name: 'FinanceRule',
  mixins: [ BaseDialog ],
  data () {
    const chargeValidate = (rule, value, callback) => {
      if (!this.charge) callback(new Error('未能计算出运费，请检查计费规则是否正确'))
      callback()
    }

    return {
      loading: true,
      ruleForm: { ruleIndex: void 0 },
      ruleOptions: [],
      ruleEmpty: false,
      charge: 0,
      zIndex: new Date().getTime(),
      rules: {
        ruleIndex: [{ validator: chargeValidate }]
      }
    }
  },
  created () {
    this.fetchRules()
  },
  methods: {
    fetchRules () {
      this.loading = true
      Server({
        method: 'get',
        url: '/finance/charge/listRules',
        params: {
          partnerType: this.partnerType,
          partnerName: this.partnerName
        }
      }).then((res) => {
        this.ruleOptions = res.data.data
        this.ruleEmpty = !!res.data.data
      }).catch(err => {
        console.error(err)
      })
    },

    ruleChanged (index) {
      const rule = this.ruleOptions[index]
      Server({
        url: '/finance/charge/calc',
        method: 'get',
        data: {
          ruleId: rule.ruleId,
          departure: this.start,
          destination: this.end,
          input: (rule.detail.ruleType === 1 ? this.weight : this.volume) * 100
        }
      }).then(res => {
        this.charge = res.data.data / 100
        this.$refs.$form.validate()
      })
    },

    save () {
      this.$refs.$form.validate(valid => {
        if (!valid) return
        this.ok(this.charge)
        this.close()
      })
    },

    gotoSetRules () {
      this.close()
      if (this.closeParentDialog) this.closeParentDialog()
      this.openTab({
        title: '计费规则',
        path: '/finance/rules'
      })
    }
  }
}
</script>
