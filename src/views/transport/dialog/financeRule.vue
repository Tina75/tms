<template>
  <Modal v-model="visibale" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">计费规则</p>
    <Form ref="counterForm" :model="counterForm" :label-width="80">
      <FormItem v-if="!emptyRule" label="计费规则" prop="rule">
        <Select v-model="counterForm.rule">
          <Option value="1">暂无数据</Option>
        </Select>
      </FormItem>
      <div v-else class="van-center i-pb-10 i-pt-10">
        <span>
          <Icon type="md-alert" size="26" color="#FFBB44"></Icon>
          您还未给此客户设置计费规则
        </span>
      </div>
    </Form>
    <div slot="footer" class="van-center">
      <Button v-if="emptyRule" type="primary" @click="gotoSetRules">去设置</Button>
      <Button v-else type="primary" @click="save">确定</Button>
      <Button type="default" class="i-ml-10" @click.native="visibale = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import server from '@/libs/js/server'
export default {
  name: 'FinanceRule',
  mixins: [ BaseDialog ],
  data () {
    return {
      counterForm: {
        rule: ''
      },
      parterName: null,
      ruleOptions: [],
      visibale: true
    }
  },
  computed: {
    emptyRule () {
      return !this.parterName || this.ruleOptions.length === 0
    }
  },
  watch: {
    visibale: function (val) {
      !val && this.close()
    }
  },
  mounted () {
    const vm = this
    // 查询寻计费规则
    if (this.parterName) {
      server({
        method: 'get',
        url: 'finance/charge/listRules',
        params: {
          parterName: this.parterName
        }
      }).then((response) => {
        vm.ruleOptions = response.data.data.map((item) => ({
          ruleName: item.ruleName,
          ruleId: item.ruleId,
          parterName: item.parterName
        }))
      })
    }
  },
  methods: {
    save () {
      this.ok(this.counterForm.rule)
      this.visibale = false
    },

    gotoSetRules () {
      this.close()
      this.cancel()
      this.ema.fire('openTab', {
        title: '计费规则',
        path: '/finance/rules'
      })
    }
  }
}
</script>
