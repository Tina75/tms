<template>
  <div>
    <tab-header :name="curStatusName" :tabs="status" @tabChange="handleTabChange"></tab-header>
    <div style="margin-top: 30px;display: flex;justify-content: space-between;">
      <div>
        <Button v-for="(btn, index) in btnGroup" :key="index" :type="btn.value === operateValue ? 'primary' : 'default'" @click="handleOperateClick(btn)">{{ btn.name }}</Button>
      </div>
      <div v-if="simpleSearch" class="right">
        <Select v-model="selectStatus"  style="width:120px;margin-right: 11px" @on-change="handleChangeSearchStatus">
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
        <Button type="primary" icon="ios-search" style="width: 40px;margin-right: 0;" @click="searchList"></Button>
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
          <area-select v-model="keywords.start" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <area-select v-model="keywords.end" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
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
      style="margin-top: 15px"
      @on-selection-change="handleSelectionChange"
      @on-column-change="handleColumnChange">
    </page-table>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from '@/components/TabHeader'
import PageTable from '@/components/page-table/'
import Server from '@/libs/js/server'
import AreaSelect from '@/components/AreaSelect'
import SelectInput from '@/components/SelectInput.vue'
import { mapGetters, mapActions } from 'vuex'
import City from '@/libs/js/City'
import SearchMixin from './searchMixin'
export default {
  name: 'order',

  components: {
    TabHeader,
    PageTable,
    AreaSelect,
    SelectInput
  },
  mixins: [ BasePage, SearchMixin ],
  metaInfo: { title: '订单管理' },
  data () {
    return {
      url: 'order/list',
      method: 'post',
      status: [
        { name: '全部', count: '' },
        { name: '待提货', count: '' },
        { name: '待调度', count: '' },
        { name: '在途', count: '' },
        { name: '已到货', count: '' },
        { name: '已回单', count: '' }
      ],
      curStatusName: '待提货',
      btnGroup: [
        { name: '送货调度', value: 1 },
        { name: '提货调度', value: 2 },
        { name: '订单还原', value: 3 },
        { name: '删除', value: 4 },
        { name: '导出', value: 5 }
      ],
      operateValue: 1,
      keyword: {
        status: 10 // 默认待提货状态  传给pageTable可重新请求数据
      },
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '操作',
          key: 'do',
          width: 140,
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
             *    拆单：【（未外转：transStatus=0） && （不是父单{原单或者子单}：disassembleStatus !== 1）】显示
             *    外转：【（未外转：transStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''） && （未被提货：pickupStatus=0）】显示
             *    还原：【（是父单：parentId=''） && （被拆单：disassembleStatus=1） && （未被提货：pickupStatus=0）】显示
             *    删除：【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （被拆单后的父单：disassembleStatus=1）】显示
             *    编辑：【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）】（只在详情显示）
             * 2、待调度状态下：（status: 20）
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
              if (r.transStatus === 0 && r.disassembleStatus !== 1) {
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
              if (r.transStatus === 0 && r.disassembleStatus === 0 && r.parentId === '' && r.pickupStatus === 0) {
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
              if (r.parentId === '' && r.disassembleStatus === 1 && r.pickupStatus === 0) {
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
              if (r.transStatus === 0 && r.pickupStatus === 0 && r.disassembleStatus === 1) {
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
            if (r.status === 20) { // 待调度状态
              // 需显示的按钮组
              let renderBtn = []
              // 拆单按钮
              if (r.transStatus === 0 && r.disassembleStatus !== 1 && r.dispatchStatus === 0) {
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
              if (r.transStatus === 0 && r.pickup !== 1 && r.disassembleStatus === 0 && r.parentId === '' && r.dispatchStatus === 0) {
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
              if (r.parentId === '' && r.disassembleStatus === 1 && r.dispatchStatus === 0) {
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
              if (r.pickup !== 1 && r.transStatus === 0 && r.dispatchStatus === 0 && r.disassembleStatus === 1) {
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
            return h('span', new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss'))
          }
        }
      ],
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
          title: '发货联系人',
          key: 'consignerContact',
          fixed: false,
          visible: false
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
          title: '收货联系人',
          key: 'consigneeName',
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
          title: '收货人手机号',
          key: 'consigneePhone',
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
          title: '运费',
          key: 'freightFee',
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
          visible: false
        }
      ],
      selectOrderList: [] // 选中的订单集合
    }
  },

  computed: {
    ...mapGetters([
      'clients'
    ])
  },

  created () {
    // 刷新页面停留当前tab页
    if (sessionStorage.getItem('operateVal')) {
      this.curStatusName = sessionStorage.getItem('operateVal')
      this.keyword.status = this.statusToCode(this.curStatusName)
    } else {
      sessionStorage.setItem('operateVal', '待提货')
      this.keyword.status = 10
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
        method: 'get'
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
              name: '待调度',
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
      if (val === '全部') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '送货调度', value: 1 },
          { name: '提货调度', value: 2 },
          { name: '订单还原', value: 3 },
          { name: '删除', value: 4 },
          { name: '导出', value: 5 }
        ]
        this.keywords.status = null
        // this.keyword = {...this.keywords}
      } else if (val === '待提货') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '提货调度', value: 1 },
          { name: '订单还原', value: 2 },
          { name: '删除', value: 3 },
          { name: '导出', value: 4 }
        ]
        this.keywords.status = 10
        // this.keyword = {...this.keywords}
      } else if (val === '待调度') {
        this.operateValue = 1
        this.btnGroup = [
          { name: '送货调度', value: 1 },
          { name: '提货调度', value: 2 },
          { name: '订单还原', value: 3 },
          { name: '删除', value: 4 },
          { name: '导出', value: 5 }
        ]
        this.keywords.status = 20
        // this.keyword = {...this.keywords}
      } else {
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1 }
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
      this.operateValue = btn.value
      if (!this.selectOrderList.length) {
        this.$Message.warning('请至少选择一条信息')
        return
      }
      this.isBatchOperation(btn)
    },
    // 判断各个状态下表头按钮批量操作报错
    isBatchOperation (btn) {
      if (btn.name === '送货调度') { // 待调度（status:20）&& 未创建运单(dispatchStatus: 0) && 未外转(transStatus: 0) && 不是父单（disassembleStatus !== 1）可以批量操作
        let data = this.selectOrderList.find((item) => {
          return (item.status !== 20 || item.dispatchStatus !== 0 || item.transStatus !== 0 || item.disassembleStatus === 1)
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持送货调度')
        } else {
          this.openDispatchDialog(btn.name)
        }
      } else if (btn.name === '提货调度') { // 待提货（status:10）且未创建提货单(pickupStatus: 0)且未外转(transStatus: 0)且是父单(parentId：'') 可以批量操作
        let data = this.selectOrderList.find((item) => {
          return (item.status !== 10 || item.pickupStatus !== 0 || item.transStatus !== 0 || item.parentId !== '')
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持提货调度')
        } else {
          this.openDispatchDialog(btn.name)
        }
      } else if (btn.name === '订单还原') { // 【（是待提货或待调度状态：status < 30） && （是父单：parentId=''） && （被拆单：disassembleStatus=1） && （未被提货：pickupStatus=0） && （未被调度：dispatchStatus=0） && （未外转：transStatus=0）】 可以批量操作
        let data = this.selectOrderList.find((item) => {
          return (item.status > 20 || item.parentId !== '' || item.disassembleStatus !== 1 || item.pickupStatus !== 0 || item.dispatchStatus !== 0 || item.transStatus !== 0)
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
      } else {
        // 导出
        this.$refs.pageTable.$refs.table.exportCsv({
          filename: 'Custom data',
          columns: this.tableColumns.filter((col, index) => index > 1),
          data: this.selectOrderList
        })
      }
    },
    // 外转
    openOuterDialog (params) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/outer',
        data: { id: params.row.id },
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
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
            _this.getOrderNum() // 刷新tab页数量
          }
        }
      })
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
        case '待调度':
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
    }
  }
}
</script>
<style lang='stylus' scoped>
.ivu-btn
  margin-right 15px
  width 80px
.high-search
  width 36px
  height 30px
  line-height 1.1
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
.padding-20
  .ivu-table-cell
    padding-left 20px
</style>
