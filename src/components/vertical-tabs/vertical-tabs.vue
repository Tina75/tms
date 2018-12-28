<template>
  <div class="vertical-tabs">
    <Row type="flex">
      <Col :style="styleHeight" class="vertical-tabs__menu" span="4">
      <template v-for="(tab, index) in tabList" >
        <div :key="index" :class="itemClass(tab)" @click.prevent="handleSelect(tab)">
          <FontIcon v-if="!!tab.icon" v-bind.sync="tab.icon" size="19" class="vertical-tabs__menu-icon"></FontIcon>
          {{tab.label}}
        </div>
      </template>
      </Col>
      <Col span="20">
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
  },
  methods: {
    itemClass (item) {
      return [
        'vertical-tabs__menu-item',
        item.name === this.activeKey ? 'vertical-tabs__menu-item-active' : ''
      ]
    },
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
          name: pane.name || index // 名字或索引
        })
        if (index === 0) {
          if (!this.activeKey) this.activeKey = pane.name || index
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
    handleSelect (item) {
      this.activeKey = item.name
    }
  }
}
</script>

<style lang="stylus" scoped>
.vertical-tabs
  margin -20px -15px
  &__menu
    height auto
    background-color #f3f5f9
  &__menu-item
    padding: 14px 8px;
    text-align center
    position relative
    cursor pointer
    z-index 1
    -webkit-transition all .2s ease-in-out
    transition all .2s ease-in-out
    font-size 16px
  &__menu-item-active
    background-color #fff
  &__menu-icon
    position absolute
    left 20px
    top 12px
  &__content
    padding-left 20px
    background-color #fff
    position relative
</style>
