<template>
  <Modal v-model="visiable" :mask-closable="true" transfer width="1100" @on-visible-change="close">
    <p slot="header">修改订单</p>
    <Form ref="orderForm" :label-width="80" :model="orderForm" :rules="rules" >
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="结算方式:" prop="settlementType">
          <Select v-model="orderForm.settlementType" transfer>
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
            <TagNumberInput :min="0" v-model="orderForm.freightFee"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">
            <span style="vertical-align:middle">元</span>
            <span @click="showCounter">
              <FontIcon type="jisuanqi" size="20" color="#00a4bd" style="vertical-align:middle"></FontIcon>
            </span>
            </Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="提货费用:" prop="pickupFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" v-model="orderForm.pickupFee"></TagNumberInput>
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
            <TagNumberInput :min="0" v-model="orderForm.loadFee"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="卸货费用:" prop="unloadFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" v-model="orderForm.unloadFee"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="保险费用:" prop="insuranceFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" v-model="orderForm.insuranceFee"></TagNumberInput>
            </Col>
            <Col span="4" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="其他费用:" prop="otherFee">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" v-model="orderForm.otherFee"></TagNumberInput>
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
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="6">
        <FormItem label="提货方式:" prop="pickup">
          <Select ref="pickupSelector" v-model="orderForm.pickup" transfer>
            <Option v-for="opt in pickups" :key="opt.value" :value="opt.value">{{opt.name}}</Option>
          </Select>
        </FormItem>
        </Col>
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
        <FormItem label="是否开票:" prop="isInvoice">
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
      <Row>
        <Col span="6">
        <FormItem label="代收货款:" prop="collectionMoney">
          <Row>
            <Col span="19">
            <TagNumberInput :min="0" v-model="orderForm.collectionMoney"></TagNumberInput>
            </Col>
            <Col span="5" class="order-create__input-unit">元</Col>
          </Row>
        </FormItem>
        </Col>
        <Col span="18">
        <FormItem label="备注:" prop="remark">
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
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import pickups from '@/libs/constant/pickup.js'
import settlements from '@/libs/constant/settlement.js'
import { invoiceList } from '@/libs/constant/orderCreate.js'
import TagNumberInput from '@/components/TagNumberInput'
import FontIcon from '@/components/FontIcon'
export default {
  name: 'order-edit',
  components: {
    FontIcon,
    TagNumberInput
  },
  mixins: [BaseDialog],
  data () {
    return {
      pickups,
      settlements,
      invoiceList,
      orderForm: {
        settlementType: 4,
        mileage: null,
        freightFee: null,
        pickupFee: null,
        loadFee: null, // 转货费
        unloadFee: null, // 卸货
        insuranceFee: null, // 保险
        otherFee: null, // 其他费用
        pickup: null, // 提货费
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
          { required: true, message: '' }
        ],
        freightFee: [
          { required: true, message: '' }
        ],
        pickupFee: [
          { required: true, message: '' }
        ],
        loadFee: [
          { required: true, message: '' }
        ],
        unloadFee: [
          { required: true, message: '' }
        ],
        insuranceFee: [
          { required: true, message: '' }
        ],
        otherFee: [
          { required: true, message: '' }
        ],
        pickup: [
          { required: true, message: '' }
        ],
        receiptCount: [
          { required: true, message: '' }
        ],
        isInvoice: [
          { required: true, message: '' }
        ],
        invoiceRate: [
          { required: true, message: '' }
        ],
        collectionMoney: [
          { required: true, message: '' }
        ],
        remark: [
          { required: true, message: '' }
        ]
      }
    }
  },
  computed: {
    orderId () {
      return null
    },
    totalFee () {
      return 0
    }
  },
  mounted () {
  },
  methods: {
    showCounter () {},
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  }
}
</script>
