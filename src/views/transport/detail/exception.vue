<template>
  <div class="exception">
    <ExpRecord />
    <ExpRecord />
    <ExpRecord />
    <ExpTimeLine />
  </div>
</template>
<script>
import ExpRecord from '../components/ExpRecord.vue'
import ExpTimeLine from '../components/ExpTimeLine.vue'
export default {
  name: 'exception',
  components: {
    ExpRecord,
    ExpTimeLine
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>
