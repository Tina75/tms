<template>
  <Poptip v-model="visible" trigger="click" width="290" placement="left" word-wrap transfer>
    <FontIcon type="gengduo" class="ios-list-icon" size="18" color="#00A4BD"></FontIcon>
    <div
      v-click-outside:mousedown.capture="closePoptip"
      v-click-outside.capture="closePoptip"
      slot="title"><span>选择要显示的字段</span></div>
    <div slot="content">
      <div class="slider-icon__checkbox-list">
        <CheckboxGroup v-model="checkList">
          <draggable v-model="sortArray" :options="options" :move="checkMove" class="slider-icon__draggable-column">
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
import _ from 'lodash'
import FontIcon from '../FontIcon.vue'
import { directive as clickOutside } from 'v-click-outside-x'
export default {
  components: {
    draggable,
    FontIcon
  },
  directives: {
    clickOutside
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
    }
  },
  watch: {
    list (newList) {
      this.saveList(newList)
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
      const srckey = evt.dragged.dataset.key
      const srcItem = this.sortData.find(dt => dt.key === srckey)
      const targetKey = evt.related.dataset.key
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
    overflow-y: auto
  &__draggable-column
    -webkit-column-width: 116px
    -moz-column-width: 116px
    column-width: 116px
    -webkit-column-gap: 6px
    -moz-column-gap: 6px
    column-gap: 6px

  &__checkbox
    display: inline-block
    padding: 8px 0
    width: 116px
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
