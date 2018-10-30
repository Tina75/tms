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
            {{infoData.carNo}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">维修类别：</span>
            {{infoData.repairType}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">送修日期：</span>
            {{infoData.repairDate}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">送修人：</span>
            {{infoData.repairPerson}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">送修公里数：</span>
            {{infoData.repairMile}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">维修费用：</span>
            {{infoData.repairMoney}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">已支付费用：</span>
            {{infoData.payMoney}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">未支付费用：</span>
            {{infoData.waitPayMoney}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修单位：</span>
            {{infoData.repairUnit}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修原因：</span>
            {{infoData.repairReason}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修结果：</span>
            {{infoData.repairResult}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">备注：</span>
            {{infoData.remark}}
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
