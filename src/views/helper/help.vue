<template>
  <div class="temAll">
    <Col span="4">
    <Menu :open-names="['1']" style="width: 100%;">
      <Submenu name="1">
        <template slot="title">
          <i class="icon font_family icon-tupian" style="color: #FFBB44; overflow: hidden; width: 20px;"></i>
          图文介绍
        </template>
        <MenuItem v-for="menu in picMenu" :key="menu.id" :name="menu.title" @click.native="clickLeftMenuPic(menu)">
        {{menu.title}}
          </MenuItem>
      </Submenu>
    </Menu>
    <Menu style="width: 100%;">
      <Submenu name="2">
        <template slot="title">
          <i class="icon font_family icon-shipin" style="color: #418DF9; overflow: hidden; width: 20px;"></i>
          视频介绍
        </template>
        <MenuItem v-for="menu in videoMenu" :key="menu.id" :name="menu.title" @click.native="clickLeftMenuVideo(menu)">
        {{menu.title}}
          </MenuItem>
      </Submenu>
    </Menu>
    </Col>
    <Col span="18">
    <Card class="searchCard" dis-hover>
      <p slot="title">{{picContent.title}}</p>
      <div v-if="'pic' === this.type">
        <pre>{{picContent.content}}</pre>
        <img :src="picContent.urlList" class="imgInfo" />
      </div>
      <div v-if="'video' === this.type">
        <video width="100%" height="240" controls>
          <source :src="videoContent.urlList">
          您的浏览器不支持 video 标签。
        </video>
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
      picContent: {},
      videoContent: {},
      type: 'pic'
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
        data.data.forEach(menu => {
          if (menu.type === 1) {
            this.picMenu.push(menu)
          } else if (menu.type === 2) {
            this.videoMenu.push(menu)
          }
        })
        this.picContent = this.picMenu[0]
        console.log(this.picMenu)
      })
    },
    clickLeftMenuPic (menu) {
      this.picContent = Object.assign({}, menu)
      this.type = 'pic'
    },
    clickLeftMenuVideo (menu) {
      this.videoContent = Object.assign({}, menu)
      this.type = 'video'
    }
  }
}

</script>
<style lang='stylus' scoped>
// .ivu-menu-light
//   background: #efefef;
// >>> .ivu-menu-vertical.ivu-menu-light:after,
// .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after,
// .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
//   background: #fff;
.temAll
  width: 100%
  height: -webkit-fill-available
.imgInfo
  max-width: 680px;
</style>
