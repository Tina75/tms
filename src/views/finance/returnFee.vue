<template>
  <div class="return-fee">
    <TabHeader :value="activeTab" :list="tabs" @on-change="handleChangeTab" />
    <div class="return-fee__content">
      <WaitReturnFee v-if="activeTab === 'WAIT_VERIFY'"></WaitReturnFee>
      <div v-if="activeTab === 'VERIFIED'" class="return-fee__verified">
        <ReturnFeeForm scene="2"></ReturnFeeForm>
        <PageTable
          :columns="columns"
          url="/cashback/getVerify"
        ></PageTable>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 返现对账
 */
import BasePage from '@/basic/BasePage'
import TabHeader from './components/TabHeader'
import { ReturnTabs } from './constant/tabs.js'
import WaitReturnFee from './components/WaitReturnFee.vue'
import ReturnFeeForm from './components/ReturnFeeForm.vue'
import PageTable from '@/components/page-table/index'
export default {
  components: {
    TabHeader,
    PageTable,
    WaitReturnFee,
    ReturnFeeForm
  },
  mixins: [BasePage],
  data () {
    return {
      tabs: ReturnTabs,
      activeTab: 'WAIT_VERIFY',
      selectedVerifiedOrders: [],
      columns: [
        {
          type: 'selection',
          width: 40
        },
        {
          title: '操作',
          width: 60,
          key: 'action',
          render: (h, params) => {
            return this.hasPower(170602) ? h('a', {
              on: {
                click: () => {
                  // this.writeOff(params.row)
                }
              }
            }, '查看') : ''
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
          title: '承运商/外转方',
          key: 'partnerName'
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
          title: '车牌号',
          key: 'truckNo'
        },
        {
          title: '结算方式',
          width: 75,
          key: 'settleTypeDesc'
        },
        {
          title: '付款时间',
          key: 'verifyTime'
        }
      ]

    }
  },
  computed: {

  },
  mounted () {
    // this.$nextTick(() => {
    //   let height = this.$parent.$el.parentNode.clientHeight - this.$refs.driversList.$el.getBoundingClientRect().top + this.$parent.$el.getBoundingClientRect().top
    //   this.styles = {
    //     height: (height) + 'px'
    //   }
    // })
    // this.fetch()
  },
  methods: {
    /**
     * 头部选项卡切换
     */
    handleChangeTab (activeName) {
      this.activeTab = activeName
    }
  }
}
</script>

<style lang="stylus" scoped>
.return-fee
  margin-bottom -20px
  &__content
    margin 35px 0 0
</style>
