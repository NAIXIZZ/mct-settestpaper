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
          @change="selectChanged"
          @clear="clearSelect"
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
        <download-excel
          class="export-excel-wrapper"
          :data="quesData"
          :fields="json_fields"
          name="题型统计数据.xls"
        >
          <el-button type="success">导出表格数据</el-button>
        </download-excel>
      </el-col>
    </el-row>

    <el-row class="title">
      <span>题型统计数据</span>
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
            <span class="text-size">我的题目总数</span>
          </div>
        </el-card>
      </el-col>

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
            <span class="number2">{{ item.number }}</span>
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
import Cookies from "js-cookie";
let pieChart = null
export default {
  name: '',
  components: {

  },
  props: {},
  data () {
    return {
      number: "",
      quesData: [],
      options: [],
      selectYear: '',
      json_fields: {
        "题型": 'type',
        "数量": 'number',
      },
      ques_list: []
    };
  },
  mounted () {
    this.getData()
    this.drawPie()
  },
  destroyed () {
    this.pieChart.clear()
  },
  methods: {
    getData () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let query_id = new BaaS.Query()
      query_id.compare('created_by', '=', Cookies.get('user_id') * 1)
      let query_delete = new BaaS.Query();
      query_delete.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query_id, query_delete)
      let questions_information = new BaaS.TableObject("questions_information")
      var typeList = ['听力', '阅读', '写作']
      questions_information.limit(1000).setQuery(andQuery.exists('primary_ques_type')).find().then(res => {
        this.number = res.data.objects.length
        this.ques_list = res.data.objects
        for (let j = 1; j < 10; j++) {
          questions_information.limit(1000).offset(j * 1000).setQuery(andQuery.exists('primary_ques_type')).find().then(res => {
            this.number = this.number + res.data.objects.length
            Object.assign(this.ques_list, res.data.objects)
          }, err => {
            console.log(err)
          })
        }
        for (let i = 0; i < typeList.length; i++) {
          var num = 0
          for (let j = 0; j < this.ques_list.length; j++)
            if (this.ques_list[j].primary_ques_type == typeList[i]) {
              num = num + 1
            }
          var obj = new Object()
          obj.type = typeList[i]
          obj.number = num
          this.quesData.push(obj)
        }
      }, err => {
        console.log(err)
      })
      var nowDate = new Date()
      var nowYear = nowDate.getFullYear()
      var startYear = 2020
      for (let i = nowYear; i >= startYear; i--) {
        var temp = {
          value: i,
          label: i,
        }
        this.options.push(temp)
      }
    },
    drawPie () {
      if (this.pieChart == null) {
        this.pieChart = this.$echarts.init(document.getElementById('pieChart'))
      }
      var getData = [];
      setTimeout(() => {
        for (let i = 0; i < this.quesData.length; i++) {
          var obj = new Object();
          obj.name = this.quesData[i].type;
          obj.value = this.quesData[i].number;
          getData[i] = obj;
        }
        this.pieChart.setOption({
          title: { text: '' },
          tooltip: {},
          series: [{
            type: 'pie',
            data: getData,
          }]
        });
      }, 500) // 0.5秒后执行代码
    },
    selectChanged (value) {
      if (value != '') {
        this.quesData = []
        this.number = 0
        var typeList = ['听力', '阅读', '写作']
        for (let i = 0; i < typeList.length; i++) {
          var num = 0
          for (let j = 0; j < this.ques_list.length; j++) {
            var created_at = new Date(this.ques_list[j].created_at * 1000)
            created_at = created_at.Format("yyyy-MM-dd HH:mm:ss")
            var patt = new RegExp(value.toString());
            if (patt.test(created_at) && this.ques_list[j].primary_ques_type == typeList[i]) {
              num = num + 1
            }
          }
          var obj = new Object()
          obj.type = typeList[i]
          obj.number = num
          this.quesData.push(obj)
        }
        for (let i = 0; i < this.quesData.length; i++) {
          this.number = this.quesData[i].number + this.number
        }
        this.drawPie()
      }
    },
    clearSelect () {
      this.quesData = []
      this.options = []
      this.ques_list = []
      this.getData()
      this.drawPie()
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
</style>