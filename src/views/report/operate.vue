<template>
  <div>
    <div class="search">
      <div class="search-col">
        <Row :gutter="24" class="row">
          <Col span="6">
          <div class="col">
            <Select v-model="model1" placeholder="请选择或输入客户名称">
              <Option v-for="col in cityList" :value="col.value" :key="col.value">{{ col.label }}</Option>
            </Select>
          </div>
      </Col>
          <Col span="6">
          <div class="col">
            <Input v-model="value" :maxlength="20"  placeholder="请输入订单号"/>
          </div>
      </Col>
          <Col span="6">
          <div class="col">
            <Input v-model="value" :maxlength="20" placeholder="请输入客户订单号"  />
          </div>
      </Col>
          <Col span="6">
          <div class="col"><Input :maxlength="20" v-model="value" placeholder="请输入运单号"  /></div>
      </Col>
        </Row>
        <Row :gutter="24">
          <Col span="6">
          <div class="col">
            <area-select v-model="keywords.start" style="width: 100%"></area-select>
          </div>
        </Col>
          <Col span="6">
          <div class="col">
            <area-select v-model="keywords.end" style="width: 100%"></area-select>
          </div>
        </Col>
          <Col span="6">
          <div class="col">
            <DatePicker
              v-model="time"
              type="daterange"
              format="yyyy-MM-dd"
              placeholder="开始日期-结束日期"
              style="width: 100%"
            >
            </DatePicker>
          </div>
        </Col>
        </Row>
      </div>
      <div class="search-btn">
        <Button type="primary">搜索</Button>
        <Button style="margin-left: 8px">清除条件</Button>
      </div>
    </div>
    <div style="margin: 18px 0 12px 0">
      <Button type="primary">导出</Button>
    </div>
    <page-table
      ref="pageTable"
      :url="url"
      :method="method"
      :keywords="keywords"
      :columns="columns"
      :extra-columns="extraColumns"
      :show-filter="true"
      @on-column-change="handleColumnChange">
    </page-table>
  </div>
</template>

<script>
import PageTable from '@/components/page-table'
import AreaSelect from '@/components/AreaSelect'
import City from '@/libs/js/City'
export default {
  name: 'operate',
  components: {
    PageTable,
    AreaSelect
  },
  data () {
    return {
      url: '',
      method: 'post',
      keywords: {
        start: '',
        end: ''
      },
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      model1: '',
      value: '',
      time: '',
      columns: [
        {
          title: '订单号',
          key: 'orderNo',
          className: 'padding-20',
          render: (h, params) => {
            if (params.row.parentId !== '') {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    background: '#418DF9',
                    borderRadius: '2px',
                    color: '#fff',
                    lineHeight: '14px',
                    textAlign: 'center',
                    marginRight: '5px',
                    marginLeft: '-19px'
                  }
                }, '子'),
                h('a', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#418DF9'
                  },
                  on: {
                    click: () => {
                      this.openTab({
                        path: '/order-management/detail',
                        query: {
                          id: params.row.orderNo,
                          orderId: params.row.id,
                          from: 'order'
                        }
                      })
                    }
                  }
                }, params.row.orderNo)
              ])
            } else {
              return h('a', {
                props: {
                  type: 'text'
                },
                style: {
                  marginRight: '5px',
                  color: '#418DF9'
                },
                on: {
                  click: () => {
                    this.openTab({
                      path: '/order-management/detail',
                      query: {
                        id: params.row.orderNo,
                        orderId: params.row.id,
                        from: 'order'
                      }
                    })
                  }
                }
              }, params.row.orderNo)
            }
          }
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo'
        },
        {
          title: '运单号',
          key: 'waybillNo'
        },
        {
          title: '客户名称',
          key: 'consignerName'
        },
        {
          title: '始发地',
          key: 'start',
          render: (h, params) => {
            return h('span', City.codeToFullName(params.row.start))
          }
        },
        {
          title: '目的地',
          key: 'end',
          render: (h, params) => {
            return h('span', City.codeToFullName(params.row.end))
          }
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        },
        {
          title: '下单时间',
          key: 'createTime',
          render: (h, params) => {
            return h('span', new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm'))
          }
        }
      ],
      extraColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          fixed: false,
          visible: true
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          fixed: false,
          visible: true
        },
        {
          title: '运单号',
          key: 'waybillNo',
          fixed: false,
          visible: true
        },
        {
          title: '客户名称',
          key: 'consignerName',
          fixed: false,
          visible: true
        },
        {
          title: '始发地',
          key: 'start',
          fixed: false,
          visible: true
        },
        {
          title: '目的地',
          key: 'end',
          fixed: false,
          visible: true
        },
        {
          title: '体积（方）',
          key: 'volume',
          fixed: false,
          visible: true
        },
        {
          title: '重量（吨）',
          key: 'weight',
          fixed: false,
          visible: true
        },
        {
          title: '下单时间',
          key: 'createTime',
          fixed: false,
          visible: true
        },
        {
          title: '发货联系人',
          key: 'consignerContact',
          fixed: false,
          visible: false
        },
        {
          title: '收货联系人',
          key: 'consigneeContact',
          fixed: false,
          visible: false
        },
        {
          title: '修改时间',
          key: 'updateTime',
          fixed: false,
          visible: false
        },
        {
          title: '货物类型',
          key: 'loadFee',
          fixed: false,
          visible: false
        },
        {
          title: '数量',
          key: 'settlementType',
          fixed: false,
          visible: false
        },
        {
          title: '要求装货时间',
          key: 'deliveryTime',
          fixed: false,
          visible: false
        },
        {
          title: '要求卸货时间',
          key: 'arriveTime',
          fixed: false,
          visible: false
        },
        {
          title: '运费',
          key: 'totalFee',
          fixed: false,
          visible: false
        },
        {
          title: '修改人',
          key: 'unloadFee',
          fixed: false,
          visible: false
        },
        {
          title: '创建人',
          key: 'creatorId',
          fixed: false,
          visible: true
        }
      ]
    }
  },
  methods: {
    // 筛选列表显示字段
    handleColumnChange (val) {
      console.log(val)
      this.extraColumns = val
    }
  }
}
</script>

<style scoped lang="stylus">
  button
    width 86px
    height 35px
  .search
    display flex
    background #F9F9F9
    padding 13px
    .search-col
      flex 4
      .row
        margin-bottom 12px
    .search-btn
      flex 1
      text-align right
      margin-top 44px
</style>
