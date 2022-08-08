<template>
  <div>
    <el-row>
      <el-col :span="12">
        <span>统计范围：</span>
        <el-select
          v-model="selectYear"
          clearable
          placeholder="全部"
          class="select"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button type="success">导出表格数据</el-button>
      </el-col>
    </el-row>

    <el-row class="title">
      <span>题型统计数据</span>
    </el-row>
    <el-row class="card">
      <el-col
        :span="4"
        v-for="item in quesData"
        :key="item.key"
      >
        <el-card
          class="second-card"
          shadow="hover"
        >
          <div>
            <span class="number">{{ item.number }}</span>
            <el-divider></el-divider>
            <span class="text-size">{{ item.type }}题总数</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="title"><span>各题型占比情况</span></el-row>
    <el-row>
      <div
        id="pieChart"
        style="width: 600px;height: 400px;"
      ></div>
    </el-row>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import '@/util/format.js'
export default {
  name: '',
  components: {

  },
  props: {},
  data () {
    return {
      quesData: [],
      options: [],
      selectYear: '',
    };
  },
  mounted () {
    this.getData()
    this.drawPie()
    this.getOptions()
  },
  methods: {
    getData () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let queryYear = new BaaS.Query()
      queryYear.compare('year', '=', -1)
      let type_statistics = new BaaS.TableObject("type_statistics")
      type_statistics.setQuery(queryYear).select(['type', 'number']).find().then(res => {
        this.quesData = res.data.objects
        // console.log(res.data.objects)
      }, err => {
        // console.log(err)
      })
    },
    drawPie () {
      var pieChart = this.$echarts.init(document.getElementById('pieChart'))
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let queryYear = new BaaS.Query()
      queryYear.compare('year', '=', -1)
      let type_statistics = new BaaS.TableObject("type_statistics")
      var pieData = []
      type_statistics.setQuery(queryYear).select(['type', 'number']).find().then(res => {
        pieData = res.data.objects
        var getData = [];
        for (let i = 0; i < pieData.length; i++) {
          var obj = new Object();
          obj.name = pieData[i].type;
          obj.value = pieData[i].number;
          getData[i] = obj;
        }
        pieChart.setOption({
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
    getOptions () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let queryYear = new BaaS.Query()
      queryYear.compare('year', '!=', -1)
      let queryType = new BaaS.Query()
      queryType.compare('type', '=', '听力')
      let andQuery = BaaS.Query.and(queryYear, queryType)
      let type_statistics = new BaaS.TableObject("type_statistics")
      type_statistics.setQuery(andQuery).select(['year']).find().then(res => {
        // console.log(res.data.objects)
        for (let i = 0; i < res.data.objects.length; i++) {
          var temp = {
            value: res.data.objects[i].year,
            label: res.data.objects[i].year,
          }
          this.options.push(temp)
        }
        // console.log(this.options)
      }, err => {
        // console.log(err)
      })
    },
    changeOption () {
      console.log(this.selectYear)
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let queryYear = new BaaS.Query()
      queryYear.compare('year', '=', this.selectYear)
      let type_statistics = new BaaS.TableObject("type_statistics")
      type_statistics.setQuery(queryYear).select(['type', 'number']).find().then(res => {
        this.quesData = res.data.objects
        // console.log(res.data.objects)
      }, err => {
        // console.log(err)
      })
    }
  },
};
</script>
<style scoped>
.select {
  margin-right: 50%;
}
.title {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  margin-right: 85%;
}
.card {
  margin-left: 20%;
  margin-top: 20px;
}
.second-card {
  width: 170px;
  height: 170px;
}
.number {
  font-size: 35px;
}
.text-size {
  font-size: 16px;
}
</style>