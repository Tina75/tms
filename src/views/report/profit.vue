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
    <div class="table">
      <div class="title">
        <ul class="list">
          <li>方向</li>
          <li>来源</li>
          <li>费用明细</li>
          <li>本期发生额</li>
        </ul>
      </div>
      <div class="items">
        <div class="item">收入</div>
        <div class="item">上游运费收入</div>
        <div class="item" style="flex: 2">
          <div class="item-inner">
            <div>运输费</div>
            <div>10</div>
          </div>
          <div class="item-inner">
            <div>装货费</div>
            <div>10</div>
          </div>
          <div class="item-inner">
            <div>卸货费</div>
            <div>10</div>
          </div>
          <div class="item-inner">
            <div>保险费</div>
            <div>10</div>
          </div>
          <div class="item-inner">
            <div>其他费用</div>
            <div>10</div>
          </div>
        </div>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%; ">
        <span>主营业务收入合计</span>
        <span class="num">79582</span>
      </div>
      <div class="items">
        <div class="item">支出</div>
        <div class="item">承运商运费支出</div>
        <div class="item" style="flex: 2">
          <div class="item-inner">
            <div>运输费</div>
            <div>10</div>
          </div>
          <div class="item-inner">
            <div>装货费</div>
            <div>10</div>
          </div>
          <div class="item-inner">
            <div>卸货费</div>
            <div>10</div>
          </div>
          <div class="item-inner">
            <div>保险费</div>
            <div>10</div>
          </div>
          <div class="item-inner">
            <div>其他费用</div>
            <div>10</div>
          </div>
        </div>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%">
        <span>主营业务支出合计</span>
        <span class="num">79582</span>
      </div>
      <div class="title" style="text-align: right;padding-right: 10%">
        <span>利润</span>
        <span class="num">79582</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'profit',
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
  .table
    border 1px solid #C9CED9
    text-align center
    font-size 14px
    color #333
    .title
      height 45px
      line-height 45px
      background #F8F8F8
      border-bottom:1px solid #C9CED9
      &:last-child
        border-bottom none
      .list
        display flex
        li
          list-style none
          flex 1
          text-align center
      .num
        color #00A4BD
        margin-left 20px
        font-weight 500
    .items
      display flex
      .item
        flex 1
        height 224px
        line-height 224px
        border-right  1px solid #C9CED9
        border-bottom 1px solid #C9CED9
        &:last-child
          border-right none
        .item-inner
          display flex
          height 45px
          line-height 45px
          border-bottom   1px solid #C9CED9
          &:last-child
            border-bottom  none
          div
            flex 1
</style>
