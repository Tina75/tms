<template>
  <div>
    <tab-header :name="curStatusName" :tabs="status" @tabChange="handleTabChange"></tab-header>
    <div class="receipt-container">
      <div>
        <Button v-for="(btn, index) in btnGroup" v-if="hasPower(btn.code)" :key="index" :type="btn.value === operateValue ? 'primary' : 'default'" @click="handleOperateClick(btn)">{{ btn.name }}</Button>
      </div>
      <div v-if="simpleSearch" class="receipt-right">
        <Select v-model="selectStatus" class="order-simple-select" style="width:120px;margin-top: 1px;margin-right: 11px" transfer @on-change="handleChangeSearchStatus">
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
          @on-clear="clearKeywords"
          @enter="searchList">
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
          v-else-if="selectStatus === 2"
          v-model.lazy="keywords.customerOrderNo"
          :maxlength="30"
          :icon="keywords.customerOrderNo ? 'ios-close-circle' : ''"
          placeholder="请输入客户订单号"
          style="width: 200px"
          @on-enter="searchList"
          @on-click="clearKeywords"/>
        <SelectInput
          v-else-if="selectStatus === 3"
          v-model="keywords.carrierName"
          :maxlength="20"
          :remote="false"
          :clearable="true"
          :local-options="carriers"
          placeholder="请选择或输入承运商名称"
          style="width:200px"
          @on-focus.once="getCarriers"
          @on-clear="clearKeywords"
          @enter="searchList">
        </SelectInput>
        <Input
          v-else-if="selectStatus === 4"
          v-model.lazy="keywords.driverName"
          :maxlength="15"
          :icon="keywords.driverName ? 'ios-close-circle' : ''"
          placeholder="请输入司机姓名"
          style="width: 200px"
          @on-enter="searchList"
          @on-click="clearKeywords"/>
        <Input
          v-else-if="selectStatus === 5"
          v-model.lazy="keywords.driverPhone"
          :maxlength="11"
          :icon="keywords.driverPhone ? 'ios-close-circle' : ''"
          placeholder="请输入司机手机号"
          style="width: 200px"
          @on-enter="searchList"
          @on-click="clearKeywords"/>
        <Input
          v-else-if="selectStatus === 6"
          v-model.lazy="keywords.carNo"
          :maxlength="20"
          :icon="keywords.carNo ? 'ios-close-circle' : ''"
          placeholder="请输入车牌号"
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
          :clearable="true"
          :local-options="clients"
          placeholder="请选择或输入客户名称"
          style="width:200px;margin-right: 20px;"
          @on-focus.once="getClients"
          @on-clear="clearKeywords"
          @enter="searchList">
        </SelectInput>
        <Input
          v-model="keywords.orderNo"
          :maxlength="30"
          clearable
          placeholder="请输入订单号"
          style="width: 200px"
          @on-enter="searchList" />
        <Input
          v-model="keywords.customerOrderNo"
          :maxlength="30"
          clearable
          placeholder="请输入客户订单号"
          style="width: 200px"
          @on-enter="searchList" />
        <Input
          v-model="keywords.waybillNo"
          :maxlength="30"
          clearable
          placeholder="请输入运单号"
          style="width: 200px"
          @on-enter="searchList" />
      </div>
      <div class="complex-query">
        <div>
          <!-- <area-select v-model="cityCodes.startCodes" placeholder="请输入始发地" style="width:200px;display: inline-block;margin-right: 20px;"></area-select>
          <area-select v-model="cityCodes.endCodes" placeholder="请输入目的地" style="width:200px;display: inline-block;margin-right: 20px;"></area-select> -->
          <city-select v-model="keywords.start" placeholder="请输入始发地" style="width:200px;display: inline-block;margin-right: 20px;"></city-select>
          <city-select v-model="keywords.end" placeholder="请输入目的地" style="width:200px;display: inline-block;margin-right: 20px;"></city-select>
          <DatePicker
            :options="timeOption"
            v-model="recoveryTimes"
            transfer
            type="daterange"
            format="yyyy-MM-dd"
            placeholder="回收开始日期-回收结束日期"
            style="width: 200px;display: inline-block;margin-right: 20px;"
            @on-change="handleRecoveryTimeChange">
          </DatePicker>
          <DatePicker
            :options="timeOption"
            v-model="returnTimes"
            transfer
            type="daterange"
            format="yyyy-MM-dd"
            placeholder="返厂开始日期-返厂结束日期"
            style="width: 200px;display: inline-block;"
            @on-change="handleReturnTimeChange">
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
      table-head-type="receipt_head"
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
import Export from '@/libs/js/export'
// import AreaSelect from '@/components/AreaSelect'
import CitySelect from '@/components/SelectInputForCity'
import SelectInput from '@/components/SelectInput.vue'
import { mapGetters, mapActions } from 'vuex'
// import City from '@/libs/js/city'
import SearchMixin from '@/views/order/management/searchMixin.js'
import float from '@/libs/js/float'

