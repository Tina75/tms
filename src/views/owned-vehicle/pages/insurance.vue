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
        <Input v-model="keyword"
               :maxlength="selectStatus === '1' ? 8 : 20"
               :icon="keyword? 'ios-close-circle' : ''"
               :placeholder="placeholderContent"
               class="search-input"
               @on-enter="searchCarList"
               @on-click="clearKeywords"/>
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
      url="/ownerCar/listCar"
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
import TMSUrl from '@/libs/constant/url'
import Export from '@/libs/js/export'
import { CODE, deleteCarById } from './client'
import { mapActions } from 'vuex'
export default {
  name: 'owned-car',
  components: {
    PageTable
  },
  metaInfo: {
    title: '车辆管理'
  },
  mixins: [ BasePage ],
  data () {
    return {
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      selectStatus: '1',
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
                      name: 'owned-vehicle/dialog/edit-car',
                      data: {
                        title: '修改车辆',
                        flag: 2, // 修改
                        validate: { ...params.row, purchDate: new Date(params.row.purchDate) }
                      },
                      methods: {
                        ok () {
                          vm.getOwnDrivers()
                          vm.getOwnCars()
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
                    path: TMSUrl.OWNEDVEHICLE_CAEDETAILS,
                    query: {
                      id: '车辆详情',
                      rowData: params.row
                    }
                  })
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
                          deleteCarById({ carId: params.row.id }).then(res => {
                            if (res.data.code === CODE) {
                              vm.$Message.success('删除成功！')
                            }
                          }).then(() => {
                            vm.getOwnDrivers()
                            vm.getOwnCars()
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
          title: '保单号',
          key: 'carNo'
        },
        {
          title: '保险公司',
          key: 'carType',
          render: (h, params) => {
            let text = this.carTypeMap[params.row.carType] + this.carLengthMap[params.row.carLength]
            return h('div', {}, text)
          }
        },
        {
          title: '车牌号',
          key: 'shippingWeight'
        },
        {
          title: '总金额（元）',
          key: 'shippingVolume'
        },
        {
          title: '购买日期',
          key: 'carBrand'
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
      placeholderContent: ''
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
        default:
          this.placeholderContent = '请输入车牌号搜索'
          break
      }
    }
  },
  mounted () {
    this.getOwnCars()
  },
  methods: {
    ...mapActions(['getOwnDrivers', 'getOwnCars']),
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
        url: '/ownerCar/exportCar',
        method: 'post',
        data: params,
        fileName: '导出车辆列表'
      })
    },
    // 日期格式化
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    edit () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-car',
        data: {
          title: '新增车辆',
          flag: 1 // 新增
        },
        methods: {
          ok () {
            vm.getOwnDrivers()
            vm.getOwnCars()
            vm.formSearchInit = {}
          }
        }
      })
    },
    searchCarList () {
      this.formSearchInit = {}
      if (this.selectStatus === '1') {
        this.formSearchInit.carNo = this.keyword
        this.formSearchInit.driverName = ''
      } else {
        this.formSearchInit.driverName = this.keyword
        this.formSearchInit.carNo = ''
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
