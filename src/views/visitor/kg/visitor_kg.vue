<template>
  <div>
    <el-row>
      <visitorHead></visitorHead>
    </el-row>
    <el-row class="margin-top">
      <el-autocomplete
        class="query-input"
        prefix-icon="el-icon-search"
        v-model="queryNode"
        :fetch-suggestions="querySearch"
        placeholder="请输入要搜索的知识图谱"
        clearable
        @select="queryKg(queryNode)"
        @clear="drawWordCloud()"
      ></el-autocomplete>
      <!-- <el-select
              v-model="queryNum"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
      <el-button
        type="success"
        icon="el-icon-search"
        @click="queryKg(queryNode)"
      >搜索</el-button>
    </el-row>
    <div class="cloud-container">
      <div
        class="cloud-main"
        v-for="(item,index) in title"
        :key="index"
      >
        <div class="cloud"></div>
      </div>
    </div>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import visitorHead from '@/components/visitorHead.vue'
import { voicePlay } from '@/util/voicePlay.js'
import Cookies from "js-cookie";
export default {
  name: '',
  components: {
    visitorHead
  },
  props: {},
  data () {
    return {
      input: '',
      data: {},
      nodes_list: [],
      offset: 0,
      number: 1000,
      queryNode: '',
      queryNum: '',
      timeout: null,
      myCloud: Object,
      // title: ['临床症状及体征','检查','ICD-10疾病', '病因', '治疗方案', '所属科室', '传播途径', '传染性', 'UMLS',],//标题列表
      title: ['临床症状及体征', '实验室检查', 'ICD-10疾病', '发病部位', '治疗方案', '鉴别诊断', '辅助检查', '传染性', '药品名称',],//标题列表
    };
  },
  mounted () {
    this.nodes_list = this.loadAllNodes();
    this.drawWordCloud()
  },
  methods: {
    drawWordCloud () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var myCharts = document.getElementsByClassName('cloud');
      for (let i = 0; i < myCharts.length; i++) {
        let word_cloud = new BaaS.TableObject("word_cloud")
        console.log(this.title[i])
        let cloudData = new Array()
        let query = new BaaS.Query()
        query.compare('category', '=', this.title[i])
        word_cloud.setQuery(query).limit(1000).select(['mct_word', 'category', 'frequency']).find().then(res => {
          for (let j = 0; j < res.data.objects.length; j++) {
            var node = new Object()
            node['name'] = res.data.objects[j].mct_word
            node['value'] = res.data.objects[j].frequency
            cloudData.push(node)
          }
        }, err => {
          console.log(err)
        })
        console.log(cloudData)
        setTimeout(() => {
          var myCloud = this.$echarts.init(myCharts[i]);
          var option;
          myCloud.showLoading();
          option = {
            // backgroundColor: "white",
            tooltip: {
              show: true
            },
            title: {
              show: true,
              text: this.title[i],
              x: 'center',
              y: 'bottom',
              color: '#333',
              fontSize: 24
            },
            series: [{
              type: 'wordCloud',
              gridSize: 1, //修改文字（画布）之间的间距
              rotationRange: [0, 0],//数据翻转范围
              sizeRange: [10, 70],//画布范围，如果设置太大会出现少词（溢出屏幕）设置文字大小范围
              left: "center",
              top: "center",
              right: null,
              bottom: null,
              textStyle: {
                color: function () {
                  var colors = ['#fda67e', '#81cacc', '#cca8ba', "#88cc81", "#82a0c5", '#fddb7e', '#735ba1', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                  return colors[parseInt(Math.random() * 10)];
                },
                // color: function () {
                //   return 'rgb(' + [
                //     Math.round(Math.random() * 255),
                //     Math.round(Math.random() * 255),
                //     Math.round(Math.random() * 255)
                //   ].join(',') + ')';
                // },
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: '#333'
                }
              },
              data: cloudData,
            }]
          };
          setTimeout(() => {
            myCloud.setOption(option);
            myCloud.hideLoading();
          }, 500)
          let click_type
          myCloud.on('click', (param) => {
            click_type = false
            setTimeout(check, 200)
            function check () {
              if (click_type != false) return;
              console.log('点击了', param.data.name)
              voicePlay(param.data.name)
            }
          });
          myCloud.on('dblclick', (param) => {
            click_type = true
            console.log('点击了', param.data.name)
            this.queryKg(param.data.name)
          });
        }, 500)
      }
    },
    loadAllNodes () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let word_cloud = new BaaS.TableObject("word_cloud")
      var nodes = new Array()
      var nodes_list = new Array()
      word_cloud.limit(1000).select(['mct_word']).find().then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          if (!nodes.includes(res.data.objects[i].mct_word)) {
            nodes.push(res.data.objects[i].mct_word)
          }
        }
        for (let i = 0; i < nodes.length; i++) {
          var value = new Object()
          value.value = nodes[i]
          nodes_list.push(value)
        }
      }, err => {
        console.log(err)
      })
      return nodes_list
    },
    querySearch (queryString, cb) {
      var nodes_list = this.nodes_list;
      var results = queryString ? nodes_list.filter(this.createStateFilter(queryString)) : nodes_list;
      // 调用 callback 返回建议列表的数据
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 500);
    },
    createStateFilter (queryString) {
      return (queryNode) => {
        return (queryNode.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    queryKg (kgWord) {
      Cookies.set('kgWord', kgWord)
      this.$router.push({
        path: '/visitor_kg_show'
      })
    },
  },
};
</script>
<style scoped>
.query-input {
  width: 300px;
}
.margin-top {
  margin-top: 10px;
}
.cloud-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.cloud-main {
  width: 550px;
  margin: 20px 0;
  height: 400px;
  margin-left: 3%;
  background-color: #fdfdfd;
  border-radius: 15px;
  box-shadow: 0 0 5px #e0e0e0;
}
.cloud-main .cloud {
  width: 100%;
  height: 100%;
}
</style>