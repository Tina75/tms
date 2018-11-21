<template>
  <Modal transfer>
    <div slot="title">
      核销记录单详情
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  mixins: [BaseDialog],
  data () {
    return {
      record: {

      }
    }
  }
}
</script>

<style>

</style>
