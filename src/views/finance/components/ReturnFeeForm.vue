<template>
  <div class="search-form">
    <Form ref="formInline" :model="formInline">
      <Row :gutter="16">
        <Col span="6">
        <FormItem :label-width="101" label="外转方/承运商：" prop="partnerName">
          <Input v-model="formInline.partnerName" :maxlength="20" placeholder="请输入发货方名称"></Input>
        </FormItem>
        </Col>
        <Col v-if="scene==='2'" span="6">
        <FormItem  :label-width="65" label="单据号：" prop="orderNo">
          <Input v-model="formInline.orderNo" :maxlength="30" placeholder="请输入订单号"></Input>
        </FormItem>
        </Col>
        <Col v-if="scene==='1'" span="8">
        <Row >
          <Col span="9" offset="0">
          <FormItem prop="dayType">
            <Select v-model="formInline.dayType" style="width:120px">
              <Option :value="1">下单日期</Option>
              <Option :value="2">到货日期</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="13">
          <FormItem  prop="daterange">
            <DatePicker v-model="formInline.daterange" :options="dateOption" type="daterange" format="yyyy-MM-dd" placeholder="开始时间-结束时间" style="width:100%"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        </Col>
        <Col v-if="scene==='2'" span="7">
        <FormItem :label-width="75" label="核销日期：" prop="daterange">
          <DatePicker v-model="formInline.daterange" :options="dateOption" type="daterange" format="yyyy-MM-dd" placeholder="开始时间-结束时间" style="width:100%"></DatePicker>
        </FormItem>
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
/**
 * 返现运费表单
 * scene: 1.待核销， 2.已核销
 */
export default {
  props: {
    scene: {
      type: String,
      default: '1'
    },
    onSearch: Function
  },
  data () {
    return {
      formInline: {
        partnerName: '',
        orderNo: '',
        dayType: 1,
        daterange: []
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
        partnerName: this.formInline.partnerName || void 0, // 外转方/承运商名字
        orderNo: this.formInline.orderNo || void 0, // 单据号
        dayType: this.formInline.dayType, // 下单时间/到货时间
        startTime: this.formInline.daterange[0] ? this.formInline.daterange[0].valueOf() : void 0,
        endTime: this.formInline.daterange[1] ? this.formInline.daterange[1].valueOf() : void 0
      }

      if (this.scene === '1') {
        delete params['orderNo']
      } else {
        delete params['dayType']
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
  padding 20px 15px
  margin-bottom 20px
  background-color #f9f9f9
  .ivu-form-item
    margin-bottom: 0
  .ivu-btn
    width 86px
</style>
