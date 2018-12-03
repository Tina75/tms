<template>
  <Poptip v-model="visible" trigger="click" width="300" placement="left" transfer word-wrap>
    <FontIcon type="gengduo" class="ios-list-icon" size="20" color="#00A4BD"></FontIcon>
    <div slot="title"><span>选择要显示的字段</span></div>
    <div slot="content">
      <div id="slider-icon__checkbox-list" :style="scrollStyle" class="slider-icon__checkbox-list">
        <CheckboxGroup v-model="checkList">
          <draggable v-model="sortArray" :options="options" :move="checkMove" :style="heightStyle" :class="draggleClass" transfer>
            <Checkbox v-for="item in sortArray" :disabled="item.fixed" :data-key="item.key" :key="item.key" :label="item.title" :class="itemClass(item)">
              <span>{{item.title}}</span>
              <FontIcon v-if="!item.fixed" type="tuodong"></FontIcon>
            </Checkbox>
          </draggable>
        </CheckboxGroup>
      </div>
      <div class="slider-icon__drawer-footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
import draggable from 'vuedraggable'
import browser from '@/libs/js/browser'
import _ from 'lodash'
import FontIcon from '../FontIcon.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    draggable,
    FontIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    onChange: Function
  },
  data () {
    return {
      visible: false,
      checkList: [],
      oldCheckList: [],
      sortData: [],
      oldSortData: [],
      options: {
        group: 'share',
        dragClass: '.slider-icon__draggable-item'
      }
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight']),
    sortArray: {
      get () {
        return _.sortBy(this.sortData, (dt) => dt.sort)
      },
      set (value) {
        this.sortData = value.map((item, index) => {
          item.sort = index
          return item
        })
      }
    },
    scrollStyle () {
      if (this.DocumentHeight < 600) {
        return {
          maxHeight: (this.DocumentHeight - 85) + 'px'
        }
      }
      return ''
    },
    draggleClass () {
      return [
        'slider-icon__draggable-column',
        {
          'slider-icon__draggable-column-ie': browser.ie && browser.ie10Compat
        }
      ]
    },
    // 动态设置高度，可以排序到下一列
    heightStyle () {
      if (browser.ie && browser.ie10Compat) {
        return {
          height: 'auto'
        }
      }
      return {
        height: (Math.ceil(this.sortArray.length / 2) * 32) + 'px'
      }
    }
  },
  watch: {
    list (newList) {
      this.saveList(newList)
    },
    /**
     *  切换路由的时候，关闭
     */
    $route () {
      this.closePoptip()
    }

  },
  mounted () {
    // 重置sort,默认从0开始
    this.saveList(this.list)
  },
  methods: {
    closePoptip () {
      this.visible = false
    },
    /**
     * 固定列，不允许拖动，也不允许被其他项干扰排序位置
     */
    checkMove (evt) {
      const srckey = evt.dragged.getAttribute('data-key')
      const srcItem = this.sortData.find(dt => dt.key === srckey)
      const targetKey = evt.related.getAttribute('data-key')
      const targetItem = this.sortData.find(dt => dt.key === targetKey)
      if (srcItem.fixed || targetItem.fixed) {
        return false
      }
      return true
    },
    itemClass (item) {
      return [
        'slider-icon__checkbox',
        {
          'slider-icon__draggable-item': !item.fixed
        }
      ]
    },
    saveList (list) {
      this.sortData = _.sortBy(list, (st) => st.sort).map((item, index) => ({ ...item, sort: index }))
      this.oldSortData = this.sortData.slice()
      this.checkList = this.sortData.filter(item => item.visible).map(item => item.title)
      this.oldCheckList = this.checkList.slice()
    },
    ok () {
      this.oldCheckList = this.checkList.slice()
      const changedList = this.getChangedList(this.checkList)
      this.$emit('on-change', changedList)
      this.visible = false
    },
    cancel () {
      this.visible = false
      // 还原
      this.checkList = this.oldCheckList.slice()
      this.sortData = this.oldSortData
        .slice()
        .map((item, index) => {
          item.sort = index
          return item
        })
    },
    getChangedList (list) {
      return this.sortData.map((item) => {
        if (list.indexOf(item.title) !== -1) {
          item.visible = true
        } else {
          item.visible = false
        }
        return item
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.slider-icon
  &__checkbox-list
    overflow-y auto
    overflow-x hidden
  &__draggable-column
    width 251px
    padding 0
    margin 0
    display -ms-flexbox
    display -webkit-box
    display flex
    -ms-flex-direction column
    flex-direction column
    -ms-flex-pack start
    -webkit-box-pack start
    justify-content flex-start
    align-items flex-start
    -ms-flex-wrap wrap
    flex-wrap wrap
  &__draggable-column.slider-icon__draggable-column-ie
    -webkit-column-width: 118px
    -moz-column-width: 118px
    column-width: 118px
    -webkit-column-gap: 6px
    -moz-column-gap: 6px
    column-gap: 6px
  &__checkbox
    display: inline-block
    line-height 1
    padding: 8px 0 7px
    width: 118px
    overflow auto
    -webkit-box-flex 0
    -ms-flex 0 0 auto
    flex 0 0 auto
  &__draggable-item
    margin: 0
    position: relative
    &:hover
      background-color #E9FCFF
      .font_family
        display inline
    .font_family
      position: absolute;
      right: 0px;
      top: 4px;
      color: #00A4BD;
      display: none
  &__drawer-footer{
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    text-align: center;
    .ivu-btn:first-child{
      margin-right: 8px
    }
  }
.ios-list-icon {
    cursor: pointer;
  }
</style>
