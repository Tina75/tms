<template>
  <div class="page-table">
    <Table
      ref="table"
      :width="width"
      :height="height"
      :data="dataList"
      :columns="filterColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :loading="loading"
      :highlight-row="highlightRow"
      :size="size"
      :no-data-text="noDataText"
      @on-current-change="handleCurrentChange"
      @on-select="handleSelect"
      @on-select-all="handleSelectAll"
      @on-select-cancel="handleSelectCancel"
      @on-selection-change="handleSelectionChange"
      @on-sort-change="handleSortChange"
      @on-filter-change="handleFilterChange"
      @on-row-click="handleRowClick"
      @on-row-dbclick="handleRowDbclick"
      @on-expand="handleExpand">
      <div v-if="showSlotFooter" slot="footer">
        <slot name="footer"></slot>
      </div>
      <div v-if="showSlotHeader" slot="header">
        <slot name="header"></slot>
      </div>
    </Table>
    <div v-if="showPagination" class="page-table__footer-pagination">
      <div class="page-table__footer-pagination-fr">
        <Page
          :total="pagination.totalCount"
          :current="pagination.pageNo"
          :page-size="pagination.pageSize"
          :page-size-opts="[10,20,50]"
          size="small"
          show-sizer
          show-elevator
          show-total
          @on-change="handleChangePage"
          @on-page-size-change="handlePageSizeChange"></Page>
      </div>
    </div>
  </div>

</template>

<script>
import server from '@/libs/js/server'
import SliderIcon from './SliderIcon.vue'
import _ from 'lodash'
/**
   * iview的table和page的组件是分开的
   * 其实实际的场景中，大多数页面都是需要结合table和page，
   * 以及包含自动发请求，管理数据的table
   * 本组件大多数接口和iview table保持一致
   * 新增props如下：
   * 1.url，会根据此url主动发请求，不传此字段，默认本地数据，需要传data属性
   * 2.keywrods， 传入url时生效，会根据keywords改变，主动发请求
   * 3.listField ，部分接口传回的列表字段标识不够统一，如果遇到特殊的名称如：orderlist，billList,请传入此字段
   * 4.showFilter，订单相关表列的字段过多，此时需要支持自主扩展隐藏、显示、排序列等功能
   * 5.extraColumns，showFilter为true时，此字段必传，代表需要操作隐藏显示和排序的字段列表，
   *    格式：{
   *          title:'订单号',// 名称
   *          key:'orderNo',// 标识符
   *          visible:true, //是否显示或隐藏
   *          fixed:true, // 固定列，不参与排序和隐藏显示
   *    }
   * 6.onColumnChange 函数，当显示隐藏排序排序发生变化时候回调，参数返回新的extraColumns
  */
