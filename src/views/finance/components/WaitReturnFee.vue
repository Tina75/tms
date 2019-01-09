<template>
  <div class="wait-verify">
    <ReturnFeeForm scene="1" @on-search="handleSearch"></ReturnFeeForm>
    <ReconcileLayout
      :columns="orderColumns"
      :data-source="orderList"
      :is-empty-list="isEmptyList"
      :title="title"
      empty-content="请点击左侧承运商查看返现对账列表哦～"
      @on-selection-change="handleSelectionChange"
    >
      <div slot="title">
        <p class="wait-verify__view-title">{{title}}</p>
        <p class="wait-verify__view-supName">
          <span>
            返现总额 {{activeDriver.calcTotalFee | toPoint}}
          </span>
        </p>
      </div>
      <div slot="operation">
        <Button v-if="hasPower(170601)" type="primary" @click="batchWriteOff">核销</Button>
      </div>
      <ListSender ref="driversList" :style="styles" list-key="partnerName" @on-click="handleClick">
        <ListSenderItem v-for="(item, name) in drivers" :key="name" :item="item" :title="item.partnerName" :extra="item.orderNum" icon="ico-company">
          <template slot="supName">
            <span>
              返现总额 {{item.calcTotalFee | toPoint}}
            </span>
          </template>
        </ListSenderItem>
      </ListSender>
    </ReconcileLayout>
  </div>
</template>

<script>
/**
 * 返现对账，待核销页面
 */
