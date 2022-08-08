<template>
  <div>
    <el-row>
      <visitorHead></visitorHead>
    </el-row>
    <div class="content-container">
      <div
        class="leftpanel"
        style="flex:7;"
      >
        <el-button @click="returnRouter">返回</el-button>
        <div class="visualization">
          <div
            id="kgShow"
            style="width: 100%; height: 100%; overflow: hidden"
          ></div>
        </div>
      </div>
      <div
        class="rightpanel"
        style="flex:3;"
      >
       <el-card class="table">
          <el-table
            :data="tableData"
            stripe
            border
            height="600"
          >
            <el-table-column
              prop="entity1"
              label="实体1"
            >
            </el-table-column>
            <el-table-column
              prop="pinyin"
              label="拼音"
            >
            </el-table-column>
            <el-table-column
              prop="english"
              label="英语"
            >
            </el-table-column>
            <el-table-column
              prop="relation"
              label="关系"
            >
            </el-table-column>
            <el-table-column
              prop="entity2"
              label="实体2"
            >
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="message">
          <p
            style="font-size: 1rem;font-weight:bold"
            id="messageName"
          ></p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import visitorHead from '@/components/visitorHead.vue'
import Cookies from "js-cookie"
import { voicePlay } from '@/util/voicePlay.js'
export default {
  name: '',
  components: {
    visitorHead
  },
  props: {},
  data () {
    return {
      tableData: [{
        entity1: '',
        pinyin: '',
        english: '',
        relation: '',
        entity2: ''
      }],
      data: {},
      nodes_list: [],
      queryNode: '',
      queryNum: '',
      timeout: null,
      myKgShow: Object,
    };
  },
  mounted () {
    this.drawKg()
  },
  methods: {
    returnRouter () {
      Cookies.set("currentTab", "forth");
      this.$router.go(-1)
    },
    drawKg () {
      var kgWord = Cookies.get('word')
      this.myKgShow = this.$echarts.init(document.getElementById('kgShow'));
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let kg = new BaaS.TableObject("kg")
      var nodes = new Array()
      var kgData = new Object()
      var links = new Array()
      var categories = new Array()
      let query = new BaaS.Query()
      query.compare('entity1', '=', kgWord)
      var node = new Object()
      node['id'] = 0
      node['name'] = kgWord
      node['category'] = "MCT词汇"
      nodes.push(node)
      categories.push("MCT词汇")
      kg.limit(1000).setQuery(query).select(['entity1', 'entity2', 'relation']).find().then(res => {
        this.tableData = res.data.objects
        for (let i = 0; i < res.data.objects.length; i++) {
          var node = new Object()
          node['id'] = i + 1
          node['name'] = res.data.objects[i].entity2
          node['category'] = res.data.objects[i].relation
          nodes.push(node)
          var link = new Object();
          link['name'] = res.data.objects[i].relation
          link['source'] = 0
          link['target'] = i + 1
          links.push(link)
          if (!categories.includes(res.data.objects[i].relation)) {
            categories.push(res.data.objects[i].relation)
          }
        }
        var tempCategories = []
        for (let i = 0; i < categories.length; i++) {
          var name = new Object();
          name['name'] = categories[i]
          tempCategories.push(name)
        }
        kgData['nodes'] = nodes
        kgData['categories'] = tempCategories
        kgData['links'] = links
      }, err => {
        console.log(err)
      })
      setTimeout(() => {
        console.log(kgData)
        this.myKgShow.hideLoading();
        var option;
        document.getElementById("messageName").textContent = kgData.nodes[0].name;
        option = {
          title: {
            text: '知识图谱',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
          },
          tooltip: {
            formatter: function (x) {
              return x.data.name;
            },
          },
          toolbox: {
            // 显示工具箱
            show: true,
            feature: {
              mark: {
                show: true
              },
              // 还原
              restore: {
                show: true
              },
              // 保存为图片
              saveAsImage: {
                show: true
              }
            }
          },
          legend: [{
            data: kgData.categories.map(function (a) {
              return a.name;
            })
          }],
          animationDuration: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [{
            data: kgData.nodes,
            links: kgData.links,
            categories: kgData.categories,

            type: 'graph',
            layout: 'force',
            symbolSize: 65,
            force: {
              repulsion: 200,
              edgeLength: 300,
            },
            roam: true,
            draggable: true,
            edgeSymbol: ['circle', 'arrow'],

            itemStyle: {
              borderColor: '#fff',
              borderWidth: 3,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            edgeLabel: {
              show: true,
              position: 'middle',
              formatter: function (x) {
                return x.data.name;
              },
              fontSize: 16,
            },
            label: {
              // normal: {
              show: true,
              position: 'inside',
              formatter: '{b}',
              fontSize: 12,
              fontStyle: '400',
              // }
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              scale: true,
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            }
          }]
        };
        setTimeout(() => {
          this.myKgShow.setOption(option);
        }, 500)
      }, 500) // 0.5秒后执行代码
      // window.addEventListener("resize", function () {
      //   this.myKgShow.resize();
      // })
      this.myKgShow.on('click', (param) => {
        if (param.dataType == 'node') {
            console.log('点击了节点', param.data.name)
            voicePlay(param.data.name)
            document.getElementById("messageName").textContent = param.data.name
        } else {
          console.log('点击了边', param)
          voicePlay(param.data.name)
        }
      });
    },
  },
};
</script>
<style scoped>
.content-container {
  display: flex;
  min-width: 500px;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0.125rem 0.125rem 0;
}
.leftpanel {
  padding: 0.125rem;
  height: 8rem;
}
.rightpanel {
  padding: 0.125rem;
  height: 8rem;
  min-width: 310px;
  max-width: 1920px;
}
.visualization {
  height: 49rem;
  border-radius: 10px;
  padding: 0.375rem;
  position: relative;
  margin: 0.125rem;
  box-shadow: 0px 0px 1px 1px rgb(161 159 159 / 10%);
  background-color: rgb(247, 255, 251);
  margin-top: 10px;
}
.table {
  height: 40rem;
}
.message {
  height: 12rem;
}
</style>