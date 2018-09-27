<template>
  <Modal v-model="visibale" :mask-closable="true" width="330" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">生成对账单</p>
    <div class="create-data">
      <p><label>承运方：</label><span>{{partnerName}}</span></p>
      <p><label>订单数：</label><span>{{orderNum}}</span></p>
      <p><label>日期范围：</label><span>{{dateRange}}</span></p>
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
  name: 'createCheck',
  mixins: [BaseDialog],
  data () {
    return {
      visibale: true
    }
  },
  methods: {
    save () {}
  }

}

</script>
<style lang='stylus' scoped>
  .create-data
    p
      line-height: 28px
    label
      display: inline-block
      width: 60px
      color: #777777
      vertical-align: middle
    span
      display: inline-block
      color: #333333
      vertical-align: middle
</style>
