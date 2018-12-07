import TMSUrl from '@/libs/constant/url'
export default {
  methods: {
    toDetail (data) {
      switch (data.orderType) {
        case 2:
        // 运单
          this.openTab({
            title: data.orderNo,
            path: TMSUrl.TRANSPORT_ORDER_DETAIL,
            query: { id: data.billId || data.orderId } // id 或 no 二选一
          })
          break
        case 4:
        // 外转单
          this.openTab({
            title: data.orderNo,
            path: TMSUrl.OUTER_ORDER_DETAIL,
            query: { id: data.billId || data.id }
          })
          break
      }
    }
  }
}
