export default {
  data () {
    return {
      leftTableHeader: [
        {
          type: 'expand',
          width: 30,
          render: (h, p) => {
            return h('div', 'test')
          }
        },
        {
          title: '始发地',
          key: 'start',
          ellipsis: true
        },
        {
          title: 'icon',
          width: 50,
          renderHeader: (h, p) => {
            return h('Icon', {
              props: { type: 'md-arrow-round-forward' }
            })
          }
        },
        {
          title: '目的地',
          key: 'end',
          // width: 100,
          ellipsis: true
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        }
      ],
      leftTableData: [
        {
          start: '始发地始发地',
          end: '目的地目的地',
          volume: 11,
          weight: 11
        }
      ]
    }
  }
}
