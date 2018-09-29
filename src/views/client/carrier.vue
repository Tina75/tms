<template>
  <div>
    <div class="header">
      <div class="left">
        <Button v-if="hasPower(130201)" type="primary" @click="modaladd">新增</Button>
      </div>
      <div class="right">
        <template>
          <Select v-model="selectStatus"  style="width:120px;margin-right: 11px">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input v-model="keyword" :maxlength="15" :placeholder="selectStatus === 1 ? '请输入承运商名称' : '请输入承运商联系人名称'"  search style="width: 200px"  @on-search="searchList" />
      </div>
    </div>
    <div>
      <template>
        <Table :columns="columns1" :data="data1" @on-sort-change = "timeSort"></Table>
      </template>
    </div>
    <div class="footer">
      <template>
        <Page :total="totalCount"
              :current.sync="pageNo" :page-size-opts="pageArray"
              size="small"
              show-sizer
              show-elevator show-total @on-change="handleChangePage"
              @on-page-size-change="handleChangePageSize"/>
      </template>
    </div>
  </div>
</template>

<script>
import { carrierList, carrierDelete, CODE, carrierDetailsForDriver, carrierDetailsForCompany } from './client'
import BasePage from '@/basic/BasePage'
export default {
  name: 'carrier',
  metaInfo: {
    title: '智加云承运商列表'
  },
  mixins: [ BasePage ],
  data () {
    return {
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
      totalCount: 0, // 总条数
      pageArray: [10, 20, 50, 100],
      pageNo: 1,
      pageSize: 10,
      payTypeMap: {
        1: '按单付',
        2: '月结'
      },
      columns1: [
        {
          title: '操作',
          key: 'id',
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
                              driver: { // 1 个体司机
                                driverName: _this.driver.driverName,
                                driverPhone: _this.driver.driverPhone,
                                carNO: _this.driver.carNO,
                                carType: _this.driver.carType + '',
                                carLength: _this.driver.carLength + '',
                                shippingWeight: _this.driver.shippingWeight + '',
                                shippingVolume: _this.driver.shippingVolume + '',
                                remark: _this.driver.remark,
                                payType: _this.driver.payType + ''
                              }
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
                        console.log(_this.company)
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
                              company: {
                                carrierName: _this.company.carrierName,
                                carrierPrincipal: _this.company.carrierPrincipal,
                                carrierPhone: _this.company.carrierPhone,
                                payType: _this.company.payType + '',
                                remark: _this.company.remark
                              }
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
          title: '承运商名称',
          // key: 'name',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#418DF9',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openTab({ path: '/client/carrier-info', title: '承运商详情', query: { id: params.row.carrierId, carrierType: params.row.carrierType }
                    })
                  }
                }
              }, params.row.carrierName)
            ])
          }
        },
        {
          title: '类型',
          key: 'carrierType',
          render: (h, params) => {
            let text = ''
            if (params.row.carrierType === 1) {
              text = '个体司机'
            } else {
              text = '运输公司'
            }
            return h('div', {}, text)
          }
        },
        {
          title: '负责人',
          key: 'carrierPrincipal'
        },
        {
          title: '联系电话',
          key: 'carrierPhone'
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
            return h('div', {}, this.payTypeMap[params.row.payType])
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: 'custom',
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
        payType: ''
      },
      company: {
        carrierName: '',
        carrierPrincipal: '',
        carrierPhone: '',
        payType: '',
        remark: ''
      }
    }
  },
  mounted () {
    this.searchList()
  },
  methods: {
    searchList () {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        type: this.selectStatus,
        keyword: this.keyword,
        order: this.order
      }
      carrierList(data).then(res => {
        if (res.data.code === CODE) {
          console.log(res)
          this.data1 = res.data.data.carrierList
          this.totalCount = res.data.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
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
        console.log(res)
        if (res.data.code === CODE) {
          this.company = {
            carrierName: res.data.data.carrierInfo.carrierName,
            carrierPrincipal: res.data.data.carrierInfo.carrierPrincipal,
            carrierPhone: res.data.data.carrierInfo.carrierPhone,
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
        if (res.data.code === CODE) {
          this.driver = {
            driverName: res.data.data.driverName,
            driverPhone: res.data.data.driverPhone,
            carNO: res.data.data.carNO,
            carType: res.data.data.carType,
            carLength: res.data.data.carLength,
            shippingWeight: res.data.data.shippingWeight,
            shippingVolume: res.data.data.shippingVolume,
            remark: res.data.data.remark,
            payType: res.data.data.payType
          }
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
