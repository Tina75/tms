<template>
  <div class="process-center">
    <NodePoint
      v-for="(node, index) in nodes"
      :key="index"
      :type="node.type"
      :x="node.x"
      :y="node.y"
      :poptip="node.poptip"
      :text="node.text"
      :url="node.link"
      :access="node.access"
    ></NodePoint>
  </div>
</template>

<script>
import NodePoint from './NodePoint.vue'
import TMSUrl from '@/libs/constant/url.js'
export default {
  components: {
    NodePoint
  },
  props: {
    hasPower: Function
  },
  data () {
    return {
      nodes: [
        /** 受理开单 */
        { x: '74px', y: '133px', type: 'kaidan', poptip: '单个录入上游客户的订单信息', access: this.hasPower(100100), link: { path: TMSUrl.CREATE_ORDER, title: '手工开单' }, text: '手工开单' },
        { x: '74px', y: '262px', type: 'piliangdaoru', poptip: '通过Excel批量导入上游客户的订单信息', access: this.hasPower(100200), link: { path: TMSUrl.IMPORT_ORDER, title: '批量导入' }, text: '批量导入' },
        { x: '232px', y: '199px', type: 'dingdan', poptip: '对已经录入到系统中的客户订单进行查看管理', access: this.hasPower(100300), link: { path: TMSUrl.ORDER_MANAGEMENT, title: '订单管理' }, text: '订单管理' },
        /** 提货管理 */
        { x: '475px', y: '104px', type: 'tihuotiaodu', poptip: '对上门提货的客户订单，安排承运商或外转方去提货', access: this.hasPower(120200), link: { path: TMSUrl.PICKUP_ORDER, query: { tab: 0 }, title: '提货管理' }, text: '提货调度' },
        { x: '586px', y: '104px', type: 'paiche', poptip: '填写承运商费用信息，确认提货', access: this.hasPower(120200), link: { path: TMSUrl.PICKUP_ORDER, query: { tab: 1 }, title: '提货管理' }, text: '派车' },
        { x: '714px', y: '104px', type: 'zaitu', poptip: '查看在途的提货订单，确认是否提货成功', access: this.hasPower(120200), link: { path: TMSUrl.PICKUP_ORDER, query: { tab: 2 }, title: '提货管理' }, text: '在途' },
        { x: '841px', y: '104px', type: 'tihuochenggong', poptip: '提货成功，等待安排送货', access: this.hasPower(120200), link: { path: TMSUrl.PICKUP_ORDER, query: { tab: 3 }, title: '提货管理' }, text: '提货成功' },
        // { x: '985px', y: '108px', type: 'songhuoguanli', poptip: '对需要送货的客户订单进行查看派车发运等管理', access: this.hasPower(120100), link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 0 }, title: '送货管理' }, text: '送货管理' },
        /**
         *  外传管理
         *  modify by mys 2018-11-23 删除所有外转入口信息
        */
        // { x: '479px', y: '207px', type: 'waizhuan', poptip: '查看外转的全部订单', access: this.hasPower(120300), link: { path: TMSUrl.OUTER_ORDER, query: { tab: 0 }, title: '外转管理' }, text: '外转' },
        // { x: '585px', y: '207px', type: 'fayun', poptip: '查看待发运的外转订单，可确认发运', access: this.hasPower(120300), link: { path: TMSUrl.OUTER_ORDER, query: { tab: 1 }, title: '外转管理' }, text: '发运' },
        // { x: '691px', y: '207px', type: 'zaitu', poptip: '查看在途的外转订单，可确认到货', access: this.hasPower(120300), link: { path: TMSUrl.OUTER_ORDER, query: { tab: 2 }, title: '外转管理' }, text: '在途' },
        // { x: '795px', y: '207px', type: 'daohuo', poptip: '查看已经到货的外转订单', access: this.hasPower(120300), link: { path: TMSUrl.OUTER_ORDER, query: { tab: 3 }, title: '外转管理' }, text: '到货' },
        /** 送货管理 */
        { x: '475px', y: '307px', type: 'songhuotiaodu', poptip: '对直接送货的客户订单，进行拆单/组合，安排承运商或外转方来送货', access: this.hasPower(120100), link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 0 }, title: '送货管理' }, text: '送货调度' },
        { x: '586px', y: '307px', type: 'paiche', poptip: '填写承运商和费用信息，确认派车并发运', access: this.hasPower(120100), link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 1 }, title: '送货管理' }, text: '派车' },
        // { x: '691px', y: '323px', type: 'fayun', poptip: '确认承运商司机已经发运', access: this.hasPower(120100), link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 2 }, title: '送货管理' }, text: '发运' },
        { x: '714px', y: '307px', type: 'zaitu', poptip: '查看在途的司机位置，可确认司机送货成功', access: this.hasPower(120100), link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 3 }, title: '送货管理' }, text: '在途' },
        { x: '841px', y: '307px', type: 'daohuo', poptip: '送货成功，等待司机送回回单', access: this.hasPower(120100), link: { path: TMSUrl.TANSPORT_ORDER, query: { tab: 4 }, title: '送货管理' }, text: '到货签收' },
        /** 财务管理 */
        { x: '60px', y: '497px', type: 'duizhang', poptip: '查看发货方、承运商、外转方的订单信息，可直接进行核销', access: this.hasPower(170100), link: { path: TMSUrl.SENDER_FINANCE, query: { tab: '1' }, title: '发货方对账' }, text: '对账' },
        { x: '166px', y: '497px', type: 'duizhangdan', poptip: '生成对账单，可批量对账核销', access: this.hasPower(170100), link: { path: TMSUrl.SENDER_FINANCE, query: { tab: '2' }, title: '发货方对账' }, text: '对账单' },
        { x: '267px', y: '497px', type: 'hexiao', poptip: '查看已核销完成订单', access: this.hasPower(170100), link: { path: TMSUrl.SENDER_FINANCE, query: { tab: '3' }, title: '发货方对账' }, text: '核销' },
        /** 回单管理 */
        { x: '475px', y: '497px', type: 'huidanfanchang', poptip: '查看客户已经接收到回单的订单', access: this.hasPower(120500), link: { path: TMSUrl.RECEIPT_ORDER_MANAGEMENT, query: { tab: 4 }, title: '回单管理' }, text: '回单返厂' },
        { x: '586px', y: '497px', type: 'huidanjisong', poptip: '查看待客户接收回单的订单，可确认客户已经收到回单', access: this.hasPower(120500), link: { path: TMSUrl.RECEIPT_ORDER_MANAGEMENT, query: { tab: 3 }, title: '回单管理' }, text: '回单寄送' },
        { x: '714px', y: '497px', type: 'huidanhuishou', poptip: '查看待司机送回回单的订单，可确认已收到回单', access: this.hasPower(120500), link: { path: TMSUrl.RECEIPT_ORDER_MANAGEMENT, query: { tab: 2 }, title: '回单管理' }, text: '回单回收' }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
.process-center
  background url('../../../assets/process.png') no-repeat
  width 1134px
  height 650px
  background-size 1134px 650px
  position relative
  margin 0 auto
</style>
