<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="1100" class="order-edit" @on-visible-change="close">
    <p slot="header" class="dialog-title">修改订单</p>
    <Form ref="orderForm" :label-width="80" :model="orderForm" :rules="rules" >
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="结算方式:" prop="settlementType">
          <Select :disabled="isCanChangeFee !== 1" v-model="orderForm.settlementType" transfer>
            <Option v-for="opt in settlements" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="计费里程:" prop="mileage">
          <Row>
            <Col span="19">
            <TagNumberInput :show-chinese="false" :min="0" v-model="orderForm.mileage" :precision="1">
            </TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">公里</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="运输费用:" prop="freightFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" :disabled="isCanChangeFee !== 1" v-model="orderForm.freightFee"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">
            <span style="vertical-align:middle">元</span>
            <!-- <span @click="showCounter">
              <FontIcon type="jisuanqi" size="20" color="#00a4bd" style="vertical-align:middle"></FontIcon>
            </span> -->
            </Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="提货费用:" prop="pickupFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" :disabled="isCanChangeFee !== 1" v-model="orderForm.pickupFee"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="装货费用:" prop="loadFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" :disabled="isCanChangeFee !== 1" v-model="orderForm.loadFee"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="卸货费用:" prop="unloadFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" :disabled="isCanChangeFee !== 1" v-model="orderForm.unloadFee"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="保险费用:" prop="insuranceFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" :disabled="isCanChangeFee !== 1" v-model="orderForm.insuranceFee"></TagNumberInput>
            </Col>
            <Col span="4" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="其他费用:" prop="otherFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" :disabled="isCanChangeFee !== 1" v-model="orderForm.otherFee"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="10">
        <FormItem label="费用合计:">
          <span class="order-create__font-total">{{totalFee}}</span>元
          <span class="tips">{{ feeTips }}</span>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <!-- <Col span="6">
        <FormItem label="提货方式:" prop="pickup">
          <Select ref="pickupSelector" v-model="orderForm.pickup" transfer>
            <Option v-for="opt in pickups" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          </Select>
        </FormItem>
        </Col> -->
        <Col span="6">
        <FormItem label="回单数量:" prop="receiptCount">
          <Row>
            <Col span="20">
            <InputNumber v-model="orderForm.receiptCount" :min="0" :parser="value => value ?  parseInt(value).toString() : value" class="order-create__input-w100">
            </InputNumber>
            </Col>
            <Col span="4" class="order-create__input-unit">份</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="代收货款:" prop="collectionMoney">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" :disabled="isCanChangeCollectionMoney !== 1" v-model="orderForm.collectionMoney"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">元</Col>
          </Row>
          <span class="tips" style="position: absolute;margin-left: 0;">{{ collectTips }}</span>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="是否开票:">
          <Select v-model="orderForm.isInvoice" transfer>
            <Option v-for="opt in invoiceList" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem v-if="orderForm.isInvoice === 1" label="开票税率:" prop="invoiceRate">
          <Row>
            <Col span="20">
            <TagNumberInput v-model="orderForm.invoiceRate" :show-chinese="false" :min="0" :max="100">
            </TagNumberInput>
            </Col>
            <Col span="4" class="order-create__input-unit">%</Col>
          </Row>
        </FormItem>
        </Col>
      </Row>
      <Row style="margin-top: 10px;">
        <Col>
        <FormItem label="备注:">
          <Input v-model="orderForm.remark" :maxlength="100" type="text">
          </Input>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="save('orderForm')">确定</Button>
      <Button type="default" @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import pickups from '@/libs/constant/pickup.js'
import settlements from '@/libs/constant/settlement.js'
import { invoiceList } from '@/libs/constant/orderCreate.js'
import TagNumberInput from '@/components/TagNumberInput'
import FontIcon from '@/components/FontIcon'
import validator from '@/libs/js/validate'
import float from '@/libs/js/float'
import _ from 'lodash'

