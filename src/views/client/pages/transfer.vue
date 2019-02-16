<template>
  <div>
    <div class="header">
      <div class="left">
        <Button v-if="hasPower(130301)" type="primary" @click="modaladd">新增</Button>
      </div>
      <div class="right">
        <template>
          <Select v-model="selectStatus" style="width:120px;margin-right: 11px" transfer @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input  v-model="keyword" :maxlength="20"
                :placeholder="selectStatus === 1 ? '请输入外转方名称' : '请输入负责人名称'"
                :icon="keyword? 'ios-close-circle' : ''"
                class="search-input"
                @on-enter="searchList"
                @on-click="clearKeywords()"/>
        <Button icon="ios-search" type="primary"
                class="search-btn-easy"
                @click="searchList"></Button>
      </div>
    </div>
    <page-table
      :keywords="queryWords"
      :method="method"
      :url="url"
      :columns="columns1"
      list-field="list"
      @on-sort-change = "timeSort"
    ></page-table>
  </div>
</template>

<script>
import PageTable from '@/components/page-table'
import { transfereeDelete, CODE } from './client'
import BasePage from '@/basic/BasePage'
export default {
  name: 'transfer',
  components: {
    PageTable
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '外转方列表'
  },
  data () {
    return {
      url: '/transferee/list',
      method: 'GET',
      queryWords: {
        type: 1
      },
      selectStatus: 1,
      selectList: [
        {
          value: 1,
          label: '外转方名称'
        },
        {
          value: 2,
          label: '负责人'
        }
      ],
      keyword: undefined,
      order: null,
      columns1: [
        {
          title: '操作',
          key: 'id',
          width: 100,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130302)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let _this = this
                    this.openDialog({
                      name: 'client/dialog/transfer',
                      data: {
                        title: '修改外转方',
                        flag: 2, // 编辑
                        id: params.row.id,
                        validate: {
                          name: params.row.name,
                          contact: params.row.contact,
                          phone: params.row.phone,
                          payType: params.row.payType + '',
                          remark: params.row.remark,
                          companyAddress: params.row.companyAddress,
                          longitude: params.row.longitude,
                          latitude: params.row.latitude,
                          mapType: params.row.mapType
                        }
                      },
                      methods: {
                        ok () {
                          _this.searchList() // 刷新页面
                        }
                      }
                    })
                    // this.modalupdate = true
                  }
                }
              }, '修改'))
            }
            if (this.hasPower(130303)) {
              renderBtn.push(h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let _this = this
                    this.openDialog({
                      name: 'client/dialog/confirmDelete',
                      data: {
                      },
                      methods: {
                        ok () {
                          transfereeDelete({
                            transfereeId: params.row.id
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this.searchList() // 刷新页面
                            } else {
                              _this.$Message.error(res.data.msg)
                            }
                          })
                        }
                      }
                    })
                  }
                }
              }, '删除'))
            }
            return h('div', renderBtn)
          }
        },
        {
          title: '外转方名称',
          key: 'name',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '负责人',
          key: 'contact',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '联系号码',
          key: 'phone'
        },
        {
          title: '结算方式',
          key: 'payType',
          render: (h, params) => {
            let text = ''
            if (params.row.payType === 1) {
              text = '现付'
            } else if (params.row.payType === 2) {
              text = '到付'
            } else if (params.row.payType === 3) {
              text = '回单付'
            } else if (params.row.payType === 4) {
              text = '月结'
            } else {
              text = '-'
            }
            return h('div', {}, text)
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: 'custom',
          width: 150,
          render: (h, params) => {
            let text = this.formatDate(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true,
          tooltip: true,
          render (h, params) {
            let text = ''
            if (params.row.remark === '' || params.row.remark === null) {
              text = '-'
            } else {
              text = params.row.remark.length > 12 ? params.row.remark.slice(0, 12) + '...' : params.row.remark
            }
            // return h('Tooltip', {content: '1525'}, text)
            return h('div', [
              h('Tooltip', {
                props: {
                  placeholder: 'bottom',
                  transfer: true
                }
              }, [
                text,
                h('div', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal'
                  }
                }, params.row.remark)
              ])
            ])
          }
        }
      ]
    }
  },
  methods: {
    searchList () {
      this.queryWords = {
        type: this.selectStatus,
        keyword: this.keyword,
        order: this.order
      }
    },
    clearKeywords () {
      this.keyword = ''
      this.searchList()
    },
    changeState () {
      this.keyword = ''
    },
    modaladd () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/transfer',
        data: {
          title: '新增外转方',
          flag: 1 // 新增
        },
        methods: {
          ok () {
            _this.searchList() // 刷新页面
          }
        }
      })
    },
    handleChangePage (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo = pageNo
      this.searchList()
    },
    handleChangePageSize (pageSize) {
      this.pageSize = pageSize
      this.searchList()
    },
    timeSort (column) {
      let str = ''
      if (column.key === 'createTime') { // 为之后预留更新时间排序
        str += 'create_time,'
      } else {
        str += 'update_time,,'
      }
      if (column.order === 'asc') {
        str += 'asc'
      } else if (column.order === 'desc') {
        str += 'desc'
      } else {
        str = null
      }
      this.order = str
      this.searchList()
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "client.styl"
</style>
