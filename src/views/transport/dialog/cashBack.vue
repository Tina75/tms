<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="400" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>

    <div style="text-align: center;font-size: 14px;font-family: PingFangSC-Regular;color: #000;">
      <Icon type="ios-help-circle" size="28" color="#FFBB44" style="margin-top: -2px;margin-right: 10px;"></Icon>
      <span>请确认此运单是否需要返现</span>
      <div class="cash-back-input" style="margin-top: 30px;margin-bottom: 20px;">
        <span style="padding-right: 10px;">返现运费：</span>
        <MoneyInput v-model="cashBack" style="width: 180px;"/>
      </div>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="ok">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import MoneyInput from '../components/MoneyInput'
import Server from '@/libs/js/server'
import float from '@/libs/js/float'
export default {
  name: 'CashBack',
  components: { MoneyInput },
  mixins: [ BaseDialog ],
  data () {
    return {
      cashBack: 0
    }
  },
  methods: {
    ok () {
      const data = {
        cashBack: float.round(this.cashBack * 100 || 0),
        confirmBack: 1
      }
      if (this.type === 'waybill') {
        data.waybillIds = this.waybillIds // 运单到货
      } else {
        data.transIds = this.transIds // 外转单到货
      }
      Server({
        url: this.url,
        method: 'post',
        data: data
      }).then(res => {
        this.confirm()
        this.close()
      }).catch(err => console.error(err))
    }
  }
}

</script>
<style lang='stylus'>
.cash-back-input
  .ivu-input-number-input-wrap
    text-align left
    line-height 32px
  .number-input-unit
    line-height 30px
</style>
