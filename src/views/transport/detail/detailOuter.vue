<template>
  <div>
    <!-- 运单号及状态 -->
    <section class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">订单号：{{ info.orderNo }}</li>
        <li class="detail-header-list-item">客户订单号：{{ info.customerOrderNo }}</li>
        <li class="detail-header-list-item">外转单号：{{ info.transNo }}</li>
        <li class="detail-header-list-item">外转方运单号：{{ info.outTransNo }}</li>
        <li class="detail-header-list-item">订单状态：
          <span style="font-weight: bold;">{{ status }}</span>
        </li>
      </ul>
    </section>

    <div class="detail-btn-group">
      <Button v-for="(item, key) in currentBtns"
              :key="key" :type="key === (currentBtns.length - 1) ? 'primary' : 'default'"
              class="detail-btn-item"
              @click="item.func">{{ item.name }}</Button>
    </div>

    <section class="detail-info">
      <!-- 客户信息 -->
      <div>
        <div class="detail-part-title">
          <span>客户信息</span>
        </div>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title">客户名称：</span>
            <span>{{ info.consignerName }}</span>
          </i-col>
          <i-col span="6">
            <span class="detail-field-title"
                  style="width: 120px;">要求发货时间：</span>
            <span>{{ info.deliveryTimeLong | formatTime }}</span>
          </i-col>
          <i-col span="6">
            <span class="detail-field-title"
                  style="width: 120px;">期望到货时间：</span>
            <span>{{ info.arriveTimeLong | formatTime }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title">始发地：</span>
            <span>{{ info.start | formatCity }}</span>
          </i-col>
          <i-col span="6">
            <span class="detail-field-title">目的地：</span>
            <span>{{ info.end | formatCity }}</span>
          </i-col>
          <i-col span="6">
            <span class="detail-field-title">提货方式：</span>
            <span>{{ info.pickup ? '上门提货' : '送货上门' }}</span>
          </i-col>
          <i-col span="6">
            <span class="detail-field-title">回单数：</span>
            <span>{{ info.receiptCount }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group" style="margin-top: 20px;">
          <i-col span="6">
            <span class="detail-field-title">发货联系人</span>
            <span>{{ info.consignerContact }}</span>
          </i-col>
          <i-col span="6">
            <span class="detail-field-title">联系方式</span>
            <span>{{ info.consignerPhone }}</span>
          </i-col>
          <i-col span="12">
            <span class="detail-field-title">发货地址</span>
            <span>{{ info.consignerAddress }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title">收货联系人</span>
            <span>{{ info.consigneeContact }}</span>
          </i-col>
          <i-col span="6">
            <span class="detail-field-title">联系方式</span>
            <span>{{ info.consigneePhone }}</span>
          </i-col>
          <i-col span="12">
            <span class="detail-field-title">收货地址</span>
            <span>{{ info.consignerAddress }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group" style="margin-top: 20px;">
          <i-col span="13">
            <span class="detail-field-title">备注：</span>
            <span>{{ info.remark || '无' }}</span>
          </i-col>
        </Row>
      </div>
      <!-- 货物明细 -->
      <div>
        <div class="detail-part-title">
          <span>货物明细</span>
        </div>
        <Table :columns="tableColumns" :data="detail" :loading="loading"></Table>
        <div class="table-footer">
          <span class="table-footer-title">总计</span>
          <span>总货值：{{ orderTotal.cargoCost }}</span>
          <span>总数量：{{ orderTotal.quantity }}</span>
          <span>总体积：{{ orderTotal.weight }}</span>
          <span>总重量：{{ orderTotal.volume }}</span>
        </div>
      </div>
      <!-- 应付费用 -->
      <div>
        <div class="detail-part-title">
          <span>应付费用</span>
        </div>
        <Row class="detail-field-group">
          <i-col span="5">
            <span class="detail-field-title-sm">外转方：</span>
            <span>{{ payment.transfereeName }}</span>
          </i-col>
          <i-col span="5" offset="2">
            <span class="detail-field-title-sm">外传费用：</span>
            <span>{{ payment.transFee }}元</span>
          </i-col>
          <i-col span="5" offset="2">
            <span class="detail-field-title-sm">结算方式：</span>
            <span>{{ payment.payType | payType }}</span>
          </i-col>
        </Row>
      </div>
      <!-- 运单日志 -->
      <div>
        <div class="detail-part-title">
          <span>运单日志</span>
        </div>
        <div class="detail-log">

          <div class="detail-log-icon"
               @click="showLog = !showLog">
            <i :class="{'detail-log-show': showLog}"></i>
          </div>

          <Timeline :style="logListHeight"
                    class="detail-log-timeline">

            <TimelineItem v-for="(item, key) in logList"
                          :key="key" class="detail-log-timeline-item">
              <i slot="dot"></i>
              <span style="margin-right: 60px;color: #777;">{{item.createTimeLong | formatTime}}</span>
              <span style="color: #333;">{{'【' + item.operatorName + '】' + item.description}}</span>
            </TimelineItem>

          </Timeline>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import detailMixin from './detailMixin'
import Server from '@/libs/js/server'

export default {
  name: 'DetailFeright',

  filters: {
    payType (type) {
      return type === 1
        ? '到付'
        : (type === 2
          ? '回付'
          : '月结'
        )
    }
  },
  mixins: [ BasePage, detailMixin ],
  metaInfo: { title: '外转单详情' },
  data () {
    return {
      status: '',
      // 信息
      info: {
        orderNo: '',
        customerOrderNo: '',
        transNo: '',
        outTransNo: '',
        consignerName: '',
        deliveryTimeLong: '',
        arriveTimeLong: '',
        start: '',
        end: '',
        pickup: '',
        receiptCount: '',
        consignerContact: '',
        consignerPhone: '',
        consignerAddress: '',
        consigneeContact: '',
        consigneePhone: '',
        consigneeAddress: '',
        remark: ''
      },

      payment: {
        transfereeName: '',
        transFee: '',
        payType: ''
      },

      // 所有按钮组
      btnList: [
        {
          status: '待发运',
          btns: [{
            name: '删除',
            func: () => {
              this.billDelete()
            }
          }, {
            name: '发运',
            func: () => {
              this.billShipment()
            }
          }, {
            name: '编辑',
            func: () => {
              this.billEdit()
            }
          }]
        },
        {
          status: '在途',
          btns: [{
            name: '到货',
            func: () => {
              this.billArrived()
            }
          }]
        },
        {
          status: '已到货',
          btns: []
        }
      ],

      tableCanEdit: false,
      tableColumns: [
        {
          title: '货物名称',
          key: 'cargoName'
        },
        {
          title: '包装',
          key: 'packing'
        },
        {
          title: '数量',
          key: 'quantity'
        },
        {
          title: '货值（元）',
          key: 'cargoCost'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '备注1',
          key: 'remark1'
        },
        {
          title: '备注2',
          key: 'remark2'
        }
      ]
    }
  },

  methods: {
    // 将数据返回的标识映射为文字
    statusFilter (status) {
      switch (status) {
        case 1: return '待发运'
        case 2: return '在途'
        case 3: return '已到货'
      }
    },

    fetchData () {
      this.loading = true
      Server({
        url: '/outside/bill/detail',
        method: 'post',
        data: { transId: this.id }
      }).then(res => {
        const data = res.data.data

        for (let key in this.info) {
          this.info[key] = data.customerInfo[key]
        }
        for (let key in this.payment) {
          this.payment[key] = data.customerInfo[key]
        }
        this.detail = data.cargoList
        this.logList = data.operaterLogs

        this.status = this.statusFilter(data.customerInfo.status)
        this.setBtnsWithStatus()
        this.loading = false
      }).catch(err => console.error(err))
    },

    // 按钮操作
    // 删除
    billDelete (ids) {
      Server({
        url: '/outside/bill/delete',
        method: 'delete',
        data: { transIds: [ this.id ] }
      }).then(res => {
        this.$Message.success('删除成功')
      }).catch(err => console.error(err))
    },

    // 到货
    billArrived () {
      const self = this
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '到货确认',
          message: '是否确认到货？'
        },
        methods: {
          confirm () {
            Server({
              url: '/outside/bill/confirm/arrival',
              method: 'post',
              data: { transIds: [ self.id ] }
            }).then(res => {
              self.$Message.success('操作成功')
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 发运
    billShipment () {
      const self = this
      self.openDialog({
        name: 'transport/dialog/confirm',
        data: {
          title: '发运',
          message: '是否发运？发运以后将不能再修改外转单信息'
        },
        methods: {
          confirm () {
            Server({
              url: '/outside/bill/send',
              method: 'post',
              data: { transIds: [ self.id ] }
            }).then(res => {
              self.$Message.success('操作成功')
              self.fetchData()
            }).catch(err => console.error(err))
          }
        }
      })
    },

    // 编辑
    billEdit () {
      const self = this
      self.openDialog({
        name: 'transport/dialog/editOuter',
        data: { id: this.id },
        methods: {
          complete () {
            self.fetchData()
          }
        }
      })
    }
  }
}
</script>

<style lang='stylus'>
  @import "./detail.styl"
</style>
