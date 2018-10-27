<template>
  <div class="process">
    <NodePoint
      v-for="(node, index) in nodes"
      :key="index"
      :type="node.type"
      :x="node.x"
      :y="node.y"
      :poptip="node.poptip"
      :text="node.text"
      :url="node.link"
    ></NodePoint>
  </div>
</template>

<script>
/**
 * 流程中心
 */
import NodePoint from './components/NodePoint.vue'
import BasePage from '@/basic/BasePage'
import TMSUrl from '../../libs/constant/url.js'
export default {
  components: {
    NodePoint
  },
  metaInfo: { title: '业务流程' },
  mixins: [BasePage],
  data () {
    return {
      nodes: [
        /** 受理开单 */
        { x: '114px', y: '133px', type: 'kaidan', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.CREATE_ORDER, title: '手工下单' }, text: '手工下单' },
        { x: '114px', y: '262px', type: 'piliangdaoru', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.IMPORT_ORDER, title: '批量导入' }, text: '批量导入' },
        { x: '264px', y: '199px', type: 'dingdan', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.ORDER_MANAGEMENT, title: '订单管理' }, text: '订单管理' },
        /** 提货管理 */
        { x: '549px', y: '60px', type: 'tihuotiaodu', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.PICKUP_ORDER, query: { tab: 0 }, title: '提货管理' }, text: '提货调度' },
        { x: '655px', y: '60px', type: 'paiche', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.PICKUP_ORDER, query: { tab: 1 }, title: '提货管理' }, text: '派车' },
        { x: '761px', y: '60px', type: 'zaitu', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.PICKUP_ORDER, query: { tab: 2 }, title: '提货管理' }, text: '在途' },
        { x: '865px', y: '60px', type: 'tihuochenggong', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.PICKUP_ORDER, query: { tab: 3 }, title: '提货管理' }, text: '提货成功' },
        /** 外传管理 */
        { x: '549px', y: '207px', type: 'waizhuan', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.OUTER_ORDER, query: { tab: 0 }, title: '外转管理' }, text: '外转' },
        { x: '655px', y: '207px', type: 'fayun', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.OUTER_ORDER, query: { tab: 1 }, title: '外转管理' }, text: '发运' },
        { x: '761px', y: '207px', type: 'zaitu', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.OUTER_ORDER, query: { tab: 2 }, title: '外转管理' }, text: '在途' },
        { x: '865px', y: '207px', type: 'daohuo', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.OUTER_ORDER, query: { tab: 3 }, title: '外转管理' }, text: '到货' },
        /** 送货管理 */
        { x: '549px', y: '363px', type: 'songhuotiaodu', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 0 }, title: '送货管理' }, text: '送货调度' },
        { x: '655px', y: '363px', type: 'paiche', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 1 }, title: '送货管理' }, text: '派车' },
        { x: '761px', y: '363px', type: 'fayun', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 2 }, title: '送货管理' }, text: '发运' },
        { x: '865px', y: '363px', type: 'zaitu', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 3 }, title: '送货管理' }, text: '在途' },
        { x: '967px', y: '363px', type: 'daohuo', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 4 }, title: '送货管理' }, text: '到货' },
        /** 财务管理 */
        { x: '90px', y: '514px', type: 'duizhang', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.SENDER_FINANCE, query: { tab: 0 }, title: '发货方对账' }, text: '对账' },
        { x: '196px', y: '514px', type: 'duizhangdan', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.SENDER_FINANCE, query: { tab: 1 }, title: '发货方对账' }, text: '对账单' },
        { x: '297px', y: '514px', type: 'hexiao', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.SENDER_FINANCE, query: { tab: 2 }, title: '发货方对账' }, text: '核销' },
        /** 回单管理 */
        { x: '549px', y: '514px', type: 'huidanfanchang', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.RECEIPT_ORDER_MANAGEMENT, query: { tab: 1 }, title: '回单管理' }, text: '回单返厂' },
        { x: '655px', y: '514px', type: 'huidanjisong', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.RECEIPT_ORDER_MANAGEMENT, query: { tab: 2 }, title: '回单管理' }, text: '回单寄送' },
        { x: '761px', y: '514px', type: 'huidanhuishou', poptip: '录入上游客户给的运单信息', link: { path: TMSUrl.RECEIPT_ORDER_MANAGEMENT, query: { tab: 3 }, title: '回单管理' }, text: '回单回收' }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
.process
  background url('../../assets/process.svg') no-repeat
  height 650px
  position relative
  &__module
    background-color #f9f9f9
</style>
