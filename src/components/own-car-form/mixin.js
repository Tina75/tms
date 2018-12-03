
import _ from 'lodash'
export const ViewMode = {
  SLIDER: 'slider',
  MODAL: 'modal'
}
export default {
  props: {
    form: Object,
    onCreate: Object,
    viewMode: {
      type: String,
      default: ViewMode.MODAL
    }
  },
  watch: {
    form (newForm) {
      if (newForm && !_.isEmpty(newForm)) {
        let selfForm = this[this.formName]
        for (let key in selfForm) {
          if (selfForm.hasOwnProperty(key)) {
            selfForm[key] = newForm[key]
          }
        }
      }
    }
  },
  mounted () {
    // console.log('viewmode: ', this.viewMode)
  }
}
