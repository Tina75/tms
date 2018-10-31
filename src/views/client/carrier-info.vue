<template>
  <div v-if="carrierType === 1" class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">承运商信息</span>
      </div>
      <div class="list-info">
        <Row class="row">
          <Col span="8">
          <div>
            <span class="label">类型：</span>
            个体司机
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">司机姓名：</span>
            {{driverList.driverName}}
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">联系电话：</span>
            {{driverList.driverPhone}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="8">
          <div>
            <span class="label">车牌号：</span>
            {{driverList.carNO}}
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">车型：</span>
            <span>{{carTypeMap[driverList.carType]}}{{carLengthMap[driverList.carLength]}}</span>
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">付款方式：</span>
            <span>{{payTypeMap[driverList.payType]}}</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="24">
          <div>
            <span class="label">备注：</span>
            {{driverList.remark}}
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
  <div v-else class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">承运商信息</span>
      </div>
      <div class="list-info">
        <Row class="row">
          <Col span="8">
          <div>
            <span class="label">承运商名称：</span>
            {{companyList.carrierName}}
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">类型：</span>
            运输公司
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">负责人：</span>
            {{companyList.carrierPrincipal}}
          </div>
          </Col>
        </Row>
        <Row  class="row">
          <Col span="8">
          <div>
            <span class="label">联系电话：</span>
            {{companyList.carrierPhone}}
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">结算方式：</span>
            <span>{{payTypeMap[companyList.payType]}}</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="24">
          <div>
            <span class="label">备注：</span>
            {{companyList.remark}}
          </div>
          </Col>
        </Row>
      </div>
    </div>
    <div class="tabs">
      <Tabs :animated="false">
        <TabPane :label="tabPaneLabel">
          <div class="add">
            <Button v-if="hasPower(130204)" type="primary" @click="_carrierAddDriver">新增车辆</Button>
          </div>
          <template>
            <Table :columns="columns1" :data="data1"></Table>
          </template>
          <div class="footer">
            <template>
              <Page :total="totalCount1"
                    :current.sync="pageNo1" :page-size-opts="pageArray1"
                    size="small"
                    show-sizer
                    show-elevator show-total @on-change="handleChangePage1"
                    @on-page-size-change="handleChangePageSize1"/>
            </template>
          </div>
        </TabPane>
        <TabPane :label="tabPaneLabe2">
          <div class="add">
            <Button v-if="hasPower(130207)" type="primary" @click="_carrierAddVehicle">新增记录</Button>
          </div>
          <template>
            <Table :columns="columns2" :data="data2"></Table>
          </template>
          <div class="footer">
            <template>
              <Page :total="totalCount2"
                    :current.sync="pageNo2" :page-size-opts="pageArray2"
                    size="small"
                    show-sizer
                    show-elevator show-total @on-change="handleChangePage2"
                    @on-page-size-change="handleChangePageSize2"/>
            </template>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import { CODE, carrierDetailsForDriver, carrierListRepairVehicle, carrierDeleteRepairVehicle, carrierDetailsForCompany, carrierListCar, carrierDeleteDriver } from './client'
import TMSUrl from '@/libs/constant/url'
export default {
  name: 'carrier-info',
  mixins: [ BasePage ],
  metaInfo: {
    title: '承运商详情'
  },
  data () {
    return {
      carrierId: this.$route.query.id, // carrierId 承运商id
      carrierType: this.$route.query.carrierType,
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      payTypeMap: {
        1: '按单付',
        2: '月结',
        '': ''
      },
      driverList: {
        driverName: '',
        carNO: '',
        carType: '',
        driverPhone: '',
        payType: '',
        carLength: '',
        remark: '',
        shippingWeight: '',
        shippingVolume: ''
      },
      companyList: {
        carrierName: '',
        carrierPrincipal: '',
        carrierPhone: '',
        payType: '',
        remark: ''
      },
      columns1: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130205)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    var _this = this
                    this.openDialog({
                      name: 'client/dialog/carrier-driver',
                      data: {
                        title: '修改车辆',
                        flag: 2, // 修改
                        carrierId: this.carrierId,
                        validate: { ...params.row, purchDate: new Date(params.row.purchDate) }
                      },
                      methods: {
                        ok () {
                          _this._carrierListCar() // 车辆列表也要刷新
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
                  this.openTab({
                    path: TMSUrl.CARRIER_MANAGEMENT_CAEDETAILS,
                    query: {
                      id: '车辆详情',
                      rowData: params.row
                    }
                  })
                }
              }
            }, '查看'))
            if (this.hasPower(130206)) {
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
                          carrierDeleteDriver({
                            carId: params.row.carId
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this._carrierListCar() // 车辆列表也要刷新
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
          title: '车牌号',
          key: 'carNO'
        },
        {
          title: '合作方式',
          key: 'driverType',
          render: (h, params) => {
            let text = ''
            if (params.row.driverType === 1) {
              text = '合约'
            } else if (params.row.driverType === 2) {
              text = '临时'
            } else if (params.row.driverType === 3) {
              text = '自有'
            } else if (params.row.driverType === 4) {
              text = '挂靠'
            }
            return h('div', {}, text)
          }
        },
        {
          title: '司机姓名',
          key: 'driverName'
        },
        {
          title: '手机号',
          key: 'driverPhone'
        },
        {
          title: '车型',
          key: 'carType',
          render: (h, params) => {
            let text = params.row.carType ? this.carTypeMap[params.row.carType] : '-'
            return h('div', {}, text)
          }
        },
        {
          title: '车长（米）',
          key: 'carLength',
          render: (h, params) => {
            let text = params.row.carLength ? this.carLengthMap[params.row.carLength] : '-'
            return h('div', {}, text.slice(0, text.length - 1))
          }
        },
        {
          title: '核定载重（吨）',
          key: 'shippingWeight'
        },
        {
          title: '常跑线路',
          key: 'regularLine',
          render: (h, params) => {
            let s1 = ''
            let n1 = ''
            let s2 = ''
            let n2 = ''
            if (params.row.regularLine && JSON.parse(params.row.regularLine).length === 1) {
              s1 = JSON.parse(params.row.regularLine)[0].sn === undefined ? '' : JSON.parse(params.row.regularLine)[0].sn
              n1 = JSON.parse(params.row.regularLine)[0].en === undefined ? '' : JSON.parse(params.row.regularLine)[0].en
            } else if (JSON.parse(params.row.regularLine).length === 2) {
              s1 = JSON.parse(params.row.regularLine)[0].sn === undefined ? '' : JSON.parse(params.row.regularLine)[0].sn
              n1 = JSON.parse(params.row.regularLine)[0].en === undefined ? '' : JSON.parse(params.row.regularLine)[0].en
              s2 = JSON.parse(params.row.regularLine)[1].sn === undefined ? '' : JSON.parse(params.row.regularLine)[1].sn
              n2 = JSON.parse(params.row.regularLine)[1].en === undefined ? '' : JSON.parse(params.row.regularLine)[1].en
            }
            return h('div', [
              h('p', {
                style: {
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }, s1 + '—' + n1 === '—' ? '' : s1 + '—' + n1),
              h('p', {
                style: {
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }, s2 + '—' + n2 === '—' ? '' : s2 + '—' + n2)
            ])
          }
        }, {
          title: '添加人',
          key: 'createName'
        },
        {
          title: '添加时间',
          key: 'createTime',
          render: (h, params) => {
            let text = this.formatDate(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ],
      columns2: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130208)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    var _this = this
                    this.openDialog({
                      name: 'client/dialog/carrier-vehicle',
                      data: {
                        title: '修改维修记录',
                        flag: 2, // 修改
                        id: params.row.driverId,
                        carrierId: _this.carrierId,
                        driverId: params.row.driverId,
                        carId: params.row.carId,
                        validate: { ...params.row, repairDate: new Date(params.row.repairDate) }
                      },
                      methods: {
                        ok () {
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
                  this.openTab({
                    path: TMSUrl.CARRIER_MANAGEMENT_REPAIRDETAILS,
                    query: {
                      id: '维修详情',
                      rowData: params.row,
                      carrierId: this.carrierId
                    }
                  })
                }
              }
            }, '查看'))
            if (this.hasPower(130209)) {
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
                          carrierDeleteRepairVehicle({
                            id: params.row.id
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this._carrierListRepairVehicle() // 刷新页面
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
          title: '车牌号',
          key: 'carNo'
        },
        {
          title: '维修类别',
          key: 'repairType',
          render: (h, params) => {
            let text = ''
            if (params.row.repairType === 1) {
              text = '维修'
            } else if (params.row.repairType === 2) {
              text = '保养'
            }
            return h('div', {}, text)
          }
        },
        {
          title: '送修日期',
          key: 'repairDate',
          render: (h, params) => {
            let text = this.formatDateTime(params.row.repairDate)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '送修人',
          key: 'repairPerson'
        },
        {
          title: '送修公里数',
          key: 'repairMile'
        },
        {
          title: '维修费用',
          key: 'repairMoney'
        },
        {
          title: '已支付费用',
          key: 'payMoney'
        },
        {
          title: '未支付费用',
          key: 'waitPayMoney'
        },
        {
          title: '添加人',
          key: 'creater'
        },
        {
          title: '添加时间',
          key: 'createTime',
          render: (h, params) => {
            let text = this.formatDateTime(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ],
      data1: [],
      data2: [],
      pageArray1: [10, 20, 50],
      pageSize1: 10,
      totalCount1: 0, // 总条数
      pageNo1: 1,
      pageArray2: [10, 20, 50],
      pageSize2: 10,
      totalCount2: 0, // 总条数
      pageNo2: 1
    }
  },
  computed: {
    tabPaneLabel () {
      return '车辆信息 ' + (Number(this.totalCount1) === 0 ? '' : this.totalCount1)
    },
    tabPaneLabe2 () {
      return '维修记录 ' + (Number(this.totalCount2) === 0 ? '' : this.totalCount2)
    }
  },
  mounted () {
    if (this.carrierType === 1) { // 类型为个体司机
      this._carrierDetailsForDriver()
    } else { // 类型为运输公司
      this._carrierDetailsForCompany()
      this._carrierListCar()
      // 维修列表
      this._carrierListRepairVehicle()
    }
  },
  methods: {
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    _carrierDetailsForDriver () {
      let data = {
        carrierId: this.carrierId
      }
      carrierDetailsForDriver(data).then(res => {
        if (res.data.code === CODE) {
          this.driverList = {
            driverName: res.data.data.driverName,
            carNO: res.data.data.carNO,
            carType: res.data.data.carType,
            driverPhone: res.data.data.driverPhone,
            payType: res.data.data.payType,
            carLength: res.data.data.carLength,
            remark: res.data.data.remark === '' ? '无' : res.data.data.remark,
            shippingWeight: res.data.data.shippingWeight,
            shippingVolume: res.data.data.shippingVolume
          }
        }
      })
    },
    _carrierDetailsForCompany () {
      let data = {
        carrierId: this.carrierId
      }
      carrierDetailsForCompany(data).then(res => {
        if (res.data.code === CODE) {
          let data = res.data.data
          this.companyList = {
            carrierName: data.carrierInfo.carrierName,
            carrierPrincipal: data.carrierInfo.carrierPrincipal,
            carrierPhone: data.carrierInfo.carrierPhone,
            payType: data.carrierInfo.payType,
            remark: data.carrierInfo.remark === '' ? '无' : data.carrierInfo.remark
          }
        }
      })
    },
    _carrierAddDriver () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/carrier-driver',
        data: {
          title: '新增车辆',
          flag: 1, // 新增
          carrierId: this.carrierId // carrierId
        },
        methods: {
          ok () {
            _this._carrierListCar()
          }
        }
      })
    },
    handleChangePage1 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo1 = pageNo
      this._carrierListCar()
    },
    handleChangePageSize1 (pageSize) {
      this.pageSize1 = pageSize
      this._carrierListCar()
    },
    // 车辆列表，新增，删除，修改
    _carrierListCar () {
      let data = {
        carrierId: this.carrierId,
        pageNo: this.pageNo2,
        pageSize: this.pageSize2
      }
      carrierListCar(data).then(res => {
        if (res.data.code === CODE) {
          this.data1 = res.data.data.carList
          this.totalCount1 = res.data.data.total
        }
      })
    },
    // 车辆维修列表
    _carrierListRepairVehicle () {
      let data = {
        carrierId: this.carrierId,
        pageNo: this.pageNo2,
        pageSize: this.pageSize2
      }
      carrierListRepairVehicle(data).then(res => {
        if (res.data.code === CODE) {
          this.data2 = res.data.data.list
          this.totalCount2 = res.data.data.totalCount
        }
      })
    },
    _carrierAddVehicle () {
      var _this = this
      console.log(_this.carrierId)
      this.openDialog({
        name: 'client/dialog/carrier-vehicle',
        data: {
          title: '新增车辆维修保养记录',
          flag: 1, // 新增
          driverId: _this.driverId,
          carrierId: _this.carrierId
        },
        methods: {
          ok () {
            _this._carrierListRepairVehicle() // 刷新页面-维修列表
          }
        }
      })
    },
    handleChangePage2 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo2 = pageNo
      this._carrierListRepairVehicle()
    },
    handleChangePageSize2 (pageSize) {
      this.pageSize2 = pageSize
      this._carrierListRepairVehicle()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "client.styl"
  .footer
    margin-top 22px
    display flex
    justify-content flex-end
  .ivu-tabs
    padding-bottom: 120px!important
</style>
