<template>
  <div>
    <el-row>
      <heads></heads>
    </el-row>
    <el-row>
      <el-input
        placeholder="请输入您想搜索的内容"
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
              label="操作"
              width="250"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="success"
                  @click="updatePop(scope.$index,scope.row)"
                >编辑</el-button>
                <el-button
                  type="success"
                  @click="addPop(scope.$index,scope.row)"
                >发布</el-button>
                <el-button
                  type="danger"
                  @click="deletePop(scope.$index,scope.row)"
                >删除</el-button>
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

    <!-- 编辑表单 /dialog-->
    <sys-dialog
      :title="updateDialog.title"
      :visible="updateDialog.visible"
      :width="updateDialog.width"
      :height="updateDialog.height"
      @onClose="onCloseUpdate"
      @onConfirm="onConfirmUpdate()"
    >
      <div slot="content">
        <el-form
          ref="updateDialog"
          :model="updateData"
          label-width="100px"
          size="small"
        >
          <el-form-item
            prop="paper_title"
            label="试卷标题："
          >
            <el-input
              v-model="updateData.paper_title"
              class="title-input"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item
            label="试卷类型："
            prop="release_type"
          >
            <el-radio-group v-model="updateData.release_type">
              <el-radio label="练习">练习</el-radio>
              <el-radio
                label="模考"
                :disabled="updateData.paper_type == '练习'"
              >模考</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="发布时间："
            prop="release_date"
          >
            <el-radio-group
              v-model="updateData.is_immediately"
              :disabled="updateData.is_release"
              @change="upNotImmediately($event)"
            >
              <el-radio :label="true">立即发布</el-radio>
              <el-radio
                :label="false"
                :disabled="updateData.is_release"
              >定时发布</el-radio>
            </el-radio-group>
            <el-date-picker
              v-model="updateData.release_date"
              type="datetime"
              placeholder="选择日期时间"
              :disabled="updateData.is_immediately"
              :picker-options="releaseOptions"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="margin-left: 15px"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="截止时间："
            prop="deadline"
          >
            <el-radio-group
              v-model="updateData.is_deadline"
              @change="upNotDeadline($event)"
            >
              <el-radio :label="false">不截止</el-radio>
              <el-radio :label="true">定时截止</el-radio>
            </el-radio-group>
            <el-date-picker
              v-model="updateData.deadline"
              type="datetime"
              placeholder="选择日期时间"
              :disabled="!updateData.is_deadline"
              :picker-options="deadlineOptions"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="margin-left: 15px"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="考试限时："
            prop="time_limit"
          >
            <el-radio-group
              v-model="updateData.is_time_limit"
              @change="upNotLimit($event)"
            >
              <el-radio :label="false">不限时</el-radio>
              <el-radio :label="true">限时</el-radio>
            </el-radio-group>
            <el-input
              v-model="updateData.time_limit"
              :disabled="!updateData.is_time_limit"
              class="time-input"
            ></el-input><span class="words">分钟</span>
          </el-form-item>

          <el-form-item
            label="限时提交："
            prop="limit_submit"
          >
            <el-input
              v-model="updateData.limit_submit"
              class="submit-input"
            ></el-input><span class="words">分钟内不允许提交</span>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

    <!-- 发布表单 /dialog-->
    <sys-dialog
      :title="addDialog.title"
      :visible="addDialog.visible"
      :width="addDialog.width"
      :height="addDialog.height"
      @onClose="onCloseAdd"
      @onConfirm="onConfirmAdd"
    >
      <div slot="content">
        <el-form
          ref="addDialog"
          :model="addData"
          label-width="100px"
          size="small"
        >
          <el-form-item
            prop="paper_title"
            label="试卷标题："
          >
            <el-input
              v-model="addData.paper_title"
              class="title-input"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item
            label="试卷类型："
            prop="release_type"
          >
            <el-radio-group v-model="addData.release_type">
              <el-radio label="练习">练习</el-radio>
              <el-radio
                label="模考"
                :disabled="addData.paper_type == '练习'"
              >模考</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="发布时间："
            prop="release_date"
          >
            <el-radio-group
              v-model="addData.is_immediately"
              @change="addNotImmediately($event)"
            >
              <el-radio :label="true">立即发布</el-radio>
              <el-radio :label="false">定时发布</el-radio>
            </el-radio-group>
            <el-date-picker
              v-model="addData.release_date"
              type="datetime"
              placeholder="选择日期时间"
              :disabled="addData.is_immediately"
              :picker-options="releaseOptions"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="margin-left: 15px"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="截止时间："
            prop="deadline"
          >
            <el-radio-group
              v-model="addData.is_deadline"
              @change="addNotDeadline($event)"
            >
              <el-radio :label="false">不截止</el-radio>
              <el-radio :label="true">定时截止</el-radio>
            </el-radio-group>
            <el-date-picker
              v-model="addData.deadline"
              type="datetime"
              placeholder="选择日期时间"
              :disabled="!addData.is_deadline"
              :picker-options="deadlineOptions"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="margin-left: 15px"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="考试限时："
            prop="time_limit"
          >
            <el-radio-group
              v-model="addData.is_time_limit"
              @change="addNotLimit($event)"
            >
              <el-radio :label="false">不限时</el-radio>
              <el-radio :label="true">限时</el-radio>
            </el-radio-group>
            <el-input
              v-model="addData.time_limit"
              :disabled="!addData.is_time_limit"
              class="time-input"
            ></el-input><span class="words">分钟</span>
          </el-form-item>

          <el-form-item
            label="限时提交："
            prop="limit_submit"
          >
            <el-input
              v-model="addData.limit_submit"
              class="submit-input"
            ></el-input><span class="words">分钟内不允许提交</span>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

    <!-- 删除弹窗 -->
    <sys-dialog
      :title="deleteDialog.title"
      :visible="deleteDialog.visible"
      :width="deleteDialog.width"
      :height="deleteDialog.height"
      @onClose="onClosedelete"
      @onConfirm="onConfirmdelete"
    >
      <div slot="content">
        <span style="font-size:20px">确认是否删除？</span>
      </div>
    </sys-dialog>

  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import '@/util/format.js'
