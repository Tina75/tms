<template>
  <div>
    <div class="tab-head">
      <Tabs :animated="false" @on-click="clickTitleTab">
        <TabPane label="车辆信息详情" name="car">
        </TabPane>
        <TabPane label="维修记录汇总" name="repair">
        </TabPane>
      </Tabs>
    </div>
    <!-- 车辆信息详情 -->
    <div v-if="showTableOne" class="info-detail">
      <div class="info">
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">基础信息</span>
          <div class="btnItem">
            <Button class="btnSty" @click="removeDriverData">删除</Button>
            <Button type="primary" class="btnSty" @click="updateDriverData">修改</Button>
          </div>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">姓名：</span>
              {{infoData.driverName}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">车牌号：</span>
              {{infoData.carNO}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">合作方式：</span>
              {{infoData.driverType}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">手机号：</span>
              {{infoData.driverPhone}}
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">车型：</span>
              {{infoData.carType}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">车长：</span>
              {{infoData.carLength}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">载重：</span>
              {{infoData.shippingWeight}}<span>吨</span>
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">净空：</span>
              {{infoData.shippingVolume}}<span>方</span>
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">购买日期：</span>
              {{formatDate(infoData.purchDate)}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">品牌：</span>
              {{infoData.carBrand}}
            </div>
            </Col>
          </Row>
        </div><br/>
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">常跑线路</span>
        </div>
        <div class="list-info">
          <div v-if="this.line1" class="lineSpanLabel">
            {{line1}}
          </div>
          <div v-if="this.line2" class="lineSpanLabel">
            {{line2}}
          </div>
        </div><br/>
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">证件照片</span>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col span="5">
            <div v-if="infoData.travelPhoto">
              <img :src="infoData.travelPhoto" class="imageDiv"/>
              <p class="uploadLabel">行驶证</p>
            </div>
            </Col>
            <Col span="6">
            <div v-if="infoData.drivePhoto">
              <img :src="infoData.drivePhoto" class="imageDiv"/>
              <p class="uploadLabel">驾驶证</p>
            </div>
            </Col>
          </Row>
        </div>
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">操作日志</span>
        </div>
        <div class="list-info">
          <record-list :search-data="searchLogData" methods-url="/carrier/carrierLog/list"></record-list>
        </div>
      </div>
    </div>
    <!-- 维修记录汇总 -->
    <div v-if="!showTableOne">
      <div class="addRepair">
        <Button type="primary" @click="_carrierAddVehicle">新增记录</Button>
      </div>
      <page-table
        :columns="menuColumns"
        :keywords="repairFormatInit"
        class="addRepairTable"
        method="post"
        url="/carrier/repair/list"
        list-field="list">
      </page-table>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1, DRIVER_TYPE } from '@/libs/constant/carInfo'
import { CODE, carrierDeleteDriver, queryByIdCarrier, carrierDeleteRepairVehicle } from './client'
import pageTable from '@/components/page-table'
import TMSUrl from '@/libs/constant/url'
import RecordList from '@/components/RecordList'
export default {
  name: 'car-details',
  components: { pageTable, RecordList },
  mixins: [ BasePage ],
  props: {
  },
  data () {
    return {
      infoData: {},
      infoDataInit: {},
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      line1: '',
      line2: '',
      carrierId: '',
      searchLogData: {},
      id: '',
      carId: '',
      showTableOne: true,
      repairFormat: {},
      repairFormatInit: {},
      status: [
        { name: '全部', count: '' },
        { name: '待回收', count: '' },
        { name: '待返厂', count: '' },
        { name: '已返厂', count: '' }
      ],
      menuColumns: [
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
                          // 更新table
                          _this.repairFormatInit = Object.assign({}, _this.repairFormat)
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
                              // 更新table
                              _this.repairFormatInit = Object.assign({}, _this.repairFormat)
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
          width: 150,
          render: (h, params) => {
            let text = this.formatDate(params.row.repairDate)
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
          key: 'repairMoney',
          render: (h, params) => {
            return h('span', Number(params.row.repairMoney) / 100)
          }
        },
        {
          title: '已支付费用',
          key: 'payMoney',
          render: (h, params) => {
            return h('span', Number(params.row.payMoney) / 100)
          }
        },
        {
          title: '未支付费用',
          key: 'waitPayMoney',
          render: (h, params) => {
            return h('span', Number(params.row.waitPayMoney) / 100)
          }
        },
        {
          title: '添加人',
          key: 'creater'
        },
        {
          title: '添加时间',
          key: 'createTime',
          width: 150,
          render: (h, params) => {
            let text = this.formatDateTime(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ]
    }
  },
  created () {
    this.searchLogData.carrierId = this.$route.query.rowData.carrierId
    this.searchLogData.id = this.$route.query.rowData.id
    this.searchLogData.logType = 'vehicle'
  },
  mounted () {
    // 数据备份，防止在详情页面对数据进行二次编辑
    this.infoDataInit = Object.assign({}, this.$route.query.rowData)
    this.id = this.infoDataInit.id
    this.carrierId = this.infoDataInit.carrierId
    this.carId = this.infoDataInit.carId
    this.infoData = this.$route.query.rowData
    this.repairFormat.carrierId = this.carrierId
    this.repairFormat.carNO = this.infoData.carNO
    this.repairFormatInit = Object.assign({}, this.repairFormat)
    this.initData()
  },
  methods: {
    // 切换头部tab
    clickTitleTab (val) {
      if (val === 'car') {
        this.showTableOne = true
      } else {
        this.showTableOne = false
      }
    },
    // 日期格式化
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    // 初始化数据格式
    initData () {
      this.infoData.driverType = (DRIVER_TYPE.find(e => e.id === this.infoData.driverType.toString())).name
      this.infoData.carType = this.carTypeMap[this.infoData.carType]
      this.infoData.carLength = this.carLengthMap[this.infoData.carLength]
      let s1 = ''
      let n1 = ''
      let s2 = ''
      let n2 = ''
      if (this.infoData.regularLine && JSON.parse(this.infoData.regularLine).length === 1) {
        s1 = JSON.parse(this.infoData.regularLine)[0].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].sn
        n1 = JSON.parse(this.infoData.regularLine)[0].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].en
      } else if (JSON.parse(this.infoData.regularLine).length === 2) {
        s1 = JSON.parse(this.infoData.regularLine)[0].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].sn
        n1 = JSON.parse(this.infoData.regularLine)[0].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].en
        s2 = JSON.parse(this.infoData.regularLine)[1].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[1].sn
        n2 = JSON.parse(this.infoData.regularLine)[1].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[1].en
      }
      this.line1 = s1 + '—' + n1 === '—' ? '' : s1 + '—' + n1
      this.line2 = s2 + '—' + n2 === '—' ? '' : s2 + '—' + n2
    },
    removeDriverData () {
      let _this = this
      this.openDialog({
        name: 'client/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
            carrierDeleteDriver({
              carId: _this.carId
            }).then(res => {
              if (res.data.code === CODE) {
                _this.$Message.success(res.data.msg)
                this.ema.fire('closeTab', this.$route)
              } else {
                _this.$Message.error(res.data.msg)
              }
            })
          }
        }
      })
    },
    updateDriverData () {
      let _this = this
      this.openDialog({
        name: 'client/dialog/carrier-driver',
        data: {
          title: '修改车辆',
          flag: 2,
          carrierId: _this.carrierId,
          carId: _this.carId,
          validate: { ..._this.infoDataInit, purchDate: new Date(_this.infoDataInit.purchDate) }
        },
        methods: {
          ok () {
            _this.queryByIdCar()
          }
        }
      })
    },
    // 修改完进行数据更新
    queryByIdCar () {
      let _this = this
      queryByIdCarrier({
        id: _this.id,
        carrierId: _this.carrierId,
        type: 'vehicle'
      }).then(res => {
        if (res.data.code === CODE) {
          _this.infoData = res.data.data
          _this.infoDataInit = Object.assign({}, _this.infoData)
          _this.initData()
        } else {
          _this.$Message.error(res.data.msg)
        }
      })
    },
    // 新增车辆维修记录
    _carrierAddVehicle () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/carrier-vehicle',
        data: {
          title: '新增车辆维修保养记录',
          flag: 1, // 新增
          driverId: _this.driverId,
          carrierId: _this.carrierId,
          carNO: _this.infoData.carNO
        },
        methods: {
          ok () {
            _this.repairFormatInit = Object.assign({}, _this.repairFormat)
          }
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "client.styl"
>>>.ivu-tabs-nav
  font-size: 16px
.tab-head
  margin -15px
  padding 7px 15px
  border-bottom 15px solid #f5f7f9
  /deep/ .ivu-tabs-bar
    border-bottom none
    margin-bottom 1px
    .ivu-tabs-ink-bar
      bottom 2px
.info-detail
  margin-top: 80px;
.btnItem
  margin-top: -40px;
</style>
