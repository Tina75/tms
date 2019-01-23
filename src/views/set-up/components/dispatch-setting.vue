<template>
  <div class="order-set">
    <p class="delivery-set-title">派车方式</p>
    <Row :gutter="16" class="delivery-set-row">
      <Col span="3" class="set-title1">
      默认派车方式：
      </Col>
      <Col span="3">
      <Radio v-model="form.selfSendOption" :true-value="1" :false-value="2" @on-change="handleChangeSelfSend">自送</Radio>
      </Col>
      <Col span="3">
      <Radio v-model="form.outSendOption" :true-value="1" :false-value="2" @on-change="handleChangeOutSend">外转</Radio>
      </Col>
    </Row>
    <p class="delivery-set-title">费用明细</p>
    <Row :gutter="16" class="i-pl-20 i-mt-20">
      <Col span="4" class="set-title1">
      提货费用
      </Col>
    </Row>
    <CheckboxGroup v-model="pickSelf">
      <Row :gutter="16" class="delivery-set-row">
        <Col span="2" class="set-title1" offset="1">自送：</Col>
        <Col span="3">
        <Checkbox   label="pickSelfOilFeeOption" >油费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="pickSelfLoadFeeOption">装货费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="pickSelfUnloadFeeOption">卸货费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="pickSelfInsuranceFeeOption">保险费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="pickSelfOtherFeeOption" >其他</Checkbox>
      </Col>
      </Row>
    </CheckboxGroup>
    <CheckboxGroup v-model="pickOut">
      <Row :gutter="16" class="delivery-set-row">
        <Col span="2" class="set-title1" offset="1">外转：</Col>
        <Col span="3">
        <Checkbox   label="pickOutFreightFeeOption" >运输费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="pickOutLoadFeeOption" >装货费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="pickOutUnloadFeeOption" >卸货费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="pickOutInsuranceFeeOption" >保险费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="pickOutOtherFeeOption">其他</Checkbox>
      </Col>
      </Row>
    </CheckboxGroup>
    <Row :gutter="16"  class="set-title1 i-mt-40 i-pl-20">
      <Col span="4">
      送货费用
      </Col>
    </Row>
    <CheckboxGroup v-model="deliverSelf">
      <Row :gutter="16" class="delivery-set-row">
        <Col span="2" class="set-title1" offset="1">自送：</Col>

        <Col span="3">
        <Checkbox   label="deliverSelfOilFeeOption">油费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverSelfLoadFeeOption">装货费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverSelfUnloadFeeOption">卸货费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverSelfTollFeeOption">路桥费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverSelfAccommodationFeeOption">住宿费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverSelfInsuranceFeeOption">保险费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverSelfOtherFeeOption">其他</Checkbox>
      </Col>
      </Row>
    </CheckboxGroup>
    <CheckboxGroup v-model="deliverOut">

      <Row :gutter="16" class="delivery-set-row">
        <Col span="2" class="set-title1" offset="1">外转：</Col>

        <Col span="3">
        <Checkbox   label="deliverOutFreightFeeOption">运输费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverOutLoadFeeOption">装货费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverOutUnloadFeeOption">卸货费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverOutTollFeeOption">路桥费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverOutInsuranceFeeOption">保险费</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverOutOtherFeeOption">其他</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="deliverOutInfoFeeOption">信息费</Checkbox>
      </Col>
      </Row>
      <Row :gutter="16" class="delivery-set-row">
        <Col span="2" offset="1">&nbsp;</Col>
        <Col span="3">
        <Checkbox   label="deliverOutCashBackFeeOption">返现费</Checkbox>
      </Col>
      </Row>
    </CheckboxGroup>
    <p class="delivery-set-title">付款方式</p>
    <CheckboxGroup v-model="paySettlement">
      <Row :gutter="16" class="delivery-set-row">
        <Col span="3" class="set-title1">
        送货外转：
      </Col>
        <Col span="3">
        <Checkbox   label="paySettlementAdvanceOption">预付</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="paySettlementArriveOption">到付</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="paySettlementReceiptOption">回付</Checkbox>
      </Col>
        <Col span="3">
        <Checkbox   label="paySettlementTailOption">尾款</Checkbox>
      </Col>
      </Row>
    </CheckboxGroup>
    <div class="delivery-set-footer">
      <Button type="primary" class="save-button" @click="save">保存</Button>
      <Button type="default" class="i-ml-10" @click="reset">恢复默认</Button>
    </div>
    </Form>
  </div>
</template>

