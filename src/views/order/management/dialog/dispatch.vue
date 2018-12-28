<template>
  <div>
    <Modal v-model="visiable" :mask-closable="false" transfer class="dispatch-dialog" width="1032" @on-visible-change="close">
      <p slot="header" class="dialog-title">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>{{name}}</span>
      </p>
      <Form v-if="name === '送货调度'" ref="send" :model="send" :rules="sendRules" :label-width="70" inline label-position="right">
        <FormItem label="始发地：" prop="start">
          <!-- <area-select v-model="send.start" :deep="true" style="width:180px"></area-select> -->
          <city-select v-model="send.start" style="width:180px"></city-select>
        </FormItem>
        <FormItem label="目的地：" prop="end" style="margin-left:27px;">
          <!-- <area-select v-model="send.end" :deep="true" style="width:180px"></area-select> -->
          <city-select v-model="send.end" style="width:180px"></city-select>
        </FormItem>
        <div class="sub-title">承运订单：</div>
      </Form>
      <div v-else class="sub-title" style="border-top: none;padding-top: 0;">承运订单：</div>

      <Table :columns="tableColumns" :data="id" :height="id.length > 10 ? 520 : id.length * 48 + 40"></Table>
      <div class="table-footer">
        <span style="padding-right: 5px;box-sizing:border-box;margin-left:-12px;">合计</span>
        <span>订单总数：{{ orderTotal }}</span>
        <span>总体积：{{ volumeTotal + '方' }}</span>
        <span>总重量：{{ weightTotal + (WeightOption === 1 ? '吨' : '公斤') }}</span>
      </div>

      <div>
        <div class="send_car">
          <span style="margin-right: 24px;">直接派车</span>
          <i-switch v-model="sendCar" size="small" />
          <span v-if="!sendCar" class="send_car_tip">此处可以直接派车哦～</span>
        </div>
        <div v-if="sendCar" style="margin-top: 25px;">
          <send-car v-if="name === '送货调度'" ref="sendCarComp" :send-orders="id" :mileage="mileage" :finance-rules-info="financeRulesInfo"></send-car>
          <pick-up v-else ref="pickUpComp" :pick-orders="id"></pick-up>
        </div>
      </div>

      <div slot="footer">
        <Button :loading="btnLoading" type="primary"  @click="save">确定</Button>
        <Button type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
// import AreaSelect from '@/components/AreaSelect'
import CitySelect from '@/components/SelectInputForCity'
import SelectInput from '@/components/SelectInput.vue'
import SendCar from '@/views/transport/components/SendCar.vue'
import PickUp from '@/views/transport/components/PickUp.vue'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import float from '@/libs/js/float'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'

