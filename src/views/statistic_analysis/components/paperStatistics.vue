<template>
  <div>
    <el-row>
      <span class="title1">试卷统计数据</span>
      <el-button type="success">导出表格数据</el-button>
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
            <span class="text-size">试卷总数</span>
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
export default {
  name: '',
  components: {

  },
  props: {},
  data () {
    return {
      number: "",
      paperData: [],
    };
  },
  mounted () {
    this.getData()
    this.drawPieChart()
  },
  methods: {
    getData () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let released_paper = new BaaS.TableObject("released_paper")
      released_paper.count().then(num => {
        this.number = num
      }, err => {
        // console.log(err)
      })
      let paper_statistics = new BaaS.TableObject("paper_statistics")
      paper_statistics.select(['year', 'number']).find().then(res => {
        this.paperData = res.data.objects
      }, err => {
        // console.log(err)
      })
    },
    drawPieChart () {
      var myChart = this.$echarts.init(document.getElementById('myChart'))
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let paper_statistics = new BaaS.TableObject("paper_statistics")
      var pieData = []
      paper_statistics.select(['year', 'number']).find().then(res => {
        pieData = res.data.objects
        // console.log(pieData)
        var getData = [];
        for (let i = 0; i < pieData.length; i++) {
          var obj = new Object();
          obj.name = pieData[i].year;
          obj.value = pieData[i].number;
          getData[i] = obj;
        }
        myChart.setOption({
          title: { text: '' },
          tooltip: {},
          series: [{
            type: 'pie',
            data: getData,
          }]
        });
      }, err => {
        // console.log(err)
      })
    },
  },
};
</script>
<style scoped>
.title1 {
  font-size: 20px;
  font-weight: bold;
  margin-right: 80%;
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