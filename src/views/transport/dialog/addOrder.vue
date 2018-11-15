<template>
  <Modal v-model="visiable" :mask-closable="false" width="1036" @on-visible-change="close">
    <p slot="header" style="text-align:center">添加订单</p>

    <Table :columns="columns"
           :data="data"
           :loading="loading"
           @on-selection-change="selectionChange"></Table>
    <div style="text-align: right; margin-top: 10px;">
      <Page v-if="totalCount > 10"
            :total="totalCount"
            :current="pageNo"
            :page-size="pageSize"
            :page-size-opts="[10,20,50]"
            size="small"
            show-sizer
            show-elevator
            show-total
            @on-change="handleChangePage"
            @on-page-size-change="handlePageSizeChange"></Page>
    </div>

    <div slot="footer" style="text-align: center;">
      <Button  type="primary" @click="ok">确定</Button>
      <Button  type="default" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>

/**
 * 运动详情与提货单详情编辑页面添加订单
 */

import Server from '@/libs/js/server'
import _ from 'lodash'
import BaseDialog from '@/basic/BaseDialog'
import TransportBase from '../mixin/transportBase'

export default {
  name: 'AddOrder',
  mixins: [ BaseDialog, TransportBase ],
  data () {
    return {
      loading: false,
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      columns: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '订单号',
          key: 'orderNo',
          width: 180
        },
        {
          title: '客户单号',
          key: 'customerOrderNo',
          width: 180,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.customerOrderNo, true)
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
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.startName)
          }
        },
        {
          title: '目的地',
          key: 'end',
          ellipsis: true,
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, p.row.endName)
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
      data: [],
      selection: [[]], // 已经选择过的项，翻页后需要记住之前页面已选择的项
      flattenSelection: [] // 将 selection 转为一维后的数组，防止当 page size 改变后出现问题
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 查询数据
    fetchData () {
      this.loading = true
      Server({
        url: '/order/list',
        method: 'post',
        data: {
          isDispatch: 1,
          status: this.type === 'freight' ? 20 : 10,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.totalCount = res.data.data.totalCount
        // 获取到的数据如果是之前已选择的，则显示已选择
        // 已选择的数据有当前对话框选择的数据 selection，也有已经添加到运单/提货单中的数据
        this.data = res.data.data.list.map(item => {
          item._checked = false // 为数据项添加选择字段
          if (this.flattenSelection.indexOf(item.id) > -1) item._checked = true // 判断当前是否已选
          if (this.billHasSelected.indexOf(item.id) > -1) item._checked = true // 判读是否已添加到运单/提货单
          return item
        })
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.error(err)
      })
    },

    // 翻页时，根据当前页向 selection 中添加用来存储当前页已选中数据的数组
    handleChangePage (page) {
      this.pageNo = page
      if (page > this.selection.length) this.selection.push([])
      this.fetchData()
    },

    // 已选项改变时，修改 selection 中当前页对应的数组内容
    selectionChange (selection) {
      const temp = selection.map(item => item.id)
      this.selection.splice(this.pageNo - 1, 1, temp)
      this.flattenSelection = _.uniq(_.flatten(this.selection))
    },

    // page size 改变
    handlePageSizeChange (size) {
      this.pageNo = 1
      this.pageSize = size
      this.fetchData()
    },

    // 添加完成，并将添加的订单返回给上级页面
    ok () {
      this.confirm(this.flattenSelection)
      this.close()
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
