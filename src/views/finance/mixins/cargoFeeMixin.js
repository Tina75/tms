/**
 * 代收货款未收，未付页mixin
 * @Author: mayousheng:Y010220
 * @Date: 2018-11-09 16:48:31
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-28 11:19:14
 */
import _ from 'lodash'
import server from '@/libs/js/server'
import TMSUrl from '@/libs/constant/url'
import { mapGetters } from 'vuex'
import float from '@/libs/js/float'
export default {
  data () {
    return {
      selectedRows: [],
      activeSender: null,
      datas: {},
      searchForm: {},
      styles: {
        height: 'auto'
      }
    }
  },
  watch: {
    datas (newDatas) {
      if (this.activeSender) {
        // 当前选中的发货方，正好在核销之后没有可核销的单子，从列表中移除，那么当前选中的就移除
        if (!newDatas[this.activeSender.partnerName]) {
          this.activeSender = null
          this.$refs.senderList.clearActiveKey()
        }
      }
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight']),
    title () {
      if (!this.activeSender) {
        return ''
      }
      return this.activeSender.partnerName
    },
    // 右侧订单列表
    orderList () {
      if (!this.activeSender) {
        return []
      }
      console.log(this.datas[this.activeSender.partnerName].orderInfos)
      return this.datas[this.activeSender.partnerName].orderInfos.map(item => {
        return Object.assign({}, item, {
          carrierName: item.carrierName ? item.carrierName : '-',
          departureName: item.departureName ? item.departureName : '-',
          destinationName: item.destinationName ? item.destinationName : '-',
          truckNo: item.truckNo ? item.truckNo : '-',
          orderNo: item.orderNo ? item.orderNo : '-',
          orderStatusDesc: item.orderStatusDesc ? item.orderStatusDesc : '-'
        })
      })
    },
    isEmptyList () {
      return Object.keys(this.datas).length === 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      let height = this.DocumentHeight - 249 + this.$parent.$parent.$el.getBoundingClientRect().top
      this.styles = {
        height: (height) + 'px'
      }
    })
  },
  methods: {
    formatFee (fee) {
      return ((fee || 0) / 100).toFixed(2)
    },
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
      if (this.selectedRows.length > 0) {
        this.selectedRows = []
      }
    },
    /**
     * 选择订单记录核销
     */
    handleSelectionChange (selected) {
      this.selectedRows = selected
    },
    /**
     * 搜索
     */
    handleSearch (searchParam) {
      this.searchForm = { ...searchParam }
      // this.activeSender = null
      this.selectedRows = []
      // this.$refs.senderList.clearActiveKey()
      this.fetch()
    },
    /**
     * 批量核销
     */
    batchWriteOff () {
      const vm = this
      if (this.selectedRows.length === 0) {
        this.$Message.warning('请选择待收款核销的订单')
        return
      }
      const ids = []
      const needPay = this.selectedRows.reduce((total, item) => {
        ids.push(item.id)
        total += item.collectionMoney
        return total
      }, 0)
      // 单笔核销
      this.openDialog({
        name: 'finance/dialogs/cargoFeeVerify',
        data: {
          id: ids,
          title: this.verifyTitle,
          verifyType: this.verifyType,
          needPay: float.round((needPay / 100).toFixed(2)),
          orderNum: this.selectedRows.length
        },
        methods: {
          ok () {
            vm.$Message.success('核销成功')
            vm.selectedRows = []
            vm.fetch()
          }
        }
      })
    },
    /**
     * 核销
     * @param {} data
     */
    writeOff (data) {
      const vm = this
      // 单笔核销
      this.openDialog({
        name: 'finance/dialogs/cargoFeeVerify',
        data: {
          id: data.id,
          title: this.verifyTitle,
          verifyType: this.verifyType,
          needPay: float.round((data.collectionMoney / 100).toFixed(2)),
          orderNum: 0
        },
        methods: {
          ok () {
            vm.$Message.success('核销成功')
            vm.selectedRows = []
            vm.fetch()
          }
        }
      })
    },
    /**
     * 查询代收货款
     */
    fetch () {
      const vm = this
      server({
        url: '/finance/collection/order/query',
        method: 'get',
        data: {
          ...this.searchForm,
          commonStatus: this.commonStatus
        }
      }).then((res) => {
        // this.datas = _.groupBy(res.data.data, (item) => item.partnerName)
        if (res.data.data && res.data.data.length > 0) {
          const groupData = _.groupBy(res.data.data, (item) => item.partnerName)
          const datas = {}
          for (let name in groupData) {
            datas[name] = groupData[name][0]
          }
          vm.datas = datas
        } else {
          vm.datas = {}
          vm.activeSender = null
        }
      })
    }
  }
}