import ReconcileLayout from './ReconcileLayout.vue'
import ListSender from './list-sender/index.vue'
import ListSenderItem from './list-sender/SenderItem.vue'
import BaseComponent from '@/basic/BaseComponent'
import ReturnFeeForm from './ReturnFeeForm.vue'
import _ from 'lodash'
import server from '@/libs/js/server'
import returnFeeMixin from '../mixins/returnFeeMixin.js'
import settlement from '@/libs/constant/settlement'
import { renderFee, divideFee } from '@/libs/js/config'
import { mapGetters } from 'vuex'
// import float from '@/libs/js/float'
export default {
  components: {
    ReconcileLayout,
    ListSender,
    ListSenderItem,
    ReturnFeeForm
  },
  mixins: [BaseComponent, returnFeeMixin],
  data () {
    const settlementFilters = settlement.map((item) => {
      return {
        label: item.name,
        value: item.name
      }
    })
    return {
      activeDriver: null,
      drivers: {},
      selectedOrders: [],
      searchForm: {
        partnerName: void 0,
        dayType: 1,
        startTime: void 0,
        endTime: void 0
      },
      orderColumns: [
        {
          type: 'selection',
          width: 40
        },
        {
          title: '操作',
          width: 60,
          key: 'action',
          render: (h, params) => {
            return this.hasPower(170601) ? h('a', {
              on: {
                click: () => {
                  this.writeOff(params.row)
                }
              }
            }, '核销') : ''
          }
        },
        {
          title: '订单号',
          width: 150,
          key: 'orderNo',
          render: (h, params) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.toDetail(params.row)
                }
              }
            }, params.row.orderNo)
          }
        },
        {
          title: '始发地',
          key: 'departureName'
        },
        {
          title: '目的地',
          key: 'destinationName'
        },
        {
          title: '返现用费',
          key: 'totalFee',
          render (h, params) {
            return renderFee(h, params.row['totalFee'])
          }
        },
        {
          title: '车牌号',
          key: 'truckNo'
        },
        {
          title: '结算方式',
          width: 90,
          key: 'settleTypeDesc',
          filters: settlementFilters,
          filterMethod (value, row) {
            return row.settleTypeDesc === value
          }
        }
      ],
      styles: {
        height: 'auto'
      }

    }
  },
  computed: {
    ...mapGetters(['DocumentHeight']),
    title () {
      if (!this.activeDriver) {
        return ''
      }
      return this.activeDriver.partnerName
    },
    // 右侧订单列表
    orderList () {
      if (!this.activeDriver) {
        return []
      }
      return this.drivers[this.activeDriver.partnerName].orderInfos.map((item) => {
        return Object.assign({}, item, {
          orderNo: item.orderNo ? item.orderNo : '-',
          departureName: item.departureName ? item.departureName : '-',
          destinationName: item.destinationName ? item.destinationName : '-',
          truckNo: item.truckNo ? item.truckNo : '-',
          orderStatusDesc: item.orderStatusDesc ? item.orderStatusDesc : '-'
        })
      })
    },
    isEmptyList () {
      return Object.keys(this.drivers).length === 0
    }
  },
  watch: {
    drivers (newDatas) {
      if (this.activeDriver) {
        // 当前选中的发货方，正好在核销之后没有可核销的单子，从列表中移除，那么当前选中的就移除
        if (!newDatas[this.activeDriver.partnerName]) {
          this.$refs.driversList.clearActiveKey()
          this.activeDriver = null
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let height = this.DocumentHeight - 249 + this.$parent.$parent.$el.getBoundingClientRect().top
      this.styles = {
        height: (height) + 'px'
      }
    })
    this.fetch()
  },
  methods: {
    /**
     * 搜索
     */
    handleSearch (form) {
      this.searchForm = form
      // this.activeDriver = null
      this.selectedOrders = []
      // this.$refs.driversList.clearActiveKey()
      this.fetch()
    },
    /**
     * 左侧外转方和承运商列表切换
     */
    handleClick (item) {
      this.activeDriver = item
      if (this.selectedOrders.length > 0) {
        this.selectedOrders = []
      }
    },
    /**
     * 选择回调
     */
    handleSelectionChange (selected) {
      this.selectedOrders = selected
    },
    /**
     * 批量核销
     */
    batchWriteOff () {
      const vm = this
      if (this.selectedOrders.length === 0) {
        this.$Message.warning('请选择返现核销的订单')
        return
      }
      const ids = []
      const needPay = this.selectedOrders.reduce((total, item) => {
        ids.push(item.id)
        total += item.totalFee
        return total
      }, 0)
      // 单笔核销
      this.openDialog({
        name: 'finance/dialogs/returnFeeVerify',
        data: {
          id: ids,
          // needPay: float.round((needPay / 100).toFixed(2)),
          needPay: divideFee(needPay),
          verifyType: 3, // 1-代收货款已收未付，2-代收货款已付款，3-返现运费'
          orderNum: ids.length
        },
        methods: {
          ok () {
            vm.$Message.success('核销成功')
            vm.selectedOrders = []
            vm.fetch()
          }
        }
      })
    },
    /**
     * 核销
     */
    writeOff (data) {
      const vm = this
      // 单笔核销
      this.openDialog({
        name: 'finance/dialogs/returnFeeVerify',
        data: {
          id: data.id,
          // needPay: float.round((data.totalFee / 100).toFixed(2)),
          needPay: divideFee(data.totalFee),
          verifyType: 3, // 1-代收货款已收未付，2-代收货款已付款，3-返现运费'
          orderNum: 0
        },
        methods: {
          ok () {
            vm.$Message.success('核销成功')
            vm.selectedOrders = []
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
        url: '/cashback/getUnverify',
        method: 'post',
        data: {
          ...this.searchForm
        }
      }).then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          const groupDrivers = _.groupBy(res.data.data, (item) => item.partnerName)
          const drivers = {}
          for (let name in groupDrivers) {
            drivers[name] = groupDrivers[name][0]
          }

          vm.drivers = drivers
        } else {
          vm.drivers = {}
          vm.activeDriver = null
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.wait-verify
  .ivu-btn
    width 86px
  &__view-title
    line-height 22px
    font-size 14px
    color #333333
    font-weight 500
  &__view-supName
    line-height 22px
    font-size 12px
    color #999999
</style>
