//题库
<template>
  <div class="question">
    <div class="ques_top">
      <div class="ques_select">
        <el-cascader
          v-model="type"
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
            clearable
            @clear="use_clear"
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
        <el-button type="success" plain @click="createFolder"
          >新建文件夹</el-button
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
          <el-table-column
            prop="question_content_id"
            label="题目"
            show-overflow-tooltip
            width="300"
          >
            <template slot-scope="scope">
              <audio
                :src="scope.row.question_content_id"
                controls="controls"
                v-if="
                  scope.row.question_content_id &&
                  scope.row.question_content_id.search('.mp3') != -1
                "
                style="width: 250px"
              ></audio>
              <el-image
                :preview-src-list="srcList"
                :src="scope.row.question_content_id"
                v-else-if="
                  scope.row.question_content_id &&
                  scope.row.question_content_id.search('.png') != -1
                "
              ></el-image>
              <p v-else>{{ scope.row.question_content_id }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="primary_ques_type" label="一级题型">
          </el-table-column>
          <el-table-column prop="secondary_ques_type" label="二级题型">
          </el-table-column>
          <!-- <el-table-column prop="usage_amount" label="使用量" sortable>
          </el-table-column> -->
          <!-- <el-table-column prop="source_id" label="来源"> </el-table-column> -->
          <el-table-column prop="created_at" label="创建日期" sortable>
          </el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <div v-show="scope.row.primary_ques_type != null">
                <el-button
                  type="success"
                  plain
                  @click="
                    check_edit(scope.row.id, scope.row.question_content_id)
                  "
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
    <div class="ques_bottom">
      <div class="bottom_button">
        <el-button type="success" plain>导出选中</el-button>
        <el-button type="success" plain>删除选中</el-button>
        <el-button type="success" plain>导出全部</el-button>
      </div>
      <el-button type="primary" icon="el-icon-delete">回收站</el-button>
    </div>
    <el-dialog title="自动出题" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="等级：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择等级"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="等级标准：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择等级标准"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="话题大纲：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择话题大纲"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="任务大纲：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择任务大纲"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="系统：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择系统"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="选择题干材料：" :label-width="formLabelWidth">
          <el-select
            v-model="form.title"
            autocomplete="off"
            clearable
            placeholder="请选择题干材料"
          >
            <el-option
              v-for="item in material"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="五何类型：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择五何类型"
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
import Cookies from "js-cookie";
import Cookie from "js-cookie";
const JSZip = require("jszip");
var XLSX = require("xlsx");
var BaaS = require("minapp-sdk");
let clientID = "395062a19e209a770059";
BaaS.init(clientID);
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      addFileName: "",
      initial: [],
      srcList: [],
      importFile: false,
      fileList: [],
      addMore: true,
      previousName: "",
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
              value: "选择正确的词语填空",
              label: "选择正确的词语填空",
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
              value: "阅读短文，选出正确答案",
              label: "阅读短文，选出正确答案",
            },
          ],
        },
        {
          value: "写作题",
          label: "写作题",
          children: [
            {
              value: "根据一段长对话写门诊病历记录",
              label: "根据一段长对话写门诊病历记录",
            },
          ],
        },
      ],
      type: "",
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
      value: "",
      input: "",
      tableData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      form: {
        title: "",
        quesnum: "",
      },
      formLabelWidth: "120px",
      material: [
        {
          value: "新型冠状病毒诊疗分析",
          label: "新型冠状病毒诊疗分析",
        },
        {
          value: "脑梗死患者电子病历标注",
          label: "脑梗死患者电子病历标注",
        },
      ],
      currentPage: 1,
      pageSize: 10,
      // fileType: "",
      excelFile: [],
      contentFile: [],
      fileNum: 0,
      sureClick: true,
      catalog: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
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
                  // if (
                  //   element.knowledge == undefined ||
                  //   element.knowledge == ""
                  // ) {
                  //   element.knowledge = null;
                  // } else {
                  //   element.knowledge = element.knowledge.split("，");
                  //   for (let i = 0; i < element.knowledge.length; i++) {
                  //     let findID = new BaaS.TableObject("knowledge_point");
                  //     let findid = new BaaS.Query();
                  //     findid.compare(
                  //       "knowledge_point",
                  //       "=",
                  //       element.knowledge[i]
                  //     );
                  //     findID
                  //       .setQuery(findid)
                  //       .find()
                  //       .then(
                  //         (res) => {
                  //           if (res.data.objects.length == 0) {
                  //             let addKno = new BaaS.TableObject(
                  //               "knowledge_point"
                  //             );
                  //             let addkno = addKno.create();
                  //             addkno.set(
                  //               "knowledge_point",
                  //               element.knowledge[i]
                  //             );
                  //             addkno.save().then(
                  //               (res) => {
                  //                 element.knowledge[i] = res.data.id;
                  //               },
                  //               (err) => {
                  //                 console.log(err);
                  //               }
                  //             );
                  //           } else {
                  //             element.knowledge[i] = res.data.objects[0].id;
                  //           }
                  //         },
                  //         (err) => {
                  //           console.log(err);
                  //         }
                  //       );
                  //   }
                  // }
                  // if (element.source == undefined || element.source == "") {
                  //   element.source = null;
                  // } else {
                  //   element.source = element.source.split("，");
                  //   for (let i = 0; i < element.source.length; i++) {
                  //     let findID = new BaaS.TableObject("source");
                  //     let findid = new BaaS.Query();
                  //     findid.compare("source", "=", element.source[i]);
                  //     findID
                  //       .setQuery(findid)
                  //       .find()
                  //       .then(
                  //         (res) => {
                  //           if (res.data.objects.length == 0) {
                  //             let addKno = new BaaS.TableObject("source");
                  //             let addkno = addKno.create();
                  //             addkno.set("source", element.source[i]);
                  //             addkno.save().then(
                  //               (res) => {
                  //                 element.source[i] = res.data.id;
                  //               },
                  //               (err) => {
                  //                 console.log(err);
                  //               }
                  //             );
                  //           } else {
                  //             element.source[i] = res.data.objects[0].id;
                  //           }
                  //         },
                  //         (err) => {
                  //           console.log(err);
                  //         }
                  //       );
                  //   }
                  // }
                  // if (element.test == undefined || element.test == "") {
                  //   element.test = null;
                  // } else {
                  //   element.test = element.test.split("，");
                  //   for (let i = 0; i < element.test.length; i++) {
                  //     let findID = new BaaS.TableObject("test");
                  //     let findid = new BaaS.Query();
                  //     findid.compare("test", "=", element.test[i]);
                  //     findID
                  //       .setQuery(findid)
                  //       .find()
                  //       .then(
                  //         (res) => {
                  //           if (res.data.objects.length == 0) {
                  //             let addKno = new BaaS.TableObject("test");
                  //             let addkno = addKno.create();
                  //             addkno.set("test", element.test[i]);
                  //             addkno.save().then(
                  //               (res) => {
                  //                 element.test[i] = res.data.id;
                  //               },
                  //               (err) => {
                  //                 console.log(err);
                  //               }
                  //             );
                  //           } else {
                  //             element.test[i] = res.data.objects[0].id;
                  //           }
                  //         },
                  //         (err) => {
                  //           console.log(err);
                  //         }
                  //       );
                  //   }
                  // }
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
                  // if (
                  //   element.sub_sequence == undefined ||
                  //   element.sub_sequence == ""
                  // ) {
                  //   element.sub_sequence = null;
                  // }
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
    init() {
      var query = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      let Question = new BaaS.TableObject("questions_information");
      Question.orderBy("-created_at")
        .limit(1000)
        .offset(0)
        .setQuery(query)
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
              if (element.question_content_id != null) {
                var query = new BaaS.Query();
                query.compare("id", "=", element.question_content_id);
                let findContent = new BaaS.TableObject("question_content");
                findContent
                  .setQuery(query)
                  .find()
                  .then(
                    (res) => {
                      if (res.data.objects[0].content != null) {
                        element.question_content_id =
                          res.data.objects[0].content;
                      } else if (res.data.objects[0].file_url != null) {
                        element.question_content_id =
                          res.data.objects[0].file_url.path;
                        this.srcList.push(element.question_content_id);
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              }
              if (element.source_id != null) {
                var query = new BaaS.Query();
                query.in("id", element.source_id);
                let findSource = new BaaS.TableObject("source");
                findSource
                  .setQuery(query)
                  .find()
                  .then(
                    (res) => {
                      // console.log(res);
                      element.source_id = res.data.objects[0].source;
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              }
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
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
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
          catalog: null,
          rename: false,
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
        let Catalog = new BaaS.TableObject("questions_information");
        Catalog.setQuery(query)
          .find()
          .then(
            (res) => {
              if (res.data.objects.length == 0) {
                let catalog = Catalog.create();
                catalog.set("catalog", name);
                catalog.save().then(
                  (res) => {
                    let date = new Date(res.data.created_at * 1000);
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
                    res.data.created_at = Y + M + D + h + m + s;
                    this.tableData[index].catalog = res.data.catalog;
                    this.tableData[index].usage_amount = res.data.usage_amount;
                    this.tableData[index].created_at = res.data.created_at;
                    this.tableData[index].id = res.data.id;
                    this.tableData[index].finish = true;
                    this.tableData[index].rename = false;
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
      let reg = new RegExp("^[^\\s]*$");
      if (row.catalog == null || row.catalog == "") {
        this.$message({
          message: "请输入文件名",
          type: "error",
        });
      } else if (reg.test(row.catalog) == false) {
        this.$message({
          message: "文件名不能输入空格",
          type: "error",
        });
      } else {
        let query = new BaaS.Query();
        query.compare("catalog", "=", row.catalog);
        let Catalog = new BaaS.TableObject("questions_information");
        Catalog.setQuery(query)
          .find()
          .then(
            (res) => {
              // console.log(res);
              if (res.data.objects.length == 0) {
                let catalog = Catalog.getWithoutData(row.id);
                catalog.set("catalog", row.catalog);
                catalog.update().then(
                  (res) => {
                    // console.log(res);
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
      }
    },
    cancelRename(index, row) {
      row.catalog = this.previousName;
      row.rename = false;
      this.previousName = "";
    },
    delCatalog(index, row) {
      let Catalog = new BaaS.TableObject("questions_information");
      Catalog.delete(row.id).then(
        (res) => {
          // console.log(res);
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
      Cookies.set("make_out","second")
      Cookies.set("catalog", row.catalog);
      this.$router.push("/questionCatalog");
    },
    type_select(type) {
      console.log(type);
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
    usage(use) {
      console.log(this.value);
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
      if (val == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var title_search = new Array();
        this.tableData.forEach((element) => {
          if (
            (element.question_content_id != null &&
              element.question_content_id.search(val) != -1) ||
            (element.question != null && element.question.search(val) != -1) ||
            (element.options != null && element.options.search(val) != -1)
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
    addQuestion() {
      Cookies.set("make_out", "second");
      this.$router.push("/addQuestion");
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
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
    check_edit(id, question) {
      Cookies.set("make_out", "second");
      Cookies.set("ques_checkEdit", id);
      if (
        (question && question.search(".png") != -1) ||
        question.search(".mp3") != -1
      ) {
        Cookies.set("question_file", question);
      } else {
        Cookies.set("question_content", question);
      }
      Cookies.set("selectQues",false)
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
.question .el-form .el-input {
  width: 300px;
}
.ques_list {
  margin-top: 15px;
}
</style>