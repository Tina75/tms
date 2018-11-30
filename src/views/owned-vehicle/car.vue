<template>
  <div>
    <div class="add">
      <Button v-if="hasPower(130207)" type="primary" @click="editCar">新增车辆</Button>
      <div class="rightSearch">
        <template>
          <Select v-model="selectStatus1" style="width:120px;margin-right: 11px" transfer @on-change="changeState('keyword1', 1)">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
    <page-table
      :columns="menuColumns"
      :keywords="formSearchInit"
      class="pageTable"
      url="employee/list"
      list-field="list">
    </page-table>
  </div>
</template>
<script>
import PageTable from '@/components/page-table'
import BasePage from '@/basic/BasePage'
import TMSUrl from '@/libs/constant/url'
export default {
  name: 'owned-car',
  components: {
    PageTable
  },
  metaInfo: {
    title: '自有车-车辆管理'
  },
  mixins: [ BasePage ],
  data () {
    return {
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
                      name: 'owned-vehicle/dialog/edit-car',
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
                    this.openDialog({
                      name: 'owned-vehicle/dialog/confirmDelete',
                      data: {
                      },
                      methods: {
                        ok () {
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
      selectList: [
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
      ]
    }
  },
  methods: {
    editCar () {
      var _this = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-car',
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
    }

  }
}
</script>
<style scoped lang="stylus">
  @import "client.styl"
</style>
