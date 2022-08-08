<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-input
          placeholder="输入你想搜索的内容"
          prefix-icon="el-icon-search"
          v-model="input"
          clearable
          class="search-input"
          @change="queryPaper()"
          @clear="getPaperList()"
        >
        </el-input>
        <el-button
          type="success"
          @click="queryPaper()"
        >搜索</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="success">导出数据表格</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-card class="box-card">
        <el-row>
          <el-table
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            stripe
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
              prop="paper_title"
              label="试卷标题"
              header-align="center"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="questions_num"
              label="题量"
              header-align="center"
              align="center"
              sortable
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
              prop="release_date"
              label="发布日期"
              header-align="center"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="deadline"
              label="截止日期"
              header-align="center"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="release_type"
              label="试卷发布类型"
              header-align="center"
              align="center"
              :filters="[{text: '练习', value: '练习'}, {text: '模考', value: '模考'}]"
              :filter-method="filterHandler"
            >
            </el-table-column>
            <el-table-column
              prop="did_num"
              label="已做人数"
              header-align="center"
              align="center"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="success"
                  @click="detailAnalysis(scope.$index,scope.row)"
                >查看详细分析</el-button>
              </template>
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

<script>
export default {
  name: 'home',
  components: {

  },
  props: {},
  data () {
    return {
      input: '',
      tableData: [],
      currentPage: 1,
      pageSize: 9
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
      released_paper.orderBy('-release_date').select(['id', 'paper_id', 'paper_title', 'release_type', 'release_date', 'deadline', 'did_num']).find().then(res1 => {
        // console.log(res1.data.objects)
        this.tableData = res1.data.objects
        for (let i = 0; i < this.tableData.length; i++) {
          let query = new BaaS.Query()
          query.compare('id', '=', this.tableData[i].paper_id)
          test_paper.setQuery(query).select(['created_user_id', 'questions_num', 'questions_id', 'points']).find().then(res2 => {
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
    detailAnalysis (index, row) {
      this.GLOBAL.PAPER_ANALYSIS_ID = row.id
      this.$router.push({
        path: '/detailAnalysis'
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
        let queryReleased = new BaaS.Query()
        queryReleased.contains('release_date', this.input)
        let queryDeadline = new BaaS.Query()
        queryDeadline.contains('deadline', this.input)
        let orQuery = BaaS.Query.or(queryTitle, queryType, queryReleased, queryDeadline)
        released_paper.setQuery(orQuery).select(['id', 'release_date', 'paper_id', 'paper_title', 'release_type', 'deadline', 'did_num']).find().then(res => {
          // console.log(res.data.objects)
          this.tableData = res.data.objects
          for (let i = 0; i < this.tableData.length; i++) {
            let query = new BaaS.Query()
            query.compare('id', '=', this.tableData[i].paper_id)
            test_paper.setQuery(query).select(['created_user_id', 'questions_num', 'questions_id', 'points']).find().then(res2 => {
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
      console.log(`每页 ${this.pageSize} 条`);
    },
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(`当前页: ${this.currentPage}`);
    }
  },
};
</script>
<style scoped>
.search-input {
  width: 300px;
}
.title-input {
  width: 300px;
}
.box-card {
  width: 100%;
  height: 100%;
  margin-top: 10px;
}
.el-table {
  width: 100%;
}
</style>