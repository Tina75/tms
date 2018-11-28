<template>
  <div>
    <div class="header">
      <div class="left">
        <Button v-if="hasPower(130101)" type="primary"  @click="modaladd">新增</Button>
      </div>
      <div class="right">
        <template>
          <Select v-model="selectStatus" transfer style="width:120px;margin-right: 11px" @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <template v-if="selectStatus==0">
          <Input v-model="name" :maxlength="20"
                 :icon="name? 'ios-close-circle' : ''"
                 class="search-input"
                 placeholder="请输入发货方名称"
                 @on-enter="searchList"
                 @on-click="clearKeywords()"/>
        </template>
        <template v-else>
          <Input v-model="contact" :maxlength="15"
                 :icon="contact? 'ios-close-circle' : ''"
                 class="search-input"
                 placeholder="请输入发货方联系人"
                 @on-enter="searchList"
                 @on-click="clearKeywords"/>
        </template>
        <Button icon="ios-search" type="primary"
                class="search-btn-easy"
                @click="searchList"></Button>
      </div>
    </div>
    <page-table
      :keywords="keyword"
      :method="method"
      :url="url"
      :columns="columns1"
      @on-sort-change = "timeSort"
    ></page-table>
  </div>
</template>
<script>
import PageTable from '@/components/page-table'
import { consignerDelete, CODE } from './client'
import BasePage from '@/basic/BasePage'
export default {
  name: 'sender',
  components: {
    PageTable
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '发货方列表'
  },
  data () {
    return {
      url: '/consigner/page',
      method: 'GET',
      keyword: {},
      selectStatus: 0,
      selectList: [
        {
          value: 0,
          label: '发货方名称'
        },
        {
          value: 1,
          label: '发货联系人名称'
        }
      ],
      name: '',
      contact: '',
      order: '',
      columns1: [
        {
          title: '操作',
          key: 'id',
          width: 120,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130102)) {
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
                      name: 'client/dialog/sender',
                      data: {
                        title: '修改发货方',
                        flag: 2, // 编辑
                        id: params.row.id,
                        validate: {
                          name: params.row.name,
                          contact: params.row.contact,
                          phone: params.row.phone,
                          payType: params.row.payType + '',
                          remark: params.row.remark,
                          pickUp: params.row.pickUp,
                          isInvoice: params.row.isInvoice,
                          invoiceRate: params.row.invoiceRate * 100 || null,
                          salesmanId: params.row.salesmanId
                        }
                      },
                      methods: {
                        ok () {
                          _this.searchList() // 刷新页面
                        }
                      }
                    })
                  }
                }
              }, '修改'))
            }
            renderBtn.push(h('span', {
              style: {
                marginRight: '12px',
                color: '#00A4BD',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.openTab({ path: '/client/sender-info', title: '发货方详情', query: { id: params.row.id }
                  })
                }
              }
            }, '查看'))
            if (this.hasPower(130103)) {
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
                          consignerDelete({
                            id: params.row.id
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
          title: '发货方名称',
          ellipsis: true,
          minWidth: 50,
          render: (h, params) => {
            let text = ''
            if (params.row.name.length > 11) {
              text = params.row.name.slice(0, 11) + '...'
              return h('div', [
                h('Tooltip', {
                  props: {
                    placeholder: 'bottom',
                    transfer: false
                  }
                }, [
                  h('div', {
                  }, text),
                  h('div', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal'
                    }
                  }, params.row.name)
                ])
              ])
            } else {
              return h('div', [
                h('div', {
                  title: params.row.name
                }, params.row.name)
              ])
            }
          }
        },
        {
          title: '发货方联系人',
          key: 'contact',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '联系电话',
          key: 'phone',
          width: 110
        },
        {
          title: '发货地址数',
          key: 'addressCnt'
        },
        {
          title: '收货方数量',
          key: 'consigneeCnt'
        },
        {
          title: '货物数量',
          key: 'cargoCnt'
        },
        {
          title: '付款方式',
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
        }
      ]
    }
  },
  methods: {
    searchList () {
      this.selectStatus === 0 ? this.contact = '' : this.name = ''
      this.keyword = {
        name: this.name,
        contact: this.contact,
        order: this.order
      }
    },
    clearKeywords () {
      this.name = ''
      this.contact = ''
      this.searchList()
    },
    changeState () {
      this.name = ''
      this.contact = ''
    },
    modaladd () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/sender',
        data: {
          title: '新增发货方',
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
      this.order = (column.order === 'normal' ? '' : column.order)
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
