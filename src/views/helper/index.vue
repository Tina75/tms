<template>
  <div class="temAll">
    <Col span="4">
    <Menu :open-names="['1']" style="width: 100%; background:rgba(243,245,249,1)" accordion>
      <Submenu name="1">
        <template slot="title">
          <i class="icon font_family icon-tupian" style="color: #FFBB44; overflow: hidden; width: 20px;"></i>
          <span style="font-size:16px;">图文介绍</span>
        </template>
        <MenuItem v-for="menu in picMenu" :key="menu.id" :name="menu.title" style="font-size:14px;" @click.native="clickLeftMenuPic(menu)">
        {{menu.title}}
          </MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <i class="icon font_family icon-shipin" style="color: #418DF9; overflow: hidden; width: 20px;"></i>
          <span style="font-size:16px;">视频介绍</span>
        </template>
        <MenuItem v-for="menu in videoMenu" :key="menu.id" :name="menu.title" style="font-size:14px;" @click.native="clickLeftMenuVideo(menu)">
        {{menu.title}}
          </MenuItem>
      </Submenu>
    </Menu>
    </Col>
    <Col span="20" style="background:#fff; padding-left: 20px;">
    <Card class="searchCard" dis-hover>
      <p slot="title" style="font-size:16px; color:rgba(51,51,51,1);">{{picContent.title}}</p>
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
>>> .ivu-menu-vertical.ivu-menu-light:after
  background: #fff;
>>> .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    background: #fff;
    color: #515a6e;
>>> .ivu-card-bordered
   border: none;
.temAll
  width: 100%
  height: 100%;
  background:rgba(243,245,249,1);
  overflow: auto;
.imgInfo
  max-width: 680px;
</style>
