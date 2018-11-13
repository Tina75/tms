<template>
  <div>
    <header class="detail-header">
      <ul>
        <li>订单号：{{detail.orderNo}}</li>
        <li>客户订单号：{{detail.customerOrderNo || '-' }}</li>
        <li>运单号：{{detail.waybillNo || '-'}} &nbsp;&nbsp;&nbsp;
          <Poptip v-if="waybillNums.length > 0" placement="bottom" @on-popper-show="showPoptip" @on-popper-hide="hidePoptip">
            <a>{{ show ? '收起全部' : '展开全部' }}</a>
            <div slot="title" style="color:rgba(51,51,51,1);text-align: center;">全部运单号</div>
            <ul slot="content">
              <li v-for="(item, index) in waybillNums" :key="index" style="line-height: 25px;cursor:pointer;" @click="handleWaybillNo(item)">
                <span style="color: #3A7EDE;">{{item}}</span>
              </li>
            </ul>
          </Poptip>
        </li>
        <li>{{ from === 'order' ? '订单状态：' : '回单状态：'}}<span style="font-weight: bold;">{{ from === 'order' ? statusToName(orderStatus) : statusToName(receiptStatus) }}</span></li>
      </ul>
    </header>
    <div style="text-align: right;margin: 24px 0;min-height: 1px;">
      <Button
        v-for="(btn, index) in btnGroup"
        v-if="hasPower(btn.code)"
        :key="index"
        :type="btn.value === operateValue ? 'primary' : 'default'"
        :style="(btn.name === '上传回单照片' || btn.name === '修改回单照片') && 'width: 102px;'"
        @click="handleOperateClick(btn)">{{ btn.name }}</Button>
    </div>
    <section>
      <div>
        <div class="title" style="margin-top: 0">
          <span>{{from === 'order' ? '客户信息' : '回单信息'}}</span>
        </div>
        <Row>
          <i-col span="7">
            <span>客户名称：</span>
            <span>{{detail.consignerName}}</span>
          </i-col>
          <i-col span="7">
            <span>要求发货时间：</span>
            <span v-if="detail.deliveryTime">{{detail.deliveryTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="7">
            <span>期望到货时间：</span>
            <span v-if="detail.arriveTime">{{detail.arriveTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col v-if="from === 'order'" span="3">
            <span>代收货款：</span>
            <span v-if="detail.collectionMoney">{{detail.collectionMoney}}</span>
            <span v-else>-</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="7">
            <span>始发地：</span>
            <span>{{detail.startName}}</span>
          </i-col>
          <i-col span="7">
            <span>目的地：</span>
            <span>{{detail.endName}}</span>
          </i-col>
          <i-col span="7">
            <span>提货方式：</span>
            <span v-if="detail.pickup">{{pickupToName(detail.pickup)}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="3">
            <span>回单数：</span>
            <span v-if="detail.receiptCount">{{detail.receiptCount}}</span>
            <span v-else>-</span>
          </i-col>
        </Row>
        <Row style="margin-top:18px">
          <i-col span="7">
            <span>发货联系人：</span>
            <span>{{detail.consignerContact}}</span>
          </i-col>
          <i-col span="7">
            <span>联系方式：</span>
            <span>{{detail.consignerPhone}}</span>
          </i-col>
          <i-col span="10">
            <span>发货地址：</span>
            <span>{{detail.consignerAddress}}</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="7">
            <span>收货联系人：</span>
            <span>{{detail.consigneeContact}}</span>
          </i-col>
          <i-col span="7">
            <span>联系方式：</span>
            <span>{{detail.consigneePhone}}</span>
          </i-col>
          <i-col span="10">
            <span>收货地址：</span>
            <span>{{detail.consigneeAddress}}</span>
          </i-col>
        </Row>
        <Row style="margin-top: 18px;">
          <i-col span="24">
            <span>备注：</span>
            <span>{{detail.remark}}</span>
          </i-col>
        </Row>
      </div>
      <div v-if="from === 'order'" class="cargo-details">
        <div class="title" style="margin-top: 35px;">
          <span>货物明细</span>
        </div>
        <Table :columns="tableColumns" :data="detail.orderCargoList" style="margin-top: 30px;"></Table>
        <div class="table-footer">
          <span style="padding-right: 5px;box-sizing:border-box;">合计</span>
          <!-- <span>订单总数：{{ orderTotal }}</span> -->
          <span>总货值：{{ cargoCostTotal }}</span>
          <span>总数量：{{ quantityTotal }}</span>
          <span>总重量：{{ weightTotal }}吨</span>
          <span>总体积：{{ volumeTotal }}方</span>
        </div>
      </div>
      <div v-if="from === 'order'">
        <div class="title">
          <span>应收费用</span>
        </div>
        <Row style="padding-top: 17px;">
          <i-col span="4">
            <span style="width: 72px;">计费里程：</span>
            <span v-if="detail.distance" style="font-weight:bold;">{{detail.distance}}公里</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span class="fee-style">运输费：</span>
            <span v-if="detail.freightFee" style="font-weight:bold;">{{detail.freightFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span class="fee-style">提货费：</span>
            <span v-if="detail.pickupFee" style="font-weight:bold;">{{detail.pickupFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span class="fee-style">装货费：</span>
            <span v-if="detail.loadFee" style="font-weight:bold;">{{detail.loadFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span class="fee-style">卸货费：</span>
            <span v-if="detail.unloadFee" style="font-weight:bold;">{{detail.unloadFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span class="fee-style">保险费：</span>
            <span v-if="detail.insuranceFee" style="font-weight:bold;">{{detail.insuranceFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="4">
            <span class="fee-style">其他：</span>
            <span v-if="detail.otherFee" style="font-weight:bold;">{{detail.otherFee | toPoint}}元</span>
            <span v-else>-</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <span style="width: 72px;">费用合计：</span>
            <span v-if="!detail.parentId" style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:rgba(0,164,189,1);margin-right: 10px;">{{detail.totalFee | toPoint}} 元</span>
            <span v-else>-</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <span style="width: 72px;">结算方式：</span>
            <span>{{settlementToName(detail.settlementType)}}</span>
          </i-col>
        </Row>
      </div>
      <div v-if="from === 'receipt' && receiptStatus > 0">
        <div class="title">
          <span>回单照片</span>
        </div>
        <div v-if="detail.receiptOrder.receiptUrl.length > 0" style="width: 900px;margin-top: 31px;">
          <div
            v-for="(item, index) in detail.receiptOrder.receiptUrl"
            :key="index"
            :style="'cursor: pointer;display: inline-block;width: 160px;margin-right: 16px;height: 90px;background-image: url(' + item + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
            @click="handleView(index)">
          </div>
        </div>
      </div>
      <div class="order-log">
        <div class="title">
          <span>{{from === 'order' ? '订单日志' : '回单日志'}}</span>
        </div>
        <div style="display: flex;justify-content: flex-start;min-height: 150px;margin-top: 25px;">
          <div class="fold-icon" @click="showOrderLog">
            <span :class="showLog ? 'hide-log' : 'show-log'"></span>
          </div>
          <Timeline :class="showLog ? 'show-timeline' : 'hide-timeline'" :style="{ 'height': showLog ? 44*orderLogCount + 'px' : '15px' }" style="margin-top: 7px;overflow: hidden;">
            <TimelineItem v-for="(item, index) in orderLog" :key="index">
              <i slot="dot"></i>
              <span style="margin-right: 60px;color: #777;font-size: 14px;">{{item.createTime | datetime('yyyy-MM-dd hh:mm:ss')}}</span>
              <span style="color: #333;font-size: 14px;">{{'【' + item.operatorName + '】' + item.description}}</span>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    </section>
    <Modal v-model="visible" title="查看图片">
      <img :src="curImg" style="width: 100%">
      <div slot="footer" style="text-align: center;"></div>
    </Modal>
    <OrderPrint ref="printer" :list="orderPrint"></OrderPrint>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import '@/libs/js/filter'
import OrderPrint from './components/OrderPrint'
import _ from 'lodash'
export default {
  name: 'detail',

  components: {
    OrderPrint
  },
  mixins: [ BasePage ],
  metaInfo: { title: '订单详情' },
  data () {
    return {
      detail: {
        orderCargoList: []
      },
      curImg: '', // 当前图片src
      visible: false, // 图片预览模态框
      from: this.$route.query.from,
      source: this.$route.query.source, // 页面来源
      orderStatus: '',
      receiptStatus: '',
      waybillNums: [],
      show: false,
      btnGroup: [],
      operateValue: 5,
      tableColumns: [
        {
          title: '货物名称',
          key: 'cargoName',
          className: 'padding-left-45'
        },
        {
          title: '包装',
          key: 'unit',
          render: (h, p) => {
            return h('span', p.row.unit ? p.row.unit : '-')
          }
        },
        {
          title: '数量',
          key: 'quantity',
          render: (h, p) => {
            return h('span', p.row.quantity ? p.row.quantity : '-')
          }
        },
        {
          title: '货值（元）',
          key: 'cargoCost',
          render: (h, params) => {
            return h('span', params.row.cargoCost ? params.row.cargoCost / 100 : '-')
          }
        },
        {
          title: '重量（吨）',
          key: 'weight',
          render: (h, p) => {
            return h('span', p.row.weight ? p.row.weight : '-')
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, p) => {
            return h('span', p.row.volume ? p.row.volume : '-')
          }
        },
        {
          title: '备注1',
          key: 'remark1',
          render: (h, p) => {
            return h('span', p.row.remark1 ? p.row.remark1 : '-')
          }
        },
        {
          title: '备注2',
          key: 'remark2',
          render: (h, p) => {
            return h('span', p.row.remark2 ? p.row.remark2 : '-')
          }
        }
      ],
      tableData: [],
      currentStep: 0,
      orderLogCount: 0,
      showLog: false,
      orderLog: [],
      orderPrint: []
    }
  },

  computed: {
    // 订单总数
    orderTotal () {
      return this.detail.orderCargoList.length
    },
    // 总货值
    cargoCostTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        total += Number(item.cargoCost)
      })
      return (total / 100).toFixed(2)
    },
    // 总数量
    quantityTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        total += Number(item.quantity)
      })
      return total
    },
    // 总体积
    volumeTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        total += Number(item.volume)
      })
      return total.toFixed(1)
    },
    // 总重量
    weightTotal () {
      let total = 0
      this.detail.orderCargoList.map((item) => {
        total += Number(item.weight)
      })
      return total.toFixed(2)
    },
    // 总费用
    FeeTotal () {
      let total = 0
      total += this.detail.freightFee
      total += this.detail.loadFee
      total += this.detail.unloadFee
      total += this.detail.insuranceFee
      total += this.detail.otherFee
      return total
    }
  },

  mounted () {
    this.getDetail()
  },

  methods: {
    showPoptip (e) {
      this.show = true
    },
    hidePoptip (e) {
      this.show = false
    },
    // 各状态按钮操作
    handleOperateClick (btn) {
      // this.operateValue = btn.value
      if (btn.name === '拆单') {
        this.openSeparateDialog(this.detail)
      } else if (btn.name === '外转') {
        this.openOuterDialog(this.detail)
      } else if (btn.name === '还原' || btn.name === '删除') {
        this.openResOrDelDialog(this.detail, btn.name)
      } else if (btn.name === '编辑') { // 编辑
        this.openTab({
          title: '编辑' + this.detail.orderNo,
          path: '/order/update',
          query: {
            id: this.detail.id
          }
        })
      } else if (btn.name === '回收' || btn.name === '返厂') {
        this.openReturnDialog(this.detail, btn.name)
      } else if (btn.name === '打印') {
        this.print(this.detail)
      } else if (btn.name === '恢复') {
        this.openRecoveryDialog(this.detail)
      } else if (btn.name === '彻底删除') {
        this.completelyDeleteDialog(this.detail)
      } else if (btn.name === '上传回单照片' || btn.name === '修改回单照片') {
        this.openUploadDialog(this.detail)
      }
    },
    // 外转
    openOuterDialog (order) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/outer',
        data: { detail: order },
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 拆单
    openSeparateDialog (order) {
      const _this = this
      this.openDialog({
        name: 'order-management/dialog/separate',
        data: { id: order.id, orderNo: order.orderNo },
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 还原或删除 (单条操作)
    openResOrDelDialog (order, name) {
      const _this = this
      const data = {
        id: [order],
        name: name
      }
      this.openDialog({
        name: 'order-management/dialog/restoreOrDelete',
        data: data,
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 回收或返厂 (单条操作)
    openReturnDialog (order, name) {
      const _this = this
      const data = {
        id: [order],
        name: name
      }
      this.openDialog({
        name: 'order-management/dialog/return',
        data: data,
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 打印
    print (order) {
      Server({
        url: 'order/getOrderAndDetailList',
        method: 'post',
        data: {
          orderIds: [order.id]
        }
      }).then((res) => {
        console.log(res)
        this.orderPrint = _.cloneDeep(res.data.data)
        this.$refs.printer.print()
      })
    },
    // 恢复
    openRecoveryDialog (order) {
      const _this = this
      _this.openDialog({
        name: 'order-management/dialog/recovery',
        data: { id: [order] },
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 彻底删除
    completelyDeleteDialog (order) {
      const _this = this
      _this.openDialog({
        name: 'order-management/dialog/completelyDelete',
        data: { id: [order] },
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 打开上传和修改回单弹窗
    openUploadDialog (order) {
      const _this = this
      _this.openDialog({
        name: 'order-management/dialog/upload',
        data: {
          params: order,
          name: order.receiptOrder.receiptUrl.length > 0 ? '修改' : '上传'
        },
        methods: {
          ok (node) {
            _this.getDetail()
          }
        }
      })
    },
    // 日志切换显示
    showOrderLog () {
      this.showLog = !this.showLog
      console.log(this.showLog)
    },
    // 拉取table数据
    getDetail () {
      // 订单详情  from: order   回单详情 from: receipt
      if (this.from === 'order') {
        Server({
          url: 'order/detail?id=' + this.$route.query.orderId,
          method: 'get'
        }).then((res) => {
          console.log(res)
          this.detail = res.data.data
          this.orderStatus = res.data.data.status
          // 过滤订单详情页操作按钮
          this.filterOrderButton()
          this.orderLog = res.data.data.orderLogs // 订单日志
          this.orderLogCount = res.data.data.orderLogs.length // 订单日志数量
          this.waybillNums = res.data.data.waybillNoList // 运单子单
        })
      } else { // 回单详情
        Server({
          url: 'order/getReceiptOrderDetail?id=' + this.$route.query.orderId,
          method: 'get'
        }).then((res) => {
          console.log(res)
          this.detail = res.data.data
          this.receiptStatus = res.data.data.receiptOrder.receiptStatus
          // 过滤回单详情页操作按钮
          this.filterReceiptButton()
          this.orderLog = res.data.data.receiptOrderLogs // 回单日志
          this.orderLogCount = res.data.data.receiptOrderLogs.length // 回单日志数量
        })
      }
    },
    // 状态改名称
    statusToName (code) {
      let name
      switch (code) {
        case -1:
          name = '待签收'
          break
        case 0:
          name = '待回收'
          break
        case 1:
          name = '待返厂'
          break
        case 2:
          name = '已返厂'
          break
        case 10:
          name = '待提货'
          break
        case 20:
          name = '待送货'
          break
        case 30:
          name = '在途'
          break
        case 40:
          name = '已到货'
          break
        case 50:
          name = '已回单'
          break
        case 100:
          name = '已删除'
          break
      }
      return name
    },
    // 提货状态转名称
    pickupToName (code) {
      let name
      switch (code) {
        case 1:
          name = '小车上门自提'
          break
        case 2:
          name = '大车直送客户'
          break
      }
      return name
    },
    // 结算方式转名称
    settlementToName (code) {
      let name
      switch (code) {
        case 1:
          name = '现付'
          break
        case 2:
          name = '到付'
          break
        case 3:
          name = '回付'
          break
        case 4:
          name = '月结'
          break
      }
      return name
    },
    // 点击展开的运单子单
    handleWaybillNo (no) {
      console.log(no)
      this.openTab({
        title: no,
        path: '/transport/detail/detailFreight',
        query: {
          no: no
        }
      })
    },
    // 订单详情按钮过滤
    filterOrderButton () {
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
       *    拆单： 无拆单按钮            //【（未外转：transStatus=0） && （不是父单{原单或者子单}：disassembleStatus !== 1）】显示
       *    外转：【（未外转：transStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''） && （未被提货：pickupStatus=0）】显示
       *    还原： 无还原按钮            //【（是父单：parentId=''） && （被拆单：disassembleStatus=1） && （未被提货：pickupStatus=0）】显示
       *    删除： 无删除按钮            //
       *          订单列表里显示：【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （被拆单后的父单：disassembleStatus=1）】
       *          订单详情里显示：【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （不是子单：parentId=''）】
       *    编辑：【（未外转：transStatus=0） && （未被提货：pickupStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）】（只在详情显示）
       * 2、待调度状态下：（status: 20）
       *    拆单：【（未外转：transStatus=0） && （不是父单{原单或者子单}：disassembleStatus !== 1）&& （未被调度：dispatchStatus=0）】显示
       *    外转：【（未外转：transStatus=0） && （不是上门提货：pickup !== 1） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''） && （未被调度：dispatchStatus=0）】显示
       *    还原：【（是父单：parentId=''） && （被拆单：disassembleStatus=1） && （未被调度：dispatchStatus=0）】显示
       *    删除：
       *          订单列表里显示：【（不是上门提货：pickup !== 1） && （未外转：transStatus=0） && （未被调度：dispatchStatus=0） && （被拆单后的父单：disassembleStatus=1）】
       *          订单详情里显示：【（不是上门提货：pickup !== 1） && （未外转：transStatus=0） && （未被调度：dispatchStatus=0） && （不是子单：parentId=''）】
       *    编辑：【（不是上门提货：pickup !== 1） && （未外转：transStatus=0） && （未被调度：dispatchStatus=0） && （未拆单：disassembleStatus=0） && （不是子单：parentId=''）】（只在详情显示）
       */
      let r = this.detail
      let renderBtn = []
      if (r.status === 10) { // 待提货状态
        // 删除按钮
        if (r.transStatus === 0 && r.pickupStatus === 0 && r.parentId === '') {
          renderBtn.push(
            { name: '删除', value: 1, code: 120204 }
          )
        }
        // 打印
        this.checkPrintCode(renderBtn)
        // 拆单按钮
        // if (r.transStatus === 0 && r.disassembleStatus !== 1) {
        //   renderBtn.push(
        //     { name: '拆单', value: 2, code: 110103 }
        //   )
        // }
        // 外转按钮
        if (r.transStatus === 0 && r.disassembleStatus === 0 && r.parentId === '' && r.pickupStatus === 0) {
          renderBtn.push(
            { name: '外转', value: 3, code: 120209 }
          )
        }
        // 还原按钮
        // if (r.parentId === '' && r.disassembleStatus === 1 && r.pickupStatus === 0) {
        //   renderBtn.push(
        //     { name: '还原', value: 4, code: 110105 }
        //   )
        // }
        // 编辑按钮
        if (r.transStatus === 0 && r.pickupStatus === 0 && r.disassembleStatus === 0 && r.parentId === '') {
          renderBtn.push(
            { name: '编辑', value: 5, code: 120206 }
          )
        }
      }
      if (r.status === 20) { // 待调度状态
        // 删除按钮
        if (r.pickup !== 1 && r.transStatus === 0 && r.dispatchStatus === 0 && r.parentId === '') {
          renderBtn.push(
            { name: '删除', value: 1, code: 120105 }
          )
        }
        // 打印
        this.checkPrintCode(renderBtn)
        // 拆单按钮
        if (r.transStatus === 0 && r.disassembleStatus !== 1 && r.dispatchStatus === 0) {
          renderBtn.push(
            { name: '拆单', value: 3, code: 120110 }
          )
        }
        // 外转按钮
        if (r.transStatus === 0 && r.disassembleStatus === 0 && r.parentId === '' && r.dispatchStatus === 0) {
          renderBtn.push(
            { name: '外转', value: 4, code: 120111 }
          )
        }
        // 还原按钮
        if (r.parentId === '' && r.disassembleStatus === 1 && r.dispatchStatus === 0) {
          renderBtn.push(
            { name: '还原', value: 5, code: 120112 }
          )
        }
        // 编辑按钮
        if (r.pickup !== 1 && r.transStatus === 0 && r.dispatchStatus === 0 && r.disassembleStatus === 0 && r.parentId === '') {
          renderBtn.push(
            { name: '编辑', value: 6, code: 120107 }
          )
        }
      }
      if (r.status === 100) { // 回收站状态
        renderBtn = [
          { name: '恢复', value: 1, code: 110110 },
          { name: '彻底删除', value: 2, code: 110111 }
        ]
      }
      this.btnGroup = renderBtn
      if (this.btnGroup.length > 0 && r.status !== 100) {
        this.operateValue = this.btnGroup[this.btnGroup.length - 1].value // 默认点亮最后一个按钮
      }
    },
    checkPrintCode (btns) {
      if (this.source) {
        if (this.source === 'order') {
          btns.push(
            { name: '打印', value: 2, code: 110108 }
          )
        } else if (this.source === 'waybill') {
          btns.push(
            { name: '打印', value: 2, code: 120103 }
          )
        } else if (this.source === 'pickup') {
          btns.push(
            { name: '打印', value: 2, code: 120202 }
          )
        }
      }
    },
    // 回单详情按钮过滤   0待回收；1待返厂（已回收）；2已返厂
    filterReceiptButton () {
      if (this.detail.receiptOrder.receiptStatus === 0 && this.detail.status === 40) {
        this.btnGroup = [
          { name: '回收', value: 1, code: 110201 }
        ]
        this.operateValue = 1
      } else if (this.detail.receiptOrder.receiptStatus === 1) {
        this.btnGroup = [
          { name: this.detail.receiptOrder.receiptUrl.length > 0 ? '修改回单照片' : '上传回单照片', value: 1, code: this.detail.receiptOrder.receiptUrl.length > 0 ? 110205 : 110204 },
          { name: '返厂', value: 2, code: 110202 }
        ]
        this.operateValue = 2
      } else if (this.detail.receiptOrder.receiptStatus === 2) {
        this.btnGroup = [
          { name: this.detail.receiptOrder.receiptUrl.length > 0 ? '修改回单照片' : '上传回单照片', value: 1, code: this.detail.receiptOrder.receiptUrl.length > 0 ? 110205 : 110204 }
        ]
        this.operateValue = 1
      } else {
        this.btnGroup = []
      }
    },
    // 预览
    handleView (i) {
      this.visible = true
      this.curImg = this.detail.receiptOrder.receiptUrl[i]
    }
  }
}
</script>
<style lang='stylus' scoped>
  .detail-header
    height 60px
    padding-left 24px
    line-height  60px
    background rgba(233,252,255,1)
    >ul>li
      font-size 13px
      font-family 'PingFangSC-Regular'
      font-weight 400
      color #333
      display inline-block
      margin-right 100px
  .ivu-btn
    margin-left 15px
    width 80px
    height 32px
  .ivu-btn-default
    background #F9F9F9
  .ivu-row
    font-size 14px
    font-family 'PingFangSC-Regular'
    line-height 3
    .ivu-col
      span
        &:first-child
          color #777
          display inline-block
          width 100px
        &:last-child
          color #333
  .fee-style
    width 60px !important
  .title
    margin-top 52px
    span
      height 34px
      font-size 20px
      font-family 'PingFangSC-Semibold'
      font-weight 600
      color rgba(51,51,51,1)
      line-height 34px
      margin-left 18px
      vertical-align text-bottom
    &:before
      content ' '
      display inline-block
      width 5px
      height 25px
      background rgba(0,164,189,1)
      border-radius 3px
    &:after
      content ' '
      display block
      margin 15px 0
      border-bottom 1px dashed rgba(203,206,211,1)
  .table-footer
    height 48px
    border 1px solid #dcdee2
    border-top none
    line-height 48px
    font-family 'PingFangSC-Medium'
    font-weight bold
    color #2c3e50
    span
      display inline-block
      min-width 140px
      text-align center
  .order-log
    .ivu-timeline-item
      i
        display inline-block
        width 12px
        height 12px
        background-color #C9CED9
        border-radius 50%
        vertical-align text-bottom
      &:first-child
        i
          background-color #00A4BD
  .fold-icon
    width 26px
    height 26px
    background rgba(0,164,189,1)
    border-radius 5px
    margin 0 60px 0 30px
    text-align center
    cursor pointer
    span
      display block
      width 16px
      height 16px
      margin 5px
      background url(../../assets/img-icon-expand.png) no-repeat
      background-size contain
  .show-log
    transition all 0.3s linear
  .hide-log
    transform rotate(180deg)
    transition all 0.3s linear
  .show-timeline
     transition height 0.3s linear
  .hide-timeline
     height 15px
     transition height 0.3s linear
  .receipt-image
    width 160px
    height 90px
    margin-right 16px
</style>
<style lang='stylus'>
  .detail-header
    .ivu-poptip-body
      padding 5px 10px
    .ivu-poptip-popper
      top 118px !important
  .cargo-details .padding-left-45
    padding-left 45px !important
</style>
