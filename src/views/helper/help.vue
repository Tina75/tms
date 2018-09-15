<template>
  <div>
    <Col span="5">
    <Menu :open-names="['1']">
      <Submenu name="1">
        <template slot="title">
          <i class="icon font_family icon-tupian" style="background: white; color: #FFBB44;"></i>
          图文介绍
        </template>
        <MenuItem v-for="menu in picMenu" :key="menu.id" :name="menu.title" @click.native="clickLeftMenuPic(menu)">
        {{menu.title}}
        </MenuItem>
      </Submenu>
    </Menu>
    <Menu>
      <Submenu>
        <template slot="title">
          <i class="icon font_family icon-shipin" style="background: white; color: #418DF9;"></i>
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
        <p>{{picContent.content}}</p>
        <p>活动链接<a :href="picContent.url">{{picContent.url}}</a></p>
      </div>
      <div v-else>
        <!-- <p>{{videoContent.content}}</p> -->
        <!-- <p>视频地址:<a :href="videoContent.url" style="margin-left:20px;">{{videoContent.url}}</a></p> -->
        <video :src="videoContent.url" style="width:100%;" controls="controls">
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
        this.picMenu = data.data
        this.videoMenu = data.data
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
</style>
