<template>
  <div class="page-table">
    <div class="page-table__wrapper">
      <SliderIcon
        v-if="showFilter"
        :list="extraColumns"
        class="page-table__sliderIcon"
        @on-change="customTableColumns">
      </SliderIcon>
      <Table
        ref="table"
        :width="width"
        :height="height"
        :data="dataList"
        :columns="mapColumns"
        :stripe="stripe"
        :border="border"
        :show-header="showHeader"
        :loading="loading"
        :highlight-row="highlightRow"
        :size="size"
        :no-data-text="noDataText"
        :row-class-name="rowClass"
        :table-head-type="tableHeadType"
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
        <div slot="loading">
          <Spin>
            <img src="../../assets/loading.gif" width="24" height="24" alt="加载中">
          </Spin>
        </div>
        <div v-if="showSlotHeader" slot="header">
          <slot name="header"></slot>
        </div>
      </Table>
    </div>
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
          class="page-table__pagination-bar"
          @on-change="handleChangePage"
          @on-page-size-change="handlePageSizeChange"
        ></Page>
      </div>
    </div>
  </div>

</template>

<script>
import server from '@/libs/js/server'
import SliderIcon from './SliderIcon.vue'
import { mapMutations } from 'vuex'
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
  * 7.rowId data数据的关键字编号，与下面的selected配合使用
  * 8.autoload 默认发送请求加载数据，设置成false，则不发送请求，根据关键字请求
  * 9.onCancelAll 取消选中所有的时候调用，返回selection
  * 10. onLoad 请求完接口后回调函数，返回值是请求结果
  */
