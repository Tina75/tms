<template>
  <div>
    <div class="header">
      <div class="left">
        <Button v-if="hasPower(130301)" type="primary" @click="modaladd">新增</Button>
      </div>
      <div class="right">
        <template>
          <Select v-model="selectStatus"  style="width:120px;margin-right: 11px">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <Input  v-model="keyword" :maxlength="20" :placeholder="selectStatus === 1 ? '请输入外转方名称' : '请输入负责人名称'" search style="width: 200px"  @on-search="searchList" />
      </div>
    </div>
    <div>
      <template>
        <Table :columns="columns1" :data="data1" @on-sort-change = "timeSort"></Table>
      </template>
    </div>
    <div class="footer">
      <template>
        <Page :total="totalCount"
              :current.sync="pageNo" :page-size-opts="pageArray"
              size="small"
              show-sizer
              show-elevator show-total @on-change="handleChangePage"
              @on-page-size-change="handleChangePageSize"/>
      </template>
    </div>
  </div>
</template>

<script>
import { transfereeList, transfereeDelete, CODE } from './client'
import BasePage from '@/basic/BasePage'
export default {
  name: 'transfer',
  mixins: [ BasePage ],
  metaInfo: {
    title: '外转方列表'
  },
  data () {
    return {
      selectStatus: 1,
      selectList: [
        {
          value: 1,
          label: '外转方名称'
        },
        {
          value: 2,
          label: '负责人'
        }
      ],
      keyword: '',
      order: null,
      totalCount: 0, // 总条数
      pageArray: [10, 20, 50, 100],
      pageNo: 1,
      pageSize: 10,
      columns1: [
        {
          title: '操作',
          key: 'id',
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(130302)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let _this = this
                    this.openDialog({
                      name: 'client/dialog/transfer',
                      data: {
                        title: '修改外转方',
                        flag: 2, // 编辑
                        id: params.row.id,
                        validate: {
                          name: params.row.name,
                          contact: params.row.contact,
                          phone: params.row.phone,
                          payType: params.row.payType + '',
                          remark: params.row.remark,
                          companyAddress: params.row.companyAddress
                        }
                      },
                      methods: {
                        ok () {
                          _this.searchList() // 刷新页面
                        }
                      }
                    })
                    // this.modalupdate = true
                  }
                }
              }, '修改'))
            }
            if (this.hasPower(130303)) {
              renderBtn.push(h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let _this = this
                    this.openDialog({
                      name: 'client/dialog/confirmDelete',
                      data: {
                      },
                      methods: {
                        ok () {
                          transfereeDelete({
                            transfereeId: params.row.id
                          }).then(res => {
                            if (res.data.code === CODE) {
                              _this.$Message.success(res.data.msg)
                              _this.searchList() // 刷新页面
                            } else {
                              _this.$Message.error(res.data.msg)
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
          title: '外转方名称',
          key: 'name'
        },
        {
          title: '负责人',
          key: 'contact'
        },
        {
          title: '联系电话',
          key: 'phone'
        },
        {
          title: '结算方式',
          key: 'payType',
          render: (h, params) => {
            let text = ''
            if (params.row.payType === 1) {
              text = '现付'
            } else if (params.row.payType === 2) {
              text = '到付'
            } else if (params.row.payType === 3) {
              text = '回单付'
            } else if (params.row.payType === 4) {
              text = '月结'
            } else {
              text = ''
            }
            return h('div', {}, text)
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: 'custom'
        }
      ],
      data1: []
    }
  },
  mounted () {
    this.searchList()
  },
  methods: {
    searchList () {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        type: this.selectStatus,
        keyword: this.keyword,
        order: this.order
      }
      transfereeList(data).then(res => {
        this.data1 = res.data.data.transfereeList
        this.totalCount = res.data.data.total
      })
    },
    modaladd () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/transfer',
        data: {
          title: '新增外转方',
          flag: 1 // 新增
        },
        methods: {
          ok () {
            _this.searchList() // 刷新页面
          }
        }
      })
    },
    handleChangePage (pageNo) {
      // 重新组装数据，生成查询参数
      this.pageNo = pageNo
      this.searchList()
    },
    handleChangePageSize (pageSize) {
      this.pageSize = pageSize
      this.searchList()
    },
    timeSort (column) {
      this.order = (column.order === 'normal' ? null : column.order)
      this.searchList()
    }
  }
}
</script>

<style scoped lang="stylus">
  .header
    display flex
    justify-content space-between
    margin-bottom 14px
  .footer
    margin-top 22px
    display flex
    justify-content flex-end
</style>
