export default () => {
  return [
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (h, params) => {
        return h('div', [
          h(
            'Button',
            {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  console.log(params.index)
                }
              }
            },
            '修改'
          )
        ])
      }
    },
    {
      title: '订单号',
      key: 'order'
    },
    {
      title: '客户订单号',
      key: 'clientOrder'
    },
    {
      title: '运单号',
      key: 'expressOrder'
    },
    {
      title: '客户昵称',
      key: 'name'
    },
    {
      title: '始发地',
      key: 'startCity'
    },
    {
      title: '目的地',
      key: 'endCity'
    },
    {
      title: '里程数(公里)',
      width: 120,
      key: 'distance'
    },
    {
      title: '体积(方)',
      key: 'volume'
    },
    {
      title: '重量(吨)',
      key: 'weight'
    },
    {
      title: '下单时间',
      key: 'createTime'
    }
  ]
}
