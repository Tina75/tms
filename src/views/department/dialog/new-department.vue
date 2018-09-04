<template>
  <div>
    <Modal
      v-model="visible"
      width="400"
      @on-ok="save">
      <p slot="header" style="text-align:center">
        <span>添加部门</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="所属部门" prop="parentName">
          <Input v-model="form.parentName" readonly/>
        </FormItem>
        <FormItem label="部门名称" prop="departName">
          <Input v-model="form.departName" placeholder="请输入"/>
        </FormItem>
        <FormItem label="部门类别" prop="departType">
          <Select v-model="form.departType" placeholder="请选择">
            <Option value="1">前线销售</Option>
            <Option value="2">中台销售</Option>
            <Option value="3">研发部门</Option>
            <Option value="4">客服部门</Option>
            <Option value="5">综合性部门</Option>
            <Option value="6">职能部门</Option>
          </Select>
        </FormItem>
        <FormItem v-if="form.departType==1" label="管辖城市" prop="cityList">
          <div v-for="(id,index) in form.cityList" :count="100" :key="index" class="city">
            <span  class="city--del" @click="removeCity(index)">-</span>
            {{id | codeToName}}
          </div>
          <div >
            <Select v-model="province" style="width:100px;margin-right:5px">
              <Option v-for="pro in provinces" :key="pro.code" :value="pro.code">{{pro.name}}</Option>
            </Select>
            <Select v-model="city" style="width:100px">
              <Option v-for="ct in cities" :key="ct.code" :value="ct.code">{{ct.name}}</Option>
            </Select>
          </div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Axios from '@/libs/axios'
import City from '@/libs/js/City'
export default {
  name: 'append',
  data () {
    return {
      visible: true,
      cities: [],
      provinces: City.getAllChild(0),
      city: '',
      province: '',
      parentCity: [], // 上级部门管辖城市
      form: {
        parentName: '',
        parentId: '',
        departName: '',
        departType: '',
        masterId: '',
        cityList: []
      },
      rules: {
        departName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { max: 10, message: '部门名称不能超过十个字', trigger: 'blur' }
        ],
        departType: [
          { required: true, message: '请选择部门类型', trigger: 'change' }
        ]
      }
    }
  },

  computed: {},
  watch: {
    province: function (code) {
      this.cities = City.getAllChild(code)
      this.city = ''
    },
    city: function (code) {
      if (code > 0) {
        !this.hasExist(code) && this.form.cityList.push(code)
      }
    }
  },

  mounted: function () {
    console.log('mounted')
    this.getParentInfo(this.id)
    console.log('mounted1')
  },

  methods: {
    hasExist (code) {
      const parentCity = City.getParentByCode(code)
      return this.form.cityList.includes(parentCity.code) || this.form.cityList.includes(code)
    },
    removeCity (index) {
      this.form.cityList.splice(index, 1)
      this.city = ' '
    },
    save () {
      Axios({
        url: 'depart/add',
        method: 'post',
        data: this.form
      }).then(({data}) => {
        this.form.departId = data.data
        // this.$emit('onSuccess', this.form)
        this.ok(this.form)
      })
    },
    getParentInfo (id) {
      id > 0 && Axios({
        url: 'depart/detail',
        method: 'get',
        data: {departId: id}
      }).then(({data}) => {
        this.parentCity = data.data.cityList
        this.form.parentId = id
        this.form.parentName = data.data.departName
      }).catch(err => {
        console.log(err)
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.city
  padding 0 10px
  border-radius 3px
  display inline-block
  margin-right  10px
  height 24px
  line-height 24px
  background-color #e5e5e5
  position relative
  &--del
    position absolute
    background-color red
    top -5px
    right -2px
    display inline-block
    border-radius 40px
    height 12px
    width 12px
    line-height 10px
    padding-left 2px
    font-size 20px
    cursor pointer
    color white
</style>
