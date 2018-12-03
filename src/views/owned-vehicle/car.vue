<template>
  <div>
    <div class="add">
      <Button v-if="hasPower(130207)" type="primary" @click="editCar">新增车辆</Button>
      <Button v-if="hasPower(130210)" @click="carExport">导出</Button>
      <div class="rightSearch">
        <template>
          <Select v-model="selectStatus" class="conditionSty" transfer @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input v-model="keyword"
               :maxlength="selectStatus === '1' ? 8 : 11"
               :icon="keyword? 'ios-close-circle' : ''"
               :placeholder="selectStatus === '1' ? '请输入车牌号搜索' : '请输入手机号搜索'"
               class="search-input"
               @on-enter="searchCarList"/>
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
      list-field="list"
      @on-load="handleLoad"
      @on-sort-change = "timeSort">
    </page-table>
  </div>
</template>
<script>
import PageTable from '@/components/page-table'
import BasePage from '@/basic/BasePage'
import TMSUrl from '@/libs/constant/url'
import Export from '@/libs/js/export'
import Server from '@/libs/js/server'
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
      selectStatus: '',
      keyword: '',
      formSearchInit: {
        carNo: '',
        driverName: ''
      },
      exportFile: true,
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
                    path: TMSUrl.OWNEDVEHICLE_CAEDETAILS,
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
                          Server({
                            url: 'owerCar/deleteDriver',
                            method: 'post',
                            data: { id: params.row.id }
                          }).then(({ data }) => {
                            if (data.code === 10000) {
                              this.$Message.success('删除成功！')
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
          title: '车型',
          key: 'carType',
          render: (h, params) => {
            let text = this.carTypeMap[params.row.carType] + this.carLengthMap[params.row.carLength]
            return h('div', {}, text)
          }
        },
        {
          title: '载重（吨）',
          key: 'shippingWeight'
        },
        {
          title: '净空（方）',
          key: 'shippingVolume'
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
          title: '主司机',
          key: 'createTime'
        }, {
          title: '副司机',
          key: 'createTime'
        }, {
          title: '创建时间',
          key: 'createTime',
          sortable: 'custom',
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
          label: '司机手机号'
        }
      ]
    }
  },
  methods: {
    // 导出判空
    handleLoad (response) {
      if (response.data.data.list.length < 1) this.exportFile = false
    },
    // 导出车辆信息
    carExport () {
      // if (Number(this.totalCount1) < 1) {
      //   this.$Message.error('导出内容为空')
      //   return
      // }
      // let data = {
      //   carrierId: this.carrierId
      // }
      // if (this.selectStatus1 === '1') {
      //   data.carNO = this.keyword1
      // } else if (this.selectStatus1 === '2') {
      //   data.driverType = this.keyword1
      // }
      Export({
        url: '/ownerCar/exportCarn',
        method: 'post',
        data: '',
        fileName: '导出车辆列表'
      })
    },
    // 日期格式化
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    editCar () {
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-car',
        data: {
          title: '新增车辆',
          flag: 1, // 新增
          carrierId: this.carrierId // carrierId
        },
        methods: {
          ok () {
          }
        }
      })
    },
    searchCarList () {
      if (this.selectStatus === '1') {
        this.formSearchInit.carNo = ''
        this.formSearchInit.driverName = this.keyword
      } else {
        this.formSearchInit.driverName = ''
        this.formSearchInit.carNo = this.keyword
      }
    },
    changeState () {
      this.keyword = ''
    },
    timeSort (column) {
      this.formSearchInit.order = (column.order === 'normal' ? '' : column.order)
    }
  }
}
</script>
<style scoped lang="stylus">
  @import "client.styl"
</style>
