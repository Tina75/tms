<template>
  <div class="info-detail">
    <div class="info">
      <div class="title">发货方信息</div>
      <div class="list-info">
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">发货方名称：</span>
            {{list.name}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">发货联系人：</span>
            {{list.contact}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">联系电话：</span>
            {{list.phone}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">结算方式：</span>
            <span v-if="list.payType===1">现付</span>
            <span v-else-if="list.payType===2">到付</span>
            <span v-else-if="list.payType===3">回单付</span>
            <span v-else-if="list.payType===4">月结</span>
            <span v-else></span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">备注：</span>
            {{list.remark}}
          </div>
          </Col>
        </Row>
      </div>
    </div>
    <div class="tabs">
      <Tabs :animated="false">
        <TabPane label="发货地址">
          <div class="add">
            <Button type="primary" @click="_consignerAddressAdd">新增</Button>
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
                    show-elevator show-total @on-change="handleChangePage1"/>
            </template>
          </div>
        </TabPane>
        <TabPane label="收货方">
          <div class="add">
            <Button type="primary" @click="_consignerConsigneeAdd">新增</Button>
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
                    show-elevator show-total @on-change="handleChangePage2"/>
            </template>
          </div>
        </TabPane>
        <TabPane label="常发货物">
          <div class="add">
            <Button type="primary" @click="_consignerCargoAdd">新增</Button>
          </div>
          <template>
            <Table :columns="columns3" :data="data3"></Table>
          </template>
          <div class="footer">
            <template>
              <Page :total="totalCount3"
                    :current.sync="pageNo3" :page-size-opts="pageArray3"
                    size="small"
                    show-sizer
                    show-elevator show-total @on-change="handleChangePage3"/>
            </template>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import { CODE, consignerDetail, consignerAddressList, consignerAddressDelete, consignerConsigneeList, consignerConsigneeDelete, consignerCargoList, consignerCargoDelete } from './client'
export default {
  name: 'sender-info',
  mixins: [ BasePage ],
  metaInfo: {
    title: '发货方详情'
  },
  data () {
    return {
      id: this.$route.query.id, // 发货方id
      list: {
        name: '',
        contact: '',
        phone: '',
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
                      name: 'client/dialog/sender-address',
                      data: {
                        title: '修改发货地址',
                        flag: 2, // 修改
                        id: params.row.id,
                        validate: {
                          address: params.row.address
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
              }, '修改'),
              h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    consignerAddressDelete({
                      id: params.row.id
                    }).then(res => {
                      if (res.data.code === CODE) {
                        this.$Message.success(res.data.msg)
                        this._consignerAddressList() // 刷新页面
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
          title: '收货人',
          key: 'address'
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
                          remark: params.row.remark
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
              }, '修改'),
              h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    consignerConsigneeDelete({
                      id: params.row.id
                    }).then(res => {
                      if (res.data.code === CODE) {
                        this.$Message.success(res.data.msg)
                        this._consignerConsigneeList() // 刷新页面
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
          title: '收货人',
          key: 'contact'
        },
        {
          title: '联系方式',
          key: 'phone'
        },
        {
          title: '发货地址',
          key: 'address'
        },
        {
          title: '备注',
          key: 'remark'
        }
      ],
      columns3: [
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
                      name: 'client/dialog/sender-cargo',
                      data: {
                        title: '修改货品资料',
                        flag: 2, // 修改
                        id: params.row.id,
                        validate: {
                          cargoName: params.row.cargoName,
                          unit: params.row.unit,
                          cargoCost: String(params.row.cargoCost),
                          weight: String(params.row.weight),
                          volume: String(params.row.volume),
                          remark1: params.row.remark1,
                          remark2: params.row.remark2
                        }
                      },
                      methods: {
                        ok () {
                          _this._consignerCargoList() // 刷新页面
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
                    consignerCargoDelete({
                      id: params.row.id
                    }).then(res => {
                      if (res.data.code === CODE) {
                        this.$Message.success(res.data.msg)
                        this._consignerCargoList() // 刷新页面
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
          title: '货品名称',
          key: 'cargoName'
        },
        {
          title: '包装单位',
          key: 'unit'
        },
        {
          title: '货值',
          key: 'cargoCost'
        },
        {
          title: '重量(吨)',
          key: 'weight'
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
      pageNo3: 1
    }
  },
  mounted () {
    this._consignerDetail()
  },
  methods: {
    _consignerDetail () {
      let data = {
        id: this.id
      }
      consignerDetail(data).then(res => {
        if (res.data.code === CODE) {
          let data = res.data.data
          this.list = {
            name: data.name,
            contact: data.contact,
            phone: data.phone,
            payType: data.payType,
            remark: data.remark
          }
          this.data1 = data.addressList.list
          this.totalCount1 = data.addressList.totalCount
          this.data2 = data.consigneeList.list
          this.totalCount2 = data.consigneeList.totalCount
          this.data3 = data.cargoList.list
          this.totalCount3 = data.cargoList.totalCount
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
    handleChangePage2 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo2 = pageNo
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
          title: '新增货品资料',
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
    handleChangePage3 (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo3 = pageNo
      this._consignerCargoList()
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