export default {
  name: 'dispatch',

  components: {
    // AreaSelect,
    CitySelect,
    SelectInput,
    SendCar,
    PickUp
  },

  mixins: [BaseDialog, tableWeightColumnMixin],

  data () {
    return {
      send: { start: void 0, end: void 0 },
      sendRules: {
        start: [
          { required: true, type: 'number', message: '请填写始发地', trigger: 'change' },
          { required: true, type: 'number', message: '请填写始发地', trigger: 'blur' }
        ],
        end: [
          { required: true, type: 'number', message: '请填写目的地', trigger: 'change' },
          { required: true, type: 'number', message: '请填写目的地', trigger: 'blur' }
        ]
      },
      sendCar: false,
      tableColumns: [
        {
          title: '操作',
          key: 'do',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  color: '#00a4bd'
                },
                on: {
                  click: () => {
                    this.id.splice(params.index, 1)
                    const temp = this.cargoInfoList.filter(item => item.orderId !== params.row.id)
                    this.cargoInfoList = temp
                    if (this.id.length === 0) {
                      this.close()
                    }
                  }
                }
              }, '移除')
            ])
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          minWidth: 160,
          tooltip: true
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          minWidth: 140,
          render: (h, p) => {
            return h('span', p.row.customerOrderNo ? p.row.customerOrderNo : '-')
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 130,
          tooltip: true
        },
        {
          title: '始发地',
          key: 'start',
          minWidth: 120,
          ellipsis: true,
          render: (h, params) => {
            if (params.row.startName.length > 8) {
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
          minWidth: 120,
          ellipsis: true,
          render: (h, params) => {
            if (params.row.endName.length > 8) {
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
          title: '体积（方）',
          key: 'volume',
          minWidth: 100,
          tooltip: true
        }
      ],
      columnWeight: {
        title: '重量（吨）',
        key: 'weight',
        minWidth: 100,
        tooltip: true
      },
      columnWeightKg: {
        title: '重量（公斤）',
        key: 'weightKg',
        minWidth: 100,
        tooltip: true
      },
      mileage: null,
      btnLoading: false,
      cargoInfoList: [] // 订单对应的货物信息
    }
  },

  computed: {
    ...mapGetters([
      'carriers',
      'carrierCars',
      'carrierDrivers',
      'WeightOption' // 重量配置 1 吨  2 公斤
    ]),
    orderTotal () {
      return this.id.length
    },
    volumeTotal () {
      let total = 0
      this.id.map((item) => {
        total += item.volume
      })
      return float.round(total, 6)
    },
    weightTotal () {
      let total = 0
      this.id.map((item) => {
        // 区分吨和公斤
        if (this.WeightOption === 1) {
          total += item.weight
        } else {
          total += item.weightKg
        }
      })
      return float.round(total, 3)
    },
    // 将货物信息按货物名称累加数量
    cargoInfos () {
      let arr = []
      let list = _.groupBy(this.cargoInfoList, 'cargoName')
      _.forEach(list, (value, key) => {
        let quantity = _.sumBy(value, (i) => {
          return i.quantity
        })
        let cargoInfo = {}
        cargoInfo[key] = quantity
        arr.push(cargoInfo)
      })
      return arr
    },
    financeRulesInfo () {
      return {
        start: this.send.start,
        end: this.send.end,
        weight: float.round(this.WeightOption === 1 ? this.weightTotal : this.weightTotal / 1000, 3),
        volume: this.volumeTotal,
        cargoInfos: this.cargoInfos
      }
    },
    orderIds () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.id)
      })
      return arr
    }
  },

  created () {
    let orderList = _.cloneDeep(this.id)
    orderList = orderList.filter((item) => {
      return (item.consigneeAddressLatitude !== '' && item.consigneeAddressLongitude !== '' && item.consignerAddressLatitude !== '' && item.consignerAddressLongitude !== '')
    })
    if (this.isAllEqual(orderList)) {
      this.mileage = orderList[0].mileage / 1000
    }
  },
  mounted: function () {
    // modify:20181023 by 宣飞 加上第一条数据的始发城市和目的城市
    setTimeout(() => {
      this.send.start = this.id[0].start
      this.send.end = this.id[0].end
      // 计费规则
    }, 0)
    // 动态添加吨或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.tableColumns, this.columnWeight, 7)
    } else {
      this.triggerWeightColumn(this.tableColumns, this.columnWeightKg, 7)
    }
    this.getOrderCargoList()
  },

  methods: {
    ...mapActions([
      'getCarriers'
    ]),
    // 判断勾选项始发地和目的地经纬度是否一样
    isAllEqual (array) {
      if (array.length > 0) {
        return !array.some((item, index) => {
          return (item.consigneeAddressLatitude !== array[0].consigneeAddressLatitude ||
                  item.consigneeAddressLongitude !== array[0].consigneeAddressLongitude ||
                  item.consignerAddressLatitude !== array[0].consignerAddressLatitude ||
                  item.consignerAddressLongitude !== array[0].consignerAddressLongitude)
        })
      } else {
        return false
      }
    },
    // 选择承运商dropdown的数据
    handleSelectCarrier (name, row) {
      this.$store.dispatch('getCarrierCars', row.id).then((res) => {
        this.pick.carNo = res[0].carNO //  默认带出第一条车牌号
        this.pick.driverName = res[0].driverName //  默认带出第一条司机姓名
      })
      this.$store.dispatch('getCarrierDrivers', row.id)
    },
    // 选择承运商车辆信息
    handleSelectCarrierCars (name, row) {
    },
    // 过滤已维护的客户信息
    filterMethod (value, option) {
      if (value) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
      }
    },
    save () {
      if (this.name === '送货调度') {
        this.doSendDispatch()
      } else {
        this.doPickDispatch()
      }
    },
    // 送货调度  创建运单
    doSendDispatch () {
      const z = this
      z.$refs['send'].validate((valid) => {
        if (valid) {
          let sendComp = z.$refs.sendCarComp
          if (z.sendCar && !sendComp.checkValidate()) return
          z.btnLoading = true
          // 地址入参为最后一级区号
          let data = {
            start: z.send.start,
            end: z.send.end,
            orderIds: z.orderIds,
            assignCar: z.sendCar ? 1 : 0
          }
          if (z.sendCar) {
            data.assignCarType = sendComp.sendWay
            // 订单数大于1需要传分摊策略
            if (this.id.length > 1) {
              data.allocationStrategy = sendComp.getAllocationStrategy()
            }
            if (data.assignCarType === '1') { // 外转
              data = Object.assign(data, sendComp.getformatMoney(), sendComp.getCarrierInfo(), {
                settlementType: sendComp.getSettlementType(),
                settlementPayInfo: sendComp.getSettlementPayInfos()
              })
            } else if (data.assignCarType === '2') { // 自送
              data = Object.assign(data, sendComp.getformatMoney(), sendComp.getOwnSend())
              delete data.cashBack // 自送没有返现
            }
          }
          Server({
            url: 'waybill/create',
            method: 'post',
            data: data
          }).then(() => {
            z.btnLoading = false
            z.ok()
            z.$Message.success('创建运单成功')
            z.close()
          }).catch(() => {
            z.btnLoading = false
          })
        }
      })
    },
    // 提货调度  创建提货单
    doPickDispatch () {
      const z = this
      if (z.sendCar && !z.$refs.pickUpComp.checkValidate()) return
      z.btnLoading = true
      let pickUpComp = z.$refs.pickUpComp
      let data = {
        orderIds: z.orderIds,
        assignCar: z.sendCar ? 1 : 0
      }
      if (z.sendCar) {
        data.assignCarType = pickUpComp.sendWay
        // 订单数大于1需要传分摊策略
        if (this.id.length > 1) {
          data.allocationStrategy = pickUpComp.getAllocationStrategy()
        }
        if (data.assignCarType === '1') { // 外转
          data = Object.assign(data, pickUpComp.getformatMoney(), pickUpComp.getCarrierInfo(), {
            settlementType: pickUpComp.getSettlementTypes(),
            settlementPayInfo: pickUpComp.getSettlementPayInfos()
          })
        } else if (data.assignCarType === '2') { // 自送
          data = Object.assign(data, pickUpComp.getformatMoney(), pickUpComp.getOwnSend())
          delete data.cashBack // 自送没有返现
        }
      }
      Server({
        url: 'load/bill/create',
        method: 'post',
        data: data
      }).then(() => {
        z.btnLoading = false
        z.ok()
        z.$Message.success('创建提货单成功')
        z.close()
      }).catch(() => {
        z.btnLoading = false
      })
    },
    // 将地址字符串8位后的替换成...
    formatterAddress (str) {
      return str.slice(0, 8) + ' ...'
    },
    // 查询勾选订单对应货物信息
    getOrderCargoList () {
      Server({
        url: '/order/getOrderCargoList',
        method: 'post',
        data: {
          orderIds: this.orderIds
        }
      }).then((res) => {
        this.cargoInfoList = res.data.data.list
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.dialog-title
  text-align center
  font-size 16px
  font-family 'PingFangSC-Medium'
  font-weight 700
  color rgba(47,50,62,1)
  letter-spacing 1px
.sub-title
  font-size 14px
  font-family 'PingFangSC-Medium'
  font-weight 500
  color rgba(51,51,51,1)
  padding 17px 0 18px 0
  border-top 1px dashed rgba(203,206,211,1)
.send_car
  font-size 14px
  font-family 'PingFangSC-Medium'
  font-weight 500
  color rgba(51,51,51,1)
  margin-top 29px
  &_tip
    font-size 12px
    color #666
    margin-left 25px
.table-footer
  height 48px
  border 1px solid #dcdee2
  border-top none
  line-height 48px
  font-family 'PingFangSC-Regular'
  color rgba(51,51,51,1)
  span
    display inline-block
    min-width 111px
    text-align center
</style>
<style lang='stylus'>
.dispatch-dialog
  .ivu-input-group
    display inline-block
  .ivu-modal-body
    padding 22px 40px
  .ivu-form
    .ivu-form-item-label
      padding 10px 0 10px
      font-size 14px
      font-family 'PingFangSC-Regular'
      color #777
</style>
