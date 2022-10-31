//题库
<template>
  <div class="questionCatalog">
    <h1 class="title">{{ catalog }}</h1>
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
        <el-button type="success" plain @click="exp">导出选中</el-button>
        <el-button type="primary" plain @click="multipleMove"
          >移动选中</el-button
        >
        <el-button plain @click="back">返回</el-button>
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
              <div class="btn">
                <el-button
                  type="success"
                  plain
                  @click="
                    check_edit(scope.row.id, scope.row.question_content_id)
                  "
                  >查看/编辑</el-button
                >
                <el-button type="warning" plain @click="copy(scope.row)"
                  >复制</el-button
                >
                <el-button
                  type="danger"
                  plain
                  v-if="!scope.row.have"
                  @click="delQues(scope.row)"
                  >删除</el-button
                >
                <div style="margin: 0 10px" v-else>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="该题目被应用到试卷中，不可删除"
                    placement="top"
                  >
                    <el-button type="info" plain>删除</el-button>
                  </el-tooltip>
                </div>
                <el-button type="primary" plain @click="moveTo(scope.row.id, 1)"
                  >移动到</el-button
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
      <el-button type="primary" icon="el-icon-delete" @click="trash"
        >回收站</el-button
      >
    </div>
    <el-dialog
      title="自动出题"
      :visible.sync="dialogFormVisible"
      class="autoQP"
      :before-close="autoClose"
    >
      <el-button size="small" @click="addTab(editableTabsValue)">
        添加题干
      </el-button>
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        closable
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <el-form :model="item.content">
            <el-form-item label="题干材料：" :label-width="formLabelWidth">
              <div class="edit_ques_content">
                <div class="material">
                  <div :id="'mat' + item.name">
                    <!-- <p>{{ questions.question_content }}</p> -->
                  </div>
                </div>
                <el-upload
                  ref="upload"
                  action=""
                  class="upload-demo"
                  :multiple="false"
                  accept=".mp3,.wav,.ogg"
                  :before-upload="audiobeforeAvatarUpload"
                  :auto-upload="false"
                  :on-change="audioChange"
                  :on-exceed="handleExceed"
                  :on-remove="audioRemove"
                  :limit="1"
                  :file-list="audiofileList[index].file"
                >
                  <el-button>上传音频</el-button>
                </el-upload>
                <audio
                  :src="item.content.ques_file"
                  controls="controls"
                  v-if="
                    item.content.ques_file != '' &&
                    (item.content.ques_file.search('.mp3') != -1 ||
                      item.content.ques_file.search('.ogg') != -1 ||
                      item.content.ques_file.search('.wav') != -1)
                  "
                ></audio>
                <el-upload
                  ref="upload"
                  action=""
                  class="upload-demo"
                  :multiple="false"
                  accept=".xls,.xlsx"
                  :before-upload="excelbeforeAvatarUpload"
                  :auto-upload="false"
                  :on-change="excelChange"
                  :on-exceed="handleExceed"
                  :on-remove="excelRemove"
                  :limit="1"
                  :file-list="excelfileList[index].file"
                >
                  <el-button>上传表格</el-button>
                </el-upload>
              </div>
            </el-form-item>
            <div
              v-for="(x, index) in item.content.type"
              :key="x.index"
              class="autoType"
            >
              <p style="color: red" v-if="x.ques_type[0] == '听力题'">
                注：听力题文本文件和音频文件只能选择一项上传，若两项都存在则使用音频文件出题。
              </p>
              <p
                style="color: red"
                v-if="x.ques_type[1] == '阅读材料，选择正确答案'"
              >
                上传Excel表格出题，点击<el-button
                  type="text"
                  @click="downloadExcel"
                  >下载模板</el-button
                >
              </p>
              <el-form-item label="题目类型：" :label-width="formLabelWidth">
                <el-cascader
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
                v-if="
                  x.ques_type[1] != '阅读短文，选择正确答案' &&
                  x.ques_type[0] != '写作题'
                "
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
                v-if="item.content.type.length != 1"
                @click="delAuto(index)"
              ></i>
            </div>
            <i class="el-icon-circle-plus-outline" @click="addAuto"></i>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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
    <el-dialog
      title="移动到"
      :visible.sync="moveVisible"
      :before-close="handleClose"
      width="30%"
    >
      <div class="move">
        <el-button @click="to('out')"> 文件夹外 </el-button>
        <el-button
          v-for="o in catalogall"
          :key="o.index"
          @click="to(o.catalog)"
        >
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
  </div>
