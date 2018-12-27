<template>
  <div>
    <div class="add">
      <Button v-if="hasPower(190201)" type="primary" @click="edit">新增保险</Button>
      <Button v-if="hasPower(190204)" @click="Export">导出</Button>
      <div class="rightSearch">
        <template>
          <Select v-model="selectStatus" class="conditionSty" transfer @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input v-if="selectStatus != 4"
               v-model="keyword"
               :maxlength="selectStatus === '1' ? 8 : 20"
               :icon="keyword ? 'ios-close-circle' : ''"
               :placeholder="placeholderContent"
               class="search-input"
               @on-enter="searchCarList"
               @on-click="clearKeywords"/>
        <DatePicker v-else v-model="keyword" transfer format="yyyy-MM-dd" type="daterange" placeholder="请选择日期">
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
      url="/ownerCar/insurance/list"
      list-field="list"
      method="post"
      @on-load="handleLoad"
      @on-sort-change = "timeSort">
    </page-table>
  </div>
</template>
<script>
import PageTable from '@/components/page-table'
import BasePage from '@/basic/BasePage'
import Export from '@/libs/js/export'
import { mapActions } from 'vuex'
export default {
  name: 'owned-insurance',
  components: {
    PageTable
  },
  metaInfo: {
    title: '车辆保险'
  },
  mixins: [ BasePage ],
  data () {
    return {
      selectStatus: '1',
      keyword: '',
      // formSearchInit: {
      //   carNo: '',
      //   insuranceCompanyName: '',
      //   invoiceNo: '',
      //   buyDateStart: '',
      //   buyDateEnd: ''
      // },
      formSearchInit: {},
      exportFile: true,
      menuColumns: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(190202)) {
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
                        validate: { ...params.row, purchDate: new Date(params.row.purchDate) }
                      },
                      methods: {
                        ok () {
                          vm.searchCarList()
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
            if (this.hasPower(190203)) {
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
                          vm.insuranceDeleteById({ id: params.row.id }).then(res => {
                            vm.$Message.success('删除成功！')
                          }).then(() => {
                            vm.searchCarList()
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
          key: 'totalFee'
        },
        {
          title: '购买日期',
          key: 'buyDate',
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
          label: '保险公司'
        },
        {
          value: '3',
          label: '保单号'
        },
        {
          value: '4',
          label: '购买日期'
        }
      ],
      placeholderContent: '请输入车牌号搜索'
    }
  },
  watch: {
    selectStatus (newVal) {
      switch (newVal) {
        case '1':
          this.placeholderContent = '请输入车牌号搜索'
          break
        case '2':
          this.placeholderContent = '请输入保险公司'
          break
        case '3':
          this.placeholderContent = '请输入保险单'
          break
        case '4':
          this.placeholderContent = '请选择购买日期'
          break
      }
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions(['insuranceDeleteById']),
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
        url: '/ownerCar/insurance/export',
        method: 'post',
        data: params,
        fileName: '导出保险列表'
      })
    },
    // 日期格式化
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    edit () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-insurance',
        data: {
          title: '新增保险',
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
      if (this.selectStatus === '1') {
        this.formSearchInit.carNo = this.keyword
      } else if (this.selectStatus === '2') {
        this.formSearchInit.insuranceCompanyName = this.keyword
      } else if (this.selectStatus === '3') {
        this.formSearchInit.invoiceNo = this.keyword
      } else if (this.selectStatus === '4') {
        this.formSearchInit.buyDateStart = new Date(this.keyword[0])
        this.formSearchInit.buyDateEnd = new Date(this.keyword[1])
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