<script>
/**
 * 派车设置
 */
import Server from '@/libs/js/server'
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
import { defaultDispatchState as DELIVERY_SET } from '@/store/index'
export default {
  name: 'delivery-setting',
  data () {
    return {
      form: {
        ...DELIVERY_SET
      },
      pickSelf: [], // 提货自送配置
      pickOut: [], // 提货外转
      deliverSelf: [], // 送货自送
      deliverOut: [], // 送货外转
      paySettlement: [] // 四段付
    }
  },
  computed: {
    ...mapGetters(['DispatchSet'])

  },
  watch: {
    pickSelf (newValues, oldValues) {
      if (newValues.length === 0) {
        this.$Message.warning('提货自送费用至少保留一项')
        this.$nextTick(() => {
          this.pickSelf = oldValues
        })
        return
      }
      this.syncFormState(newValues, oldValues)
    },
    pickOut (newValues, oldValues) {
      if (newValues.length === 0) {
        this.$Message.warning('提货外转费用至少保留一项')
        this.$nextTick(() => {
          this.pickOut = oldValues
        })
        return
      }
      this.syncFormState(newValues, oldValues)
    },
    deliverSelf (newValues, oldValues) {
      if (newValues.length === 0) {
        this.$Message.warning('送货自送费用至少保留一项')
        this.$nextTick(() => {
          this.deliverSelf = oldValues
        })
        return
      }
      this.syncFormState(newValues, oldValues)
    },
    deliverOut (newValues, oldValues) {
      if (newValues.length === 0) {
        this.$Message.warning('送货外转费用至少保留一项')
        this.$nextTick(() => {
          this.deliverOut = oldValues
        })
        return
      }
      this.syncFormState(newValues, oldValues)
    },
    paySettlement (newValues, oldValues) {
      if (newValues.length === 0) {
        this.$Message.warning('送货外转付款方式费用至少保留一项')
        this.$nextTick(() => {
          this.paySettlement = oldValues
        })
        return
      }
      this.syncFormState(newValues, oldValues)
    }
  },
  mounted () {
    const store = this.DispatchSet
    for (let key in store) {
      this.form[key] = store[key]
      if (store[key] === 1) {
        if (key.startsWith('pickSelf')) {
        // 提货自送
          this.pickSelf.push(key)
        } else if (key.startsWith('pickOut')) {
          // 提货外转
          this.pickOut.push(key)
        } else if (key.startsWith('deliverSelf')) {
          // 送货费用自送
          this.deliverSelf.push(key)
        } else if (key.startsWith('deliverOut')) {
          // 送货外转
          this.deliverOut.push(key)
        } else if (key.startsWith('paySettlement')) {
          this.paySettlement.push(key)
        }
      }
    }
  },
  methods: {
    ...mapMutations(['changeDispatchConfiguration']),
    /**
     * 同步formstate的值
     */
    syncFormState (newValues, oldValues) {
      if (newValues.length > oldValues.length) {
        // 选中一个
        let addedKey = _.difference(newValues, oldValues)
        this.form[addedKey] = 1
      } else {
        // 取消选中一个
        let removeedKey = _.difference(oldValues, newValues)
        this.form[removeedKey] = 2
      }
    },
    /**
     * 自送 radio change
     */
    handleChangeSelfSend (value) {
      this.form.selfSendOption = value
      this.form.outSendOption = 2
    },
    /**
     * 外转 radio change
     */
    handleChangeOutSend (value) {
      this.form.selfSendOption = 2
      this.form.outSendOption = value
    },
    /**
     * 恢复默认
     */
    reset () {
      const vm = this
      vm.$Toast.confirm({
        content: '是否确认恢复默认？',
        onOk () {
          vm.form = {
            ...DELIVERY_SET
          }
          vm.save()
        }
      })
    },
    save () {
      const data = { ...this.form }
      Server({
        url: 'set/saveDispatchCarSet',
        method: 'post',
        data: data
      })
        .then((result) => {
          this.$Message.success('保存成功')
          this.changeDispatchConfiguration(data)
        })
        .catch(er => {
          throw er
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.delivery-set-title
  margin-top 30px
  color #333
  font-size 16px
  line-height 35px
  padding-left 21px
  font-weight 500
  background #F3F5F9
.delivery-set-row
  padding 0 20px
  margin-top 20px
.set-title1
  color #000
  font-weight 400
.delivery-set-footer
  text-align center
  margin-top 40px
  margin-bottom 30px
.save-button
  width 80px
</style>
