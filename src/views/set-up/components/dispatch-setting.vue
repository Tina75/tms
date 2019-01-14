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
    <Row :gutter="16" class="delivery-set-row">
      <Col span="2" class="set-title1" offset="1">自送：</Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickSelfOilFeeOption">油费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickSelfLoadFeeOption">装货费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickSelfUnloadFeeOption">卸货费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickSelfInsuranceFeeOption">保险费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickSelfOtherFeeOption">其他</Checkbox>
      </Col>
    </Row>
    <Row :gutter="16" class="delivery-set-row">
      <Col span="2" class="set-title1" offset="1">外转：</Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickOutFreightFeeOption">运输费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickOutLoadFeeOption">装货费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickOutUnloadFeeOption">卸货费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickOutInsuranceFeeOption">保险费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.pickOutOtherFeeOption">其他</Checkbox>
      </Col>
    </Row>
    <Row :gutter="16"  class="set-title1 i-mt-40 i-pl-20">
      <Col span="4">
      送货费用
      </Col>
    </Row>
    <Row :gutter="16" class="delivery-set-row">
      <Col span="2" class="set-title1" offset="1">自送：</Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverSelfOilFeeOption">油费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverSelfLoadFeeOption">装货费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverSelfUnloadFeeOption">卸货费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverSelfTollFeeOption">路桥费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverSelfAccommodationFeeOption">住宿费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverSelfInsuranceFeeOption">保险费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverSelfOtherFeeOption">其他</Checkbox>
      </Col>
    </Row>
    <Row :gutter="16" class="delivery-set-row">
      <Col span="2" class="set-title1" offset="1">外转：</Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverOutFreightFeeOption">运输费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverOutLoadFeeOption">装货费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverOutUnloadFeeOption">卸货费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverOutTollFeeOption">路桥费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverOutInsuranceFeeOption">保险费</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverOutOtherFeeOption">其他</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverOutInfoFeeOption">信息费</Checkbox>
      </Col>
    </Row>
    <Row :gutter="16" class="delivery-set-row">
      <Col span="2" offset="1">&nbsp;</Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.deliverOutCashBackFeeOption">返现费</Checkbox>
      </Col>
    </Row>
    <p class="delivery-set-title">付款方式</p>
    <Row :gutter="16" class="delivery-set-row">
      <Col span="3" class="set-title1">
      送货外转：
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.paySettlementAdvanceOption">预付</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.paySettlementArriveOption">到付</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.paySettlementReceiptOption">回付</Checkbox>
      </Col>
      <Col span="3">
      <Checkbox :true-value="1" :false-value="2" v-model="form.paySettlementTailOption">尾款</Checkbox>
      </Col>
    </Row>
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

import { defaultDispatchState as DELIVERY_SET } from '@/store/index'
export default {
  name: 'delivery-setting',
  data () {
    return {
      form: {
        ...DELIVERY_SET
      }
    }
  },
  computed: {
    ...mapGetters(['DispatchSet'])
  },
  mounted () {
    const store = this.DispatchSet
    for (let i in store) {
      this.form[i] = store[i]
    }
  },
  methods: {
    ...mapMutations(['changeDispatchConfiguration']),
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
