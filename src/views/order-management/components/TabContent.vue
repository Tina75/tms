<template>
  <div>
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
        <Input v-model="keywords.customerOrderNo" :maxlength="30" placeholder="请输入客户单号" style="width: 200px" />
        <Input v-if="source !== 'transport'" v-model="keywords.waybillNo" :maxlength="30" placeholder="请输入运单号" style="width: 200px" />
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div>
          <!-- <area-select v-model="cityCodes.startCodes" :deep="true" placeholder="请输入始发地" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <area-select v-model="cityCodes.endCodes" :deep="true" placeholder="请输入目的地" style="width:200px;display: inline-block;margin-right: 20px;"></area-select> -->
          <city-select v-model="keywords.start" placeholder="请输入始发地" style="width:200px;display: inline-block;margin-right: 20px;"></city-select>
          <city-select v-model="keywords.end" placeholder="请输入目的地" style="width:200px;display: inline-block;margin-right: 20px;"></city-select>
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
      :show-filter="true"
      :row-class-name="rowClassName"
      :row-selection="showCheckBox"
      :table-head-type="tableHeadSource"
      style="margin-top: 15px"
      @on-selection-change="handleSelectionChange"
      @on-column-change="handleColumnChange">
    </page-table>
    <OrderPrint ref="printer" :list="orderPrint"></OrderPrint>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import PageTable from '@/components/page-table/'
