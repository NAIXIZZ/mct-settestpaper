//查看试卷
<template>
  <div>
    <div class="ques_top">
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
      <div class="top_button">
        <el-button type="success" plain @click="exp">导出选中</el-button>
      </div>
    </div>
    <div class="ques_content">
      <div class="ques_list">
        <el-table
        v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" :index="indexMethod"> </el-table-column>
          <el-table-column prop="paper_title" label="题目"> </el-table-column>
          <el-table-column prop="paper_type" label="试卷类型">
          </el-table-column>
          <el-table-column prop="questions_num" label="题量" sortable>
          </el-table-column>
          <el-table-column prop="points" label="总分" sortable>
          </el-table-column>
          <el-table-column prop="created_at" label="创建日期" sortable>
          </el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <div>
                <el-button type="success" plain @click="preview(scope.row)"
                  >查看/编辑</el-button
                >
                <el-button type="warning" plain @click="copy(scope.row)"
                  >复制</el-button
                >
                <el-button type="danger" plain @click="delPaper(scope.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    </div>
    <div class="paper_bottom">
      <el-button type="primary" icon="el-icon-delete" @click="trash">回收站</el-button>
    </div>
    <el-dialog title="导出" :visible.sync="exVisible" width="30%">
      <el-radio v-model="ex" label="1">导出为excel</el-radio>
      <el-radio v-model="ex" label="2">导出为word</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exVisible = false">取 消</el-button>
        <el-button type="primary" @click="derive">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="javascript" src="dist/xlsx.full.min.js"></script>
