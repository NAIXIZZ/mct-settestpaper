//查看题目
<template>
  <div class="checkQues">
    <div class="ques_top">
      <div class="ques_select">
        <el-cascader
          :options="ques_select"
          :props="{
            multiple: true,
            expandTrigger: 'hover',
          }"
          clearable
          placeholder="请选择题型"
          @change="type_select"
        ></el-cascader>
        <!-- <el-select
          v-model="value"
          clearable
          placeholder="是否使用"
          @change="usage"
          @clear="use_clear"
        >
          <el-option
            v-for="item in use"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
        <div class="ques_search">
          <el-input
            v-model="input"
            placeholder="搜索题目或选项"
            @clear="use_clear"
            clearable
          ></el-input>
          <el-button type="success" @click="title_search(input)"
            >搜索</el-button
          >
        </div>
      </div>
      <div class="top_button">
        <el-button type="success" plain @click="handleSet">自动出题</el-button>
        <el-button type="success" plain @click="addQuestion"
          >添加题目</el-button
        >
        <el-button type="success" plain @click="importFile = true"
          >批量导入</el-button
        >
      </div>
    </div>
    <div class="ques_content">
      <div class="ques_list">
        <el-table
          ref="multipleTable"
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" :index="indexMethod"> </el-table-column>
          <el-table-column prop="question" label="题目" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="primary_ques_type" label="一级题型">
          </el-table-column>
          <el-table-column prop="secondary_ques_type" label="二级题型">
          </el-table-column>
          <!-- <el-table-column prop="usage_amount" label="使用量" sortable>
          </el-table-column> -->
          <el-table-column prop="created_at" label="创建日期" sortable>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="success" plain @click="check_edit(scope.row.id)"
                >查看/编辑</el-button
              >
              <el-button type="warning" plain @click="copy(scope.row)"
                >复制</el-button
              >
              <el-button type="danger" plain @click="delQues(scope.row)"
                >删除</el-button
              >
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
    <div class="ques_bottom">
      <div class="bottom_button">
        <el-button type="success" plain>导出选中</el-button>
        <el-button type="success" plain>删除选中</el-button>
        <el-button type="success" plain>批量复制</el-button>
        <el-button type="success" plain>导出全部</el-button>
      </div>
      <el-button type="primary" icon="el-icon-delete" @click="trash"
        >回收站</el-button
      >
    </div>
    <el-dialog title="自动出题" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="题目数量：" :label-width="formLabelWidth">
          <el-input v-model="form.quesnum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目类型：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择题型"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setQues">保存到题库</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量导入" :visible.sync="importFile">
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
const JSZip = require("jszip");
var XLSX = require("xlsx");
var BaaS = require("minapp-sdk");
let clientID = "395062a19e209a770059";
BaaS.init(clientID);
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import topic_outlineVue from "../../../components/outline/topic_outline.vue";
import task_outlineVue from "../../outline/task_outline.vue";
import grade_standardVue from "../../outline/grade_standard.vue";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      importFile: false,
      ques_select: [
        {
          value: "听力题",
          label: "听力题",
          children: [
            {
              value: "听句子，判断对错",
              label: "听句子，判断对错",
            },
            {
              value: "听短对话，选择正确答案",
              label: "听短对话，选择正确答案",
            },
            {
              value: "听长对话，选择正确答案",
              label: "听长对话，选择正确答案",
            },
            {
              value: "听短文，选择正确答案",
              label: "听短文，选择正确答案",
            },
          ],
        },
        {
          value: "阅读题",
          label: "阅读题",
          children: [
            {
              value: "选择正确词语填空",
              label: "选择正确词语填空",
            },
            {
              value: "阅读语段，选择与语段意思一致的一项",
              label: "阅读语段，选择与语段意思一致的一项",
            },
            {
              value: "阅读材料，选择正确答案",
              label: "阅读材料，选择正确答案",
            },
            {
              value: "阅读短文，选择正确答案",
              label: "阅读短文，选择正确答案",
            },
          ],
        },
        {
          value: "写作题",
          label: "写作题",
        },
      ],
      use: [
        {
          value: "是",
          label: "是",
        },
        {
          value: "否",
          label: "否",
        },
      ],
      type: "",
      value: "",
      input: "",
      initial: [],
      tableData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      form: {
        title: "",
        quesnum: "",
      },
      formLabelWidth: "120px",
      currentPage: 1,
      pageSize: 10,
      fileList: [],
      sureClick: true,
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let query = new BaaS.Query();
      let q2 = new BaaS.Query();
      let q3 = new BaaS.Query();
      query.compare("question_content_id", "=", Cookie.get("material_id"));
      q2.compare("created_by", "=", Cookie.get("user_id") * 1);
      q3.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query, q2, q3);
      let Question = new BaaS.TableObject("questions_information");
      Question.setQuery(andQuery)
        .find()
        .then(
          (res) => {
            // console.log(res);
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
            });
            this.tableData = res.data.objects;
            this.initial = this.tableData;
            // console.log(this.tableData);
          },
          (err) => {
            console.log(err);
          }
        );
    },
    type_select(type) {
      if (type == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var type_select = new Array();
        // console.log(type);
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
          // console.log(type_select);
          this.tableData = type_select;
        }
      }
    },
    usage(use) {
      // console.log(this.value);
      var use_select = new Array();
      if (use === "") {
        this.use_clear();
      } else {
        if (use == "是") {
          this.tableData = this.initial;
          this.tableData.forEach((element) => {
            if (element.usage_amount > 0) {
              use_select.push(element);
            }
          });
        } else if (use == "否") {
          this.tableData = this.initial;
          this.tableData.forEach((element) => {
            if (element.usage_amount == 0) {
              use_select.push(element);
            }
          });
        }
        if (use_select.length == 0) {
          this.$message("无匹配数据");
        } else {
          this.$message({
            message: "查询到" + use_select.length + "项数据",
            type: "success",
          });
          console.log(use_select);
          this.tableData = use_select;
        }
      }
    },
    use_clear() {
      this.tableData = this.initial;
    },
    title_search(val) {
      console.log(val);
      if (val == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var title_search = new Array();
        this.tableData.forEach((element) => {
          console.log(element.ques_content);
          console.log(element.options);
          if (
            (element.question != null && element.question.search(val) != -1) ||
            (element.options != null && element.options.search(val) != -1)
          ) {
            title_search.push(element);
          } else {
            if (element.sub_ques != null) {
              element.sub_ques.forEach((item) => {
                this.all_ques.forEach((ques) => {
                  if (item == ques.id) {
                    if (
                      (ques.question != null &&
                        ques.question.search(val) != -1) ||
                      (ques.options != null && ques.options.search(val) != -1)
                    ) {
                      title_search.push(element);
                    }
                  }
                });
              });
            }
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
    delQues(val) {
      let Ques = new BaaS.TableObject("questions_information");
      let ques = Ques.getWithoutData(val.id);
      ques.set("is_delete", true);
      ques.update().then(
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
    addQuestion() {
      this.$router.push("/addQuestion");
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
      const zip = new JSZip();
      const zipData = await zip.loadAsync(this.fileList[0].raw);
      var i = 0;
      this.fileNum = Object.keys(zipData.files).length;
      this.sureClick = false;
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
                    for (let i = 0; i < element.department.length; i++) {
                      let findID = new BaaS.TableObject("department");
                      let findid = new BaaS.Query();
                      findid.compare("department", "=", element.department[i]);
                      findID
                        .setQuery(findid)
                        .find()
                        .then(
                          (res) => {
                            if (res.data.objects.length == 0) {
                              let addKno = new BaaS.TableObject("department");
                              let addkno = addKno.create();
                              addkno.set("department", element.department[i]);
                              addkno.save().then(
                                (res) => {
                                  element.department[i] = res.data.id;
                                },
                                (err) => {
                                  console.log(err);
                                }
                              );
                            } else {
                              element.department[i] = res.data.objects[0].id;
                            }
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                    }
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
                  var a = {
                    catalog: element.catalog,
                    primary_ques_type: element.primary_ques_type,
                    secondary_ques_type: element.secondary_ques_type,
                    question_content_id: element.question_content,
                    question: element.question,
                    options: element.options,
                    answer: element.answer,
                    analysis: element.analysis,
                    knowledge_id: element.knowledge,
                    source_id: element.source,
                    test_id: element.test,
                    department: element.department,
                    sub_sequence: element.sub_sequence,
                    ques_level: element.ques_level,
                    question_class: element.question_class,
                    question_type_5he: element.question_type_5he,
                    author: element.author,
                    author_org: element.author_org,
                    time_created: element.time_created,
                  };
                  this.excelFile.push(a);
                });
              } catch (e) {
                console.log(e);
                return false;
              }
            }.bind(this);
          }
        }
        i++;
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
                      // console.log(res);
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
                                  // console.log(res);
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
                                      // console.log(res);
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
    downloadTemplate() {
      let Template = new BaaS.File();
      Template.get("62496310685599564c86a5c9").then(
        (res) => {
          // console.log(res);
          let viewUrl = res.data.path;
          console.log(viewUrl);
          window.open(viewUrl, "_self");
        },
        (err) => {
          console.log(err);
        }
      );
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
    copy(val) {
      let findQ = new BaaS.TableObject("questions_information");
      findQ.get(val.id).then(
        (res) => {
          let addQ = new BaaS.TableObject("questions_information");
          let add = addQ.create();
          let temp = {
            question_content_id: res.data.question_content_id,
            primary_ques_type: val.primary_ques_type,
            secondary_ques_type: val.secondary_ques_type,
            question: val.question,
            options: val.options,
            answer: val.answer,
            analysis: val.analysis,
            department: val.department,
            is_delete: false,
            catalog: val.catalog,
            ques_level: val.ques_level,
            question_class: val.question_class,
            question_type_5he: val.question_type_5he,
            author: null,
            author_org: null,
            time_created: null,
            topic_outline: val.topic_outline,
            task_outline: val.task_outline,
            grade_standard: val.grade_standard,
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
        (err) => {
          console.log(err);
        }
      );
    },
    trash() {
      Cookies.set("trash", "questions");
      this.$router.push("/trash_list");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },
    handleSet() {
      //   Cookies.set("material_id", val);
      this.dialogFormVisible = true;
    },
    setQues() {
      this.dialogFormVisible = false;
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
    check_edit(val) {
      Cookies.set("ques_checkEdit", val);
      this.$router.push("/ques_checkEdit");
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.ques_top {
  display: flex;
  justify-content: space-between;
}
.ques_select {
  display: flex;
}
.ques_search .el-button {
  height: fit-content;
}
.ques_select .el-cascader,
.ques_select .el-select {
  margin-right: 10px;
}
.ques_search {
  display: flex;
  margin-right: 10px;
}
.ques_content {
  margin-bottom: 10px;
}
.ques_num {
  display: flex;
  float: right;
}
.ques_bottom {
  display: flex;
  justify-content: space-between;
}
</style>