export default {
  components: {
    SliderIcon
  },
  props: {
    // 第一次加载，默认发送请求
    autoload: {
      type: Boolean,
      default: true
    },
    // 数据里唯一的编号字段，默认id
    rowId: {
      type: String,
      default: 'id'
    },
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
    // extraColumns: {
    //   type: Array,
    //   default: () => []
    // },
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
    // 是否显示checBox
    rowSelection: {
      type: Object,
      default: Object
    },
    // 表单类型
    tableHeadType: '',
    onLoad: Function, // 每次请求后，回调，返回列表搜索结果
    onCurrentChange: Function,
    onSelect: Function,
    onSelectCancel: Function,
    onSelectAll: Function,
    onCancelAll: Function,
    onSelectionChange: Function,
    onSortChange: Function,
    onFilterChange: Function,
    onRowClick: Function,
    rowClassName: Function,
    onRowDbclick: Function,
    onExpand: Function,
    onChange: Function,
    onPageSizeChange: Function,
    onColumnChange: Function
  },
  data () {
    return {
      // 显示或隐藏的属性
      extraColumns: [],
      isRemote: false,
      // 请求时候的加载状态
      loading: false,
      selectedRow: [],
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
        // vm.extraColumns = vm.reconfigTableHeader('', vm.tableHeadType, 'change')
        const columnGroup = _.groupBy(vm.extraColumns, (cl) => cl.key)
        const fixedCols = []
        const normalCols = []
        vm.columns
          .filter(col => {
            if (vm.extraColumns.length > 0 && col.key && !col.extra) {
              let group = columnGroup[col.key][0]
              // title字段以接口返回为准
              col.title = group.title
              return group.visible
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
        )
      } else {
        return this.columns
      }
    },
    /**
     * 1. 替换空字符
     * 2. 控制checkbox
     */
    mapColumns () {
      return this.filterColumns.map((col) => {
        // 空字符串一律使用中划线【-】代替
        if (col.key && !col.render && !col.tooltip) {
          col.render = (h, params) => {
            let value = params.row[col.key]
            return h('span', !_.isNull(value) && !_.isUndefined(value) && params.row[col.key] !== '' ? params.row[col.key] : '-')
          }
        }
        return col
      })
    },
    // 是否是复选框表格
    isSelection () {
      return this.columns.length > 0 && this.columns[0].type === 'selection'
    },
    selected () {
      return this.selectedRow.map(item => item[this.rowId])
    },
    /**
     * 1.如果使用本地数据，分页自己拆分
     * 2.如果使用远程服务数据，由原服务端数据
     */
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
        // 关键字变化，重置清空选中项
        this.clearSelected()
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
  destroyed () {
    this.selectedRow = []
  },
  created () {
    this.isRemote = !!this.url
    this.showSlotFooter = this.$slots.footer !== undefined
    this.showSlotHeader = this.$slots.header !== undefined
  },
  mounted () {
    this.extraColumns = this.reconfigTableHeader('', this.tableHeadType, 'change')
    if (!this.isRemote) {
      this.setLocalDataSource(this.data)
    }
    if (this.autoload) {
      this.fetch()
    }
  },
  methods: {
    ...mapMutations(['updateTableColumns']),
    /**
     * 自定义table表头数据对接（页面-接口）
     * pageHeadData,interfaceHeadData 接口与页面Data规整
     * type 初始化页面传入SliderIcon组件
     */
    reconfigTableHeader (pageHeadData, interfaceHeadData, type) {
      let pageHeadDataInit = []
      if (type && this.$store.getters.TableColumns[interfaceHeadData]) {
        this.$store.getters.TableColumns[interfaceHeadData].forEach(e => {
          let headRow = {}
          headRow.key = e.k
          headRow.visible = e.v
          headRow.sort = e.s
          headRow.title = e.t
          headRow.fixed = e.f
          pageHeadDataInit.push(headRow)
        })
        return pageHeadDataInit
      } else {
        if (this.$store.getters.TableColumns[interfaceHeadData]) {
          this.$store.commit('updateTableColumns', { list: pageHeadData, type: interfaceHeadData })
          return JSON.stringify(this.$store.getters.TableColumns[interfaceHeadData])
        }
      }
    },
    /**
     * 复选框选中后，背景高亮
     */
    rowClass (row, index) {
      let classes = []
      if (this.rowClassName && typeof this.rowClassName === 'function') {
        classes.push(this.rowClassName(row, index))
      }
      if (this.isSelection) {
        if (this.selected.includes(row[this.rowId])) {
          classes.push('ivu-table-row-highlight')
        }
        if (row._visible !== undefined && !row._visible) {
          classes.push('ivu-table-row-hidden')
        }
      }
      return classes.join(' ')
    },
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
          const { data } = response.data
          if (vm.isSelection) {
            // 当有复选框场景的时候，需要主动勾选上
            vm.dataSource = (data[vm.listField] || []).map((item) => {
              if (vm.rowSelection.isVisible && typeof vm.rowSelection.isVisible === 'function') {
                let visible = this.rowSelection.isVisible(item)
                if (!visible) {
                  item._disabled = true
                  item._visible = visible
                }
              } else if (vm.rowSelection.isDisabled && typeof vm.rowSelection.isDisabled === 'function') {
                let disabled = vm.rowSelection.isDisabled(item)
                if (disabled) {
                  item._disabled = true
                }
              }
              if (vm.selected.includes(item[vm.rowId])) {
                item._checked = true
              }
              return item
            })
          } else {
            vm.dataSource = data[vm.listField] || []
          }
          if (vm.showPagination) {
            vm.pagination.pageSize = data.pageSize || 10
            vm.pagination.totalCount = data.totalCount || data.pageTotals
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
      this.selectedRow.push(row)
      this.$emit('on-select', this.selectedRow, row)
    },
    /**
     * 取消选中一项后回调
     * @param {array} selection
     * @param {object} row 未选中的行
     */
    handleSelectCancel (selection, row) {
      const rowId = this.rowId
      this.selectedRow = this.selectedRow.filter(item => item[rowId] !== row[rowId])
      this.$emit('on-select-cancel', this.selectedRow, row)
    },
    /**
     * 选中所有
     * @param {array} selection
     */
    handleSelectAll (selection) {
      this.selectedRow = _.unionBy(this.selectedRow, selection, this.rowId)
      this.$emit('on-select-all', this.selectedRow)
    },
    /**
     * 选中项发送变化后回调
     * @param {array} selection
     */
    handleSelectionChange (selection) {
      const vm = this
      if (selection.length === 0) {
        // 这里只处理全取消的场景
        if (this.selectedRow.length === this.pagination.pageSize) {
          // 如果选中的行正好和分页参数一致，说明只有当前页被选中了，直接清空数组
          this.selectedRow = []
        } else {
          let dataIds = this.dataSource.map((item) => {
            return item[vm.rowId]
          })
          this.selectedRow = this.selectedRow.filter((data) => {
            return !dataIds.includes(data[vm.rowId])
          })
          dataIds = []
        }
        // 取消全部，通知回调
        this.$emit('on-cancel-all', this.selectedRow)
      }
      this.$emit('on-selection-change', this.selectedRow)
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
      if (!pageSize) {
        return
      }
      // 重新组装数据，生成查询参数
      this.pagination.pageNo = 1
      this.pagination.pageSize = pageSize
      this.fetch()
      this.$emit('on-page-size-change', pageSize)
    },
    /**
     * 清空复选框选择的行数据
     */
    clearSelected () {
      this.selectedRow = []
    },
    /**
     * 更改表单列表
     */
    customTableColumns (columns) {
      // this.$emit('on-column-change', columns)
      // 保存自定义列表
      let params = {}
      params.bizCode = this.tableHeadType
      params.propertiyList = this.reconfigTableHeader(columns, this.tableHeadType)
      this.extraColumns = columns
      server({
        url: '/gridHead/save',
        method: 'post',
        data: params
      }).then(({ data }) => {
      })
    }
  }
}
</script>

<style lang="stylus">
.page-table
  margin-top: 0px
  &__wrapper
    position: relative
  &__sliderIcon
    position: absolute
    background: #f8f8f9
    z-index: 2;
    right: 0px;
    width: 50px;
    text-align: center;
    height: 39px;
    line-height: 39px;
    top: 1px;
    box-shadow: -1px 0px 4px 0px #cfcfcf;
  &__footer-pagination
    margin: 10px;
    overflow: hidden;
    &-fr
      float: right;
  &__pagination-bar
    .ivu-page-item-active
      background-color: #00A4BD
      border-radius:4px
      a
        color: #fff
.ivu-table-row-gray
  td
    background-color #f8f8f9
.ivu-table
  .ivu-table-row-highlight
    td
      background-color #ebf7ff
  .ivu-table-row-hidden
    .ivu-checkbox
      display none
</style>
