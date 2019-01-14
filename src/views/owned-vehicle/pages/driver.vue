<template>
  <div>
    <div class="add">
      <Button v-if="hasPower(190101)" type="primary" @click="editDriver">新增司机</Button>
      <Button v-if="hasPower(190104)" @click="carExport">导出</Button>
      <div class="rightSearch">
        <template>
          <Select v-model="selectStatus" class="conditionSty" transfer @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input
          v-model="keyword"
          :maxlength="selectStatus === '1' ? 20 : 11"
          :icon="keyword ? 'ios-close-circle' : ''"
          :placeholder="selectStatus === '1' ? '请输入司机姓名' : '请输入手机号搜索'"
          class="search-input"
          @on-enter="searchList"
          @on-click="clearKeywords"/>
        <Button icon="ios-search" type="primary"
                class="search-btn-easy"
                style="float: right;width:41px;"
                @click="searchList">
        </Button>
      </div>
    </div>
    <page-table
      :columns="menuColumns"
      :keywords="formSearchInit"
      class="pageTable"
      method="post"
      url="/ownerCar/listDriver"
      list-field="list"
      @on-load="handleLoad"
      @on-sort-change = "timeSort">
    </page-table>
  </div>
</template>
<script>
import { DRIVER_STATUS } from '@/libs/constant/carInfo'
import PageTable from '@/components/page-table'
import BasePage from '@/basic/BasePage'
import TMSUrl from '@/libs/constant/url'
import Export from '@/libs/js/export'
import { mapActions } from 'vuex'
import { CODE, deleteDriverById } from './client'
import TagStatus from '../components/TagStatus.vue'
export default {
  name: 'owned-car',
  components: {
    TagStatus,
    PageTable
  },
  metaInfo: {
    title: '司机管理'
  },
  mixins: [ BasePage ],
  data () {
    return {
      formSearchInit: {
        driverName: '',
        driverPhone: ''
      },
      selectStatus: '1',
      keyword: '',
      exportFile: true,
      menuColumns: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(190102)) {
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
                      name: 'dialogs/edit-driver',
                      data: {
                        title: '修改司机',
                        flag: 2, // 修改
                        validate: params.row
                      },
                      methods: {
                        ok () {
                          vm.getOwnDrivers()
                          vm.formSearchInit = {}
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
                    path: TMSUrl.OWNEDVEHICLE_DRIVERINFO,
                    query: {
                      id: '司机详情',
                      rowData: params.row
                    }
                  })
                }
              }
            }, '查看'))
            if (this.hasPower(190103)) {
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
                          deleteDriverById({ id: params.row.id }).then(res => {
                            if (res.data.code === CODE) {
                              vm.$Message.success('删除成功！')
                            }
                          }).then(() => {
                            vm.getOwnDrivers()
                            vm.formSearchInit = {}
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
          title: '司机姓名',
          key: 'driverName'
        },
        {
          title: '状态',
          key: 'driverStatus',
          render (h, params) {
            if (!params.row.driverStatus) {
              return h('span', '-')
            }
            return h(TagStatus,
              {
                props: {
                  type: params.row['driverStatus'] === '1' ? 'warning' : 'info'
                }
              }, DRIVER_STATUS[params.row['driverStatus']])
          }
        },
        {
          title: '手机号',
          key: 'driverPhone'
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
            } else if (s1 + s2 + n1 + n2 === '') {
              return h('div', '-')
            }
            return h('div', [
              h('Tooltip', {
                props: {
                  placement: 'top'
                },
                style: {
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
        },
        {
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
          label: '司机姓名'
        },
        {
          value: '2',
          label: '司机手机号'
        }
      ]
    }
  },
  mounted () {
    this.getOwnDrivers()
  },
  methods: {
    ...mapActions(['getOwnDrivers']),
    // 日期格式化
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
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
    // 导出司机信息
    carExport () {
      if (!this.exportFile) {
        this.$Message.error('导出内容为空')
        return
      }
      let params = this.formSearchInit
      Export({
        url: '/ownerCar/exportDriver',
        method: 'post',
        data: params,
        fileName: '导出司机列表'
      })
    },
    editDriver () {
      let vm = this
      this.openDialog({
        name: 'dialogs/edit-driver',
        data: {},
        methods: {
          ok () {
            vm.getOwnDrivers()
            vm.formSearchInit = {}
            vm.handleLoad()
          }
        }
      })
    },
    // 搜索
    searchList () {
      this.formSearchInit = {}
      if (this.selectStatus === '1') {
        this.formSearchInit.driverPhone = ''
        this.formSearchInit.driverName = this.keyword
      } else {
        this.formSearchInit.driverName = ''
        this.formSearchInit.driverPhone = this.keyword
      }
    },
    clearKeywords () {
      this.keyword = ''
      this.searchList()
    },
    timeSort (column) {
      this.formSearchInit = {}
      this.formSearchInit.order = (column.order === 'normal' ? '' : 'create_time ' + column.order)
    },
    changeState () {
      this.keyword = ''
    }
  }
}
</script>
<style scoped lang="stylus">
  @import "client.styl"
</style>
