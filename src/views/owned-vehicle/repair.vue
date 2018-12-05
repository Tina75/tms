<template>
  <div>
    <div class="add">
      <Button v-if="hasPower(190301)" type="primary" @click="editRepair">新增记录</Button>
      <Button v-if="hasPower(190304)" @click="carExport">导出</Button>
      <div class="rightSearch">
        <template>
          <Select v-model="selectStatus" class="conditionSty" transfer @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input
          v-if="selectStatus !== '2'"
          :placeholder="selectStatus === '1' ? '请输入车牌号搜索' : null"
          :icon="keyword? 'ios-close-circle' : ''"
          :maxlength="8"
          v-model="keyword"
          class="search-input"
          @on-enter="searchRepairList"
          @on-click="clearKeywords"/>
        <Select v-if="selectStatus === '2'" v-model="keyword" class="search-input" transfer @on-change="searchRepairList">
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
                @click="searchRepairList">
        </Button>
      </div>
    </div>
    <page-table
      :columns="menuColumns"
      :keywords="formSearchInit"
      class="pageTable"
      url="/ownerCar/repair/list"
      list-field="list"
      method="post"
      @on-load="handleLoad">
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
    title: '维修保养'
  },
  mixins: [ BasePage ],
  data () {
    return {
      selectStatus: '1',
      keyword: '',
      formSearchInit: {
        carNo: '',
        repairType: ''
      },
      exportFile: true,
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
                        title: '修改维修记录',
                        flag: 2, // 修改
                        validate: { ...params.row, repairDate: new Date(params.row.repairDate) }
                      },
                      methods: {
                        ok () {
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
                          Server({
                            url: '/ownerCar/repair/del',
                            method: 'post',
                            data: { id: params.row.id }
                          }).then(({ data }) => {
                            if (data.code === 10000) {
                              vm.$Message.success('删除成功！')
                              vm.formSearchInit = {}
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
      ],
      repairTypeList: [
        { id: '1', name: '维修' },
        { id: '2', name: '保养' }
      ]
    }
  },
  methods: {
    // 导出判空
    handleLoad (response) {
      try {
        if (response.data.data.list.length < 1) this.exportFile = false
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
      let params = this.formSearchInit
      Export({
        url: '/ownerCar/repair/export',
        method: 'post',
        data: params,
        fileName: '导出维修列表'
      })
    },
    // 日期格式化
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    editRepair () {
      var vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-repair',
        data: {
          title: '新增车辆维修保养记录',
          flag: 1 // 新增
        },
        methods: {
          ok () {
            vm.formSearchInit = {}
          }
        }
      })
    },
    searchRepairList () {
      if (this.selectStatus === '1') {
        this.formSearchInit.carNo = this.keyword
        this.formSearchInit.repairType = ''
      } else {
        this.formSearchInit.repairType = this.keyword
        this.formSearchInit.carNo = ''
      }
    },
    clearKeywords () {
      this.keyword = ''
      this.searchRepairList()
    },
    changeState () {
      if (this.selectStatus === '2') {
        this.keyword = '1'
      } else {
        this.keyword = ''
      }
    }
  }
}
</script>
<style scoped lang="stylus">
  @import "client.styl"
</style>
