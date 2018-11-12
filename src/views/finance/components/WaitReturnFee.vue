<template>
  <div class="wait-verify">
    <ReturnFeeForm scene="1"></ReturnFeeForm>
    <ReconcileLayout :columns="orderColumns" :data-source="orderList" title="外转方/承运商返现对账列表" empty-content="请点击左侧外转方/承运商查看返现对账列表哦～">
      <div slot="operation">
        <Button type="primary" @click="batchWriteOff">核销</Button>
      </div>
      <ListSender ref="driversList" :style="styles" list-key="partnerName" @on-click="handleClick">
        <ListSenderItem v-for="(item, name) in drivers" :key="name" :item="item" :title="item.partnerName" :extra="item.orderNum" icon="ico-company">
          <p slot="supName">
            <span>
              返现总额 {{item.calcTotalFee / 100 }}
            </span>
          </p>
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
import TMSUrl from '@/libs/constant/url'
import ReturnFeeForm from './ReturnFeeForm.vue'
import _ from 'lodash'
import server from '@/libs/js/server'
export default {
  components: {
    ReconcileLayout,
    ListSender,
    ListSenderItem,
    ReturnFeeForm
  },
  mixins: [BaseComponent],
  data () {
    return {
      activeDriver: null,
      drivers: [],
      selectedOrders: [],
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
          width: 140,
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
            return h('span', {}, params.row['totalFee'] / 100)
          }
        },
        {
          title: '车牌号',
          key: 'truckNo'
        },
        {
          title: '结算方式',
          width: 75,
          key: 'settleTypeDesc'
        }
      ],
      styles: {
        height: 'auto'
      }

    }
  },
  computed: {
    // 右侧订单列表
    orderList () {
      if (!this.activeDriver) {
        return []
      }
      return this.drivers[this.activeDriver.partnerName][0].itemList
    }
  },
  mounted () {
    this.$nextTick(() => {
      let height = this.$parent.$parent.$el.parentNode.clientHeight - this.$refs.driversList.$el.getBoundingClientRect().top + this.$parent.$parent.$el.getBoundingClientRect().top
      this.styles = {
        height: (height) + 'px'
      }
    })
  },
  methods: {
    /**
     * 左侧外转方和承运商列表切换
     */
    handleClick (item) {
      this.activeDriver = item
    },
    /**
     * 批量核销
     */
    batchWriteOff () {
      if (this.selectedVerifyOrders.length === 0) {
        this.$Message.warning('请选择待收款核销的订单')
      }
    },
    /**
     * 核销
     */
    writeOff (data) {

    },
    /**
     * 查看订单详情
     */
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
     * 查询代收货款
     */
    fetch () {
      server({
        url: '/cashback/getUnverify',
        method: 'get',
        data: {

        }
      }).then((res) => {
        this.datas = _.groupBy(this.res.data.data, (item) => item.partnerName)
      })
    }
  }
}
</script>

<style>

</style>
