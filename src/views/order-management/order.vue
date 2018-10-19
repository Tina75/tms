<template>
  <div>
    <tab-header :name="curStatusName" :tabs="status" @tabChange="handleTabChange"></tab-header>
    <div style="margin-top: 30px;display: flex;justify-content: space-between;">
      <div>
        <Button v-for="(btn, index) in btnGroup" v-if="hasPower(btn.code)" :key="index" :type="btn.value === operateValue ? 'primary' : 'default'" @click="handleOperateClick(btn)">{{ btn.name }}</Button>
      </div>
      <div v-if="simpleSearch" class="order-right">
        <Select v-model="selectStatus" class="order-simple-select" style="width:120px;margin-top: 1px;margin-right: 11px" @on-change="handleChangeSearchStatus">
          <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <SelectInput
          v-if="selectStatus === 0"
          v-model="keywords.consignerName"
          :maxlength="20"
          :remote="false"
          :clearable="true"
          :local-options="clients"
          placeholder="请选择或输入客户名称"
          style="width:200px"
          @on-focus.once="getClients"
          @on-clear="clearKeywords">
        </SelectInput>
        <Input
          v-else-if="selectStatus === 1"
          v-model.lazy="keywords.orderNo"
          :maxlength="30"
          :icon="keywords.orderNo ? 'ios-close-circle' : ''"
          placeholder="请输入订单号"
          style="width: 200px"
          @on-enter="searchList"
          @on-click="clearKeywords"/>
        <Input
          v-else
          v-model.lazy="keywords.waybillNo"
          :maxlength="30"
          :icon="keywords.waybillNo ? 'ios-close-circle' : ''"
          placeholder="请输入运单号"
          style="width: 200px"
          @on-enter="searchList"
          @on-click="clearKeywords"/>
        <Button type="primary" icon="ios-search" style="width: 40px;margin-left:-2px;margin-right: 0;border-top-left-radius: 0;border-bottom-left-radius: 0;" @click="searchList"></Button>
        <Button type="text" class="high-search" size="small" @click="handleSwitchSearch">高级搜索</Button>
      </div>
    </div>
    <div v-if="!simpleSearch" class="operate-box">
      <div style="margin-bottom: 10px;">
        <SelectInput
          v-model="keywords.consignerName"
          :maxlength="20"
          :remote="false"
          :local-options="clients"
          placeholder="请选择或输入客户名称"
          style="width:200px;margin-right: 20px;"
          @on-focus.once="getClients">
        </SelectInput>
        <Input v-model="keywords.orderNo" :maxlength="30" placeholder="请输入订单号" style="width: 200px" />
        <Input v-model="keywords.customerOrderNo" :maxlength="30" placeholder="请输入客户订单号" style="width: 200px" />
        <Input v-model="keywords.waybillNo" :maxlength="30" placeholder="请输入运单号" style="width: 200px" />
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div>
          <area-select v-model="cityCodes.startCodes" :deep="true" placeholder="请输入始发地" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <area-select v-model="cityCodes.endCodes" :deep="true" placeholder="请输入目的地" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <DatePicker
            :options="timeOption"
            v-model="times"
            type="daterange"
            format="yyyy-MM-dd"
            placeholder="开始日期-结束日期"
            style="width: 200px;display: inline-block;"
            @on-change="handleTimeChange">
          </DatePicker>
        </div>
        <div>
          <Button type="primary" @click="searchList">搜索</Button>
          <Button type="default" @click="clearKeywords">清除条件</Button>
          <Button type="default" style="margin-right: 0;" @click="handleSwitchSearch">简易搜索</Button>
        </div>
      </div>
    </div>
    <page-table
      ref="pageTable"
      :url="url"
      :method="method"
      :keywords="keyword"
      :columns="tableColumns"
      :extra-columns="extraColumns"
      :show-filter="true"
      :row-class-name="rowClassName"
      style="margin-top: 15px"
      @on-selection-change="handleSelectionChange"
      @on-column-change="handleColumnChange">
    </page-table>
    <OrderPrint ref="printer" :list="orderPrint">
    </OrderPrint>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from '@/components/TabHeader'
