<template>
  <!-- 默认状态 -->
  <div v-if="!inEditing">
    <!-- 运单号及状态 -->
    <section class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">运单号：{{ info.waybillNo }}</li>
        <li class="detail-header-list-item">订单状态：
          <span style="font-weight: bold;">{{ info.status }}</span>
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
      <!-- 运单信息 -->
      <div>
        <div class="detail-part-title">
          <span>运单信息</span>
        </div>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title">始发地：</span>
            <span>{{ info.start }}</span>
          </i-col>
          <i-col span="6" offset="1">
            <span class="detail-field-title">目的地：</span>
            <span>{{ info.end }}</span>
          </i-col>
          <i-col span="10" offset="1">
            <span class="detail-field-title">承运商：</span>
            <span>{{ info.carrierName }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title">车牌号：</span>
            <span>{{ info.carNo }}</span>
          </i-col>
          <i-col span="6" offset="1">
            <span class="detail-field-title">车型：</span>
            <span>{{ info.carType|carTypeFilter }} {{ info.carLength|carLengthFilter }}</span>
          </i-col>
          <i-col span="10" offset="1">
            <span class="detail-field-title">司机：</span>
            <span>{{ info.driverName + ' ' + info.driverPhone }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="13">
            <span class="detail-field-title">备注：</span>
            <span>{{ info.remark }}</span>
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
          <i-col span="3">
            <span class="detail-field-title-sm">运输费：</span>
            <span>{{ payment.freightFee }}元</span>
          </i-col>
          <i-col span="3" offset="2">
            <span class="detail-field-title-sm">装货费：</span>
            <span>{{ payment.loadFee }}元</span>
          </i-col>
          <i-col span="3" offset="2">
            <span class="detail-field-title-sm">卸货费：</span>
            <span>{{ payment.unloadFee }}元</span>
          </i-col>
          <i-col span="3" offset="2">
            <span class="detail-field-title-sm">保险费：</span>
            <span>{{ payment.insuranceFee }}元</span>
          </i-col>
          <i-col span="3" offset="2">
            <span class="detail-field-title-sm">其他：</span>
            <span>{{ payment.otherFee }}元</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm" style="vertical-align: unset;">费用合计：</span>
            <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm">结算方式：</span>
            <div class="detail-payment-way">
              {{ payment.settlementType === '1' ? '按单结' : '月结' }}
              <Table v-if="payment.settlementType === '2'"
                     :columns="tablePayment"
                     :data="payment.settlementPayInfo"
                     :loading="loading"
                     width="350"></Table>
            </div>
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
            <span
              :class="showLog ? 'detail-log-hide' : 'detail-log-show'">《</span>
          </div>

          <Timeline :style="logListHeight"
                    class="detail-log-timeline">

            <TimelineItem v-for="(item, key) in logList"
                          :key="key" class="detail-log-timeline-item">
              <i slot="dot"></i>
              <span style="margin-right: 60px;color: #777;">{{item.createTimeLong}}</span>
              <span style="color: #333;">{{'【' + item.operatorName + '】' + item.description}}</span>
            </TimelineItem>

          </Timeline>
        </div>
      </div>
    </section>
  </div>

  <!-- 编辑状态 -->
  <div v-else>
    <!-- 运单号及状态 -->
    <section class="detail-header">
      <ul class="detail-header-list">
        <li class="detail-header-list-item">运单号：{{ info.waybillNo }}</li>
        <li class="detail-header-list-item">订单状态：
          <span style="font-weight: bold;">{{ info.status }}</span>
        </li>
      </ul>
    </section>

    <section class="detail-info">
      <!-- 运单信息 -->
      <div>
        <div class="detail-part-title">
          <span>运单信息</span>
        </div>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title detail-field-required">始发地：</span>
            <Input v-model="info.start"
                   class="detail-info-input"></Input>
          </i-col>
          <i-col span="6" offset="1">
            <span class="detail-field-title detail-field-required">目的地：</span>
            <Input v-model="info.end"
                   class="detail-info-input"></Input>
          </i-col>
          <i-col span="10" offset="1">
            <span class="detail-field-title detail-field-required">承运商：</span>
            <Input v-model="info.carrierName"
                   class="detail-info-input"></Input>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="6">
            <span class="detail-field-title detail-field-required">车牌号：</span>
            <Input v-model="info.carNo"
                   class="detail-info-input"></Input>
          </i-col>
          <i-col span="6" offset="1">
            <span class="detail-field-title">车型/车长：</span>
            <Select v-model="info.carType"
                    class="detail-info-input-half"
                    style="margin-right: 12px;">
              <Option v-for="item in carType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="info.carLength"
                    class="detail-info-input-half">
              <Option v-for="item in carLength" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </i-col>
          <i-col span="4" offset="1">
            <span class="detail-field-title detail-field-required">司机：</span>
            <Input v-model="info.driverName"
                   class="detail-info-input"></Input>
          </i-col>
          <i-col span="5" offset="1">
            <span class="detail-field-title">司机手机号：</span>
            <Input v-model="info.driverPhone"
                   class="detail-info-input"></Input>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="13">
            <span class="detail-field-title">备注：</span>
            <Input v-model="info.remark"
                   :maxlength="100"
                   class="detail-info-input"></Input>
          </i-col>
        </Row>
      </div>
      <!-- 货物明细 -->
      <div>
        <div class="detail-part-title">
          <span>货物明细</span>
        </div>
        <Button type="primary" style="margin-bottom: 22px;"
                @click="addOrder">添加订单</Button>
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
          <i-col span="4">
            <span class="detail-field-title-sm detail-field-required">运输费：</span>
            <Input v-model="payment.freightFee"
                   class="detail-payment-input">
            <span slot="suffix">元</span>
            </Input>
            <a class="detail-payment-calc" @click.prevent="showChargeRules"><i class="icon font_family icon-jisuanqi1"></i></a>
          </i-col>
          <i-col span="3" offset="1">
            <span class="detail-field-title-sm">装货费：</span>
            <Input v-model="payment.loadFee"
                   class="detail-payment-input">
            <span slot="suffix">元</span>
            </Input>
          </i-col>
          <i-col span="3" offset="2">
            <span class="detail-field-title-sm">卸货费：</span>
            <Input v-model="payment.unloadFee"
                   class="detail-payment-input">
            <span slot="suffix">元</span>
            </Input>
          </i-col>
          <i-col span="3" offset="2">
            <span class="detail-field-title-sm">保险费：</span>
            <Input v-model="payment.insuranceFee"
                   class="detail-payment-input">
            <span slot="suffix">元</span>
            </Input>
          </i-col>
          <i-col span="3" offset="2">
            <span class="detail-field-title-sm">其他：</span>
            <Input v-model="payment.otherFee"
                   class="detail-payment-input">
            <span slot="suffix">元</span>
            </Input>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm" style="vertical-align: unset;">费用合计：</span>
            <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:#00A4BD;margin-right: 10px;">{{ paymentTotal }}</span>元
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detail-field-title-sm detail-field-required">结算方式：</span>
            <div class="detail-payment-way">
              <RadioGroup v-model="payment.settlementType">
                <Radio label="1">按单结</Radio>
                <Radio label="2">月结</Radio>
              </RadioGroup>
              <Table v-if="payment.settlementType === '2'"
                     :columns="tablePayment"
                     :data="payment.settlementPayInfo"
                     :loading="loading"
                     width="350"></Table>
            </div>
          </i-col>
        </Row>
      </div>
    </section>

    <section class="detail-edit-footer">
      <Button class="detail-edit-footer-btn" type="primary">保存</Button>
      <Button class="detail-edit-footer-btn" type="default" @click="cancelEdit">取消</Button>
    </section>

  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import detailMixin from './detailMixin'
import Server from '@/libs/js/server'

export default {
  name: 'DetailFeright',
  mixins: [ BasePage, detailMixin ],
  metaInfo: { title: '运单详情' },
  data () {
    return {
      // 信息
      info: {
        waybillNo: '',
        status: '',
        start: '',
        end: '',
        carrierName: '',
        carNo: '',
        carType: '',
        carLength: '',
        driverName: '',
        driverPhone: '',
        remark: ''
      },

      // 费用
      payment: {
        settlementType: '',
        freightFee: '',
        loadFee: '',
        unloadFee: '',
        insuranceFee: '',
        otherFee: '',
        totalFee: '',
        settlementPayInfo: []
      },

      // 所有按钮组
      btnList: [
        {
          status: '待派车',
          btns: [{
            name: '删除',
            func: () => console.log(Math.random())
          }, {
            name: '派车',
            func: () => console.log(Math.random())
          }, {
            name: '编辑',
            func: () => {
              this.inEditing = true
            }
          }]
        },
        {
          status: '待发运',
          btns: []
        },
        {
          status: '在途',
          btns: [{
            name: '位置',
            func: () => console.log(Math.random())
          }]
        },
        {
          status: '已到货',
          btns: []
        }
      ],

      tableCanEdit: true,
      tableColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          render: (h, p) => {
            return h('span', {
              style: { color: '#3A7EDE' }
            }, p.row.orderNo)
          }
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo'
        },
        {
          title: '始发地-目的地',
          key: 'start',
          render: (h, p) => {
            return h('span', p.row.start + '-' + p.row.end)
          }
        },
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
        case 1: return '待派车'
        case 2: return '待发运'
        case 3: return '在途'
        case 4: return '已到货'
      }
    },

    fetchData () {
      this.loading = true
      Server({
        url: '/waybill/details',
        method: 'post',
        data: { waybillId: this.id }
      }).then(res => {
        const data = res.data.data

        for (let key in this.info) {
          this.info[key] = data.waybill[key]
        }
        for (let key in this.payment) {
          this.payment[key] = data.waybill[key]
        }
        this.detail = data.cargoList
        this.logList = data.operaterLog

        this.info.status = this.statusFilter(this.info.status)
        this.payment.settlementType = this.payment.settlementType.toString()
        this.setBtnsWithStatus()
        this.loading = false
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang='stylus'>
  @import "./detail.styl"
</style>
