<template>
  <div>
    <Tabs value="name1">
      <TabPane label="图文介绍" name="name1">
        <Col span="4">
        <Menu :theme="theme">
          <MenuItem name="p1" @click.native="clickLeftMenu('p1')"><span>什么是订单管理?</span></MenuItem>
          <MenuItem name="p2" @click.native="clickLeftMenu('p2')"><span>如何使用订单管理？</span></MenuItem>
          <MenuItem name="p3" @click.native="clickLeftMenu('p3')"><span>什么是财务管理？</span></MenuItem>
          <MenuItem name="p4" @click.native="clickLeftMenu('p4')"><span>如何使用订单管理？</span></MenuItem>
          <MenuItem name="p5" @click.native="clickLeftMenu('p5')"><span>问题。。。？</span></MenuItem>
          <MenuItem name="p6" @click.native="clickLeftMenu('p6')"><span>问题？</span></MenuItem>
        </Menu>
          </Col>
        <Col span="19">
        <div class="showContent">
          <Card v-if="this.showP === 'p1'">
            <p>image</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
          </Card>
          <Card v-else-if="this.showP === 'p2'">
            <p>image</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
          </Card>
        </div>
          </Col>
      </TabPane>
      <TabPane label="视频介绍" name="name2">
        <Col span="4">
        <Menu :theme="theme">
          <MenuItem name="v1" @click.native="clickLeftMenu('v1')"><span>什么是订单管理？</span></MenuItem>
          <MenuItem name="v2" @click.native="clickLeftMenu('v2')"><span>如何使用订单管理？</span></MenuItem>
          <MenuItem name="v3" @click.native="clickLeftMenu('v3')"><span>什么是财务管理？</span></MenuItem>
          <MenuItem name="v4" @click.native="clickLeftMenu('v4')"><span>如何使用订单管理？</span></MenuItem>
          <MenuItem name="v5" @click.native="clickLeftMenu('v5')"><span>问题。。。？</span></MenuItem>
          <MenuItem name="v6" @click.native="clickLeftMenu('v6')"><span>问题？</span></MenuItem>
        </Menu>
          </Col>
        <Col span="19">
        <div class="showContent">
          <Card v-if="this.showP === 'v1'">
            <p>video</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
            <p>11111111111111111111</p>
          </Card>
          <Card v-else-if="this.showP === 'v2'">
            <p>video</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
            <p>22222222222222222222</p>
          </Card>
        </div>
          </Col>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: 'help',
  data () {
    return {
      theme: 'light',
      showP: ''
    }
  },
  mounted: function () {},
  methods: {
    clickLeftMenu (name) {
      this.showP = name
      console.log(this.showP)
    }
  }
}

</script>
<style lang='stylus' scoped>
.ivu-menu-item
  text-align: center;
.showContent
  padding 0 20px;
  margin-left 20px;
</style>
