<template>
  <div>
    <div class="add">
      <Button v-if="hasPower(190501)" type="primary" @click="edit">新增年检</Button>
      <Button v-if="hasPower(190504)" @click="Export">导出</Button>
      <div class="rightSearch">
        <template>
          <Select v-model="selectStatus" class="conditionSty" transfer @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input v-if="selectStatus === '1'"
               v-model="keyword"
               :maxlength="8"
               :icon="keyword ? 'ios-close-circle' : ''"
               placeholder="请输入车牌号搜索"
               class="search-input"
               @on-enter="searchCarList"
               @on-click="clearKeywords"/>
        <DatePicker v-else :options="options" v-model="keyword" transfer format="yyyy-MM-dd" type="daterange" placeholder="请选择日期搜索">
        </DatePicker>
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
      url="/ownerCar/check/list"
      list-field="list"
      method="post"
      @on-load="handleLoad"
      @on-sort-change = "timeSort">
    </page-table>
  </div>
</template>
<script>
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import PageTable from '@/components/page-table'
import BasePage from '@/basic/BasePage'
import Export from '@/libs/js/export'
import { mapActions } from 'vuex'
export default {
  name: 'owner-check',
  components: {
    PageTable
  },
  metaInfo: {
    title: '车辆年检'
  },
  mixins: [ BasePage ],
  data () {
    return {
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      selectStatus: '1',
      keyword: '',
      formSearchInit: {},
      exportFile: true,
      menuColumns: [
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
                        flag: 2, // 修改
                        validate: { ...params.row, checkDate: new Date(params.row.checkDate).Format('yyyy-MM-dd'), nextCheckDate: new Date(params.row.nextCheckDate).Format('yyyy-MM-dd') }
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
                          vm.searchCarList()
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
          title: '金额',
          key: 'cost',
          render: (h, params) => {
            return h('div', Number(params.row.cost) / 100)
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
      selectList: [
        {
          value: '1',
          label: '车牌号'
        },
        {
          value: '2',
          label: '年检时间'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['checkDeleteById']),
    // 导出判空
    handleLoad (response) {
      try {
        if (response.data.data.list.length >= 1) this.exportFile = true
        else this.exportFile = false
      } catch (error) {
        this.exportFile = false
      }
    },
    // 导出车辆信息
    Export () {
      if (!this.exportFile) {
        this.$Message.error('导出内容为空')
        return
      }
      let params = this.formSearchInit
      Export({
        url: '/ownerCar/check/export',
        method: 'post',
        data: params,
        fileName: '导出车辆年检'
      })
    },
    // 日期格式化
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    edit () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-check',
        data: {
          title: '新增年检',
          flag: 1 // 新增
        },
        methods: {
          ok () {
            vm.formSearchInit = {}
          }
        }
      })
    },
    searchCarList () {
      this.formSearchInit = {}
      if (this.selectStatus === '1' && this.keyword) {
        this.formSearchInit.carNo = this.keyword
      } else {
        this.formSearchInit.checkDateStart = new Date(this.keyword[0]).getTime()
        this.formSearchInit.checkDateEnd = new Date(this.keyword[1]).getTime() + 86400000
      }
    },
    clearKeywords () {
      this.keyword = ''
      this.searchCarList()
    },
    changeState () {
      this.keyword = ''
    },
    timeSort (column) {
      this.formSearchInit = {}
      this.formSearchInit.order = (column.order === 'normal' ? '' : 'create_time ' + column.order)
    }
  }
}
</script>
<style scoped lang="stylus">
  @import "client.styl"
</style>
