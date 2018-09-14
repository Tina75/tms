<template>
  <div>

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
          <i-col span="7">
            <span class="detial-field-title">始发地：</span>
            <span>{{ info.start }}</span>
          </i-col>
          <i-col span="7">
            <span class="detial-field-title">目的地：</span>
            <span>{{ info.end }}</span>
          </i-col>
          <i-col span="10">
            <span class="detial-field-title">承运商：</span>
            <span>{{ info.carrierName }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="7">
            <span class="detial-field-title">车牌号：</span>
            <span>{{ info.carNo }}</span>
          </i-col>
          <i-col span="7">
            <span class="detial-field-title">车型：</span>
            <span>{{ info.carType + ' ' + info.carLength }}</span>
          </i-col>
          <i-col span="10">
            <span class="detial-field-title">司机：</span>
            <span>{{ info.driverName + ' ' + info.driverPhone }}</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detial-field-title">备注：</span>
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
          <span class="table-footer-title">合计</span>
          <span>总货值：{{ total.cost }}</span>
          <span>总数量：{{ total.quantity }}</span>
          <span>总体积：{{ total.weight }}</span>
          <span>总重量：{{ total.volume }}</span>
        </div>
      </div>
      <!-- 应付费用 -->
      <div>
        <div class="detail-part-title">
          <span>应付费用</span>
        </div>
        <Row class="detail-field-group">
          <i-col span="4">
            <span class="detial-field-title">运输费：</span>
            <span>{{ payment.freightFee }}元</span>
          </i-col>
          <i-col span="4">
            <span class="detial-field-title">装货费：</span>
            <span>{{ payment.loadFee }}元</span>
          </i-col>
          <i-col span="4">
            <span class="detial-field-title">卸货费：</span>
            <span>{{ payment.unloadFee }}元</span>
          </i-col>
          <i-col span="4">
            <span class="detial-field-title">保险费：</span>
            <span>{{ payment.insuranceFee }}元</span>
          </i-col>
          <i-col span="4">
            <span class="detial-field-title">其他：</span>
            <span>{{ payment.otherFee }}元</span>
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detial-field-title">费用合计：</span>
            <span style="font-size:18px;font-family:'DINAlternate-Bold';font-weight:bold;color:rgba(0,164,189,1);margin-right: 10px;">{{ payment.totalFee }}</span>元
          </i-col>
        </Row>
        <Row class="detail-field-group">
          <i-col span="24">
            <span class="detial-field-title">结算方式：</span>
            <span>月结</span>
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
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'

export default {
  name: 'DetailFeright',
  mixins: [ BasePage ],
  metaInfo: { title: '运单详情' },
  data () {
    return {
      loading: false,
      // 信息
      info: {
        waybillId: '',
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
      // 明细
      detail: [],
      // 费用
      payment: {
        settlementType: '',
        freightFee: '',
        loadFee: '',
        unloadFee: '',
        insuranceFee: '',
        otherFee: '',
        totalFee: '',
        settlementPayInfo: ''
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
            func: () => console.log(Math.random())
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
      currentBtns: [], // 当前按钮组

      tableColumns: [
        {
          title: '订单号',
          key: 'orderNo'
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
      ],

      showLog: false,
      logList: []
    }
  },

  computed: {
    // 根据日志收起展开动态计算高度
    logListHeight () {
      return { height: this.showLog ? 41 * this.logList.length + 'px' : '15px' }
    },

    total () {
      return {
        cost: 100,
        quantity: 101,
        weight: 102,
        volume: 103
      }
    }
  },
  created () {
    this.fetchData()
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
    carTypeFilter (type) {
      switch (type) {
        case 1: return '平板'
        case 2: return '高栏'
        case 3: return '厢车'
        case 4: return '自卸'
        case 5: return '冷藏'
        case 6: return '保温'
        case 7: return '高低板'
        case 8: return '面包车'
        case 9: return '爬梯车'
        case 10: return '飞翼车'
      }
    },
    carLengthFilter (length) {
      switch (length) {
        case 1: return '1.8米'
        case 2: return '2.8米'
        case 3: return '3.8米'
        case 4: return '4.2米'
        case 5: return '5米'
        case 6: return '6.2米'
        case 7: return '6.8米'
        case 8: return '7.7米'
        case 9: return '8.2米'
        case 10: return '8.7米'
        case 11: return '9.6米'
        case 12: return '11.7米'
        case 13: return '12.5米'
        case 14: return '13米'
        case 15: return '15米'
        case 16: return '16米'
        case 17: return '17.5米'
      }
    },

    // 根据状态设置按钮
    setBtnsWithStatus () {
      for (let i = 0; i < this.btnList.length; i++) {
        if (this.btnList[i].status === this.info.status) {
          this.currentBtns = this.btnList[0].btns
          return
        }
      }
    },

    fetchData () {
      this.loading = true
      Server({
        url: '/waybill/details',
        method: 'get'
      }).then(res => {
        const data = res.data.data

        for (let key in this.info) {
          this.info[key] = data.waybillInfo[key]
        }
        for (let key in this.payment) {
          this.payment[key] = data.waybillInfo[key]
        }
        this.detail = data.cargoList
        this.logList = data.operaterLog

        this.info.status = this.statusFilter(this.info.status)
        this.info.carType = this.carTypeFilter(this.info.carType)
        this.info.carLength = this.carLengthFilter(this.info.carLength)
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
