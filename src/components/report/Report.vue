<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2、为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1、导入 echarts，注意要带 * as
import * as echarts from 'echarts'
import { getReportDataAPI } from '@/api/reportAPI/report_dataAPI.js'
import _ from 'lodash'
export default {
  name: 'Report',
  data() {
    return {
      // 需要和图表数据进行合并的选项
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  // 初始化图表的时机，要在页面上的 DOM 结构被渲染完毕之后，所以 3~5 步骤都在 mounted 中
  async mounted() {
    // 3、基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await getReportDataAPI()
    if (res.meta.status !== 200) return this.$message.error('获取图表数据失败了喔')

    // 4、指定图表的配置项和数据
    const result = _.merge(res.data, this.options)

    // 5、展示数据
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
