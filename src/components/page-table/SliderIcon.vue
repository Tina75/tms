<template>
  <Poptip v-model="visible" trigger="click" width="290" placement="bottom-end" word-wrap transfer>
    <Icon type="ios-list" class="ios-list-icon"></Icon>
    <div slot="title"><span>选择要显示的字段</span></div>
    <div slot="content">
      <CheckboxGroup v-model="checkList">
        <Checkbox v-for="item in list" :disabled="item.fixed" :key="item.key" :label="item.title" class="slider-icon__checkbox-list"></Checkbox>
      </CheckboxGroup>
      <div class="slider-icon__drawer-footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
export default {
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
      oldList: []
    }
  },
  watch: {
    // list (newList) {
    //   this.saveList(newList)
    // }
  },
  mounted () {
    this.saveList(this.list)
  },
  methods: {
    saveList (list) {
      this.checkList = this.list.filter(item => item.visible).map(item => item.title)
      this.oldList = this.checkList.slice()
    },
    ok () {
      this.oldList = this.checkList.slice()
      const changedList = this.getChangedList(this.checkList)
      this.$emit('on-change', changedList)
      this.visible = false
    },
    cancel () {
      this.visible = false
      // 还原
      this.checkList = this.oldList.slice()
    },
    getChangedList (list) {
      let newList = []
      this.list.forEach(item => {
        let _item = {}
        if (list.indexOf(item.title) !== -1) {
          Object.assign(_item, item, {visible: true})
        } else {
          Object.assign(_item, item, {visible: false})
        }
        newList.push(_item)
      })
      return newList
    }
  }
}
</script>

<style lang="stylus">
.slider-icon
  &__checkbox-list{
    display: block
    margin: 12px 0
  }
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
    font-size: 18px;
    cursor: pointer;

    &:hover {
      color: #2d8cf0;
    }
  }
</style>
