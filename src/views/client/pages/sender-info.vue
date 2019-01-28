<template>
  <div class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">发货方信息</span>
      </div>
      <div :class="{'list-hide': isShow}" class="list-info">
        <Row class="row">
          <Col span="8">
          <div>
            <span class="label">发货方名称：</span>
            {{list.name}}
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">发货联系人：</span>
            {{list.contact}}
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">联系电话：</span>
            {{list.phone}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="8">
          <div>
            <span class="label">提货方式：</span>
            <span>{{pickupsFindName(list.pickUp)}}</span>
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">结算方式：</span>
            <span>{{settlementsFindName(list.payType)}}</span>
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">是否开票：</span>
            <span v-if="list.isInvoice" v-text="list.isInvoice === 1 ? `是（${rate(list.invoiceRate)}%）` : '否'">现付</span>
            <span v-else>-</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="8">
          <div>
            <span class="label">开拓渠道：</span>
            <span>{{exploiteChannelFindName(list.exploiteChannel)}}</span>
          </div>
          </Col>
          <Col span="8">
          <div>
            <span class="label">对接业务员：</span>
            <span v-if="list.salesName" v-text="list.salesName"></span>
            <span v-else>-</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="24">
          <div>
            <span class="label">备注：</span>
            <span v-if="list.remark">{{list.remark}}</span>
            <span v-else>-</span>
          </div>
          </Col>
        </Row>
      </div>
    </div>
    <div class="tabs">
      <Tabs :animated="false" @on-click="tabsClick">
        <TabPane :label="tabPaneLabel">
          <div class="add">
            <Button v-if="hasPower(130104)"  type="primary" @click="_consignerAddressAdd">新增</Button>
          </div>
          <template>
            <page-table
              :columns="columns1"
              :data="data1"
              list-field="list">
            </page-table>
          </template>
        </TabPane>
        <TabPane :label="tabPaneLabe2">
          <div class="add">
            <Button v-if="hasPower(130107)" type="primary"  @click="_consignerConsigneeAdd">新增</Button>
            <Button v-if="hasPower(130116)" type="default" @click="_consignerConsigneeAddAll">批量导入</Button>
          </div>
          <template>
            <page-table
              :columns="columns2"
              :data="data2"
              list-field="list">
            </page-table>
          </template>
        </TabPane>
        <TabPane :label="tabPaneLabe3">
          <div class="add">
            <Button v-if="hasPower(130110)" type="primary" @click="_consignerCargoAdd">新增</Button>
            <Button v-if="hasPower(130110)" type="default" @click="_consignerCargoAddAll">批量导入</Button>
          </div>
          <template>
            <page-table
              :columns="columns3"
              :show-filter="true"
              :table-head-type="headType"
              :data="data3"
              list-field="list">
            </page-table>
          </template>
        </TabPane>
        <TabPane :label="tabPaneLabe4" name="rule">
          <ruleForClient :count.sync="totalCount4" :height="ruleHeight" :active="'1'" :partner-id="list.id"  :partner-name="list.name"></ruleForClient>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import ruleForClient from './ruleForClient/index'
import { CODE, consignerDetail, consignerAddressList, consignerAddressDelete, consignerConsigneeList, consignerConsigneeDelete, consignerCargoList, consignerCargoDelete } from './client'
import pageTable from '@/components/page-table'
import float from '@/libs/js/float'
import headType from '@/libs/constant/headtype'
import { divideFeeOrNull, renderFee } from '@/libs/js/config'
import { settlementsFindName } from '@/libs/constant/settlement.js'
import { pickupsFindName } from '@/libs/constant/pickup.js'
import { exploiteChannelFindName } from '@/libs/constant/orderCreate.js'
// 是否包含省市
const hasCity = (val, cityName) => {
  return val.indexOf(cityName) === 0 || val.indexOf('省') > -1 || val.indexOf('市') > -1
}
export default {
  name: 'sender-info',
  components: {
    ruleForClient,
    pageTable
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '发货方详情'
  },
  data () {
    return {
      headType: headType.CONSIGNER_CARGO,
      loading: false,
      id: this.$route.query.id, // 发货方id
      ruleHeight: 0,
      list: {
        name: '',
        contact: '',
        phone: '',
        payType: '',
        remark: '',
        id: null,
        pickUp: null,
        exploiteChannel: null
      },
      columns1: [
        {
          title: '操作',
          key: 'id',
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130105)) {
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
                      name: 'client/dialog/sender-address',
                      data: {
                        title: '修改发货地址',
                        flag: 2, // 修改
                        id: params.row.id,
                        validate: {
                          address: params.row.address,
                          longitude: params.row.longitude,
                          latitude: params.row.latitude,
                          mapType: params.row.mapType,
                          city: params.row.cityCode,
                          consignerHourseNumber: params.row.consignerHourseNumber
                        }
                      },
                      methods: {
                        ok () {
                          _this._consignerAddressList() // 刷新页面
                        }
                      }
                    })
                  }
                }
              }, '修改'))
            }
            if (this.hasPower(130106)) {
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
                          consignerAddressDelete({
                            id: params.row.id
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this._consignerAddressList() // 刷新页面
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
          title: '发货地址',
          key: 'address',
          render: (h, params) => {
            let text = params.row.address
            if (params.row.consignerHourseNumber) {
              text += params.row.consignerHourseNumber
            }
            return h('span', hasCity(text, params.row.cityName) ? text : params.row.cityName + text)
          }
        }
      ],
      columns2: [
        {
          title: '操作',
          key: 'id',
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130108)) {
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
                      name: 'client/dialog/sender-consignee',
                      data: {
                        title: '修改收货方',
                        flag: 2, // 修改
                        id: params.row.id,
                        validate: {
                          contact: params.row.contact,
                          phone: params.row.phone,
                          address: params.row.address,
                          remark: params.row.remark,
                          longitude: params.row.longitude,
                          latitude: params.row.latitude,
                          mapType: params.row.mapType,
                          cityCode: params.row.cityCode,
                          consignerHourseNumber: params.row.consignerHourseNumber,
                          consigneeCompanyName: params.row.consigneeCompanyName
                        }
                      },
                      methods: {
                        ok () {
                          _this._consignerConsigneeList() // 刷新页面
                        }
                      }
                    })
                  }
                }
              }, '修改'))
            }
            if (this.hasPower(130109)) {
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
                          consignerConsigneeDelete({
                            id: params.row.id
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this._consignerConsigneeList() // 刷新页面
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
          title: '收货人',
          key: 'contact'
        },
        {
          title: '联系方式',
          key: 'phone'
        },
        {
          title: '收货地址',
          key: 'address',
          render: (h, params) => {
            let text = params.row.address
            if (params.row.consignerHourseNumber) {
              text += params.row.consignerHourseNumber
            }

            return h('span', hasCity(text, params.row.cityName) ? text : params.row.cityName + text)
          }
        },
        {
          title: '收货人单位',
          key: 'consigneeCompanyName'
        },
        {
          title: '备注',
          key: 'remark',
          render (h, params) {
            let text = ''
            if (params.row.remark === '' || params.row.remark === null) {
              text = '-'
            } else {
              text = params.row.remark
            }
            return h('span', {}, text)
          }
        }
      ],
      columns3: [
        {
          title: '操作',
          key: 'id',
          width: 100,
          fixed: 'left',
          extra: true,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130111)) {
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
                      name: 'client/dialog/sender-cargo',
                      data: {
                        title: '修改常发货物',
                        flag: 2, // 修改
                        id: params.row.id,
                        validate: {
                          ...params.row,
                          cargoName: params.row.cargoName,
                          unit: params.row.unit,
                          cargoCost: divideFeeOrNull(params.row.cargoCost),
                          weight: String(params.row.weight),
                          weightKg: String(params.row.weightKg),
                          volume: String(params.row.volume),
                          remark1: params.row.remark1,
                          remark2: params.row.remark2
                        },
                        volumeLength: params.row.dimension ? params.row.dimension.length : null,
                        volumeWidth: params.row.dimension ? params.row.dimension.width : null,
                        volumeHeight: params.row.dimension ? params.row.dimension.height : null
                      },
                      methods: {
                        ok () {
                          _this._consignerCargoList() // 刷新页面
                        }
                      }
                    })
                  }
                }
              }, '修改'))
            }
            if (this.hasPower(130112)) {
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
                          consignerCargoDelete({
                            id: params.row.id
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this._consignerCargoList() // 刷新页面
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
          title: '货品名称',
          key: 'cargoName',
          ellipsis: true,
          tooltip: true
        },
        {
          title: '货物编码',
          key: 'cargoNo'
        },
        {
          title: '货值',
          key: 'cargoCost',
          render (h, params) {
            // return h('div', {}, divideFee(params.row.cargoCost))
            return renderFee(h, params.row.cargoCost)
          }
        },
        {
          title: '包装方式',
          key: 'unit'
        },
        {
          title: '包装尺寸',
          key: 'dimension',
          render (h, params) {
            if (params.row.dimension) {
              if (params.row.dimension.length === '' && params.row.dimension.width === '' && params.row.dimension.height === '') return h('span', {}, '-')
              let text = ''
              text += params.row.dimension.length !== '' ? (params.row.dimension.length + '*') : ''
              text += params.row.dimension.width !== '' ? (params.row.dimension.width + '*') : ''
              text += params.row.dimension.height !== '' ? params.row.dimension.height : ''
              return h('span', {}, text)
            } else {
              return h('span', {}, '-')
            }
          }
        },
        {
          title: '重量(吨)',
          key: 'weight'
        },
        {
          title: '重量(公斤)',
          key: 'weightKg'
        },
        {
          title: '体积(方)',
          key: 'volume'
        },
        {
          title: '备注1',
          key: 'remark1'
        },
        {
          title: '备注2',
          key: 'remark2'
        }
      ],
      data1: [],
      data2: [],
      data3: [],
      pageArray1: [10, 20, 50, 100],
      pageSize1: 10,
      totalCount1: 0, // 总条数
      pageNo1: 1,
      pageArray2: [10, 20, 50, 100],
      pageSize2: 10,
      totalCount2: 0, // 总条数
      pageNo2: 1,
      pageArray3: [10, 20, 50, 100],
      pageSize3: 10,
      totalCount3: 0, // 总条数
      pageNo3: 1,
      totalCount4: 0,
      isShow: false,
      ConsigneeDownLoadUrl: '',
      CargoDownLoadUrl: ''
    }
  },
  computed: {
    tabPaneLabel () {
      return '发货地址 ' + (Number(this.totalCount1) === 0 ? '' : this.totalCount1)
    },
    tabPaneLabe2 () {
      return '收货方 ' + (Number(this.totalCount2) === 0 ? '' : this.totalCount2)
    },
    tabPaneLabe3 () {
      return '常发货物 ' + (Number(this.totalCount3) === 0 ? '' : this.totalCount3)
    },
    tabPaneLabe4 () {
      return '计费规则 ' + (Number(this.totalCount4) === 0 ? '' : this.totalCount4)
    }
  },
  mounted () {
    this._consignerDetail()
    this.ruleHeight = document.body.clientHeight - 90 - 15 * 2 - 20 + 15 - 174 - 32 - 39 - 16 - 44 + 146
  },
  methods: {
    settlementsFindName (val) {
      return settlementsFindName(val)
    },
    pickupsFindName (val) {
      return pickupsFindName(val)
    },
    exploiteChannelFindName (val) {
      return exploiteChannelFindName(val)
    },
    tabsClick (name) {
      if (name === 'rule') {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    _consignerDetail () {
      let data = {
        id: this.id
      }
      this.loading = true
      consignerDetail(data).then(res => {
        if (res.data.code === CODE) {
          let data = res.data.data
          this.list = {
            id: data.id,
            name: data.name,
            contact: data.contact,
            phone: data.phone,
            payType: data.payType,
            remark: data.remark,
            invoiceRate: data.invoiceRate,
            isInvoice: data.isInvoice,
            salesName: data.salesName,
            pickUp: data.pickUp,
            exploiteChannel: data.exploiteChannel
          }
          this.loading = false
          this.data1 = data.addressList.list
          this.totalCount1 = data.addressList.totalCount
          this.data2 = data.consigneeList.list
          this.totalCount2 = data.consigneeList.totalCount
          this.data3 = data.cargoList.list
          this.totalCount3 = data.cargoList.totalCount
          this.ConsigneeDownLoadUrl = data.importConsigneeTemplet
          // 临时 undefied 时 ''
          this.CargoDownLoadUrl = data.importCargoTemplet || ''
        }
      })
    },
    // 发货地址列表，新增，删除，修改
    _consignerAddressList () {
      let data = {
        consignerId: this.id,
        pageNo: this.pageNo1,
        pageSize: this.pageSize1
      }
      consignerAddressList(data).then(res => {
        if (res.data.code === CODE) {
          this.data1 = res.data.data.list
          this.totalCount1 = res.data.data.totalCount
        }
      })
    },
    _consignerAddressAdd () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/sender-address',
        data: {
          title: '新增发货地址',
          flag: 1, // 新增
          consignerId: this.id
        },
        methods: {
          ok () {
            _this._consignerAddressList() // 刷新页面
          }
        }
      })
    },
    handleChangePage1 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo1 = pageNo
      this._consignerAddressList()
    },
    handleChangePageSize1 (pageSize) {
      this.pageSize1 = pageSize
      this._consignerAddressList()
    },
    // 收货方列表，新增，删除，修改
    _consignerConsigneeList () {
      let data = {
        consignerId: this.id,
        pageNo: this.pageNo2,
        pageSize: this.pageSize2
      }
      consignerConsigneeList(data).then(res => {
        if (res.data.code === CODE) {
          this.data2 = res.data.data.list
          this.totalCount2 = res.data.data.totalCount
        }
      })
    },
    _consignerConsigneeAdd () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/sender-consignee',
        data: {
          title: '新增收货方',
          flag: 1, // 新增
          consignerId: this.id
        },
        methods: {
          ok () {
            _this._consignerConsigneeList() // 刷新页面
          }
        }
      })
    },
    // 收货方批量导入
    _consignerConsigneeAddAll () {
      const self = this
      this.openDialog({
        name: 'client/dialog/batch-import',
        data: {
          title: '批量导入',
          downLoadUrl: this.ConsigneeDownLoadUrl,
          notifyRequestUrl: 'consigner/consignee/importList'
        },
        methods: {
          ok: () => {
            self._consignerConsigneeList()
          }
        }
      })
    },
    handleChangePage2 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo2 = pageNo
      this._consignerConsigneeList()
    },
    handleChangePageSize2 (pageSize) {
      this.pageSize2 = pageSize
      this._consignerConsigneeList()
    },
    // 常发货物列表，新增，删除，修改
    _consignerCargoList () {
      let data = {
        consignerId: this.id,
        pageNo: this.pageNo3,
        pageSize: this.pageSize3
      }
      consignerCargoList(data).then(res => {
        if (res.data.code === CODE) {
          this.data3 = res.data.data.list
          this.totalCount3 = res.data.data.totalCount
        }
      })
    },
    _consignerCargoAdd () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/sender-cargo',
        data: {
          title: '新增常发货物',
          flag: 1, // 新增
          consignerId: this.id
        },
        methods: {
          ok () {
            _this._consignerCargoList() // 刷新页面
          }
        }
      })
    },
    // 常发货物批量导入
    _consignerCargoAddAll () {
      const self = this
      this.openDialog({
        name: 'client/dialog/batch-import',
        data: {
          title: '导入常发货物',
          downLoadUrl: this.CargoDownLoadUrl,
          notifyRequestUrl: 'consigner/cargo/importList'
        },
        methods: {
          ok: () => {
            self._consignerCargoList()
          }
        }
      })
    },
    handleChangePage3 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo3 = pageNo
      this._consignerCargoList()
    },
    handleChangePageSize3 (pageSize) {
      this.pageSize3 = pageSize
      this._consignerCargoList()
    },
    rate (value) {
      return float.floor(float.round(value * 100), 2)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "client.styl"
  .list-hide
    display none
  .footer
    margin-top 22px
    display flex
    display -ms-flexbox
    justify-content flex-end
    -ms-flex-pack end
  .tabs
    .ivu-tabs
      overflow visible
</style>
