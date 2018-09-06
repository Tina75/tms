<template>
  <h3 class="header-h3">
    <div class="header-h3-title">
      <slot></slot>
    </div>
  </h3>
</template>

<style lang="stylus" scoped>
.header-h3
  border-bottom 1px dashed #CBCED3
  color #333333
  padding 12px 0
  margin 24px 0
  &-title
    border-left 4px solid #00A4BD
    padding-left 20px
    font-size 16px

</style>
