import { renderFee } from '@/libs/js/config'
const tableColumns = [
  {
    title: '订单号',
    key: 'orderNo',
    tooltip: true
  },
  {
    title: '客户订单号',
    key: 'customerOrderNo',
    render: (h, p) => {
      return h('span', p.row.customerOrderNo || '-')
    }
  },
  {
    title: '货物名称',
    key: 'cargoName',
    render: (h, params) => {
      let text = ''
      if (params.row.cargoName.length > 12) { // 显示tooltip
        text = params.row.cargoName.slice(0, 12) + '...'
        return h('div', [
          h('Tooltip', {
            props: {
              placeholder: 'bottom',
              transfer: false
            }
          }, [
            h('span', {
            }, text),
            h('div', {
              slot: 'content',
              style: {
                whiteSpace: 'normal'
              }
            }, params.row.cargoName)
          ])
        ])
      } else {
        return h('span', {
        }, params.row.cargoName || '-')
      }
    }
  },
  {
    title: '货物编号',
    key: 'cargoNo',
    render: (h, params) => {
      let text = ''
      if (params.row.cargoNo.length > 12) { // 显示tooltip
        text = params.row.cargoNo.slice(0, 12) + '...'
        return h('div', [
          h('Tooltip', {
            props: {
              placeholder: 'bottom',
              transfer: false
            }
          }, [
            h('span', {
            }, text),
            h('div', {
              slot: 'content',
              style: {
                whiteSpace: 'normal'
              }
            }, params.row.cargoNo)
          ])
        ])
      } else {
        return h('span', {
        }, params.row.cargoNo || '-')
      }
      // return h('span', p.row.cargoNo ? p.row.cargoNo : '-')
    }
  },
  {
    title: '包装方式',
    key: 'unit',
    render: (h, p) => {
      return h('span', p.row.unit ? p.row.unit : '-')
    }
  },
  {
    title: '包装数量',
    key: 'quantity',
    render: (h, p) => {
      return h('span', p.row.quantity || 0)
    }
  },
  {
    title: '重量（吨）',
    key: 'weight',
    render: (h, p) => {
      return h('span', p.row.weight || 0)
    }
  },
  {
    title: '重量（公斤）',
    key: 'weightKg',
    render: (h, p) => {
      return h('span', p.row.weightKg || 0)
    }
  },
  {
    title: '体积（方）',
    key: 'volume',
    render: (h, p) => {
      return h('span', p.row.volume || 0)
    }
  },
  {
    title: '货值（元）',
    key: 'cargoCost',
    render: (h, params) => {
      return renderFee(h, params.row.cargoCost)
    }
  }
]

export default tableColumns
