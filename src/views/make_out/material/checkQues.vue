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
        <el-button type="success" plain @click="exp">导出选中</el-button>
      </div>
    </div>
    <div class="ques_content">
      <div class="ques_list">
        <el-table
          v-loading="loading"
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
      <el-button type="primary" icon="el-icon-delete" @click="trash"
        >回收站</el-button
      >
    </div>
    <el-dialog
      title="自动出题"
      :visible.sync="dialogFormVisible"
      :before-close="autoClose"
      class="autoQP"
    >
      <el-form :model="form">
        <el-form-item label="题干材料：" :label-width="formLabelWidth">
          <p>{{ form.ques_con }}</p>
          <img
            :src="form.ques_file"
            alt=""
            v-if="
              form.ques_file != '' &&
              (form.ques_file.search('.png') != -1 ||
                form.ques_file.search('.jpg') != -1 ||
                form.ques_file.search('.gif') != -1)
            "
            style="width: 400px"
          />
          <audio
            :src="form.ques_file"
            v-if="
              form.ques_file != '' &&
              (form.ques_file.search('.mp3') != -1 ||
                form.ques_file.search('.wav') != -1 ||
                form.ques_file.search('.ogg') != -1)
            "
            controls="controls"
          ></audio>
        </el-form-item>
        <div v-for="(x, index) in form.type" :key="x.index" class="autoType">
          <el-form-item label="题目类型：" :label-width="formLabelWidth">
            <el-cascader
              v-if="
                form.ques_file != '' &&
                (form.ques_file.search('.png') != -1 ||
                  form.ques_file.search('.jpg') != -1 ||
                  form.ques_file.search('.gif') != -1) &&
                (form.ques_con == '' || form.ques_con == null)
              "
              v-model="x.ques_type"
              :options="ques_select_mat"
              :props="{
                expandTrigger: 'hover',
              }"
              clearable
              placeholder="请选择题型"
            ></el-cascader>
            <el-cascader
              v-else-if="
                form.ques_file != '' &&
                (form.ques_file.search('.mp3') != -1 ||
                  form.ques_file.search('.wav') != -1 ||
                  form.ques_file.search('.ogg') != -1) &&
                (form.ques_con == '' || form.ques_con == null)
              "
              v-model="x.ques_type"
              :options="ques_select_listen"
              :props="{
                expandTrigger: 'hover',
              }"
              clearable
              placeholder="请选择题型"
            ></el-cascader>
            <el-cascader
              v-else-if="
                form.ques_file.search('.png') == -1 &&
                form.ques_file.search('.gif') == -1 &&
                form.ques_file.search('.jpg') == -1 &&
                form.ques_con != '' &&
                form.ques_con != null
              "
              v-model="x.ques_type"
              :options="ques_select_nmat"
              :props="{
                expandTrigger: 'hover',
              }"
              clearable
              placeholder="请选择题型"
            ></el-cascader>
            <el-cascader
              v-else
              v-model="x.ques_type"
              :options="ques_select"
              :props="{
                expandTrigger: 'hover',
              }"
              clearable
              placeholder="请选择题型"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="题目数量："
            :label-width="formLabelWidth"
            v-if="x.ques_type[1] != '阅读短文，选择正确答案'"
          >
            <el-input
              type="number"
              min="0"
              v-model="x.ques_num"
              placeholder="请输入题目数量"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="医学题数量："
            :label-width="formLabelWidth"
            v-if="x.ques_type[1] == '阅读短文，选择正确答案'"
          >
            <el-input
              type="number"
              min="0"
              v-model="x.ques_num_yixue"
              placeholder="请输入医学题数量"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="综合题数量："
            :label-width="formLabelWidth"
            v-if="x.ques_type[1] == '阅读短文，选择正确答案'"
          >
            <el-input
              type="number"
              min="0"
              v-model="x.ques_num_zonghe"
              placeholder="请输入综合题数量"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="题目等级：" :label-width="formLabelWidth">
            <el-select v-model="x.grade" placeholder="请选择题目等级">
              <el-option
                v-for="item in grade"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <i
            class="el-icon-remove-outline"
            v-if="form.type.length != 1"
            @click="delAuto(index)"
          ></i>
        </div>
        <i class="el-icon-circle-plus-outline" @click="addAuto"></i>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setQues">生成题目</el-button>
        <el-button @click="autoClose">取 消</el-button>
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
import { export_json_to_excel } from "@/util/Export2Excel.js";
// import "docxtemplater/build/docxtemplater.js";
// import "pizzip/dist/pizzip.js";
// import "pizzip/dist/pizzip-utils.js";
// import "file-saver";
const JSZip = require("jszip");
var XLSX = require("xlsx");
var BaaS = require("minapp-sdk");
let clientID = "395062a19e209a770059";
BaaS.init(clientID);
import Cookie from "js-cookie";
import Cookies from "js-cookie";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      deri: 0,
      loading: true,
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
      ques_select_listen: [
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
      ],
      ques_select_mat: [
        {
          value: "阅读题",
          label: "阅读题",
          children: [
            {
              value: "阅读材料，选择正确答案",
              label: "阅读材料，选择正确答案",
            },
          ],
        },
      ],
      ques_select_nmat: [
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
              value: "阅读短文，选择正确答案",
              label: "阅读短文，选择正确答案",
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
        ques_con: "",
        ques_file: "",
        type: [
          {
            ques_num: 1,
            ques_type: "",
            ques_num_yixue: 1,
            ques_num_zonghe: 1,
            grade: "不限等级",
          },
        ],
      },
      grade: [
        {
          value: "不限等级",
          label: "不限等级",
        },
        {
          value: "一级",
          label: "一级",
        },
        {
          value: "二级",
          label: "二级",
        },
        {
          value: "三级",
          label: "三级",
        },
      ],
      formLabelWidth: "120px",
      currentPage: 1,
      pageSize: 10,
      fileList: [],
      sureClick: true,
      ex: "1",
      der: [],
      exVisible: false,
      contentFile: [],
      excelFile: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
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
            this.loading = false;
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
      let content = Cookie.get("question_content");
      this.form.ques_con = content;
      if (
        content.search(".mp3") != -1 ||
        content.search(".wav") != -1 ||
        content.search(".ogg") != -1 ||
        content.search(".png") != -1 ||
        content.search(".jpg") != -1 ||
        content.search(".gif") != -1
      ) {
        this.form.ques_file = content;
      }
      this.dialogFormVisible = true;
    },
    autoClose() {
      this.form = {
        ques_con: "",
        ques_file: "",
        type: [
          {
            ques_type: "",
            ques_num: 1,
            ques_num_yixue: 1,
            ques_num_zonghe: 1,
            grade: "不限等级",
          },
        ],
      };
      this.dialogFormVisible = false;
    },
    setQues() {
      console.log(this.form);
      let valid = true;
      for (let i = 0; i < this.form.type.length; i++) {
        if (this.form.type[i].ques_type == "") {
          valid = false;
          this.$message.warning("请选择出题题型");
          break;
        }
        this.form.type[i].ques_num *= 1;
        this.form.type[i].ques_num_yixue *= 1;
        this.form.type[i].ques_num_zonghe *= 1;
      }
      if (valid == true) {
        const loading = this.$loading({
          lock: true,
          text: "正在出题中，请稍后",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        for (let i = 0; i < this.form.type.length; i++) {
          if (this.form.type[i].ques_type[1] == "阅读短文，选择正确答案") {
            Read4(
              this.form.ques_con,
              this.form.type[i].ques_num_yixue,
              this.form.type[i].ques_num_zonghe
            ).then(
              (res) => {
                loading.close();
                console.log(res);
                // let questions = []
                // let content = []
                // for(let i=0;i<this.form.type.length;i++){
                //   let s = {
                //     temp: this.form.ques_con
                //   }
                // }
                // for(let i=0;i<res.medical_data.length;i++){
                //   let t = {
                //   question_content: this.form.ques_con,

                // }
                // }

                this.autoClose();
                Cookies.set("make_out", "third");
                this.$router.push("/mcreatePaper");
              },
              (err) => {
                this.$message.error("出题失败");
                loading.close();
                console.log(err);
              }
            );
          }
        }
      }
    },
    addAuto() {
      let t = {
        ques_type: "",
        ques_num: 1,
        ques_num_yixue: 1,
        ques_num_zonghe: 1,
        grade: "不限等级",
      };
      this.form.type.push(t);
    },
    delAuto(val) {
      console.log(val);
      this.form.type.splice(val, 1);
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
    async derive() {
      const loading = this.$loading({
        lock: true,
        text: "正在导出，请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let final = [];
      for (let i = 0; i < this.der.length; i++) {
        this.der[i].question_content_id = Cookie.get("question_content");
        if (this.deri == 0) {
          if (this.der[i].options != null) {
            let temp = await JSON.parse(this.der[i].options);
            let str = "";
            for (let j = 0; j < temp.length; j++) {
              str += temp[j].index + "." + temp[j].content + " ";
            }
            this.der[i].options = str;
          }
        }
        final.push(this.der[i]);
      }
      this.deri++;
      if (this.ex == 1) {
        setTimeout(() => {
          const testData = {
            文件夹: "catalog",
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
          const data = final.map((user) => {
            const userArr = [];
            for (const Key in testData) {
              const newKey = testData[Key];
              userArr.push(user[newKey]);
            }
            return userArr;
          });
          export_json_to_excel({
            header,
            data,
          });
          loading.close();
          this.exVisible = false;
          this.$message({
            message: "导出成功",
            type: "success",
          });
        }, 3000);
      } else if (this.ex == 2) {
        setTimeout(() => {
          for (let i = 0; i < final.length; i++) {
            final[i].sequence = i + 1;
            if (
              final[i].question == null ||
              final[i].question == undefined ||
              final[i].question == "" ||
              final[i].question == "null" ||
              final[i].question == "undefined"
            ) {
              final[i].question = "/";
            }
            if (
              final[i].options == null ||
              final[i].options == undefined ||
              final[i].options == "" ||
              final[i].options == "null" ||
              final[i].options == "undefined"
            ) {
              final[i].options = "/";
            }
            if (
              final[i].analysis == null ||
              final[i].analysis == undefined ||
              final[i].analysis == "" ||
              final[i].analysis == "null" ||
              final[i].analysis == "undefined"
            ) {
              final[i].analysis = "/";
            }
            if (
              final[i].catalog == null ||
              final[i].catalog == undefined ||
              final[i].catalog == "" ||
              final[i].catalog == "null" ||
              final[i].catalog == "undefined"
            ) {
              final[i].catalog = "/";
            }
            if (
              final[i].ques_level == null ||
              final[i].ques_level == undefined ||
              final[i].ques_level == "" ||
              final[i].ques_level == "null" ||
              final[i].ques_level == "undefined"
            ) {
              final[i].ques_level = "/";
            }
            if (
              final[i].grade_standard == null ||
              final[i].grade_standard == undefined ||
              final[i].grade_standard == "" ||
              final[i].grade_standard == "null" ||
              final[i].grade_standard == "undefined"
            ) {
              final[i].grade_standard = "/";
            }
            if (
              final[i].topic_outline == null ||
              final[i].topic_outline == undefined ||
              final[i].topic_outline == "" ||
              final[i].topic_outline == "null" ||
              final[i].topic_outline == "undefined"
            ) {
              final[i].topic_outline = "/";
            }
            if (
              final[i].task_outline == null ||
              final[i].task_outline == undefined ||
              final[i].task_outline == "" ||
              final[i].task_outline == "null" ||
              final[i].task_outline == "undefined"
            ) {
              final[i].task_outline = "/";
            }
            if (
              final[i].department == null ||
              final[i].department == undefined ||
              final[i].department == "" ||
              final[i].department == "null" ||
              final[i].department == "undefined"
            ) {
              final[i].department = "/";
            }
            if (
              final[i].question_class == null ||
              final[i].question_class == undefined ||
              final[i].question_class == "" ||
              final[i].question_class == "null" ||
              final[i].question_class == "undefined"
            ) {
              final[i].question_class = "/";
            }
            if (
              final[i].question_type_5he == null ||
              final[i].question_type_5he == undefined ||
              final[i].question_type_5he == "" ||
              final[i].question_type_5he == "null" ||
              final[i].question_type_5he == "undefined"
            ) {
              final[i].question_type_5he = "/";
            }
            if (
              final[i].author == null ||
              final[i].author == undefined ||
              final[i].author == "" ||
              final[i].author == "null" ||
              final[i].author == "undefined"
            ) {
              final[i].author = "/";
            }
            if (
              final[i].author_org == null ||
              final[i].author_org == undefined ||
              final[i].author_org == "" ||
              final[i].author_org == "null" ||
              final[i].author_org == "undefined"
            ) {
              final[i].author_org = "/";
            }
            if (
              final[i].time_created == null ||
              final[i].time_created == undefined ||
              final[i].time_created == "" ||
              final[i].time_created == "null" ||
              final[i].time_created == "undefined"
            ) {
              final[i].time_created = "/";
            }
          }
          var ImageModule = require("open-docxtemplater-image-module");
          // 点击导出word
          var that = this;
          this.loadFile("export_ques.docx", function (error, content) {
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
              final: final,
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
            saveAs(out, "题目导出.docx");
          });
          loading.close();
          this.exVisible = false;
          this.$message({
            message: "导出成功",
            type: "success",
          });
        }, 3000);
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
  justify-content: flex-end;
}
.checkQues .autoQP .el-dialog__body {
  padding: 0 20px;
}
.checkQues .el-icon-circle-plus-outline {
  font-size: 40px;
  color: green;
  float: left;
}
.checkQues .el-icon-remove-outline {
  font-size: 30px;
  color: red;
  float: right;
}
.checkQues .autoType {
  margin-bottom: 20px;
  padding-bottom: 40px;
  border-bottom: 1px dotted gray;
}
.checkQues .autoType .el-cascader,
.checkQues .autoType .el-input,
.checkQues .autoType .el-select {
  width: 100%;
}
</style>