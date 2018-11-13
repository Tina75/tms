<template>
  <div class="return-fee">
    <TabHeader :value="activeTab" :list="tabs" @on-change="handleChangeTab" />
    <div class="return-fee__content">
      <WaitReturnFee v-if="activeTab === 'WAIT_VERIFY'"></WaitReturnFee>
      <div v-if="activeTab === 'VERIFIED'" class="return-fee__verified">
        <ReturnFeeForm scene="2" @on-search="handleSearch"></ReturnFeeForm>
        <div class="return-fee__export">
          <Button v-if="hasPower(170603)" type="primary" @click="handleExport">导出</Button>
        </div>
        <PageTable
          ref="pageTable"
          :keywords="keywords"
          :columns="columns"
          method="post"
          url="/cashback/getVerify"
          @on-selection-change="handleSelectionChange"
          @on-sort-change="handleSortChange"
        ></PageTable>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 返现对账
 * 到货确认以后，所有未核销的运单或外转单。
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
import Server from '@/libs/js/server'
import { renderFee } from '@/libs/js/util'
export default {
  components: {
    TabHeader,
    PageTable,
    WaitReturnFee,
    ReturnFeeForm
  },
  metaInfo: {
    title: '返现对账'
  },
  mixins: [BasePage, returnFeeMixin],
  data () {
    const vm = this
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
        endTime: void 0,
        orderByCreateTime: 2,
        settlementTypes: void 0
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
                  this.showDetailRecord(params.row)
                }
              }
            }, '查看') : ''
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
          title: '承运商/外转方',
          key: 'partnerName',
          width: 180
        },
        {
          title: '始发地',
          key: 'departureName',
          width: 180
        },
        {
          title: '目的地',
          key: 'destinationName',
          width: 180
        },
        {
          title: '应收返现运费',
          key: 'cashBack',
          width: 100,
          render (h, params) {
            return renderFee(h, params.row['cashBack'])
            // return h('span', {}, params.row['cashBack'] ? (params.row['cashBack'] / 100).toFixed(2) : 0)
          }
        },
        {
          title: '实收返现运费',
          key: 'actualFee',
          width: 100,
          render (h, params) {
            return renderFee(h, params.row['actualFee'])
            // return h('span', {}, params.row['actualFee'] ? (params.row['actualFee'] / 100).toFixed(2) : 0)
          }
        },
        {
          title: '车牌号',
          key: 'truckNo',
          width: 80
        },
        {
          title: '结算方式',
          width: 90,
          key: 'settleTypeDesc',
          filters: settlementFilters,
          filterMultiple: true,
          filterRemote (filters, key, row) {
            if (!vm.keywords['settlementTypes'] || filters.length) {
              vm.keywords['settlementTypes'] = filters
            } else {
              if (vm.keywords['settlementTypes']) {
                vm.keywords['settlementTypes'] = void 0
              }
            }
          }
        },
        {
          title: '核销时间',
          key: 'verifyTime',
          sortable: 'custom',
          width: 150,
          render (h, params) {
            return h('span', {}, new Date(params.row['verifyTime']).Format('yyyy-MM-dd hh:mm:ss'))
          }
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
     * 查看核销详情
     */
    showDetailRecord (data) {
      const vm = this
      Server({
        url: 'finance/collection/order/verify/detail',
        method: 'get',
        data: {
          id: data.id
        }
      }).then((res) => {
        vm.openDialog({
          name: 'finance/dialogs/cargoFeeRecord',
          data: {
            title: '核销记录详情',
            receiptRecords: res.data.data.receiptRecords
          },
          methods: {
            ok () {

            }
          }
        })
      })
    },
    /**
     * 搜索
     */
    handleSearch (params) {
      Object.assign(this.keywords, params)
      this.selectedOrders = []
    },
    handleSelectionChange (selected) {
      this.selectedOrders = selected
    },
    /**
     * 排序时候有效，排序时回调
     * @param {object} column 当前列数据
     * @param {string} key 列名称,对应columns的key
     * @param {string} order ,值：asc|desc
     */
    handleSortChange (sorter) {
      this.keywords['orderByCreateTime'] = sorter.order === 'asc' ? 1 : 2
    },
    /**
     * 导出
     */
    handleExport () {
      if (this.selectedOrders.length === 0) {
        this.$Message.warning('请选择需要导出的订单')
        return
      }
      const data = { ids: this.selectedOrders.map(item => item.id) }
      Export({
        url: 'cashback/export',
        method: 'post',
        data,
        fileName: '核销明细'
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
  min-height 415px
  &__content
    margin 35px 0 0
  &__export
    padding 9px 0
    line-height 32px
  .ivu-btn
    width 86px
</style>