import PageTable from '@/components/page-table/'
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from '@/components/SelectInput.vue'
import OrderPrint from './components/OrderPrint'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
// import City from '@/libs/js/city'
import SearchMixin from './searchMixin'
import jsCookie from 'js-cookie'
export default {
  name: 'order',

  components: {
    TabHeader,
    PageTable,
    AreaSelect,
    SelectInput,
    OrderPrint
  },
  mixins: [ BasePage, SearchMixin ],
  metaInfo: { title: '订单管理' },
  data () {
    return {
      tabType: 'ORDER',
      url: 'order/list',
      method: 'post',
      status: [
        { name: '全部', count: '' },
        { name: '待提货', count: '' },
        { name: '待送货', count: '' },
        { name: '在途', count: '' },
        { name: '已到货', count: '' },
        { name: '已回单', count: '' }
      ],
      curStatusName: '待提货',
      btnGroup: [
        { name: '送货调度', value: 1, code: 110101 },
        { name: '提货调度', value: 2, code: 110102 },
        { name: '订单还原', value: 3, code: 110105 },
        { name: '删除', value: 4, code: 110107 },
        { name: '打印', value: 5, code: 110108 },
        { name: '导出', value: 6, code: 110109 }
      ],
      selectStatus: 0, // 当前搜索状态   0：客户名称   1：订单号  2：运单号
      selectList: [
        {
          value: 0,
          label: '客户名称'
        },
        {
          value: 1,
          label: '订单号'
        },
        {
          value: 2,
          label: '运单号'
        }
      ],
      operateValue: 1,
      keyword: {
        status: 10 // 默认待提货状态  传给pageTable可重新请求数据
      },
      tableColumns: [
        {
          type: 'selection',
          width: 50,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '操作',
          key: 'do',
          fixed: 'left',
          width: 120,
          extra: true,
          render: (h, params) => {
            /**
             * status  10：待提货 20：待调度 30：在途 40：已到货 50：已回单
             * parentId    父单：('' && 被拆单: disassembleStatus=1)， 子单：不为''
             * disassembleStatus   是否被拆单：1是;0否（只对父单有效，子单被拆单也为0）
             * transStatus   是否被外转：1是，0否
             * dispatchStatus 是否被调度：1是，0否
             * pickupStatus  是否被提货：1是；0否
             * pickup   提货方式 1上门提货、2直接送货 （开单时选择上门提货  初始状态为待提货（10），开单时选择直接送货，初始状态为待调度（20））
             *
             *
             * 展示按钮：拆单、外转、还原、删除、编辑（详情页独有）
             * 1、待提货状态下：（status: 10）
             *    拆单： 无拆单按钮           //【（未外转：transStatus=0） && （不是父单{原单或者子单}：disassembleStatus !== 1）】显示
             *    外转：【（未外转：transStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''） && （未被提货：pickupStatus=0）】显示
             *    还原： 无还原按钮           //【（是父单：parentId=''） && （被拆单：disassembleStatus=1） && （未被提货：pickupStatus=0）】显示
             *    删除： 无删除按钮           //【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （被拆单后的父单：disassembleStatus=1）】显示
             *    编辑： 无编辑按钮           //【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）】（只在详情显示）
             * 2、待送货状态下：（status: 20）
             *    拆单：【（未外转：transStatus=0） && （不是父单{原单或者子单}：disassembleStatus !== 1）&& （未被调度：dispatchStatus=0）】显示
             *    外转：【（未外转：transStatus=0） && （不是上门提货：pickup !== 1） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''） && （未被调度：dispatchStatus=0）】显示
             *    还原：【（是父单：parentId=''） && （被拆单：disassembleStatus=1） && （未被调度：dispatchStatus=0）】显示
             *    删除：【（不是上门提货：pickup !== 1） && （未外转：transStatus=0） && （未被调度：dispatchStatus=0） && （被拆单后的父单：disassembleStatus=1）】显示
             *    编辑：【（未外转：transStatus=0） && （未被调度：dispatchStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）】（只在详情显示）
             */
            let r = params.row
            if (r.status === 10) { // 待提货状态
              // 需显示的按钮组
              let renderBtn = []
              // 拆单按钮
              // if (r.transStatus === 0 && r.disassembleStatus !== 1 && this.hasPower(110103)) {
              //   renderBtn.push(
              //     h('a', {
              //       style: {
              //         marginRight: '25px',
              //         color: '#00a4bd'
              //       },
              //       on: {
              //         click: () => {
              //           this.openSeparateDialog(params)
              //         }
              //       }
              //     }, '拆单')
              //   )
              // }
              // 外转按钮
              if (r.transStatus === 0 && r.disassembleStatus === 0 && r.parentId === '' && r.pickupStatus === 0 && this.hasPower(110104)) {
                renderBtn.push(
                  h('a', {
                    style: {
                      marginRight: '25px',
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        this.openOuterDialog(params)
                      }
                    }
                  }, '外转')
                )
              }
              // 还原按钮
              // if (r.parentId === '' && r.disassembleStatus === 1 && r.pickupStatus === 0 && this.hasPower(110105)) {
              //   renderBtn.push(
              //     h('a', {
              //       style: {
              //         marginRight: '25px',
              //         color: '#00a4bd'
              //       },
              //       on: {
              //         click: () => {
              //           this.openResOrDelDialog(params, '还原')
              //         }
              //       }
              //     }, '还原')
              //   )
              // }
              // 删除按钮
              // if (r.transStatus === 0 && r.pickupStatus === 0 && r.disassembleStatus === 1 && this.hasPower(110107)) {
              //   renderBtn.push(
              //     h('a', {
              //       style: {
              //         marginRight: '25px',
              //         color: '#00a4bd'
              //       },
              //       on: {
              //         click: () => {
              //           this.openResOrDelDialog(params, '删除')
              //         }
              //       }
              //     }, '删除')
              //   )
              // }
              return h('div', renderBtn)
            }
            if (r.status === 20) { // 待调度状态
              // 需显示的按钮组
              let renderBtn = []
              // 拆单按钮
              if (r.transStatus === 0 && r.disassembleStatus !== 1 && r.dispatchStatus === 0 && this.hasPower(110103)) {
                renderBtn.push(
                  h('a', {
                    style: {
                      marginRight: '25px',
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        this.openSeparateDialog(params)
                      }
                    }
                  }, '拆单')
                )
              }
              // 外转按钮
              if (r.transStatus === 0 && r.pickup !== 1 && r.disassembleStatus === 0 && r.parentId === '' && r.dispatchStatus === 0 && this.hasPower(110104)) {
                renderBtn.push(
                  h('a', {
                    style: {
                      marginRight: '25px',
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        this.openOuterDialog(params)
                      }
                    }
                  }, '外转')
                )
              }
              // 还原按钮
              if (r.parentId === '' && r.disassembleStatus === 1 && r.dispatchStatus === 0 && this.hasPower(110105)) {
                renderBtn.push(
                  h('a', {
                    style: {
                      marginRight: '25px',
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        this.openResOrDelDialog(params, '还原')
                      }
                    }
                  }, '还原')
                )
              }
              // 删除按钮
              if (r.pickup !== 1 && r.transStatus === 0 && r.dispatchStatus === 0 && r.disassembleStatus === 1 && this.hasPower(110107)) {
                renderBtn.push(
                  h('a', {
                    style: {
                      marginRight: '25px',
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        this.openResOrDelDialog(params, '删除')
                      }
                    }
                  }, '删除')
                )
              }
              return h('div', renderBtn)
            }
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          fixed: 'left',
          minWidth: 180,
          tooltip: true,
          renderHeader: (h, params) => {
            if (this.curStatusName === '待提货' || this.curStatusName === '待送货') {
              return h('span', [
                h('span', params.column.title),
                h('Tooltip', {
                  props: {
                    'max-width': '220',
                    offset: -9,
                    content: '待调度订单可进行提货 / 送货调度',
                    placement: 'top-start',
                    transfer: true
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'ios-information-circle',
                      size: '16',
                      color: '#FFBB44'
                    },
                    style: {
                      verticalAlign: 'sub',
                      marginLeft: '4px'
                    }
                  })
                ])
              ])
            } else {
              return h('span', params.column.title)
            }
          },
          render: (h, params) => {
            /**
             * 待调度标识：
             *  待提货（status:10）&& 未创建提货单(pickupStatus: 0) && 未外转(transStatus: 0) && 是父单(parentId：'') 可以提货调度
             *  待送货（status:20）&& 未创建运单(dispatchStatus: 0) && 未外转(transStatus: 0) && 不是父单（disassembleStatus !== 1）可以送货调度
            */
            if (this.curStatusName === '待提货' && params.row.pickupStatus === 0 && params.row.transStatus === 0 && params.row.parentId === '') {
              return h('div', [
                h('a', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#418DF9',
                    display: 'block'
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
                }, params.row.orderNo),
                h('span', {
                  style: {
                    display: 'inline-block',
                    height: '14px',
                    background: 'rgba(250,135,30,1)',
                    borderRadius: '2px',
                    color: '#fff',
                    lineHeight: '14px',
                    fontSize: '9px',
                    padding: '0 3px'
                  }
                }, '待调度')
              ])
            } else if (this.curStatusName === '待送货' && params.row.dispatchStatus === 0 && params.row.transStatus === 0 && params.row.disassembleStatus !== 1) {
              if (params.row.parentId !== '') {
                return h('div', [
                  h('a', {
                    props: {
                      type: 'text'
                    },
                    style: {
                      marginRight: '5px',
                      color: '#418DF9',
                      display: 'block'
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
                  }, params.row.orderNo),
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
                      fontSize: '9px'
                    }
                  }, '子'),
                  h('span', {
                    style: {
                      display: 'inline-block',
                      height: '14px',
                      background: 'rgba(250,135,30,1)',
                      borderRadius: '2px',
                      color: '#fff',
                      lineHeight: '14px',
                      fontSize: '9px',
                      padding: '0 3px'
                    }
                  }, '待调度')
                ])
              } else {
                return h('div', [
                  h('a', {
                    props: {
                      type: 'text'
                    },
                    style: {
                      marginRight: '5px',
                      color: '#418DF9',
                      display: 'block'
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
                  }, params.row.orderNo),
                  h('span', {
                    style: {
                      display: 'inline-block',
                      height: '14px',
                      background: 'rgba(250,135,30,1)',
                      borderRadius: '2px',
                      color: '#fff',
                      lineHeight: '14px',
                      fontSize: '9px',
                      padding: '0 3px'
                    }
                  }, '待调度')
                ])
              }
            } else if (params.row.parentId !== '') {
              return h('div', [
                h('a', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    marginRight: '5px',
                    color: '#418DF9',
                    display: 'block'
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
                }, params.row.orderNo),
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
                    fontSize: '9px'
                  }
                }, '子')
              ])
            } else {
              return [h('a', {
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
              }, params.row.orderNo)]
            }
          }
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          minWidth: 160,
          render: (h, p) => {
            return h('span', p.row.customerOrderNo ? p.row.customerOrderNo : '-')
          }
        },
        {
          title: '运单号',
          key: 'waybillNo',
          minWidth: 160,
          render: (h, p) => {
            return h('span', p.row.waybillNo ? p.row.waybillNo : '-')
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '始发地',
          key: 'start',
          minWidth: 180,
          ellipsis: true,
          render: (h, params) => {
            if (this.cityFormatter(params.row.start).length > 12) {
              return h('Tooltip', {
                props: {
                  placement: 'bottom',
                  content: this.cityFormatter(params.row.start)
                }
              }, [
                h('span', this.formatterAddress(this.cityFormatter(params.row.start)))
              ])
            } else {
              return h('span', this.cityFormatter(params.row.start))
            }
          }
        },
        {
          title: '目的地',
          key: 'end',
          minWidth: 180,
          ellipsis: true,
          render: (h, params) => {
            if (this.cityFormatter(params.row.end).length > 12) {
              return h('Tooltip', {
                props: {
                  placement: 'bottom',
                  content: this.cityFormatter(params.row.end)
                }
              }, [
                h('span', this.formatterAddress(this.cityFormatter(params.row.end)))
              ])
            } else {
              return h('span', this.cityFormatter(params.row.end))
            }
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.volume ? p.row.volume : '-')
          }
        },
        {
          title: '重量（吨）',
          key: 'weight',
          minWidth: 100,
          render: (h, p) => {
            return h('span', p.row.weight ? p.row.weight : '-')
          }
        },
        {
          title: '下单时间',
          key: 'createTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.createTime ? new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
          }
        },
        {
          title: '要求发货时间',
          key: 'deliveryTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.deliveryTime ? new Date(params.row.deliveryTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
          }
        },
        {
          title: '期望到货时间',
          key: 'arriveTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.arriveTime ? new Date(params.row.arriveTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
          }
        },
        {
          title: '发货人',
          key: 'consignerContact',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '发货人手机号',
          key: 'consignerPhone',
          minWidth: 130,
          tooltip: true
        },
        {
          title: '发货地址',
          key: 'consignerAddress',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '收货人',
          key: 'consigneeContact',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '收货人手机号',
          key: 'consigneePhone',
          minWidth: 130,
          tooltip: true
        },
        {
          title: '收货地址',
          key: 'consigneeAddress',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '结算方式',
          key: 'settlementType',
          minWidth: 120,
          render: (h, params) => {
            return h('span', this.settlementToName(params.row.settlementType))
          }
        },
        {
          title: '运输费',
          key: 'freightFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.freightFee ? (params.row.freightFee / 100).toFixed(2) : '-')
          }
        },
        {
          title: '装货费',
          key: 'loadFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.loadFee ? (params.row.loadFee / 100).toFixed(2) : '-')
          }
        },
        {
          title: '卸货费',
          key: 'unloadFee',
          minWidth: 120,

          render: (h, params) => {
            return h('span', params.row.unloadFee ? (params.row.unloadFee / 100).toFixed(2) : '-')
          }
        },
        {
          title: '保险费',
          key: 'insuranceFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.insuranceFee ? (params.row.insuranceFee / 100).toFixed(2) : '-')
          }
        },
        {
          title: '其他',
          key: 'otherFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.otherFee ? (params.row.otherFee / 100).toFixed(2) : '-')
          }
        },
        {
          title: '总费用',
          key: 'totalFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.totalFee ? (params.row.totalFee / 100).toFixed(2) : '-')
          }
        },
        {
          title: '提货方式',
          key: 'pickup',
          minWidth: 120,
          render: (h, params) => {
            return h('span', this.pickupToName(params.row.pickup))
          }
        },
        {
          title: '回单数量',
          key: 'receiptCount',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '制单人',
          key: 'creatorName',
          minWidth: 120,
          render: (h, p) => {
            return h('span', p.row.creatorName ? p.row.creatorName : '-')
          }
        }
      ],
      operateCol: [], // 操作列
      extraColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          fixed: true,
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
          title: '要求发货时间',
          key: 'deliveryTime',
          fixed: false,
          visible: true
        },
        {
          title: '期望到货时间',
          key: 'arriveTime',
          fixed: false,
          visible: true
        },
        {
          title: '发货人',
          key: 'consignerContact',
          fixed: false,
          visible: true
        },
        {
          title: '发货人手机号',
          key: 'consignerPhone',
          fixed: false,
          visible: false
        },
        {
          title: '发货地址',
          key: 'consignerAddress',
          fixed: false,
          visible: false
        },
        {
          title: '收货人',
          key: 'consigneeContact',
          fixed: false,
          visible: false
        },
        {
          title: '收货人手机号',
          key: 'consigneePhone',
          fixed: false,
          visible: false
        },
        {
          title: '收货地址',
          key: 'consigneeAddress',
          fixed: false,
          visible: false
        },
        {
          title: '结算方式',
          key: 'settlementType',
          fixed: false,
          visible: false
        },
        {
          title: '运输费',
          key: 'freightFee',
          fixed: false,
          visible: false
        },
        {
          title: '装货费',
          key: 'loadFee',
          fixed: false,
          visible: false
        },
        {
          title: '卸货费',
          key: 'unloadFee',
          fixed: false,
          visible: false
        },
        {
          title: '保险费',
          key: 'insuranceFee',
          fixed: false,
          visible: false
        },
        {
          title: '其他',
          key: 'otherFee',
          fixed: false,
          visible: false
        },
        {
          title: '总费用',
          key: 'totalFee',
          fixed: false,
          visible: false
        },
        {
          title: '提货方式',
          key: 'pickup',
          fixed: false,
          visible: false
        },
        {
          title: '回单数量',
          key: 'receiptCount',
          fixed: false,
          visible: false
        },
        {
          title: '制单人',
          key: 'creatorName',
          fixed: false,
          visible: false
        }
      ],
      orderPrint: []
    }
  },

  computed: {
    ...mapGetters([
      'clients'
    ])
  },

  created () {
    let importId = jsCookie.get('imported_id')
    // 刷新页面停留当前tab页
    if (!importId) {
      console.log(jsCookie.get('imported_id'))
      if (sessionStorage.getItem('ORDER_TAB_NAME')) {
        this.curStatusName = sessionStorage.getItem('ORDER_TAB_NAME')
        this.keyword.status = this.statusToCode(this.curStatusName)
        this.handleTabChange(this.curStatusName) // 表头按钮状态
      } else {
        sessionStorage.setItem('ORDER_TAB_NAME', '待提货')
        this.keyword.status = 10
        this.handleTabChange('待提货') // 表头按钮状态
      }
    } else { // 批量导入点查看进入的传importId字段，订单列表显示《全部》tab页
      this.keywords.importId = importId
      this.keyword.status = null // 默认全部状态
      this.keyword = this.keywords
      sessionStorage.setItem('ORDER_TAB_NAME', '全部')
      this.curStatusName = '全部'
      jsCookie.remove('imported_id')
    }
  },

  mounted () {
    this.getOrderNum()
  },

  methods: {
    ...mapActions([
      'getClients'
    ]),
    // 获取各状态订单数目
    getOrderNum () {
      Server({
        url: 'order/getOrderNumByStatus',
        method: 'get',
        data: {
          importId: this.keywords.importId || null
        }
      }).then((res) => {
        console.log(res)
        let list = res.data.data
        let arr = []
        list.map((item) => {
          if (item.total !== undefined) {
            let t = {
              name: '全部',
              count: ''
            }
            arr.unshift(t)
          }
          if (item.pickup !== undefined) {
            let p = {
              name: '待提货',
              count: item.pickup
            }
            arr.push(p)
          }
          if (item.dispatch !== undefined) {
            let d = {
              name: '待送货',
              count: item.dispatch
            }
            arr.push(d)
          }
          if (item.transit !== undefined) {
            let t = {
              name: '在途',
              count: item.transit
            }
            arr.push(t)
          }
          if (item.arrive !== undefined) {
            let a = {
              name: '已到货',
              count: item.arrive
            }
            arr.push(a)
          }
          if (item.receipt !== undefined) {
            let r = {
              name: '已回单',
              count: item.receipt
            }
            arr.push(r)
          }
        })
        console.log(arr)
        this.status = arr
      })
    },
    // tab状态栏切换
    handleTabChange (val) {
      console.log(val)
      this.curStatusName = val
      this.selectOrderList = [] // 重置当前已勾选项
      this.selectedId = [] // 重置当前已勾选id项
      if (val === '全部') {
        // 全部、待提货、待调度加上操作栏
        this.addOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '送货调度', value: 1, code: 110101 },
          { name: '提货调度', value: 2, code: 110102 },
          { name: '订单还原', value: 3, code: 110105 },
          { name: '删除', value: 4, code: 110107 },
          { name: '打印', value: 5, code: 110108 },
          { name: '导出', value: 6, code: 110109 }
        ]
        this.keywords.status = null
        // this.keyword = {...this.keywords}
      } else if (val === '待提货') {
        // 全部、待提货、待调度加上操作栏
        this.addOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '提货调度', value: 1, code: 110102 },
          { name: '删除', value: 2, code: 110107 },
          { name: '打印', value: 3, code: 110108 },
          { name: '导出', value: 4, code: 110109 }
        ]
        this.keywords.status = 10
        // this.keyword = {...this.keywords}
      } else if (val === '待送货') {
        // 全部、待提货、待调度加上操作栏
        this.addOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '送货调度', value: 1, code: 110101 },
          { name: '订单还原', value: 2, code: 110105 },
          { name: '删除', value: 3, code: 110107 },
          { name: '打印', value: 4, code: 110108 },
          { name: '导出', value: 5, code: 110109 }
        ]
        this.keywords.status = 20
        // this.keyword = {...this.keywords}
      } else {
        // 在途、已到货、已回单取消操作栏
        this.deleteOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1, code: 110109 }
        ]
        if (val === '在途') {
          this.keywords.status = 30
        } else if (val === '已到货') {
          this.keywords.status = 40
        } else {
          this.keywords.status = 50
        }
        // this.keyword = {...this.keywords}
      }
      this.isSearching = true
      this.clearKeywords() // 清楚搜索条件
    },
    // 表头按钮操作
    handleOperateClick (btn) {
      // this.operateValue = btn.value
      if (!this.selectOrderList.length && btn.name !== '导出') {
        this.$Message.warning('请至少选择一条信息')
        return
      }
      this.isBatchOperation(btn)
    },
    // 判断各个状态下表头按钮批量操作报错
    isBatchOperation (btn) {
      if (btn.name === '送货调度') { // 待调度（status:20）&& 未创建运单(dispatchStatus: 0) && 未外转(transStatus: 0) && 不是父单（disassembleStatus !== 1）可以批量操作
        if (this.selectOrderList.length > 20) { // 一次最多选择20条订单
          this.$Message.warning('一次最多选择20条订单')
          return
        }
        let data = this.selectOrderList.find((item) => {
          return (item.status !== 20 || item.dispatchStatus !== 0 || item.transStatus !== 0 || item.disassembleStatus === 1)
        })
        if (data !== undefined) {
          console.log(this.selectOrderList)
          this.$Message.warning('您选择的订单不支持送货调度')
        } else {
          this.openDispatchDialog(btn.name)
        }
      } else if (btn.name === '提货调度') { // 待提货（status:10）且未创建提货单(pickupStatus: 0)且未外转(transStatus: 0)且是父单(parentId：'') 可以批量操作
        if (this.selectOrderList.length > 20) { // 一次最多选择20条订单
          this.$Message.warning('一次最多选择20条订单')
          return
        }
        let data = this.selectOrderList.find((item) => {
          return (item.status !== 10 || item.pickupStatus !== 0 || item.transStatus !== 0 || item.parentId !== '')
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持提货调度')
        } else {
          this.openDispatchDialog(btn.name)
        }
      } else if (btn.name === '订单还原') { // 【（是待提货或待调度状态：status < 30） && （是父单：parentId=''） && （被拆单：disassembleStatus=1） && 【规则取消：（未被提货：pickupStatus=0） && 】（未被调度：dispatchStatus=0） && （未外转：transStatus=0）】 可以批量操作
        let data = this.selectOrderList.find((item) => {
          return (item.status > 20 || item.parentId !== '' || item.disassembleStatus !== 1 || item.dispatchStatus !== 0 || item.transStatus !== 0)
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持订单还原')
        } else {
          this.openResOrDelDialog('', btn.name)
        }
      } else if (btn.name === '删除') { // 【（是待提货或待调度状态：status < 30） && （未外转：transStatus=0） && （未被提货：pickupStatus=0） && （未被调度：dispatchStatus=0） && （被拆单后的父单：disassembleStatus=1） && （待调度条件下不是上门提货（pickup !== 1））】可以批量操作
        let data = this.selectOrderList.find((item) => {
          return (item.status > 20 || item.pickupStatus !== 0 || item.dispatchStatus !== 0 || item.transStatus !== 0 || (item.status === 20 && item.pickup === 1))
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持删除')
        } else {
          this.openResOrDelDialog('', btn.name)
        }
      } else if (btn.name === '导出') {
        this.export()
      } else {
        // 打印
        this.print()
      }
    },
    // 外转
    openOuterDialog (params) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/outer',
        data: { detail: params.row },
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.setSelection()
            _this.getOrderNum() // 刷新tab页数量
          }
        }
      })
    },
    // 拆单
    openSeparateDialog (params) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/separate',
        data: { id: params.row.id, orderNo: params.row.orderNo },
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.setSelection()
            _this.getOrderNum() // 刷新tab页数量
          }
        }
      })
    },
    // 送货或提货调度
    openDispatchDialog (name) {
      const _this = this
      _this.openDialog({
        name: 'order-management/dialog/dispatch',
        data: { id: this.selectOrderList, name: name },
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.setSelection()
            _this.getOrderNum() // 刷新tab页数量
          }
        }
      })
    },
    // 还原或删除 (支持单条和多条)
    openResOrDelDialog (params, name) {
      const _this = this
      const data = {
        id: this.selectOrderList,
        name: name
      }
      // params不为空时，id值为当前行
      if (params) {
        data.id = [params.row]
      }
      console.log(this.selectOrderList)
      _this.openDialog({
        name: 'order-management/dialog/restoreOrDelete',
        data: data,
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.setSelection()
            _this.getOrderNum() // 刷新tab页数量
          }
        }
      })
    },
    // 重置勾选项
    setSelection () {
      this.selectOrderList = [] // 重置当前已勾选项
      this.selectedId = [] // 重置当前已勾选id项
      this.$refs.pageTable.clearSelected()
    },
    // 状态转为状态码
    statusToCode (name) {
      let code
      switch (name) {
        case '全部':
          code = null
          break
        case '待提货':
          code = 10
          break
        case '待送货':
          code = 20
          break
        case '在途':
          code = 30
          break
        case '已到货':
          code = 40
          break
        case '已回单':
          code = 50
          break
        default:
          code = 10
          break
      }
      return code
    },
    // 打印
    print () {
      Server({
        url: 'order/getOrderAndDetailList',
        method: 'post',
        data: {
          orderIds: this.selectedId
        }
      }).then((res) => {
        console.log(res)
        this.orderPrint = _.cloneDeep(res.data.data)
        this.$refs.printer.print()
      })
    },
    // 导出
    export () {
      const data = Object.assign({}, this.keyword, {
        exportOrderIds: this.selectedId.length > 0 ? this.selectedId : null
      })
      Export({
        url: 'order/exportOrder',
        method: 'post',
        data,
        fileName: '订单明细'
      })
    },
    // 待调度
    rowClassName (row, index) {
      if ((this.curStatusName === '待提货' && row.pickupStatus === 0 && row.transStatus === 0 && row.parentId === '') || (this.curStatusName === '待送货' && row.dispatchStatus === 0 && row.transStatus === 0 && row.disassembleStatus !== 1)) {
        return 'ivu-table-row-gray'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang='stylus' scoped>
.ivu-btn
  margin-right 15px
  width 80px
  height 35px
.ivu-btn-default
  background #F9F9F9
.high-search
  width 36px
  height 36px
  line-height 1.4
  letter-spacing 2px
  padding 0
  white-space normal
  margin-right 0
  margin-left 8px
.operate-box
  background: rgba(249,249,249,1)
  margin: 15px 0
  padding: 10px
  .ivu-input-wrapper,.ivu-auto-complete
    margin-right 20px
</style>
<style lang="stylus">
.order-simple-select
  .ivu-select-selection
    height 35px
  .ivu-select-selected-value
    height 35px !important
    line-height 35px !important
.order-right
  .ivu-input
    height 35px
</style>
