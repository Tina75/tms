<template>
  <div>
    <!--搜索列表-->
    <div class="query-box">
      <Form :model="queryParams"   label-position="left" inline>
        <Row>
          <Col span="6">
          <FormItem :label-width="65" label="油卡号：">
            <Input v-model="queryParams.number" :maxlength="20" placeholder="请输入主卡号或副卡号"></Input>
          </FormItem>
          </Col>
          <Col offset="3" span="6">
          <FormItem :label-width="65" label="持卡人：">
            <Input v-model="queryParams.driverName" :maxlength="15" placeholder="请输入持卡人"></Input>
          </FormItem>
        </Col>
          <Col offset="3" span="6">
          <FormItem :label-width="65" label="车牌号：">
            <Input v-model="queryParams.truckNo" :maxlength="15" placeholder="请输入车牌号"></Input>
          </FormItem>
        </Col>
        </Row>
        <Row class="item-row">
          <Col span="6">
          <FormItem :label-width="65" label="承运商：">
            <Input v-model="queryParams.carrierName" :maxlength="10" placeholder="请输入承运商"></Input>
          </FormItem>
          </Col>
          <Col span="6">
          <div class="query-btn">
            <Button type="primary">搜索</Button>
            <Button>清除条件</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </div>
    <!--操作按钮-->
    <!--列表展示-->
  </div>
</template>

<script>
export default {
  name: 'oil-list',
  data () {
    return {
      queryParams: {
        number: '',
        driverName: '',
        truckNo: '',
        carrierName: ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../style/common.styl"
</style>
