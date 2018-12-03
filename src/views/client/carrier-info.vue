<template>
  <div v-if="carrierType === 1" class="info-detail">
    <driver-details></driver-details>
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
      <Tabs :animated="false" style="position:static">
        <TabPane :label="tabPaneLabel">
          <div class="add">
            <Button v-if="hasPower(130207)" type="primary" @click="_carrierAddDriver">新增车辆</Button>
            <Button v-if="hasPower(130210)" @click="carExport">导出</Button>
            <div class="rightSearch">
              <template>
                <Select v-model="selectStatus1" style="width:120px;margin-right: 11px" transfer @on-change="changeState('keyword1', 1)">
                  <Option v-for="item in selectList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </template>
              <Input v-if="selectStatus1 !== '2'"
                     v-model="keyword1"
                     :maxlength="selectStatus1 === '1' ? 8 : 11"
                     :icon="keyword1? 'ios-close-circle' : ''"
                     :placeholder="selectStatus1 === '1' ? '请输入车牌号搜索' : '请输入手机号搜索'"
                     class="search-input"
                     @on-enter="searchCarList"
                     @on-click="clearKeywords('keyword1', 1)"/>
              <Select v-if="selectStatus1 === '2'" v-model="keyword1" class="search-input" transfer @on-change="searchCarList">
                <Option
                  v-for="item in driverTypeList"
                  :value="item.id"
                  :key="item.id">
                  {{ item.name }}
                </Option>
              </Select>
              <Button icon="ios-search" type="primary"
                      class="search-btn-easy"
                      style="float: right;width:41px;"
                      @click="searchCarList">
              </Button>
            </div>
          </div>
          <template>
            <Table :columns="columns1" :loading="loading" :data="data1">
              <div slot="loading">
                <Spin>
                  <img src="../../assets/loading.gif" width="24" height="24" alt="加载中">
                </Spin>
              </div>
            </Table>
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
        <TabPane :label="tabPaneLabe3">
          <ruleForClient :count.sync="totalCount3" :height="ruleHeight" :active="'2'" :partner-id="companyList.carrierId" :partner-name="companyList.carrierName"></ruleForClient>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1, DRIVER_TYPE } from '@/libs/constant/carInfo'
