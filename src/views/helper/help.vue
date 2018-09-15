<template>
  <div>
    <Col span="5">
    <Menu :open-names="['1']">
      <Submenu name="1">
        <template slot="title">
          <i class="icon font_family icon-tupian" style="background: white; color: #FFBB44;"></i>
          图文介绍
        </template>
        <!-- <MenuItem name="1-1" @click.native="clickLeftMenu('1-1', '什么是订单管理')">什么是订单管理？</MenuItem>
        <MenuItem name="1-2" @click.native="clickLeftMenu('1-2', '如何使用订单管理？')">如何使用订单管理？</MenuItem>
        <MenuItem name="1-3" @click.native="clickLeftMenu('1-3', '什么是财务管理？')">什么是财务管理？</MenuItem>
        <MenuItem name="1-4" @click.native="clickLeftMenu('1-4', '如何使用订单管理？')">如何使用订单管理？</MenuItem>
        <MenuItem name="1-5" @click.native="clickLeftMenu('1-5', '什么是财务管理？')">什么是财务管理？</MenuItem> -->
        <MenuItem v-for="menu in picMenu" :key="menu.index" :name="menu.title" @click.native="clickLeftMenu(menu.id, menu.title)">
        {{menu.title}}
        </MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <i class="icon font_family icon-shipin" style="background: white; color: #418DF9;"></i>
          视频介绍
        </template>
        <!-- <MenuItem name="2-1" @click.native="clickLeftMenu('2-1', '什么是订单管理')">什么是订单管理</MenuItem>
        <MenuItem name="2-2" @click.native="clickLeftMenu('2-2', '如何使用订单管理？')">如何使用订单管理？</MenuItem>
        <MenuItem name="2-3" @click.native="clickLeftMenu('2-3', '什么是财务管理？')">什么是财务管理？</MenuItem>
        <MenuItem name="2-4" @click.native="clickLeftMenu('2-4', '如何使用订单管理？')">如何使用订单管理？</MenuItem>
        <MenuItem name="2-5" @click.native="clickLeftMenu('2-5', '什么是财务管理？')">什么是财务管理？</MenuItem> -->
        <MenuItem v-for="menu in videoMenu" :key="menu.id" :name="menu.title" @click.native="clickLeftMenu(menu.id, menu.title)">
        {{menu.title}}
        </MenuItem>
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
import Server from '@/libs/js/server'
export default {
  name: 'help',
  mixins: [ BasePage ],
  metaInfo: {
    title: '帮助'
  },
  data () {
    return {
      picMenu: [],
      videoMenu: [],
      helpTitile: '帮助中心',
      helpKey: ''
    }
  },
  mounted: function () {
    this.getMenuList()
  },
  methods: {
    getMenuList () {
      Server({
        url: 'help/list',
        method: 'get'
      }).then(({ data }) => {
        this.picMenu = data.data
        this.videoMenu = data.data
        console.log(this.picMenu)
      })
    },
    clickLeftMenu (key, name) {
      this.helpTitile = name
      this.helpKey = key
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
