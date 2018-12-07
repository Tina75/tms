<template>
  <div class="search-form">
    <Form ref="formInline" :model="formInline">
      <Row :gutter="12">
        <Col span="6">
        <FormItem :label-width="60" label="发货方：" prop="partnerName">
          <Input v-model="formInline.partnerName" :maxlength="20" placeholder="请输入发货方名称"></Input>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem  :label-width="60" label="订单号：" prop="orderNo">
          <Input v-model="formInline.orderNo" :maxlength="30" placeholder="请输入订单号"></Input>
        </FormItem>
        </Col>
        <Col v-if="scene === '1'" span="7">
        <FormItem :label-width="75" label="下单日期：" prop="daterange">
          <DatePicker v-model="formInline.daterange" :options="dateOption" transfer type="daterange" format="yyyy-MM-dd" placeholder="开始时间-结束时间" style="width:100%"></DatePicker>
        </FormItem>
        </Col>
        <Col v-if="scene === '2'" span="7" class="van-right">
        <Row :gutter="12">
          <Col span="10" offset="0">
          <FormItem prop="dayType">
            <Select v-model="formInline.dayType" transfer style="width:120px" class="van-left">
              <Option :value="1">收款日期</Option>
              <Option :value="2">付款日期</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="14">
          <FormItem  prop="daterange">
            <DatePicker v-model="formInline.daterange" :options="dateOption" transfer type="daterange" format="yyyy-MM-dd" placeholder="开始时间-结束时间" style="width:100%"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        </Col>
        <Col span="5">
        <FormItem>
          <Button type="primary" style="margin-right: 10px" @click="handleSearch">搜索</Button>
          <Button type="default" @click="resetForm">清除条件</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
export default {
  props: {
    scene: {
      type: String,
      default: '1' // 1.未收，已收未付，2.已付款
    }
  },
  data () {
    return {
      formInline: {
        partnerName: '',
        orderNo: '',
        daterange: [],
        dayType: 2
      },
      /**
     * 日期条件
     */
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  methods: {
    /**
     * 搜索
     */
    handleSearch () {
      console.log('form', this.formInline)
      let params = {
        partnerName: this.formInline.partnerName || void 0,
        orderNo: this.formInline.orderNo || void 0,
        startTime: this.formInline.daterange[0] ? this.formInline.daterange[0].valueOf() : void 0,
        endTime: this.formInline.daterange[1] ? this.formInline.daterange[1].valueOf() + 86400000 : void 0
      }
      if (this.scene === '2') {
        params.dayType = this.formInline.dayType
      }
      this.$emit('on-search', params)
    },
    /**
     * 充值表单
     */
    resetForm () {
      this.$refs.formInline.resetFields()
      this.handleSearch()
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-form
  padding 20px 10px
  margin-bottom 20px
  background-color #f9f9f9
  .ivu-form-item
    margin-bottom: 0
  .ivu-btn
    width 86px
</style>
