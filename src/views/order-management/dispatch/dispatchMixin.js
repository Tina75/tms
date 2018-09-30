import Server from '@/libs/js/server'
import City from '@/libs/js/City'
import tableExpand from './tableExpand'

export default {
  components: { tableExpand },
  data () {
    return {
      // 左侧表格头
      leftTableHeader: [
        {
          type: 'expand',
          width: 30,
          render: (h) => {
            return h(tableExpand, {
              on: {
                'on-expand-select': (selection) => {
                  this.leftSelection = selection
                }
              },
              props: {
                tableLoading: this.leftTableExpandLoading,
                tableHeader: this.expandTableTypeOne,
                tableData: this.leftTableExpandData
              }
            })
          }
        },
        {
          title: '始发地',
          key: 'start',
          minWidth: 80,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.start), 2)
          }
        },
        // {
        //   title: 'icon',
        //   width: 80,
        //   renderHeader: (h, p) => {
        //     return h('i', {
        //       class: 'icon font_family icon-ico-line',
        //       style: { fontSize: '25px' }
        //     })
        //   }
        // },
        {
          title: '目的地',
          key: 'end',
          minWidth: 80,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.end), 2)
          }
        },
        {
          title: '订单数',
          key: 'ordreNum',
          minWidth: 80,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.ordreNum)
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          minWidth: 80,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.volume)
          }
        },
        {
          title: '重量(吨)',
          key: 'weight',
          minWidth: 80,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.weight)
          }
        }
      ],

      leftTableData: [], // 左侧表格数据
      rightTableData: [], // 右侧表格数据

      // 展开表格类型1 订单号 客户名称 体积 重量
      expandTableTypeOne: [
        {
          type: 'selection',
          width: 45
          // fixed: 'left'
        },
        {
          title: '订单号',
          key: 'orderNo',
          // fixed: 'left',
          minWidth: 200,
          render: (h, p) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.openTab({
                    path: '/order-management/detail',
                    query: {
                      id: p.row.orderNo,
                      orderId: p.row.orderId,
                      from: 'order'
                    }
                  })
                }
              }
            }, p.row.orderNo)
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 85,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.consignerName, 4)
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          minWidth: 80,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.volume, 5)
          }
        },
        {
          title: '重量(吨)',
          key: 'weight',
          minWidth: 80,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.weight, 5)
          }
        }
      ],
      // 展开表格类型2 订单号 客户名称 始发地 目的地 体积
      expandTableTypeTwo: [
        {
          type: 'selection',
          width: 50,
          fixed: 'left'
        },
        {
          title: '订单号',
          key: 'orderNo',
          minWidth: 160,
          fixed: 'left',
          render: (h, p) => {
            return h('a', {
              style: {
                color: '#418DF9'
              },
              on: {
                click: () => {
                  this.openTab({
                    path: '/order-management/detail',
                    query: {
                      id: p.row.orderNo,
                      orderId: p.row.orderId,
                      from: 'order'
                    }
                  })
                }
              }
            }, p.row.orderNo)
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 160,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.consignerName)
          }
        },
        {
          title: '始发地',
          key: 'start',
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.end))
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          minWidth: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.volume)
          }
        },
        {
          title: '重量(吨)',
          key: 'weight',
          minWidth: 120,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.weight)
          }
        }
      ],

      leftExpandRow: null, // 左侧展开列
      leftSelection: [], // 左侧选中数据
      leftTableExpandData: [], // 左侧展开数据
      leftTableExpandLoading: false, // 左侧展开数据加载状态
      leftTableLoading: false, // 左侧表格加载

      rightExpandRow: null, // 右侧展开列
      rightSelectRow: null, // 右侧选中列
      rightSelection: [], // 右侧选中数据
      rightTableLoading: false, // 右侧表格加载
      rightTableExpandData: [], // 右侧展开数据
      rightTableExpandLoading: false // 右侧展开数据加载状态
    }
  },

  methods: {
    // 保证只有一行展开
    keepExpandOnly (row, side) {
      let data = this.leftTableData
      const rowStr = JSON.stringify(row)
      if (side === 'left') {
        data = this.leftTableData
        this.leftExpandRow = row
      } else {
        data = this.rightTableData
        this.rightExpandRow = row
      }
      data.forEach(item => {
        if (JSON.stringify(item) !== rowStr) item._expanded = false
        else item._expanded = true
      })
      row._expanded = true
    },
    keepLeftExpandOnly (row, status) {
      if (!status) {
        this.leftExpandRow = null
        this.leftSelection = []
        return
      }
      this.keepExpandOnly(row, 'left')
      this.fetchLeftExpandData()
    },
    keepRightExpandOnly (row, status) {
      if (!status) {
        this.rightExpandRow = null
        this.rightSelection = []
        const rowStr = JSON.stringify(row)
        this.rightTableData.forEach(item => {
          if (JSON.stringify(item) === rowStr) item._expanded = false
        })
        return
      }
      this.keepExpandOnly(row, 'right')
      this.fetchRightExpandData()
    },

    // 右侧表格列选中
    rightTableRowClick (row, index) {
      this.rightSelectRow = { row, index }
      this.rightTableData.forEach((item, i) => {
        if (i === index) item._highlight = true
        else item._highlight = false
      })
    },

    // 格式化城市
    cityFilter (code) {
      if (!code) return '-'
      return Array.from(new Set(City.codeToFullName(code, 3, '-').split('-'))).join('')
    },

    /** 数据操作 */

    // 为表格数据添加自定义字段及自定义过滤
    dataFilter (data, fields, extraRule) {
      return data.map(item => {
        if (fields instanceof Array) {
          fields.forEach(field => {
            item[field] = false
          })
        } else {
          item[fields] = false
        }
        if (extraRule) item = extraRule(item)
        return item
      })
    },

    // 查询左侧列表数据 10-提货 20-调度
    fetchLeftTableData (status) {
      this.leftTableLoading = true
      Server({
        url: '/dispatch/aggregation/order',
        method: 'get',
        data: { status }
      }).then(res => {
        this.leftTableData = this.dataFilter(res.data.data.orderList, '_expanded', item => {
          if (this.leftExpandRow && item.start === this.leftExpandRow.start && item.end === this.leftExpandRow.end) {
            item._expanded = true
            this.fetchLeftTableExpandData(status)
          }
          return item
        })
        this.leftTableLoading = false
      }).catch(err => {
        this.leftTableLoading = false
        this.leftTableData = []
        console.error(err)
      })
    },

    // 查询左侧列表展开数据 10-提货 20-调度
    fetchLeftTableExpandData (status) {
      this.leftTableExpandData = []
      this.leftTableExpandLoading = true
      Server({
        url: '/dispatch/assign/order/cargo/list',
        method: 'get',
        data: {
          status,
          start: this.leftExpandRow.start,
          end: this.leftExpandRow.end
        }
      }).then(res => {
        this.leftTableExpandData = this.dataFilter(res.data.data.orderList, '_checked', item => {
          if (this.leftSelection.indexOf(item.Id) > -1) item._checked = true
          return item
        })
        this.leftTableExpandLoading = false
      }).catch(err => {
        console.error(err)
        this.leftTableExpandLoading = false
        this.leftTableExpandData = []
      })
    },

    // 左侧订单移到右侧
    leftMoveToRight (url, data) {
      Server({
        url,
        method: 'post',
        data
      }).then(res => {
        this.leftSelection = []
        this.fetchData()
      }).catch(err => console.error(err))
    },

    // 右侧移到左侧
    rightMoveToLeft (url, data) {
      Server({
        url,
        method: 'post',
        data
      }).then(res => {
        this.rightSelection = []
        this.fetchData()
      }).catch(err => console.error(err))
    },

    // 表格内容渲染方法
    // 当text内容长度大于12时截取显示...并使用tooltip
    // 当text无内容时替换为-
    tableDataRender (h, text, overLength = 12) {
      text = text.toString()
      let showText = text.length > overLength ? text.substr(0, overLength) + '...' : text
      showText = showText || '-'
      if (text.length <= overLength) {
        return h('span', showText)
      } else {
        return h('Tooltip', {
          props: {
            placement: 'top',
            content: text
          }
        }, showText)
      }
    }
  }
}
