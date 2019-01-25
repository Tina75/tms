<template>
  <div>
    <div class="header">
      <div class="left">
        <Button v-if="hasPower(130201)" type="primary" @click="modaladd">新增</Button>
      </div>
      <div class="right">
        <template>
          <Select v-model="selectStatus" style="width:120px;margin-right: 11px" transfer @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input v-model="keyword"
               :maxlength="15"
               :icon="keyword? 'ios-close-circle' : ''"
               :placeholder="selectStatus === 1 ? '请输入承运商名称' : '请输入承运商联系人名称'"
               class="search-input"
               @on-enter="searchList"
               @on-click="clearKeywords"/>
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
import { carrierDelete, carrierDetailsForDriver, carrierDetailsForCompany } from './client'
import BasePage from '@/basic/BasePage'
import { carrierPayTypeFindName } from '../libs/carrierPayType.js'
export default {
  name: 'carrier',
  components: {
    PageTable
  },
  metaInfo: {
    title: '运掌柜承运商列表'
  },
  mixins: [ BasePage ],
  data () {
    return {
      url: '/carrier/list',
      method: 'GET',
      queryWords: {
        type: 1
      },
      selectStatus: 1,
      selectList: [
        {
          value: 1,
          label: '承运商名称'
        },
        {
          value: 2,
          label: '承运商联系人'
        }
      ],
      keyword: '',
      order: null,
      // payTypeMap: carrierPayType,
      columns1: [
        {
          title: '操作',
          key: 'id',
          width: 120,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130202)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let _this = this
                    if (params.row.carrierType === 1) {
                      this._carrierDetailsForDriver(params.row.carrierId, () => {
                        _this.openDialog({
                          name: 'client/dialog/carrier',
                          data: {
                            title: '修改承运商',
                            flag: 2, // 编辑
                            id: params.row.carrierId,
                            validate: {
                              type: {
                                selectStatus: params.row.carrierType
                              },
                              driver: { ..._this.driver }
                            }
                          },
                          methods: {
                            ok () {
                              _this.searchList()
                            }
                          }
                        })
                      })
                    } else {
                      this._carrierDetailsForCompany(params.row.carrierId, () => {
                        _this.openDialog({
                          name: 'client/dialog/carrier',
                          data: {
                            title: '修改承运商',
                            flag: 2, // 编辑
                            id: params.row.carrierId,
                            validate: {
                              type: {
                                selectStatus: params.row.carrierType
                              },
                              company: { ..._this.company }
                            }
                          },
                          methods: {
                            ok () {
                              _this.searchList()
                            }
                          }
                        })
                      })
                    }
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
                  this.openTab({ path: '/client/carrier-info', title: '承运商详情', query: { id: params.row.carrierId, carrierType: params.row.carrierType }
                  })
                }
              }
            }, '查看'))
            if (this.hasPower(130203)) {
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
                          carrierDelete({
                            carrierId: params.row.carrierId
                          }).then(res => {
                            if (res.data.code === 10000) {
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
          title: '承运商名称',
          ellipsis: true,
          width: 180,
          render: (h, params) => {
            let text = ''
            if (params.row.carrierName.length > 12) { // 显示tooltip
              text = params.row.carrierName.slice(0, 12) + '...'
              return h('div', [
                h('Tooltip', {
                  props: {
                    placeholder: 'bottom',
                    transfer: false
                  }
                }, [
                  h('span', {
                  }, text),
                  h('div', {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal'
                    }
                  }, params.row.carrierName)
                ])
              ])
            } else {
              return h('span', {
              }, params.row.carrierName)
            }
          }
        },
        {
          title: '类型',
          key: 'carrierType',
          render: (h, params) => {
            let text = ''
            if (params.row.carrierType === 1 || params.row.carrierType === '1') {
              text = '个体司机'
            } else {
              text = '运输公司'
            }
            return h('div', {}, text)
          }
        },
        {
          title: '负责人',
          key: 'carrierPrincipal',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '负责人电话',
          key: 'carrierPhone',
          width: 120
        },
        {
          title: '客服联系电话',
          key: 'customerCarrierPhone',
          width: 120
        },
        {
          title: '司机数',
          key: 'driverCnt'
        },
        {
          title: '车辆数',
          key: 'carCnt'
        },
        {
          title: '结算方式',
          key: 'payType',
          render: (h, params) => {
            if (!params.row.payType) {
              return h('div', '-')
            }
            return h('div', {}, carrierPayTypeFindName(params.row.payType))
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
      ],
      data1: [],
      driver: { // 1 个体司机
        driverName: '',
        driverPhone: '',
        carNO: '',
        carType: '',
        carLength: '',
        shippingWeight: '',
        shippingVolume: '',
        remark: '',
        payType: '',
        carBrand: '',
        travelPhoto: '',
        drivePhoto: '',
        regularLine: ''
      },
      company: {
        carrierName: '',
        carrierPrincipal: '',
        carrierPhone: '',
        customerCarrierPhone: '',
        payType: '',
        remark: ''
      }
    }
  },
  methods: {
    // carrierPayTypeFindName (val) {
    //   return carrierPayTypeFindName(val)
    // },
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
        name: 'client/dialog/carrier',
        data: {
          title: '新增承运商',
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
    _carrierDetailsForCompany (carrierId, fn) {
      let data = {
        carrierId: carrierId
      }
      carrierDetailsForCompany(data).then(res => {
        if (res.data.code === 10000) {
          this.company = {
            carrierName: res.data.data.carrierInfo.carrierName,
            carrierPrincipal: res.data.data.carrierInfo.carrierPrincipal,
            carrierPhone: res.data.data.carrierInfo.carrierPhone,
            customerCarrierPhone: res.data.data.carrierInfo.customerCarrierPhone,
            payType: res.data.data.carrierInfo.payType,
            remark: res.data.data.carrierInfo.remark
          }
          fn()
        }
      })
    },
    _carrierDetailsForDriver (carrierId, fn) {
      let data = {
        carrierId: carrierId
      }
      carrierDetailsForDriver(data).then(res => {
        if (res.data.code === 10000) {
          this.driver = res.data.data
          fn()
        }
      })
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
