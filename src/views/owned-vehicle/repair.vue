<template>
  <div>
    <div class="add">
      <Button v-if="hasPower(130211)" type="primary" @click="editRepair">新增记录</Button>
      <div class="rightSearch">
        <template>
          <Select v-model="selectStatus" class="conditionSty" transfer @on-change="changeState('keyword', 1)">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input v-if="selectStatus !== '1'"
               v-model="keyword"
               :maxlength="selectStatus === '1' ? 8 : 11"
               :icon="keyword? 'ios-close-circle' : ''"
               :placeholder="selectStatus === '1' ? '请输入车牌号搜索' : null"
               class="search-input"
               @on-enter="searchRepairList"
               @on-click="clearKeywords('keyword', 1)"/>
        <Select v-if="selectStatus === '1'" v-model="keyword" class="search-input" transfer @on-change="searchRepairList">
          <Option
            v-for="item in repairTypeList"
            :value="item.id"
            :key="item.id">
            {{ item.name }}
          </Option>
        </Select>
        <Button icon="ios-search" type="primary"
                class="search-btn-easy"
                style="float: right;width:41px;"
                @click="searchRepairList"></Button>
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
      selectStatus: '',
      keyword: '',
      formSearchInit: '',
      menuColumns: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130212)) {
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
                      name: 'owned-vehicle/dialog/edit-repair',
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
                          _this._carrierListRepairVehicle() // 刷新页面
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
            if (this.hasPower(130213)) {
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
          width: 100,
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
      ],
      selectList: [
        {
          value: '1',
          label: '车牌号'
        },
        {
          value: '2',
          label: '维修类别'
        }
      ]
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
    editRepair () {
      var _this = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-repair',
        data: {
          title: '新增车辆维修保养记录',
          flag: 1, // 新增
          driverId: _this.driverId,
          carrierId: _this.carrierId
        },
        methods: {
          ok () {
          }
        }
      })
    }
  },
  searchRepairList () {
  },
  clearKeywords () {
  }
}
</script>
<style scoped lang="stylus">
  @import "client.styl"
</style>