import Server from '@/libs/js/server'
import Export from '@/libs/js/export'
// import AreaSelect from '@/components/AreaSelect'
import CitySelect from '@/components/SelectInputForCity'
import SelectInput from '@/components/SelectInput.vue'
import OrderPrint from './OrderPrint'
import FontIcon from '@/components/FontIcon'
import IconLabel from '@/components/IconLabel'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
// import City from '@/libs/js/city'
import SearchMixin from '../searchMixin'
// import jsCookie from 'js-cookie'
export default {
  name: 'TabContent',

  components: {
    PageTable,
    // AreaSelect,
    CitySelect,
    SelectInput,
    OrderPrint,
    FontIcon
  },
  mixins: [ BasePage, SearchMixin ],
  props: {
    tabStatus: {
      type: String,
      require: true
    },
    // keyword
    tabKey: {
      type: Object,
      require: true
    },
    // 导入批次号id
    importId: {
      type: String
    },
    // 页面来源,默认订单管理页面
    source: {
      type: String,
      default: 'order'
    },
    // 查询接口url
    url: {
      type: String,
      default: 'order/list'
    },
    // 导出接口url
    exportUrl: {
      type: String,
      default: 'order/exportOrder'
    },
    // 是否需要隐藏父单的checkBox
    isVisiable: {
      type: Boolean,
      default: false
    },
    // 表头筛选字段根据来源各自展示
    tableHeadSource: {
      type: String,
      default: 'order_head'
    },
    // 刷新tab数量的回调
    refreshTab: Function
  },
  data () {
    return {
      tabType: 'ORDER',
      method: 'post',
      btnGroup: [
        // { name: '送货调度', value: 1, code: 110101 },
        // { name: '提货调度', value: 2, code: 110102 },
        // { name: '订单还原', value: 3, code: 110105 },
        // { name: '删除', value: 4, code: 110107 },
        // { name: '打印', value: 5, code: 110108 },
        // { name: '导出', value: 6, code: 110109 },
        // { name: '恢复', value: 7, code: 110110 },
        // { name: '彻底删除', value: 8, code: 110111 }
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
             * 2、待调度状态下：（status: 20）
             *    拆单：【（未外转：transStatus=0） && （不是父单{原单或者子单}：disassembleStatus !== 1）&& （未被调度：dispatchStatus=0）】显示
             *    外转：【（未外转：transStatus=0） && （不是上门提货：pickup !== 1）备注：v1.3版本 上门提货完可以外转 && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）/ 备注：v1.05版本 子单可以外转 / && （未被调度：dispatchStatus=0）】显示
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
              if (r.transStatus === 0 && r.disassembleStatus === 0 && r.parentId === '' && r.pickupStatus === 0 && this.hasPower(120209)) {
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
              if (r.transStatus === 0 && r.disassembleStatus !== 1 && r.dispatchStatus === 0 && this.hasPower(120110)) {
                if (r.collectionMoney > 0) {
                  renderBtn.push(
                    h('Tooltip', {
                      props: {
                        maxWidth: '200',
                        offset: -9,
                        content: '有代收货款的订单不允许拆单',
                        placement: 'top-start',
                        transfer: true
                      }
                    }, [
                      h('a', {
                        style: {
                          marginRight: '25px',
                          color: '#B6E4EC'
                        },
                        on: {
                        }
                      }, '拆单')
                    ])
                  )
                } else {
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
              }
              // 外转按钮
              if (r.transStatus === 0 && r.disassembleStatus === 0 && r.dispatchStatus === 0 && this.hasPower(120111)) {
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
              if (r.parentId === '' && r.disassembleStatus === 1 && r.dispatchStatus === 0 && this.hasPower(120112)) {
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
              // if (r.pickup !== 1 && r.transStatus === 0 && r.dispatchStatus === 0 && r.disassembleStatus === 1 && this.hasPower(110107)) {
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
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          fixed: 'left',
          minWidth: 190,
          tooltip: true,
          className: 'padding-20',
          /*
          renderHeader: (h, params) => {
            if (this.tabStatus === '待提货' || this.tabStatus === '待送货') {
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
          */
          render: (h, params) => {
            /**
             * 订单管理入口: 没有子单标识，处理中(已外转、已提货、已送货)的单子加上沙漏标记
             * 运输管理入口：子弹需要加上子弹标识
             * 所有入口加上需判断代收货款标记
            */
            let renderHtml = [
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
                        from: 'order',
                        source: this.source
                      }
                    })
                  }
                }
              }, params.row.orderNo)
            ]
            if (this.source === 'order') {
              if ((params.row.status < 30 && params.row.transStatus === 1) || (params.row.status === 10 && params.row.pickupStatus === 1) || (params.row.status === 20 && params.row.dispatchStatus === 1)) {
                renderHtml.push(
                  h(FontIcon, {
                    props: {
                      type: 'ico-ing',
                      size: '11',
                      color: '#9DA1B0'
                    }
                  })
                )
              }
            } else {
              if (params.row.parentId !== '') {
                renderHtml.unshift(
                  h(IconLabel, {
                    props: {
                      text: '子',
                      background: '#418DF9'
                    }
                  })
                )
              }
            }
            if (params.row.collectionMoney > 0) { // 代收货款标记
              renderHtml.push(
                h(IconLabel, {
                  props: {
                    text: '代',
                    background: '#FA8C15'
                  },
                  style: {
                    display: 'block'
                  }
                })
              )
            }
            return h('div', renderHtml)
          }
        },
        {
          title: '客户单号',
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
            if (p.row.waybillNo) {
              let waybillNoArr = p.row.waybillNo.split(',')
              console.log(waybillNoArr)
              if (waybillNoArr.length > 1) {
                return h('Tooltip', {
                  props: {
                    placement: 'bottom',
                    maxWidth: 152,
                    content: p.row.waybillNo
                  }
                }, [
                  h('span', waybillNoArr[0] + ' ...')
                ])
              } else {
                return h('span', p.row.waybillNo)
              }
            } else {
              return h('span', '-')
            }
          }
        },
        {
          title: '订单状态',
          key: 'status',
          minWidth: 120,
          render: (h, p) => {
            return h('span', this.statusToName(p.row.status))
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
            if (params.row.startName.length > 12) {
              return h('Tooltip', {
                props: {
                  placement: 'bottom',
                  content: params.row.startName
                }
              }, [
                h('span', this.formatterAddress(params.row.startName))
              ])
            } else {
              return h('span', params.row.startName)
            }
          }
        },
        {
          title: '目的地',
          key: 'end',
          minWidth: 180,
          ellipsis: true,
          render: (h, params) => {
            if (params.row.endName.length > 12) {
              return h('Tooltip', {
                props: {
                  placement: 'bottom',
                  content: params.row.endName
                }
              }, [
                h('span', this.formatterAddress(params.row.endName))
              ])
            } else {
              return h('span', params.row.endName)
            }
          }
        },
        {
          title: '计费里程（公里）',
          key: 'mileage',
          width: 120,
          render: (h, params) => {
            return h('span', params.row.mileage / 1000 ? params.row.mileage / 1000 : '-')
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
          title: '发货时间',
          key: 'deliveryTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.deliveryTime ? new Date(params.row.deliveryTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
          }
        },
        {
          title: '到货时间',
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
          title: '提货费',
          key: 'pickupFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.pickupFee ? (params.row.pickupFee / 100).toFixed(2) : '-')
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
          title: '代收货款',
          key: 'collectionMoney',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.collectionMoney ? (params.row.collectionMoney / 100).toFixed(2) : '-')
          }
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
      orderPrint: [],
      keyword: {
        status: 10 // 默认待提货状态  传给pageTable可重新请求数据
      },
      showCheckBox: {
        isVisible: (row) => {
          if (this.isVisiable) { // 送货管理待调度为 true
            // 父单隐藏checkBox
            if (row.parentId === '' && row.disassembleStatus === 1) {
              return false
            } else {
              return true
            }
          } else {
            return true
          }
        }
      }
    }
  },

  computed: {
    ...mapGetters([
      'clients'
    ])
  },

  watch: {
    tabStatus (val) {
      console.log(val)
      this.handleTabChange(val)
    }
  },

  created () {
    // 订单列表里删除操作栏
    if (this.source === 'order') {
      this.deleteOperateCol()
    } else { // 运输管理列表不展示运单号字段，且无运单号搜索条件
      let index
      this.tableColumns.find((item, idx) => {
        item.title === '运单号' && (index = idx)
      })
      if (index) {
        this.tableColumns.splice(index, 1)
      }
      this.selectList = [
        {
          value: 0,
          label: '客户名称'
        },
        {
          value: 1,
          label: '订单号'
        }
      ]
    }
    // 有导入批次号添加批次号搜索
    if (this.importId) {
      this.keywords.importId = this.importId
      this.handleTabChange('全部')
    } else {
      this.handleTabChange(this.tabStatus)
    }
  },

  mounted () {
    // console.log(this.source)
    // 订单、运单代收货款字段放在回单数量后面
    // if (this.source === 'order') {
    //   let index
    //   this.tableColumns.find((item, idx) => {
    //     item.title === '目的地' && (index = idx)
    //   })
    //   if (index) {
    //     this.tableColumns.splice(index + 1, 1, {
    //       title: '计费里程（公里）',
    //       key: 'mileage',
    //       width: 120,
    //       render: (h, params) => {
    //         return h('span', params.row.mileage / 1000 ? params.row.mileage / 1000 : '-')
    //       }
    //     })
    //   }
    // }
  },

  methods: {
    ...mapActions([
      'getClients'
    ]),
    // tab状态栏切换
    handleTabChange (val) {
      // this.selectOrderList = [] // 重置当前已勾选项
      // this.selectedId = [] // 重置当前已勾选id项
      // 页面来源
      if (this.source === 'order') {
        if (val === '全部' || val === '待提货' || val === '待送货') {
          this.btnGroup = [
            { name: '导出', value: 6, code: 110109 },
            { name: '打印', value: 5, code: 110108 },
            { name: '删除', value: 4, code: 110107 }
          ]
          if (val === '全部') {
            this.keywords.status = null
          } else if (val === '待提货') {
            this.keywords.status = 10
          } else if (val === '待送货') {
            this.keywords.status = 20
          }
        } else if (val === '回收站') {
          this.btnGroup = [
            { name: '恢复', value: 7, code: 110110 },
            { name: '彻底删除', value: 8, code: 110111 }
          ]
          this.keywords.status = 100
        } else {
          this.btnGroup = [
            { name: '导出', value: 6, code: 110109 }
          ]
          if (val === '在途') {
            this.keywords.status = 30
          } else if (val === '已到货') {
            this.keywords.status = 40
          } else if (val === '已回单') {
            this.keywords.status = 50
          }
        }
      } else {
        if (val === '待提货') {
          this.btnGroup = [
            { name: '提货调度', value: 1, code: 120208 },
            { name: '打印', value: 5, code: 120202 },
            { name: '导出', value: 6, code: 120207 }
          ]
          this.keywords.status = 10
        } else {
          this.btnGroup = [
            { name: '送货调度', value: 1, code: 120109 },
            { name: '打印', value: 5, code: 120103 },
            { name: '导出', value: 6, code: 120108 }
          ]
          this.keywords.status = 20
        }
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
        // let data = this.selectOrderList.find((item) => {
        //   return (item.status > 20 || item.pickupStatus !== 0 || item.dispatchStatus !== 0 || item.transStatus !== 0 || (item.status === 20 && item.pickup === 1))
        // })
        // if (data !== undefined) {
        //   this.$Message.warning('您选择的订单不支持删除')
        // } else {
        // }
        this.openResOrDelDialog('', btn.name)
      } else if (btn.name === '导出') {
        this.export()
      } else if (btn.name === '打印') {
        // 打印
        this.print()
      } else if (btn.name === '恢复') {
        // 恢复
        this.recoveryDialog()
      } else {
        // 彻底删除
        this.completelyDeleteDialog()
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
            _this.$emit('refresh-tab') // 刷新tab页数量
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
            _this.$emit('refresh-tab') // 刷新tab页数量
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
            _this.$emit('refresh-tab') // 刷新tab页数量
          }
        }
      })
    },
    // 还原或删除 (支持单条和多条)
    openResOrDelDialog (params, name) {
      const _this = this
      const data = {
        id: this.selectOrderList,
        name: name,
        tab: this.tabStatus
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
            _this.$emit('refresh-tab') // 刷新tab页数量
          }
        }
      })
    },
    // 恢复
    recoveryDialog () {
      const _this = this
      _this.openDialog({
        name: 'order-management/dialog/recovery',
        data: { id: this.selectOrderList },
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.setSelection()
            _this.$emit('refresh-tab') // 刷新tab页数量
          }
        }
      })
    },
    // 彻底删除
    completelyDeleteDialog () {
      const _this = this
      _this.openDialog({
        name: 'order-management/dialog/completelyDelete',
        data: { id: this.selectOrderList },
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.setSelection()
            _this.$emit('refresh-tab') // 刷新tab页数量
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
        url: this.exportUrl,
        method: 'post',
        data,
        fileName: '订单明细'
      })
    },
    // 待调度
    rowClassName (row, index) {
      // if ((this.tabStatus === '待提货' && row.pickupStatus === 0 && row.transStatus === 0 && row.parentId === '') || (this.tabStatus === '待送货' && row.dispatchStatus === 0 && row.transStatus === 0 && row.disassembleStatus !== 1)) {
      //   return 'ivu-table-row-gray'
      // } else {
      //   return ''
      // }
    }
  }
}
</script>

<style lang='stylus' scoped>
.ivu-btn
  margin-right 15px
  width 80px
  height 32px
.ivu-btn-default
  background #F9F9F9
.high-search
  width 36px !important
  height 36px
  line-height 1.2
  letter-spacing 1px
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
.operate-box .ivu-input-group
  display inline-block
.padding-20
  .ivu-table-cell
    padding-left 20px
</style>
