<template>
  <div class="order-set">
    <p class="order-set-title">客户信息</p>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.customerOrderNoOption">客户订单号</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.customerWaybillNoOption">客户运单号</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.salesmanIdOption">对接业务员</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.startCityOption">发货城市</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.endCityOption">到货城市</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.deliveryTimeOption">发货时间</Checkbox>
      </Col>
    </Row>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.arriveTimeOption">到货时间</Checkbox>
      </Col>
    </Row>
    <p class="order-set-title">收货人</p>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.consigneeCompanyNameOption">收货人单位</Checkbox>
      </Col>
    </Row>
    <p class="order-set-title">货物信息</p>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.cargoNoOption">货物编号</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.quantityOption">包装数量</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="weightTonOption">重量（吨）</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="weightKgOption">重量（公斤）</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.volumeOption">体积（方）</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.cargoCostOption">货值（元）</Checkbox>
      </Col>
    </Row>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.unitOption">包装方式</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.dimensionOption">包装尺寸</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.remark1Option">备注1</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.remark2Option">备注2</Checkbox>
      </Col>
    </Row>
    <p class="order-set-title">应收费用</p>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.mileageOption">计费里程</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.freightFeeOption">运输费</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.pickupFeeOption">提货费用</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.loadFeeOption">装货费用</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.unloadFeeOption">卸货费用</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.insuranceFeeOption">保险费用</Checkbox>
      </Col>
    </Row>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.otherFeeOption">其他费用</Checkbox>
      </Col>
    </Row>
    <p class="order-set-title">其他</p>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.pickupOption">提货方式</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.receiptCountOption">回单数量</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.isInvoiceOption">是否开票</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.collectionMoneyOption">代收货款</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.orderRemarkOption">订单备注</Checkbox>
      </Col>
    </Row>
    <div class="order-set-footer">
      <Button type="primary" @click="save">保存</Button>
      <Button type="default" class="i-ml-10" @click="reset">恢复默认</Button>
    </div>
    </Form>
  </div>
</template>
<script>
import Server from '@/libs/js/server'
import { mapGetters, mapMutations } from 'vuex'
const ORDER_SET = {
  // 客户订单号
  customerOrderNoOption: true,
  // 客户运单号
  customerWaybillNoOption: true,
  // 对接业务员
  salesmanIdOption: true,
  // 发货城市
  startCityOption: true,
  // 到货城市
  endCityOption: true,
  // 发货时间
  deliveryTimeOption: true,
  // 到货时间
  arriveTimeOption: true,
  // 收货人单位
  consigneeCompanyNameOption: false,
  // 货物编号
  cargoNoOption: true,
  // 包装数量
  quantityOption: true,
  // 重量吨
  weightTonOption: true,
  // 重量公斤
  weightKgOption: false,
  // 体积
  volumeOption: true,
  // 货值
  cargoCostOption: true,
  // 包装方式
  unitOption: true,
  // 包装尺寸
  dimensionOption: true,
  // 备注
  remark1Option: true,
  remark2Option: true,
  // 计费里程
  mileageOption: true,
  // 运输费
  freightFeeOption: true,
  // 提货费
  pickupFeeOption: true,
  // 装货费
  loadFeeOption: true,
  // 卸货费
  unloadFeeOption: true,
  // 保险费
  insuranceFeeOption: true,
  // 其他费用
  otherFeeOption: true,
  // 提货方式
  pickupOption: true,
  // 回单数量
  receiptCountOption: true,
  // 是否开票
  isInvoiceOption: true,
  // 代收货款
  collectionMoneyOption: true,
  // 订单备注
  orderRemarkOption: true
}
export default {
  name: 'order-set',
  data () {
    return {
      form: {
        ...ORDER_SET
      }
    }
  },
  computed: {
    ...mapGetters(['OrderSet']),
    weightTonOption: {
      get () {
        return this.form.weightTonOption
      },
      set (value) {
        this.form.weightTonOption = value
        if (value) {
          this.form.weightKgOption = !value
        }
      }
    },
    weightKgOption: {
      get () {
        return this.form.weightKgOption
      },
      set (value) {
        this.form.weightKgOption = value
        if (value) {
          this.form.weightTonOption = !value
        }
      }
    }
  },
  mounted () {
    const store = this.OrderSet
    for (let i in store) {
      this.form[i] = store[i] === 1
    }
  },
  methods: {
    ...mapMutations(['changeOrderConfiguration']),
    reset () {
      this.form = {
        ...ORDER_SET
      }
    },
    save () {
      // 1显示；2不显示
      const obj = {}
      for (let i in this.form) {
        obj[i] = this.form[i] === false ? 2 : 1
      }
      Server({
        url: 'set/saveCommonSettingInfo',
        method: 'post',
        data: {
          tmsSetConfigDto: obj
        }
      }).then((result) => {
        this.$Message.success('保存成功')
        this.changeOrderConfiguration(obj)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.order-set-title
  margin-top 30px
  color #333
  font-size 16px
  line-height 35px
  padding-left 21px
  font-weight 500
  background #F3F5F9
.order-set-row
  padding 0 21px
  margin-top 20px
.order-set-footer
  text-align center
  margin-top 50px
</style>