export default {
  name: 'order-edit',
  components: {
    FontIcon,
    TagNumberInput
  },
  mixins: [BaseDialog],
  data () {
    // 9位整数 2位小数
    const validateFee = (rule, value, callback) => {
      if ((value && validator.fee(value)) || !value) {
        callback()
      } else {
        callback(new Error('费用整数位最多输入9位,小数2位'))
      }
    }
    // 6位整数 1位小数
    const validateMile = (rule, value, callback) => {
      if ((value && validator.mileage(value)) || !value) {
        callback()
      } else {
        callback(new Error('距离整数位最多输入6位,小数1位'))
      }
    }
    const rate = (rule, value, callback) => {
      if ((value && validator.fee(value) && value <= 100) || !value) {
        callback()
      } else {
        callback(new Error('税率在0-100之间,小数2位'))
      }
    }
    return {
      pickups,
      settlements,
      invoiceList,
      orderForm: {
        id: null,
        settlementType: 4,
        mileage: null,
        freightFee: null,
        pickupFee: null,
        loadFee: null, // 转货费
        unloadFee: null, // 卸货
        insuranceFee: null, // 保险
        otherFee: null, // 其他费用
        receiptCount: 1,
        isInvoice: 0,
        invoiceRate: null,
        collectionMoney: null,
        remark: ''
      },
      rules: {
        settlementType: [
          { required: true, message: '' }
        ],
        mileage: [
          { validator: validateMile }
        ],
        freightFee: [
          { validator: validateFee }
        ],
        pickupFee: [
          { validator: validateFee }
        ],
        loadFee: [
          { validator: validateFee }
        ],
        unloadFee: [
          { validator: validateFee }
        ],
        insuranceFee: [
          { validator: validateFee }
        ],
        otherFee: [
          { validator: validateFee }
        ],
        receiptCount: [
          { required: true, type: 'number', message: '请输入回单数量' }
        ],
        invoiceRate: [
          { required: true, message: '请填写开票税率' },
          { validator: rate }
        ],
        collectionMoney: [
          { validator: validateFee }
        ]
      },
      isCanChangeFee: 1, // 是否可以改结算方式、费用：1可以修改；2不可以修改（已经加入对账单）；3不可以修改（已经核销）
      isCanChangeCollectionMoney: 1, // 1可以修改；2不可以修改（已收代收货款）;3不可以修改（被拆单）
      cloneData: {}
    }
  },

  computed: {
    feeTips () {
      let tips = ''
      if (this.isCanChangeFee === 2) {
        tips = '已加入对账单'
      } else if (this.isCanChangeFee === 3) {
        tips = '已核销'
      }
      return tips
    },
    collectTips () {
      let tips = ''
      if (this.isCanChangeCollectionMoney === 2) {
        tips = '已收款'
      } else if (this.isCanChangeCollectionMoney === 3) {
        tips = '已拆单'
      }
      return tips
    },
    totalFee () {
      let total
      total = Number(this.orderForm.freightFee) +
              Number(this.orderForm.pickupFee) +
              Number(this.orderForm.loadFee) +
              Number(this.orderForm.unloadFee) +
              Number(this.orderForm.insuranceFee) +
              Number(this.orderForm.otherFee)
      return float.round(total)
    }
  },

  mounted () {
    this.getOrderChangeDetail()
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.cloneData) === JSON.stringify(this.orderForm)) {
            this.$Message.warning('您未做任何修改')
            return
          }
          for (let key in this.orderForm) {
            if (key.indexOf('Fee') > -1 || key === 'collectionMoney') {
              float.round(this.orderForm[key] *= 100, 0)
            } else if (key === 'mileage') {
              float.round(this.orderForm[key] *= 1000, 0)
            } else if (key === 'invoiceRate') {
              this.orderForm[key] = float.round(this.orderForm[key] / 100, 4)
            }
          }
          Server({
            url: '/order/change',
            method: 'post',
            data: {
              ...this.orderForm
            }
          }).then((res) => {
            if (res.data.code === 10000) {
              this.$Message.success('修改成功')
              this.ok()
              this.close()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    getOrderChangeDetail () {
      Server({
        url: '/order/getChangeDetail',
        method: 'post',
        data: {
          id: this.id
        }
      }).then((res) => {
        let data = res.data.data
        this.isCanChangeFee = data.isCanChangeFee
        this.isCanChangeCollectionMoney = data.isCanChangeCollectionMoney
        for (let key in this.orderForm) {
          if (key.indexOf('Fee') > -1 || key === 'collectionMoney') {
            this.orderForm[key] = float.round(data[key] / 100) || null
          } else if (key === 'mileage') {
            this.orderForm[key] = float.round(data[key] / 1000, 1) || null
          } else if (key === 'invoiceRate') {
            this.orderForm[key] = float.round(data[key] * 100) || null
          } else {
            this.orderForm[key] = data[key]
          }
        }
        this.cloneData = _.cloneDeep(this.orderForm)
      })
    }
  }
}
</script>
<style lang='stylus'>
  .order-edit
    .ivu-form
      .ivu-form-item-label
        font-size 14px
        font-family 'PingFangSC-Regular'
        color #777
        padding-right 0
      .ivu-form-item-content
        margin-left 90px !important
</style>
<style lang='stylus' scoped>
  .dialog-title
    text-align center
    font-size 16px
    font-family 'PingFangSC-Medium'
    font-weight 700
    color rgba(47,50,62,1)
    letter-spacing 1px
  .ivu-input-number-w100
    width 95%
  .order-create__input-w100
    width 92%
  .order-create__font-total
    font-size 18px
    font-family 'DINAlternate-Bold'
    font-weight bold
    color #00A4BD
    margin-right 10px
  .order-create__input-unit
    vertical-align middle
    font-size 12px
    line-height 32px
    color #30333F
  .tips
    margin-left 20px
    color #ed4014
    font-size 14px
</style>
