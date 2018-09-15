export default {
  data1: [{
    key: 'data1',
    title: '受理开单',
    code: '1002',
    expand: true,
    children: [{
      title: '手工下单',
      expand: true,
      code: '2001',
      children: [
        {title: '保存', code: '3001'},
        {title: '打印并保存', code: '3002'},
        {title: '清空', code: '3003'}
      ]
    },
    {
      title: '批量导入',
      expand: true,
      code: '2002',
      children: [
        {title: '导入文件', code: '3004'},
        {title: '下载模板', code: '3005'},
        {title: '下载（列表上）', code: '3006'},
        {title: '查看订单', code: '3007'}
      ]
    }]
  }],
  data2: [{
    key: 'data2',
    title: '订单管理',
    code: '1003',
    expand: true,
    children: [{
      title: '订单管理',
      code: '2003',
      expand: true,
      children: [
        {title: '送货调度', code: '3008'},
        {title: '提货调度', code: '3009'},
        {title: '拆单', code: '3010'},
        {title: '外转', code: '3011'},
        {title: '订单还原', code: '3012'},
        {title: '编辑', code: '3013'},
        {title: '删除', code: '3014'},
        {title: '打印', code: '3015'},
        {title: '导出', code: '3016'}
      ]
    }, {
      title: '回单管理',
      code: '2004',
      expand: true,
      children: [
        {title: '回收', code: '3017'},
        {title: '返厂', code: '3018'},
        {title: '导出', code: '3019'}
      ]
    }]
  }],
  data3: [{
    key: 'data3',
    title: '运输管理',
    code: '1004',
    expand: true,
    children: [{
      title: '运单管理',
      code: '2005',
      expand: true,
      children: [
        {title: '发运', code: '3021'},
        {title: '派车', code: '3020'},
        {title: '打印', code: '3022'},
        {title: '到货', code: '3023'},
        {title: '删除', code: '3024'},
        {title: '位置', code: '3025'},
        {title: '编辑', code: '3026'},
        {title: '导出', code: '3027'}
      ]
    }, {
      title: '提货单管理',
      code: '2006',
      expand: true,
      children: [
        {title: '提货', code: '3028'},
        {title: '打印', code: '3029'},
        {title: '到货', code: '3030'},
        {title: '删除', code: '3031'},
        {title: '位置', code: '3032'},
        {title: '编辑', code: '3033'},
        {title: '导出', code: '3034'}
      ]
    }, {
      title: '外转单管理',
      code: '2007',
      expand: true,
      children: [
        {title: '发运', code: '3035'},
        {title: '到货', code: '3036'},
        {title: '编辑', code: '3037'},
        {title: '删除', code: '3038'},
        {title: '导出', code: '3039'}
      ]
    }]
  }],
  data4: [{
    key: 'data4',
    title: '客户管理',
    code: '1005',
    expand: true,
    children: [{
      title: '发货方管理',
      code: '2008',
      expand: true,
      children: [
        {title: '新增发货方', code: '3040'},
        {title: '修改发货方', code: '3041'},
        {title: '删除发货方', code: '3042'},
        {title: '新增发货地址', code: '3043'},
        {title: '修改发货地址', code: '3044'},
        {title: '删除发货地址', code: '3045'},
        {title: '新增收货方', code: '3046'},
        {title: '修改收货方', code: '3047'},
        {title: '删除收货方', code: '3048'},
        {title: '新增常发货物', code: '3049'},
        {title: '修改常发货物', code: '3050'},
        {title: '删除常发货物', code: '3051'}
      ]
    }, {
      title: '承运商管理',
      code: '2009',
      expand: true,
      children: [
        {title: '新增承运商', code: '3052'},
        {title: '修改承运商', code: '3053'},
        {title: '删除承运商', code: '3054'},
        {title: '新增司机', code: '3055'},
        {title: '修改司机', code: '3056'},
        {title: '删除司机', code: '3057'},
        {title: '新增车辆', code: '3058'},
        {title: '修改车辆', code: '3059'},
        {title: '删除车辆', code: '3060'}
      ]
    }, {
      title: '外转方管理',
      expand: true,
      code: '2010',
      children: [
        {title: '新增外转方', code: '3061'},
        {title: '修改外转方', code: '3062'},
        {title: '删除外转方', code: '3063'}
      ]
    }]
  }],
  data5: [{
    key: 'data5',
    title: '公司管理',
    expand: true,
    code: '1006',
    children: [{
      title: '角色管理',
      expand: true,
      code: '2011',
      children: [
        {title: '添加角色', code: '3064'},
        {title: '更改角色', code: '3065'},
        {title: '删除角色', code: '3066'}
      ]
    }, {
      title: '员工管理',
      expand: true,
      code: '2012',
      children: [
        {title: '添加员工', code: '3067'},
        {title: '修改员工', code: '3068'},
        {title: '删除员工', code: '3069'}
      ]
    }]
  }],
  data6: [{
    key: 'data6',
    title: '设置',
    expand: true,
    code: '1007',
    children: [
      {title: '公司设置', code: '2013'},
      {title: '短信设置', code: '2014'},
      {title: '提示设置', code: '2015'}
    ]
  }]
}
