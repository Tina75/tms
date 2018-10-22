/**
 * 调度工作台公有方法
 * @Author: xuliang
 */

import _ from 'lodash'
import Server from '@/libs/js/server'
import City from '@/libs/js/city'
import tableExpand from '../dispatch/tableExpand'

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
          minWidth: 135,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.start), 9)
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
          minWidth: 135,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.end), 9)
          }
        },
        {
          title: '订单数',
          key: 'ordreNum',
          width: 60,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.ordreNum)
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          width: 65,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.volume)
          }
        },
        {
          title: '重量(吨)',
          key: 'weight',
          width: 65,
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
          width: 180,
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
          width: 180,
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
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.consignerName)
          }
        },
        {
          title: '始发地',
          key: 'start',
          width: 180,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          width: 180,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFilter(p.row.end))
          }
        },
        {
          title: '体积(方)',
          key: 'volume',
          width: 100,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.volume)
          }
        },
        {
          title: '重量(吨)',
          key: 'weight',
          width: 100,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.weight)
          }
        }
      ],

      leftExpandRow: null, // 左侧当前展开列
      leftSelection: [], // 左侧当前选中数据
      leftTableLoading: false, // 左侧表格加载状态
      leftTableExpandData: [], // 左侧当前展开的表格数据
      leftTableExpandLoading: false, // 左侧展开表格加载状态

      rightExpandRow: null, // 右侧当前展开列
      rightSelectRow: null, // 右侧当前选中列
      rightSelection: [], // 右侧当前选中数据
      rightTableLoading: false, // 右侧表格加载
      rightTableExpandData: [], // 右侧当前展开的表格数据
      rightTableExpandLoading: false // 右侧展开表格加载状态
    }
  },

  methods: {
    /** 表格操作 */

    /**
     * 保证只有一行展开
     * @param {Object} row 当前操作的行
     * @param {String} side 左侧或右侧
     */
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
        if (JSON.stringify(item) !== rowStr) item._expanded = item._highlight = false
        else item._expanded = item._highlight = true
      })
    },
    // 保证左侧只有一行展开
    keepLeftExpandOnly (row, expand) {
      if (expand) { // 如果当前展开则收起，并且不进入下一步
        this.leftExpandRow = null
        this.leftSelection = []
        this.leftTableData.forEach(item => {
          item._expanded = item._highlight = false
        })
        return
      }
      this.keepExpandOnly(row, 'left')
      this.fetchLeftExpandData()
    },
    // 保证右侧只有一行展开
    keepRightExpandOnly (row, expand) {
      if (expand) { // 如果当前展开则收起，并且不进入下一步
        this.rightExpandRow = null
        this.rightSelection = []
        this.rightTableData.forEach(item => {
          item._expanded = item._highlight = false
        })
        return
      }
      this.keepExpandOnly(row, 'right')
      this.fetchRightExpandData()
    },

    // 右侧表格列选中高亮并展开
    rightTableRowClick (row, index) {
      this.rightSelectRow = row._expanded ? null : { row, index }
      this.keepRightExpandOnly(row, row._expanded)
    },
    // 左侧表格列选中高亮并展开
    leftTableRowClick (row) {
      this.keepLeftExpandOnly(row, row._expanded)
    },

    /** 数据操作 */

    /**
     * 为表格数据添加自定义字段及自定义过滤，自定义字段的值为 false
     * @param {Array[Object]} data 待处理的数据
     * @param {Array[String] | String} fields 需要添加到数据项上的字段名称，值为 false
     * @param {Function} extraRule 额外的添加规则，参数为当前的数据项，需要返回该数据项
     */
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

    // 右侧展开表格新增项添加高亮标志字段
    heightLightNewRow (newList) {
      if (!this.rightTableExpandData.length) return newList
      const oldList = this.rightTableExpandData.map(item => item.orderId)
      newList.map(item => {
        if (oldList.indexOf(item.orderId) === -1) item.isNew = true
        else item.isNew = false
        return item
      })
      newList.sort((a) => a.isNew ? -1 : 0)
      return newList
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
      }).then(() => {
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
      }).then(() => {
        this.rightSelection = []
        this.fetchData()
      }).catch(err => console.error(err))
    },

    // 格式化城市
    cityFilter (code) {
      if (!code) return '-'
      return _.uniq(City.codeToFullNameArr(code, 3)).join('')
    },

    /**
     * 表格内容渲染方法
     * 当text内容长度大于12时截取显示...并使用tooltip
     * 当text无内容时替换为-
     * @param {Function} h 渲染方法
     * @param {String} text 文本内容
     * @param {Number} overLength 文本内容截取长度，默认12
     */
    tableDataRender (h, text, overLength = 12) {
      text = text.toString()
      let showText = text.length > overLength ? text.substr(0, overLength) + '...' : text
      showText = showText || '-'
      const style = {
        marginRight: '-18px'
      }
      if (text.length <= overLength) {
        return h('span', { style }, showText)
      } else {
        return h('Tooltip', {
          props: {
            placement: 'top',
            content: text
          },
          style
        }, showText)
      }
    }
  }
}
