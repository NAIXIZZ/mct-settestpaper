//试卷
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
        <el-button type="success" plain @click="dialogVisible = true"
          >创建试卷</el-button
        >
        <el-button type="success" plain>导入试卷</el-button>
        <el-button type="success" plain>导出全部</el-button>
        <el-button type="success" plain>导出选中</el-button>
        <el-button type="success" plain @click="createFolder"
          >新建文件夹</el-button
        >
      </div>
    </div>
    <div class="ques_content">
      <div class="ques_list">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :span-method="arraySpanMethod"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" :index="indexMethod"> </el-table-column>
          <el-table-column label="文件夹" prop="catalog">
            <template slot-scope="scope">
              <div class="folder" v-show="scope.row.finish == false">
                <i class="el-icon-folder"></i>
                <el-input
                  v-model="scope.row.catalog"
                  placeholder="请输入文件夹名称"
                >
                </el-input>
                <i
                  class="el-icon-success"
                  @click="addFolder(scope.$index, scope.row.catalog)"
                ></i>
                <i
                  class="el-icon-error"
                  @click="cancelFolder(scope.$index)"
                ></i>
              </div>
              <div class="folder" v-show="scope.row.rename == true">
                <i class="el-icon-folder"></i>
                <el-input
                  v-model="scope.row.catalog"
                  placeholder="请输入文件夹名称"
                >
                </el-input>
                <i
                  class="el-icon-success"
                  @click="renameDefine(scope.$index, scope.row)"
                ></i>
                <i
                  class="el-icon-error"
                  @click="cancelRename(scope.$index, scope.row)"
                ></i>
              </div>
              <div
                class="folder"
                v-show="scope.row.finish && scope.row.rename == false"
                @click="enterFolder(scope.row)"
              >
                <i class="el-icon-folder"></i>
                <span>{{ scope.row.catalog }}</span>
              </div>
            </template>
          </el-table-column>
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
              <div v-show="scope.row.paper_title != null">
                <el-button type="success" plain @click="preview(scope.row)"
                  >查看/编辑</el-button
                >
                <el-button type="warning" plain>复制</el-button>
                <el-button type="danger" plain>删除</el-button>
                <el-button type="primary" plain>移动到</el-button>
              </div>
              <div v-show="scope.row.catalog != null">
                <el-button type="primary" plain @click="rename(scope.row)"
                  >重命名</el-button
                >
                <el-button
                  type="primary"
                  plain
                  @click="delCatalog(scope.$index, scope.row)"
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
      <el-button type="primary" icon="el-icon-delete">回收站</el-button>
    </div>
    <el-dialog title="创建试卷" :visible.sync="dialogVisible" width="30%">
      <el-radio-group v-model="radio">
        <el-radio :label="1">手动创建试卷</el-radio>
        <el-radio :label="2">自动随机组卷</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createPaper">确 定</el-button>
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
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var query = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      let Paper = new BaaS.TableObject("test_paper");
      Paper.limit(1000)
        .offset(0)
        .setQuery(query)
        .orderBy("-created_at")
        .find()
        .then(
          (res) => {
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
              if (element.catalog != null) {
                var a = {
                  finish: true,
                  rename: false,
                  catalog: element.catalog,
                };
                this.catalog.push(a);
              }
            });
            if (this.catalog.length != 0) {
              const map = new Map();
              this.catalog = this.catalog.filter(
                (key) => !map.has(key.catalog) && map.set(key.catalog, 1)
              );
            }
            this.catalog.forEach((element) => {
              res.data.objects = res.data.objects.filter(
                (t) => t.catalog != element.catalog
              );
              res.data.objects.unshift(element);
            });
            this.tableData = res.data.objects;
            this.initial = this.tableData;
          },
          (err) => {
            console.log(err);
          }
        );

      // let Material = new BaaS.TableObject("material");
      // Material.setQuery(query)
      //   .find()
      //   .then(
      //     (res) => {
      //       console.log(res);
      //     },
      //     (err) => {
      //       console.log(err);
      //     }
      //   );
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
    arraySpanMethod({ rowIndex, columnIndex }) {
      if (
        this.tableData[rowIndex].finish == false ||
        this.tableData[rowIndex].catalog != null
      ) {
        if (columnIndex === 2) {
          return [1, 2];
        } else if (columnIndex === 3) {
          return [0, 0];
        }
      }
    },
    createFolder() {
      if (this.addMore == true) {
        this.addMore = false;
        var folder = {
          finish: false,
          rename: false,
          catalog: null,
          content: null,
          file_url: null,
        };
        this.tableData.push(folder);
        for (let i = this.tableData.length - 1; i > 0; i--) {
          this.tableData[i] = this.tableData[i - 1];
        }
        this.tableData[0] = folder;
      } else {
        this.$message({
          message: "请先创建文件夹或取消",
          type: "error",
        });
      }
    },
    addFolder(index, name) {
      let reg = new RegExp("^[^\\s]*$");
      if (name == null || name == "") {
        this.$message({
          message: "请输入文件名",
          type: "error",
        });
      } else if (reg.test(name) == false) {
        this.$message({
          message: "文件名不能输入空格",
          type: "error",
        });
      } else {
        let query = new BaaS.Query();
        query.compare("catalog", "=", name);
        let Catalog = new BaaS.TableObject("test_paper");
        Catalog.setQuery(query)
          .find()
          .then(
            (res) => {
              if (res.data.objects.length == 0) {
                let catalog = Catalog.create();
                let add = {
                  content: null,
                  file_url: null,
                  catalog: name,
                };
                catalog
                  .set(add)
                  .save()
                  .then(
                    (res) => {
                      this.tableData[index].id = res.data.id;
                      this.tableData[index].catalog = res.data.catalog;
                      this.tableData[index].finish = true;
                      this.addMore = true;
                      this.$message({
                        message: name + "文件创建成功",
                        type: "success",
                      });
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              } else {
                this.$message({
                  message: "该文件名已存在，请重新命名",
                  type: "error",
                });
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
    },
    cancelFolder(index) {
      this.tableData.splice(index, 1);
      this.addMore = true;
    },
    rename(row) {
      row.rename = true;
      this.previousName = row.catalog;
    },
    renameDefine(index, row) {
      let query = new BaaS.Query();
      query.compare("catalog", "=", row.catalog);
      let Catalog = new BaaS.TableObject("test_paper");
      Catalog.setQuery(query)
        .find()
        .then(
          (res) => {
            if (res.data.objects.length == 0) {
              let catalog = Catalog.getWithoutData(row.id);
              catalog.set("catalog", row.catalog);
              catalog.update().then(
                (res) => {
                  console.log(res);
                  row.rename = false;
                  this.$message({
                    message: "文件重命名成功",
                    type: "success",
                  });
                },
                (err) => {
                  console.log(err);
                }
              );
            } else {
              this.$message({
                message: "该文件名已存在，请重新命名",
                type: "error",
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    cancelRename(index, row) {
      row.catalog = this.previousName;
      row.rename = false;
      this.previousName = "";
    },
    delCatalog(index, row) {
      let Catalog = new BaaS.TableObject("test_paper");
      Catalog.delete(row.id).then(
        (res) => {
          console.log(res);
          this.tableData.splice(index, 1);
          this.$message({
            message: "文件删除成功",
            type: "success",
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    enterFolder(row) {
      Cookies.set("make_out","third")
      Cookies.set("catalog", row.catalog);
      this.$router.push("/paperCatalog");
    },
    createPaper() {
      if (this.radio == 1) {
        this.$router.push("/mcreatePaper");
        Cookies.set("make_out", "third");
      } else if (this.radio == 2) {
        // this.$router.push("/acreatePaper");
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
                      questions.sort(function(a,b) {
                        return a.sub_question[0].actual_sequence - b.sub_question[0].actual_sequence;
                      });
                      let sequen=1
                      for(let h=0;h<questions.length;h++){
                        questions[h].sequence=sequen
                        questions[h].name=questions[h].sequence.toString()
                        sequen++
                      }
                      sessionStorage.setItem(
                        "questions",
                        JSON.stringify(questions)
                      );
                      sessionStorage.setItem("ques_type", val.ques_type);
                      sessionStorage.setItem("currentQues", questions.length);
                      sessionStorage.setItem(
                        "currentSubQues",
                        questions[questions.length-1].sub_question.length
                      );
                      sessionStorage.setItem("title", val.paper_title);
                      if (val.paper_type == "模考") {
                        sessionStorage.setItem("exam", true);
                      } else {
                        sessionStorage.setItem("exam", false);
                      }
                      sessionStorage.setItem("ques_num", val.questions_num);
                      sessionStorage.setItem("ques_score", val.points);
                      Cookies.set("paperEdit",true)
                      Cookies.set("paperInfo",val.id)
                      Cookies.set("make_out","third")
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
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
/* .paper_top, .paper_bottom{
    display: flex;
    justify-content: end;
} */
</style>