export default {
  components: {
    SliderIcon
  },
  props: {
    // 请求的地址
    url: String,
    // 部分接口查询方法可能是post
    method: {
      type: String,
      validator (value) {
        return ['post', 'get', 'delete', 'put'].indexOf(value.toLowerCase()) > -1
      },
      default: 'get'
    },
    // 读取列表的字段，有的名叫orderList, 有的叫billList
    listField: {
      type: String,
      default: 'list'
    },
    // 搜索关键字
    keywords: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    // 显示筛选列
    showFilter: {
      type: Boolean,
      default: false
    },
    // 列
    columns: {
      type: Array,
      default: () => [],
      required: true
    },
    // 显示或隐藏的属性
    extraColumns: {
      type: Array,
      default: () => []
    },
    // 表数据,可能需要自己做分页
    data: {
      type: Array,
      default: () => []
    },
    noDataText: {
      type: String,
      default: '暂无数据'
    },
    // 斑马纹
    stripe: {
      type: Boolean,
      default: false
    },
    // 显示表头
    showHeader: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      validator (value) {
        return ['small', 'large', 'default'].indexOf(value) > -1
      },
      default: 'default'
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true
    },
    onLoad: Function, // 每次请求后，回调，返回列表搜索结果
    onCurrentChange: Function,
    onSelect: Function,
    onSelectCancel: Function,
    onSelectAll: Function,
    onSelectionChange: Function,
    onSortChange: Function,
    onFilterChange: Function,
    onRowClick: Function,
    onRowDbclick: Function,
    onExpand: Function,
    onChange: Function,
    onPageSizeChange: Function,
    onColumnChange: Function
  },
  data () {
    return {
      isRemote: false,
      // 请求时候的加载状态
      loading: false,
      pagination: {
        pageSize: 10,
        pageNo: 1,
        totalCount: 0
      },
      showSlotHeader: false,
      showSlotFooter: false,
      // 源数据
      dataSource: [],
      visible: false
    }
  },
  computed: {
    // 根据显示|隐藏列选择框
    filterColumns () {
      const vm = this
      if (vm.showFilter) {
        const columnGroup = _.groupBy(vm.extraColumns, (cl) => cl.key)
        const fixedCols = []
        const normalCols = []
        vm.columns
          .filter(col => {
            if (vm.extraColumns.length > 0 && col.key && !col.extra) {
              return columnGroup[col.key][0].visible
            }
            return true
          })
          .forEach((col) => {
            if (!col.key || col.extra) {
              fixedCols.push(col)
            } else {
              normalCols.push(col)
            }
          })

        return fixedCols.concat(
          _.sortBy(normalCols, (col) => columnGroup[col.key] ? columnGroup[col.key][0].sort : 0)
        ).concat({
          title: 'icon',
          width: 48,
          renderHeader (h, params) {
            return h(SliderIcon, {
              props: {
                list: vm.extraColumns
              },
              on: {
                'on-change': (columns) => {
                  vm.$emit('on-column-change', columns)
                  // vm.extraColumns = columns
                }
              }
            })
          },
          key: 'filter-columns'
        })
      } else {
        return this.columns
      }
    },
    dataList () {
      if (this.isRemote) {
        return this.dataSource
      } else {
        const { pageSize, pageNo } = this.pagination
        return this.dataSource.slice((pageNo - 1) * pageSize, pageNo * pageSize)
      }
    }
  },
  watch: {
    // 搜索关键字变化后,重置分页参数，重新发送请求
    keywords: {
      handler () {
        this.pagination.pageNo = 1
        this.fetch()
      },
      deep: true
    },
    data (newData) {
      // this.dataSource = newData.slice()
      this.setLocalDataSource(newData)
    }
  },
  created () {
    this.isRemote = !!this.url
    this.showSlotFooter = this.$slots.footer !== undefined
    this.showSlotHeader = this.$slots.header !== undefined
  },
  mounted () {
    if (!this.isRemote) {
      this.setLocalDataSource(this.data)
    }
    this.fetch()
  },
  methods: {

    setLocalDataSource (data) {
      this.dataSource = this.data.slice()
      this.pagination.totalCount = this.data.length
    },
    // 全选
    selectAll () {
      this.refs.table.selectAll(true)
    },
    // 全不选
    unSelectAll () {
      this.refs.table.selectAll(false)
    },
    showSlider () {
      this.visible = true
    },
    hideSlider () {
      this.visible = false
    },
    // 请求后端地址
    fetch () {
      const vm = this
      if (!this.isRemote) {
        return
      }
      // 发送请求，填充data
      this.loading = true
      server({
        method: this.method,
        url: this.url,
        data: {
          ...this.pagination,
          ...this.keywords
        }
      })
        .then((response) => {
          vm.loading = false
          // const { list, ...pagination } = response.data
          vm.dataSource = response.data.data[vm.listField]
          if (this.showPagination) {
            vm.pagination.totalCount = response.data.pageTotals || response.data.totalCount
          }
          vm.$emit('on-load', response)
        })
        .catch((errorInfo) => {
          vm.loading = false
          // vm.$Message.error(errorInfo.msg)
          vm.$emit('on-load', errorInfo)
        })
    },
    /**
     * 开启highlight-row后，当前 选中行变化后回调
     * @param {object} currentRow
     * @param {object} oldCurrentRow
     */
    handleCurrentChange (curretRow, oldCurrentRow) {
      this.$emit('on-current-change', curretRow, oldCurrentRow)
    },
    /**
     * 选中一项后回调
     * @param {array} selection 已选择的数据集合
     * @param {object} row 选中的行
     */
    handleSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    /**
     * 取消选中一项后回调
     * @param {array} selection
     * @param {object} row 未选中的行
     */
    handleSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    /**
     * 选中所有
     * @param {array} selection
     */
    handleSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    /**
     * 选中项发送变化后回调
     * @param {array} selection
     */
    handleSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    /**
     * 排序时候有效，排序时回调
     * @param {object} column 当前列数据
     * @param {string} key 列名称,对应columns的key
     * @param {string} order ,值：asc|desc
     */
    handleSortChange (sorter) {
      this.$emit('on-sort-change', sorter)
    },
    /**
     * 筛选回调
     * @param {object} column 当前列数据
     */
    handleFilterChange (column) {
      this.$emit('on-filter-change')
    },
    /**
     * 单击行
     * @param {object} row
     * @param {number} index
     */
    handleRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    /**
     * 双击行
     * @param {object} row
     * @param {number} index
     */
    handleRowDbclick (row, index) {
      this.$emit('on-row-dbclick', row, index)
    },
    /**
     * 展开或收起行时回调
     * @param {object} row 行数据
     * @param {boolean} status 展开或收起
     */
    handleExpand (row, status) {
      this.$emit('handleExpand', row, status)
    },
    // 页码变动
    handleChangePage (pageNo) {
      // 重新组装数据，生成查询参数
      this.pagination.pageNo = pageNo
      this.fetch()
      this.$emit('on-change', pageNo)
    },
    // pagesize变化
    handlePageSizeChange (pageSize) {
      // 重新组装数据，生成查询参数
      this.pagination.pageNo = 1
      this.pagination.pageSize = pageSize
      this.fetch()
      this.$emit('on-page-size-change', pageSize)
    }
  }
}
</script>

<style lang="stylus">
.page-table {
  position: relative;
  margin-top: 0px
  &__footer-pagination {
    margin: 10px;
    overflow: hidden;
    &-fr {
      float: right;
    }
  }
}
</style>
