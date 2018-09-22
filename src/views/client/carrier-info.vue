<template>
  <div v-if="carrierType === 1" class="info-detail">
    <div class="info">
      <div class="title">承运商信息</div>
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
            <span v-if="driverList.carType === 1">平板{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 2">高栏{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 3">厢车{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 4">自卸{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 5">冷藏{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 6">保温{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 7">高低板{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 8">面包车{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 9">爬梯车{{driverList.carLength}}米</span>
            <span v-else-if="driverList.carType === 10">飞翼车{{driverList.carLength}}米</span>
            <span v-else></span>
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">付款方式：</span>
            <span v-if="driverList.payType===1">现付</span>
            <span v-else-if="driverList.payType===2">到付</span>
            <span v-else-if="driverList.payType===3">回单付</span>
            <span v-else-if="driverList.payType===4">月结</span>
            <span v-else-if="driverList.payType===5">预付+到付</span>
            <span v-else-if="driverList.payType===6">预付+回付</span>
            <span v-else-if="driverList.payType===7">到付+回付</span>
            <span v-else-if="driverList.payType===8">三段付</span>
            <span v-else></span>
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
      <div class="title">承运商信息</div>
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
            <span v-if="companyList.payType === 1">现付</span>
            <span v-else-if="companyList.payType === 2">到付</span>
            <span v-else-if="companyList.payType === 3">回单付</span>
            <span v-else-if="companyList.payType === 4">月结</span>
            <span v-else></span>
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
        <TabPane label="司机">
          <div class="add">
            <Button type="primary" @click="_carrierAddDriver">新增</Button>
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
        <TabPane label="车辆" >
          <div class="add">
            <Button type="primary" @click="_carrierAddVehicle">新增</Button>
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
import { CODE, carrierDetailsForDriver, carrierDetailsForCompany, carrierListDriver, carrierListCar, carrierDeleteVehicle, carrierDeleteDriver } from './client'
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
          render: (h, params) => {
            return h('div', [
              h('span', {
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
                        title: '修改司机',
                        flag: 2, // 修改
                        driverId: params.row.driverId,
                        validate: {
                          driverType: params.row.driverType + '',
                          driverName: params.row.driverName,
                          driverPhone: params.row.driverPhone
                        }
                      },
                      methods: {
                        ok () {
                          _this._carrierListDriver() // 刷新页面
                        }
                      }
                    })
                  }
                }
              }, '修改'),
              h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    carrierDeleteDriver({
                      driverId: params.row.driverId
                    }).then(res => {
                      if (res.data.code === CODE) {
                        this.$Message.success(res.data.msg)
                        this._carrierListDriver() // 刷新页面
                        this._carrierListCar() // 车辆列表也要刷新
                      } else {
                        this.$Message.error(res.data.msg)
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        },
        {
          title: '姓名',
          key: 'driverName'
        },
        {
          title: '电话',
          key: 'driverPhone'
        },
        {
          title: '司机类型',
          key: 'driverType',
          render: (h, params) => {
            let text = ''
            if (params.row.driverType === 1) {
              text = '合约司机 '
            } else if (params.row.driverType === 2) {
              text = '临时司机'
            } else {
              text = ''
            }
            return h('div', {}, text)
          }
        },
        {
          title: '车牌号',
          key: 'carNO'
        },
        {
          title: '车型',
          key: 'carType',
          render: (h, params) => {
            let text = ''
            if (params.row.carType === 1) {
              text = '平板'
            } else if (params.row.carType === 2) {
              text = '高栏'
            } else if (params.row.carType === 3) {
              text = '厢车'
            } else if (params.row.carType === 4) {
              text = '自卸'
            } else if (params.row.carType === 5) {
              text = '冷藏'
            } else if (params.row.carType === 6) {
              text = '保温'
            } else if (params.row.carType === 7) {
              text = '高低板'
            } else if (params.row.carType === 8) {
              text = '面包车'
            } else if (params.row.carType === 9) {
              text = '爬梯车'
            } else if (params.row.carType === 10) {
              text = '飞翼车'
            } else {
              text = ''
            }
            text = text ? params.row.carLength + '米' + text : ''
            return h('div', {}, text)
          }
        }
      ],
      columns2: [
        {
          title: '操作',
          key: 'id',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    var _this = this
                    console.log(params.row)
                    this.openDialog({
                      name: 'client/dialog/carrier-vehicle',
                      data: {
                        title: '修改车辆',
                        flag: 2, // 修改
                        id: params.row.driverId,
                        carrierId: _this.carrierId,
                        driverId: params.row.driverId,
                        driverName: params.row.driverName,
                        carId: params.row.carId,
                        validate: {
                          carNO: params.row.carNO,
                          carType: params.row.carType + '',
                          shippingWeight: params.row.shippingWeight + '',
                          carLength: params.row.carLength + '',
                          shippingVolume: params.row.shippingVolume + ''
                        }
                      },
                      methods: {
                        ok () {
                          _this._carrierListCar() // 刷新页面
                          _this._carrierListDriver() // 车辆列表也要刷新
                        }
                      }
                    })
                  }
                }
              }, '修改'),
              h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    carrierDeleteVehicle({
                      carId: params.row.carId
                    }).then(res => {
                      if (res.data.code === CODE) {
                        this.$Message.success(res.data.msg)
                        this._carrierListCar() // 刷新页面
                      } else {
                        this.$Message.error(res.data.msg)
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        },
        {
          title: '车牌号',
          key: 'carNO'
        },
        {
          title: '车型',
          key: 'carType',
          render: (h, params) => {
            let text = ''
            if (params.row.carType === 1) {
              text = '平板'
            } else if (params.row.carType === 2) {
              text = '高栏'
            } else if (params.row.carType === 3) {
              text = '厢车'
            } else if (params.row.carType === 4) {
              text = '自卸'
            } else if (params.row.carType === 5) {
              text = '冷藏'
            } else if (params.row.carType === 6) {
              text = '保温'
            } else if (params.row.carType === 7) {
              text = '高低板'
            } else if (params.row.carType === 8) {
              text = '面包车'
            } else if (params.row.carType === 9) {
              text = '爬梯车'
            } else if (params.row.carType === 10) {
              text = '飞翼车'
            } else {
              text = ''
            }
            text = text ? params.row.carLength + '米' + text : ''
            return h('div', {}, text)
          }
        },
        {
          title: '核定重量(吨)',
          key: 'shippingWeight'
        },
        {
          title: '车载容积(方)',
          key: 'shippingVolume'
        },
        {
          title: '主司机',
          key: 'driverName'
        }
      ],
      data1: [],
      data2: [],
      pageArray1: [10, 20, 50, 100],
      pageSize1: 10,
      totalCount1: 0, // 总条数
      pageNo1: 1,
      pageArray2: [10, 20, 50, 100],
      pageSize2: 10,
      totalCount2: 0, // 总条数
      pageNo2: 1
    }
  },
  mounted () {
    if (this.carrierType === 1) { // 类型为个体司机
      this._carrierDetailsForDriver()
    } else { // 类型为运输公司
      this._carrierDetailsForCompany()
      this._carrierListDriver()
      this._carrierListCar()
    }
  },
  methods: {
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
            remark: res.data.data.remark,
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
            remark: data.carrierInfo.remark
          }
        }
      })
    },
    // 司机列表，新增，删除，修改
    _carrierListDriver () {
      let data = {
        carrierId: this.carrierId,
        pageNo: this.pageNo1,
        pageSize: this.pageSize1
      }
      carrierListDriver(data).then(res => {
        if (res.data.code === CODE) {
          this.data1 = res.data.data.driverList
          this.totalCount1 = res.data.data.total
        }
      })
    },
    _carrierAddDriver () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/carrier-driver',
        data: {
          title: '新增司机',
          flag: 1, // 新增
          carrierId: this.carrierId // carrierId
        },
        methods: {
          ok () {
            _this._carrierListDriver() // 刷新页面
          }
        }
      })
    },
    handleChangePage1 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo1 = pageNo
      this._carrierListDriver()
    },
    handleChangePageSize1 (pageSize) {
      this.pageSize1 = pageSize
      this._carrierListDriver()
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
          this.data2 = res.data.data.carList
          this.totalCount2 = res.data.data.total
        }
      })
    },
    _carrierAddVehicle () {
      var _this = this
      console.log(_this.carrierId)
      this.openDialog({
        name: 'client/dialog/carrier-vehicle',
        data: {
          title: '新增车辆',
          flag: 1, // 新增
          driverId: _this.driverId,
          carrierId: _this.carrierId
        },
        methods: {
          ok () {
            _this._carrierListCar() // 刷新页面
            _this._carrierListDriver() // 司机列表也要刷新
          }
        }
      })
    },
    handleChangePage2 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo2 = pageNo
      this._carrierListCar()
    },
    handleChangePageSize2 (pageSize) {
      this.pageSize2 = pageSize
      this._carrierListCar()
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
</style>
