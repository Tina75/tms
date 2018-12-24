<template>
  <div class="order-set">
    <p class="order-set-title">收货人</p>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.consigneeCompanyNameOption">收货人单位</Checkbox>
      </Col>
    </Row>
    <p class="order-set-title">收货人</p>
    <Row :gutter="16" class="order-set-row">
      <Col span="4">
      <Checkbox v-model="form.cargoNoOption">货物编号</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.quantityOption">包装数量</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.weightTonOption">重量（吨）</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.weightKgOption">重量（公斤）</Checkbox>
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
      <Checkbox v-model="form.cargoRemark1Option">备注1</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.cargoRemark2Option">备注2</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.cargoRemark3Option">备注3</Checkbox>
      </Col>
      <Col span="4">
      <Checkbox v-model="form.cargoRemark4Option">备注4</Checkbox>
      </Col>
    </Row>
    <p class="order-set-title">应收费用</p>
    <Row :gutter="16" class="order-set-row">
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
      <Col span="4">
      <Checkbox v-model="form.otherFeeOption">其他费用</Checkbox>
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
  cargoRemark1Option: true,
  cargoRemark2Option: true,
  cargoRemark3Option: false,
  cargoRemark4Option: false,
  // 提货费
  pickupFeeOption: true,
  // 装货费
  loadFeeOption: true,
  // 卸货费
  unloadFeeOption: true,
  // 保险费
  insuranceFeeOption: true,
  // 其他费用
  otherFeeOption: true
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
    ...mapGetters(['WeightOption'])
  },
  mounted () {
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
        url: 'order/config/insertOrUpdate',
        method: 'post',
        data: obj
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
