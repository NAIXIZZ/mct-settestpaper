//试卷
<template>
  <div class="paper">
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
        <el-button type="success" plain @click="importFile = true"
          >导入试卷</el-button
        >
        <el-button type="success" plain @click="exp">导出选中</el-button>
        <el-button type="success" plain @click="createFolder"
          >新建文件夹</el-button
        >
        <el-button type="primary" plain @click="multipleMove"
          >移动选中</el-button
        >
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
          :span-method="arraySpanMethod"
          :row-key="
            (row) => {
              return row.id;
            }
          "
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          >
          </el-table-column>
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
                <el-button type="warning" plain @click="copy(scope.row)"
                  >复制</el-button
                >
                <el-button type="danger" plain @click="delPaper(scope.$index,scope.row)"
                  >删除</el-button
                >
                <el-button type="primary" plain @click="moveTo(scope.row.id, 1)"
                  >移动到</el-button
                >
              </div>
              <div v-show="scope.row.catalog != null">
                <el-button type="primary" plain @click="rename(scope.row)"
                  >重命名</el-button
                >
                <el-button
                  type="danger"
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
      <el-button type="primary" icon="el-icon-delete" @click="trash"
        >回收站</el-button
      >
    </div>
    <el-dialog title="创建试卷" :visible.sync="dialogVisible" width="700px">
      <el-radio-group v-model="radio">
        <el-radio :label="1">手动创建试卷</el-radio>
        <el-radio :label="2">自动随机组卷</el-radio>
      </el-radio-group>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="100px"
        class="demo-ruleForm out"
        v-show="radio == 2"
      >
        <el-form-item label="试卷类型" prop="paper_type">
          <el-select
            v-model="ruleForm.paper_type"
            placeholder="请选择试卷类型"
            required
          >
            <el-option label="练习" value="练习"></el-option>
            <el-option label="模考" value="模考"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷标题" prop="paper_title" required>
          <el-input
            v-model="ruleForm.paper_title"
            placeholder="请输入试卷标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="注意：" v-show="ruleForm.paper_type == '模考'">
          <p>默认模考卷题量为101题，总分为300分。</p>
        </el-form-item>
        <el-form-item
          label="听力"
          prop="listen"
          v-show="ruleForm.paper_type == '练习'"
        >
          <el-form
            :model="listenForm"
            ref="listenForm"
            label-width="250px"
            class="demo-ruleForm"
          >
            <el-form-item label="听句子，判断对错" prop="listen_sentence">
              <el-input
                type="number"
                v-model="listenForm.listen_sentence"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="听短对话，选择正确答案" prop="listen_sdialog">
              <el-input
                type="number"
                v-model="listenForm.listen_sdialog"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="听长对话，选择正确答案" prop="listen_ldialog">
              <el-input
                type="number"
                v-model="listenForm.listen_ldialog"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="听短文，选择正确答案" prop="listen_essay">
              <el-input
                type="number"
                v-model="listenForm.listen_essay"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item
          label="阅读"
          prop="read"
          v-show="ruleForm.paper_type == '练习'"
        >
          <el-form
            :model="readForm"
            ref="readForm"
            label-width="250px"
            class="demo-ruleForm"
          >
            <el-form-item label="选择正确的词语填空" prop="read_word">
              <el-input
                type="number"
                v-model="readForm.read_word"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="阅读语段，选择与语段意思一致的一项"
              prop="read_dialog"
            >
              <el-input
                type="number"
                v-model="readForm.read_dialog"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="阅读材料，选择正确答案" prop="read_material">
              <el-input
                type="number"
                v-model="readForm.read_material"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="阅读短文，选择正确答案" prop="read_essay">
              <el-input
                type="number"
                v-model="readForm.read_essay"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item
          label="写作"
          prop="write"
          v-show="ruleForm.paper_type == '练习'"
        >
          <el-form
            :model="writeForm"
            ref="writeForm"
            label-width="250px"
            class="demo-ruleForm"
          >
            <el-form-item label="根据一段长对话写门诊病历记录" prop="write">
              <el-input
                type="number"
                v-model="writeForm.write"
                min="0"
                placeholder="请输入题目数量"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createPaper">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="移动到"
      :visible.sync="moveVisible"
      :before-close="handleClose"
      width="30%"
    >
      <div class="move">
        <el-button v-for="o in catalog" :key="o.index" @click="to(o.catalog)">
          {{ o.catalog }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="导出" :visible.sync="exVisible" width="30%">
      <el-radio v-model="ex" label="1">导出为excel</el-radio>
      <el-radio v-model="ex" label="2">导出为word</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exVisible = false">取 消</el-button>
        <el-button type="primary" @click="derive">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="试卷导入" :visible.sync="importFile">
      <el-upload
        ref="upload"
        action=""
        class="upload-demo"
        drag
        :multiple="false"
        accept=".zip"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :limit="1"
        :file-list="fileList"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">
          请点击下载模板，并按照模板要求上传文件，只能上传zip文件
        </div>
      </el-upload>
      <el-button type="text" @click="downloadTemplate">下载模板</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importFile = false">取 消</el-button>
        <el-button type="primary" @click="componentImport" v-if="sureClick"
          >确 定</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-loading"
          v-if="!sureClick"
        ></el-button>
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
const JSZip = require("jszip");
var XLSX = require("xlsx");
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
      ruleForm: {
        paper_type: "",
        paper_title: "",
      },
      rules: {
        paper_type: [
          { required: true, message: "请选择试卷类型", trigger: "change" },
        ],
        paper_title: [
          { required: true, message: "请输入试卷标题", trigger: "blur" },
        ],
      },
      listenForm: {
        listen_sentence: 10,
        listen_sdialog: 10,
        listen_ldialog: 10,
        listen_essay: 10,
      },
      readForm: {
        read_word: 10,
        read_dialog: 10,
        read_material: 10,
        read_essay: 10,
      },
      writeForm: {
        write: 1,
      },
      fileNum: 0,
      excelFile: [],
      contentFile: [],
      fileList: [],
      importFile: false,
      der: [],
      ex: "1",
      exVisible: false,
      loading: true,
      preMove: [],
      moveVisible: false,
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
      sureClick: true,
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
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      q2.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query, q2);
      let Paper = new BaaS.TableObject("test_paper");
      Paper.limit(1000)
        .offset(0)
        .setQuery(andQuery)
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
            sessionStorage.setItem(
              "paperCatalog",
              JSON.stringify(this.catalog)
            );
            this.loading = false;
            this.tableData = res.data.objects;
            this.initial = this.tableData;
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
        let q2 = new BaaS.Query();
        q2.compare("is_delete", "=", false);
        let andQuery = BaaS.Query.and(query, q2);
        let Catalog = new BaaS.TableObject("test_paper");
        Catalog.setQuery(andQuery)
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
                      this.tableData[index].rename = false;
                      this.tableData[index].have = false;
                      this.addMore = true;
                      this.$message({
                        message: name + "文件创建成功",
                        type: "success",
                      });
                      let temp = {
                        have: false,
                        finish: true,
                        rename: false,
                        catalog: res.data.catalog,
                      };
                      this.catalog.push(temp);
                      sessionStorage.setItem(
                        "paperCatalog",
                        JSON.stringify(this.catalog)
                      );
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
      const loading = this.$loading({
        lock: true,
        text: "正在删除，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let findCata = new BaaS.TableObject("test_paper");
      let findc = new BaaS.Query();
      let q2 = new BaaS.Query();
      findc.compare("catalog", "=", row.catalog);
      q2.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(findc, q2);
      findCata
        .setQuery(andQuery)
        .find()
        .then(
          (res) => {
            for (let i = 0; i < res.data.objects.length; i++) {
              let Catalog = new BaaS.TableObject("test_paper");
              let cata = Catalog.getWithoutData(res.data.objects[i].id);
              cata.set("is_delete", true);
              cata.update().then(
                (res) => {
                  console.log(res);
                  loading.close();
                  this.$message({
                    message: "文件夹删除成功",
                    type: "success",
                  });
                  this.tableData.splice(index, 1);
                  for (let i = 0; i < this.catalog.length; i++) {
                    if (this.catalog[i].catalog == row.catalog) {
                      this.catalog.splice(i, 1);
                      sessionStorage.setItem(
                        "paperCatalog",
                        JSON.stringify(this.catalog)
                      );
                      break;
                    }
                  }
                },
                (err) => {
                  loading.close();
                  this.$message({
                    message: "文件夹删除失败",
                    type: "warning",
                  });
                  console.log(err);
                }
              );
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    enterFolder(row) {
      Cookies.set("make_out", "third");
      Cookies.set("catalog", row.catalog);
      Cookies.set("catalogall", JSON.stringify(this.catalog));
      this.$router.push("/paperCatalog");
    },
    createPaper() {
      if (this.radio == 1) {
        this.$router.push("/mcreatePaper");
        Cookies.set("make_out", "third");
      } else if (this.radio == 2) {
        if (this.ruleForm.paper_title == "" || this.ruleForm.paper_type == "") {
          this.$message({
            message: "请填写试卷类型或试卷标题",
            type: "warning",
          });
        } else {
          const loading = this.$loading({
            lock: true,
            text: "正在组卷中，请稍后",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          let findQ = new BaaS.TableObject("questions_information");
          let q1 = new BaaS.Query();
          let q2 = new BaaS.Query();
          q2.compare("is_delete", "=", false);
          q1.compare("created_by", "=", 409976063038241);
          let andQuery = BaaS.Query.and(q1, q2);
          findQ
            .setQuery(andQuery)
            .limit(1000)
            .find()
            .then(
              (res) => {
                let temp = res.data.objects;
                let autoq = [];
                for (let i = 0; i < temp.length; ) {
                  i++;
                  let random = parseInt(Math.random() * temp.length);
                  if (!autoq.includes(temp[random])) {
                    autoq.push(temp[random]);
                  } else {
                    i--;
                  }
                }
                let ques = [];
                if (this.ruleForm.paper_type == "模考") {
                  let l1 = 0,
                    l2 = 10,
                    l3 = 20,
                    l4 = 30,
                    r1 = 50,
                    r2 = 60,
                    r3 = 70,
                    r4 = 80,
                    w = 100;
                  for (let i = 0; i < autoq.length; i++) {
                    if (
                      autoq[i].secondary_ques_type == "听句子，判断对错" &&
                      l1 < 10
                    ) {
                      l1++;
                      autoq[i].score = 2;
                      autoq[i].sequence = l1;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "听短对话，选择正确答案" &&
                      l2 < 20
                    ) {
                      l2++;
                      autoq[i].score = 2;
                      autoq[i].sequence = l2;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "听长对话，选择正确答案" &&
                      l3 < 30
                    ) {
                      l3++;
                      autoq[i].score = 2;
                      autoq[i].sequence = l3;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type == "听短文，选择正确答案" &&
                      l4 < 50
                    ) {
                      l4++;
                      autoq[i].score = 2;
                      autoq[i].sequence = l4;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type == "选择正确的词语填空" &&
                      r1 < 60
                    ) {
                      r1++;
                      autoq[i].score = 2;
                      autoq[i].sequence = r1;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "阅读语段，选择与语段意思一致的一项" &&
                      r2 < 70
                    ) {
                      r2++;
                      autoq[i].score = 2;
                      autoq[i].sequence = r2;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "阅读材料，选择正确答案" &&
                      r3 < 80
                    ) {
                      r3++;
                      autoq[i].score = 2;
                      autoq[i].sequence = r3;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "阅读短文，选择正确答案" &&
                      r4 < 100
                    ) {
                      r4++;
                      autoq[i].score = 2;
                      autoq[i].sequence = r4;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "根据一段长对话写门诊病历记录" &&
                      w < 101
                    ) {
                      w++;
                      autoq[i].score = 100;
                      autoq[i].sequence = w;
                      ques.push(autoq[i]);
                    }
                  }
                } else {
                  let l1 = 0,
                    l2 = this.listenForm.listen_sentence * 1,
                    l3 = l2 + this.listenForm.listen_sdialog * 1,
                    l4 = l3 + this.listenForm.listen_ldialog * 1,
                    r1 = l4 + this.listenForm.listen_essay * 1,
                    r2 = r1 + this.readForm.read_word * 1,
                    r3 = r2 + this.readForm.read_dialog * 1,
                    r4 = r3 + this.readForm.read_material * 1,
                    w = r4 + this.readForm.read_essay * 1;
                  for (let i = 0; i < autoq.length; i++) {
                    if (
                      autoq[i].secondary_ques_type == "听句子，判断对错" &&
                      l1 < this.listenForm.listen_sentence * 1
                    ) {
                      l1++;
                      autoq[i].score = 2;
                      autoq[i].sequence = l1;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "听短对话，选择正确答案" &&
                      l2 <
                        this.listenForm.listen_sentence * 1 +
                          this.listenForm.listen_sdialog * 1
                    ) {
                      l2++;
                      autoq[i].score = 2;
                      autoq[i].sequence = l2;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "听长对话，选择正确答案" &&
                      l3 <
                        this.listenForm.listen_sentence * 1 +
                          this.listenForm.listen_sdialog * 1 +
                          this.listenForm.listen_ldialog * 1
                    ) {
                      l3++;
                      autoq[i].score = 2;
                      autoq[i].sequence = l3;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type == "听短文，选择正确答案" &&
                      l4 <
                        this.listenForm.listen_sentence * 1 +
                          this.listenForm.listen_sdialog * 1 +
                          this.listenForm.listen_ldialog * 1 +
                          this.listenForm.listen_essay * 1
                    ) {
                      l4++;
                      autoq[i].score = 2;
                      autoq[i].sequence = l4;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type == "选择正确的词语填空" &&
                      r1 <
                        this.listenForm.listen_sentence * 1 +
                          this.listenForm.listen_sdialog * 1 +
                          this.listenForm.listen_ldialog * 1 +
                          this.listenForm.listen_essay * 1 +
                          this.readForm.read_word * 1
                    ) {
                      r1++;
                      autoq[i].score = 2;
                      autoq[i].sequence = r1;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "阅读语段，选择与语段意思一致的一项" &&
                      r2 <
                        this.listenForm.listen_sentence * 1 +
                          this.listenForm.listen_sdialog * 1 +
                          this.listenForm.listen_ldialog * 1 +
                          this.listenForm.listen_essay * 1 +
                          this.readForm.read_word * 1 +
                          this.readForm.read_dialog * 1
                    ) {
                      r2++;
                      autoq[i].score = 2;
                      autoq[i].sequence = r2;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "阅读材料，选择正确答案" &&
                      r3 <
                        this.listenForm.listen_sentence * 1 +
                          this.listenForm.listen_sdialog * 1 +
                          this.listenForm.listen_ldialog * 1 +
                          this.listenForm.listen_essay * 1 +
                          this.readForm.read_word * 1 +
                          this.readForm.read_dialog * 1 +
                          this.readForm.read_material * 1
                    ) {
                      r3++;
                      autoq[i].score = 2;
                      autoq[i].sequence = r3;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "阅读短文，选择正确答案" &&
                      r4 <
                        this.listenForm.listen_sentence * 1 +
                          this.listenForm.listen_sdialog * 1 +
                          this.listenForm.listen_ldialog * 1 +
                          this.listenForm.listen_essay * 1 +
                          this.readForm.read_word * 1 +
                          this.readForm.read_dialog * 1 +
                          this.readForm.read_material * 1 +
                          this.readForm.read_essay * 1
                    ) {
                      r4++;
                      autoq[i].score = 2;
                      autoq[i].sequence = r4;
                      ques.push(autoq[i]);
                    } else if (
                      autoq[i].secondary_ques_type ==
                        "根据一段长对话写门诊病历记录" &&
                      w <
                        this.listenForm.listen_sentence * 1 +
                          this.listenForm.listen_sdialog * 1 +
                          this.listenForm.listen_ldialog * 1 +
                          this.listenForm.listen_essay * 1 +
                          this.readForm.read_word * 1 +
                          this.readForm.read_dialog * 1 +
                          this.readForm.read_material * 1 +
                          this.readForm.read_essay * 1 +
                          this.writeForm.write * 1
                    ) {
                      w++;
                      autoq[i].score = 100;
                      autoq[i].sequence = w;
                      ques.push(autoq[i]);
                    }
                  }
                }
                ques.sort(function (a, b) {
                  return a.sub_sequence - b.sub_sequence;
                });
                let questions = [];
                let contents = [];
                for (let i = 0; i < ques.length; i++) {
                  let temp =
                    ques[i].question_content_id +
                    ques[i].primary_ques_type +
                    ques[i].secondary_ques_type;
                  let s = {
                    temp: temp,
                    content_id: ques[i].question_content_id,
                    primary_ques_type: ques[i].primary_ques_type,
                    secondary_ques_type: ques[i].secondary_ques_type,
                  };
                  contents.push(s);
                  ques[i].temp = temp;
                  let sub = {
                    sub_sequence: 0,
                    actual_sequence: ques[i].sequence,
                    score: ques[i].score,
                    question: ques[i].question,
                    options: JSON.parse(ques[i].options),
                    answer: ques[i].answer,
                    anlysis: ques[i].anlysis,
                    level_value: ques[i].ques_level,
                    grade_value: ques[i].grade_standard,
                    topic_value: ques[i].topic_outline,
                    task_value: ques[i].task_outline,
                    department_value: ques[i].department,
                    qclass_value: ques[i].question_class,
                    fivehe_value: ques[i].question_type_5he,
                    A: "",
                    B: "",
                    C: "",
                    D: "",
                    author: ques[i].author,
                    author_org: ques[i].author_org,
                    time_created: ques[i].time_created,
                  };
                  let op = JSON.parse(ques[i].options);
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
                      setTimeout(() => {
                        let content = new BaaS.TableObject("question_content");
                        content.get(qc[j].content_id).then(
                          (con) => {
                            let question = {
                              primary_ques_type: qc[j].primary_ques_type,
                              secondary_ques_type: qc[j].secondary_ques_type,
                              total_score: score,
                              saveQ: true,
                              saveT: true,
                              question_content: "",
                              sub_question: [],
                            };
                            if (con.data.file_url != null) {
                              question.question_content =
                                con.data.file_url.path;
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
                              let acts = 1;
                              for (let h = 0; h < questions.length; h++) {
                                questions[h].sequence = sequen;
                                questions[h].name =
                                  questions[h].sequence.toString();
                                sequen++;
                                for (
                                  let g = 0;
                                  g < questions[h].sub_question.length;
                                  g++
                                ) {
                                  questions[h].sub_question[g].sub_sequence =
                                    g + 1;
                                  questions[h].sub_question[g].actual_sequence =
                                    acts;
                                  acts++;
                                }
                              }
                              let ll1 = 0,
                                ll2 = 0,
                                ll3 = 0,
                                ll4 = 0,
                                rr1 = 0,
                                rr2 = 0,
                                rr3 = 0,
                                rr4 = 0,
                                ww = 0;
                              let sl1 = 0,
                                sl2 = 0,
                                sl3 = 0,
                                sl4 = 0,
                                sr1 = 0,
                                sr2 = 0,
                                sr3 = 0,
                                sr4 = 0,
                                sw = 0;
                              let ssl1 = 0,
                                ssl2 = 0,
                                ssl3 = 0,
                                ssl4 = 0,
                                ssr1 = 0,
                                ssr2 = 0,
                                ssr3 = 0,
                                ssr4 = 0,
                                ssw = 0;
                              for (let z = 0; z < questions.length; z++) {
                                if (
                                  questions[z].secondary_ques_type ==
                                  "听句子，判断对错"
                                ) {
                                  ll1++;
                                  sl1 += questions[z].sub_question.length;
                                  ssl1 += questions[z].total_score;
                                } else if (
                                  questions[z].secondary_ques_type ==
                                  "听短对话，选择正确答案"
                                ) {
                                  ll2++;
                                  sl2 += questions[z].sub_question.length;
                                  ssl2 += questions[z].total_score;
                                } else if (
                                  questions[z].secondary_ques_type ==
                                  "听长对话，选择正确答案"
                                ) {
                                  ll3++;
                                  sl3 += questions[z].sub_question.length;
                                  ssl3 += questions[z].total_score;
                                } else if (
                                  questions[z].secondary_ques_type ==
                                  "听短文，选择正确答案"
                                ) {
                                  ll4++;
                                  sl4 += questions[z].sub_question.length;
                                  ssl4 += questions[z].total_score;
                                } else if (
                                  questions[z].secondary_ques_type ==
                                  "选择正确的词语填空"
                                ) {
                                  rr1++;
                                  sr1 += questions[z].sub_question.length;
                                  ssr1 += questions[z].total_score;
                                } else if (
                                  questions[z].secondary_ques_type ==
                                  "阅读语段，选择与语段意思一致的一项"
                                ) {
                                  rr2++;
                                  sr2 += questions[z].sub_question.length;
                                  ssr2 += questions[z].total_score;
                                } else if (
                                  questions[z].secondary_ques_type ==
                                  "阅读材料，选择正确答案"
                                ) {
                                  rr3++;
                                  sr3 += questions[z].sub_question.length;
                                  ssr3 += questions[z].total_score;
                                } else if (
                                  questions[z].secondary_ques_type ==
                                  "阅读短文，选择正确答案"
                                ) {
                                  rr4++;
                                  sr4 += questions[z].sub_question.length;
                                  ssr4 += questions[z].total_score;
                                } else if (
                                  questions[z].secondary_ques_type ==
                                  "根据一段长对话写门诊病历记录"
                                ) {
                                  ww++;
                                  sw += questions[z].sub_question.length;
                                  ssw += questions[z].total_score;
                                }
                              }
                              let ques_type = [
                                {
                                  primary: "听力",
                                  secondary: [
                                    {
                                      type: "听句子，判断对错",
                                      start: 0,
                                      end: ll1 - 1,
                                      hoverS: false,
                                      num: sl1,
                                      score: ssl1,
                                    },
                                    {
                                      type: "听短对话，选择正确答案",
                                      start: ll1,
                                      end: ll1 + ll2 - 1,
                                      hoverS: false,
                                      num: sl2,
                                      score: ssl2,
                                    },
                                    {
                                      type: "听长对话，选择正确答案",
                                      start: ll1 + ll2,
                                      end: ll1 + ll2 + ll3 - 1,
                                      hoverS: false,
                                      num: sl3,
                                      score: ssl3,
                                    },
                                    {
                                      type: "听短文，选择正确答案",
                                      start: ll1 + ll2 + ll3,
                                      end: ll1 + ll2 + ll3 + ll4 - 1,
                                      hoverS: false,
                                      num: sl4,
                                      score: ssl4,
                                    },
                                  ],
                                  hoverP: false,
                                  total_num: sl1 + sl2 + sl3 + sl4,
                                  total_score: ssl1 + ssl2 + ssl3 + ssl4,
                                },
                                {
                                  primary: "阅读",
                                  secondary: [
                                    {
                                      type: "选择正确的词语填空",
                                      start: ll1 + ll2 + ll3 + ll4,
                                      end: ll1 + ll2 + ll3 + ll4 + rr1 - 1,
                                      hoverS: false,
                                      num: sr1,
                                      score: ssr1,
                                    },
                                    {
                                      type: "阅读语段，选择与语段意思一致的一项",
                                      start: ll1 + ll2 + ll3 + ll4 + rr1,
                                      end:
                                        ll1 + ll2 + ll3 + ll4 + rr1 + rr2 - 1,
                                      hoverS: false,
                                      num: sr2,
                                      score: ssr2,
                                    },
                                    {
                                      type: "阅读材料，选择正确答案",
                                      start: ll1 + ll2 + ll3 + ll4 + rr1 + rr2,
                                      end:
                                        ll1 +
                                        ll2 +
                                        ll3 +
                                        ll4 +
                                        rr1 +
                                        rr2 +
                                        rr3 -
                                        1,
                                      hoverS: false,
                                      num: sr3,
                                      score: ssr3,
                                    },
                                    {
                                      type: "阅读短文，选择正确答案",
                                      start:
                                        ll1 + ll2 + ll3 + ll4 + rr1 + rr2 + rr3,
                                      end:
                                        ll1 +
                                        ll2 +
                                        ll3 +
                                        ll4 +
                                        rr1 +
                                        rr2 +
                                        rr3 +
                                        rr4 -
                                        1,
                                      hoverS: false,
                                      num: sr4,
                                      score: ssr4,
                                    },
                                  ],
                                  hoverP: false,
                                  total_num: sr1 + sr2 + sr3 + sr4,
                                  total_score: ssr1 + ssr2 + ssr3 + ssr4,
                                },
                                {
                                  primary: "写作",
                                  secondary: [
                                    {
                                      type: "根据一段长对话写门诊病历记录",
                                      start:
                                        ll1 +
                                        ll2 +
                                        ll3 +
                                        ll4 +
                                        rr1 +
                                        rr2 +
                                        rr3 +
                                        rr4,
                                      end:
                                        ll1 +
                                        ll2 +
                                        ll3 +
                                        ll4 +
                                        rr1 +
                                        rr2 +
                                        rr3 +
                                        rr4 +
                                        ww -
                                        1,
                                      hoverS: false,
                                      num: sw,
                                      score: ssw,
                                    },
                                  ],
                                  hoverP: false,
                                  total_num: sw,
                                  total_score: ssw,
                                },
                              ];
                              let p = [];
                              let s = [];
                              for (let q = 0; q < ques_type.length; q++) {
                                if (ques_type[q].total_num == 0) {
                                  p.push(q);
                                }
                              }
                              p.sort(function (a, b) {
                                return b - a;
                              });
                              console.log(p);
                              for (let q = 0; q < p.length; q++) {
                                ques_type.splice(p[q], 1);
                              }
                              for (let q = 0; q < ques_type.length; q++) {
                                let t = {
                                  p: q,
                                  s: [],
                                };
                                for (
                                  let w = 0;
                                  w < ques_type[q].secondary.length;
                                  w++
                                ) {
                                  if (ques_type[q].secondary[w].num == 0) {
                                    t.s.push(w);
                                  }
                                }
                                if (t.s.length != 0) {
                                  s.push(t);
                                }
                              }
                              s.sort(function (a, b) {
                                return b.p - a.p;
                              });
                              for (let q = 0; q < s.length; q++) {
                                s[q].s.sort(function (a, b) {
                                  return b - a;
                                });
                              }
                              for (let q = 0; q < s.length; q++) {
                                for (let w = 0; w < s[q].s.length; w++) {
                                  ques_type[s[q].p].secondary.splice(
                                    s[q].s[w],
                                    1
                                  );
                                }
                              }
                              console.log(questions, ques_type);
                              sessionStorage.setItem(
                                "questions",
                                JSON.stringify(questions)
                              );
                              sessionStorage.setItem(
                                "ques_type",
                                JSON.stringify(ques_type)
                              );
                              sessionStorage.setItem("currentQues", 1);
                              sessionStorage.setItem(
                                "currentSubQues",
                                questions[0].sub_question.length
                              );
                              sessionStorage.setItem(
                                "title",
                                this.ruleForm.paper_title
                              );
                              if (this.ruleForm.paper_type == "模考") {
                                sessionStorage.setItem("exam", true);
                              } else {
                                sessionStorage.setItem("exam", false);
                              }
                              sessionStorage.setItem(
                                "ques_num",
                                sl1 +
                                  sl2 +
                                  sl3 +
                                  sl4 +
                                  sr1 +
                                  sr2 +
                                  sr3 +
                                  sr4 +
                                  sw
                              );
                              sessionStorage.setItem(
                                "ques_score",
                                ssl1 +
                                  ssl2 +
                                  ssl3 +
                                  ssl4 +
                                  ssr1 +
                                  ssr2 +
                                  ssr3 +
                                  ssr4 +
                                  ssw
                              );
                              loading.close();
                              Cookies.set("make_out", "third");
                              this.$router.push("/mcreatePaper");
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                      }, 2000);
                    }
                  }
                }
              },
              (err) => {
                console.log(err);
              }
            );
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
    preview(val) {
      const loading = this.$loading({
        lock: true,
        text: "请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      Cookies.set("paper_id", val.id);
      Cookies.set("paper_title", val.paper_title);
      Cookies.set("questions_detail", val.questions_detail);
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
                      audio: "",
                      file_url: "",
                      fileList: [],
                    };
                    if (con.data.file_url != null) {
                      if (
                        con.data.file_url.path.search(".png") != -1 ||
                        con.data.file_url.path.search(".jpg") != -1 ||
                        con.data.file_url.path.search(".gif") != -1
                      ) {
                        question.file_url = con.data.file_url.path;
                      } else if (
                        con.data.file_url.path.search(".mp3") != -1 ||
                        con.data.file_url.path.search(".wav") != -1 ||
                        con.data.file_url.path.search(".ogg") != -1
                      ) {
                        question.audio = con.data.file_url.path;
                        question.fileList.push({
                          name: con.data.file_url.name,
                          url: con.data.file_url.path,
                        });
                      }
                    }
                    question.question_content = con.data.content;
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
                      Cookies.set("make_out", "third");
                      loading.close();
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
    multipleMove() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择移动项",
          type: "warning",
        });
      } else {
        let ca = false;
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].catalog != null) {
            this.$message({
              message: "文件夹不可移动",
              type: "warning",
            });
            ca = true;
            break;
          }
        }
        if (ca == false) {
          let temp = [];
          this.multipleSelection.forEach((element) => {
            temp.push(element.id);
          });
          this.moveTo(temp, 2);
        }
      }
    },
    moveTo(val, type) {
      if (type == 1) {
        this.preMove.push(val);
      } else if (type == 2) {
        this.preMove = val;
      }
      this.moveVisible = true;
    },
    handleClose() {
      this.preMove = [];
      this.moveVisible = false;
    },
    to(val) {
      for (let i = 0; i < this.preMove.length; i++) {
        let Catalog = new BaaS.TableObject("test_paper");
        let cata = Catalog.getWithoutData(this.preMove[i]);
        cata.set("catalog", val);
        cata.update().then(
          (res) => {
            console.log(res);
            this.$message({
              message: "移动成功",
              type: "success",
            });
            this.handleClose();
            this.init();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
    copy(val) {
      const loading = this.$loading({
        lock: true,
        text: "正在复制，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
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
            loading.close();
            this.$message({
              message: "复制成功",
              type: "success",
            });
            this.init();
          },
          (err) => {
            loading.close();
            this.$message({
              message: "复制失败",
              type: "warning",
            });
            this.init();
            console.log(err);
          }
        );
    },
    delPaper(index,val) {
      const loading = this.$loading({
        lock: true,
        text: "正在删除，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let Ques = new BaaS.TableObject("test_paper");
      let ques = Ques.getWithoutData(val.id);
      ques.set("is_delete", true);
      ques.update().then(
        (res) => {
          console.log(res);
          loading.close();
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.tableData.splice(index,1)
        },
        (err) => {
          loading.close();
          this.$message({
            message: "删除失败",
            type: "warning",
          });
          this.init();
          console.log(err);
        }
      );
    },
    trash() {
      Cookies.set("make_out", "third");
      Cookies.set("trash", "paper");
      this.$router.push("/trash_list");
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
        if (this.der[i].catalog != null) {
          catanum++;
          let query = new BaaS.Query();
          query.compare("created_by", "=", Cookie.get("user_id") * 1);
          let que = new BaaS.Query();
          que.compare("catalog", "=", this.der[i].catalog);
          let q3 = new BaaS.Query();
          q3.compare("is_delete", "=", false);
          let andQuery = BaaS.Query.and(query, que, q3);
          let Question = new BaaS.TableObject("test_paper");
          Question.orderBy("-created_at")
            .limit(1000)
            .offset(0)
            .setQuery(andQuery)
            .find()
            .then(
              (res) => {
                if (
                  !(
                    res.data.objects.length == 1 &&
                    res.data.objects[0].paper_title == null
                  )
                ) {
                  for (let i = 0; i < res.data.objects.length; i++) {
                    if (res.data.objects[i].paper_title == null) {
                      res.data.objects.splice(i, 1);
                      break;
                    }
                  }
                  res.data.objects.forEach((element) => {
                    if (element.paper_title != null) {
                      let ques = [];
                      let qid = JSON.parse(element.questions_detail);
                      for (let j = 0; j < qid.length; j++) {
                        let findQ = new BaaS.TableObject(
                          "questions_information"
                        );
                        findQ.get(qid[j].id).then(
                          (res) => {
                            let q = res.data;
                            q.sequence = qid[j].sub_sequence;
                            q.score = qid[j].score;
                            if (q.options != null) {
                              let temp = JSON.parse(q.options);
                              let str = "";
                              for (let k = 0; k < temp.length; k++) {
                                str +=
                                  temp[k].index + "." + temp[k].content + " ";
                              }
                              q.options = str;
                            }
                            let findC = new BaaS.TableObject(
                              "question_content"
                            );
                            findC.get(res.data.question_content_id).then(
                              (ress) => {
                                if (ress.data.content != null) {
                                  q.question_content_id = ress.data.content;
                                } else if (ress.data.file_url != null) {
                                  q.question_content_id =
                                    ress.data.file_url.path;
                                }
                                ques.push(q);
                                if (ques.length == qid.length) {
                                  ques.sort(function (a, b) {
                                    return a.sub_sequence - b.sub_sequence;
                                  });
                                  let f = {
                                    paper_title: element.paper_title,
                                    paper_type: element.paper_type,
                                    questions_num: element.questions_num,
                                    points: element.points,
                                    catalog: element.catalog,
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
                  });
                }
              },
              (err) => {
                console.log(err);
              }
            );
        } else {
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
      }
      let time = 0;
      if (catanum == 0) {
        time = 2000;
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
              分数: "score",
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
            console.log(f);
            downloadWordZip(f);
            loading.close();
            this.exVisible = false;
            this.$message({
              message: "导出成功",
              type: "success",
            });
          }, time * 2);
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
    downloadTemplate() {
      let Template = new BaaS.File();
      Template.get("63106c9e7ac49940abea8529").then(
        (res) => {
          // console.log(res);
          let viewUrl = res.data.path;
          window.open(viewUrl, "_self");
        },
        (err) => {
          console.log(err);
        }
      );
    },
    beforeAvatarUpload(file) {
      let isFile =
        file.name.split(".")[file.name.split(".").length - 1] == "zip";
      if (!isFile) {
        this.$message.error("导入文件格式不正确");
      }
      return isFile;
    },
    // 读取压缩文件
    async componentImport() {
      const loading = this.$loading({
        lock: true,
        text: "正在导入中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const zip = new JSZip();
      const zipData = await zip.loadAsync(this.fileList[0].raw);
      var i = 0;
      this.fileNum = Object.keys(zipData.files).length;
      this.sureClick = false;
      let temp = {};
      for (let key in zipData.files) {
        if (!zipData.files[key].dir) {
          if (
            /\.(png)$/.test(zipData.files[key].name) ||
            /\.(jpg)$/.test(zipData.files[key].name) ||
            /\.(gif)$/.test(zipData.files[key].name) ||
            /\.(mp3)$/.test(zipData.files[key].name) ||
            /\.(wav)$/.test(zipData.files[key].name) ||
            /\.(ogg)$/.test(zipData.files[key].name)
          ) {
            // this.fileType = "png";
            let base = await zip.file(zipData.files[key].name).async("base64"); // 以base64输出文本内容
            const result = this.dataURLtoFile(base, zipData.files[key].name);
            // console.log(result);
            await new Promise((resolve, reject) => {
              let File = new BaaS.File();
              let audio = { fileObj: result };
              File.upload(audio).then(
                (res) => {
                  let Content = new BaaS.TableObject("question_content");
                  let content = Content.create();
                  content.set("file_url", res.data.file);
                  content.set("content", null);
                  content.set("catalog", null);
                  content
                    .save()
                    .then((res2) => {
                      var a = {
                        name: res2.data.file_url.name,
                        id: res2.data.id,
                      };
                      this.contentFile.push(a);
                      resolve(0);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                },
                (err) => {
                  console.log(err);
                }
              );
            });
          } else if (/\.(xlsx)$/.test(zipData.files[key].name)) {
            // this.fileType = "xlsx";
            let base = await zip.file(zipData.files[key].name).async("base64"); // 以base64输出文本内容
            const result = this.dataURLtoFile(base, zipData.files[key].name);
            // console.log(result);
            if (typeof FileReader === "undefined") {
              this.$message({
                type: "info",
                message: "您的浏览器不支持FileReader接口",
              });
              return;
            }
            let reader = new FileReader();
            reader.readAsBinaryString(result);
            reader.onload = function (e) {
              try {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: "binary" });
                var wsname = workbook.SheetNames[0]; // 取第一张表
                var ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // 生成json表格内容
                ws.forEach((element) => {
                  if (element.catalog == undefined || element.catalog == "") {
                    element.catalog = null;
                  }
                  if (
                    element.paper_title == undefined ||
                    element.paper_title == ""
                  ) {
                    element.paper_title = null;
                  }
                  if (
                    element.paper_type == undefined ||
                    element.paper_type == ""
                  ) {
                    element.paper_type = null;
                  }
                  if (
                    element.questions_num == undefined ||
                    element.questions_num == ""
                  ) {
                    element.questions_num = null;
                  }
                  if (element.points == undefined || element.points == "") {
                    element.points = null;
                  }
                  if (element.sequence == undefined || element.sequence == "") {
                    element.sequence = null;
                  }
                  if (element.score == undefined || element.score == "") {
                    element.score = null;
                  }
                  if (
                    element.primary_ques_type == undefined ||
                    element.primary_ques_type == ""
                  ) {
                    element.primary_ques_type = null;
                  }
                  if (
                    element.secondary_ques_type == undefined ||
                    element.secondary_ques_type == ""
                  ) {
                    element.secondary_ques_type = null;
                  }
                  if (
                    element.question_content == undefined ||
                    element.question_content == ""
                  ) {
                    element.question_content = null;
                  }
                  if (element.question == undefined || element.question == "") {
                    element.question = null;
                  }
                  if (element.options == undefined || element.options == "") {
                    element.options = null;
                  }
                  if (element.answer == undefined || element.answer == "") {
                    element.answer = null;
                  }
                  if (element.analysis == undefined || element.analysis == "") {
                    element.analysis = null;
                  }
                  if (
                    element.department == undefined ||
                    element.department == ""
                  ) {
                    element.department = null;
                  } else {
                    element.department = element.department.split("，");
                  }
                  if (
                    element.ques_level == undefined ||
                    element.ques_level == ""
                  ) {
                    element.ques_level = null;
                  }
                  if (
                    element.question_class == undefined ||
                    element.question_class == ""
                  ) {
                    element.question_class = null;
                  }
                  if (
                    element.question_type_5he == undefined ||
                    element.question_type_5he == ""
                  ) {
                    element.question_type_5he = null;
                  }
                  if (element.author == undefined || element.author == "") {
                    element.author = null;
                  }
                  if (
                    element.author_org == undefined ||
                    element.author_org == ""
                  ) {
                    element.author_org = null;
                  }
                  if (
                    element.time_created == undefined ||
                    element.time_created == ""
                  ) {
                    element.time_created = null;
                  }
                  if (
                    element.grade_standard == undefined ||
                    element.grade_standard == ""
                  ) {
                    element.grade_standard = null;
                  }
                  if (element.topic == undefined || element.topic == "") {
                    element.topic = null;
                  }
                  if (element.task == undefined || element.task == "") {
                    element.task = null;
                  }
                  var a = {
                    catalog: element.catalog,
                    paper_title: element.paper_title,
                    paper_type: element.paper_type,
                    questions_num: element.questions_num,
                    points: element.points,
                    sequence: element.sequence,
                    score: element.score,
                    primary_ques_type: element.primary_ques_type,
                    secondary_ques_type: element.secondary_ques_type,
                    question_content_id: element.question_content,
                    question: element.question,
                    options: element.options,
                    answer: element.answer,
                    analysis: element.analysis,
                    department: element.department,
                    ques_level: element.ques_level,
                    question_class: element.question_class,
                    question_type_5he: element.question_type_5he,
                    author: element.author,
                    author_org: element.author_org,
                    time_created: element.time_created,
                    grade_standard: element.grade_standard,
                    topic_outline: element.topic,
                    task_outline: element.task,
                  };
                  if (element.paper_title == null) {
                    this.excelFile.push(a);
                  } else {
                    temp = {
                      catalog: element.catalog,
                      paper_title: element.paper_title,
                      paper_type: element.paper_type,
                      questions_num: element.questions_num,
                      points: element.points,
                    };
                  }
                });
              } catch (e) {
                console.log(e);
                return false;
              }
            }.bind(this);
          }
        }
        i++;
        let questions_detail = [];
        let ques_type = [
          {
            primary: "听力",
            secondary: [
              {
                type: "听句子，判断对错",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
              {
                type: "听短对话，选择正确答案",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
              {
                type: "听长对话，选择正确答案",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
              {
                type: "听短文，选择正确答案",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
            ],
            hoverP: false,
            total_score: 0,
            total_num: 0,
            start: -1,
          },
          {
            primary: "阅读",
            secondary: [
              {
                type: "选择正确的词语填空",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
              {
                type: "阅读语段，选择与语段意思一致的一项",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
              {
                type: "阅读材料，选择正确答案",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
              {
                type: "阅读短文，选择正确答案",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
            ],
            hoverP: false,
            total_score: 0,
            total_num: 0,
            start: -1,
          },
          {
            primary: "写作",
            secondary: [
              {
                type: "根据一段长对话写门诊病历记录",
                start: -1,
                end: -1,
                hoverS: false,
                score: 0,
                num: 0,
              },
            ],
            hoverP: false,
            total_score: 0,
            total_num: 0,
            start: -1,
          },
        ];
        if (i == this.fileNum) {
          var arr = new Array();
          this.excelFile.forEach((element) => {
            var findContent = false;
            this.contentFile.forEach((item) => {
              if (element.question_content_id == item.name) {
                element.question_content_id = item.id;
                findContent = true;
                let importQ = new BaaS.TableObject("questions_information");
                let importq = importQ.create();
                importq
                  .set(element)
                  .save()
                  .then(
                    (res) => {
                      let q = {
                        id: res.data.id,
                        sub_sequence: element.sequence,
                        score: element.score,
                      };
                      questions_detail.push(q);
                      if (questions_detail.length == this.excelFile.length) {
                        let num = 0;
                        questions_detail.sort(function (a, b) {
                          return a.sub_sequence - b.sub_sequence;
                        });
                        for (let a = 0; a < this.excelFile.length; a++) {
                          for (let b = 0; b < ques_type.length; b++) {
                            if (
                              this.excelFile[a].primary_ques_type ==
                              ques_type[b].primary
                            ) {
                              for (
                                let c = 0;
                                c < ques_type[b].secondary.length;
                                c++
                              ) {
                                if (
                                  this.excelFile[a].secondary_ques_type ==
                                  ques_type[b].secondary[c].type
                                ) {
                                  ques_type[b].secondary[c].num++;
                                  ques_type[b].secondary[c].score +=
                                    this.excelFile[a].score;
                                  ques_type[b].total_num++;
                                  ques_type[b].total_score +=
                                    this.excelFile[a].score;
                                  if (ques_type[b].secondary[c].start == -1) {
                                    ques_type[b].secondary[c].start =
                                      this.excelFile[a].sequence - 1 - num;
                                    ques_type[b].secondary[c].end =
                                      this.excelFile[a].sequence - 1 - num;
                                    ques_type[b].start =
                                      this.excelFile[a].sequence - 1 - num;
                                  } else if (
                                    this.excelFile[a].question_content_id !=
                                    this.excelFile[a - 1].question_content_id
                                  ) {
                                    ques_type[b].secondary[c].end++;
                                  } else {
                                    num++;
                                  }
                                }
                              }
                            }
                          }
                        }
                        for (let a = 0; a < ques_type.length; a++) {
                          ques_type[a].secondary.sort(function (c, d) {
                            return c.start - d.start;
                          });
                        }
                        ques_type.sort(function (c, d) {
                          return c.start - d.start;
                        });
                        for (let a = 0; a < ques_type.length; a++) {
                          if (ques_type[a].start != -1) {
                            ques_type.splice(0, a);
                            break;
                          }
                        }
                        for (let a = 0; a < ques_type.length; a++) {
                          for (
                            let b = 0;
                            b < ques_type[a].secondary.length;
                            b++
                          ) {
                            if (ques_type[a].secondary[b].start != -1) {
                              ques_type[a].secondary.splice(0, b);
                              break;
                            }
                          }
                        }
                        let saveP = new BaaS.TableObject("test_paper");
                        let savep = saveP.create();
                        let s = {
                          paper_title: temp.paper_title,
                          paper_type: temp.paper_type,
                          questions_num: temp.questions_num,
                          points: temp.points,
                          is_delete: false,
                          catalog: temp.catalog,
                          questions_detail: JSON.stringify(questions_detail),
                          ques_type: JSON.stringify(ques_type),
                        };
                        savep
                          .set(s)
                          .save()
                          .then(
                            (res) => {
                              // console.log(res)
                              this.$message({
                                message: "导入成功",
                                type: "success",
                              });
                              loading.close();
                              this.importFile = false;
                              this.init();
                            },
                            (err) => {
                              console.log(err);
                            }
                          );
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
                return;
              }
            });
            if (findContent == false) {
              var a = {
                content: element.question_content_id,
                id: null,
              };
              arr.push(a);
            }
          });
          if (arr.length != 0) {
            const map = new Map();
            const qc = arr.filter(
              (key) => !map.has(key.content) && map.set(key.content, 1)
            );
            var k = 0;
            qc.forEach((element) => {
              // console.log(element)
              let Content = new BaaS.TableObject("question_content");
              let content = new BaaS.Query();
              content.compare("content", "=", element.content);
              Content.setQuery(content)
                .find()
                .then(
                  (res) => {
                    if (res.data.objects.length == 1) {
                      element.id = res.data.objects[0].id;
                      k++;
                      if (k == qc.length) {
                        this.excelFile.forEach((element) => {
                          var a = qc.findIndex(
                            (item) =>
                              item.content === element.question_content_id
                          );
                          if (a != -1) {
                            element.question_content_id = qc[a].id;
                            let importQ = new BaaS.TableObject(
                              "questions_information"
                            );
                            let importq = importQ.create();
                            importq
                              .set(element)
                              .save()
                              .then(
                                (res) => {
                                  let q = {
                                    id: res.data.id,
                                    sub_sequence: element.sequence,
                                    score: element.score,
                                  };
                                  questions_detail.push(q);
                                  if (
                                    questions_detail.length ==
                                    this.excelFile.length
                                  ) {
                                    let num = 0;
                                    questions_detail.sort(function (a, b) {
                                      return a.sub_sequence - b.sub_sequence;
                                    });

                                    for (
                                      let a = 0;
                                      a < this.excelFile.length;
                                      a++
                                    ) {
                                      for (
                                        let b = 0;
                                        b < ques_type.length;
                                        b++
                                      ) {
                                        if (
                                          this.excelFile[a].primary_ques_type ==
                                          ques_type[b].primary
                                        ) {
                                          for (
                                            let c = 0;
                                            c < ques_type[b].secondary.length;
                                            c++
                                          ) {
                                            if (
                                              this.excelFile[a]
                                                .secondary_ques_type ==
                                              ques_type[b].secondary[c].type
                                            ) {
                                              ques_type[b].secondary[c].num++;
                                              ques_type[b].secondary[c].score +=
                                                this.excelFile[a].score;
                                              ques_type[b].total_num++;
                                              ques_type[b].total_score +=
                                                this.excelFile[a].score;
                                              if (
                                                ques_type[b].secondary[c]
                                                  .start == -1
                                              ) {
                                                ques_type[b].secondary[
                                                  c
                                                ].start =
                                                  this.excelFile[a].sequence -
                                                  1 -
                                                  num;
                                                ques_type[b].secondary[c].end =
                                                  this.excelFile[a].sequence -
                                                  1 -
                                                  num;
                                                ques_type[b].start =
                                                  this.excelFile[a].sequence -
                                                  1 -
                                                  num;
                                              } else if (
                                                this.excelFile[a]
                                                  .question_content_id !=
                                                this.excelFile[a - 1]
                                                  .question_content_id
                                              ) {
                                                ques_type[b].secondary[c].end++;
                                              } else {
                                                num++;
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                    for (let a = 0; a < ques_type.length; a++) {
                                      ques_type[a].secondary.sort(function (
                                        c,
                                        d
                                      ) {
                                        return c.start - d.start;
                                      });
                                    }
                                    ques_type.sort(function (c, d) {
                                      return c.start - d.start;
                                    });
                                    for (let a = 0; a < ques_type.length; a++) {
                                      if (ques_type[a].start != -1) {
                                        ques_type.splice(0, a);
                                        break;
                                      }
                                    }
                                    for (let a = 0; a < ques_type.length; a++) {
                                      for (
                                        let b = 0;
                                        b < ques_type[a].secondary.length;
                                        b++
                                      ) {
                                        if (
                                          ques_type[a].secondary[b].start != -1
                                        ) {
                                          ques_type[a].secondary.splice(0, b);
                                          break;
                                        }
                                      }
                                    }
                                    let saveP = new BaaS.TableObject(
                                      "test_paper"
                                    );
                                    let savep = saveP.create();
                                    let s = {
                                      paper_title: temp.paper_title,
                                      paper_type: temp.paper_type,
                                      questions_num: temp.questions_num,
                                      points: temp.points,
                                      is_delete: false,
                                      catalog: temp.catalog,
                                      questions_detail:
                                        JSON.stringify(questions_detail),
                                      ques_type: JSON.stringify(ques_type),
                                    };
                                    savep
                                      .set(s)
                                      .save()
                                      .then(
                                        (res) => {
                                          this.$message({
                                            message: "导入成功",
                                            type: "success",
                                          });
                                          loading.close();
                                          this.importFile = false;
                                          this.init();
                                        },
                                        (err) => {
                                          console.log(err);
                                        }
                                      );
                                  }
                                },
                                (err) => {
                                  console.log(err);
                                }
                              );
                          }
                        });
                      }
                    } else if (res.data.objects.length == 0) {
                      let addContent = new BaaS.TableObject("question_content");
                      let add = addContent.create();
                      add.set("content", element.content);
                      add.save().then(
                        (res) => {
                          element.id = res.data.id;
                          k++;
                          if (k == qc.length) {
                            this.excelFile.forEach((element) => {
                              var a = qc.findIndex(
                                (item) =>
                                  item.content === element.question_content_id
                              );
                              if (a != -1) {
                                element.question_content_id = qc[a].id;
                                let importQ = new BaaS.TableObject(
                                  "questions_information"
                                );
                                let importq = importQ.create();
                                importq
                                  .set(element)
                                  .save()
                                  .then(
                                    (res) => {
                                      let q = {
                                        id: res.data.id,
                                        sub_sequence: element.sequence,
                                        score: element.score,
                                      };
                                      questions_detail.push(q);
                                      if (
                                        questions_detail.length ==
                                        this.excelFile.length
                                      ) {
                                        let num = 0;
                                        questions_detail.sort(function (a, b) {
                                          return (
                                            a.sub_sequence - b.sub_sequence
                                          );
                                        });

                                        for (
                                          let a = 0;
                                          a < this.excelFile.length;
                                          a++
                                        ) {
                                          for (
                                            let b = 0;
                                            b < ques_type.length;
                                            b++
                                          ) {
                                            if (
                                              this.excelFile[a]
                                                .primary_ques_type ==
                                              ques_type[b].primary
                                            ) {
                                              for (
                                                let c = 0;
                                                c <
                                                ques_type[b].secondary.length;
                                                c++
                                              ) {
                                                if (
                                                  this.excelFile[a]
                                                    .secondary_ques_type ==
                                                  ques_type[b].secondary[c].type
                                                ) {
                                                  ques_type[b].secondary[c]
                                                    .num++;
                                                  ques_type[b].secondary[
                                                    c
                                                  ].score +=
                                                    this.excelFile[a].score;
                                                  ques_type[b].total_num++;
                                                  ques_type[b].total_score +=
                                                    this.excelFile[a].score;
                                                  if (
                                                    ques_type[b].secondary[c]
                                                      .start == -1
                                                  ) {
                                                    ques_type[b].secondary[
                                                      c
                                                    ].start =
                                                      this.excelFile[a]
                                                        .sequence -
                                                      1 -
                                                      num;
                                                    ques_type[b].secondary[
                                                      c
                                                    ].end =
                                                      this.excelFile[a]
                                                        .sequence -
                                                      1 -
                                                      num;
                                                    ques_type[b].start =
                                                      this.excelFile[a]
                                                        .sequence -
                                                      1 -
                                                      num;
                                                  } else if (
                                                    this.excelFile[a]
                                                      .question_content_id !=
                                                    this.excelFile[a - 1]
                                                      .question_content_id
                                                  ) {
                                                    ques_type[b].secondary[c]
                                                      .end++;
                                                  } else {
                                                    num++;
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                        for (
                                          let a = 0;
                                          a < ques_type.length;
                                          a++
                                        ) {
                                          ques_type[a].secondary.sort(function (
                                            c,
                                            d
                                          ) {
                                            return c.start - d.start;
                                          });
                                        }
                                        ques_type.sort(function (c, d) {
                                          return c.start - d.start;
                                        });
                                        for (
                                          let a = 0;
                                          a < ques_type.length;
                                          a++
                                        ) {
                                          if (ques_type[a].start != -1) {
                                            ques_type.splice(0, a);
                                            break;
                                          }
                                        }
                                        for (
                                          let a = 0;
                                          a < ques_type.length;
                                          a++
                                        ) {
                                          for (
                                            let b = 0;
                                            b < ques_type[a].secondary.length;
                                            b++
                                          ) {
                                            if (
                                              ques_type[a].secondary[b].start !=
                                              -1
                                            ) {
                                              ques_type[a].secondary.splice(
                                                0,
                                                b
                                              );
                                              break;
                                            }
                                          }
                                        }
                                        let saveP = new BaaS.TableObject(
                                          "test_paper"
                                        );
                                        let savep = saveP.create();
                                        let s = {
                                          paper_title: temp.paper_title,
                                          paper_type: temp.paper_type,
                                          questions_num: temp.questions_num,
                                          points: temp.points,
                                          is_delete: false,
                                          catalog: temp.catalog,
                                          questions_detail:
                                            JSON.stringify(questions_detail),
                                          ques_type: JSON.stringify(ques_type),
                                        };
                                        savep
                                          .set(s)
                                          .save()
                                          .then(
                                            (res) => {
                                              this.$message({
                                                message: "导入成功",
                                                type: "success",
                                              });
                                              loading.close();
                                              this.importFile = false;
                                              this.init();
                                            },
                                            (err) => {
                                              console.log(err);
                                            }
                                          );
                                      }
                                    },
                                    (err) => {
                                      console.log(err);
                                    }
                                  );
                              }
                            });
                          }
                        },
                        (err) => {
                          console.log(err);
                        }
                      );
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            });
          }
        }
      }
      // 清空文件列表
      this.fileList = [];
      this.sureClick = true;
    },
    /**
     * @description 将 base64 转换为 File 对象
     * @param {String} dataURL base64 的编码
     * @param {String} fileName 文件名称
     * @param {String} fileType 文件类型，默认为 excel 类型
     * @returns {File} File 对象
     */
    dataURLtoFile(dataURL, fileName, fileType) {
      /**
       * 注意：【不同文件不同类型】，例如【图片类型】就是`data:image/png;base64,${dataURL}`.split(',')
       * 下面的是【excel文件(.xlsx尾缀)】的文件类型拼接，一个完整的 base64 应该
       * 是这样的,例如： data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
       */
      // if (this.fileType == "xlsx") {
      //   fileType =
      //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      // } else if (this.fileType == "png") {
      //   fileType = "image/png";
      // } else if (this.fileType == "mp3") {
      //   fileType = "audio/mp3";
      // }
      const arr = `data:${fileType};base64,${dataURL}`.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      var name = fileName.split("/");
      let blob = new File([u8arr], name[name.length - 1], { type: mime });
      return blob;
    },
    handleChange(file, fileList) {
      this.fileList.push(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.paper .move,
.paperCatalog .move {
  display: flex;
  flex-direction: column;
}
.paper .move .el-button + .el-button,
.paperCatalog .move .el-button + .el-button {
  margin-left: 0px;
}
.paper .out {
  margin-top: 20px;
}
.paper .out .el-select {
  width: 558px;
}
</style>