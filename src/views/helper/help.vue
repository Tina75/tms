<template>
  <div>
    <Col span="5">
    <Menu :open-names="['1']">
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-image" />
          图文介绍
        </template>
        <MenuItem name="1-1" @click.native="clickLeftMenu('1-1', '什么是订单管理')">什么是订单管理？</MenuItem>
        <MenuItem name="1-2" @click.native="clickLeftMenu('1-2', '如何使用订单管理？')">如何使用订单管理？</MenuItem>
        <MenuItem name="1-3" @click.native="clickLeftMenu('1-3', '什么是财务管理？')">什么是财务管理？</MenuItem>
        <MenuItem name="1-4" @click.native="clickLeftMenu('1-4', '如何使用订单管理？')">如何使用订单管理？</MenuItem>
        <MenuItem name="1-5" @click.native="clickLeftMenu('1-5', '什么是财务管理？')">什么是财务管理？</MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-paper" />
          视频介绍
        </template>
        <MenuItem name="2-1" @click.native="clickLeftMenu('2-1', '什么是订单管理')">什么是订单管理</MenuItem>
        <MenuItem name="2-2" @click.native="clickLeftMenu('2-2', '如何使用订单管理？')">如何使用订单管理？</MenuItem>
        <MenuItem name="2-3" @click.native="clickLeftMenu('2-3', '什么是财务管理？')">什么是财务管理？</MenuItem>
        <MenuItem name="2-4" @click.native="clickLeftMenu('2-4', '如何使用订单管理？')">如何使用订单管理？</MenuItem>
        <MenuItem name="2-5" @click.native="clickLeftMenu('2-5', '什么是财务管理？')">什么是财务管理？</MenuItem>
      </Submenu>
    </Menu>
    </Col>
    <Col span="18">
    <Card class="searchCard" dis-hover>
      <p slot="title">{{helpTitile}}</p>
      <div v-if="'1-1' === this.helpKey">
        <p>image</p>
        <p>11111111111111111111</p>
        <p>11111111111111111111</p>
        <p>11111111111111111111</p>
        <p>11111111111111111111</p>
        <p>11111111111111111111</p>
        <p>11111111111111111111</p>
        <p>11111111111111111111</p>
      </div>
      <div v-else-if="'1-2' === this.helpKey">
        <p>image</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
      </div>
      <div v-else>
        <p>image</p>
        <p>2333333333333333</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
        <p>22222222222222222222</p>
      </div>
    </Card>
    </Col>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
export default {
  name: 'help',
  mixins: [ BasePage ],
  metaInfo: {
    title: '帮助'
  },
  data () {
    return {
      helpTitile: '帮助中心',
      helpKey: ''
    }
  },
  mounted: function () {},
  methods: {
    clickLeftMenu (key, name) {
      this.helpTitile = name
      this.helpKey = key
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