<script>
import {
  export_json_to_excel_zip,
  downloadZip,
  downloadWordZip,
} from "@/util/Export2Excel.js";
// import Cookies from "js-cookie";
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
      der: [],
      ex: "1",
      exVisible: false,
      loading:true,
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
      input: "",
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      addMore: true,
      previousName: "",
      sureClick: 0,
      catalog: [],
      dialogVisible: false,
      radio: 1,
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      let query = new BaaS.Query();
      let q2 = new BaaS.Query();
      let q3 = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      // query.compare("created_by", "=", sessionStorage.getItem("user_id") * 1);
      q2.compare("is_delete", "=", false);
      // q3.compare("question_content_id", "=", Cookie.get("material_id"));
      q3.compare("question_content_id", "=", sessionStorage.getItem("material_id"));
      let andQuery = BaaS.Query.and(query, q2, q3);
      let Question = new BaaS.TableObject("questions_information");
      Question.setQuery(andQuery).limit(1000)
        .find()
        .then(
          (res) => {
            // console.log(res);
            if (res.data.objects.length != 0) {
              res.data.objects.forEach((element) => {
                let q4 = new BaaS.Query();
                q4.contains("questions_detail", element.id);
                let and = BaaS.Query.and(query, q2, q4);
                let Paper = new BaaS.TableObject("test_paper");
                Paper.limit(1000)
                  .offset(0)
                  .setQuery(and)
                  .orderBy("-created_at")
                  .find()
                  .then(
                    (res) => {
                      if (res.data.objects.length != 0) {
                        res.data.objects.forEach((element) => {
                          let date = new Date(element.created_at * 1000);
                          let Y = date.getFullYear() + "-";
                          let M =
                            date.getMonth() + 1 < 10
                              ? "0" + (date.getMonth() + 1) + "-"
                              : date.getMonth() + 1 + "-";
                          let D =
                            date.getDate() < 10
                              ? "0" + date.getDate() + " "
                              : date.getDate() + " ";
                          let h =
                            date.getHours() < 10
                              ? "0" + date.getHours() + ":"
                              : date.getHours() + ":";
                          let m =
                            date.getMinutes() < 10
                              ? "0" + date.getMinutes() + ":"
                              : date.getMinutes() + ":";
                          let s =
                            date.getSeconds() < 10
                              ? "0" + date.getSeconds()
                              : date.getSeconds();
                          element.created_at = Y + M + D + h + m + s;
                          this.tableData.push(element);
                        });
                        const map = new Map();
                        const qc = this.tableData.filter(
                          (key) => !map.has(key.id) && map.set(key.id, 1)
                        );
                        this.loading=false
                        this.tableData = qc;
                        this.initial = this.tableData;
                      }else{
                        this.loading=false
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
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
    title_search(val) {
      if (val == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var title_search = new Array();
        this.tableData.forEach((element) => {
          if (element.paper_title.search(val) != -1) {
            title_search.push(element);
          }
          // else {
          //   if (element.sub_ques != null) {
          //     element.sub_ques.forEach((item) => {
          //       this.all_ques.forEach((ques) => {
          //         if (item == ques.id) {
          //           if (
          //             (ques.ques_content != null &&
          //               ques.ques_content.search(val) != -1) ||
          //             (ques.options != null && ques.options.search(val) != -1)
          //           ) {
          //             title_search.push(element);
          //           }
          //         }
          //       });
          //     });
          //   }
          // }
        });
        if (title_search.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + title_search.length + "项数据",
            type: "success",
          });
          this.tableData = title_search;
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    copy(val) {
      let addQ = new BaaS.TableObject("test_paper");
      let add = addQ.create();
      let temp = {
        paper_title: val.paper_title + "(1)",
        paper_type: val.paper_type,
        questions_num: val.questions_num,
        points: val.points,
        is_delete: false,
        catalog: val.catalog,
        questions_detail: val.questions_detail,
        ques_type: val.ques_type,
      };
      add
        .set(temp)
        .save()
        .then(
          (res) => {
            console.log(res);
            this.$message({
              message: "复制成功",
              type: "success",
            });
            this.init();
          },
          (err) => {
            console.log(err);
          }
        );
    },
    delPaper(val) {
      let Ques = new BaaS.TableObject("test_paper");
      let ques = Ques.limit(1000).getWithoutData(val.id);
      ques.set("is_delete", true);
      ques.update().limit(1000).then(
        (res) => {
          console.log(res);
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.init();
        },
        (err) => {
          console.log(err);
        }
      );
    },
    trash() {
      // Cookies.set("trash", "paper");
      sessionStorage.setItem("trash", "paper");
      this.$router.push("/trash_list");
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
              options: res.data.options,
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
            if (res.data.options != null) {
              let str = res.data.options.replace(/\s*/g, "");
              let tempa = -1;
              let tempb = -1;
              let tempc = -1;
              let tempd = -1;
              if (str.indexOf('","index":"A"') != -1) {
                tempa = str.indexOf('","index":"A"');
              } else if (str.indexOf("','index':'A'") != -1) {
                tempa = str.indexOf("','index':'A'");
              }
              if (str.indexOf('","index":"B"') != -1) {
                tempb = str.indexOf('","index":"B"');
              } else if (str.indexOf("','index':'B'") != -1) {
                tempb = str.indexOf("','index':'B'");
              }
              if (str.indexOf('","index":"C"') != -1) {
                tempc = str.indexOf('","index":"C"');
              } else if (str.indexOf("','index':'C'") != -1) {
                tempc = str.indexOf("','index':'C'");
              }
              if (str.indexOf('","index":"D"') != -1) {
                tempd = str.indexOf('","index":"D"');
              } else if (str.indexOf("','index':'D'") != -1) {
                tempd = str.indexOf("','index':'D'");
              }
              let a = "";
              let b = "";
              let c = "";
              let d = "";
              if (tempa != -1) {
                while (str[tempa - 1] != '"' && str[tempa - 1] != "'") {
                  a += str[tempa - 1];
                  tempa--;
                }
                sub.A = a.split("").reverse().join("");
              }
              if (tempb != -1) {
                while (str[tempb - 1] != '"' && str[tempb - 1] != "'") {
                  b += str[tempb - 1];
                  tempb--;
                }
                sub.B = b.split("").reverse().join("");
              }
              if (tempc != -1) {
                while (str[tempc - 1] != '"' && str[tempc - 1] != "'") {
                  c += str[tempc - 1];
                  tempc--;
                }
                sub.C = c.split("").reverse().join("");
              }
              if (tempd != -1) {
                while (str[tempd - 1] != '"' && str[tempd - 1] != "'") {
                  d += str[tempd - 1];
                  tempd--;
                }
                sub.D = d.split("").reverse().join("");
              }
              let o = [
                {
                  content: sub.A,
                  index: "A",
                },
                {
                  content: sub.B,
                  index: "B",
                },
                {
                  content: sub.C,
                  index: "C",
                },
                {
                  content: sub.D,
                  index: "D",
                },
              ];
              console.log(o);
              sub.options = o;
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
                      // Cookies.set("paperEdit", true);
                      // Cookies.set("paperInfo", val.id);
                      // Cookies.set("make_out", "third");
                      sessionStorage.setItem("paperEdit", true);
                      sessionStorage.setItem("paperInfo", val.id);
                      sessionStorage.setItem("make_out", "third");
                      this.$router.push("/mcreatePaper");
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
    exp() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "还未选择导出项",
          type: "warning",
        });
      } else {
        this.der = this.multipleSelection;
        this.exVisible = true;
      }
    },
    derive() {
      const loading = this.$loading({
        lock: true,
        text: "正在导出，请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let final = [];
      let catanum = 0;
      for (let i = 0; i < this.der.length; i++) {
          if (this.der[i].paper_title != null) {
            let ques = [];
            let qid = JSON.parse(this.der[i].questions_detail);
            for (let j = 0; j < qid.length; j++) {
              let findQ = new BaaS.TableObject("questions_information");
              findQ.get(qid[j].id).then(
                (res) => {
                  let q = res.data;
                  q.sequence = qid[j].sub_sequence;
                  q.score = qid[j].score;
                  if (q.options != null) {
                    let temp = JSON.parse(q.options);
                    let str = "";
                    for (let k = 0; k < temp.length; k++) {
                      str += temp[k].index + "." + temp[k].content + " ";
                    }
                    q.options = str;
                  }
                  let findC = new BaaS.TableObject("question_content");
                  findC.get(res.data.question_content_id).then(
                    (ress) => {
                      if (ress.data.content != null) {
                        q.question_content_id = ress.data.content;
                      } else if (ress.data.file_url != null) {
                        q.question_content_id = ress.data.file_url.path;
                      }
                      ques.push(q);
                      if (ques.length == qid.length) {
                        let f = {
                          paper_title: this.der[i].paper_title,
                          paper_type: this.der[i].paper_type,
                          questions_num: this.der[i].questions_num,
                          points: this.der[i].points,
                          catalog: null,
                          questions_detail: ques,
                        };
                        final.push(f);
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
                },
                (err) => {
                  console.log(err);
                }
              );
            }
          }
      }
      let time = 0;
      if (catanum == 0) {
        time = 1000;
      } else {
        time = catanum * 3000;
      }
      if (this.ex == 1) {
        setTimeout(() => {
          let files = [];
          for (let i = 0; i < final.length; i++) {
            let temp = [];
            let t = {
              catalog: final[i].catalog,
              paper_title: final[i].paper_title,
              paper_type: final[i].paper_type,
              questions_num: final[i].questions_num,
              points: final[i].points,
            };
            temp.push(t);
            for (let j = 0; j < final[i].questions_detail.length; j++) {
              let date = new Date(
                final[i].questions_detail[j].created_at * 1000
              );
              let Y = date.getFullYear() + "-";
              let M =
                date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1) + "-"
                  : date.getMonth() + 1 + "-";
              let D =
                date.getDate() < 10
                  ? "0" + date.getDate() + " "
                  : date.getDate() + " ";
              let h =
                date.getHours() < 10
                  ? "0" + date.getHours() + ":"
                  : date.getHours() + ":";
              let m =
                date.getMinutes() < 10
                  ? "0" + date.getMinutes() + ":"
                  : date.getMinutes() + ":";
              let s =
                date.getSeconds() < 10
                  ? "0" + date.getSeconds()
                  : date.getSeconds();
              final[i].questions_detail[j].created_at = Y + M + D + h + m + s;
              temp.push(final[i].questions_detail[j]);
            }
            temp.sort(function (a, b) {
              return a.sequence - b.sequence;
            });
            const testData = {
              试卷或题目文件夹: "catalog",
              试卷标题: "paper_title",
              试卷类型: "paper_type",
              题量: "questions_num",
              总分: "points",
              题号: "sequence",
              分数:"score",
              一级题型: "primary_ques_type",
              二级题型: "secondary_ques_type",
              题干材料: "question_content_id",
              题目: "question",
              选项: "options",
              答案: "answer",
              解析: "analysis",
              等级标准: "grade_standard",
              话题大纲: "topic_outline",
              任务大纲: "task_outline",
              科室: "department",
              题目等级: "ques_level",
              题目类型: "question_class",
              五何类型: "question_type_5he",
              作者: "author",
              作者单位: "author_org",
              出题时间: "time_created",
              创建时间: "created_at",
            };
            const header = Object.keys(testData);
            const data = temp.map((user) => {
              const userArr = [];
              for (const Key in testData) {
                const newKey = testData[Key];
                userArr.push(user[newKey]);
              }
              return userArr;
            });
            let a = {
              fileName: final[i].paper_title,
              file: export_json_to_excel_zip({
                header,
                data,
              }),
            };
            files.push(a);
          }
          downloadZip(files);
          loading.close();
          this.exVisible = false;
          this.$message({
            message: "导出成功",
            type: "success",
          });
        }, time);
      } else if (this.ex == 2) {
        setTimeout(() => {
          let f = [];
          for (let i = 0; i < final.length; i++) {
            final[i].questions_detail.sort(function (a, b) {
              return a.sequence - b.sequence;
            });
            let b = [
              {
                primary: "听力",
                secondary: [
                  {
                    type: "听句子，判断对错",
                    ques: [],
                    start: -1,
                  },
                  {
                    type: "听短对话，选择正确答案",
                    ques: [],
                    start: -1,
                  },
                  {
                    type: "听长对话，选择正确答案",
                    ques: [],
                    start: -1,
                  },
                  {
                    type: "听短文，选择正确答案",
                    ques: [],
                    start: -1,
                  },
                ],
                start: -1,
              },
              {
                primary: "阅读",
                secondary: [
                  {
                    type: "选择正确的词语填空",
                    ques: [],
                    start: -1,
                  },
                  {
                    type: "阅读语段，选择与语段意思一致的一项",
                    ques: [],
                    start: -1,
                  },
                  {
                    type: "阅读材料，选择正确答案",
                    ques: [],
                    start: -1,
                  },
                  {
                    type: "阅读短文，选择正确答案",
                    ques: [],
                    start: -1,
                  },
                ],
                start: -1,
              },
              {
                primary: "写作",
                secondary: [
                  {
                    type: "根据一段长对话写门诊病历记录",
                    ques: [],
                    start: -1,
                  },
                ],
                start: -1,
              },
            ];
            for (let j = 0; j < final[i].questions_detail.length; j++) {
              let date = new Date(
                final[i].questions_detail[j].created_at * 1000
              );
              let Y = date.getFullYear() + "-";
              let M =
                date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1) + "-"
                  : date.getMonth() + 1 + "-";
              let D =
                date.getDate() < 10
                  ? "0" + date.getDate() + " "
                  : date.getDate() + " ";
              let h =
                date.getHours() < 10
                  ? "0" + date.getHours() + ":"
                  : date.getHours() + ":";
              let m =
                date.getMinutes() < 10
                  ? "0" + date.getMinutes() + ":"
                  : date.getMinutes() + ":";
              let s =
                date.getSeconds() < 10
                  ? "0" + date.getSeconds()
                  : date.getSeconds();
              final[i].questions_detail[j].created_at = Y + M + D + h + m + s;
              if (
                final[i].questions_detail[j].question == null ||
                final[i].questions_detail[j].question == undefined ||
                final[i].questions_detail[j].question == "" ||
                final[i].questions_detail[j].question == "null" ||
                final[i].questions_detail[j].question == "undefined"
              ) {
                final[i].questions_detail[j].question = "/";
              }
              if (
                final[i].questions_detail[j].options == null ||
                final[i].questions_detail[j].options == undefined ||
                final[i].questions_detail[j].options == "" ||
                final[i].questions_detail[j].options == "null" ||
                final[i].questions_detail[j].options == "undefined"
              ) {
                final[i].questions_detail[j].options = "/";
              }
              if (
                final[i].questions_detail[j].analysis == null ||
                final[i].questions_detail[j].analysis == undefined ||
                final[i].questions_detail[j].analysis == "" ||
                final[i].questions_detail[j].analysis == "null" ||
                final[i].questions_detail[j].analysis == "undefined"
              ) {
                final[i].questions_detail[j].analysis = "/";
              }
              if (
                final[i].questions_detail[j].catalog == null ||
                final[i].questions_detail[j].catalog == undefined ||
                final[i].questions_detail[j].catalog == "" ||
                final[i].questions_detail[j].catalog == "null" ||
                final[i].questions_detail[j].catalog == "undefined"
              ) {
                final[i].questions_detail[j].catalog = "/";
              }
              if (
                final[i].questions_detail[j].ques_level == null ||
                final[i].questions_detail[j].ques_level == undefined ||
                final[i].questions_detail[j].ques_level == "" ||
                final[i].questions_detail[j].ques_level == "null" ||
                final[i].questions_detail[j].ques_level == "undefined"
              ) {
                final[i].questions_detail[j].ques_level = "/";
              }
              if (
                final[i].questions_detail[j].grade_standard == null ||
                final[i].questions_detail[j].grade_standard == undefined ||
                final[i].questions_detail[j].grade_standard == "" ||
                final[i].questions_detail[j].grade_standard == "null" ||
                final[i].questions_detail[j].grade_standard == "undefined"
              ) {
                final[i].questions_detail[j].grade_standard = "/";
              }
              if (
                final[i].questions_detail[j].topic_outline == null ||
                final[i].questions_detail[j].topic_outline == undefined ||
                final[i].questions_detail[j].topic_outline == "" ||
                final[i].questions_detail[j].topic_outline == "null" ||
                final[i].questions_detail[j].topic_outline == "undefined"
              ) {
                final[i].questions_detail[j].topic_outline = "/";
              }
              if (
                final[i].questions_detail[j].task_outline == null ||
                final[i].questions_detail[j].task_outline == undefined ||
                final[i].questions_detail[j].task_outline == "" ||
                final[i].questions_detail[j].task_outline == "null" ||
                final[i].questions_detail[j].task_outline == "undefined"
              ) {
                final[i].questions_detail[j].task_outline = "/";
              }
              if (
                final[i].questions_detail[j].department == null ||
                final[i].questions_detail[j].department == undefined ||
                final[i].questions_detail[j].department == "" ||
                final[i].questions_detail[j].department == "null" ||
                final[i].questions_detail[j].department == "undefined"
              ) {
                final[i].questions_detail[j].department = "/";
              }
              if (
                final[i].questions_detail[j].question_class == null ||
                final[i].questions_detail[j].question_class == undefined ||
                final[i].questions_detail[j].question_class == "" ||
                final[i].questions_detail[j].question_class == "null" ||
                final[i].questions_detail[j].question_class == "undefined"
              ) {
                final[i].questions_detail[j].question_class = "/";
              }
              if (
                final[i].questions_detail[j].question_type_5he == null ||
                final[i].questions_detail[j].question_type_5he == undefined ||
                final[i].questions_detail[j].question_type_5he == "" ||
                final[i].questions_detail[j].question_type_5he == "null" ||
                final[i].questions_detail[j].question_type_5he == "undefined"
              ) {
                final[i].questions_detail[j].question_type_5he = "/";
              }
              if (
                final[i].questions_detail[j].author == null ||
                final[i].questions_detail[j].author == undefined ||
                final[i].questions_detail[j].author == "" ||
                final[i].questions_detail[j].author == "null" ||
                final[i].questions_detail[j].author == "undefined"
              ) {
                final[i].questions_detail[j].author = "/";
              }
              if (
                final[i].questions_detail[j].author_org == null ||
                final[i].questions_detail[j].author_org == undefined ||
                final[i].questions_detail[j].author_org == "" ||
                final[i].questions_detail[j].author_org == "null" ||
                final[i].questions_detail[j].author_org == "undefined"
              ) {
                final[i].questions_detail[j].author_org = "/";
              }
              if (
                final[i].questions_detail[j].time_created == null ||
                final[i].questions_detail[j].time_created == undefined ||
                final[i].questions_detail[j].time_created == "" ||
                final[i].questions_detail[j].time_created == "null" ||
                final[i].questions_detail[j].time_created == "undefined"
              ) {
                final[i].questions_detail[j].time_created = "/";
              }
              for (let k = 0; k < b.length; k++) {
                if (
                  final[i].questions_detail[j].primary_ques_type == b[k].primary
                ) {
                  if (b[k].start == -1) {
                    b[k].start = final[i].questions_detail[j].sequence;
                  }
                  for (let h = 0; h < b[k].secondary.length; h++) {
                    if (
                      final[i].questions_detail[j].secondary_ques_type ==
                      b[k].secondary[h].type
                    ) {
                      b[k].secondary[h].ques.push(final[i].questions_detail[j]);
                      if (b[k].secondary[h].start == -1) {
                        b[k].secondary[h].start =
                          final[i].questions_detail[j].sequence;
                      }
                      break;
                    }
                  }
                  break;
                }
              }
            }
            for (let z = 0; z < b.length; z++) {
              b[z].secondary.sort(function (c, d) {
                return c.start - d.start;
              });
            }
            b.sort(function (c, d) {
              return c.start - d.start;
            });
            for (let a = 0; a < b.length; a++) {
              if (b[a].start != -1) {
                b.splice(0, a);
                break;
              }
            }
            for (let a = 0; a < b.length; a++) {
              for (let c = 0; c < b[a].secondary.length; c++) {
                if (b[a].secondary[c].start != -1) {
                  b[a].secondary.splice(0, c);
                  break;
                }
              }
            }
            var ImageModule = require("open-docxtemplater-image-module");
            // 点击导出word
            var that = this;
            this.loadFile("export_paper.docx", function (error, content) {
              if (error) {
                throw error;
              }
              let opts = {};
              opts.centered = true; // 图片居中，在word模板中定义方式为{%%image}
              opts.fileType = "docx";
              opts.getImage = function (chartId) {
                return that.base64DataURLToArrayBuffer(chartId);
              };
              opts.getSize = function () {
                return [600, 300];
              };

              let imageModule = new ImageModule(opts);

              var zip = new PizZip(content);
              var doc = new window.docxtemplater().loadZip(zip);
              // doc.attachModule(imageModule);
              doc.setData({
                paper_title: final[i].paper_title,
                paper_type: final[i].paper_type,
                questions_num: final[i].questions_num,
                points: final[i].points,
                b: b,
              });
              try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render();
              } catch (error) {
                var e = {
                  message: error.message,
                  name: error.name,
                  stack: error.stack,
                  properties: error.properties,
                };
                console.log(
                  JSON.stringify({
                    error: e,
                  })
                );
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
              }
              var out = doc.getZip().generate({
                type: "blob",
                mimeType:
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              }); //Output the document using Data-URI
              let a = {
                fileName: final[i].paper_title,
                file: out,
              };
              f.push(a);
              // saveAs(out, "试卷导出.docx");
            });
          }
          setTimeout(() => {
            downloadWordZip(f);
          }, 1000);

          loading.close();
          this.exVisible = false;
          this.$message({
            message: "导出成功",
            type: "success",
          });
        }, time);
      }
      this.$refs.multipleTable.clearSelection();
    },
    base64DataURLToArrayBuffer(dataURL) {
      const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
      if (!base64Regex.test(dataURL)) {
        return false;
      }
      const stringBase64 = dataURL.replace(base64Regex, "");
      let binaryString;
      if (typeof window !== "undefined") {
        binaryString = window.atob(stringBase64);
      } else {
        binaryString = new Buffer(stringBase64, "base64").toString("binary");
      }
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes.buffer;
    },
    loadFile(url, callback) {
      PizZipUtils.getBinaryContent(url, callback);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.paper_top,
.paper_bottom {
  display: flex;
  justify-content: end;
}
</style>