<template>
  <div class="return-fee">
    <TabHeader :value="activeTab" :list="tabs" @on-change="handleChangeTab" />
    <div class="return-fee__content">
      <WaitReturnFee v-if="activeTab === 'WAIT_VERIFY'"></WaitReturnFee>
      <div v-if="activeTab === 'VERIFIED'" class="return-fee__verified">
        <ReturnFeeForm scene="2" @on-search="handleSearch"></ReturnFeeForm>
        <div>
          <Button type="primary" @click="handleExport">导出</Button>
        </div>
        <PageTable
          ref="pageTable"
          :keywords="keywords"
          :columns="columns"
          method="post"
          url="/cashback/getVerify"
          @on-selection-change="handleSelectionChange"
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
import returnFeeMixin from './mixins/returnFeeMixin.js'
import settlement from '@/libs/constant/settlement'
import Export from '@/libs/js/export'
export default {
  components: {
    TabHeader,
    PageTable,
    WaitReturnFee,
    ReturnFeeForm
  },
  mixins: [BasePage, returnFeeMixin],
  data () {
    const settlementFilters = settlement.map((item) => {
      return {
        label: item.name,
        value: item.value
      }
    })
    return {
      tabs: ReturnTabs,
      activeTab: 'WAIT_VERIFY',
      selectedOrders: [],
      // 一核销
      keywords: {
        partnerName: void 0,
        orderNo: void 0,
        startTime: void 0,
        endTime: void 0
      },
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
          key: 'settleTypeDesc',
          filters: settlementFilters,
          filterMultiple: true,
          filterRemote (value, row) {
            return row.settleTypeDesc === value
          }
        },
        {
          title: '核销时间',
          key: 'verifyTime',
          sortable: true
        }
      ]

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    /**
     * 头部选项卡切换
     */
    handleChangeTab (activeName) {
      this.activeTab = activeName
    },
    /**
     * 搜索
     */
    handleSearch (params) {
      this.keywords = params
    },
    handleSelectionChange (selected) {
      this.selectedOrders = selected
    },
    /**
     * 导出
     */
    handleExport () {
      if (this.selectedOrders.length === 0) {
        this.$Message.warning('请选择需要导出的订单')
      }
      const data = { id: this.selectedOrders.map(item => item.id) }
      Export({
        url: 'cashback/export',
        method: 'post',
        data,
        fileName: '回单明细'
      })
      this.$refs.pageTable.clearSelected()
      this.selectedOrders = []
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
