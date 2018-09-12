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
    <Drawer v-model="visible" :closable="false" title="选择显示字段" placement="right">
      <CheckboxGroup>
        <Checkbox v-for="item in columns" :key="item.key" :label="item.title" class="page-table__checkbox-list"></Checkbox>
      </CheckboxGroup>
      <div class="page-table__drawer-footer">
        <Button @click="hideSlider">取消</Button>
        <Button type="primary" @click="hideSlider">确定</Button>
      </div>
    </Drawer>
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
/**
   * iview的table和page的组件是分开的
   * 其实实际的场景中，大多数页面都是需要结合table和page，
   * 以及包含自动发请求，管理数据的table
  */
export default {
  props: {
    // 请求的地址
    url: String,
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
    // 表数据,可能需要自己做分页
    data: {
      type: Array,
      default: () => [],
      required: true
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
    onPageSizeChange: Function
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
      const _this = this
      if (_this.showFilter) {
        return this.columns.concat({
          title: 'icon',
          width: 48,
          renderHeader (h, params) {
            return h('Icon', {

              props: {
                type: 'ios-list'
              },
              class: 'ios-list-icon',
              on: {
                // 点击图标，弹出筛选列的框
                click: _this.showSlider
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
    keywords () {
      this.pagination.pageNo = 1
      this.fetch()
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
        method: 'get',
        url: this.url,
        data: {
          ...this.pagination,
          ...this.keywords
        }
      })
        .then((response) => {
          vm.loading = false
          // const { list, ...pagination } = response.data
          vm.dataSource = response.data[vm.listField]
          if (this.showPagination) {
            vm.pagination.totalCount = response.data.total || response.data.totalCount
          }
        })
        .catch((errorInfo) => {
          vm.loading = false
          vm.$Message.error(errorInfo.msg)
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
  &__checkbox-list{
    display: block
    margin: 8px 0
  }
  &__drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    .ivu-btn:first-child{
      margin-right: 8px
    }
  }
  .ios-list-icon {
    font-size: 18px;
    cursor: pointer;

    &:hover {
      color: #2d8cf0;
    }
  }
}
</style>
