/**
 * 代收货款未收，未付页mixin
 * @Author: mayousheng:Y010220
 * @Date: 2018-11-09 16:48:31
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-09 17:58:09
 */
import _ from 'lodash'
import server from '@/libs/js/server'
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
    /**
     * 选中发货方
     */
    handleClick (item) {
      this.activeSender = item
    },
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
    writeOffOk (data) {
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
     * 核销校验
     */
    checkOrder (data) {
      server({
        url: '/finance/verify/checkOrder',
        method: 'post',
        data: {
          id: data.id,
          verifyType: this.verifyType
        }
      }).then(res => {
        if (res.data.data === '') {
          this.writeOffOk(data)
        } else if (res.data.data && res.data.data.operateCode === 1) {
          // 存在异常
          console.log(res.data.data.orderNos)
          this.$Toast.warning({
            title: '核销',
            content: '以下单据存在异常，无法核销',
            render: (h) => {
              const list = res.data.data.orderNos.length > 0 ? res.data.data.orderNos.map(item => {
                return h('p', item)
              }) : []
              console.log(list)
              return h('div', [
                ...list
              ])
            },
            okText: '确认',
            cancelText: '取消'
          })
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
        this.datas = _.groupBy(this.res.data.data, (item) => item.partnerName)
      })
    }
  }
}
