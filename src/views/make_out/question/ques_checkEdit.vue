//查看/编辑试卷
<template>
  <div class="ques_checkEdit">
    <div class="ques_check_top">
      <div class="ques_top_title">
        <div v-show="check">
          <span>预览题目</span>
          <i
            class="el-icon-edit-outline ques_edit"
            @click="quesEdit"
            v-show="selectQues == 'false'"
          ></i>
        </div>
        <div v-show="edit">
          <span>编辑题目</span>
          <i class="el-icon-view ques_edit" @click="quesCheck"></i>
        </div>
      </div>

      <el-button size="small" @click="back" class="back">返回</el-button>
    </div>
    <div class="ques_check_content" v-show="check && question">
      <div class="ques_content_type">
        {{ question.primary_ques_type }}——{{ question.secondary_ques_type }}
      </div>
      <div class="ques_content_details">
        <audio
          :src="file_url"
          controls="controls"
          v-if="(file_url != null) & (question.primary_ques_type == '听力')"
        ></audio>
        <img :src="file_url" alt="" style="height: 250px" v-else />
        <div class="details">
          <p class="details_ques_content">
            {{ content }}
          </p>
          <div>
            <p>{{ question.question }}</p>
            <div v-for="s in question.options" :key="s.id">
              <p v-if="question.secondary_ques_type == '听句子，判断对错'">
                {{ s.content }}
              </p>
              <p v-else>{{ s.index }}.{{ s.content }}</p>
            </div>
            <div class="ques_answer">
              <p>答案：{{ question.answer }}</p>
              <p>解析：{{ question.analysis }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ques_edit_content" v-show="edit">
      <div class="edit_type">
        <div class="edit_primary_type">
          一级题型：
          <el-radio-group v-model="question.primary_ques_type">
            <el-radio-button label="听力"></el-radio-button>
            <el-radio-button label="阅读"></el-radio-button>
            <el-radio-button label="写作"></el-radio-button>
            <el-radio-button label="单选题"></el-radio-button>
            <el-radio-button label="多选题"></el-radio-button>
            <el-radio-button label="填空题"></el-radio-button>
            <el-radio-button label="判断题"></el-radio-button>
            <el-radio-button label="简答题"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="edit_secondary_type">
          二级题型：
          <el-radio-group
            v-model="question.secondary_ques_type"
            v-if="question.primary_ques_type == '听力'"
          >
            <el-radio-button label="听句子，判断对错"></el-radio-button>
            <el-radio-button label="听短对话，选择正确答案"></el-radio-button>
            <el-radio-button label="听长对话，选择正确答案"></el-radio-button>
            <el-radio-button label="听短文，选择正确答案"></el-radio-button>
          </el-radio-group>
          <el-radio-group
            v-model="question.secondary_ques_type"
            v-if="question.primary_ques_type == '阅读'"
          >
            <el-radio-button label="选择正确的词语填空"></el-radio-button>
            <el-radio-button
              label="阅读语段，选择与语段意思一致的一项"
            ></el-radio-button>
            <el-radio-button label="阅读材料，选择正确答案"></el-radio-button>
            <el-radio-button label="阅读短文，选择正确答案"></el-radio-button>
          </el-radio-group>
          <el-radio-group
            v-model="question.secondary_ques_type"
            v-if="question.primary_ques_type == '写作'"
          >
            <el-radio-button
              label="根据一段长对话写门诊病历记录"
            ></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div v-show="question">
        <!-- <div class="file">
          <audio
            :src="question.file_url.path"
            controls="controls"
            v-if="question.primary_ques_type == '听力' && change_file == false"
          ></audio>
          <audio
            :src="question.file_url.path"
            controls="controls"
            v-if="question.primary_ques_type == '听力' && change_file == true"
          ></audio>
          <img
            :src="question.file_url.path"
            alt=""
            v-if="
              question.primary_ques_type != '听力' &&
              question.file_url != null &&
              change_file == false
            "
          />
          <img ref="img" :src="image" alt="" />
          <input type="file" id="file" @click="file" />
        </div> -->
        <div class="edit_ques_content">
          题干：
          <div id="material">
            <p v-if="content != null">{{ content }}</p>
            <img :src="file_url" alt="" height="250px" />
            <audio
              :src="file_url"
              controls="controls"
              v-if="question.primary_ques_type == '听力'"
            ></audio>
          </div>
          <!-- <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入题干"
            v-model="question.question_content"
          >
          </el-input> -->
        </div>
        <p class="warn">选项：答案选中项为正确答案标示。</p>
        <!-- <div class="edit_sub_ques" v-if="question.sub_ques != null">
          <div
            v-for="(sub, index) in sub_question"
            :key="sub.id"
            class="edit_sub_ques_content"
          >
            <div class="edit_sub_ques_title">
              {{ sub.sub_sequence }}.<el-input
                v-model="sub.ques_content"
                placeholder="请输入题目内容"
              ></el-input>
              <i class="el-icon-circle-plus-outline"></i>
              <i class="el-icon-remove-outline"></i>
              <i class="el-icon-arrow-up"></i>
              <i class="el-icon-arrow-down"></i>
            </div>
            <div v-for="s in sub.options" :key="s.id" class="input_options">
              <el-input v-model="s.content" placeholder="请输入选项">
                <el-radio
                  slot="prepend"
                  v-model="sub.answer"
                  :label="s.index"
                  border
                ></el-radio>
              </el-input>
            </div>
            <div class="ques_analysis">
              <el-checkbox v-model="checkboxGroup[index]">解析：</el-checkbox>
              <el-input
                type="textarea"
                :autosize="{ minRows: 4 }"
                placeholder="请输入解析"
                v-model="sub.analysis"
                v-show="checkboxGroup[index]"
              >
              </el-input>
            </div>
          </div>
        </div> -->
        <div style="border-bottom: 1px dashed #c0c4cc">
          <div class="question">
            问题：
            <div id="question">
              <p>{{ question.question }}</p>
            </div>
          </div>
          <!-- <el-input
            v-model="question.question"
            placeholder="请输入问题"
            class="input_options"
          >
          </el-input> -->
          <div class="write_answer" v-if="question.primary_ques_type == '写作'">
            答案：
            <div id="answer">
              <p>{{ question.answer }}</p>
            </div>
          </div>

          <div
            v-show="question.secondary_ques_type == '听句子，判断对错'"
            class="judge"
          >
            <el-radio v-model="question.answer" label="√">√</el-radio>
            <el-radio v-model="question.answer" label="×">×</el-radio>
          </div>
          <div
            v-for="s in question.options"
            :key="s.id"
            class="edit_ques_options"
            v-show="question.secondary_ques_type != '听句子，判断对错'"
          >
            <!-- <el-input
              v-model="s.content"
              placeholder="请输入选项"
              class="input_options"
            > -->
            <el-radio
              slot="prepend"
              v-model="question.answer"
              :label="s.index"
              border
            ></el-radio>
            <!-- </el-input> -->
            <div :id="s.index" class="input_options">
              <p>{{ s.content }}</p>
            </div>
          </div>
          <!-- <div :id="question.options[0].index"></div> -->
          <div class="ques_analysis">
            解析：
            <!-- <el-input
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="请输入解析"
              v-model="question.analysis"
              v-show="checked"
            >
            </el-input> -->
            <div id="analysis">
              <p>{{ question.analysis }}</p>
            </div>
          </div>
        </div>
        <div class="knowledge">
          等级：
          <el-select v-model="level_value" placeholder="请选择题目等级">
            <el-option
              v-for="item in level"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- <div class="knowledge" v-if="knowledge">
          知识点：
          <el-select
            v-model="knowledge_value"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请搜索或添加知识点"
          >
            <el-option
              v-for="item in knowledge"
              :key="item.id"
              :label="item.knowledge_point"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div> -->
        <div class="knowledge">
          等级标准：
          <el-cascader
            v-model="grade_value"
            :options="grade_standard"
            :props="props"
            collapse-tags
            clearable
            placeholder="请选择等级标准"
          ></el-cascader>
          <el-tooltip
            class="item"
            effect="light"
            content="点击查看等级标准"
            placement="right"
          >
            <router-link to="/qgrade_standard" target="_blank">
              <i class="el-icon-info"></i>
            </router-link>
          </el-tooltip>
        </div>
        <div class="knowledge">
          话题大纲：
          <el-cascader
            v-model="topic_value"
            :options="topic_outline"
            :props="props"
            collapse-tags
            clearable
            placeholder="请选择话题大纲"
          ></el-cascader>
          <el-tooltip
            class="item"
            effect="light"
            content="点击查看话题大纲"
            placement="right"
          >
            <router-link to="/qtopic_outline" target="_blank">
              <i class="el-icon-info"></i>
            </router-link>
          </el-tooltip>
        </div>
        <div class="knowledge">
          任务大纲：
          <el-select v-model="task_value" multiple placeholder="请选择任务大纲">
            <el-option
              v-for="item in task_outline"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-tooltip
            class="item"
            effect="light"
            content="点击查看任务大纲"
            placement="right"
          >
            <router-link to="/qtask_outline" target="_blank">
              <i class="el-icon-info"></i>
            </router-link>
          </el-tooltip>
        </div>
        <div class="knowledge">
          系统：
          <el-select
            v-model="department_value"
            multiple
            placeholder="请选择系统"
          >
            <el-option
              v-for="item in department"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- <div class="knowledge">
          考点：
          <el-select
            v-model="test_value"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请搜索或添加考点"
          >
            <el-option
              v-for="item in test"
              :key="item.id"
              :label="item.test"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div> -->
        <!-- <div class="knowledge">
          来源：
          <el-select
            v-model="source_value"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请搜索或添加来源"
          >
            <el-option
              v-for="item in source"
              :key="item.id"
              :label="item.source"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div> -->
        <div class="knowledge">
          题目类型：
          <el-select v-model="qclass_value" placeholder="请选择题目类型">
            <el-option
              v-for="item in qclass"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="knowledge">
          五何类型：
          <el-select v-model="fivehe_value" placeholder="请选择题目五何类型">
            <el-option
              v-for="item in fivehe"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="knowledge">
          作者：
          <el-input v-model="author" placeholder="请输入题目作者"></el-input>
        </div>
        <div class="knowledge">
          作者单位：
          <el-input
            v-model="author_org"
            placeholder="请输入作者单位"
          ></el-input>
        </div>
        <div class="knowledge">
          题目创作日期：
          <el-date-picker
            v-model="time_created"
            type="date"
            placeholder="选择题目创作日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="edit_button">
        <el-button type="success" plain @click="checkQues">保存题目</el-button>
        <el-button type="info" plain @click="(check = true), (edit = false)"
          >取消</el-button
        >
      </div>
      <el-dialog title="修改题目" :visible.sync="dialogVisible" width="30%">
        <span>确认保存修改后的题目吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveQues">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import E from "wangeditor";

export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      option: ["A", "B", "C", "D"],
      selectQues: "",
      editor: [],
      // editorContent: "",
      initial: [],
      question: {},
      edit: false,
      check: true,
      sub_radio1: "",
      change_file: false,
      image: "",
      dialogImageUrl: "",
      dialogVisible: false,
      file_url: "",
      content: "",
      click: 0,
      level: [
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
      level_value: "",
      knowledge: [],
      knowledge_value: [],
      department: [
        {
          value: "循环系统",
          label: "循环系统",
        },
        {
          value: "呼吸系统",
          label: "呼吸系统",
        },
        {
          value: "消化系统",
          label: "消化系统",
        },
        {
          value: "神经系统",
          label: "神经系统",
        },
        {
          value: "泌尿系统",
          label: "泌尿系统",
        },
        {
          value: "生殖系统",
          label: "生殖系统",
        },
        {
          value: "运动系统",
          label: "运动系统",
        },
        {
          value: "内分泌系统",
          label: "内分泌系统",
        },
      ],
      department_value: [],
      test: [],
      test_value: [],
      source: [],
      source_value: [],
      qclass: [
        {
          value: "医学题",
          label: "医学题",
        },
        {
          value: "语言题",
          label: "语言题",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      qclass_value: "",
      fivehe: [
        {
          value: "是何",
          label: "是何",
        },
        {
          value: "为何",
          label: "为何",
        },
        {
          value: "由何",
          label: "由何",
        },
        {
          value: "若何",
          label: "若何",
        },
        {
          value: "如何",
          label: "如何",
        },
      ],
      fivehe_value: "",
      props: { multiple: true, expandTrigger: "hover" },
      grade_value: [],
      grade_standard: [
        {
          value: 1,
          label: "医学汉语能力总体描述",
          children: [
            {
              value: 2,
              label: "一级",
            },
            {
              value: 3,
              label: "二级",
            },
            {
              value: 4,
              label: "三级",
            },
          ],
        },
        {
          value: 5,
          label: "医学汉语口头理解能力（听）",
          children: [
            {
              value: 6,
              label: "一级",
            },
            {
              value: 7,
              label: "二级",
            },
            {
              value: 8,
              label: "三级",
            },
          ],
        },
        {
          value: 9,
          label: "医学汉语口头理解能力（说）",
          children: [
            {
              value: 10,
              label: "一级",
            },
            {
              value: 11,
              label: "二级",
            },
            {
              value: 12,
              label: "三级",
            },
          ],
        },
        {
          value: 13,
          label: "医学汉语口头理解能力（读）",
          children: [
            {
              value: 14,
              label: "一级",
            },
            {
              value: 15,
              label: "二级",
            },
            {
              value: 16,
              label: "三级",
            },
          ],
        },
        {
          value: 17,
          label: "医学汉语口头理解能力（写）",
          children: [
            {
              value: 18,
              label: "一级",
            },
            {
              value: 19,
              label: "二级",
            },
            {
              value: 20,
              label: "三级",
            },
          ],
        },
      ],
      topic_value: [],
      topic_outline: [
        {
          value: 1,
          label: "医生-医生",
          children: [
            {
              value: 2,
              label: "询问",
            },
            {
              value: 3,
              label: "交流",
            },
            {
              value: 4,
              label: "指令",
            },
          ],
        },
        {
          value: 5,
          label: "医生-患者",
          children: [
            {
              value: 6,
              label: "问诊",
            },
            {
              value: 7,
              label: "诊断",
            },
            {
              value: 8,
              label: "治疗",
            },
            {
              value: 9,
              label: "主诉",
            },
            {
              value: 10,
              label: "交流",
            },
            {
              value: 11,
              label: "指令",
            },
          ],
        },
        {
          value: 12,
          label: "医生-护士",
          children: [
            {
              value: 13,
              label: "交流",
            },
            {
              value: 14,
              label: "指令",
            },
          ],
        },
        {
          value: 15,
          label: "患者-护士",
          children: [
            {
              value: 16,
              label: "交流",
            },
            {
              value: 17,
              label: "指令",
            },
            {
              value: 18,
              label: "咨询",
            },
          ],
        },
      ],
      task_outline: [
        {
          value: "病史采集",
          label: "病史采集",
        },
        {
          value: "体格检查",
          label: "体格检查",
        },
        {
          value: "疾病诊断",
          label: "疾病诊断",
        },
        {
          value: "临床操作",
          label: "临床操作",
        },
        {
          value: "治疗方案商讨",
          label: "治疗方案商讨",
        },
        {
          value: "诊疗计划制订",
          label: "诊疗计划制订",
        },
        {
          value: "疾病预防",
          label: "疾病预防",
        },
        {
          value: "人际交往",
          label: "人际交往",
        },
      ],
      task_value: [],
      author: "",
      author_org: "",
      time_created: "",
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
      query.compare("id", "=", Cookie.get("ques_checkEdit"));
      let Question = new BaaS.TableObject("questions_information");
      Question.setQuery(query)
        .find()
        .then(
          (res) => {
            this.question = res.data.objects[0];
            this.question.options = JSON.parse(this.question.options);
            this.initial = res.data.objects[0];
            if (this.question.ques_level != null) {
              this.level_value = this.question.ques_level;
            }
            if (this.question.grade_standard != null) {
              this.grade_value = this.question.grade_standard;
            }
            if (this.question.topic_outline != null) {
              this.topic_value = this.question.topic_outline;
            }
            if (this.question.task_outline != null) {
              this.task_value = this.question.task_outline;
            }
            if (this.question.department != null) {
              this.department_value = this.question.department;
            }
            if (this.question.question_class != null) {
              this.qclass_value = this.question.question_class;
            }
            if (this.question.question_type_5he != null) {
              this.fivehe_value = this.question.question_type_5he;
            }
            if (this.question.author != null) {
              this.author = this.question.author;
            }
            if (this.question.author_org != null) {
              this.author_org = this.question.author_org;
            }
            if (this.question.time_created != null) {
              this.time_created = this.question.time_created;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    back() {
      Cookies.set("ques_checkEdit", "");
      Cookies.set("question_content", "");
      Cookies.set("question_file", "");
      Cookies.set("selectQues", "false");
      this.$router.go(-1);
    },
    quesEdit() {
      this.click += 1;
      if (this.click == 1) {
        this.createEdit();
      }
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      this.edit = true;
      this.check = false;
    },
    quesCheck() {
      this.edit = false;
      this.check = true;
      // this.beforeDestroy()
    },
    file() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var f = document.getElementById("file");
      f.addEventListener("change", function (e) {
        let File = new BaaS.File();
        let fileParams = { fileObj: e.target.files[0] };
        File.upload(fileParams).then(
          (res) => {
            // this.image = res.data.file.path;
            this.change_file = true;
            this.$refs.image.src = res.data.file.path;
            // this.$refs.img.src = this.image
          },
          (err) => {
            // HError
          }
        );
      });
      // let File = new BaaS.File();
      // let fileParams = this.dialogImageUrl;
      // File.upload(fileParams).then(
      //   (res) => {
      //     console.log(res);
      //     // this.image = res.data.file.path;
      //     // this.change_file = true;
      //   },
      //   (err) => {
      //     // HError
      //   }
      // );
      // dialogImageUrl;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async checkQues() {
      var valid = true;
      if (this.level_value == "") {
        this.question.ques_level = null;
      } else {
        this.question.ques_level = this.level_value;
      }
      if (this.grade_value == "") {
        this.question.grade_standard = null;
      } else {
        this.question.grade_standard = this.grade_value;
      }
      if (this.department_value == "") {
        this.question.department = null;
      } else {
        this.question.department = this.department_value;
      }
      if (this.task_value == "") {
        this.question.task_outline = null;
      } else {
        this.question.task_outline = this.task_value;
      }
      if (this.topic_value == "") {
        this.question.topic_outline = null;
      } else {
        this.question.topic_outline = this.topic_value;
      }
      if (this.qclass_value == "") {
        this.question.question_class = null;
      } else {
        this.question.question_class = this.qclass_value;
      }
      if (this.fivehe_value == "") {
        this.question.question_type_5he = null;
      } else {
        this.question.question_type_5he = this.fivehe_value;
      }
      if (this.author == "") {
        this.question.author = null;
      } else {
        this.question.author = this.author;
      }
      if (this.author_org == "") {
        this.question.author_org = null;
      } else {
        this.question.author_org = this.author_org;
      }
      if (this.time_created == "") {
        this.question.time_created = null;
      } else {
        this.question.time_created = this.time_created;
      }
      for (let i = 0; i < this.editor.length; i++) {
        if (valid == false) {
          break;
        }
        if (this.editor[i].toolbarSelector == "#material") {
          if (this.editor[i].txt.text() == "") {
            this.content = null;
            this.$message({
              message: "请填写题干",
              type: "warning",
            });
            valid = false;
            break;
          } else {
            this.content = this.editor[i].txt.text();
          }
        }
        if (this.editor[i].toolbarSelector == "#question") {
          if (
            this.editor[i].txt.text() == "" ||
            this.editor[i].txt.text() == "null" ||
            this.editor[i].txt.text() == "undefined" ||
            this.editor[i].txt.text() == undefined
          ) {
            this.question.question = null;
          } else {
            this.question.question = this.editor[i].txt.text();
          }
        } else if (this.editor[i].toolbarSelector == "#analysis") {
          if (
            this.editor[i].txt.text() == "" ||
            this.editor[i].txt.text() == "null" ||
            this.editor[i].txt.text() == "undefined" ||
            this.editor[i].txt.text() == undefined
          ) {
            this.question.analysis = null;
          } else {
            this.question.analysis = this.editor[i].txt.text();
          }
        }
        if (this.question.primary_ques_type != "") {
          if (
            (this.question.primary_ques_type == "听力" ||
              this.question.primary_ques_type == "阅读" ||
              this.question.primary_ques_type == "写作") &&
            this.question.secondary_ques_type == ""
          ) {
            this.$message({
              message: "请选择二级题型",
              type: "warning",
            });
            valid = false;
            break;
          }
          if (
            this.question.primary_ques_type == "写作" ||
            this.question.primary_ques_type == "简答题"
          ) {
            if (this.editor[i].toolbarSelector == "#answer") {
              if (this.editor[i].txt.text() == "") {
                this.question.answer = null;
                this.$message({
                  message: "请填写答案",
                  type: "warning",
                });
                valid = false;
                break;
              } else {
                this.question.answer = this.editor[i].txt.text();
              }
            }
          } else {
            if (
              this.question.secondary_ques_type != "听句子，判断对错" &&
              this.question.primary_ques_type != "判断题"
            ) {
              for (let k = 0; k < this.option.length; k++) {
                if ("#" + this.option[k] == this.editor[i].toolbarSelector) {
                  if (this.editor[i].txt.text() == "") {
                    this.$message({
                      message: "请填写选项答案",
                      type: "warning",
                    });
                    valid = false;
                    break;
                  } else {
                    for (let j = 0; j < this.question.options.length; j++) {
                      if (
                        "#" + this.question.options[j].index ==
                        this.editor[i].toolbarSelector
                      ) {
                        this.question.options[j].content =
                          this.editor[i].txt.text();
                      }
                    }
                  }
                }
              }
              if (
                this.question.answer == "" ||
                this.option.indexOf(this.question.answer) == -1
              ) {
                this.$message({
                  message: "请填写答案",
                  type: "warning",
                });
                valid = false;
                break;
              }
            } else {
              let p = [
                {
                  content: "√",
                  index: "A",
                },
                {
                  content: "×",
                  index: "B",
                },
              ];
              this.question.options = null;
              this.question.options = p;
              if (
                this.question.answer == "" ||
                (this.question.answer != "√" && this.question.answer != "×")
              ) {
                this.$message({
                  message: "请填写答案",
                  type: "warning",
                });
                valid = false;
                break;
              }
            }
          }
        } else {
          this.$message({
            message: "请选择一级题型",
            type: "warning",
          });
          valid = false;
          break;
        }
      }
      if (valid == true) {
        this.dialogVisible = true;
      }
      return valid;
    },
    saveQues() {
      this.dialogVisible = false;
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let saveContent = new BaaS.TableObject("question_content");
      let content = saveContent.getWithoutData(
        this.question.question_content_id
      );
      content.set("content", this.content);
      content.update().then(
        (res) => {
          this.question.question_content_id = res.data.id;
          Cookies.set("question_content", this.content);
        },
        (err) => {
          console.log(err);
        }
      );
      if (this.question.options != null) {
        this.question.options = JSON.stringify(this.question.options);
      }
      if (Cookie.get("catalog") != "") {
        this.question.catalog = Cookie.get("catalog");
      }
      let saveQues = new BaaS.TableObject("questions_information");
      let question = saveQues.getWithoutData(this.question.id);
      question.set(this.question);
      question.update().then(
        (res) => {
          this.question.options = JSON.parse(this.question.options);
          this.$message({
            message: "题目保存成功",
            type: "success",
          });
          this.quesCheck();
        },
        (err) => {
          console.log(err);
          this.$message({
            message: "题目保存失败",
            type: "danger",
          });
        }
      );
    },
    createEdit() {
      const material = new E("#material");
      material.config.height = 200;
      material.config.zIndex = 7;
      material.config.placeholder = "请输入题干";
      material.create();
      this.editor.push(material);
      const question = new E("#question");
      question.config.height = 50;
      question.config.zIndex = 6;
      question.config.placeholder = "请输入问题";
      question.create();
      this.editor.push(question);
      if (this.question.options) {
        for (let i = 1; i <= this.question.options.length; i++) {
          var alphabet = String.fromCharCode(64 + parseInt(i));
          var option = new E("#" + alphabet);
          option.config.height = 50;
          option.config.zIndex = 6 - i;
          option.config.placeholder = "请输入选项";
          option.create();
          this.editor.push(option);
        }
      }
      if (this.question.primary_ques_type == "写作") {
        const answer = new E("#answer");
        answer.config.height = 100;
        answer.config.zIndex = 1;
        answer.config.placeholder = "请输入答案";
        answer.create();
        this.editor.push(answer);
      }
      const analysis = new E("#analysis");
      analysis.config.height = 100;
      analysis.config.zIndex = 0;
      analysis.config.placeholder = "请输入解析";
      analysis.create();
      this.editor.push(analysis);
    },
  },
  created() {},
  mounted() {
    this.selectQues = Cookie.get("selectQues");
    this.init();
    this.content = Cookie.get("question_content");
    this.file_url = Cookie.get("question_file");
  },
};
</script>
<style>
.ques_checkEdit {
  padding: 30px 70px;
}
.ques_check_top {
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
  border-bottom: 2px solid rgb(206, 206, 206);
  padding: 0 30px;
  margin-bottom: 20px;
}
.ques_top_title {
  font-size: 25px;
  font-weight: bold;
  align-self: flex-start;
}
.ques_edit:hover {
  cursor: pointer;
  color: #3a8ee6;
}
.back {
  align-self: flex-start;
}
.ques_check_content {
  border: 1px solid rgb(206, 206, 206);
  background-color: white;
}
.ques_content_type {
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
  background-color: #e2e2e2;
  text-align: left;
  color: #3a8ee6;
  padding: 0 20px;
  margin-bottom: 20px;
}
.ques_content_details {
  padding: 0 50px;
  /* text-align: left; */
}
.details {
  text-align: left;
}
.details p {
  font-size: 18px;
  line-height: 40px;
}
.details_ques_content {
  margin-bottom: 10px;
}
.sub_ques_content {
  border-top: 2px solid #747474;
}
.ques_answer {
  border-top: 1px dashed #c0c4cc;
  margin: 10px 0;
}
.ques_edit_content {
  background-color: white;
  padding: 15px;
  border: 1px solid #dddcdc;
  border-radius: 10px;
}
.edit_type {
  display: flex;
  flex-direction: column;
  border-bottom: 1px dashed #c0c4cc;
}
.edit_primary_type,
.edit_secondary_type {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}
.file {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.file input {
  margin-left: 10px;
}
.edit_ques_content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #c0c4cc;
}
.edit_ques_content #material,
.ques_analysis #analysis {
  flex: 1;
  margin-left: 10px;
}
.edit_sub_ques {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.warn {
  color: red;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.edit_sub_ques_content {
  border-bottom: 1px dashed #c0c4cc;
  padding: 10px 0;
}
.edit_sub_ques_title {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}
.edit_sub_ques_title .el-input {
  margin-left: 10px;
}
.edit_sub_ques_title i {
  font-size: 30px;
  color: green;
  margin-left: 5px;
}
.ques_checkEdit .question {
  display: flex;
  flex-direction: row;
  align-items: center;
}
#question,
.input_options {
  flex: 1;
}
.edit_ques_options {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.ques_analysis {
  display: flex;
  flex-direction: row;
  align-items: center;
  /* border-top: 1px dashed #c0c4cc; */
  /* border-bottom: 1px dashed #c0c4cc; */
  padding: 10px 0;
}
.knowledge {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
  /* padding-top: 10px; */
  align-items: center;
  /* border-top: 1px dashed #c0c4cc; */
}
.knowledge .el-icon-info {
  font-size: 20px;
  margin-left: 10px;
}
.judge {
  display: flex;
  height: 30px;
  align-items: center;
  margin-top: 10px;
}
.write_answer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
}
#answer {
  flex: 1;
}
</style>