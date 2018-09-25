<template>
  <div class="search">
    <div class="search-col">
      <Row :gutter="24" class="row">
        <Col span="6">
        <div class="col">
          <Select v-model="model1" >
            <Option v-for="col in cityList" :value="col.value" :key="col.value">{{ col.label }}</Option>
          </Select>
        </div>
      </Col>
        <Col span="6">
        <div class="col">
          <Input v-model="value" placeholder="Enter something..."  />
        </div>
      </Col>
        <Col span="6">
        <div class="col">
          <Input v-model="value" placeholder="Enter something..."  />
        </div>
      </Col>
        <Col span="6">
        <div class="col"><Input v-model="value" placeholder="Enter something..."  /></div>
      </Col>
      </Row>
      <Row :gutter="24">
        <Col span="6">
        <div class="col">
          <Select v-model="model1" >
            <Option v-for="col in cityList" :value="col.value" :key="col.value">{{ col.label }}</Option>
          </Select>
        </div>
        </Col>
        <Col span="6">
        <div class="col">
          <Input v-model="value" placeholder="Enter something..."  />
        </div>
        </Col>
        <Col span="6">
        <div class="col">
          <Input v-model="value" placeholder="Enter something..."  />
        </div>
        </Col>
        <Col span="6">
        <div class="col"><Input v-model="value" placeholder="Enter something..."  /></div>
        </Col>
      </Row>
    </div>
    <div class="search-btn">
      <Button type="primary">搜索</Button>
      <Button style="margin-left: 8px">清除条件</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'operate',
  data () {
    return {
      cityList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
        {
          value: 'Sydney',
          label: 'Sydney'
        },
        {
          value: 'Ottawa',
          label: 'Ottawa'
        },
        {
          value: 'Paris',
          label: 'Paris'
        },
        {
          value: 'Canberra',
          label: 'Canberra'
        }
      ],
      model1: '',
      value: ''
    }
  }
}
</script>

<style scoped lang="stylus">
  .search
    display flex
    background #F9F9F9
    padding 13px
    .search-col
      flex 4
      .row
        margin-bottom 12px
    .search-btn
      flex 1
      text-align right
      margin-top 44px
      button
        width 86px
</style>
