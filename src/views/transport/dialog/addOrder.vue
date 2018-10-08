<template>
  <Modal v-model="visibale" :mask-closable="true" width="1036" @on-visible-change="close">
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
      <Button  type="default" @click.native="visibale = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import TransportBase from '../transportBase'

export default {
  name: 'AddOrder',
  mixins: [ BaseDialog, TransportBase ],
  data () {
    return {
      visibale: true,
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
          title: '客户订单号',
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
            return this.tableDataRender(h, this.cityFormatter(p.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          ellipsis: true,
          minWidth: 180,
          render: (h, p) => {
            return this.tableDataRender(h, this.cityFormatter(p.row.end))
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
      selection: [[]]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
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
        this.data = res.data.data.list.map(item => {
          const selected = this.selection[this.pageNo - 1]
          item._checked = false
          if (selected.indexOf(item.id) > -1) item._checked = true
          if (this.billHasSelected.indexOf(item.id) > -1) item._checked = true
          return item
        })
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.error(err)
      })
    },

    selectionChange (selection) {
      const temp = selection.map(item => item.id)
      this.selection.splice(this.pageNo - 1, 1, temp)
    },

    handleChangePage (page) {
      this.pageNo = page
      if (page > this.selection.length) this.selection.push([])
      this.fetchData()
    },

    handlePageSizeChange (size) {
      this.pageNo = 1
      this.pageSize = size
      this.fetchData()
    },

    getAllSelection () {
      let all = []
      this.selection.map(arr => {
        all = all.concat(arr)
      })
      return all
    },

    ok () {
      this.confirm(this.getAllSelection())
      this.close()
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
