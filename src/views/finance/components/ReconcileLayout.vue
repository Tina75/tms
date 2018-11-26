<template>
  <div class="reconcile-layout">
    <Row type="flex">
      <Col v-show="!isEmptyList" span="6" class="reconcile-layout__flex-left">
      <slot>
        <!-- 左侧列表区域 -->
      </slot>
      <div class="reconcile-layout__flex-divider"></div>
      </Col>
      <Col span="17" class="reconcile-layout__flex-right">
      <Row v-show="showTable" class="reconcile-layout__operation">
        <Col span="12">
        <slot name="title">
          <!-- 标题 -->
          <span class="reconcile-layout__view-title">{{title || '&nbsp;'}}</span>
        </slot>
      </Col>
        <Col span="12 van-right">
        <!-- 按钮区，核单，生成对账单 -->
        <slot name="operation">
          <Button type="primary">收款核销</Button>
        </slot>
      </Col>
      </Row>
      <div class="i-mt-20">
        <data-empty v-show="!showTable && !isEmptyList">
          {{emptyContent}}
        </data-empty>
        <data-empty v-if="isEmptyList">
          暂无数据~
        </data-empty>
        <Table v-show="showTable" :columns="columns" :data="dataSource" @on-selection-change="handleSelectionChange"></Table>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
/**
 * 对账单页面大多数页面都是左侧和右侧两个区域
 * 基于这种场景布局，封装了这个业务组件，
 * 避免了每次都要写一次样式，调整布局，对标ui等
 */
import ListSender from './list-sender/index.vue'
import ListSenderItem from './list-sender/SenderItem.vue'
import DataEmpty from '@/components/DataEmpty'
export default {
  components: {
    DataEmpty,
    ListSender,
    ListSenderItem
  },
  props: {
    // 列表名称
    title: String,
    // 左侧区域内容为空
    isEmptyList: {
      type: Boolean,
      default: true
    },
    emptyContent: {
      default: '请点击左侧列表查看更多信息~',
      type: String,
      required: true
    },
    // 表格列
    columns: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    showTable () {
      return this.dataSource.length > 0
    }
  },
  methods: {
    handleSelectionChange (selected) {
      this.$emit('on-selection-change', selected)
    }
  }
}
</script>

<style lang="stylus" scoped>
.reconcile-layout
  margin-bottom -20px
  margin-left -15px
  margin-right -15px
  border-top 1px solid #E4E7EC
  &__operation
    border-bottom 1px solid #E4E7EC
    padding 9px 15px
    line-height 31px
  &__flex-divider
    position absolute
  &__flex-left
    flex 0 0 269px
    border-right 1px solid #E4E7EC
  &__flex-right
    flex 1
    padding-left 15px
    padding-right 15px
  &__view-title
    font-size 14px
    color #333
    font-weight 500
</style>
