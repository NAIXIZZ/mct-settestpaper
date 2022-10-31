<template>
  <div>
    <el-row>
      <el-col :span="12"><span class="title1">试卷统计数据</span></el-col>
      <el-col :span="12">
        <download-excel
          class="export-excel-wrapper"
          :data="paperData"
          :fields="json_fields"
          name="试卷统计数据.xls"
        >
          <el-button type="success">导出表格数据</el-button>
        </download-excel>
      </el-col>
    </el-row>
    <el-row class="card">
      <el-col :span="4">
        <el-card
          class="first-card"
          shadow="hover"
        >
          <div>
            <span class="number1">{{ number }}</span>
            <el-divider></el-divider>
            <span class="text-size">我的试卷总数</span>
          </div>
        </el-card>
      </el-col>

      <el-col
        :span="4"
        v-for="item in paperData"
        :key="item.key"
      >
        <el-card
          class="second-card"
          shadow="hover"
        >
          <div>
            <span class="number2">{{ item.number }}</span>
            <el-divider></el-divider>
            <span class="text-size">{{ item.year }}年试卷总数</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="title2"><span>试卷总数占比情况</span></el-row>
    <el-row>
      <div
        id="myChart"
        style="width: 600px;height: 400px;"
      ></div>
    </el-row>
  </div>
</template>


<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import '@/util/format.js'
import Cookies from "js-cookie";
let myChart = null
export default {
  name: '',
  components: {

  },
  props: {},
  data () {
    return {
      number: "",
      paperData: [],
      json_fields: {
        "年份": 'year',
        "数量": 'number',
      },
      paper_list: []
    };
  },
  mounted () {
    this.getData()
    this.drawPieChart()
  },
  destroyed () {
    this.myChart.clear()
  },
  methods: {
    getData () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let query_id = new BaaS.Query()
      query_id.compare('created_by', '=', Cookies.get('user_id') * 1)
      let test_paper = new BaaS.TableObject("test_paper")
      var nowDate = new Date()
      var nowYear = nowDate.getFullYear()
      var startYear = 2020
      test_paper.limit(1000).setQuery(query_id).find().then(res => {
        this.number = res.data.objects.length
        this.paper_list = res.data.objects
        for (let j = 1; j < 10; j++) {
          test_paper.limit(1000).offset(j * 1000).setQuery(query_id).find().then(res => {
            this.number = this.number + res.data.objects.length
            Object.assign(this.paper_list, res.data.objects)
          }, err => {
            console.log(err)
          })
        }
        for (let i = nowYear; i >= startYear; i--) {
          var num = 0
          for (let j = 0; j < this.paper_list.length; j++) {
            var created_at = new Date(this.paper_list[j].created_at * 1000)
            created_at = created_at.Format("yyyy-MM-dd HH:mm:ss")
            var reg = RegExp(i)
            if (reg.test(created_at)) {
              num = num + 1
            }
          }
          var obj = new Object()
          obj.year = i
          obj.number = num
          this.paperData.push(obj)
        }
      }, err => {
        console.log(err)
      })
      // console.log(this.paperData)
    },
    drawPieChart () {
      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      var getData = [];
      setTimeout(() => {
        for (let i = 0; i < this.paperData.length; i++) {
          var obj = new Object();
          obj.name = this.paperData[i].year;
          obj.value = this.paperData[i].number;
          getData[i] = obj;
        }
        this.myChart.setOption({
          title: { text: '' },
          tooltip: {},
          series: [{
            type: 'pie',
            data: getData,
          }]
        });
      }, 500) // 0.5秒后执行代码
    },
  },
};
</script>
<style scoped>
.title1 {
  font-size: 20px;
  font-weight: bold;
  margin-right: 75%;
}
.card {
  margin-left: 10%;
  margin-top: 20px;
}
.first-card {
  width: 200px;
  height: 170px;
}
.second-card {
  width: 170px;
  height: 170px;
}
.number1 {
  font-size: 40px;
}
.number2 {
  font-size: 35px;
}
.text-size {
  font-size: 16px;
}
.title2 {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  margin-right: 85%;
}
</style>