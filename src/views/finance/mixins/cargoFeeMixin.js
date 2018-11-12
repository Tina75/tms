/**
 * 代收货款未收，未付页mixin
 * @Author: mayousheng:Y010220
 * @Date: 2018-11-09 16:48:31
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-12 14:39:58
 */
import _ from 'lodash'
import server from '@/libs/js/server'
import TMSUrl from '@/libs/constant/url'
export default {
  data () {
    return {
      activeSender: null,
      datas: [],
      searchForm: {},
      styles: {
        height: 'auto'
      }
    }
  },
  computed: {
    // 右侧订单列表
    orderList () {
      if (!this.activeSender) {
        return []
      }
      return this.datas[this.activeSender.partnerName][0].itemList
    }
  },
  mounted () {
    this.$nextTick(() => {
      let height = this.$parent.$parent.$el.parentNode.clientHeight - this.$refs.senderList.$el.getBoundingClientRect().top + this.$parent.$parent.$el.getBoundingClientRect().top
      this.styles = {
        height: (height) + 'px'
      }
    })
  },
  methods: {
    toDetail (data) {
      this.openTab({
        path: TMSUrl.ORDER_DETAIL,
        title: data.orderNo,
        query: {
          id: data.orderNo,
          orderId: data.orderId,
          from: 'order'
        }
      })
    },
    /**
     * 选中发货方
     */
    handleClick (item) {
      this.activeSender = item
    },
    /**
     * 搜索
     */
    handleSearch (searchParam) {
      this.searchForm = { ...searchParam }
      this.fetch()
    },
    /**
     * 批量核销
     */
    batchWriteOff () {
      if (this.selectedRows.length === 0) {
        this.$Message.warning('请选择待收款核销的订单')
        return
      }
      const ids = []
      const needPay = this.selectedRows.reduce((total, item) => {
        ids.push(item.id)
        total += item.collectionFee
        return total
      }, 0)
      // 单笔核销
      this.openDialog({
        name: 'finance/dialogs/cargoFeeVerify',
        data: {
          id: ids,
          verifyType: this.verifyType,
          needPay: needPay / 100,
          orderNum: this.selectedRows.length
        },
        methods: {
          ok () {
            this.$Message.success('核销成功')
            this.fetch()
          }
        }
      })
    },
    /**
     * 核销
     * @param {} data
     */
    writeOff (data) {
      // 单笔核销
      this.openDialog({
        name: 'finance/dialogs/cargoFeeVerify',
        data: {
          id: data.id,
          verifyType: this.verifyType,
          needPay: data.collectionFee / 100,
          orderNum: 0
        },
        methods: {
          ok () {
            this.$Message.success('核销成功')
            this.fetch()
          }
        }
      })
    },
    /**
     * 查询代收货款
     */
    fetch () {
      server({
        url: '/finance/collection/order/query',
        method: 'get',
        data: {
          ...this.searchForm,
          commonStatus: this.commonStatus
        }
      }).then((res) => {
        this.datas = _.groupBy(res.data.data, (item) => item.partnerName)
      })
    }
  }
}
