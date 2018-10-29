<template>
  <div class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">维修信息</span>
      </div>
      <div class="list-info">
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">车牌号：</span>
            {{infoData.carNO}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">维修类别：</span>
            {{infoData.carNO}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">送修日期：</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">送修人：</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">送修公里数：</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">维修费用：</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">已支付费用：</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">未支付费用：</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修单位：</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修原因：</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修结果：</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">备注：</span>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
export default {
  name: 'car-details',
  components: {},
  mixins: [ BasePage ],
  props: {
  },
  data () {
    return {
      infoData: {}
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.infoData = this.$route.query.rowData
    console.dir(this.infoData)
  },
  methods: {
  }
}
</script>
<style lang="stylus" scoped>
@import "client.styl"
</style>