import { CODE, carrierDetailsForCompany, carrierListCar, carrierDeleteDriver, getCarrierNumberCount, CAR } from './client'
import TMSUrl from '@/libs/constant/url'
import ruleForClient from './ruleForClient/index'
import driverDetails from './driver-details'
import Export from '@/libs/js/export'
export default {
  name: 'carrier-info',
  components: {
    ruleForClient,
    driverDetails
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '承运商详情'
  },
  data () {
    return {
      loading: false,
      ruleHeight: 0,
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
        carrierId: null,
        carrierName: '',
        carrierPrincipal: '',
        carrierPhone: '',
        payType: '',
        remark: ''
      },
      CARInit: CAR,
      selectStatus1: '1', // 搜索条件
      selectStatus2: '1',
      driverTypeList: DRIVER_TYPE,
      keyword1: '',
      keyword2: '',
      selectList1: [
        {
          value: '1',
          label: '车牌号'
        },
        {
          value: '2',
          label: '合作方式'
        },
        {
          value: '3',
          label: '司机手机号'
        }
      ],
      columns1: [
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
                      name: 'client/dialog/carrier-driver',
                      data: {
                        title: '修改车辆',
                        flag: 2, // 修改
                        carrierId: this.carrierId,
                        carId: params.row.carId,
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
                          carrierDeleteDriver({
                            carId: params.row.carId
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this._carrierListCar() // 车辆列表也要刷新
                              _this._getCarrierNumberCount()
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
          key: 'carNO',
          width: 80
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
            let text = this.carTypeMap[params.row.carType] + this.carLengthMap[params.row.carLength]
            return h('div', {}, text)
          }
        },
        // {
        //   title: '车长（米）',
        //   key: 'carLength',
        //   render: (h, params) => {
        //     let text = params.row.carLength ? this.carLengthMap[params.row.carLength] : '-'
        //     return h('div', {}, text.slice(0, text.length - 1))
        //   }
        // },
        {
          title: '载重（吨）',
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
            } else if (params.row.regularLine && JSON.parse(params.row.regularLine).length === 2) {
              s1 = JSON.parse(params.row.regularLine)[0].sn === undefined ? '' : JSON.parse(params.row.regularLine)[0].sn
              n1 = JSON.parse(params.row.regularLine)[0].en === undefined ? '' : JSON.parse(params.row.regularLine)[0].en
              s2 = JSON.parse(params.row.regularLine)[1].sn === undefined ? '' : JSON.parse(params.row.regularLine)[1].sn
              n2 = JSON.parse(params.row.regularLine)[1].en === undefined ? '' : JSON.parse(params.row.regularLine)[1].en
            }
            return h('div', [
              h('Tooltip', {
                props: {
                  placement: 'top'
                },
                style: {
                  width: '100%',
                  paddingTop: '6px'
                }
              }, [
                h('span', {
                  slot: 'content'
                }, [h('p', {
                  style: {
                    whiteSpace: 'pre-wrap'
                  }
                }, (s1 + '—' + n1) === '—' ? '' : s1 + '—' + n1),
                h('p', {
                  style: {
                    whiteSpace: 'pre-wrap'
                  }
                }, (s2 + '—' + n2) === '—' ? '' : s2 + '—' + n2)
                ]),
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
            let text = this.formatDateTime(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ],
      data1: [],
      pageArray1: [10, 20, 50],
      pageSize1: 10,
      totalCount1: 0, // 总条数
      pageNo1: 1,
      totalCount3: 0,
      totalTabCount1: 0
    }
  },
  computed: {
    tabPaneLabel () {
      return '车辆信息 ' + (Number(this.totalTabCount1) === 0 ? '' : this.totalTabCount1)
    },
    tabPaneLabe3 () {
      return '计费规则 ' + (Number(this.totalCount3) === 0 ? '' : this.totalCount3)
    }
  },
  mounted () {
    if (this.carrierType === 2) { // 类型为运输公司
      // 获取计费规则的高度
      this.ruleHeight = document.body.clientHeight - 50 - 15 * 2 - 20 + 15 - 174 - 32 - 39 - 16 - 44
      // 获取车辆
      this._getCarrierNumberCount()
      // 承运商信息
      this._carrierDetailsForCompany()
      // 车辆列表
      this._carrierListCar()
    }
  },
  methods: {
    // 日期格式化
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    // 承运商信息查询
    _carrierDetailsForCompany () {
      let data = {
        carrierId: this.carrierId
      }
      carrierDetailsForCompany(data).then(res => {
        if (res.data.code === CODE) {
          let data = res.data.data
          this.companyList = {
            carrierId: data.carrierInfo.carrierId,
            carrierName: data.carrierInfo.carrierName,
            carrierPrincipal: data.carrierInfo.carrierPrincipal,
            carrierPhone: data.carrierInfo.carrierPhone,
            payType: data.carrierInfo.payType,
            remark: data.carrierInfo.remark === '' ? '无' : data.carrierInfo.remark
          }
        }
      })
    },
    // 新增车辆
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
            _this._getCarrierNumberCount()
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
      this.loading = true
      carrierListCar(data).then(res => {
        if (res.data.code === CODE) {
          this.data1 = res.data.data.list
          this.totalCount1 = res.data.data.totalCount
          this.loading = false
        }
      })
    },
    // 获取tab-number的数量值
    _getCarrierNumberCount () {
      let data = {
        carrierId: this.carrierId
      }
      getCarrierNumberCount(data).then(res => {
        if (res.data.code === CODE) {
          this.totalTabCount1 = res.data.data.carriersCarNum
        }
      })
    },
    // 导出车辆信息
    carExport () {
      if (Number(this.totalCount1) < 1) {
        this.$Message.error('导出内容为空')
        return
      }
      let data = {
        carrierId: this.carrierId
      }
      if (this.selectStatus1 === '1') {
        data.carNO = this.keyword1
      } else if (this.selectStatus1 === '2') {
        data.driverType = this.keyword1
      } else if (this.selectStatus1 === '3') {
        data.driverPhone = this.keyword1
      }
      Export({
        url: '/carrier/carlist/export',
        method: 'post',
        data,
        fileName: '车辆信息报表'
      })
    },
    changeState (val, flag) { // 车辆 & 维修记录 select框变动，关键字清除
      if ((this.selectStatus1 === '2' && flag === 1)) {
        this[val] = '1'
      }
      if (flag === 1) {
        this.searchCarList()
      }
    },
    searchCarList () { // 搜索车辆信息列表
      if (this.selectStatus1 === '3' && !(/^[0-9]*$/.test(this.keyword1))) { // 手机号
        this.$Message.error('手机号格式输入错误')
        return
      }
      // 车辆 - 根据条件查询
      let data = {
        carrierId: this.carrierId,
        pageNo: this.pageNo2,
        pageSize: this.pageSize2
      }
      if (this.selectStatus1 === '1') {
        data.carNO = this.keyword1
      } else if (this.selectStatus1 === '2') {
        data.driverType = Number(this.keyword1)
      } else if (this.selectStatus1 === '3') {
        data.driverPhone = this.keyword1
      }
      this.loading = true
      carrierListCar(data).then(res => {
        if (res.data.code === CODE) {
          this.data1 = res.data.data.list
          this.totalCount1 = res.data.data.totalCount
          this.loading = false
        }
      })
    },
    clearKeywords (val, flag) {
      this[val] = ''
      if ((val === 'keyword1' && flag === 1)) {
        this.searchCarList()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "client.styl"
  .tabs
    .ivu-tabs
      overflow visible
  .footer
    margin-top 22px
    display flex
    display -ms-flexbox
    justify-content flex-end
    -ms-flex-pack end
  /*.ivu-tabs*/
    /*padding-bottom: 120px!important*/
</style>
