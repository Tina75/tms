<template>
  <div class="frequent-order">
    <div class="right header">
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
import { renderFee, renderMileage, getRateText, getFeeText } from '@/libs/js/config'
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
            return renderMileage(h, params.row.mileage)
            // return h('span', params.row.mileage / 1000 ? params.row.mileage / 1000 : '-')
          }
        },
        {
          title: '货物名称',
          key: 'cargoNames',
          minWidth: 160,
          render: (h, p) => {
            if (p.row.cargoNames.length > 0) {
              if (p.row.cargoNames.length > 1) {
                return h('Tooltip', {
                  props: {
                    placement: 'bottom',
                    maxWidth: 500,
                    content: p.row.cargoNames.join('\n')
                  }
                }, [
                  h('span', p.row.cargoNames[0] + ' ...')
                ])
              } else {
                return h('span', p.row.cargoNames.join('\n'))
              }
            } else {
              return h('span', '-')
            }
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
            return renderFee(h, params.row.freightFee)
            // return h('span', params.row.freightFee ? float.round(params.row.freightFee / 100) : 0)
          }
        },
        {
          title: '提货费',
          key: 'pickupFee',
          minWidth: 120,
          render: (h, params) => {
            return renderFee(h, params.row.pickupFee)
            // return h('span', params.row.pickupFee ? float.round(params.row.pickupFee / 100) : 0)
          }
        },
        {
          title: '装货费',
          key: 'loadFee',
          minWidth: 120,
          render: (h, params) => {
            return renderFee(h, params.row.loadFee)
            // return h('span', params.row.loadFee ? float.round(params.row.loadFee / 100) : 0)
          }
        },
        {
          title: '卸货费',
          key: 'unloadFee',
          minWidth: 120,
          render: (h, params) => {
            return renderFee(h, params.row.unloadFee)
            // return h('span', params.row.unloadFee ? float.round(params.row.unloadFee / 100) : 0)
          }
        },
        {
          title: '保险费',
          key: 'insuranceFee',
          minWidth: 120,
          render: (h, params) => {
            return renderFee(h, params.row.insuranceFee)
            // return h('span', params.row.insuranceFee ? float.round(params.row.insuranceFee / 100) : 0)
          }
        },
        {
          title: '其他',
          key: 'otherFee',
          minWidth: 120,
          render: (h, params) => {
            return renderFee(h, params.row.otherFee)
            // return h('span', params.row.otherFee ? float.round(params.row.otherFee / 100) : 0)
          }
        },
        {
          title: '总费用',
          key: 'totalFee',
          minWidth: 120,
          render: (h, params) => {
            return renderFee(h, params.row.totalFee)
            // return h('span', params.row.totalFee ? float.round(params.row.totalFee / 100) : 0)
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
          minWidth: 120
          // render: (h, p) => {
          //   return h('span', p.row.receiptCount ? p.row.receiptCount : '-')
          // }
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
.search-input
  display inline-block
  width 200px !important
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
