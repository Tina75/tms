<template>
  <div>
    <div class="add">
      <Button v-if="hasPower(130207)" type="primary" @click="editDriver">新增司机</Button>
      <Button v-if="hasPower(130210)" @click="carExport">导出</Button>
      <div class="rightSearch">
        <template>
          <Select v-model="selectStatus" class="conditionSty" transfer @on-change="changeState">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input
          v-model="keyword"
          :maxlength="selectStatus === '1' ? 8 : 11"
          :icon="keyword ? 'ios-close-circle' : ''"
          :placeholder="selectStatus === '1' ? '请输入司机姓名' : '请输入手机号搜索'"
          class="search-input"
          @on-enter="searchList"/>
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
    title: '司机管理'
  },
  mixins: [ BasePage ],
  data () {
    return {
      formSearchInit: {
        driverName: '',
        driverPhone: '',
        order: ''
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
                      name: 'dialogs/edit-driver',
                      data: {
                        title: '修改司机',
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
                    path: TMSUrl.OWNEDVEHICLE_DRIVERINFO,
                    query: {
                      id: '司机详情',
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
          title: '司机姓名',
          key: 'carNO'
        },
        {
          title: '手机号',
          key: 'driverType'
        },
        {
          title: '创建时间',
          key: 'driverName',
          sortable: 'custom'
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
  methods: {
    // 导出判空
    handleLoad (response) {
      try {
        if (response.data.data.list.length < 1) this.exportFile = false
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
        url: '/owerCar/exportDriver',
        method: 'post',
        data: '',
        fileName: '导出司机列表'
      })
    },
    editDriver () {
      this.openDialog({
        name: 'dialogs/edit-driver',
        data: {
          title: '新增司机',
          flag: 1 // 新增
        },
        methods: {
          ok () {
          }
        }
      })
    },
    // 搜索
    searchList () {
      if (this.selectStatus === '1') {
        this.formSearchInit.driverPhone = ''
        this.formSearchInit.driverName = this.keyword
      } else {
        this.formSearchInit.driverName = ''
        this.formSearchInit.driverPhone = this.keyword
      }
    },
    timeSort (column) {
      this.formSearchInit.order = (column.order === 'normal' ? '' : column.order)
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
