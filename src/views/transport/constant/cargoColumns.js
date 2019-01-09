const tableColumns = [
  {
    title: '订单号',
    key: 'orderNo'
  },
  {
    title: '客户订单号',
    key: 'customerOrderNo'
  },
  {
    title: '货物名称',
    key: 'cargoName'
  },
  {
    title: '货物编号',
    key: 'cargoNo',
    render: (h, p) => {
      return h('span', p.row.cargoNo ? p.row.cargoNo : '-')
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
      return h('span', p.row.quantity ? p.row.quantity : 0)
    }
  },
  {
    title: '重量（吨）',
    key: 'weight',
    render: (h, p) => {
      return h('span', p.row.weight || '-')
    }
  },
  {
    title: '体积（方）',
    key: 'volume',
    render: (h, p) => {
      return h('span', p.row.volume ? p.row.volume : 0)
    }
  }
]

export default tableColumns
