<template>
  <div>
    <el-row>
      <heads></heads>
    </el-row>
    <el-row><br><span class="big-title">MCT智能出卷系统</span></el-row>
    <el-row>
      <el-input
        placeholder="请输入您想搜索的试卷标题、内容"
        prefix-icon="el-icon-search"
        v-model="input"
        clearable
        @change="queryPaper()"
        @clear="getPaperList()"
      >
      </el-input>
      <el-button
        type="success"
        @click="queryPaper()"
      >搜索</el-button>
    </el-row>
    <el-row>
      <el-card class="box-card">
        <el-row>
          <span class="small-title">试卷</span>
        </el-row>
        <el-row>
          <el-table
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            stripe
            class="table"
            @row-click="paperDetail"
          >
            <el-table-column
              prop="number"
              label="序号"
              type="index"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建日期"
              sortable
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="出卷人"
              header-align="center"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="paper_title"
              label="试卷标题"
              header-align="center"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="paper_type"
              label="试卷类型"
              header-align="center"
              align="center"
              :filters="[{text: '练习', value: '练习'}, {text: '模考', value: '模考'}]"
              :filter-method="filterHandler"
            >
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top:15px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[9, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import '@/util/format.js'
import Cookies from "js-cookie";
import Heads from '../components/heads.vue';
export default {
  name: 'home',
  components: {
    Heads
  },
  props: {},
  data () {
    return {
      input: '',
      tableData: [],
      paperData: [],
      value: [],
      currentPage: 1,
      pageSize: 9,
    };
  },
  mounted () {
    this.getPaperList()
  },
  methods: {
    getPaperList () {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let query_id = new BaaS.Query();
      query_id.compare("created_by", "=", 484881850859865);
      let test_paper = new BaaS.TableObject("test_paper")
      test_paper.limit(1000).setQuery(query_id).orderBy('-release_date').find().then(res => {
        var paper_list = []
        paper_list = res.data.objects
        for (let j = 1; j < 10; j++) {
          test_paper.limit(1000).offset(j * 1000).setQuery(query_id).orderBy('-release_date').find().then(res => {
            Object.assign(paper_list, res.data.objects)
          }, err => {
            console.log(err)
          })
        }
        for (let i = 0; i < paper_list.length; i++) {
          var created_at = new Date(paper_list[i].created_at * 1000)
          paper_list[i].created_at = created_at.Format("yyyy-MM-dd HH:mm:ss")
          paper_list[i].nickname = 'huadazhiyu'
        }
        this.tableData = paper_list
      }, err => {
        console.log(err)
      })
    },
    paperDetail (row) {
      Cookies.set('home_paper_id', row.id)
      this.$router.push({
        path: '/paperDetail'
      })
    },
    filterHandler (value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    queryPaper () {
      if (this.input != '') {
        var BaaS = require("minapp-sdk");
        let clientID = "395062a19e209a770059";
        BaaS.init(clientID);
        let test_paper = new BaaS.TableObject("test_paper")
        let queryTitle = new BaaS.Query()
        queryTitle.contains('paper_title', this.input)
        let queryType = new BaaS.Query()
        queryType.contains('paper_type', this.input)
        let orQuery = BaaS.Query.or(queryTitle, queryType)
        let queryId = new BaaS.Query()
        queryId.compare("created_by", "=", 484881850859865)
        let andQuery = BaaS.Query.and(orQuery, queryId)
        test_paper.limit(1000).setQuery(andQuery).orderBy('-release_date').find().then(res => {
          // console.log(res.data.objects)
          var paper_list = []
          paper_list = res.data.objects
          for (let i = 0; i < paper_list.length; i++) {
            var created_at = new Date(paper_list[i].created_at * 1000)
            paper_list[i].created_at = created_at.Format("yyyy-MM-dd HH:mm:ss")
            paper_list[i].nickname = 'huadazhiyu'
          }
          this.tableData = paper_list
        }, err => {
          console.log(err)
        })
      } else {
        this.getPaperList()
      }
    },
    handleSizeChange (val) {
      this.pageSize = val;
      // console.log(`每页 ${this.pageSize} 条`);
    },
    handleCurrentChange (val) {
      this.currentPage = val
      // console.log(`当前页: ${this.currentPage}`);
    }
  },
};
</script>
<style scoped>
.big-title {
  color: #00cc00;
  font-size: 80px;
}
.small-title {
  color: black;
  font-size: 25px;
}
.table {
  width: 100%;
}
.el-input {
  width: 600px;
  margin-top: 20px;
}
.box-card {
  width: 95%;
  margin-left: 2%;
  margin-top: 2%;
}
</style>