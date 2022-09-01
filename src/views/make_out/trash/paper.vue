<template>
  <div class="material">
    <div class="top_button">
      <div class="ques_select">
        <el-select
          v-model="value"
          clearable
          placeholder="试卷类型"
          @change="paper_type"
          @clear="type_clear"
        >
          <el-option
            v-for="item in use"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="ques_search">
          <el-input
            v-model="input"
            placeholder="搜索试卷标题"
            clearable
          ></el-input>
          <el-button type="success" @click="title_search(input)"
            >搜索</el-button
          >
        </div>
      </div>
      <div>
        <el-button type="danger" plain @click="multipleDel">删除选中</el-button>
        <el-button type="primary" plain @click="multipleMove"
          >还原选中</el-button
        >
      </div>
    </div>
    <el-table
    v-loading="loading"
      ref="multipleTable"
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" :index="indexMethod"> </el-table-column>
      <el-table-column label="文件夹" prop="catalog">
        <template slot-scope="scope">
          <div class="folder" v-show="scope.row.catalog != null">
            <i class="el-icon-folder"></i>
            <span>{{ scope.row.catalog }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="paper_title" label="题目"> </el-table-column>
      <el-table-column prop="paper_type" label="试卷类型"> </el-table-column>
      <el-table-column prop="questions_num" label="题量" sortable>
      </el-table-column>
      <el-table-column prop="points" label="总分" sortable> </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.paper_title != null"
            type="success"
            plain
            @click="preview(scope.row)"
            >查看</el-button
          >
          <el-button type="danger" plain @click="delDefine(scope.row, 1)"
            >删除</el-button
          >
          <el-button type="primary" plain @click="moveTo(scope.row, 1)"
            >还原</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="删除"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定删除该文件？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delContent">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="还原"
      :visible.sync="moveVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定还原该文件？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="to">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import Cookie from "js-cookie";
var BaaS = require("minapp-sdk");
let clientID = "395062a19e209a770059";
BaaS.init(clientID);
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      loading:true,
      paperCatalog:[],
      use: [
        {
          value: "练习",
          label: "练习",
        },
        {
          value: "模考",
          label: "模考",
        },
      ],
      value: "",
      type: "",
      dialogVisible: false,
      preMove: [],
      multipleSelection: [],
      moveVisible: false,
      cataContent: [],
      delCD: false,
      delC: "",
      delCN: 0,
      input: "",
      tableData: [],
      initial: [],
      dialogFormVisible: false,
      form: {
        quesnum: "",
      },
      formLabelWidth: "120px",
      srcList: [],
      addMore: true,
      previousName: "",
      currentPage: 1,
      pageSize: 10,

      catalog: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      let query = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      let q2 = new BaaS.Query();
      q2.compare("is_delete", "=", true);
      let andQuery = BaaS.Query.and(query, q2);
      let Material = new BaaS.TableObject("test_paper");
      Material.limit(1000)
        .offset(0)
        .setQuery(andQuery)
        .orderBy("-created_at")
        .find()
        .then(
          (res) => {
            this.loading=false
            this.tableData = res.data.objects;
            this.initial = res.data.objects;
          },
          (err) => {
            console.log(err);
          }
        );
    },
    title_search(val) {
      if (val == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var title_search = new Array();
        this.tableData.forEach((element) => {
          if (element.content != null && element.content.search(val) != -1) {
            title_search.push(element);
          } else if (
            element.catalog != null &&
            element.catalog.search(val) != -1
          ) {
            title_search.push(element);
          }
        });
        if (title_search.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + title_search.length + "项数据",
            type: "success",
          });
          console.log(title_search);
          this.tableData = title_search;
        }
      }
    },
    type_select(type) {
      if (type == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var type_select = new Array();
        type.forEach((element) => {
          this.tableData.forEach((item) => {
            if (element[1] == item.secondary_ques_type) {
              type_select.push(item);
            }
          });
        });
        if (type_select.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + type_select.length + "项数据",
            type: "success",
          });
          console.log(type_select);
          this.tableData = type_select;
        }
      }
    },
    paper_type(type) {
      var type_select = new Array();
      if (type === "") {
        this.type_clear();
      } else {
        if (type == "模考") {
          this.tableData = this.initial;
          this.tableData.forEach((element) => {
            if (element.paper_type == "模考") {
              type_select.push(element);
            }
          });
        } else if (type == "练习") {
          this.tableData = this.initial;
          this.tableData.forEach((element) => {
            if (element.paper_type == "练习") {
              type_select.push(element);
            }
          });
        }
        if (type_select.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + type_select.length + "项数据",
            type: "success",
          });
          this.tableData = type_select;
        }
      }
    },
    type_clear() {
      this.tableData = this.initial;
    },
    delDefine(row, type) {
      if (type == 1) {
        this.preMove.push(row.id);
      } else if (type == 2) {
        this.preMove = row;
      }
      this.dialogVisible = true;
    },
    delContent() {
      for (let i = 0; i < this.preMove.length; i++) {
        let findCata = new BaaS.TableObject("test_paper");
        findCata.delete(this.preMove[i]).then(
          (res) => {
            console.log(res);
            if (i == this.preMove.length - 1) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.init();
              this.dialogVisible = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
    moveTo(val, type) {
      if (type == 1) {
        let f = false;
        if (val.content == null && val.file_url == null) {
          for (let i = 0; i < this.paperCatalog.length; i++) {
            if (val.catalog == this.paperCatalog[i].catalog) {
              f = true;
              this.$message({
                message: val.catalog + "文件夹已存在，请改名或取消还原",
                type: "warning",
              });
            }
          }
          if (f == false) {
            this.preMove.push(val.id);
            this.moveVisible = true;
          }
        } else {
          this.preMove.push(val.id);
          this.moveVisible = true;
        }
      } else if (type == 2) {
        this.preMove = val;
        this.moveVisible = true;
      }
    },
    to() {
      for (let i = 0; i < this.preMove.length; i++) {
        console.log(this.preMove[i]);
        let Catalog = new BaaS.TableObject("test_paper");
        let cata = Catalog.getWithoutData(this.preMove[i]);
        cata.set("is_delete", false);
        cata.update().then(
          (res) => {
            console.log(res);
            this.$message({
              message: "还原成功",
              type: "success",
            });
            this.init();
            let temp = {
              have:false,
              finish:true,
              rename:false,
              catalog:res.data.catalog
            }
            this.paperCatalog.push(temp)
            this.moveVisible = false;
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
    multipleDel() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择删除项",
          type: "warning",
        });
      } else {
        let temp = [];
        this.multipleSelection.forEach((element) => {
          temp.push(element.id);
        });
        this.delDefine(temp, 2);
      }
    },
    multipleMove() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择还原项",
          type: "warning",
        });
      } else {
        let cata = "";
        let c=[]
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (
            this.multipleSelection[i].paper_title == null
          ) {
            c.push(this.multipleSelection[i])
            for (let j = 0; j < this.paperCatalog.length; j++) {
              if (
                this.multipleSelection[i].catalog ==
                this.paperCatalog[j].catalog
              ) {
                cata += this.multipleSelection[i].catalog + " ";
                break;
              }
            }
          }
        }
        const map = new Map()
        const qc = c.filter(key=>!map.has(key.catalog)&&map.set(key.catalog,1))
        if(qc.length!=c.length){
          this.$message({
            message: "不能还原多个同名空文件夹",
            type: "warning",
          });
        }else if (cata != "") {
          this.$message({
            message: cata + "文件夹已存在，请改名或取消还原",
            type: "warning",
          });
        } else {
          let temp = [];
          this.multipleSelection.forEach((element) => {
            temp.push(element.id);
          });
          this.moveTo(temp, 2);
        }
      }
    },
    handleClose() {
      this.preMove = [];
      this.moveVisible = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },
    preview(val) {
      let ques = JSON.parse(val.questions_detail);
      ques.sort(function (a, b) {
        return a.sub_sequence - b.sub_sequence;
      });
      let questions = [];
      let contents = [];
      for (let i = 0; i < ques.length; i++) {
        let questio = new BaaS.TableObject("questions_information");
        questio.get(ques[i].id).then(
          (res) => {
            let temp =
              res.data.question_content_id +
              res.data.primary_ques_type +
              res.data.secondary_ques_type;
            let s = {
              temp: temp,
              content_id: res.data.question_content_id,
              primary_ques_type: res.data.primary_ques_type,
              secondary_ques_type: res.data.secondary_ques_type,
            };
            contents.push(s);
            ques[i].temp = temp;
            let sub = {
              sub_sequence: 0,
              actual_sequence: ques[i].sub_sequence,
              score: ques[i].score * 1,
              question: res.data.question,
              options: JSON.parse(res.data.options),
              answer: res.data.answer,
              anlysis: res.data.anlysis,
              level_value: res.data.ques_level,
              grade_value: res.data.grade_standard,
              topic_value: res.data.topic_outline,
              task_value: res.data.task_outline,
              department_value: res.data.department,
              qclass_value: res.data.question_class,
              fivehe_value: res.data.question_type_5he,
              A: "",
              B: "",
              C: "",
              D: "",
              author: res.data.author,
              author_org: res.data.author_org,
              time_created: res.data.time_created,
            };
            let op = JSON.parse(res.data.options);
            if (op != null && op != undefined) {
              for (let j = 0; j < op.length; j++) {
                if (op[j].index == "A") {
                  sub.A = op[j].content;
                } else if (op[j].index == "B") {
                  sub.B = op[j].content;
                } else if (op[j].index == "C") {
                  sub.C = op[j].content;
                } else if (op[j].index == "D") {
                  sub.D = op[j].content;
                }
              }
            }
            ques[i].sub = sub;
            if (contents.length == ques.length) {
              const map = new Map();
              const qc = contents.filter(
                (key) => !map.has(key.temp) && map.set(key.temp, 1)
              );
              for (let j = 0; j < qc.length; j++) {
                let sub = [];
                let sub_seq = 1;
                let score = 0;
                for (let k = 0; k < ques.length; k++) {
                  if (qc[j].temp == ques[k].temp) {
                    ques[k].sub.sub_sequence = sub_seq;
                    sub.push(ques[k].sub);
                    sub_seq++;
                    score += ques[k].score;
                  }
                }
                let content = new BaaS.TableObject("question_content");
                content.get(qc[j].content_id).then(
                  (con) => {
                    let question = {
                      primary_ques_type: qc[j].primary_ques_type,
                      secondary_ques_type: qc[j].secondary_ques_type,
                      total_score: score,
                      saveQ: true,
                      saveT: true,
                    };
                    if (con.data.file_url != null) {
                      question.question_content = con.data.file_url.path;
                    } else {
                      question.question_content = con.data.content;
                    }
                    question.sub_question = sub;
                    questions.push(question);
                    if (questions.length == qc.length) {
                      questions.sort(function (a, b) {
                        return (
                          a.sub_question[0].actual_sequence -
                          b.sub_question[0].actual_sequence
                        );
                      });
                      let sequen = 1;
                      for (let h = 0; h < questions.length; h++) {
                        questions[h].sequence = sequen;
                        questions[h].name = questions[h].sequence.toString();
                        sequen++;
                      }
                      sessionStorage.setItem(
                        "questions",
                        JSON.stringify(questions)
                      );
                      sessionStorage.setItem("ques_type", val.ques_type);
                      sessionStorage.setItem("currentQues", questions.length);
                      sessionStorage.setItem(
                        "currentSubQues",
                        questions[questions.length - 1].sub_question.length
                      );
                      sessionStorage.setItem("title", val.paper_title);
                      if (val.paper_type == "模考") {
                        sessionStorage.setItem("exam", true);
                      } else {
                        sessionStorage.setItem("exam", false);
                      }
                      sessionStorage.setItem("ques_num", val.questions_num);
                      sessionStorage.setItem("ques_score", val.points);
                      Cookies.set("paperEdit", true);
                      Cookies.set("paperInfo", val.id);
                      Cookies.set("trash", "paper");
                      this.$router.push("/preview");
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
  },
  created() {},
  mounted() {
    this.paperCatalog = JSON.parse(sessionStorage.getItem("paperCatalog"))
    this.init();
  },
};
</script>
<style>
</style>