import Heads from '@/components/heads.vue';
import sysDialog from '@/components/sysDialog.vue';
export default {
  name: 'home',
  components: {
    Heads,
    sysDialog,
  },
  props: {},
  data () {
    return {
      input: '',
      tableData: [],
      updateDialog: {
        title: "",
        visible: false,
        height: 310,
        width: 600
      },
      updateData: {
        id: "",
        paper_title: "",
        paper_type: "",
        release_date: "",
        release_type: "",
        deadline: "",
        time_limit: "",
        limit_submit: "",
        is_immediately: "",
        is_release: "",
        is_deadline: "",
        is_time_limit: ""
      },
      releaseOptions: {
        // selectableRange: `00:00:00-${this.form.endTime ? this.form.endTime : '23:59:59'}`,
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      deadlineOptions: {
        // selectableRange: `${this.form.startTime ? this.form.startTime : '00:00:00'}-23:59:59}`,
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
          // return time.getTime() < Date.now();
        },
      },
      addDialog: {
        title: "",
        visible: false,
        height: 310,
        width: 600
      },
      addData: {
        paper_id: "",
        paper_title: "",
        paper_type: "",
        release_date: "",
        release_type: "",
        deadline: "",
        time_limit: "",
        limit_submit: "",
        is_immediately: "",
        is_release: "",
        is_deadline: "",
        is_time_limit: "",
      },
      deleteDialog: {
        title: "",
        visible: false,
        height: 20,
        width: 300
      },
      currentPage: 1,
      pageSize: 9,
      deleteId: ""
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
      released_paper.orderBy('-release_date').select(['id', 'paper_id', 'paper_title', 'release_date', 'deadline', 'time_limit', 'limit_submit', 'release_type', 'is_immediately', 'is_release', 'is_deadline', 'is_time_limit']).find().then(res => {
        console.log(res.data.objects)
        this.tableData = res.data.objects
        for (let i = 0; i < this.tableData.length; i++) {
          let query = new BaaS.Query()
          query.compare('id', '=', this.tableData[i].paper_id)
          test_paper.setQuery(query).select(['created_user_id', 'questions_num', 'paper_type', 'questions_id', 'points']).find().then(res2 => {
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
    updatePop (index, row) {
      this.updateData = Object.assign({}, row)
      this.updateDialog.title = '编辑发布设置'
      this.updateDialog.visible = true
    },
    onCloseUpdate () {
      this.updateDialog.visible = false
    },
    onConfirmUpdate () {
      if (this.updateData.paper_title == '') {
        this.$message.error('试卷标题不能为空！');
      }
      else {
        console.log(this.updateData)
        this.updateDialog.visible = false;
        var paperTitle = this.updateData.paper_title
        var releaseType = this.updateData.release_type
        if (!this.updateData.is_deadline) {
          var deadline = null
        }
        else {
          var deadline = this.updateData.deadline
        }
        if (this.updateData.time_limit == '') {
          var timeLimit = null
        }
        else {
          var timeLimit = Number(this.updateData.time_limit)
        }
        if (this.updateData.limit_submit == '' || this.updateData.limit_submit == 0) {
          var limitSubmit = null
        }
        else {
          var limitSubmit = Number(this.updateData.limit_submit)
        }
        var is_deadline = this.updateData.is_deadline
        if (!this.updateData.is_release && this.updateData.is_immediately) {
          var releaseDate = new Date().Format("yyyy-MM-dd HH:mm:ss")
          var is_release = true
        }
        else {
          var releaseDate = this.updateData.release_date
        }
        var is_immediately = this.updateData.is_immediately
        var is_time_limit = this.updateData.is_time_limit
        var BaaS = require("minapp-sdk");
        let clientID = "395062a19e209a770059";
        BaaS.init(clientID);
        let released_paper = new BaaS.TableObject("released_paper")
        let product = released_paper.getWithoutData(this.updateData.id)
        product.set('paper_title', paperTitle)
        product.set('release_type', releaseType)
        product.set('release_date', releaseDate)
        product.set('deadline', deadline)
        product.set('time_limit', timeLimit)
        product.set('limit_submit', limitSubmit)
        product.set('is_deadline', is_deadline)
        product.set('is_immediately', is_immediately)
        product.set('is_release', is_release)
        product.set('is_time_limit', is_time_limit)
        product.update().then(res => {
          if (res.status == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.getPaperList()
          } else {
            this.$message.error('修改失败');
          }
        }, err => {
        })
      }
    },
    upNotImmediately (val) {
      if (val) {
        this.updateData.release_date = ""
      }
    },
    upNotDeadline (val) {
      if (!val) {
        this.updateData.deadline = ""
      }
    },
    upNotLimit (val) {
      if (!val) {
        this.updateData.time_limit = ""
      }
    },
    addPop (index, row) {
      this.addData = Object.assign({}, row)
      this.addData.paper_title = ''
      this.addData.release_date = ''
      this.addData.release_type = '练习'
      this.addData.deadline = ''
      this.addData.time_limit = ''
      this.addData.limit_submit = ''
      this.addData.is_immediately = true
      this.addData.is_deadline = false
      this.addData.is_time_limit = false
      this.addDialog.title = '新增发布设置'
      this.addDialog.visible = true
    },
    onCloseAdd () {
      this.addDialog.visible = false
    },
    onConfirmAdd () {
      if (this.addData.paper_title == '') {
        this.$message.error('试卷标题不能为空！');
      }
      else {
        console.log(this.addData)
        this.addDialog.visible = false;
        var paperId = this.addData.paper_id
        var paperTitle = this.addData.paper_title
        var releaseType = this.addData.release_type
        if (!this.addData.is_deadline) {
          var deadline = null
        }
        else {
          var deadline = this.addData.deadline
        }
        if (this.addData.time_limit == '') {
          var timeLimit = null
        }
        else {
          var timeLimit = Number(this.addData.time_limit)
        }
        if (this.addData.limit_submit == '' || this.addData.limit_submit == 0) {
          var limitSubmit = null
        }
        else {
          var limitSubmit = Number(this.addData.limit_submit)
        }
        var is_deadline = this.addData.is_deadline
        if (this.addData.is_immediately) {
          var is_release = true
          var releaseDate = new Date().Format("yyyy-MM-dd HH:mm:ss")
        }
        else {
          var is_release = false
          var releaseDate = this.addData.release_date
        }
        var is_immediately = this.addData.is_immediately
        var is_time_limit = this.addData.is_time_limit
        var collectAmount = 0
        var didNum = 0
        var BaaS = require("minapp-sdk");
        let clientID = "395062a19e209a770059";
        BaaS.init(clientID);
        let released_paper = new BaaS.TableObject("released_paper")
        let product = released_paper.create()
        product.set('paper_id', paperId)
        product.set('paper_title', paperTitle)
        product.set('release_type', releaseType)
        product.set('release_date', releaseDate)
        product.set('deadline', deadline)
        product.set('time_limit', timeLimit)
        product.set('limit_submit', limitSubmit)
        product.set('is_deadline', is_deadline)
        product.set('is_immediately', is_immediately)
        product.set('is_release', is_release)
        product.set('is_time_limit', is_time_limit)
        product.set('collect_amount', collectAmount)
        product.set('did_num', didNum)
        product.save().then(res => {
          // console.log(res)
          if (res.status == 201) {
            this.$message({
              message: '发布成功',
              type: 'success'
            });
            this.getPaperList()
          } else {
            this.$message.error('发布失败');
          }
        }, err => {
        })
      }

    },
    addNotImmediately (val) {
      if (val) {
        this.addData.release_date = ""
      }
    },
    addNotDeadline (val) {
      if (!val) {
        this.addData.deadline = ""
      }
    },
    addNotLimit (val) {
      if (!val) {
        this.addData.time_limit = ""
      }
    },
    deletePop (index, row) {
      console.log(row)
      this.deleteId = row.id
      // this.deleteDialog.title = '确认是否删除？'
      this.deleteDialog.visible = true
    },
    onClosedelete () {
      this.deleteDialog.visible = false
    },
    onConfirmdelete () {
      this.deleteDialog.visible = false;
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let released_paper = new BaaS.TableObject("released_paper")
      released_paper.delete(this.deleteId).then(res => {
        // console.log(res)
        if (res.status == 204) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getPaperList()
        } else {
          this.$message.error('删除失败');
        }
      }, err => {
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
            })
          }
        }, err => {
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
    },
    // startInput (val) {
    //   if (this.updateData.deadline && val) {
    //     if (this.updateData.deadline.split(" ")[0] == val.split(" ")[0]) {
    //       this.releaseOptions.selectableRange = "00:00:00 - " + this.updateData.deadline.split(" ")[1];
    //     } else {
    //       this.releaseOptions.selectableRange = "00:00:00 - " + "23:59:00";
    //     }
    //   } else {
    //     this.releaseOptions.selectableRange = "00:00:00 - " + "23:59:00";
    //   }
    // },
    // startChange (val) {
    //   if (val) {
    //     this.deadlineOptions.selectableRange = val.split(" ")[1] + " - 23:59:00";
    //   } else {
    //     this.deadlineOptions.selectableRange = "00:00:00 - 23:59:00";
    //   }
    // }
  }
};
</script>
<style scoped>
.el-col {
  margin-top: 20px;
}
.el-table {
  width: 100%;
}
.search-input {
  width: 300px;
  margin-top: 20px;
}
.title-input {
  width: 350px;
}
.time-input {
  width: 100px;
  margin-left: 15px;
}
.submit-input {
  width: 100px;
}
.box-card {
  width: 95%;
  height: 100%;
  margin-left: 2%;
  margin-top: 1%;
}
.words {
  margin-left: 5px;
}
</style>