// let hasTab = false

export default {
  name: 'order-receipt',

  components: {
    TabHeader,
    PageTable,
    // AreaSelect,
    CitySelect,
    SelectInput
  },
  mixins: [ BasePage, SearchMixin ],
  metaInfo: { title: '回单管理' },
  data () {
    return {
      tabType: 'RECEIPT',
      url: 'order/getReceiptOrderListNew',
      method: 'post',
      status: [
        { name: '全部', count: '' },
        { name: '待签收', count: '' },
        { name: '待回收', count: '' },
        { name: '待返厂', count: '' },
        { name: '已返厂', count: '' }
      ],
      selectStatus: 0, // 当前搜索状态   0：客户名称   1：订单号  2：客户订单号
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
          label: '客户订单号'
        },
        {
          value: 3,
          label: '承运商名称'
        },
        {
          value: 4,
          label: '司机姓名'
        },
        {
          value: 5,
          label: '司机手机号'
        },
        {
          value: 6,
          label: '车牌号'
        }
      ],
      keyword: {
        receiptStatus: 0// 默认待回收状态  传给pageTable可重新请求数据
      },
      curStatusName: '待回收',
      btnGroup: [
        { name: '回收', value: 1, code: 120501 },
        { name: '返厂', value: 2, code: 120502 },
        { name: '导出', value: 3, code: 120503 }
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
          width: 140,
          extra: true,
          render: (h, params) => {
            let renderBtn = []
            if (params.row.receiptOrder.receiptStatus === 0 && params.row.status === 40 && this.hasPower(120501)) {
              renderBtn.push(
                h('a', {
                  style: {
                    marginRight: '25px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.openReturnDialog(params, '回收')
                    }
                  }
                }, '回收')
              )
            }
            if (params.row.receiptOrder.receiptStatus === 1 && this.hasPower(120502)) {
              renderBtn.push(
                h('a', {
                  style: {
                    marginRight: '25px',
                    color: '#00a4bd'
                  },
                  on: {
                    click: () => {
                      this.openReturnDialog(params, '返厂')
                    }
                  }
                }, '返厂')
              )
            }
            if (params.row.receiptOrder.receiptStatus > 0) {
              if (params.row.receiptOrder.receiptUrl.length > 0 && this.hasPower(120505)) { // 修改回单
                renderBtn.push(
                  h('a', {
                    style: {
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        this.openUploadDialog(params.row, '修改')
                      }
                    }
                  }, '修改回单')
                )
              }
              if (params.row.receiptOrder.receiptUrl.length <= 0 && this.hasPower(120504)) { // 上传回单
                renderBtn.push(
                  h('a', {
                    style: {
                      color: '#00a4bd'
                    },
                    on: {
                      click: () => {
                        this.openUploadDialog(params.row, '上传')
                      }
                    }
                  }, '上传回单')
                )
              }
            }
            return h('div', renderBtn)
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          fixed: 'left',
          minWidth: 180,
          render: (h, params) => {
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
                    path: '/order-management/recept-detail',
                    query: {
                      id: '回单' + params.row.orderNo,
                      orderId: params.row.id,
                      from: 'receipt'
                    }
                  })
                }
              }
            }, params.row.orderNo)
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
          title: '客户运单号',
          key: 'customerWaybillNo',
          width: 160
        },
        {
          title: '运单号',
          key: 'waybillNo',
          minWidth: 160,
          render: (h, p) => {
            if (p.row.waybillNo) {
              let waybillNoArr = p.row.waybillNo.split(',')
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
          title: '回单状态',
          key: 'status',
          minWidth: 120,
          render: (h, p) => {
            return h('span', this.statusToName(p.row.receiptOrder.receiptStatus))
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
          title: '回单数',
          key: 'receiptCount',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '回收时间',
          key: 'recoveryTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.receiptOrder.recoveryTime ? new Date(params.row.receiptOrder.recoveryTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
          }
        },
        {
          title: '回收人',
          key: 'recoveryName',
          minWidth: 100,
          render: (h, params) => {
            return h('span', params.row.receiptOrder.recoveryName ? params.row.receiptOrder.recoveryName : '-')
          }
        },
        {
          title: '返厂时间',
          key: 'returnTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.receiptOrder.returnTime ? new Date(params.row.receiptOrder.returnTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
          }
        },
        {
          title: '接收人',
          key: 'returnName',
          minWidth: 100,
          render: (h, params) => {
            return h('span', params.row.receiptOrder.returnName ? params.row.receiptOrder.returnName : '-')
          }
        },
        {
          title: '下单时间',
          key: 'createTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.receiptOrder.createTime ? new Date(params.row.receiptOrder.createTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
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
          title: '结算方式',
          key: 'settlementType',
          minWidth: 120,
          render: (h, params) => {
            return h('span', this.settlementToName(params.row.settlementType))
          }
        },
        {
          title: '总费用',
          key: 'totalFee',
          minWidth: 120,
          render: (h, params) => {
            return h('span', params.row.totalFee ? float.round(params.row.totalFee / 100) : 0)
          }
        }
      ],
      operateCol: [] // 操作栏
    }
  },

  computed: {
    ...mapGetters([
      'clients',
      'carriers'
    ]),
    // 回单id集合
    receiptOrderIds () {
      let arr = []
      this.selectOrderList.map((item) => {
        arr.push(item.receiptOrder.id)
      })
      return arr
    }
  },

  created () {
    let tab = this.$route.query.tab
    // 首页跳转对应tab
    // if (tab && !hasTab) {
    if (tab) {
      switch (tab) {
        case '1':
          this.keyword.receiptStatus = 0
          break
        case '2':
          this.keyword.receiptStatus = 1
          break
        case '3':
          this.keyword.receiptStatus = 2
          break
      }
      // hasTab = this.$route.query.tab
      sessionStorage.setItem('RECEIPT_TAB_NAME', this.status[this.$route.query.tab].name)
      this.handleTabChange(this.status[this.$route.query.tab].name) // 表头按钮状态
    } else {
      // 刷新页面停留当前tab页
      if (sessionStorage.getItem('RECEIPT_TAB_NAME')) {
        this.curStatusName = sessionStorage.getItem('RECEIPT_TAB_NAME')
        this.keyword.receiptStatus = this.statusToCode(this.curStatusName)
        this.handleTabChange(this.curStatusName) // 表头按钮状态
      } else {
        sessionStorage.setItem('RECEIPT_TAB_NAME', '待回收')
        this.keyword.receiptStatus = 0
        this.handleTabChange('待回收') // 表头按钮状态
      }
    }
  },

  mounted () {
    this.getOrderNum()
  },

  // destroyed () {
  //   hasTab = false
  // },

  methods: {
    ...mapActions([
      'getClients',
      'getCarriers'
    ]),
    // 获取各状态订单数目
    getOrderNum () {
      Server({
        url: 'order/getReceiptOrderNumByStatus',
        method: 'get'
      }).then((res) => {
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
          if (item.waiting_sign !== undefined) {
            let p = {
              name: '待签收',
              count: item.waiting_sign
            }
            arr.push(p)
          }
          if (item.waiting_recovery !== undefined) {
            let p = {
              name: '待回收',
              count: item.waiting_recovery
            }
            arr.push(p)
          }
          if (item.waiting_return_factory !== undefined) {
            let d = {
              name: '待返厂',
              count: item.waiting_return_factory
            }
            arr.push(d)
          }
          if (item.already_returned_factory !== undefined) {
            let d = {
              name: '已返厂',
              count: item.already_returned_factory
            }
            arr.push(d)
          }
        })
        this.status = arr
      })
    },
    // tab状态栏切换
    handleTabChange (val) {
      this.curStatusName = val
      this.selectOrderList = [] // 重置当前已勾选项
      this.selectedId = [] // 重置当前已勾选id项
      if (val === '全部') {
        // 全部、待回收、待返厂加上操作栏
        this.deleteOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1, code: 120503 }
        ]
        this.keywords.receiptStatus = null
      } else if (val === '待签收') {
        this.deleteOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1, code: 120503 }
        ]
        this.keywords.receiptStatus = -1
      } else if (val === '待回收') {
        // 全部、待回收、待返厂加上操作栏
        this.addOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '回收', value: 1, code: 120501 },
          { name: '导出', value: 2, code: 120503 }
        ]
        this.keywords.receiptStatus = 0
      } else if (val === '待返厂') {
        // 全部、待回收、待返厂加上操作栏
        this.addOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '返厂', value: 1, code: 120502 },
          { name: '导出', value: 2, code: 120503 }
        ]
        this.keywords.receiptStatus = 1
      } else {
        // 已返厂取消操作栏
        this.addOperateCol()
        this.operateValue = 1
        this.btnGroup = [
          { name: '导出', value: 1, code: 120503 }
        ]
        this.keywords.receiptStatus = 2
      }
      this.isSearching = true
      this.clearKeywords() // 清楚搜索条件
    },
    // 表头按钮批量操作
    handleOperateClick (btn) {
      // this.operateValue = btn.value
      if (!this.selectOrderList.length && btn.name !== '导出') {
        this.$Message.warning('请至少选择一条信息')
        return
      }
      if (btn.name === '回收') { // receiptStatus都为0且status已到货状态（40） 才可批量回收
        let data = this.selectOrderList.find((item) => {
          return (item.receiptOrder.receiptStatus !== 0 || item.status !== 40)
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单还未确认到货，请先确认货物已到货')
        } else {
          this.openReturnDialog('', btn.name)
        }
      } else if (btn.name === '返厂') { // receiptStatus都为1 才可批量返厂
        let data = this.selectOrderList.find((item) => {
          return item.receiptOrder.receiptStatus !== 1
        })
        if (data !== undefined) {
          this.$Message.warning('您选择的订单不支持返厂')
        } else {
          this.openReturnDialog('', btn.name)
        }
      } else { // 导出
        this.export()
      }
    },
    // 打开回收或返厂弹窗 (支持单条、多条操作))
    openReturnDialog (params, name) {
      if (params && name === '回收' && params.row.status < 40) {
        this.$Message.warning('您选择的订单还未确认到货，请先确认货物已到货')
        return
      }
      const _this = this
      const data = {
        id: this.selectOrderList,
        name: name
      }
      // params不为空时，id值为当前行
      if (params) {
        data.id = [params.row]
      }
      _this.openDialog({
        name: 'order/management/dialog/return',
        data: data,
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.getOrderNum() // 刷新tab页数量
            _this.selectOrderList = [] // 重置当前已勾选项
            _this.selectedId = [] // 重置当前已勾选id项

            _this.$refs.pageTable.clearSelected() // 清空当前选项
          }
        }
      })
    },
    // 打开上传和修改回单弹窗
    openUploadDialog (params, name) {
      const _this = this
      _this.openDialog({
        name: 'order/management/dialog/upload',
        data: {
          params,
          name
        },
        methods: {
          ok (node) {
            _this.$refs.pageTable.fetch() // 刷新table
            _this.getOrderNum() // 刷新tab页数量
            _this.selectOrderList = [] // 重置当前已勾选项
            _this.selectedId = [] // 重置当前已勾选id项

            _this.$refs.pageTable.clearSelected() // 清空当前选项
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
        case '待回收':
          code = 0
          break
        case '待返厂':
          code = 1
          break
        case '已返厂':
          code = 2
          break
        default:
          code = 0
          break
      }
      return code
    },
    // 导出
    export () {
      const data = Object.assign({}, this.keyword, {
        receiptOrderIds: this.selectedId.length > 0 ? this.receiptOrderIds : null
      })
      Export({
        url: 'order/exportReceiptOrder',
        method: 'post',
        data,
        fileName: '回单明细'
      })
    }
  }
}
</script>
<style lang='stylus' scoped>
.receipt-container
  margin-top: 30px;
  display: flex;
  display: -ms-flexbox;
  justify-content: space-between;
  -ms-flex-pack justify
.complex-query
  display: flex;
  display -ms-flexbox
  justify-content: space-between;
  -ms-flex-pack justify
.ivu-btn
  margin-right 15px
  width 80px
  height 32px
.ivu-btn-default
  background #F9F9F9
.high-search
  width 36px
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
</style>
