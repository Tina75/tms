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
            <span>{{carTypeMap[driverList.carType]}}{{carLengthMap[driverList.carLength]}}</span>
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
            <Button v-if="hasPower(130204)" type="primary" @click="_carrierAddDriver">新增</Button>
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
            <Button v-if="hasPower(130207)" type="primary" @click="_carrierAddVehicle">新增</Button>
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
      carTypeMap: {
        1: '平板',
        2: '高栏',
        3: '厢车',
        4: '自卸',
        5: '冷藏',
        6: '保温',
        7: '高低板',
        8: '面包车',
        9: '爬梯车',
        10: '飞翼车'
      },
      carLengthMap: {
        1: '1.8米',
        2: '2.7米',
        3: '3.8米',
        4: '4.2米',
        5: '5米',
        6: '6.2米',
        7: '6.8米',
        8: '7.7米',
        9: '8.2米',
        10: '8.7米',
        11: '9.6米',
        12: '11.7米',
        13: '12.5米',
        14: '13米',
        15: '15米',
        16: '16米',
        17: '17.5米'
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
              }, '修改'))
            }
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
                            driverId: params.row.driverId
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this._carrierListDriver() // 刷新页面
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
            let text = params.row.carType ? (this.carLengthMap[params.row.carLength] + this.carTypeMap[params.row.carType]) : ''
            return h('div', {}, text)
          }
        }
      ],
      columns2: [
        {
          title: '操作',
          key: 'id',
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
              }, '修改'))
            }
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
                          carrierDeleteVehicle({
                            carId: params.row.carId
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this._carrierListCar() // 刷新页面
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
          title: '车型',
          key: 'carType',
          render: (h, params) => {
            let text = params.row.carType ? (this.carLengthMap[params.row.carLength] + this.carTypeMap[params.row.carType]) : ''
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
