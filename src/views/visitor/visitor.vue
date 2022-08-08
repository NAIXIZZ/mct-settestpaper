<template>
  <div>
    <el-row>
      <visitorHead></visitorHead>
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
              prop="release_date"
              label="发布日期"
              sortable
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="created_user_id"
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
              prop="release_type"
              label="试卷类型"
              header-align="center"
              align="center"
              :filters="[{text: '练习', value: '练习'}, {text: '模考', value: '模考'}]"
              :filter-method="filterHandler"
            >
            </el-table-column>
            <!-- <el-table-column
              prop="did_num"
              label="做题人数"
              header-align="center"
              align="center"
              sortable
            >
            </el-table-column> -->
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
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import visitorHead from '@/components/visitorHead.vue'
export default {
  name: 'home',
  components: {
    visitorHead
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
      let test_paper = new BaaS.TableObject("test_paper")
      let released_paper = new BaaS.TableObject("released_paper")
      released_paper.orderBy('-release_date').select(['id', 'release_date', 'paper_id', 'paper_title', 'release_type', 'did_num']).find().then(res1 => {
        // console.log(res1.data.objects)
        this.tableData = res1.data.objects
        for (let i = 0; i < this.tableData.length; i++) {
          let query = new BaaS.Query()
          query.compare('id', '=', this.tableData[i].paper_id)
          test_paper.setQuery(query).select(['created_user_id', 'questions_num', 'questions_id', 'points']).find().then(res2 => {
            // console.log(res2.data.objects[0])
            Object.assign(this.tableData[i], res2.data.objects[0])
            // console.log(this.tableData)
            this.$forceUpdate();
          }, err => {
            console.log(err)
          })
        }
      }, err => {
        console.log(err)
      })
    },
    paperDetail (row) {
      Cookies.set('home_released_paper_id', row.id)
      Cookies.set('home_test_paper_id', row.paper_id)
      this.$router.push({
        path: '/visitor_paperDetail'
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
        let released_paper = new BaaS.TableObject("released_paper")
        let queryTitle = new BaaS.Query()
        queryTitle.contains('paper_title', this.input)
        let queryType = new BaaS.Query()
        queryType.contains('release_type', this.input)
        let queryDate = new BaaS.Query()
        queryDate.contains('release_date', this.input)
        let orQuery = BaaS.Query.or(queryTitle, queryType, queryDate)
        released_paper.setQuery(orQuery).select(['id', 'release_date', 'paper_id', 'paper_title', 'release_type', 'did_num']).find().then(res => {
          // console.log(res.data.objects)
          this.tableData = res.data.objects
          for (let i = 0; i < this.tableData.length; i++) {
            let query = new BaaS.Query()
            query.compare('id', '=', this.tableData[i].paper_id)
            test_paper.setQuery(query).select(['created_user_id', 'questions_num', 'questions_id', 'points']).find().then(res2 => {
              // console.log(res2.data.objects[0])
              Object.assign(this.tableData[i], res2.data.objects[0])
              // console.log(this.tableData)
              this.$forceUpdate();
            }, err => {
              console.log(err)
            })
          }
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
  /* margin-top: 5px; */
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