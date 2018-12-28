<template>
  <div>
    <VerticalTabs value="11">
      <VerticalTabItem key="1" :icon="{type:'ico-discovery',color:'#00a4bd'}" label="test1" name="11">123</VerticalTabItem>
      <VerticalTabItem key="2" label="test2" name="22">456</VerticalTabItem>
    </VerticalTabs>
  </div>
</template>

<script>
import VerticalTabs from './vertical-tabs/index'

export default {
  name: 'vertest',
  components: {
    VerticalTabs,
    VerticalTabItem: VerticalTabs.TabItem
  }
}
</script>

<style>

</style>
