<template>
  <div>
    <div class="search">
      <div class="search-list">
        <ButtonGroup>
          <Button v-for="(item,index) in btnGroup" :key="index" :type="item.value===operateValue?'primary':'default'" @click="handleOperaterValue(item)">{{item.name}}</Button>
        </ButtonGroup>
        <DatePicker
          v-model="time"
          type="daterange"
          format="yyyy-MM-dd"
          placeholder="开始日期-结束日期"
          style="display: inline-block;width: 240px;height: 35px;margin-left: 20px"
        >
        </DatePicker>
        <Tooltip max-width="200" content="营业额汇总报表：按照订单的下单日期提取数据；利润报表：按照订单、运单、提货单、外转单的下单日期提取数据。">
          <Icon type="ios-alert" style="font-size: 20px;color: #FFBB44;margin-left: 18px" />
        </Tooltip>
      </div>
      <div class="search-btn">
        <Button type="primary">搜索</Button>
        <Button style="margin-left: 8px">清除条件</Button>
      </div>
    </div>
    <div style="margin: 18px 0 12px 0">
      <Button type="primary">导出</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'total',
  components: {
  },
  data: function () {
    return {
      btnGroup: [
        { name: '近七天', value: 1 },
        { name: '本月', value: 2 },
        { name: '本季度', value: 3 },
        { name: '半年', value: 4 }
      ],
      operateValue: 2,
      time: ''
    }
  },
  methods: {
    handleOperaterValue (btn) {
      this.operateValue = btn.value
    }
  }
}
</script>

<style scoped lang="stylus">
  button
    width 86px
    height 35px
  .search
    display flex
    justify-content space-between
    background #F9F9F9
    padding 13px
    .search-list
      button
        width 80px
</style>
