// import TMSUrl from '@/libs/constant/url'
// import float from '@/libs/js/float'
import { renderFee, getRateText } from '@/libs/js/config'
import IconLabel from '@/components/IconLabel'
import { renderMileage, renderVolume, renderWeight } from './util'

export const TABLE_COLUMNS = vm => [
  {
    type: 'selection',
    width: 50,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '订单号',
    key: 'orderNo',
    minWidth: 180,
    fixed: 'left',
    render: (h, params) => {
      let renderHtml = [
        h('a', {
          props: {
            type: 'text'
          },
          style: {
            // marginRight: '5px',
            display: 'block',
            color: '#418DF9'
          },
          on: {
            click: () => {
              vm.openTab({
                path: 'upstreamDetail',
                query: {
                  shipperOrderId: params.row.shipperOrderId,
                  id: params.row.orderNo
                }
              })
            }
          }
        }, params.row.orderNo)
      ]
      if (params.row.collectionMoney > 0) {
        renderHtml.push(
          h(IconLabel, {
            props: {
              text: '代',
              background: '#FA8C15'
            }
          })
        )
      }
      return h('div', renderHtml)
    }
  },
  {
    title: '客户订单号',
    key: 'customerOrderNo',
    minWidth: 160
  },
  {
    title: '订单状态',
    key: 'status',
    minWidth: 120,
    render: (h, p) => {
      return h('span', vm.statusToName(p.row.status))
    }
  },
  {
    title: '客户名称',
    key: 'shipperCompanyName',
    minWidth: 200
  },
  {
    title: '对接业务员',
    key: 'handlerUserName',
    minWidth: 180
  },
  {
    title: '发货城市',
    key: 'departureCityName',
    minWidth: 180
  },
  {
    title: '收货城市',
    key: 'destinationCityName',
    minWidth: 180
  },
  {
    title: '计费里程（公里）',
    key: 'mileage',
    width: 120,
    render: (h, params) => {
      return renderMileage(h, params.row['mileage'])
    }
  },
  {
    title: '体积（方）',
    key: 'volume',
    minWidth: 100,
    render: (h, p) => {
      // return h('span', p.row.volume ? p.row.volume : '-')
      return renderVolume(h, p.row['volume'])
      // renderVolume
    }
  },
  {
    title: '重量（吨）',
    key: 'weight',
    minWidth: 100,
    render: (h, p) => {
      // return h('span', p.row.weight ? p.row.weight : '-')
      return renderWeight(h, p.row['weight'])
    }
  },
  {
    title: '下单时间',
    key: 'createTime',
    minWidth: 150,
    render: (h, params) => {
      return h('span', params.row.createTime ? new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    }
  },
  {
    title: '发货时间',
    key: 'deliveryTime',
    minWidth: 150,
    render: (h, params) => {
      return h('span', params.row.deliveryTime ? new Date(params.row.deliveryTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    }
  },
  {
    title: '到货时间',
    key: 'arriveTime',
    minWidth: 150,
    render: (h, params) => {
      return h('span', params.row.arriveTime ? new Date(params.row.arriveTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    }
  },
  {
    title: '发货人',
    key: 'consignerContact',
    minWidth: 180,
    tooltip: true
  },
  {
    title: '发货人联系号码',
    key: 'consignerPhone',
    minWidth: 150,
    tooltip: true
  },
  {
    title: '发货地址',
    key: 'consignerAddress',
    minWidth: 200,
    tooltip: true
  },
  {
    title: '收货人',
    key: 'consigneeContact',
    minWidth: 180,
    tooltip: true
  },
  {
    title: '收货人联系号码',
    key: 'consigneePhone',
    minWidth: 150,
    tooltip: true
  },
  {
    title: '收货地址',
    key: 'consigneeAddress',
    minWidth: 200,
    tooltip: true
  },
  {
    title: '结算方式',
    key: 'settlementTypeDesc',
    minWidth: 120
  },
  {
    title: '运输费',
    key: 'freightFee',
    minWidth: 120,
    render: (h, params) => {
      // return h('span', params.row.freightFee ? (params.row.freightFee / 100).toFixed(2) : '-')
      // return h('div', {}, divideFee(params.row.freightFee))
      return renderFee(h, params.row.freightFee)
    }
  },
  {
    title: '提货费',
    key: 'pickFee',
    minWidth: 120,
    render: (h, params) => {
      // return h('span', params.row.pickFee ? (params.row.pickFee / 100).toFixed(2) : '-')
      return renderFee(h, params.row.pickFee)
    }
  },
  {
    title: '装货费',
    key: 'loadFee',
    minWidth: 120,
    render: (h, params) => {
      // return h('span', params.row.loadFee ? (params.row.loadFee / 100).toFixed(2) : '-')
      return renderFee(h, params.row.loadFee)
    }
  },
  {
    title: '卸货费',
    key: 'unloadFee',
    minWidth: 120,
    render: (h, params) => {
      // return h('span', params.row.unloadFee ? (params.row.unloadFee / 100).toFixed(2) : '-')
      return renderFee(h, params.row.unloadFee)
    }
  },
  {
    title: '保险费',
    key: 'insureFee',
    minWidth: 120,
    render: (h, params) => {
      // return h('span', params.row.insuranceFee ? (params.row.insuranceFee / 100).toFixed(2) : '-')
      return renderFee(h, params.row.insuranceFee)
    }
  },
  {
    title: '其他费用',
    key: 'otherFee',
    minWidth: 120,
    render: (h, params) => {
      // return h('span', params.row.otherFee ? (params.row.otherFee / 100).toFixed(2) : '-')
      return renderFee(h, params.row.otherFee)
    }
  },
  {
    title: '总费用',
    key: 'totalFee',
    minWidth: 120,
    render: (h, params) => {
      // return h('span', params.row.totalFee ? (params.row.totalFee / 100).toFixed(2) : '-')
      return renderFee(h, params.row.totalFee)
    }
  },
  {
    title: '提货方式',
    key: 'pickTypeDesc',
    minWidth: 120
  },
  {
    title: '回单数量',
    key: 'receiptCount',
    minWidth: 120
  },
  {
    title: '代收货款',
    key: 'collectionMoney',
    minWidth: 120,
    render: (h, params) => {
      // return h('span', params.row.collectionMoney ? (params.row.collectionMoney / 100).toFixed(2) : '-')
      return renderFee(h, params.row.collectionMoney)
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
      // return h('span', float.floor(params.row.invoiceRate * 100, 2) || '-')
      return h('span', getRateText(params.row.invoiceRate))
    }
  },
  {
    title: '制单人',
    key: 'orderMakerName',
    minWidth: 120,
    render: (h, p) => {
      return h('span', p.row.orderMakerName ? p.row.orderMakerName : '-')
    }
  }
]
export const TABLIST = [
  { name: '全部', count: '' },
  { name: '待接收', count: '' },
  { name: '已接收', count: '' },
  { name: '已拒绝', count: '' }
]
export function setTabList (data) {
  return [
    { name: '全部', count: '' },
    { name: '待接收', count: data.waitAccept || 0 },
    { name: '已接收', count: data.accepted || 0 },
    { name: '已拒绝', count: data.rejected || 0 }
  ]
}
export const BTNLIST = vm => [
  {
    tab: '全部',
    btns: [
      {
        name: '导出',
        code: 110103,
        func: () => {
          vm.upstreamExport()
        }
      }
    ]
  },
  {
    tab: '待接收',
    btns: [{
      name: '接收',
      code: 110101,
      func: () => {
        vm.accept()
      }
    }, {
      name: '拒绝',
      code: 110102,
      func: () => {
        vm.reject()
      }
    }, {
      name: '导出',
      code: 110103,
      func: () => {
        vm.upstreamExport()
      }
    }]
  },
  {
    tab: '已接收',
    btns: [
      {
        name: '导出',
        code: 110103,
        func: () => {
          vm.upstreamExport()
        }
      }
    ]
  },
  {
    tab: '已拒绝',
    btns: [
      {
        name: '导出',
        code: 110103,
        func: () => {
          vm.upstreamExport()
        }
      }
    ]
  }
]
