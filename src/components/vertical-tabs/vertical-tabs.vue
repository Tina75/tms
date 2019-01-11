<template>
  <div class="vertical-tabs">
    <Row type="flex">
      <Col :style="styleHeight" class="vertical-tabs__menu" span="4">
      <Menu ref="menu" :active-name="activeKey" width="160" @on-select="handleSelect">
        <template v-for="(tab, index) in tabList" >
          <MenuItem :key="index" :name="tab.name" class="vertical-tabs__menu-item">
          <FontIcon v-if="!!tab.icon" :key="index" v-bind.sync="tab.icon" size="19" class="vertical-tabs__menu-icon"></FontIcon>
          {{tab.label}}
            </MenuItem>
        </template>
      </Menu>
      </Col>
      <Col span="20" class="vertical-tabs__content-wrapper">
      <div class="vertical-tabs__content">
        <slot></slot>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FontIcon from '@/components/FontIcon'
export default {
  name: 'vertical-tabs',
  components: {
    FontIcon
  },
  props: {
    value: {
      type: [String, Number]
    },
    onSelect: {
      type: Function
    }
  },
  data () {
    return {
      activeKey: this.value,
      children: [],
      tabList: []
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight']),
    styleHeight () {
      return {
        height: this.DocumentHeight + 'px'
      }
    }
  },
  watch: {
    activeKey (key) {
      this.updateVisibility(this.getTabIndex(this.activeKey))
    }
  },
  mounted () {
    this.updateVisibility(this.getTabIndex(this.activeKey))
    this.$nextTick(() => {
      this.$refs.menu.updateActiveName()
    })
  },
  methods: {
    getTabs () {
      return this.children
    },
    getTabIndex (name) {
      return this.tabList.findIndex(nav => nav.name === name)
    },
    updateTabs (tabItem) {
      this.children.push(tabItem)
      this.tabList = []
      this.getTabs().forEach((pane, index) => {
        this.tabList.push({
          labelType: typeof pane.label,
          label: pane.label,
          icon: pane.icon || '',
          name: pane.name || index.toString() // 名字或索引
        })
        if (index === 0) {
          if (!this.activeKey) this.activeKey = pane.name || index.toString()
        }
      })
    },
    updateVisibility (index) {
      this.getTabs().forEach((el, i) => {
        if (i === index) {
          el.fadeIn()
        } else {
          el.fadeOut()
        }
      })
    },
    handleSelect (name) {
      this.activeKey = name
      let currentTab = this.tabList.find((tab) => tab.name === name)
      this.$emit('on-select', { ...currentTab })
    }
  }
}
</script>

<style lang="stylus" scoped>
.vertical-tabs
  &__menu
    height auto
    flex 0 0 160px
    background-color #f3f5f9
  &__menu-item
    padding: 14px 8px;
    text-align center
    background-color #f3f5f9
    font-size 16px
  &__menu-item-active
    background-color #fff
  &__menu-icon
    position absolute
    left 20px
    top 12px
  &__content-wrapper
    flex 1
  &__content
    padding-left 20px
    background-color #fff
    position relative
    height 100%
    overflow auto
  >>> .ivu-menu-light.ivu-menu-vertical
        .ivu-menu-item-active:not(.ivu-menu-submenu)
          color #333
          font-weight bold
          background-color #fff
        &:after
          background-color transparent
</style>
