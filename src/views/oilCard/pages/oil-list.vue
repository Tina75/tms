<template>
  <div>
    <!--搜索列表-->
    <template>
      <Form :model="queryParams"  label-position="left" inline>
        <Row>
          <Col span="8">
          <FormItem :label-width="65" label="油卡号：">
            <Input placeholder="请输入主卡号或副卡号" maxlength="19"></Input>
          </FormItem>
        </Col>
          <Col span="8">
          <FormItem label="持卡人：">
            <Input placeholder="请输入持卡人" maxlength="15"></Input>
          </FormItem>
        </Col>
          <Col span="8">
          <FormItem label="车牌号：">
            <Input placeholder="请输入车牌号" maxlength="15"></Input>
          </FormItem>
        </Col>
        </Row>
        <Row>
          <Col span="8">
          <FormItem label="承运商：">
            <Input placeholder="请输入承运商" maxlength="15"></Input>
          </FormItem>
        </Col>
          <div>
            <Button type="primary">搜索</Button>
            <Button>清除条件</Button>
          </div>
        </Row>
      </Form>
    </template>
    <!--操作按钮-->
    <!--列表展示-->
  </div>
</template>

<script>
export default {
  name: 'oil-list',
  data () {
    return {
      queryParams: {}
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
