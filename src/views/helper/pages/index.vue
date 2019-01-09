<template>
  <div id="help-info" class="helper-info temAll">
    <Row>
      <Col :style="{'min-height':DocumentHeight +'px'}" span="4">
      <Menu ref="menuHelp" :active-name="descover ? descover : picContent.title" :open-names="['1']" style="width: 100%;" class="menuSty" accordion>
        <MenuItem name="0" style="height:50px;line-height:50px" @click.native="clickLeftMenuExplore">
        <i class="icon font_family icon-ico-discovery"></i>
        <div class="title" style="margin-top: -4px">探索运掌柜</div>
        </MenuItem>
        <Submenu name="1">
          <template slot="title">
            <i class="icon font_family icon-tupian"></i>
            <span class="title">图文介绍</span>
          </template>
          <MenuItem
            v-for="menu in picMenu"
            :key="menu.id"
            :name="menu.title"
            class="secondTitle"
            @click.native="clickLeftMenuPic(menu)">
          {{menu.title}}
          </MenuItem>
        </Submenu>
        <!-- <Submenu name="2">
            <template slot="title">
              <i class="icon font_family icon-shipin"></i>
              <span class="title">视频介绍</span>
            </template>
            <MenuItem v-for="menu in videoMenu" :key="menu.id" :name="menu.title" class="secondTitle" @click.native="clickLeftMenuVideo(menu)">
            {{menu.title}}
              </MenuItem>
          </Submenu> -->
      </Menu>
      </Col>
      <Col :style="{'min-height':DocumentHeight +'px'}" span="20" class="contentInfoDiv">
      <Card dis-hover class="contentCard">
        <div v-if="'pic' === this.type">
          <p slot="title" class="rightDivTitle">{{picContent.title}}</p>
          <div class="ql-editor" style="line-height:1.8;width:800px;">
            <div v-html="picContent.content"></div>
          </div>
        </div>
        <!-- <div v-if="'video' === this.type">
          <p slot="title" class="rightDivTitle">{{videoContent.title}}</p>
          <video width="100%" height="240" class="contentCard" controls>
            <source :src="videoContent.urlList">
            您的浏览器不支持 video 标签。
          </video>
      </div> -->
        <div v-if="'descover' === this.type">
          <p slot="title" class="rightDivTitle">探索运掌柜</p>
          <Explore></Explore>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import FontIcon from '@/components/FontIcon'
import Explore from './explore'
import { mapGetters } from 'vuex'

export default {
  name: 'help-center',
  components: {
    FontIcon,
    Explore
  },
  mixins: [BasePage],
  metaInfo: {
    title: '帮助'
  },
  data () {
    return {
      picMenu: [],
      videoMenu: [],
      picContent: {},
      videoContent: {},
      type: 'pic',
      descover: null
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight', 'IsUserLogin'])
  },
  created () {
    if (this.IsUserLogin) {
      this.descover = this.$route.query.descover
      if (this.descover) this.type = 'descover'
      this.getMenuList()
      if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
        document.getElementById('help-info').style.maxHeight = (document.body.clientHeight - 80) + 'px'
      }
    }
  },
  methods: {
    getMenuList () {
      let vm = this
      Server({
        url: 'help/list',
        method: 'get',
        data: { appId: '1' }
      }).then(({ data }) => {
        data.data.forEach(menu => {
          if (menu.type === 1) {
            if (menu.urlList.includes(',')) {
              menu.urlList = menu.urlList.split(',')
            } else {
              menu.urlList = [menu.urlList]
            }
            vm.picMenu.push(menu)
          } else if (menu.type === 2) {
            vm.videoMenu.push(menu)
          }
          vm.picContent = vm.picMenu[0]
        })
      }).then(() => {
        vm.$nextTick(() => {
          vm.$refs.menuHelp.updateActiveName()
        })
      })
    },
    picImagList () {
      for (let index = 0; index < this.picMenu.length; index++) {
        if (this.picMenu[index].urlList.includes(',')) {
          this.picMenu[index].urlList = this.picMenu[index].urlList.split(',')
        } else {
          this.picMenu[index].urlList = [this.picMenu[index].urlList]
        }
      }
    },
    clickLeftMenuPic (menu) {
      this.picContent = Object.assign({}, menu)
      this.type = 'pic'
    },
    // clickLeftMenuVideo (menu) {
    //   this.videoContent = Object.assign({}, menu)
    //   this.type = 'video'
    // },
    // 探索运掌柜
    clickLeftMenuExplore () {
      this.type = 'descover'
    }
  }
}

</script>
<style lang='stylus' scoped>
  .help-info
    overflow: auto;

  >>> .ivu-menu-vertical.ivu-menu-light:after
    background: #fff;
    height: 30px;

  >>> .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    background: #fff;
    color: #00A4BD;
    height: 30px;
    font-weight: bold;

  >>> .ivu-card-bordered
    border: none;

  >>> .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title
    height: 30px;
    padding-top: 6px;

  .temAll
    width: 100%
    height: 100%;
    background: rgba(243, 245, 249, 1);
    overflow: auto;
    margin: -20px -15px;
    .title
      font-size: 16px;
      font-weight: bold;
      color: #333333
    .secondTitle
      font-size: 14px;
      color: #555555;
      font-weight: 400;
    .rightDivTitle
      font-size: 16px;
      color: #333333
      margin-bottom: 25px;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 15px;
      margin-top: 20px;
      margin-right: 20px;
      line-height: 22px;
      font-weight: bold;
    .preText
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      font-weight: 400;
      margin-bottom: 30px;

  .imgInfo
    max-width: 680px;

  .menuSty
    background: rgba(243, 245, 249, 1);
    color: #333;

  .icon-tupian
    color: #FFBB44;
    overflow: hidden;
    width: 20px;
    font-size: 19px;

  .icon-ico-discovery
    color #00A4BD
    overflow hidden;
    width 20px;
    font-size 19px;
    margin-top: -8px

  .icon-shipin
    color: #418DF9;
    overflow: hidden;
    width: 20px;
    font-size: 19px;

  .contentInfoDiv
    background: #fff;
    padding-left: 20px;
    height: 100%;
    overflow: auto;

  .contentCard
    margin-top: -20px;
</style>