</template>

<script lang="javascript" src="dist/xlsx.full.min.js"></script>
<script>
import E from "wangeditor";
import { export_json_to_excel } from "@/util/Export2Excel.js";
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
      exVisible: false,
      loading: true,
      preMove: [],
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
      catalog: "",
      catalogall: [],
      moveVisible: false,
      audiofileList: [
        {
          tabName: "1",
          file: [],
        },
      ],
      excelfileList: [
        {
          tabName: "1",
          file: [],
        },
      ],
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
      excelFile: [],
      contentFile: [],
      importExcel: false,
      editor: [],
      editableTabs: [
        {
          title: "文本 1",
          name: "1",
          content: {
            ques_con: "",
            ques_file: "",
            ques_image: "",
            ques_ex: "",
            type: [
              {
                grade: "不限等级",
                ques_num: 1,
                ques_type: "",
                ques_num_yixue: 1,
                ques_num_zonghe: 1,
              },
            ],
          },
        },
      ],
      tabIndex: 1,
      editableTabsValue: "1",
      ex: "1",
      der: [],
      addFileName: "",
      deri: 0,
    };
  },
  watch: {},
  computed: {},
  methods: {
    adataURLtoFile(dataURL, fileName, fileType) {
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
      const arr = dataURL.split(",");
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
    audiobeforeAvatarUpload(file) {
      let isFile =
        file.name.split(".")[file.name.split(".").length - 1] == "mp3" ||
        file.name.split(".")[file.name.split(".").length - 1] == "wav" ||
        file.name.split(".")[file.name.split(".").length - 1] == "ogg";
      if (!isFile) {
        this.$message.error("导入文件格式不正确");
      }
      return isFile;
    },
    audioChange(file, fileList) {
      for (let i = 0; i < this.audiofileList.length; i++) {
        if (this.audiofileList[i].tabName == this.editableTabsValue) {
          this.audiofileList[i].file.push(file);
        }
      }
      if (
        /\.(mp3)$/.test(file.raw.name) ||
        /\.(wav)$/.test(file.raw.name) ||
        /\.(ogg)$/.test(file.raw.name)
      ) {
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = () => {
          const result = this.adataURLtoFile(reader.result, file.raw.name);
          console.log(result);
          // new Promise((resolve, reject) => {
          //   this.audio = reader.result;
          //   this.audior = result;
          // });
          for (let i = 0; i < this.editableTabs.length; i++) {
            if (this.editableTabsValue == this.editableTabs[i].name) {
              this.editableTabs[i].content.ques_file = reader.result;
            }
          }
        };
      }
    },
    audioRemove(file, fileList) {
      this.audiofileList[this.editableTabsValue * 1 - 1].file = [];
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].name == this.editableTabsValue) {
          this.editableTabs[i].content.ques_file = "";
        }
      }
    },
    excelbeforeAvatarUpload(file) {
      let isFile =
        file.name.split(".")[file.name.split(".").length - 1] == "xls" ||
        file.name.split(".")[file.name.split(".").length - 1] == "xlsx";
      if (!isFile) {
        this.$message.error("导入文件格式不正确");
      }
      return isFile;
    },
    excelChange(file, fileList) {
      for (let i = 0; i < this.excelfileList.length; i++) {
        if (this.excelfileList[i].tabName == this.editableTabsValue) {
          this.excelfileList[i].file.push(file);
        }
      }
      if (/\.(xls)$/.test(file.raw.name) || /\.(xlsx)$/.test(file.raw.name)) {
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = () => {
          const result = this.adataURLtoFile(reader.result, file.raw.name);
          console.log(result);
          // new Promise((resolve, reject) => {
          //   this.audio = reader.result;
          //   this.audior = result;
          // });
          for (let i = 0; i < this.editableTabs.length; i++) {
            if (this.editableTabsValue == this.editableTabs[i].name) {
              this.editableTabs[i].content.ques_ex = reader.result;
            }
          }
        };
      }
    },
    excelRemove(file, fileList) {
      this.excelfileList[this.editableTabsValue * 1 - 1].file = [];
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].name == this.editableTabsValue) {
          this.editableTabs[i].content.ques_ex = "";
        }
      }
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
      let cata = [];
      let xlsx = [];
      for (let key in zipData.files) {
        if (!zipData.files[key].dir) {
          if (/\.(xlsx)$/.test(zipData.files[key].name)) {
            let base = await zip.file(zipData.files[key].name).async("base64"); // 以base64输出文本内容
            const result = this.dataURLtoFile(base, zipData.files[key].name);
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
                xlsx = ws;
                let i = 0;
                for (i = 0; i < ws.length; i++) {
                  if (
                    ws[i].catalogue != "" &&
                    ws[i].catalogue != undefined &&
                    ws[i].catalogue != null
                  ) {
                    let t = {
                      catalog: ws[i].catalogue,
                      content: ws[i].question_content,
                    };
                    cata.push(t);
                  }
                  if (i == ws.length - 1) {
                    const map = new Map();
                    const qc_c = cata.filter(
                      (key) => !map.has(key.content) && map.set(key.content, 1)
                    );
                    cata = qc_c;
                  }
                }
              } catch (e) {
                console.log(e);
                return false;
              }
            }.bind(this);
            break;
          }
        }
      }
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
            await new Promise((resolve, reject) => {
              let File = new BaaS.File();
              let audio = { fileObj: result };
              File.upload(audio).then(
                (res) => {
                  if (cata.length != 0) {
                    let find = false;
                    for (let i = 0; i < cata.length; i++) {
                      if (cata[i].content == zipData.files[key].name) {
                        find = true;
                        let Content = new BaaS.TableObject("question_content");
                        let content = Content.create();
                        content.set("file_url", res.data.file);
                        content.set("content", null);
                        content.set("catalog", cata[i].catalog);
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
                        break;
                      }
                    }
                    if (find == false) {
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
                    }
                  } else {
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
                  }
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
                  if (
                    element.catalogue == undefined ||
                    element.catalogue == ""
                  ) {
                    element.catalogue = null;
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
                    catalog: element.catalogue,
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
        let num = 0;
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
                      num++;
                      if (num == this.excelFile.length) {
                        loading.close();
                        this.$message({
                          message: "导入成功",
                          type: "success",
                        });
                        this.init();
                        this.importFile = false;
                      }
                    },
                    (err) => {
                      loading.close();
                      this.$message({
                        message: "导入失败",
                        type: "warning",
                      });
                      this.init();
                      this.importFile = false;
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
                                  num++;
                                  if (num == this.excelFile.length) {
                                    loading.close();
                                    this.$message({
                                      message: "导入成功",
                                      type: "success",
                                    });
                                    this.init();
                                    this.importFile = false;
                                  }
                                },
                                (err) => {
                                  loading.close();
                                  this.$message({
                                    message: "导入失败",
                                    type: "warning",
                                  });
                                  this.init();
                                  this.importFile = false;
                                  console.log(err);
                                }
                              );
                          }
                        });
                      }
                    } else if (res.data.objects.length == 0) {
                      if (cata.length != 0) {
                        let find = false;
                        for (let i = 0; i < cata.length; i++) {
                          find = true;
                          if (cata[i].content == element.content) {
                            let addContent = new BaaS.TableObject(
                              "question_content"
                            );
                            let add = addContent.create();
                            add.set("content", element.content);
                            add.set("catalog", cata[i].catalog);
                            add.save().then(
                              (res) => {
                                element.id = res.data.id;
                                k++;
                                if (k == qc.length) {
                                  this.excelFile.forEach((element) => {
                                    var a = qc.findIndex(
                                      (item) =>
                                        item.content ===
                                        element.question_content_id
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
                                            num++;
                                            if (num == this.excelFile.length) {
                                              loading.close();
                                              this.$message({
                                                message: "导入成功",
                                                type: "success",
                                              });
                                              this.init();
                                              this.importFile = false;
                                            }
                                          },
                                          (err) => {
                                            loading.close();
                                            this.$message({
                                              message: "导入失败",
                                              type: "warning",
                                            });
                                            this.init();
                                            this.importFile = false;
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
                        }
                        if (find == false) {
                          let addContent = new BaaS.TableObject(
                            "question_content"
                          );
                          let add = addContent.create();
                          add.set("content", element.content);
                          add.set("catalog", null);
                          add.save().then(
                            (res) => {
                              element.id = res.data.id;
                              k++;
                              if (k == qc.length) {
                                this.excelFile.forEach((element) => {
                                  var a = qc.findIndex(
                                    (item) =>
                                      item.content ===
                                      element.question_content_id
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
                                          num++;
                                          if (num == this.excelFile.length) {
                                            loading.close();
                                            this.$message({
                                              message: "导入成功",
                                              type: "success",
                                            });
                                            this.init();
                                            this.importFile = false;
                                          }
                                        },
                                        (err) => {
                                          loading.close();
                                          this.$message({
                                            message: "导入失败",
                                            type: "warning",
                                          });
                                          this.init();
                                          this.importFile = false;
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
                      } else {
                        let addContent = new BaaS.TableObject(
                          "question_content"
                        );
                        let add = addContent.create();
                        add.set("content", element.content);
                        add.set("catalog", null);
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
                                        num++;
                                        if (num == this.excelFile.length) {
                                          loading.close();
                                          this.$message({
                                            message: "导入成功",
                                            type: "success",
                                          });
                                          this.init();
                                          this.importFile = false;
                                        }
                                      },
                                      (err) => {
                                        loading.close();
                                        this.$message({
                                          message: "导入失败",
                                          type: "warning",
                                        });
                                        this.init();
                                        this.importFile = false;
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
      this.catalog = Cookie.get("catalog");
      this.catalogall = JSON.parse(Cookie.get("catalogall"));
      for (let i = 0; i < this.catalogall.length; i++) {
        if (this.catalogall[i].catalog == this.catalog) {
          this.catalogall.splice(i, 1);
          break;
        }
      }
      let query = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      let que = new BaaS.Query();
      que.compare("catalog", "=", this.catalog);
      let q3 = new BaaS.Query();
      q3.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query, que, q3);
      let Question = new BaaS.TableObject("questions_information");
      Question.orderBy("-created_at")
        .limit(1000)
        .offset(0)
        .setQuery(andQuery)
        .find()
        .then(
          (res) => {
            if (
              res.data.objects.length == 1 &&
              res.data.objects[0].question_content_id == null
            ) {
              this.loading = false;
              this.tableData = [];
            } else {
              for (let i = 0; i < res.data.objects.length; i++) {
                if (res.data.objects[i].question_content_id == null) {
                  res.data.objects.splice(i, 1);
                  break;
                }
              }
              res.data.objects.forEach((element) => {
                element.have = false;
                let q4 = new BaaS.Query();
                q4.contains("questions_detail", element.id);
                let andQuery = BaaS.Query.and(q3, q4);
                let Paper = new BaaS.TableObject("test_paper");
                Paper.setQuery(andQuery)
                  .limit(1000)
                  .offset(0)
                  .find()
                  .then(
                    (res) => {
                      if (res.data.objects.length != 0) {
                        element.have = true;
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
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
                  let query = new BaaS.Query();
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
              });
              this.loading = false;
              this.tableData = res.data.objects;
              this.initial = this.tableData;
            }
          },
          (err) => {
            console.log(err);
          }
        );
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
      this.dialogFormVisible = true;
      setTimeout(() => {
        this.createEdit();
      }, 500);
    },
    setQues() {
      console.log(this.editableTabs);
      let valid = true;
      for (let i = 0; i < this.editableTabs.length; i++) {
        for (let k = 0; k < this.editor.length; k++) {
          if (
            this.editor[k].toolbarSelector ==
            "#mat" + this.editableTabs[i].name
          ) {
            if (
              this.editor[k].txt.html() == "" &&
              this.editableTabs[i].content.ques_file == "" &&
              this.editableTabs[i].content.ques_ex == ""
            ) {
              valid = false;
              this.$message.warning("请输入题干材料");
              break;
            } else {
              if (
                this.editor[k].txt.html().search("<img src=") != -1 &&
                this.editableTabs[i].content.ques_file == ""
              ) {
                let src = "";
                let a = this.editor[k].txt.html().search("<img src=");
                let x = this.editor[k].txt.html();
                for (let b = a + 10; b < x.length; b++) {
                  if (x[b] != '"') {
                    src += x[b];
                  } else {
                    break;
                  }
                }
                this.editableTabs[i].content.ques_image = src;
              } else if (
                this.editor[k].txt.html().search("<img src=") != -1 &&
                this.editableTabs[i].content.ques_file != ""
              ) {
                this.$message({
                  message: "图片和音频只支持一项，请修改",
                  type: "warning",
                });
                valid = false;
                break;
              }
              this.editableTabs[i].content.ques_con = this.editor[k].txt.text();
              for (
                let j = 0;
                j < this.editableTabs[i].content.type.length;
                j++
              ) {
                if (this.editableTabs[i].content.type[j].ques_type == "") {
                  valid = false;
                  this.$message.warning("请选择出题题型");
                  break;
                }
                if (
                  this.editableTabs[i].content.type[j].ques_type[0] == "听力题"
                ) {
                  if (
                    this.editableTabs[i].content.ques_con == "" &&
                    this.editableTabs[i].content.ques_file == ""
                  ) {
                    this.$message({
                      message:
                        this.editableTabs[i].title +
                        " 存在听力题，请输入题干文本或音频文件",
                      type: "warning",
                    });
                    valid = false;
                    break;
                  }
                } else if (
                  this.editableTabs[i].content.type[j].ques_type[1] ==
                  "阅读材料，选择正确答案"
                ) {
                  if (this.excelfileList[i].file.length == 0) {
                    this.$message({
                      message:
                        this.editableTabs[i].title +
                        " 存在材料题，请上传Excel文件",
                      type: "warning",
                    });
                    valid = false;
                    break;
                  }
                } else if (
                  this.editableTabs[i].content.type[j].ques_type[0] !=
                    "听力题" &&
                  this.editableTabs[i].content.type[j].ques_type[1] !=
                    "阅读材料，选择正确答案"
                ) {
                  if (this.editableTabs[i].content.ques_con == "") {
                    this.$message({
                      message: this.editableTabs[i].title + " 需要输入题干文本",
                      type: "warning",
                    });
                    valid = false;
                    break;
                  }
                }
                this.editableTabs[i].content.type[j].ques_num *= 1;
                this.editableTabs[i].content.type[j].ques_num_yixue *= 1;
                this.editableTabs[i].content.type[j].ques_num_zonghe *= 1;
              }
            }
            break;
          }
        }
      }
      if (valid == true) {
        this.autoClose();
      }
    },
    autoClose() {
      for (let i = 0; i < this.editor.length; i++) {
        this.editor[i].destroy();
      }
      this.editor = [];
      this.editableTabs = [
        {
          title: "文本 1",
          name: "1",
          content: {
            ques_con: "",
            ques_file: "",
            ques_image: "",
            ques_ex: "",
            type: [
              {
                grade: "不限等级",
                ques_num: 1,
                ques_type: "",
                ques_num_yixue: 1,
                ques_num_zonghe: 1,
              },
            ],
          },
        },
      ];
      this.audiofileList = [
        {
          tabName: "1",
          file: [],
        },
      ];
      this.tabIndex = 1;
      this.editableTabsValue = "1";
      this.dialogFormVisible = false;
    },
    addAuto() {
      let t = {
        ques_type: "",
        ques_num: 1,
        ques_num_yixue: 1,
        ques_num_zonghe: 1,
      };
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabsValue == this.editableTabs[i].name) {
          this.editableTabs[i].content.type.push(t);
        }
      }
    },
    delAuto(val) {
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabsValue == this.editableTabs[i].name) {
          this.editableTabs[i].content.type.splice(val, 1);
        }
      }
    },
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: "文本 " + this.tabIndex,
        name: newTabName,
        content: {
          ques_con: "",
          ques_file: "",
          ques_image: "",
          ques_ex: "",
          type: [
            {
              grade: "不限等级",
              ques_num: 1,
              ques_type: "",
              ques_num_yixue: 1,
              ques_num_zonghe: 1,
            },
          ],
        },
      });
      this.audiofileList.push({
        tabName: newTabName,
        file: [],
      });
      this.editableTabsValue = newTabName;
      setTimeout(() => {
        this.createEdit();
      }, 500);
      console.log(this.audiofileList);
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      this.audiofileList[targetName * 1 - 1].file = [];
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
        question.search(".png") != -1 ||
        question.search(".jpg") != -1 ||
        question.search(".gif") != -1 ||
        question.search(".mp3") != -1 ||
        question.search(".wav") != -1 ||
        question.search(".ogg") != -1
      ) {
        Cookies.set("question_file", question);
      } else {
        Cookies.set("question_content", question);
      }
      Cookies.set("selectQues", false);
      this.$router.push("/ques_checkEdit");
    },
    back() {
      Cookies.set("catalog", "");
      Cookies.set("catalogall", "");
      this.$router.go(-1);
    },
    multipleMove() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择移动项",
          type: "warning",
        });
      } else {
        let temp = [];
        this.multipleSelection.forEach((element) => {
          temp.push(element.id);
        });
        this.moveTo(temp, 2);
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
        let Catalog = new BaaS.TableObject("questions_information");
        let cata = Catalog.getWithoutData(this.preMove[i]);
        if (val == "out") {
          cata.set("catalog", null);
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
        } else {
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
      }
    },
    trash() {
      Cookies.set("trash", "questions");
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
    async derive() {
      const loading = this.$loading({
        lock: true,
        text: "正在导出，请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let final = [];
      for (let i = 0; i < this.der.length; i++) {
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
    createEdit() {
      const material = new E("#mat" + this.tabIndex);
      material.config.uploadImgShowBase64 = true;
      material.config.height = 200;
      material.config.placeholder = "请输入题干";
      material.create();
      this.editor.push(material);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.questionCatalog {
  padding: 20px;
}
.questionCatalog .el-form .el-input {
  width: 300px;
}
.questionCatalog .ques_list {
  margin-top: 15px;
}
.questionCatalog .autoType .el-cascader,
.questionCatalog .autoType .el-input,
.questionCatalog .autoType .el-select {
  width: 100%;
}
.questionCatalog .el-icon-circle-plus-outline {
  font-size: 40px;
  color: green;
  float: left;
}
.questionCatalog .el-icon-remove-outline {
  font-size: 30px;
  color: red;
  float: right;
}
.questionCatalog .autoType {
  margin-bottom: 20px;
  padding-bottom: 40px;
  border-bottom: 1px dotted gray;
}
</style>