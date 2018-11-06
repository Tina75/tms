<template>
  <div class="except-record">
    <div class="except-record-title">
      <span>
        上报信息 第一笔 【已处理】
      </span>
      <span>记录号：YC2018110123478</span>
      <div class="except-record-btn-group">
        <Button type="default" style="margin: 0 10px">处理</Button>
        <Button type="primary" @click="clickHandle">编辑</Button>
        <div class="detail-log-icon" @click="hideDetail = !hideDetail">
          <i class="detail-log-show"></i>
        </div>
      </div>
    </div>
    <div class="except-record-list">
      <Row class="mgbt20">
        <i-col span="6">
          <label class="label-bar">异常环节：</label>
          <span>装货环节</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">异常类型：</label>
          <span>少货</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">上报时间：</label>
          <span>2018-06-26 09:00</span>
        </i-col>
        <i-col span="6">
          <label class="label-bar">处理时间：</label>
          <span>-</span>
        </i-col>
      </Row>
      <div :class="{'except-record-list-hide': hideDetail}">
        <Row class="mgbt20">
          <i-col span="24">
            <label class="label-bar">异常描述：</label>
            <span>少货</span>
          </i-col>
        </Row>
        <Row class="mgbt20">
          <i-col span="24">
            <label class="label-bar">图片：</label>
            <span class="img-bar">
              <img src="../../../assets/logo.png" alt="">
            </span>
            <span class="img-bar">
              <img src="../../../assets/logo.png" alt="">
            </span>
          </i-col>
        </Row>
        <Row class="mgbt20">
          <i-col span="12" style="display: flex">
            <label class="label-bar">修改前运费：</label>
            <div class="flex-bar">
              <Row>
                <i-col span="6">
                  <label>运输费：</label>
                  <span>700元</span>
                </i-col>
                <i-col span="6">
                  <label>装货费：</label>
                  <span>200元</span>
                </i-col>
                <i-col span="6">
                  <label>卸货费：</label>
                  <span>0元</span>
                </i-col>
                <i-col span="6">
                  <label>保险费：</label>
                  <span>0元</span>
                </i-col>
                <i-col span="6">
                  <label>其他：</label>
                  <span>0元</span>
                </i-col>
              </Row>
              <Table
                :columns="columns"
                :data="tableData"></Table>
            </div>
          </i-col>
          <i-col span="12" style="display: flex">
            <label>修改后运费：</label>
            <div class="flex-bar">
              <Row>
                <i-col span="6">
                  <label>运输费：</label>
                  <span>700元</span>
                </i-col>
                <i-col span="6">
                  <label>装货费：</label>
                  <span>200元</span>
                </i-col>
                <i-col span="6">
                  <label>卸货费：</label>
                  <span>0元</span>
                </i-col>
                <i-col span="6">
                  <label>保险费：</label>
                  <span>0元</span>
                </i-col>
                <i-col span="6">
                  <label>其他：</label>
                  <span>0元</span>
                </i-col>
              </Row>
              <Table
                :columns="columns"
                :data="tableData"></Table>
            </div>
          </i-col>
        </Row>
        <Row class="mgbt20">
          <i-col span="24">
            <label>处理备注：</label>
            <span>运费已扣</span>
          </i-col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'except-record',
  data () {
    return {
      hideDetail: false,
      columns: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      tableData: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No.',
          date: '2016-10-01'
        }
      ]
    }
  },
  methods: {
    // 处理对话框
    clickHandle (e) {
      console.log(e)
    },
    // 编辑对话框
    editBtn (e) {
      console.log(e)
    }
  }
}
</script>
<style lang="stylus" scoped>
.except-record
  margin-bottom 20px
  margin-left 1px
  border 1px solid #d4d5dc
  &-title
    padding 16px 20px 16px 20px
    font-size 16px
    color #333
    background #f8f8f8
    span
      line-height 30px
  &-btn-group
    float right
  .detail-log-icon
    display inline-block
    vertical-align middle
    margin 0 0 0 20px
  &-list
    font-size 14px
    line-height 20px
    padding 10px 20px
    border-top 1px solid #d4d5dc
    &-hide
      display none
  .img-bar
    display inline-block
    width 160px
    height 90px
    margin 0 10px
    overflow hidden
    vertical-align: top;
    img
      display block
      width 100%
      height 100%
  .label-bar
    display inline-block
    width 84px
  .flex-bar
    display inline-block
    flex 1
    .ivu-col
      margin-bottom  10px
  .mgbt20
    margin-top 10px
    margin-bottom  10px
</style>
