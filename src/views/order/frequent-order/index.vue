<template>
  <div class="frequent-order">
    <div class="right header">
      <!-- <span class="search-label">客户名称：</span> -->
      <SelectInput
        v-model="keyword.consignerName"
        :maxlength="20"
        :clearable="true"
        :local-options="clients"
        class="search-input"
        placeholder="请选择或输入客户名称"
        @on-focus.once="getClients"
        @on-clear="clearKeywords">
      </SelectInput>
      <Button type="primary" icon="ios-search" class="search-btn" @click="searchList"></Button>
    </div>
    <page-table
      :url="url"
      :method="method"
      :columns="tableColumns"
      :keywords="keywords"
      :show-filter="true"
      table-head-type="order_template_head">
    </page-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Server from '@/libs/js/server'
import BasePage from '@/basic/BasePage'
import PageTable from '@/components/page-table/'
import SelectInput from '@/components/SelectInput.vue'
import { getRateText, getFeeText } from '@/libs/js/config'
export default {
  name: 'frequent-order',
  components: {
    PageTable,
    SelectInput
  },
  metaInfo: {
    title: '常发订单'
  },
  mixins: [BasePage],
  data () {
    return {
      tabType: 'ORDER_TEMP',
      method: 'post',
      url: 'ordertemplate/list',
      keyword: {
        consignerName: ''
      },
      keywords: {
        consignerName: ''
      },
      tableColumns: [
        {
          title: '操作',
          width: 180,
          render: (h, params) => {
            const btnList = []
            if (this.hasPower(100401)) {
              btnList.push(h('a', {
                style: {
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                    this.openTab({
                      path: 'create',
                      title: '再来一单',
                      query: { createId: params.row.id }
                    })
                  }
                }
              }, '再来一单'))
            }
            if (this.hasPower(100400)) {
              btnList.push(h('a', {
                style: {
                  marginRight: '12px'
                },
                on: {
                  click: () => {
                    this.openTab({
                      path: 'frequent-order-detail',
                      title: '常发订单详情',
                      query: { id: params.row.id }
                    })
                  }
                }
              }, '查看'))
            }
            if (this.hasPower(100402)) {
              btnList.push(h('a', {
                on: {
                  click: () => {
                    this.$Toast.confirm({
                      content: '确认需要删除此常发订单',
                      onOk: () => {
                        this.deleteItem(params.row.id)
                      }
                    })
                  }
                }
              }, '删除'))
            }
            return h('div', btnList)
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '对接业务员',
          key: 'salesmanName',
          minWidth: 180
        },
        {
          title: '发货城市',
          key: 'startName',
          minWidth: 180
        },
        {
          title: '到货城市',
          key: 'endName',
          minWidth: 180
        },
        {
          title: '计费里程（公里）',
          key: 'mileage',
          width: 120,
          render: (h, params) => {
            return h('span', params.row.mileage / 1000 ? params.row.mileage / 1000 : '-')
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          minWidth: 100
        },
        {
          title: '重量（吨）',
          key: 'weight',
          minWidth: 100
        },
        {
          title: '重量（公斤）',
          key: 'weightKg',
          minWidth: 100
        },
        {
          title: '发货人',
          key: 'consignerContact',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '发货人手机号',
          key: 'consignerPhone',
          minWidth: 130,
          tooltip: true
        },
        {
          title: '发货地址',
          key: 'consignerAddress',
          minWidth: 180,
          tooltip: true,
          render: (h, params) => {
            const text = !params.row.consignerHourseNumber ? params.row.consignerAddress : params.row.consignerAddress + ',' + params.row.consignerHourseNumber
            return h('span', text)
          }
        },
        {
          title: '收货人',
          key: 'consigneeContact',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '收货人手机号',
          key: 'consigneePhone',
          minWidth: 130,
          tooltip: true
        },
        {
          title: '收货地址',
          key: 'consigneeAddress',
          minWidth: 180,
          tooltip: true,
          render: (h, params) => {
            const text = !params.row.consigneeHourseNumber ? params.row.consigneeAddress : params.row.consigneeAddress + ',' + params.row.consigneeHourseNumber
            return h('span', text)
          }
        },
        {
          title: '结算方式',
          key: 'settlementType',
          minWidth: 120,
          render: (h, params) => {
            return h('span', this.settlementToName(params.row.settlementType))
          }
        },
        {
          title: '运输费',
          key: 'freightFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', getFeeText(params.row.freightFee))
          }
        },
        {
          title: '提货费',
          key: 'pickupFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', getFeeText(params.row.pickupFee))
          }
        },
        {
          title: '装货费',
          key: 'loadFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', getFeeText(params.row.loadFee))
          }
        },
        {
          title: '卸货费',
          key: 'unloadFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', getFeeText(params.row.unloadFee))
          }
        },
        {
          title: '保险费',
          key: 'insuranceFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', getFeeText(params.row.insuranceFee))
          }
        },
        {
          title: '其他',
          key: 'otherFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', getFeeText(params.row.otherFee))
          }
        },
        {
          title: '总费用',
          key: 'totalFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', getFeeText(params.row.totalFee))
          }
        },
        {
          title: '提货方式',
          key: 'pickup',
          minWidth: 120,
          render: (h, params) => {
            return h('span', this.pickupToName(params.row.pickup))
          }
        },
        {
          title: '回单数量',
          key: 'receiptCount',
          minWidth: 120,
          render: (h, p) => {
            return h('span', p.row.receiptCount ? p.row.receiptCount : '-')
          }
        },
        {
          title: '代收货款',
          key: 'collectionMoney',
          minWidth: 120,
          render: (h, params) => {
            return h('span', getFeeText(params.row.collectionMoney))
          }
        },
        {
          title: '是否开票',
          key: 'isInvoice',
          minWidth: 180,
          render: (h, params) => {
            return h('span', params.row.isInvoice === 1 ? '是' : '否')
          }
        },
        {
          title: '开票税率',
          key: 'invoiceRate',
          minWidth: 180,
          render: (h, params) => {
            return h('span', getRateText(params.row.invoiceRate))
          }
        },
        {
          title: '备注',
          key: 'remark',
          width: 180,
          ellipsis: true
        },
        {
          title: '制单人',
          key: 'creatorName',
          minWidth: 120,
          render: (h, p) => {
            return h('span', p.row.creatorName ? p.row.creatorName : '-')
          }
        },
        {
          title: '更新时间',
          key: 'updateTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.updateTime ? new Date(params.row.updateTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'clients'
    ])
  },
  methods: {
    ...mapActions([
      'getClients'
    ]),
    searchList () {
      this.keywords = {
        consignerName: this.keyword.consignerName
      }
    },
    clearKeywords () {
      this.keyword.consignerName = ''
      this.keywords.consignerName = ''
    },
    // 删除
    deleteItem (id) {
      Server({
        url: 'ordertemplate/delete',
        method: 'post',
        data: {
          id
        }
      }).then((res) => {
        this.$Message.success('删除成功')
        this.searchList()
      })
    },
    // 提货状态转名称
    pickupToName (code) {
      let name
      switch (code) {
        case 1:
          name = '小车上门自提'
          break
        case 2:
          name = '大车直送客户'
          break
      }
      return name
    },
    // 结算方式转名称
    settlementToName (code) {
      let name = ''
      switch (code) {
        case 1:
          name = '现付'
          break
        case 2:
          name = '到付'
          break
        case 3:
          name = '回付'
          break
        case 4:
          name = '月结'
          break
      }
      return name
    }
  }
}
</script>
<style lang="stylus" scoped>
.header
  margin-bottom 14px
  text-align right
.search-label
  display inline-block
  width 80px
  margin-right 11px
  vertical-align middle
.search-input
  display inline-block
  width 200px
  vertical-align middle
  text-align left
.search-btn
  width 40px
  margin-left -2px
  height 32px
  border-top-left-radius 0
  border-bottom-left-radius 0
  vertical-align middle
</style>
