<template>
  <div>
    <div class="header">
      <div class="left">
        <Button type="primary" @click="modaladd">新增</Button>
      </div>
      <div class="right">
        <template>
          <Select v-model="selectStatus"  style="width:120px;margin-right: 11px">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <template v-if="selectStatus==0">
          <Input v-model="name" :maxlength="20" placeholder="请输入发货方名称" search style="width: 200px"  @on-search="searchList" />
        </template>
        <template v-else>
          <Input v-model="contact" :maxlength="15" placeholder="请输入发货方联系人" search style="width: 200px"  @on-search="searchList" />
        </template>
      </div>
    </div>
    <div>
      <template>
        <Table :columns="columns1" :data="data1"></Table>
      </template>
      <!--<page-table :data="data1" :columns="columns1" :total="100" :current.sync="2"></page-table>-->
    </div>
    <div class="footer">
      <template>
        <Page :total="totalCount"
              :current.sync="pageNo" :page-size-opts="pageArray"
              size="small"
              show-sizer
              show-elevator show-total @on-change="handleChangePage"/>
      </template>
    </div>
  </div>
</template>

<script>
import { consignerList, consignerDelete, CODE } from './client'
import BasePage from '@/basic/BasePage'
export default {
  name: 'sender',
  mixins: [ BasePage ],
  data () {
    return {
      selectStatus: 0,
      selectList: [
        {
          value: 0,
          label: '发货方名称'
        },
        {
          value: 1,
          label: '发货联系人名称'
        }
      ],
      name: '',
      contact: '',
      totalCount: 0, // 总条数
      pageArray: [10, 20, 50, 100],
      pageNo: 1,
      pageSize: 10,
      columns1: [
        {
          title: '操作',
          key: 'id',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let _this = this
                    console.log(params.row.payType + '')
                    this.openDialog({
                      name: 'client/dialog/sender',
                      data: {
                        title: '修改发货方',
                        flag: 2, // 编辑
                        id: params.row.id,
                        validate: {
                          name: params.row.name,
                          contact: params.row.contact,
                          phone: params.row.phone,
                          payType: params.row.payType + '',
                          remark: params.row.remark
                        }
                      },
                      methods: {
                        ok () {
                          _this.searchList() // 刷新页面
                        }
                      }
                    })
                  }
                }
              }, '修改'),
              h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    consignerDelete({
                      id: params.row.id
                    }).then(res => {
                      if (res.data.code === CODE) {
                        this.$Message.success(res.data.msg)
                        this.searchList() // 刷新页面
                      } else {
                        this.$Message.error(res.data.msg)
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        },
        {
          title: '发货方名称',
          // key: 'name',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#418DF9',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.$router.push({ path: '/client/sender-info', query: { id: params.row.id }
                    })
                  }
                }
              }, params.row.name)
            ])
          }
        },
        {
          title: '发货方联系人',
          key: 'contact'
        },
        {
          title: '联系电话',
          key: 'phone'
        },
        {
          title: '发货方地址数量',
          key: 'consignerAddressCnt'
        },
        {
          title: '收货方数量',
          key: 'consigneeCnt'
        },
        {
          title: '货物数量',
          key: 'cargoCnt'
        },
        {
          title: '付款方式描述',
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
          sortable: true,
          render: (h, params) => {
            let text = this.formatDate(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ],
      data1: []
    }
  },
  mounted () {
    this.searchList()
  },
  methods: {
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    searchList () {
      let data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        name: this.name,
        contact: this.contact
      }
      consignerList(data).then(res => {
        this.data1 = res.data.data.list
        this.totalCount = res.data.data.totalCount
      })
    },
    modaladd () {
      var _this = this
      this.openDialog({
        name: 'client/dialog/sender',
        data: {
          title: '新增发货方',
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
