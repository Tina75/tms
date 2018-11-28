<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="400" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>

    <div style="font-size: 14px;font-family: PingFangSC-Regular;color: #000;">
      <!-- <Icon type="ios-close-circle" size="28" color="#EE2017" style="margin-top: -2px;margin-right: 10px;"></Icon> -->
      <div style="margin-left: 10px;">
        <div style="text-align: center;">{{ message }}</div>
        <div :style="cashBack.length > 1 ? 'margin-left: 18px;' : 'text-align: center;'" style="font-size: 13px;line-height: 2;margin-top: 10px;">{{ billNos }}</div>
      </div>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'CashBackWarn',
  mixins: [ BaseDialog ],
  data () {
    return {
      billNos: ''
    }
  },

  created () {
    console.log(this.cashBack)
    let billNoArr = []
    this.cashBack.map((i) => {
      if (this.type === 'waybill') {
        billNoArr.push(i.waybillNo)
      } else {
        billNoArr.push(i.transNo)
      }
    })
    this.billNos = billNoArr.join('; ')
  },

  methods: {
    ok () {
      this.close()
    }
  }
}

</script>
<style lang='stylus'>
</style>
