<template>
  <div class="search-form">
    <Form ref="formInline" :model="formInline" inline>
      <Row type="flex">
        <Col span="6">
        <FormItem :label-width="65" label="发货方：">
          <Input v-model="formInline.sender" :maxlength="20" placeholder="请输入发货方名称"></Input>
        </FormItem>
      </Col>
        <Col span="6">
        <FormItem  :label-width="65" label="订单号：">
          <Input v-model="formInline.orderNo" :maxlength="30" placeholder="请输入订单号"></Input>
        </FormItem>
      </Col>
        <Col span="7">
        <FormItem >
          <Select value="1">
            <Option value="1">下单时间</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="formInline.daterange" :options="dateOption" type="daterange" format="yyyy-MM-dd" placeholder="开始时间-结束时间"></DatePicker>
        </FormItem>
      </Col>
        <Col span="4">
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
  data () {
    return {
      formInline: {
        sender: '',
        orderNo: '',
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
</style>
