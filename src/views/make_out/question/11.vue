//查看/编辑试卷
<template>
  <div class="ques_checkEdit">
    <div class="ques_check_top">
      <div class="ques_top_title">
        <div>
          <span>添加题目</span>
        </div>
      </div>
      <el-button size="small" @click="back" class="back">返回</el-button>
    </div>
    <div class="ques_edit_content">
      <div class="edit_type">
        <div class="edit_primary_type">
          一级题型：
          <el-radio-group v-model="radio1" @change="typePChange">
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
        <div class="edit_secondary_type"
        v-show="
                radio1 == '听力' ||
                radio1 == '阅读' ||
                radio1 == '写作'
              ">
          二级题型：
          <el-radio-group v-model="radio2" v-if="radio1 == '听力'">
            <el-radio-button label="听句子，判断对错"></el-radio-button>
            <el-radio-button label="听短对话，选择正确答案"></el-radio-button>
            <el-radio-button label="听长对话，选择正确答案"></el-radio-button>
            <el-radio-button label="听短文，选择正确答案"></el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="radio2" v-if="radio1 == '阅读'">
            <el-radio-button label="选择正确的词语填空"></el-radio-button>
            <el-radio-button
              label="阅读语段，选择与语段意思一致的一项"
            ></el-radio-button>
            <el-radio-button label="阅读材料，选择正确答案"></el-radio-button>
            <el-radio-button label="阅读短文，选择正确答案"></el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="radio2" v-if="radio1 == '写作'">
            <el-radio-button
              label="根据一段长对话写门诊病历记录"
            ></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div v-show="question">
        <div class="edit_ques_content">
          题干：
          <div id="material">
          </div>
        </div>
        <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="s in questions[currentQues - 1].sub_question"
              :key="s.sub_sequence"
              :title="s.actual_sequence + '.' + s.question"
              :name="s.sub_sequence + ''"
            >
              <div class="score">
                分数：
                <el-input
                  type="number"
                  v-model="s.score"
                  placeholder="请输入分数"
                  @input="typeSChange"
                ></el-input>
                分
              </div>
              <div class="question">
                问题：
                <div
                  :id="
                    'question' +
                    questions[currentQues - 1].sequence +
                    '_' +
                    s.sub_sequence
                  "
                >
                  <p>{{ s.question }}</p>
                </div>
              </div>
              <p
                class="warn"
                v-show="
                  questions[currentQues - 1].primary_ques_type != '' &&
                  questions[currentQues - 1].primary_ques_type != '写作' &&
                  questions[currentQues - 1].primary_ques_type != '简答题'
                "
              >
                选项：答案选中项为正确答案标示。
              </p>
              <div
                class="options"
                v-show="
                  questions[currentQues - 1].primary_ques_type != '' &&
                  questions[currentQues - 1].primary_ques_type != '写作' &&
                  questions[currentQues - 1].primary_ques_type != '简答题'
                "
              >
                <div
                  v-show="
                    questions[currentQues - 1].secondary_ques_type ==
                      '听句子，判断对错' ||
                    questions[currentQues - 1].primary_ques_type == '判断题'
                  "
                  class="judge"
                >
                  <el-radio v-model="s.answer" label="√">√</el-radio>
                  <el-radio v-model="s.answer" label="×">×</el-radio>
                </div>
                <div
                  class="select_options"
                  v-show="
                    questions[currentQues - 1].secondary_ques_type !=
                      '听句子，判断对错' &&
                    questions[currentQues - 1].primary_ques_type != '判断题'
                  "
                  v-for="o in option"
                  :key="o.index"
                >
                  <el-radio
                    slot="prepend"
                    :label="o"
                    v-model="s.answer"
                    border
                  ></el-radio>
                  <div
                    :id="
                      o +
                      questions[currentQues - 1].sequence +
                      '_' +
                      s.sub_sequence
                    "
                    class="input_options"
                  >
                    <p v-if="o == 'A'">{{ s.A }}</p>
                    <p v-else-if="o == 'B'">{{ s.B }}</p>
                    <p v-else-if="o == 'C'">{{ s.C }}</p>
                    <p v-else-if="o == 'D'">{{ s.D }}</p>
                  </div>
                </div>
              </div>
              <div
                class="answer"
                v-show="
                  questions[currentQues - 1].primary_ques_type == '写作' ||
                  questions[currentQues - 1].primary_ques_type == '简答题'
                "
              >
                答案：
                <div
                  :id="
                    'answer' +
                    questions[currentQues - 1].sequence +
                    '_' +
                    s.sub_sequence
                  "
                >
                  <p>{{ s.answer }}</p>
                </div>
              </div>
              <div class="analysis">
                解析：
                <div
                  :id="
                    'analysis' +
                    questions[currentQues - 1].sequence +
                    '_' +
                    s.sub_sequence
                  "
                >
                  <p>{{ s.analysis }}</p>
                </div>
              </div>
              <div class="select_bar">
                <div class="knowledge">
                  等级：
                  <el-select
                    v-model="s.level_value"
                    placeholder="请选择题目等级"
                    @change="typeSChange"
                  >
                    <el-option
                      v-for="item in level"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="knowledge">
                  等级标准：
                  <el-cascader
                    v-model="s.grade_value"
                    :options="grade_standard"
                    :props="props"
                    collapse-tags
                    clearable
                    placeholder="请选择等级标准"
                    @change="(type) => grade(type, s.sub_sequence)"
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
                    v-model="s.topic_value"
                    :options="topic_outline"
                    :props="props"
                    collapse-tags
                    clearable
                    placeholder="请选择话题大纲"
                    @change="(type) => topic(type, s.sub_sequence)"
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
                  <el-select
                    v-model="s.task_value"
                    multiple
                    placeholder="请选择任务大纲"
                  >
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
                    v-model="s.department_value"
                    multiple
                    placeholder="请搜索或添加系统"
                    @change="typeSChange"
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
                <div class="knowledge">
                  题目类型：
                  <el-select
                    v-model="s.qclass_value"
                    placeholder="请选择题目类型"
                    @change="typeSChange"
                  >
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
                  <el-select
                    v-model="s.fivehe_value"
                    placeholder="请选择题目五何类型"
                    @change="typeSChange"
                  >
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
                  <el-input
                    v-model="s.author"
                    placeholder="请输入题目作者"
                  ></el-input>
                </div>
                <div class="knowledge">
                  作者单位：
                  <el-input
                    v-model="s.author_org"
                    placeholder="请输入作者单位"
                  ></el-input>
                </div>
                <div class="knowledge">
                  题目创作日期：
                  <el-date-picker
                    v-model="s.time_created"
                    type="date"
                    placeholder="选择题目创作日期"
                  >
                  </el-date-picker>
                </div>
              </div>
              <div class="sub_ques_check">
                <el-button
                  type="success"
                  icon="el-icon-top"
                  circle
                  v-show="s.sub_sequence != 1"
                  @click="subTop(s.sub_sequence - 1)"
                ></el-button>
                <el-button
                  type="success"
                  icon="el-icon-top"
                  circle
                  disabled
                  v-show="s.sub_sequence == 1"
                ></el-button>
                <el-button
                  type="success"
                  icon="el-icon-bottom"
                  circle
                  v-show="s.sub_sequence != currentSubQues"
                  @click="subDown(s.sub_sequence - 1)"
                ></el-button>
                <el-button
                  type="success"
                  icon="el-icon-bottom"
                  circle
                  disabled
                  v-show="s.sub_sequence == currentSubQues"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="subDel(s.sub_sequence - 1)"
                ></el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        <p class="warn">选项：答案选中项为正确答案标示。</p>
        <div style="border-bottom: 1px dashed #c0c4cc">
          <div class="question">
            问题：
            <div id="question">
              <!-- <p>{{ question.question }}</p> -->
            </div>
          </div>
          <div class="write_answer" v-show="radio1 == '写作'">
            答案：
            <div id="answer">
              <!-- <p>{{ question.answer }}</p> -->
            </div>
          </div>

          <div v-show="radio2 == '听句子，判断对错'" class="judge">
            <el-radio v-model="judge" label="√">√</el-radio>
            <el-radio v-model="judge" label="×">×</el-radio>
          </div>
          <div
            class="edit_ques_options"
            v-show="radio2 != '听句子，判断对错' && radio1 != '写作'"
            v-for="o in option"
            :key="o.index"
          >
            <el-radio
              slot="prepend"
              :label="o"
              v-model="radio"
              border
            ></el-radio>
            <div :id="o" class="input_options">
              <!-- <p>{{ s.content }}</p> -->
            </div>
          </div>
          <div class="ques_analysis">
            <el-checkbox v-model="checked">解析：</el-checkbox>
            <div id="analysis" v-show="checked">
              <!-- <p>{{ question.analysis }}</p> -->
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
            placeholder="请搜索或添加系统"
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
      </div>
      <div class="edit_button">
        <el-button type="success" plain @click="dialogVisible = true"
          >保存题目</el-button
        >
        <el-button type="info" plain @click="back"
          >取消</el-button
        >
      </div>
      <el-dialog
        title="添加题目"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>确认添加题目吗？</span>
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
      activeNames:["1"],
      empty: [],
      editor: [],
      option: ["A", "B", "C", "D"],
      question: [],
      judge: "",
      radio: "",
      radio1: "听力",
      radio2: "听句子，判断对错",
      checked: true,
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
      dialogVisible: false,
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
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      let Knowledge_All = new BaaS.TableObject("knowledge_point");
      Knowledge_All.find().then(
        (res) => {
          this.knowledge = res.data.objects;
        },
        (err) => {
          console.log(err);
        }
      );
      // let Department = new BaaS.TableObject("department");
      // Department.find().then(
      //   (res) => {
      //     this.department = res.data.objects;
      //   },
      //   (err) => {
      //     console.log(err);
      //   }
      // );
      let Test = new BaaS.TableObject("test");
      Test.find().then(
        (res) => {
          this.test = res.data.objects;
        },
        (err) => {
          console.log(err);
        }
      );
      let Source = new BaaS.TableObject("source");
      Source.find().then(
        (res) => {
          this.source = res.data.objects;
        },
        (err) => {
          console.log(err);
        }
      );
    },
    back() {
      this.$router.go(-1);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    saveQues() {
      this.dialogVisible = false;
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      this.question.primary_ques_type = this.radio1;
      this.question.secondary_ques_type = this.radio2;
      var content_id = "";
      for (let i = 0; i < this.editor.length; i++) {
        if (this.editor[i].toolbarSelector == "#material") {
          let saveContent = new BaaS.TableObject("question_content");
          let content = saveContent.create();
          if (this.editor[i].txt.text() == "") {
            content.set("content", null);
          } else {
            content.set("content", this.editor[i].txt.text());
          }
          content.save().then(
            (res) => {
              // console.log(res);
              // console.log(res.data.id)
              // content_id = res.data.id;
              this.question.question_content_id = res.data.id;
              for (let i = 0; i < this.editor.length; i++) {
                if (this.editor[i].toolbarSelector == "#question") {
                  if (this.editor[i].txt.text() == "") {
                    this.question.question = null;
                  } else {
                    this.question.question = this.editor[i].txt.text();
                  }
                } else if (this.editor[i].toolbarSelector == "#analysis") {
                  if (this.editor[i].txt.text() == "") {
                    this.question.analysis = null;
                  } else {
                    this.question.analysis = this.editor[i].txt.text();
                  }
                } else if (
                  this.editor[i].toolbarSelector == "#answer" &&
                  this.radio1 == "写作"
                ) {
                  if (this.editor[i].txt.text() == "") {
                    this.question.answer = null;
                  } else {
                    this.question.answer = this.editor[i].txt.text();
                  }
                } else {
                  let a = new Array();
                  for (let j = 0; j < this.option.length; j++) {
                    if (
                      "#" + this.option[j] ==
                      this.editor[i].toolbarSelector
                    ) {
                      let b = {
                        content: this.editor[i].txt.text(),
                        index: this.option[j],
                      };
                      a.push(b);
                    }
                  }
                  this.question.options = a;
                }
              }
              if (this.radio2 == "听句子，判断对错") {
                let a = [
                  {
                    content: "√",
                    index: "A",
                  },
                  {
                    content: "×",
                    index: "B",
                  },
                ];
                this.question.options = a;
                this.question.answer = this.judge;
              }
              if (this.question.options != null) {
                this.question.options = JSON.stringify(this.question.options);
              }
              if (content_id == "") {
                this.question.questioon_content_id = null;
              } else {
                this.question.questioon_content_id = this.content_id;
              }
              if (this.level_value == "") {
                this.question.ques_level = null;
              } else {
                this.question.ques_level = this.level_value;
              }
              if (
                this.grade_value == undefined ||
                this.grade_value.length <= 0
              ) {
                this.question.grade_standard = null;
              } else {
                this.question.grade_standard = this.grade_value;
              }
              if (
                this.department_value == undefined ||
                this.department_value.length <= 0
              ) {
                this.question.department_id = null;
              } else {
                this.question.department_id = this.department_value;
              }
              if (this.topic_value == undefined || this.topic_value.length <= 0) {
                this.question.topic_outline = null;
              } else {
                this.question.topic_outline = this.topic_value;
              }
              if (
                this.task_value == undefined ||
                this.task_value.length <= 0
              ) {
                this.question.task_outline = null;
              } else {
                this.question.task_outline = this.task_value;
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
              if(Cookie.get("catalog")!=""){
                question.catalog = Cookie.get("catalog")
              }
              let saveQues = new BaaS.TableObject("questions_information");
              let question = saveQues.create();
              // question.set(this.question);
              // console.log(this.question);
              question
                .set(this.question)
                .save()
                .then(
                  (res) => {
                    // console.log(res);
                    if (this.question.options != null) {
                      this.question.options = JSON.parse(this.question.options);
                    }
                    this.$message({
                      message: "题目保存成功",
                      type: "success",
                    });
                    this.back();
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
            (err) => {
              console.log(err);
            }
          );
        }
      }
    },
    createEdit() {
      const material = new E("#material");
      material.config.uploadImgServer = "/upload-img";
      material.config.uploadVideoServer = "/api/upload-video";
      material.config.height = 200;
      material.config.zIndex = 7;
      material.config.placeholder = "请输入题干";
      material.create();
      this.editor.push(material);
      const question = new E("#question");
      question.config.uploadImgServer = "/upload-img";
      question.config.uploadVideoServer = "/api/upload-video";
      question.config.height = 50;
      question.config.zIndex = 6;
      question.config.placeholder = "请输入问题";
      question.create();
      this.editor.push(question);
      //   if (this.question.options) {
      for (let i = 1; i <= this.option.length; i++) {
        var alphabet = String.fromCharCode(64 + parseInt(i));
        var option = new E("#" + alphabet);
        option.config.uploadImgServer = "/upload-img";
        option.config.uploadVideoServer = "/api/upload-video";
        option.config.height = 50;
        option.config.zIndex = 6 - i;
        option.config.placeholder = "请输入选项";
        option.create();
        this.editor.push(option);
      }
      //   }
      // if (this.radio1 == "写作") {
      const answer = new E("#answer");
      answer.config.uploadImgServer = "/upload-img";
      answer.config.uploadVideoServer = "/api/upload-video";
      answer.config.height = 100;
      answer.config.zIndex = 1;
      answer.config.placeholder = "请输入答案";
      answer.create();
      this.editor.push(answer);
      // }
      const analysis = new E("#analysis");
      analysis.config.uploadImgServer = "/upload-img";
      analysis.config.uploadVideoServer = "/api/upload-video";
      analysis.config.height = 100;
      analysis.config.zIndex = 0;
      analysis.config.placeholder = "请输入解析";
      analysis.create();
      this.editor.push(analysis);
    },
    typePChange() {
      this.radio2 = "";
    },
  },
  created() {},
  mounted() {
    this.init();
    this.createEdit();
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