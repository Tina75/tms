<template>
  <div>
    <div class="tab-head">
      <Tabs :animated="false" @on-click="clickTitleTab">
        <TabPane label="车辆信息详情" name="car">
        </TabPane>
        <TabPane label="维修记录汇总" name="repair">
        </TabPane>
        <TabPane label="车辆保险汇总" name="insurance">
        </TabPane>
        <TabPane label="车辆年检汇总" name="check">
        </TabPane>
        <TabPane label="轮胎管理汇总" name="tyre">
        </TabPane>
      </Tabs>
    </div>
    <!-- 车辆信息详情 -->
    <div v-if="showTable === 'car'" class="info-detail">
      <div class="info">
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">基础信息</span>
          <div class="btnItem">
            <Button v-if="hasPower(190203)" class="btnSty"  @click="removeCar">删除</Button>
            <Button v-if="hasPower(190202)" type="primary" class="btnSty" @click="updateCar">修改</Button>
          </div>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">车牌号：</span>
              {{infoData.carNo}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">车型：</span>
              {{infoData.carTypeInit}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">车长：</span>
              {{infoData.carLengthInit}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">载重：</span>
              <span v-if="infoData.shippingWeight !== ''">{{infoData.shippingWeight}}吨</span>
              <span v-else>-</span>
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">净空：</span>
              <span v-if="infoData.shippingVolume !== ''">{{infoData.shippingVolume}}吨</span>
              <span v-else>-</span>
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">车辆品牌：</span>
              {{infoData.carBrand || '-'}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">主司机：</span>
              {{infoData.driverName  || '-'}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">副司机：</span>
              {{infoData.assistantDriverName  || '-'}}
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">购买日期：</span>
              {{formatDate(infoData.purchDate)  || '-'}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">挂车号：</span>
              <span v-if="infoData.trailerNo">{{infoData.trailerNo}}挂</span>
              <span v-else>-</span>
            </div>
            </Col>
          </Row>
        </div>
        <div class="title" style="margin-top: 40px;">
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
        </div>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">证件照片</span>
        </div>
        <Row class="list-info">
          <div v-for="img in imageItems" :key="img.index" class="infoImage">
            <div :v-if="img">
              <div-image
                :src="img.src"
                class="fileImage"
                @click.native="handleView(img.count)">
              </div-image>
              <p class="titleInput">{{ img.title }}</p>
            </div>
          </div>
        </Row>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">备注</span>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col span="20">
            {{infoData.remark}}
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <!-- 维修记录汇总 -->
    <div v-if="showTable === 'repair'">
      <div class="addRepair">
        <Button v-if="hasPower(190301)" type="primary" @click="editRepair">新增维修保养</Button>
        <Button v-if="hasPower(190304)" class="buttonSty" @click="carExport">导出</Button>
      </div>
      <page-table
        :columns="menuColumns"
        :keywords="repairFormatInit"
        class="pageTable"
        url="/ownerCar/repair/list"
        list-field="list"
        method="post"
        @on-load="handleLoad">
      </page-table>
    </div>
    <!-- 车辆保险汇总 -->
    <div v-show="showTable === 'insurance'">
      <div class="addRepair">
        <Button v-if="hasPower(190401)" type="primary" @click="editInsurance">新增车辆保险</Button>
        <Button v-if="hasPower(190404)" class="buttonSty" @click="exporteditInsurance">导出</Button>
      </div>
      <page-table
        :columns="insuranceColumns"
        :keywords="insuranceFormInit"
        :show-filter="true"
        table-head-type="car_insurance"
        class="pageTable"
        url="/ownerCar/insurance/list"
        list-field="list"
        method="post"
        @on-load="handleLoad">
      </page-table>
    </div>
    <!-- 年检 -->
    <div v-if="showTable === 'check'">
      <div class="addRepair">
        <Button v-if="hasPower(190501)" type="primary" @click="editCheck">新增车辆年检</Button>
        <Button v-if="hasPower(190504)" class="buttonSty" @click="exportCheck">导出</Button>
      </div>
      <page-table
        :columns="checkColumns"
        :keywords="checkFormInit"
        class="pageTable"
        url="/ownerCar/check/list"
        list-field="list"
        method="post"
        @on-load="handleLoad">
      </page-table>
    </div>
    <!-- 轮胎 -->
    <div v-if="showTable === 'tyre'">
      <div class="addRepair">
        <Button v-if="hasPower(190601)" type="primary" @click="editTyre">新增轮胎管理</Button>
        <Button v-if="hasPower(190604)" class="buttonSty" @click="exportTyre">导出</Button>
      </div>
      <page-table
        :columns="tyreColumns"
        :keywords="tyreFormInit"
        class="pageTable"
        url="/ownerCar/tire/list"
        list-field="list"
        method="post"
        @on-load="handleLoad">
      </page-table>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import RecordList from '@/components/RecordList'
import prepareOpenSwipe from '@/components/swipe/index'
import { CODE, deleteCarById, queryCarById, deleteRepairById } from './client'
import pageTable from '@/components/page-table'
import TMSUrl from '@/libs/constant/url'
import Export from '@/libs/js/export'
import { mapActions } from 'vuex'
import { renderFee, renderMileage } from '@/libs/js/config'
import DivImage from '@/components/DivImage.vue'
export default {
  name: 'owned-car-details',
  components: { RecordList, prepareOpenSwipe, pageTable, Export, DivImage },
  mixins: [ BasePage ],
  metaInfo: {
    title: '车辆详情'
  },
  data () {
    return {
      showTable: 'car',
      exportFile: true,
      infoData: {},
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      line1: '',
      line2: '',
      searchLogData: {},
      imageItems: [],
      repairFormatInit: {},
      insuranceFormInit: {},
      checkFormInit: {},
      tyreFormInit: {},
      infoDataId: '',
      carNo: '',
      menuColumns: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(190302)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    var vm = this
                    this.openDialog({
                      name: 'owned-vehicle/dialog/edit-repair',
                      data: {
                        title: '修改维修保养',
                        flag: 2, // 修改
                        validate: { ...params.row, repairDate: new Date(params.row.repairDate) }
                      },
                      methods: {
                        ok () {
                          vm.searchRepairByCar()
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
                    path: TMSUrl.OWNEDVEHICLE_REPAIRDETAILS,
                    query: {
                      id: '维修详情',
                      rowData: params.row,
                      carrierId: this.carrierId
                    }
                  })
                }
              }
            }, '查看'))
            if (this.hasPower(190303)) {
              renderBtn.push(h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let vm = this
                    this.openDialog({
                      name: 'owned-vehicle/dialog/confirmDelete',
                      data: {
                      },
                      methods: {
                        ok () {
                          deleteRepairById({ id: params.row.id }).then(res => {
                            if (res.data.code === CODE) {
                              vm.$Message.success('删除成功！')
                            }
                          }).then(() => {
                            vm.searchRepairByCar()
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
          title: '维修费用（元）',
          key: 'repairMoney',
          render: (h, params) => {
            return renderFee(h, params.row.repairMoney)
            // return h('span', Number(params.row.repairMoney) / 100)
          }
        },
        {
          title: '已支付费用（元）',
          key: 'payMoney',
          render: (h, params) => {
            return renderFee(h, params.row.payMoney)
            // return h('span', Number(params.row.payMoney) / 100)
          }
        },
        {
          title: '未支付费用（元）',
          key: 'waitPayMoney',
          render: (h, params) => {
            return renderFee(h, params.row.waitPayMoney)
            // return h('span', Number(params.row.waitPayMoney) / 100)
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
      ],
      insuranceColumns: [
        {
          title: '操作',
          key: 'action',
          width: 150,
          fixed: 'left',
          extra: true,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(190402)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let vm = this
                    this.openDialog({
                      name: 'owned-vehicle/dialog/edit-insurance',
                      data: {
                        title: '修改保险',
                        flag: 2, // 修改
                        validate: {
                          ...params.row,
                          buyDate: new Date(params.row.buyDate).Format('yyyy-MM-dd'),
                          effectDate: new Date(params.row.effectDate).Format('yyyy-MM-dd'),
                          expireDate: new Date(params.row.expireDate).Format('yyyy-MM-dd')
                        }
                      },
                      methods: {
                        ok () {
                          vm.insuranceFormInit = { carNo: vm.infoData.carNo }
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
                  this.$router.push({ name: 'insurance-details', query: { rowData: params.row } })
                }
              }
            }, '查看'))
            if (this.hasPower(190403)) {
              renderBtn.push(h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let vm = this
                    this.$Toast.confirm({
                      title: '提示',
                      content: '确定删除吗？',
                      onOk () {
                        vm.insuranceDeleteById({ id: params.row.id }).then(() => {
                          vm.$Message.success('删除成功！')
                        }).then(() => {
                          vm.insuranceFormInit = { carNo: vm.infoData.carNo }
                        })
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
          title: '保单号',
          key: 'invoiceNo'
        },
        {
          title: '保险公司',
          key: 'insuranceCompanyName'
        },
        {
          title: '车牌号',
          key: 'carNo'
        },
        {
          title: '总金额（元）',
          key: 'totalFee',
          render: (h, params) => {
            return renderFee(h, params.row.totalFee)
            // return h('div', Number(params.row.totalFee) / 100)
          }
        },
        {
          title: '购买日期',
          key: 'buyDate',
          render: (h, params) => {
            let text = this.formatDate(params.row.buyDate)
            return h('div', text)
          }
        },
        {
          title: '生效日期',
          key: 'effectDate',
          render: (h, params) => {
            let text = this.formatDate(params.row.effectDate)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '失效日期',
          key: 'expireDate',
          render: (h, params) => {
            let text = this.formatDate(params.row.expireDate)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '交强险金额（元）',
          key: 'trafficFee',
          render: (h, params) => {
            return renderFee(h, params.row.trafficFee)
            // return h('div', Number(params.row.trafficFee) / 100)
          }
        },
        {
          title: '商业险金额（元）',
          key: 'businessFee',
          render: (h, params) => {
            return renderFee(h, params.row.businessFee)
            // return h('div', Number(params.row.businessFee) / 100)
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          render: (h, params) => {
            let text = this.formatDateTime(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ],
      checkColumns: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(190502)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let vm = this
                    this.openDialog({
                      name: 'owned-vehicle/dialog/edit-check',
                      data: {
                        title: '修改年检',
                        flag: 4, // 修改
                        validate: { ...params.row, checkDate: new Date(params.row.checkDate), nextCheckDate: new Date(params.row.nextCheckDate) }
                      },
                      methods: {
                        ok () {
                          vm.checkFormInit = { carNo: vm.infoData.carNo }
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
                  this.$router.push({ name: 'check-details', query: { rowData: params.row } })
                }
              }
            }, '查看'))
            if (this.hasPower(190503)) {
              renderBtn.push(h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let vm = this
                    this.$Toast.confirm({
                      title: '提示',
                      content: '确定删除吗？',
                      onOk () {
                        vm.checkDeleteById({ id: params.row.id }).then(res => {
                          vm.$Message.success('删除成功！')
                        }).then(() => {
                          vm.checkFormInit = { carNo: vm.infoData.carNo }
                        })
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
          title: '金额（元）',
          key: 'cost',
          render: (h, params) => {
            return renderFee(h, params.row.cost)
            // return h('span', Number(params.row.cost) / 100)
          }
        },
        {
          title: '年检日期',
          key: 'checkDate',
          render: (h, params) => {
            let text = this.formatDate(params.row.checkDate)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '下次年检日期',
          key: 'nextCheckDate',
          render: (h, params) => {
            let text = this.formatDate(params.row.nextCheckDate)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          // sortable: 'custom',
          render: (h, params) => {
            let text = this.formatDateTime(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ],
      tyreColumns: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(190602)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let vm = this
                    this.openDialog({
                      name: 'owned-vehicle/dialog/edit-tyre',
                      data: {
                        title: '修改轮胎',
                        flag: 4, // 修改
                        validate: { ...params.row, setupDate: new Date(params.row.setupDate) }
                      },
                      methods: {
                        ok () {
                          vm.tyreFormInit = { carNo: vm.infoData.carNo }
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
                  this.$router.push({ name: 'tyre-details', query: { rowData: params.row } })
                }
              }
            }, '查看'))
            if (this.hasPower(190603)) {
              renderBtn.push(h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let vm = this
                    this.$Toast.confirm({
                      title: '提示',
                      content: '确定删除吗？',
                      onOk () {
                        vm.tyreDeleteById({ id: params.row.id }).then(res => {
                          vm.$Message.success('删除成功！')
                        }).then(() => {
                          vm.tyreFormInit = { carNo: vm.infoData.carNo }
                        })
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
          title: '金额（元）',
          key: 'cost',
          render: (h, params) => {
            return renderFee(h, params.row.cost)
            // return h('span', Number(params.row.cost) / 100)
          }
        },
        {
          title: '轮胎品牌',
          key: 'tireBrand'
        },
        {
          title: '轮胎型号',
          key: 'tireModel'
        },
        {
          title: '换上公里数（公里）',
          key: 'setupMileage',
          render: (h, params) => {
            return renderMileage(h, params.row.setupMileage)
            // return h('span', Number(params.row.setupMileage) / 1000)
          }
        },
        {
          title: '换下公里数（公里）',
          key: 'uninstallMileage',
          render: (h, params) => {
            return renderMileage(h, params.row.uninstallMileage)
            // return h('span', Number(params.row.uninstallMileage) / 1000)
          }
        },
        {
          title: '安装日期',
          key: 'setupDate',
          render: (h, params) => {
            let text = this.formatDate(params.row.setupDate)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '创建日期',
          key: 'createTime',
          sortable: 'custom',
          render: (h, params) => {
            let text = this.formatDateTime(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ]
    }
  },
  created () {
    this.infoDataId = this.$route.query.rowDataId
    this.carNo = this.$route.query.carNo
  },
  mounted () {
    this.queryById()
    this.searchRepairByCar()
  },
  methods: {
    ...mapActions(['insuranceDeleteById', 'checkDeleteById', 'tyreDeleteById']),
    // 切换头部tab
    clickTitleTab (val) {
      this.showTable = val
    },
    queryById () {
      let vm = this
      vm.insuranceFormInit = { carNo: vm.carNo }
      vm.checkFormInit = { carNo: vm.carNo }
      vm.tyreFormInit = { carNo: vm.carNo }
      queryCarById({ carId: vm.infoDataId }).then(res => {
        if (res.data.code === CODE) {
          vm.infoData = res.data.data
          vm.initData()
          // 大图预览
          vm.openSwipe = prepareOpenSwipe(vm.imageItems)
        }
      }).catch(() => {
        this.$Toast.warning({
          title: '提示',
          content: '车辆信息不存在，请刷新列表',
          onOk () {
            vm.ema.fire('closeTab', vm.$route)
          },
          onCancel () {
            vm.ema.fire('closeTab', vm.$route)
          }
        })
      })
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
      this.imageItems = []
      let count = 0
      for (const key in this.infoData) {
        if (key === 'travelPhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '行驶证', src: this.infoData.travelPhoto, count: count })
          count++
        }
        if (key === 'roadTransPhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '道路运输证', src: this.infoData.roadTransPhoto, count: count })
          count++
        }
      }
      this.infoData.carTypeInit = this.carTypeMap[this.infoData.carType]
      this.infoData.carLengthInit = this.carLengthMap[this.infoData.carLength]
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
    removeCar () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
            deleteCarById({ carId: vm.infoData.id }).then(res => {
              if (res.data.code === CODE) {
                vm.$Message.success('删除成功！')
                vm.ema.fire('closeTab', vm.$route)
              }
            })
          }
        }
      })
    },
    updateCar () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-car',
        data: {
          title: '修改车辆',
          flag: 2,
          validate: { ...vm.infoData, purchDate: new Date(vm.infoData.purchDate) }
        },
        methods: {
          ok () {
            vm.queryById()
          }
        }
      })
    },
    handleView (index) {
      this.openSwipe(index)
    },
    // 新增车辆维修记录
    editRepair () {
      var vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-repair',
        data: {
          title: '新增维修保养',
          flag: 1, // 新增
          carNo: vm.infoData.carNo
        },
        methods: {
          ok () {
            vm.searchRepairByCar()
          }
        }
      })
    },
    // 导出判空
    handleLoad (response) {
      try {
        if (response.data.data.list.length >= 1) this.exportFile = true
        else this.exportFile = false
      } catch (error) {
        this.exportFile = false
      }
    },
    // 导出维修信息
    carExport () {
      if (!this.exportFile) {
        this.$Message.error('导出内容为空')
        return
      }
      let params = { carNo: this.infoData.carNo }
      Export({
        url: '/ownerCar/repair/export',
        method: 'post',
        data: params,
        fileName: '导出维修列表'
      })
    },
    searchRepairByCar () {
      this.repairFormatInit = { carNo: this.infoData.carNo }
    },
    // 保险
    editInsurance () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-insurance',
        data: {
          title: '新增保险',
          flag: 3, // 新增,
          validate: { carNo: vm.infoData.carNo }
        },
        methods: {
          ok () {
            vm.insuranceFormInit = { carNo: vm.infoData.carNo }
          }
        }
      })
    },
    exporteditInsurance () {
      if (!this.exportFile) {
        this.$Message.error('导出内容为空')
        return
      }
      let params = this.insuranceFormInit
      Export({
        url: '/ownerCar/insurance/export',
        method: 'post',
        data: params,
        fileName: '导出保险列表'
      })
    },
    editCheck () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-check',
        data: {
          title: '新增年检',
          flag: 3, // 新增
          validate: { carNo: vm.infoData.carNo }
        },
        methods: {
          ok () {
            vm.checkFormInit = { carNo: vm.infoData.carNo }
          }
        }
      })
    },
    exportCheck () {
      if (!this.exportFile) {
        this.$Message.error('导出内容为空')
        return
      }
      let params = this.checkFormInit
      Export({
        url: '/ownerCar/check/export',
        method: 'post',
        data: params,
        fileName: '导出车辆年检'
      })
    },
    editTyre () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-tyre',
        data: {
          title: '新增轮胎',
          flag: 3, // 新增
          validate: { carNo: vm.infoData.carNo }
        },
        methods: {
          ok () {
            vm.tyreFormInit = { carNo: vm.infoData.carNo }
          }
        }
      })
    },
    exportTyre () {
      if (!this.exportFile) {
        this.$Message.error('导出内容为空')
        return
      }
      let params = this.tyreFormInit
      Export({
        url: '/ownerCar/tire/export',
        method: 'post',
        data: params,
        fileName: '导出轮胎管理'
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
