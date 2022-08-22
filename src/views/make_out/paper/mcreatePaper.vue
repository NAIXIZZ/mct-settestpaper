<template>
  <div class="mcreatePaper">
    <div class="top">
      <div class="top_left">
        <h2>标题：</h2>
        <div class="title">
          <el-input v-model="title" placeholder="请输入试卷标题"></el-input>
        </div>
        <div>
          <el-checkbox v-model="exam">是否符合模考卷格式</el-checkbox>
        </div>
      </div>
      <div class="top_right">
        <el-button type="success" plain @click="savePaper">保存试卷</el-button>
        <el-button type="primary" plain @click="preview">预览</el-button>
        <el-button plain @click="back">返回</el-button>
      </div>
    </div>
    <div class="main_detail">
      <div class="main_left">
        <div class="main_left_top">
          <div class="ques_detail">
            题量：
            <div class="ques_details">{{ ques_num }}</div>
          </div>
          <div class="ques_detail">
            总分：
            <div class="ques_details">{{ ques_score }}</div>
          </div>
        </div>
        <div class="main_left_main">
          <div v-for="(type, i) in ques_type" :key="type.index">
            <el-card
              shadow="never"
              @mouseenter.native="hoverInP(i)"
              @mouseleave.native="hoverOutP(i)"
            >
              <div class="primary">
                <p v-if="i == 0">一、</p>
                <p v-else-if="i == 1">二、</p>
                <p v-else-if="i == 2">三、</p>
                <p v-else-if="i == 3">四、</p>
                <p v-else-if="i == 4">五、</p>
                <p v-else-if="i == 5">六、</p>
                <p v-else-if="i == 6">七、</p>
                <p v-else-if="i == 7">八、</p>
                {{ type.primary }}
              </div>
              <div class="type_detail">
                <p>共{{ type.total_num }}题，共{{ type.total_score }}分</p>
                <i
                  class="el-icon-circle-close type_del"
                  :id="'type_del' + i"
                  @click="typeDel(i)"
                ></i>
                <i
                  class="el-icon-arrow-up type_up"
                  :id="'type_up' + i"
                  @click="typeUp(i)"
                ></i>
                <i
                  class="el-icon-arrow-down type_down"
                  :id="'type_down' + i"
                  @click="typeDown(i)"
                ></i>
              </div>
            </el-card>
            <!-- </div> -->
            <div v-for="(stype, j) in type.secondary" :key="stype.start">
              <el-card
                v-show="stype.type != ''"
                shadow="never"
                @mouseenter.native="hoverInP(i + '_' + j)"
                @mouseleave.native="hoverOutP(i + '_' + j)"
              >
                <div class="type">{{ stype.type }}</div>
                <div class="type_detail">
                  <p>共{{ stype.num }}题，共{{ stype.score }}分</p>
                  <i
                    class="el-icon-circle-close type_del"
                    :id="'type_del' + i + '_' + j"
                    @click="stypeDel(i, j)"
                  ></i>
                  <i
                    class="el-icon-arrow-up type_up"
                    :id="'type_up' + i + '_' + j"
                    @click="stypeUp(i, j)"
                  ></i>
                  <i
                    class="el-icon-arrow-down type_down"
                    :id="'type_down' + i + '_' + j"
                    @click="stypeDown(i, j)"
                  ></i>
                </div>
              </el-card>
              <div v-for="(item, k) in questions" :key="item.sequence">
                <div
                  v-if="
                    item.sequence - 1 >= stype.start &&
                    item.sequence - 1 <= stype.end
                  "
                >
                  <el-card
                    shadow="hover"
                    @mouseenter.native="hoverInQ(k)"
                    @mouseleave.native="hoverOutQ(k)"
                  >
                    <div class="temp" @click="clickTab(item.sequence - 1)">
                      <p
                        class="ques_content_detail"
                        v-if="item.sub_question.length > 1"
                      >
                        {{ item.sub_question[0].actual_sequence }}-{{
                          item.sub_question[item.sub_question.length - 1]
                            .actual_sequence
                        }}.{{ item.question_content }}
                      </p>
                      <p class="ques_content_detail" v-else>
                        {{ item.sub_question[0].actual_sequence }}.{{
                          item.question_content
                        }}
                      </p>
                      <p>
                        共{{ item.sub_question.length }}题,共{{
                          item.total_score
                        }}分
                      </p>
                    </div>

                    <i
                      class="el-icon-circle-close ques_del"
                      :id="'ques_del' + k"
                      @click="quesDel(i, j, k)"
                    ></i>
                    <i
                      class="el-icon-arrow-up ques_up"
                      :id="'ques_up' + k"
                      @click="quesUp(i, j, k)"
                    ></i>
                    <i
                      class="el-icon-arrow-down ques_down"
                      :id="'ques_down' + k"
                      @click="quesDown(i, j, k)"
                    ></i>
                  </el-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main_right" v-if="questions[currentQues - 1]">
        <div class="main_right_top">
          <div class="main_right_top_type">
            <div class="edit_primary_type">
              一级题型：
              <el-radio-group
                v-model="questions[currentQues - 1].primary_ques_type"
                @change="typePChange"
              >
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
            <div
              class="edit_secondary_type"
              v-show="
                questions[currentQues - 1].primary_ques_type == '听力' ||
                questions[currentQues - 1].primary_ques_type == '阅读' ||
                questions[currentQues - 1].primary_ques_type == '写作'
              "
            >
              二级题型：
              <el-radio-group
                v-model="questions[currentQues - 1].secondary_ques_type"
                v-if="questions[currentQues - 1].primary_ques_type == '听力'"
                @change="typeSChange"
              >
                <el-radio-button label="听句子，判断对错"></el-radio-button>
                <el-radio-button
                  label="听短对话，选择正确答案"
                ></el-radio-button>
                <el-radio-button
                  label="听长对话，选择正确答案"
                ></el-radio-button>
                <el-radio-button label="听短文，选择正确答案"></el-radio-button>
              </el-radio-group>
              <el-radio-group
                v-model="questions[currentQues - 1].secondary_ques_type"
                v-if="questions[currentQues - 1].primary_ques_type == '阅读'"
                @change="typeSChange"
              >
                <el-radio-button label="选择正确的词语填空"></el-radio-button>
                <el-radio-button
                  label="阅读语段，选择与语段意思一致的一项"
                ></el-radio-button>
                <el-radio-button
                  label="阅读材料，选择正确答案"
                ></el-radio-button>
                <el-radio-button
                  label="阅读短文，选择正确答案"
                ></el-radio-button>
              </el-radio-group>
              <el-radio-group
                v-model="questions[currentQues - 1].secondary_ques_type"
                v-if="questions[currentQues - 1].primary_ques_type == '写作'"
                @change="typeSChange"
              >
                <el-radio-button
                  label="根据一段长对话写门诊病历记录"
                ></el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="main_right_top_import">
            <el-button type="success" round size="small">智能导入</el-button>
            <el-button type="warning" round size="small" @click="selectQues"
              >题库选题</el-button
            >
          </div>
        </div>
        <div class="main_right_ques">
          <div class="ques_content">
            题干：
            <div :id="'material' + questions[currentQues - 1].name">
              <p>{{ questions[currentQues - 1].question_content }}</p>
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
        </div>
        <div class="main_right_check">
          <el-button type="primary" plain @click="checkQues"
            >保存该题</el-button
          >
          <el-button type="success" plain @click="addSub">添加小题</el-button>
          <el-button
            type="warning"
            plain
            @click="saveAndadd"
            v-show="questions[currentQues - 1].saveQ"
            >添加大题</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import global from "@/util/global.js";
import E from "wangeditor";
var BaaS = require("minapp-sdk");
let clientID = "395062a19e209a770059";
BaaS.init(clientID);
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      max_sequence: 1,
      currentQues: 1,
      SCurrentQues: "1",
      currentSubQues: 1,
      questions: [],
      title: "",
      exam: false,
      ques_num: 0,
      ques_score: 0,
      option: ["A", "B", "C", "D"],
      radio: "",
      editor: [],
      sub_title: "",
      activeNames: ["1"],
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
      lastClick: 0,
      ques_type: [],
      props: { multiple: true, expandTrigger: "hover" },
      grade_value: [],
      grade_standard: [
        {
          value: "医学汉语能力总体描述",
          label: "医学汉语能力总体描述",
          children: [
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
        },
        {
          value: "医学汉语口头理解能力（听）",
          label: "医学汉语口头理解能力（听）",
          children: [
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
        },
        {
          value: "医学汉语口头理解能力（说）",
          label: "医学汉语口头理解能力（说）",
          children: [
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
        },
        {
          value: "医学汉语口头理解能力（读）",
          label: "医学汉语口头理解能力（读）",
          children: [
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
        },
        {
          value: "医学汉语口头理解能力（写）",
          label: "医学汉语口头理解能力（写）",
          children: [
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
        },
      ],
      topic_value: [],
      topic_outline: [
        {
          value: "医生-医生",
          label: "医生-医生",
          children: [
            {
              value: "询问",
              label: "询问",
            },
            {
              value: "交流",
              label: "交流",
            },
            {
              value: "指令",
              label: "指令",
            },
          ],
        },
        {
          value: "医生-患者",
          label: "医生-患者",
          children: [
            {
              value: "问诊",
              label: "问诊",
            },
            {
              value: "诊断",
              label: "诊断",
            },
            {
              value: "治疗",
              label: "治疗",
            },
            {
              value: "主诉",
              label: "主诉",
            },
            {
              value: "交流",
              label: "交流",
            },
            {
              value: "指令",
              label: "指令",
            },
          ],
        },
        {
          value: "医生-护士",
          label: "医生-护士",
          children: [
            {
              value: "交流",
              label: "交流",
            },
            {
              value: "指令",
              label: "指令",
            },
          ],
        },
        {
          value: "患者-护士",
          label: "患者-护士",
          children: [
            {
              value: "交流",
              label: "交流",
            },
            {
              value: "指令",
              label: "指令",
            },
            {
              value: "咨询",
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
    async init() {
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

      if (sessionStorage.getItem("questions") == null) {
        this.max_sequence = this.ques_num;
        this.SCurrentQues = this.currentQues.toString();
        var question = {
          name: this.SCurrentQues,
          sequence: this.currentQues,
          primary_ques_type: "",
          secondary_ques_type: "",
          question_content: "",
          total_score: 0,
          sub_question: [],
          saveQ: false,
          saveT: false,
        };
        var sub = {
          actual_sequence: this.max_sequence,
          sub_sequence: 1,
          score: "",
          question: "",
          options: [],
          answer: "",
          analysis: "",
          level_value: "",
          // knowledge_value: "",
          grade_value: "",
          topic_value: "",
          task_value: "",
          department_value: "",
          // test_value: "",
          // source_value: "",
          qclass_value: "",
          fivehe_value: "",
          A: "",
          B: "",
          C: "",
          D: "",
          author: "",
          author_org: "",
          time_created: "",
        };
        question.sub_question.push(sub);
        await this.questions.push(question);
        this.createEdit();
      } else {
        this.questions = JSON.parse(sessionStorage.getItem("questions"));
        this.ques_type = JSON.parse(sessionStorage.getItem("ques_type"));
        this.currentQues = sessionStorage.getItem("currentQues") * 1;
        this.currentSubQues = sessionStorage.getItem("currentSubQues");
        this.title = sessionStorage.getItem("title");
        if (sessionStorage.getItem("exam") == "true") {
          this.exam = true;
        } else {
          this.exam = false;
        }
        this.ques_num = sessionStorage.getItem("ques_num") * 1;
        this.ques_score = sessionStorage.getItem("ques_score") * 1;
        this.max_sequence = this.ques_num;
        this.SCurrentQues = this.currentQues.toString();
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].sequence *= 1;
          this.questions[i].total_score *= 1;
          for (let j = 0; j < this.questions[i].sub_question.length; j++) {
            this.questions[i].sub_question[j].actual_sequence *= 1;
            this.questions[i].sub_question[j].sub_sequence *= 1;
            this.questions[i].sub_question[j].score *= 1;
          }
        }
        let ques = [];
        let content = [];
        if (global.totalSelect.length != 0) {
          for (let i = 0; i < global.totalSelect.length; i++) {
            for (let j = 0; j < global.totalSelect[i].sel.length; j++) {
              if (
                global.totalSelect[i].sel[j].question_content_id != null ||
                global.totalSelect[i].sel[j].question_content_id != ""
              ) {
                ques.push(global.totalSelect[i].sel[j]);
                let temp = {
                  question_content_id:
                    global.totalSelect[i].sel[j].question_content_id,
                  primary_ques_type:
                    global.totalSelect[i].sel[j].primary_ques_type,
                  secondary_ques_type:
                    global.totalSelect[i].sel[j].secondary_ques_type,
                  tool:
                    global.totalSelect[i].sel[j].question_content_id +
                    global.totalSelect[i].sel[j].primary_ques_type +
                    global.totalSelect[i].sel[j].secondary_ques_type,
                };
                content.push(temp);
              }
            }
          }
          const map = new Map();
          const qc = content.filter(
            (key) => !map.has(key.tool) && map.set(key.tool, 1)
          );
          let allQues = [];
          for (let i = 0; i < qc.length; i++) {
            let qtemp = [];
            for (let j = 0; j < ques.length; j++) {
              if (
                qc[i].question_content_id == ques[j].question_content_id &&
                qc[i].primary_ques_type == ques[j].primary_ques_type &&
                qc[i].secondary_ques_type == ques[j].secondary_ques_type
              ) {
                qtemp.push(ques[j]);
              }
            }
            let question = {
              primary_ques_type: qc[i].primary_ques_type,
              secondary_ques_type: qc[i].secondary_ques_type,
              question_content: qc[i].question_content_id,
              saveQ: true,
              saveT: false,
              sub_question: [],
            };
            let num = 1;
            for (let k = 0; k < qtemp.length; k++) {
              let sub = {
                sub_sequence: num,
                score: qtemp[k].score,
                question: qtemp[k].question,
                options: JSON.parse(qtemp[k].options),
                answer: qtemp[k].answer,
                analysis: qtemp[k].analysis,
                level_value: qtemp[k].ques_level,
                grade_value: qtemp[k].grade_standard,
                topic_value: qtemp[k].topic_outline,
                task_value: qtemp[k].task_outline,
                department_value: qtemp[k].department,
                qclass_value: qtemp[k].question_class,
                fivehe_value: qtemp[k].question_type_5he,
                A: "",
                B: "",
                C: "",
                D: "",
                author: "",
                author_org: "",
                time_created: "",
              };
              let t = JSON.parse(qtemp[k].options);
              if (t != null) {
                for (let m = 0; m < t.length; m++) {
                  if (t[m].index == "A") {
                    sub.A = t[m].content;
                  } else if (t[m].index == "B") {
                    sub.B = t[m].content;
                  } else if (t[m].index == "C") {
                    sub.C = t[m].content;
                  } else if (t[m].index == "D") {
                    sub.D = t[m].content;
                  }
                }
              }

              question.sub_question.push(sub);
              num++;
            }
            allQues.push(question);
          }
          for (let z = 0; z < allQues.length; z++) {
            if (this.questions[this.questions.length - 1].saveQ == false) {
              this.questions.splice(this.questions.length - 1, 1);
            }
            this.questions.push(allQues[z]);
            this.currentQues = this.questions.length;
            var b = 0;
            for (let i = 0; i < this.questions.length; i++) {
              let sum = 0;
              for (let j = 0; j < this.questions[i].sub_question.length; j++) {
                b += this.questions[i].sub_question[j].score * 1;
                sum += this.questions[i].sub_question[j].score * 1;
              }
              this.questions[i].total_score = sum;
            }
            this.ques_score = b;
            var c = 0;
            for (let i = 0; i < this.questions.length; i++) {
              c += this.questions[i].sub_question.length;
            }
            this.ques_num = c;
            if (this.ques_type.length > 0) {
              var findP = false;
              var findS = false;
              for (let i = 0; i < this.ques_type.length; i++) {
                if (
                  this.questions[this.currentQues - 1].primary_ques_type ==
                  this.ques_type[i].primary
                ) {
                  findP = true;
                  for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                    if (
                      this.questions[this.currentQues - 1]
                        .secondary_ques_type ==
                      this.ques_type[i].secondary[j].type
                    ) {
                      findS = true;
                      let temp = new Array();
                      this.questions[this.currentQues - 1].sequence =
                        this.ques_type[i].secondary[j].end + 2;
                      this.questions[this.currentQues - 1].name =
                        this.questions[
                          this.currentQues - 1
                        ].sequence.toString();
                      temp = this.questions[this.currentQues - 1];
                      for (
                        let k = this.questions.length - 2;
                        k > this.ques_type[i].secondary[j].end;
                        k--
                      ) {
                        this.questions[k].sequence++;
                        this.questions[k].name =
                          this.questions[k].sequence.toString();
                        this.questions[k + 1] = this.questions[k];
                      }
                      this.questions[this.ques_type[i].secondary[j].end + 1] =
                        temp;
                      this.currentQues = temp.sequence;
                      this.SCurrentQues = this.currentQues.toString();
                      this.ques_type[i].secondary[j].end++;
                      for (
                        let a = j + 1;
                        a < this.ques_type[i].secondary.length;
                        a++
                      ) {
                        this.ques_type[i].secondary[a].start++;
                        this.ques_type[i].secondary[a].end++;
                      }
                      for (let n = i + 1; n < this.ques_type.length; n++) {
                        for (
                          let m = 0;
                          m < this.ques_type[n].secondary.length;
                          m++
                        ) {
                          this.ques_type[n].secondary[m].start++;
                          this.ques_type[n].secondary[m].end++;
                        }
                      }
                      break;
                    }
                  }
                  if (findS == false) {
                    var s = {
                      type: this.questions[this.currentQues - 1]
                        .secondary_ques_type,
                      start:
                        this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end + 1,
                      end:
                        this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end + 1,
                    };
                    this.ques_type[i].secondary.push(s);
                    if (i != this.ques_type.length - 1) {
                      for (let n = i + 1; n < this.ques_type.length; n++) {
                        for (
                          let m = 0;
                          m < this.ques_type[n].secondary.length;
                          m++
                        ) {
                          this.ques_type[n].secondary[m].start++;
                          this.ques_type[n].secondary[m].end++;
                        }
                      }
                      let temp = new Array();
                      this.questions[this.currentQues - 1].sequence =
                        this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end + 1;
                      this.questions[this.currentQues - 1].name =
                        this.questions[
                          this.currentQues - 1
                        ].sequence.toString();
                      temp = this.questions[this.currentQues - 1];
                      for (
                        let k = this.questions.length - 2;
                        k >=
                        this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end;
                        k--
                      ) {
                        this.questions[k].sequence++;
                        this.questions[k].name =
                          this.questions[k].sequence.toString();
                        this.questions[k + 1] = this.questions[k];
                      }
                      this.questions[
                        this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end
                      ] = temp;
                      this.currentQues = temp.sequence;
                      this.SCurrentQues = this.currentQues.toString();
                    }
                  }
                  break;
                }
              }
              if (findP == false) {
                var p = {
                  primary:
                    this.questions[this.currentQues - 1].primary_ques_type,
                  secondary: [
                    {
                      type: this.questions[this.currentQues - 1]
                        .secondary_ques_type,
                      start:
                        this.ques_type[this.ques_type.length - 1].secondary[
                          this.ques_type[this.ques_type.length - 1].secondary
                            .length - 1
                        ].end + 1,
                      end:
                        this.ques_type[this.ques_type.length - 1].secondary[
                          this.ques_type[this.ques_type.length - 1].secondary
                            .length - 1
                        ].end + 1,
                    },
                  ],
                };
                this.ques_type.push(p);
              }
            } else {
              var initial = {
                primary: this.questions[this.currentQues - 1].primary_ques_type,
                secondary: [
                  {
                    type: this.questions[this.currentQues - 1]
                      .secondary_ques_type,
                    start: 0,
                    end: 0,
                  },
                ],
              };
              this.ques_type.push(initial);
            }
            for (let i = 0; i < this.ques_type.length; i++) {
              this.ques_type[i].hoverP = false;
              let score_temp = 0;
              let num_temp = 0;
              for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                this.ques_type[i].secondary[j].hoverS = false;
                let stemp = 0;
                let ntemp = 0;
                for (
                  let k = this.ques_type[i].secondary[j].start;
                  k <= this.ques_type[i].secondary[j].end;
                  k++
                ) {
                  stemp += this.questions[k].total_score;
                  ntemp += this.questions[k].sub_question.length;
                }
                this.ques_type[i].secondary[j].score = stemp;
                this.ques_type[i].secondary[j].num = ntemp;
                score_temp += this.ques_type[i].secondary[j].score;
                num_temp += this.ques_type[i].secondary[j].num;
              }
              this.ques_type[i].total_score = score_temp;
              this.ques_type[i].total_num = num_temp;
            }
            let qseq = 1;
            let seq = 1;
            for (let g = 0; g < this.questions.length; g++) {
              this.questions[g].sequence = qseq;
              this.questions[g].name = this.questions[g].sequence.toString();
              qseq++;
              let sub = 1;
              for (let h = 0; h < this.questions[g].sub_question.length; h++) {
                this.questions[g].sub_question[h].sub_sequence = sub;
                this.questions[g].sub_question[h].actual_sequence = seq;
                sub++;
                seq++;
              }
            }
            this.questions[this.currentQues - 1].saveQ = true;
            this.questions[this.currentQues - 1].saveT = true;
          }
        }
        setTimeout(() => {
          this.createEdit();
        }, 100);
        sessionStorage.clear();
        global.totalSelect = [];
      }
    },
    back() {
      Cookies.set("paperEdit", "");
      Cookies.set("paperInfo", "");
      this.$router.go(-1);
    },
    createEdit() {
      let quest = new Array();
      quest = this.questions;
      let current = this.currentQues;
      const material = new E("#material" + this.currentQues);
      material.config.uploadImgServer = "@/assets/UploadImage.php";
      material.config.uploadVideoServer = "/api/upload-video";
      material.config.height = 200;
      material.config.zIndex = 4;
      material.config.placeholder = "请输入题干";
      material.config.onchange = function () {
        quest[current - 1].saveQ = false;
      };
      material.config.onSelectionchange = function () {
        quest[current - 1].saveQ = false;
      };
      material.create();
      if (this.questions[this.currentQues - 1].saveT == true) {
        if (
          this.questions[this.currentQues - 1].question_content.search(
            ".png"
          ) != -1 ||
          this.questions[this.currentQues - 1].question_content.search(
            ".jpg"
          ) != -1 ||
          this.questions[this.currentQues - 1].question_content.search(
            ".gif"
          ) != -1
        ) {
          material.txt.html(
            "<img :src='" +
              this.questions[this.currentQues - 1].question_content +
              "' />"
          );
        } else {
          material.txt.html(
            "<p>" +
              this.questions[this.currentQues - 1].question_content +
              "</p>"
          );
        }
      }
      this.editor.push(material);
      for (let i = 1; i <= this.currentSubQues; i++) {
        const question = new E("#question" + this.currentQues + "_" + i);
        question.config.uploadImgServer = "/upload-img";
        question.config.uploadVideoServer = "/api/upload-video";
        question.config.height = 50;
        question.config.zIndex = 5;
        question.config.placeholder = "请输入问题";
        question.config.onchange = function () {
          quest[current - 1].saveQ = false;
        };
        question.config.onSelectionchange = function () {
          quest[current - 1].saveQ = false;
        };
        question.create();
        if (quest[current - 1].saveT == true) {
          question.txt.html(
            "<p>" + quest[current - 1].sub_question[i - 1].question + "<p>"
          );
        }
        this.editor.push(question);
        for (let j = 1; j <= this.option.length; j++) {
          var alphabet = String.fromCharCode(64 + parseInt(j));
          var option = new E("#" + alphabet + this.currentQues + "_" + i);
          option.config.uploadImgServer = "/upload-img";
          option.config.uploadVideoServer = "/api/upload-video";
          option.config.height = 50;
          option.config.zIndex = 9 - j;
          option.config.placeholder = "请输入选项";
          option.config.onchange = function () {
            quest[current - 1].saveQ = false;
          };
          option.config.onSelectionchange = function () {
            quest[current - 1].saveQ = false;
          };
          option.create();
          if (this.questions[this.currentQues - 1].saveT == true) {
            if (alphabet == "A") {
              option.txt.html(
                "<p>" +
                  this.questions[this.currentQues - 1].sub_question[i - 1].A +
                  "<p>"
              );
            } else if (alphabet == "B") {
              option.txt.html(
                "<p>" +
                  this.questions[this.currentQues - 1].sub_question[i - 1].B +
                  "<p>"
              );
            } else if (alphabet == "C") {
              option.txt.html(
                "<p>" +
                  this.questions[this.currentQues - 1].sub_question[i - 1].C +
                  "<p>"
              );
            } else if (alphabet == "D") {
              option.txt.html(
                "<p>" +
                  this.questions[this.currentQues - 1].sub_question[i - 1].D +
                  "<p>"
              );
            }
          }
          this.editor.push(option);
        }
        const answer = new E("#answer" + this.currentQues + "_" + i);
        answer.config.uploadImgServer = "/upload-img";
        answer.config.uploadVideoServer = "/api/upload-video";
        answer.config.height = 100;
        answer.config.zIndex = 9;
        answer.config.placeholder = "请输入答案";
        answer.config.onchange = function () {
          quest[current - 1].saveQ = false;
        };
        answer.config.onSelectionchange = function () {
          quest[current - 1].saveQ = false;
        };
        answer.create();
        if (this.questions[this.currentQues - 1].saveT == true) {
          answer.txt.html(
            "<p>" +
              this.questions[this.currentQues - 1].sub_question[i - 1].answer +
              "<p>"
          );
        }
        this.editor.push(answer);
        const analysis = new E("#analysis" + this.currentQues + "_" + i);
        analysis.config.uploadImgServer = "/upload-img";
        analysis.config.uploadVideoServer = "/api/upload-video";
        analysis.config.height = 100;
        analysis.config.zIndex = 10;
        analysis.config.placeholder = "请输入解析";
        analysis.config.onchange = function () {
          quest[current - 1].saveQ = false;
        };
        analysis.config.onSelectionchange = function () {
          quest[current - 1].saveQ = false;
        };
        analysis.create();
        if (this.questions[this.currentQues - 1].saveT == true) {
          analysis.txt.html(
            "<p>" +
              this.questions[this.currentQues - 1].sub_question[i - 1]
                .analysis +
              "<p>"
          );
        }
        this.editor.push(analysis);
      }
      this.questions = quest;
    },
    async addSub() {
      this.max_sequence += 1;
      let quest = new Array();
      quest = this.questions;
      let current = this.currentQues;
      this.questions[this.currentQues - 1].saveQ = false;
      let act;
      if (this.currentQues == 1) {
        if (this.questions[this.currentQues - 1].sub_question.length == 0) {
          act = 1;
        } else {
          act =
            this.questions[this.currentQues - 1].sub_question[
              this.questions[this.currentQues - 1].sub_question.length - 1
            ].actual_sequence + 1;
        }
      } else {
        if (this.questions[this.currentQues - 1].sub_question.length == 0) {
          act =
            this.questions[this.currentQues - 2].sub_question[
              this.questions[this.currentQues - 2].sub_question.length - 1
            ].actual_sequence + 1;
        } else {
          act =
            this.questions[this.currentQues - 1].sub_question[
              this.questions[this.currentQues - 1].sub_question.length - 1
            ].actual_sequence + 1;
        }
      }

      var sub = {
        actual_sequence: act,
        sub_sequence: this.currentSubQues + 1,
        score: "",
        question: "",
        judge: "",
        radio: "",
        options: [],
        answer: "",
        analysis: "",
        level_value: "",
        knowledge_value: "",
        department_value: "",
        test_value: "",
        source_value: "",
        qclass_value: "",
        fivehe_value: "",
        A: "",
        B: "",
        C: "",
        D: "",
        author: "",
        author_org: "",
        time_created: "",
      };
      await this.questions[this.currentQues - 1].sub_question.push(sub);
      this.currentSubQues += 1;
      const question = new E(
        "#question" + this.currentQues + "_" + this.currentSubQues
      );
      question.config.uploadImgServer = "/upload-img";
      question.config.uploadVideoServer = "/api/upload-video";
      question.config.height = 50;
      question.config.zIndex = 5;
      question.config.placeholder = "请输入问题";
      question.config.onchange = function () {
        quest[current - 1].saveQ = false;
      };
      question.config.onSelectionchange = function () {
        quest[current - 1].saveQ = false;
      };
      question.create();
      this.editor.push(question);
      for (let i = 1; i <= this.option.length; i++) {
        var alphabet = String.fromCharCode(64 + parseInt(i));
        var option = new E(
          "#" + alphabet + this.currentQues + "_" + this.currentSubQues
        );
        option.config.uploadImgServer = "/upload-img";
        option.config.uploadVideoServer = "/api/upload-video";
        option.config.height = 50;
        option.config.zIndex = 9 - i;
        option.config.placeholder = "请输入选项";
        option.config.onchange = function () {
          quest[current - 1].saveQ = false;
        };
        option.config.onSelectionchange = function () {
          quest[current - 1].saveQ = false;
        };
        option.create();
        this.editor.push(option);
      }
      const answer = new E(
        "#answer" + this.currentQues + "_" + this.currentSubQues
      );
      answer.config.uploadImgServer = "/upload-img";
      answer.config.uploadVideoServer = "/api/upload-video";
      answer.config.height = 100;
      answer.config.zIndex = 9;
      answer.config.placeholder = "请输入答案";
      answer.config.onchange = function () {
        quest[current - 1].saveQ = false;
      };
      answer.config.onSelectionchange = function () {
        quest[current - 1].saveQ = false;
      };
      answer.create();
      this.editor.push(answer);
      const analysis = new E(
        "#analysis" + this.currentQues + "_" + this.currentSubQues
      );
      analysis.config.uploadImgServer = "/upload-img";
      analysis.config.uploadVideoServer = "/api/upload-video";
      analysis.config.height = 100;
      analysis.config.zIndex = 10;
      analysis.config.placeholder = "请输入解析";
      analysis.config.onchange = function () {
        quest[current - 1].saveQ = false;
      };
      analysis.config.onSelectionchange = function () {
        quest[current - 1].saveQ = false;
      };
      analysis.create();
      this.editor.push(analysis);
      this.questions = quest;
    },
    async saveAndadd() {
      this.max_sequence += 1;
      for (let i = 0; i < this.editor.length; i++) {
        this.editor[i].destroy();
      }
      this.editor = [];
      this.currentQues = this.questions.length + 1;
      this.currentSubQues = 1;
      this.SCurrentQues = this.currentQues.toString();
      var question = {
        name: this.SCurrentQues,
        sequence: this.currentQues,
        primary_ques_type: "",
        secondary_ques_type: "",
        question_content: "",
        total_score: 0,
        sub_question: [],
        saveQ: false,
        saveT: false,
      };
      var sub = {
        actual_sequence: this.max_sequence,
        sub_sequence: this.currentSubQues,
        score: "",
        question: "",
        options: [],
        answer: "",
        analysis: "",
        level_value: "",
        knowledge_value: "",
        department_value: "",
        test_value: "",
        source_value: "",
        qclass_value: "",
        fivehe_value: "",
        A: "",
        B: "",
        C: "",
        D: "",
        author: "",
        author_org: "",
        time_created: "",
      };
      question.sub_question.push(sub);
      await this.questions.push(question);
      // if(this.currentQues!=this.questions.length){
      //   let temp = new Array()
      //   temp = question
      //   for(let i=this.questions.length-1;i>=this.currentQues;i--){
      //     this.questions[i-1].sequence++
      //     this.questions[i-1].name=this.questions[i-1].sequence.toString()
      //     this.questions[i]=this.questions[i-1]
      //   }
      //   this.questions[this.currentQues-1]=temp
      // }
      this.createEdit();
    },
    async checkQues() {
      this.lastClick = 0;
      var valid = true;
      for (let j = 1; j <= this.currentSubQues; j++) {
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1]
            .level_value == ""
        ) {
          this.questions[this.currentQues - 1].sub_question[j - 1].level_value =
            null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1]
            .grade_value == ""
        ) {
          this.questions[this.currentQues - 1].sub_question[j - 1].grade_value =
            null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1]
            .department_value == ""
        ) {
          this.questions[this.currentQues - 1].sub_question[
            j - 1
          ].department_value = null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1].task_value ==
          ""
        ) {
          this.questions[this.currentQues - 1].sub_question[j - 1].task_value =
            null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1]
            .topic_value == ""
        ) {
          this.questions[this.currentQues - 1].sub_question[j - 1].topic_value =
            null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1]
            .qclass_value == ""
        ) {
          this.questions[this.currentQues - 1].sub_question[
            j - 1
          ].qclass_value = null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1]
            .fivehe_value == ""
        ) {
          this.questions[this.currentQues - 1].sub_question[
            j - 1
          ].fivehe_value = null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1].author == ""
        ) {
          this.questions[this.currentQues - 1].sub_question[j - 1].author =
            null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1].author_org ==
          ""
        ) {
          this.questions[this.currentQues - 1].sub_question[j - 1].author_org =
            null;
        }
        if (
          this.questions[this.currentQues - 1].sub_question[j - 1]
            .time_created == ""
        ) {
          this.questions[this.currentQues - 1].sub_question[
            j - 1
          ].time_created = null;
        }
        let a = new Array();
        for (let i = 0; i < this.editor.length; i++) {
          if (valid == false) {
            break;
          }
          if (
            this.editor[i].toolbarSelector ==
            "#material" + this.currentQues
          ) {
            if (this.editor[i].txt.text() == "") {
              this.questions[this.currentQues - 1].question_content = null;
              this.$message({
                message: "请填写题干",
                type: "warning",
              });
              valid = false;
              break;
            } else {
              this.questions[this.currentQues - 1].question_content =
                this.editor[i].txt.text();
            }
          }
          if (
            this.questions[this.currentQues - 1].sub_question[j - 1].score == ""
          ) {
            this.$message({
              message:
                "请填写第" +
                this.questions[this.currentQues - 1].sub_question[j - 1]
                  .actual_sequence +
                "题分数",
              type: "warning",
            });
            valid = false;
            break;
          }
          if (
            this.editor[i].toolbarSelector ==
            "#question" + this.currentQues + "_" + j
          ) {
            if (
              this.editor[i].txt.text() == "" ||
              this.editor[i].txt.text() == "null" ||
              this.editor[i].txt.text() == "undefined" ||
              this.editor[i].txt.text() == undefined
            ) {
              this.questions[this.currentQues - 1].sub_question[
                j - 1
              ].question = null;
            } else {
              this.questions[this.currentQues - 1].sub_question[
                j - 1
              ].question = this.editor[i].txt.text();
            }
          } else if (
            this.editor[i].toolbarSelector ==
            "#analysis" + this.currentQues + "_" + j
          ) {
            if (
              this.editor[i].txt.text() == "" ||
              this.editor[i].txt.text() == "null" ||
              this.editor[i].txt.text() == "undefined" ||
              this.editor[i].txt.text() == undefined
            ) {
              this.questions[this.currentQues - 1].sub_question[
                j - 1
              ].analysis = null;
            } else {
              this.questions[this.currentQues - 1].sub_question[
                j - 1
              ].analysis = this.editor[i].txt.text();
            }
          }
          if (this.questions[this.currentQues - 1].primary_ques_type != "") {
            if (
              (this.questions[this.currentQues - 1].primary_ques_type ==
                "听力" ||
                this.questions[this.currentQues - 1].primary_ques_type ==
                  "阅读" ||
                this.questions[this.currentQues - 1].primary_ques_type ==
                  "写作") &&
              this.questions[this.currentQues - 1].secondary_ques_type == ""
            ) {
              this.$message({
                message: "请选择二级题型",
                type: "warning",
              });
              valid = false;
              break;
            }
            if (
              this.questions[this.currentQues - 1].primary_ques_type ==
                "写作" ||
              this.questions[this.currentQues - 1].primary_ques_type == "简答题"
            ) {
              if (
                this.editor[i].toolbarSelector ==
                "#answer" + this.currentQues + "_" + j
              ) {
                if (this.editor[i].txt.text() == "") {
                  this.questions[this.currentQues - 1].sub_question[
                    j - 1
                  ].answer = null;
                  this.$message({
                    message: "请填写答案",
                    type: "warning",
                  });
                  valid = false;
                  break;
                } else {
                  this.questions[this.currentQues - 1].sub_question[
                    j - 1
                  ].answer = this.editor[i].txt.text();
                }
              }
            } else {
              if (
                this.questions[this.currentQues - 1].secondary_ques_type !=
                  "听句子，判断对错" &&
                this.questions[this.currentQues - 1].primary_ques_type !=
                  "判断题"
              ) {
                for (let k = 0; k < this.option.length; k++) {
                  if (
                    "#" + this.option[k] + this.currentQues + "_" + j ==
                    this.editor[i].toolbarSelector
                  ) {
                    if (this.editor[i].txt.text() == "") {
                      this.$message({
                        message: "请填写选项答案",
                        type: "warning",
                      });
                      valid = false;
                      break;
                    } else {
                      if (this.option[k] == "A") {
                        this.questions[this.currentQues - 1].sub_question[
                          j - 1
                        ].A = this.editor[i].txt.text();
                      } else if (this.option[k] == "B") {
                        this.questions[this.currentQues - 1].sub_question[
                          j - 1
                        ].B = this.editor[i].txt.text();
                      } else if (this.option[k] == "C") {
                        this.questions[this.currentQues - 1].sub_question[
                          j - 1
                        ].C = this.editor[i].txt.text();
                      } else if (this.option[k] == "D") {
                        this.questions[this.currentQues - 1].sub_question[
                          j - 1
                        ].D = this.editor[i].txt.text();
                      }
                      this.questions[this.currentQues - 1].sub_question[
                        j - 1
                      ].options = null;
                      let b = {
                        content: this.editor[i].txt.text(),
                        index: this.option[k],
                      };
                      a.push(b);
                    }
                  }
                }
                this.questions[this.currentQues - 1].sub_question[
                  j - 1
                ].options = a;
                if (
                  this.questions[this.currentQues - 1].sub_question[j - 1]
                    .answer == "" ||
                  this.option.indexOf(
                    this.questions[this.currentQues - 1].sub_question[j - 1]
                      .answer
                  ) == -1
                ) {
                  this.$message({
                    message:
                      "请填写第" +
                      this.questions[this.currentQues - 1].sub_question[j - 1]
                        .actual_sequence +
                      "题答案",
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
                this.questions[this.currentQues - 1].sub_question[
                  j - 1
                ].options = null;
                this.questions[this.currentQues - 1].sub_question[
                  j - 1
                ].options = p;
                if (
                  this.questions[this.currentQues - 1].sub_question[j - 1]
                    .answer == "" ||
                  (this.questions[this.currentQues - 1].sub_question[j - 1]
                    .answer != "√" &&
                    this.questions[this.currentQues - 1].sub_question[j - 1]
                      .answer != "×")
                ) {
                  this.$message({
                    message:
                      "请填写第" +
                      this.questions[this.currentQues - 1].sub_question[j - 1]
                        .actual_sequence +
                      "题答案",
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
      }
      if (valid == true) {
        var b = 0;
        for (let i = 0; i < this.questions.length; i++) {
          let sum = 0;
          for (let j = 0; j < this.questions[i].sub_question.length; j++) {
            b += this.questions[i].sub_question[j].score * 1;
            sum += this.questions[i].sub_question[j].score * 1;
          }
          this.questions[i].total_score = sum;
        }
        this.ques_score = b;
        var c = 0;
        for (let i = 0; i < this.questions.length; i++) {
          c += this.questions[i].sub_question.length;
        }
        this.ques_num = c;
        if (this.questions[this.currentQues - 1].saveT == false) {
          if (this.ques_type.length > 0) {
            var findP = false;
            var findS = false;
            for (let i = 0; i < this.ques_type.length; i++) {
              if (
                this.questions[this.currentQues - 1].primary_ques_type ==
                this.ques_type[i].primary
              ) {
                findP = true;
                for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                  if (
                    this.questions[this.currentQues - 1].secondary_ques_type ==
                    this.ques_type[i].secondary[j].type
                  ) {
                    findS = true;
                    let temp = new Array();
                    this.questions[this.currentQues - 1].sequence =
                      this.ques_type[i].secondary[j].end + 2;
                    this.questions[this.currentQues - 1].name =
                      this.questions[this.currentQues - 1].sequence.toString();
                    temp = this.questions[this.currentQues - 1];
                    for (
                      let k = this.questions.length - 2;
                      k > this.ques_type[i].secondary[j].end;
                      k--
                    ) {
                      this.questions[k].sequence++;
                      this.questions[k].name =
                        this.questions[k].sequence.toString();
                      this.questions[k + 1] = this.questions[k];
                    }
                    this.questions[this.ques_type[i].secondary[j].end + 1] =
                      temp;
                    this.currentQues = temp.sequence;
                    this.SCurrentQues = this.currentQues.toString();
                    this.ques_type[i].secondary[j].end++;
                    for (
                      let a = j + 1;
                      a < this.ques_type[i].secondary.length;
                      a++
                    ) {
                      this.ques_type[i].secondary[a].start++;
                      this.ques_type[i].secondary[a].end++;
                    }
                    for (let n = i + 1; n < this.ques_type.length; n++) {
                      for (
                        let m = 0;
                        m < this.ques_type[n].secondary.length;
                        m++
                      ) {
                        this.ques_type[n].secondary[m].start++;
                        this.ques_type[n].secondary[m].end++;
                      }
                    }
                    break;
                  }
                }
                if (findS == false) {
                  var s = {
                    type: this.questions[this.currentQues - 1]
                      .secondary_ques_type,
                    start:
                      this.ques_type[i].secondary[
                        this.ques_type[i].secondary.length - 1
                      ].end + 1,
                    end:
                      this.ques_type[i].secondary[
                        this.ques_type[i].secondary.length - 1
                      ].end + 1,
                  };
                  this.ques_type[i].secondary.push(s);
                  if (i != this.ques_type.length - 1) {
                    for (let n = i + 1; n < this.ques_type.length; n++) {
                      for (
                        let m = 0;
                        m < this.ques_type[n].secondary.length;
                        m++
                      ) {
                        this.ques_type[n].secondary[m].start++;
                        this.ques_type[n].secondary[m].end++;
                      }
                    }
                    let temp = new Array();
                    this.questions[this.currentQues - 1].sequence =
                      this.ques_type[i].secondary[
                        this.ques_type[i].secondary.length - 1
                      ].end + 1;
                    this.questions[this.currentQues - 1].name =
                      this.questions[this.currentQues - 1].sequence.toString();
                    temp = this.questions[this.currentQues - 1];
                    for (
                      let k = this.questions.length - 2;
                      k >=
                      this.ques_type[i].secondary[
                        this.ques_type[i].secondary.length - 1
                      ].end;
                      k--
                    ) {
                      this.questions[k].sequence++;
                      this.questions[k].name =
                        this.questions[k].sequence.toString();
                      this.questions[k + 1] = this.questions[k];
                    }
                    this.questions[
                      this.ques_type[i].secondary[
                        this.ques_type[i].secondary.length - 1
                      ].end
                    ] = temp;
                    this.currentQues = temp.sequence;
                    this.SCurrentQues = this.currentQues.toString();
                  }
                }
                break;
              }
            }
            if (findP == false) {
              var p = {
                primary: this.questions[this.currentQues - 1].primary_ques_type,
                secondary: [
                  {
                    type: this.questions[this.currentQues - 1]
                      .secondary_ques_type,
                    start:
                      this.ques_type[this.ques_type.length - 1].secondary[
                        this.ques_type[this.ques_type.length - 1].secondary
                          .length - 1
                      ].end + 1,
                    end:
                      this.ques_type[this.ques_type.length - 1].secondary[
                        this.ques_type[this.ques_type.length - 1].secondary
                          .length - 1
                      ].end + 1,
                  },
                ],
              };
              this.ques_type.push(p);
            }
          } else {
            var initial = {
              primary: this.questions[this.currentQues - 1].primary_ques_type,
              secondary: [
                {
                  type: this.questions[this.currentQues - 1]
                    .secondary_ques_type,
                  start: 0,
                  end: 0,
                },
              ],
            };
            this.ques_type.push(initial);
          }
        } else {
          for (let i = 0; i < this.ques_type.length; i++) {
            for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
              if (
                this.ques_type[i].secondary[j].start <= this.currentQues - 1 &&
                this.ques_type[i].secondary[j].end >= this.currentQues - 1
              ) {
                //找到了原题型位置
                if (
                  this.ques_type[i].primary ==
                  this.questions[this.currentQues - 1].primary_ques_type
                ) {
                  //原一级题型不变
                  if (
                    this.ques_type[i].secondary[j].type !=
                    this.questions[this.currentQues - 1].secondary_ques_type
                  ) {
                    //二级题型变了
                    var findSS = false;
                    for (
                      let k = 0;
                      k < this.ques_type[i].secondary.length;
                      k++
                    ) {
                      if (
                        this.ques_type[i].secondary[k].type ==
                        this.questions[this.currentQues - 1].secondary_ques_type
                      ) {
                        //在原一级题型中找到了该二级题型
                        findSS = true;
                        let temp = new Array();
                        if (j > k) {
                          this.questions[this.currentQues - 1].sequence =
                            this.ques_type[i].secondary[k].end + 2;
                          this.questions[this.currentQues - 1].name =
                            this.questions[
                              this.currentQues - 1
                            ].sequence.toString();
                          temp = this.questions[this.currentQues - 1];
                          for (
                            let y = this.currentQues - 2;
                            y > this.ques_type[i].secondary[k].end;
                            y--
                          ) {
                            this.questions[y].sequence++;
                            this.questions[y].name =
                              this.questions[y].sequence.toString();
                            this.questions[y + 1] = this.questions[y];
                          }
                          this.questions[
                            this.ques_type[i].secondary[k].end + 1
                          ] = temp;
                          if (j != k + 1) {
                            for (let x = j - 1; x > k; x--) {
                              this.ques_type[i].secondary[x].start++;
                              this.ques_type[i].secondary[x].end++;
                            }
                          }
                          this.ques_type[i].secondary[k].end++;
                          if (
                            this.ques_type[i].secondary[j].start !=
                            this.ques_type[i].secondary[j].end
                          ) {
                            this.ques_type[i].secondary[j].start++;
                          } else {
                            this.ques_type[i].secondary.splice(j, 1);
                          }
                        } else {
                          this.questions[this.currentQues - 1].sequence =
                            this.ques_type[i].secondary[k].end + 1;
                          this.questions[this.currentQues - 1].name =
                            this.questions[
                              this.currentQues - 1
                            ].sequence.toString();
                          temp = this.questions[this.currentQues - 1];
                          for (
                            let y = this.currentQues;
                            y <= this.ques_type[i].secondary[k].end;
                            y++
                          ) {
                            this.questions[y].sequence--;
                            this.questions[y].name =
                              this.questions[y].sequence.toString();
                            this.questions[y - 1] = this.questions[y];
                          }
                          this.questions[this.ques_type[i].secondary[k].end] =
                            temp;
                          if (j != k - 1) {
                            for (let x = j + 1; x < k; x++) {
                              this.ques_type[i].secondary[x].start--;
                              this.ques_type[i].secondary[x].end--;
                            }
                          }
                          this.ques_type[i].secondary[k].start--;
                          if (
                            this.ques_type[i].secondary[j].start !=
                            this.ques_type[i].secondary[j].end
                          ) {
                            this.ques_type[i].secondary[j].end--;
                          } else {
                            this.ques_type[i].secondary.splice(j, 1);
                          }
                        }
                        this.currentQues = temp.sequence;
                        this.SCurrentQues = this.currentQues.toString();
                        break;
                      }
                    }
                    //原一级题型中没有该二级题型
                    if (findSS == false) {
                      var ss = {
                        type: this.questions[this.currentQues - 1]
                          .secondary_ques_type,
                        start:
                          this.ques_type[i].secondary[
                            this.ques_type[i].secondary.length - 1
                          ].end,
                        end: this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end,
                      };
                      await this.ques_type[i].secondary.push(ss);
                      let temp = new Array();
                      this.questions[this.currentQues - 1].sequence =
                        this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end + 1;
                      this.questions[this.currentQues - 1].name =
                        this.questions[
                          this.currentQues - 1
                        ].sequence.toString();
                      temp = this.questions[this.currentQues - 1];
                      if (j != this.ques_type[i].secondary.length - 2) {
                        for (
                          let d = j + 1;
                          d < this.ques_type[i].secondary.length - 1;
                          d++
                        ) {
                          this.ques_type[i].secondary[d].start--;
                          this.ques_type[i].secondary[d].end--;
                        }
                      }
                      for (
                        let k = this.currentQues;
                        k <=
                        this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end;
                        k++
                      ) {
                        this.questions[k].sequence--;
                        this.questions[k].name =
                          this.questions[k].sequence.toString();
                        this.questions[k - 1] = this.questions[k];
                      }
                      this.questions[
                        this.ques_type[i].secondary[
                          this.ques_type[i].secondary.length - 1
                        ].end
                      ] = temp;
                      if (
                        this.ques_type[i].secondary[j].end !=
                        this.ques_type[i].secondary[j].start
                      ) {
                        this.ques_type[i].secondary[j].end--;
                      } else {
                        this.ques_type[i].secondary.splice(j, 1);
                      }
                      this.currentQues = temp.sequence;
                      this.SCurrentQues = this.currentQues.toString();
                    }
                  }
                } else {
                  //一级题型变了
                  var findPP = false;
                  var findSSS = false;
                  for (let k = 0; k < this.ques_type.length; k++) {
                    if (
                      this.ques_type[k].primary ==
                      this.questions[this.currentQues - 1].primary_ques_type
                    ) {
                      //找到了一级题型
                      findPP = true;
                      for (
                        let a = 0;
                        a < this.ques_type[k].secondary.length;
                        a++
                      ) {
                        if (
                          this.ques_type[k].secondary[a].type ==
                          this.questions[this.currentQues - 1]
                            .secondary_ques_type
                        ) {
                          //找到了二级题型
                          findSSS = true;
                          let temp = new Array();
                          if (i < k) {
                            this.questions[this.currentQues - 1].sequence =
                              this.ques_type[k].secondary[a].end + 1;
                            this.questions[this.currentQues - 1].name =
                              this.questions[
                                this.currentQues - 1
                              ].sequence.toString();
                            temp = this.questions[this.currentQues - 1];
                            for (
                              let b = this.currentQues;
                              b <= this.ques_type[k].secondary[a].end;
                              b++
                            ) {
                              this.questions[b].sequence--;
                              this.questions[b].name =
                                this.questions[b].sequence.toString();
                              this.questions[b - 1] = this.questions[b];
                            }
                            this.questions[this.ques_type[k].secondary[a].end] =
                              temp;
                            if (
                              this.ques_type[i].secondary[j].start !=
                              this.ques_type[i].secondary[j].end
                            ) {
                              this.ques_type[i].secondary[j].end--;
                            }
                            if (j != this.ques_type[i].secondary.length - 1) {
                              for (
                                let x = j + 1;
                                x < this.ques_type[i].secondary.length;
                                x++
                              ) {
                                this.ques_type[i].secondary[x].start--;
                                this.ques_type[i].secondary[x].end--;
                              }
                            }
                            if (i != k - 1) {
                              for (let y = i + 1; y < k; y++) {
                                for (
                                  let z = 0;
                                  z < this.ques_type[y].secondary.length;
                                  z++
                                ) {
                                  this.ques_type[y].secondary[z].start--;
                                  this.ques_type[y].secondary[z].end--;
                                }
                              }
                            }
                            if (a == 0) {
                              this.ques_type[k].secondary[a].start--;
                            } else {
                              for (let c = 0; c < a; c++) {
                                this.ques_type[k].secondary[c].start--;
                                this.ques_type[k].secondary[c].end--;
                              }
                              this.ques_type[k].secondary[a].start--;
                            }
                            this.ques_type[i].secondary.splice(j, 1);
                            if (this.ques_type[i].secondary.length == 0) {
                              this.ques_type.splice(i, 1);
                            }
                          } else {
                            //i>k
                            this.questions[this.currentQues - 1].sequence =
                              this.ques_type[k].secondary[a].end + 2;
                            this.questions[this.currentQues - 1].name =
                              this.questions[
                                this.currentQues - 1
                              ].sequence.toString();
                            temp = this.questions[this.currentQues - 1];
                            for (
                              let b = this.currentQues - 2;
                              b > this.ques_type[k].secondary[a].end;
                              b--
                            ) {
                              this.questions[b].sequence++;
                              this.questions[b].name =
                                this.questions[b].sequence.toString();
                              this.questions[b + 1] = this.questions[b];
                            }
                            this.questions[
                              this.ques_type[k].secondary[a].end + 1
                            ] = temp;
                            if (
                              this.ques_type[i].secondary[j].start !=
                              this.ques_type[i].secondary[j].end
                            ) {
                              this.ques_type[i].secondary[j].start++;
                            }
                            if (j != 0) {
                              for (let x = j - 1; x > -1; x--) {
                                this.ques_type[i].secondary[x].start++;
                                this.ques_type[i].secondary[x].end++;
                              }
                            }
                            if (i != k + 1) {
                              for (let y = i - 1; y > k; y--) {
                                for (
                                  let z = 0;
                                  z < this.ques_type[y].secondary.length;
                                  z++
                                ) {
                                  this.ques_type[y].secondary[z].start++;
                                  this.ques_type[y].secondary[z].end++;
                                }
                              }
                            }
                            if (a == this.ques_type[k].secondary.length - 1) {
                              this.ques_type[k].secondary[a].end++;
                            } else {
                              for (
                                let c = this.ques_type[k].secondary.length - 1;
                                c > a;
                                c--
                              ) {
                                this.ques_type[k].secondary[c].start++;
                                this.ques_type[k].secondary[c].end++;
                              }
                              this.ques_type[k].secondary[a].end++;
                            }
                            this.ques_type[i].secondary.splice(j, 1);
                            if (this.ques_type[i].secondary.length == 0) {
                              this.ques_type.splice(i, 1);
                            }
                          }
                          this.currentQues = temp.sequence;
                          this.SCurrentQues = this.currentQues.toString();
                          break;
                        }
                      }
                      if (findSSS == false) {
                        //没找到二级题型
                        let temp = new Array();
                        if (i < k) {
                          this.ques_type[i].secondary[j].end--;
                          if (j != this.ques_type[i].secondary.length - 1) {
                            for (
                              let e = j + 1;
                              e < this.ques_type[i].secondary.length;
                              e++
                            ) {
                              this.ques_type[i].secondary[e].start--;
                              this.ques_type[i].secondary[e].end--;
                            }
                          }
                          for (let f = i + 1; f <= k; f++) {
                            for (
                              let g = 0;
                              g < this.ques_type[f].secondary.length;
                              g++
                            ) {
                              this.ques_type[f].secondary[g].start--;
                              this.ques_type[f].secondary[g].end--;
                            }
                          }
                          let sss = {
                            type: this.questions[this.currentQues - 1]
                              .secondary_ques_type,
                            start:
                              this.ques_type[k].secondary[
                                this.ques_type[k].secondary.length - 1
                              ].end + 1,
                            end:
                              this.ques_type[k].secondary[
                                this.ques_type[k].secondary.length - 1
                              ].end + 1,
                          };
                          await this.ques_type[k].secondary.push(sss);
                          this.questions[this.currentQues - 1].sequence =
                            this.ques_type[k].secondary[
                              this.ques_type[k].secondary.length - 1
                            ].end + 1;
                          this.questions[this.currentQues - 1].name =
                            this.questions[
                              this.currentQues - 1
                            ].sequence.toString();
                          temp = this.questions[this.currentQues - 1];
                          for (
                            let h = this.currentQues;
                            h <=
                            this.ques_type[k].secondary[
                              this.ques_type[k].secondary.length - 1
                            ].end;
                            h++
                          ) {
                            this.questions[h].sequence--;
                            this.questions[h].name =
                              this.questions[h].sequence.toString();
                            this.questions[h - 1] = this.questions[h];
                          }
                          this.questions[
                            this.ques_type[k].secondary[
                              this.ques_type[k].secondary.length - 1
                            ].end
                          ] = temp;
                          this.currentQues = temp.sequence;
                          this.SCurrentQues = this.currentQues.toString();
                        } else {
                          this.ques_type[i].secondary[j].start++;
                          if (j != 0) {
                            for (let e = j - 1; e > -1; e--) {
                              this.ques_type[i].secondary[e].start++;
                              this.ques_type[i].secondary[e].end++;
                            }
                          }
                          if (i != k + 1) {
                            for (let f = i - 1; f > k; f--) {
                              for (
                                let g = 0;
                                g < this.ques_type[f].secondary.length;
                                g++
                              ) {
                                this.ques_type[f].secondary[g].start++;
                                this.ques_type[f].secondary[g].end++;
                              }
                            }
                          }
                          let sss = {
                            type: this.questions[this.currentQues - 1]
                              .secondary_ques_type,
                            start:
                              this.ques_type[k].secondary[
                                this.ques_type[k].secondary.length - 1
                              ].end + 1,
                            end:
                              this.ques_type[k].secondary[
                                this.ques_type[k].secondary.length - 1
                              ].end + 1,
                          };
                          await this.ques_type[k].secondary.push(sss);
                          this.questions[this.currentQues - 1].sequence =
                            this.ques_type[k].secondary[
                              this.ques_type[k].secondary.length - 1
                            ].end + 1;
                          this.questions[this.currentQues - 1].name =
                            this.questions[
                              this.currentQues - 1
                            ].sequence.toString();
                          temp = this.questions[this.currentQues - 1];
                          for (
                            let h = this.currentQues - 2;
                            h >=
                            this.ques_type[k].secondary[
                              this.ques_type[k].secondary.length - 1
                            ].end;
                            h--
                          ) {
                            this.questions[h].sequence++;
                            this.questions[h].name =
                              this.questions[h].sequence.toString();
                            this.questions[h + 1] = this.questions[h];
                          }
                          this.questions[
                            this.ques_type[k].secondary[
                              this.ques_type[k].secondary.length - 1
                            ].end
                          ] = temp;
                          if (
                            this.ques_type[i].secondary[j].end <
                            this.ques_type[i].secondary[j].start
                          ) {
                            this.ques_type[i].secondary.splice(j, 1);
                          }
                          if (this.ques_type[i].secondary.length == 0) {
                            this.ques_type.splice(i, 1);
                          }
                          this.currentQues = temp.sequence;
                          this.SCurrentQues = this.currentQues.toString();
                        }
                      }
                      break;
                    }
                  }
                  if (findPP == false) {
                    //没找到一级题型
                    this.ques_type[i].secondary[j].end--;
                    if (j != this.ques_type[i].secondary.length - 1) {
                      for (
                        let l = j + 1;
                        l < this.ques_type[i].secondary.length;
                        l++
                      ) {
                        this.ques_type[i].secondary[l].start--;
                        this.ques_type[i].secondary[l].end--;
                      }
                    }
                    if (i != this.ques_type.length - 1) {
                      for (let l = i + 1; l < this.ques_type.length; l++) {
                        for (
                          let m = 0;
                          m < this.ques_type[l].secondary.length;
                          m++
                        ) {
                          this.ques_type[l].secondary[m].start--;
                          this.ques_type[l].secondary[m].end--;
                        }
                      }
                    }
                    var addP = {
                      primary:
                        this.questions[this.currentQues - 1].primary_ques_type,
                      secondary: [
                        {
                          type: this.questions[this.currentQues - 1]
                            .secondary_ques_type,
                          start:
                            this.ques_type[this.ques_type.length - 1].secondary[
                              this.ques_type[this.ques_type.length - 1]
                                .secondary.length - 1
                            ].end + 1,
                          end:
                            this.ques_type[this.ques_type.length - 1].secondary[
                              this.ques_type[this.ques_type.length - 1]
                                .secondary.length - 1
                            ].end + 1,
                        },
                      ],
                    };
                    this.ques_type.push(addP);
                    let temp = new Array();
                    this.questions[this.currentQues - 1].sequence =
                      this.ques_type[this.ques_type.length - 1].secondary[
                        this.ques_type[this.ques_type.length - 1].secondary
                          .length - 1
                      ].end + 1;
                    this.questions[this.currentQues - 1].SCurrentQues =
                      this.questions[this.currentQues - 1].sequence.toString();
                    temp = this.questions[this.currentQues - 1];
                    for (
                      let n = this.currentQues;
                      n < this.questions.length;
                      n++
                    ) {
                      this.questions[n].sequence--;
                      this.questions[n].name =
                        this.questions[n].sequence.toString();
                      this.questions[n - 1] = this.questions[n];
                    }
                    this.questions[this.questions.length - 1] = temp;
                    if (
                      this.ques_type[i].secondary[j].end <
                      this.ques_type[i].secondary[j].start
                    ) {
                      this.ques_type[i].secondary.splice(j, 1);
                    }
                    if (this.ques_type[i].secondary.length == 0) {
                      this.ques_type.splice(i, 1);
                    }
                    this.currentQues = temp.sequence;
                    this.SCurrentQues = this.currentQues.toString();
                  }
                }
                break;
              }
            }
          }
        }
        for (let i = 0; i < this.ques_type.length; i++) {
          this.ques_type[i].hoverP = false;
          let score_temp = 0;
          let num_temp = 0;
          for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
            this.ques_type[i].secondary[j].hoverS = false;
            let stemp = 0;
            let ntemp = 0;
            for (
              let k = this.ques_type[i].secondary[j].start;
              k <= this.ques_type[i].secondary[j].end;
              k++
            ) {
              stemp += this.questions[k].total_score;
              ntemp += this.questions[k].sub_question.length;
            }
            this.ques_type[i].secondary[j].score = stemp;
            this.ques_type[i].secondary[j].num = ntemp;
            score_temp += this.ques_type[i].secondary[j].score;
            num_temp += this.ques_type[i].secondary[j].num;
          }
          this.ques_type[i].total_score = score_temp;
          this.ques_type[i].total_num = num_temp;
        }
        let seq = 1;
        for (let g = 0; g < this.questions.length; g++) {
          for (let h = 0; h < this.questions[g].sub_question.length; h++) {
            this.questions[g].sub_question[h].actual_sequence = seq;
            seq++;
          }
        }
        this.questions[this.currentQues - 1].saveQ = true;
        this.questions[this.currentQues - 1].saveT = true;
        this.$message({
          message: "保存成功",
          type: "success",
        });
      }
      return valid;
    },
    typePChange() {
      this.questions[this.currentQues - 1].saveQ = false;
      this.questions[this.currentQues - 1].secondary_ques_type = "";
    },
    typeSChange() {
      this.questions[this.currentQues - 1].saveQ = false;
    },
    async clickTab(i) {
      if (this.currentQues != i + 1) {
        if (this.questions[this.currentQues - 1].saveQ == false) {
          this.$message({
            message: "请先保存题目",
            type: "warning",
          });
        } else {
          this.currentQues = i + 1;
          this.SCurrentQues = this.currentQues.toString();
          this.currentSubQues = this.questions[i].sub_question.length;
          for (let i = 0; i < this.editor.length; i++) {
            await this.editor[i].destroy();
          }
          this.createEdit();
          let a;
          for (a = 0; a < this.editor.length; a++) {
            if (
              this.editor[a].toolbarSelector ==
              "#material" + this.currentQues
            ) {
              this.editor[a].txt.html(
                "<p>" +
                  this.questions[this.currentQues - 1].question_content +
                  "</p>"
              );
            }
            for (let j = 1; j <= this.currentSubQues; j++) {
              if (
                this.editor[a].toolbarSelector ==
                "#question" + this.currentQues + "_" + j
              ) {
                if (
                  this.questions[this.currentQues - 1].sub_question[j - 1]
                    .question != null
                ) {
                  this.editor[a].txt.html(
                    "<p>" +
                      this.questions[this.currentQues - 1].sub_question[j - 1]
                        .question +
                      "</p>"
                  );
                }
              } else if (
                this.editor[a].toolbarSelector ==
                "#analysis" + this.currentQues + "_" + j
              ) {
                if (
                  this.questions[this.currentQues - 1].sub_question[j - 1]
                    .analysis != null
                ) {
                  this.editor[a].txt.html(
                    "<p>" +
                      this.questions[this.currentQues - 1].sub_question[j - 1]
                        .analysis +
                      "</p>"
                  );
                }
              } else if (
                this.editor[a].toolbarSelector ==
                "#answer" + this.currentQues + "_" + j
              ) {
                this.editor[a].txt.html(
                  "<p>" +
                    this.questions[this.currentQues - 1].sub_question[j - 1]
                      .answer +
                    "</p>"
                );
              } else {
                for (let k = 0; k < this.option.length; k++) {
                  if (
                    this.editor[a].toolbarSelector ==
                    "#" + this.option[k] + this.currentQues + "_" + j
                  ) {
                    if (this.option[k] == "A") {
                      this.editor[a].txt.html(
                        "<p>" +
                          this.questions[this.currentQues - 1].sub_question[
                            j - 1
                          ].A +
                          "</p>"
                      );
                    } else if (this.option[k] == "B") {
                      this.editor[a].txt.html(
                        "<p>" +
                          this.questions[this.currentQues - 1].sub_question[
                            j - 1
                          ].B +
                          "</p>"
                      );
                    } else if (this.option[k] == "C") {
                      this.editor[a].txt.html(
                        "<p>" +
                          this.questions[this.currentQues - 1].sub_question[
                            j - 1
                          ].C +
                          "</p>"
                      );
                    } else if (this.option[k] == "D") {
                      this.editor[a].txt.html(
                        "<p>" +
                          this.questions[this.currentQues - 1].sub_question[
                            j - 1
                          ].D +
                          "</p>"
                      );
                    }
                  }
                }
              }
            }
          }
          if (a == this.editor.length) {
            this.questions[this.currentQues - 1].saveQ = true;
          }
        }
      }
    },
    async subTop(val) {
      for (let j = 1; j <= this.currentSubQues; j++) {
        for (let i = 0; i < this.editor.length; i++) {
          if (
            this.editor[i].toolbarSelector ==
            "#question" + this.currentQues + "_" + j
          ) {
            this.questions[this.currentQues - 1].sub_question[j - 1].question =
              this.editor[i].txt.text();
          } else if (
            this.editor[i].toolbarSelector ==
            "#answer" + this.currentQues + "_" + j
          ) {
            this.questions[this.currentQues - 1].sub_question[j - 1].answer =
              this.editor[i].txt.text();
          } else if (
            this.editor[i].toolbarSelector ==
            "#analysis" + this.currentQues + "_" + j
          ) {
            this.questions[this.currentQues - 1].sub_question[j - 1].analysis =
              this.editor[i].txt.text();
          } else {
            if (
              this.editor[i].toolbarSelector ==
              "#A" + this.currentQues + "_" + j
            ) {
              this.questions[this.currentQues - 1].sub_question[j - 1].A =
                this.editor[i].txt.text();
            } else if (
              this.editor[i].toolbarSelector ==
              "#B" + this.currentQues + "_" + j
            ) {
              this.questions[this.currentQues - 1].sub_question[j - 1].B =
                this.editor[i].txt.text();
            } else if (
              this.editor[i].toolbarSelector ==
              "#C" + this.currentQues + "_" + j
            ) {
              this.questions[this.currentQues - 1].sub_question[j - 1].C =
                this.editor[i].txt.text();
            } else if (
              this.editor[i].toolbarSelector ==
              "#D" + this.currentQues + "_" + j
            ) {
              this.questions[this.currentQues - 1].sub_question[j - 1].D =
                this.editor[i].txt.text();
            }
          }
        }
      }
      this.questions[this.currentQues - 1].sub_question[val].sub_sequence--;
      this.questions[this.currentQues - 1].sub_question[val - 1].sub_sequence++;
      this.questions[this.currentQues - 1].sub_question[val].actual_sequence--;
      this.questions[this.currentQues - 1].sub_question[val - 1]
        .actual_sequence++;
      var temp = new Array();
      temp = this.questions[this.currentQues - 1].sub_question[val];
      this.questions[this.currentQues - 1].sub_question[val] =
        this.questions[this.currentQues - 1].sub_question[val - 1];
      this.questions[this.currentQues - 1].sub_question[val - 1] = temp;
    },
    subDown(val) {
      for (let j = 1; j <= this.currentSubQues; j++) {
        for (let i = 0; i < this.editor.length; i++) {
          if (
            this.editor[i].toolbarSelector ==
            "#question" + this.currentQues + "_" + j
          ) {
            this.questions[this.currentQues - 1].sub_question[j - 1].question =
              this.editor[i].txt.text();
          } else if (
            this.editor[i].toolbarSelector ==
            "#answer" + this.currentQues + "_" + j
          ) {
            this.questions[this.currentQues - 1].sub_question[j - 1].answer =
              this.editor[i].txt.text();
          } else if (
            this.editor[i].toolbarSelector ==
            "#analysis" + this.currentQues + "_" + j
          ) {
            this.questions[this.currentQues - 1].sub_question[j - 1].analysis =
              this.editor[i].txt.text();
          } else {
            if (
              this.editor[i].toolbarSelector ==
              "#A" + this.currentQues + "_" + j
            ) {
              this.questions[this.currentQues - 1].sub_question[j - 1].A =
                this.editor[i].txt.text();
            } else if (
              this.editor[i].toolbarSelector ==
              "#B" + this.currentQues + "_" + j
            ) {
              this.questions[this.currentQues - 1].sub_question[j - 1].B =
                this.editor[i].txt.text();
            } else if (
              this.editor[i].toolbarSelector ==
              "#C" + this.currentQues + "_" + j
            ) {
              this.questions[this.currentQues - 1].sub_question[j - 1].C =
                this.editor[i].txt.text();
            } else if (
              this.editor[i].toolbarSelector ==
              "#D" + this.currentQues + "_" + j
            ) {
              this.questions[this.currentQues - 1].sub_question[j - 1].D =
                this.editor[i].txt.text();
            }
          }
        }
      }
      this.questions[this.currentQues - 1].sub_question[val].sub_sequence++;
      this.questions[this.currentQues - 1].sub_question[val + 1].sub_sequence--;
      this.questions[this.currentQues - 1].sub_question[val].actual_sequence++;
      this.questions[this.currentQues - 1].sub_question[val + 1]
        .actual_sequence--;
      var temp = new Array();
      temp = this.questions[this.currentQues - 1].sub_question[val];
      this.questions[this.currentQues - 1].sub_question[val] =
        this.questions[this.currentQues - 1].sub_question[val + 1];
      this.questions[this.currentQues - 1].sub_question[val + 1] = temp;
    },
    async subDel(val) {
      if (this.questions[this.currentQues - 1].sub_question.length == 1) {
        this.questions[this.currentQues - 1].sub_question.splice(val, 1);
        this.max_sequence--;
        this.currentSubQues = 0;
        for (let i = 0; i < this.editor.length; i++) {
          if (
            this.editor[i].toolbarSelector !=
            "#material" + this.currentQues
          ) {
            await this.editor[i].destroy();
          }
        }
        this.addSub();
      } else {
        if (
          val !=
          this.questions[this.currentQues - 1].sub_question.length - 1
        ) {
          for (let i = val + 1; i < this.currentSubQues; i++) {
            this.questions[this.currentQues - 1].sub_question[i].sub_sequence--;
            this.questions[this.currentQues - 1].sub_question[i]
              .actual_sequence--;
          }
          for (let j = 1; j <= this.currentSubQues; j++) {
            for (let i = 0; i < this.editor.length; i++) {
              if (
                this.editor[i].toolbarSelector ==
                "#question" + this.currentQues + "_" + j
              ) {
                this.questions[this.currentQues - 1].sub_question[
                  j - 1
                ].question = this.editor[i].txt.text();
              } else if (
                this.editor[i].toolbarSelector ==
                "#answer" + this.currentQues + "_" + j
              ) {
                this.questions[this.currentQues - 1].sub_question[
                  j - 1
                ].answer = this.editor[i].txt.text();
              } else if (
                this.editor[i].toolbarSelector ==
                "#analysis" + this.currentQues + "_" + j
              ) {
                this.questions[this.currentQues - 1].sub_question[
                  j - 1
                ].analysis = this.editor[i].txt.text();
              } else {
                if (
                  this.editor[i].toolbarSelector ==
                  "#A" + this.currentQues + "_" + j
                ) {
                  this.questions[this.currentQues - 1].sub_question[j - 1].A =
                    this.editor[i].txt.text();
                } else if (
                  this.editor[i].toolbarSelector ==
                  "#B" + this.currentQues + "_" + j
                ) {
                  this.questions[this.currentQues - 1].sub_question[j - 1].B =
                    this.editor[i].txt.text();
                } else if (
                  this.editor[i].toolbarSelector ==
                  "#C" + this.currentQues + "_" + j
                ) {
                  this.questions[this.currentQues - 1].sub_question[j - 1].C =
                    this.editor[i].txt.text();
                } else if (
                  this.editor[i].toolbarSelector ==
                  "#D" + this.currentQues + "_" + j
                ) {
                  this.questions[this.currentQues - 1].sub_question[j - 1].D =
                    this.editor[i].txt.text();
                }
              }
            }
          }
        }
        this.max_sequence--;
        this.currentSubQues--;
        this.questions[this.currentQues - 1].sub_question.splice(val, 1);
      }
    },
    hoverInP(val) {
      document.getElementById("type_del" + val).style.display = "flex";
      document.getElementById("type_up" + val).style.display = "flex";
      document.getElementById("type_down" + val).style.display = "flex";
    },
    hoverOutP(val) {
      document.getElementById("type_del" + val).style.display = "none";
      document.getElementById("type_up" + val).style.display = "none";
      document.getElementById("type_down" + val).style.display = "none";
    },
    hoverInQ(val) {
      document.getElementById("ques_del" + val).style.display = "flex";
      document.getElementById("ques_up" + val).style.display = "flex";
      document.getElementById("ques_down" + val).style.display = "flex";
    },
    hoverOutQ(val) {
      document.getElementById("ques_del" + val).style.display = "none";
      document.getElementById("ques_up" + val).style.display = "none";
      document.getElementById("ques_down" + val).style.display = "none";
    },
    async typeDel(val) {
      if (this.ques_type.length == 1) {
        this.ques_type = [];
        this.questions = [];
        this.ques_num = 0;
        this.ques_score = 0;
        this.currentQues = 1;
        this.max_sequence = 1;
        for (let i = 0; i < this.editor.length; i++) {
          await this.editor[i].destroy();
        }
        this.init();
      } else {
        if (val == 0) {
          let temp = this.ques_type[val + 1].secondary[0].start;
          this.currentQues = 1;
          this.SCurrentQues = this.currentQues.toString();
          this.currentSubQues =
            this.questions[this.currentQues - 1].sub_question.length;
          this.ques_score -= this.ques_type[val].total_score;
          this.ques_num -= this.ques_type[val].total_num;
          this.max_sequence = this.ques_num;
          this.questions.splice(0, temp);
          this.ques_type.splice(0, 1);
          let num = 1;
          for (let i = 0; i < this.questions.length; i++) {
            this.questions[i].sequence = i + 1;
            this.questions[i].name = this.questions[i].sequence.toString();
            for (let j = 0; j < this.questions[i].sub_question.length; j++) {
              this.questions[i].sub_question[j].sub_sequence = j + 1;
              this.questions[i].sub_question[j].actual_sequence = num;
              num++;
            }
          }
          for (let i = 0; i < this.ques_type.length; i++) {
            for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
              this.ques_type[i].secondary[j].start -= temp;
              this.ques_type[i].secondary[j].end -= temp;
            }
          }
          for (let i = 0; i < this.editor.length; i++) {
            await this.editor[i].destroy();
          }
          this.createEdit();
        } else if (val == this.ques_type.length - 1) {
          let temp =
            this.ques_type[val - 1].secondary[
              this.ques_type[val - 1].secondary.length - 1
            ].end;
          this.currentQues = temp + 1;
          this.SCurrentQues = this.currentQues.toString();
          this.currentSubQues =
            this.questions[this.currentQues - 1].sub_question.length;
          this.ques_score -= this.ques_type[val].total_score;
          this.ques_num -= this.ques_type[val].total_num;
          this.max_sequence = this.ques_num;
          this.questions.splice(temp + 1, this.questions.length - 1 - temp);
          this.ques_type.splice(val, 1);
          for (let i = 0; i < this.editor.length; i++) {
            await this.editor[i].destroy();
          }
          this.createEdit();
        } else {
          let end =
            this.ques_type[val - 1].secondary[
              this.ques_type[val - 1].secondary.length - 1
            ].end;
          let start = this.ques_type[val + 1].secondary[0].start;
          this.currentQues = end + 1;
          this.SCurrentQues = this.currentQues.toString();
          this.currentSubQues =
            this.questions[this.currentQues - 1].sub_question.length;
          this.ques_score -= this.ques_type[val].total_score;
          this.ques_num -= this.ques_type[val].total_num;
          this.max_sequence = this.ques_num;
          this.questions.splice(end + 1, start - end - 1);
          this.ques_type.splice(val, 1);
          let num = 1;
          for (let i = 0; i < this.questions.length; i++) {
            this.questions[i].sequence = i + 1;
            this.questions[i].name = this.questions[i].sequence.toString();
            for (let j = 0; j < this.questions[i].sub_question.length; j++) {
              this.questions[i].sub_question[j].sub_sequence = j + 1;
              this.questions[i].sub_question[j].actual_sequence = num;
              num++;
            }
          }
          for (let i = val; i < this.ques_type.length; i++) {
            for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
              this.ques_type[i].secondary[j].start -= start - end - 1;
              this.ques_type[i].secondary[j].end -= start - end - 1;
            }
          }
          for (let i = 0; i < this.editor.length; i++) {
            await this.editor[i].destroy();
          }
          this.createEdit();
        }
      }
    },
    async stypeDel(vali, valj) {
      if (this.ques_type[vali].secondary.length == 1) {
        //只有一个二级题型
        if (this.ques_type.length == 1) {
          //只有一个一级题型
          this.ques_type = [];
          this.questions = [];
          this.ques_num = 0;
          this.ques_score = 0;
          this.currentQues = 1;
          this.max_sequence = 1;
          for (let i = 0; i < this.editor.length; i++) {
            await this.editor[i].destroy();
          }
          this.init();
        } else {
          //有多个一级题型
          if (vali == this.ques_type.length - 1) {
            //一级题型是最后一个
            let start = this.ques_type[vali].secondary[0].start;
            let qnum = this.ques_type[vali].total_num;
            this.currentQues = start;
            this.SCurrentQues = this.currentQues.toString();
            this.currentSubQues =
              this.questions[this.currentQues - 1].sub_question.length;
            this.ques_score -= this.ques_type[vali].total_score;
            this.ques_num -= this.ques_type[vali].total_num;
            this.max_sequence = this.ques_num;
            this.questions.splice(start, qnum);
            this.ques_type.splice(vali, 1);
            for (let i = 0; i < this.editor.length; i++) {
              await this.editor[i].destroy();
            }
            this.createEdit();
          } else {
            //一级题型不是最后一个
            let start = this.ques_type[vali].secondary[0].start;
            let qnum = this.ques_type[vali].total_num;
            this.currentQues = start + 1;
            this.SCurrentQues = this.currentQues.toString();
            this.currentSubQues =
              this.questions[this.currentQues - 1].sub_question.length;
            this.ques_score -= this.ques_type[vali].total_score;
            this.ques_num -= qnum;
            this.max_sequence = this.ques_num;
            this.questions.splice(start, qnum);
            this.ques_type.splice(vali, 1);
            let num = 1;
            for (let i = 0; i < this.questions.length; i++) {
              this.questions[i].sequence = i + 1;
              this.questions[i].name = this.questions[i].sequence.toString();
              for (let j = 0; j < this.questions[i].sub_question.length; j++) {
                this.questions[i].sub_question[j].sub_sequence = j + 1;
                this.questions[i].sub_question[j].actual_sequence = num;
                num++;
              }
            }
            for (let i = vali; i < this.ques_type.length; i++) {
              for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                this.ques_type[i].secondary[j].start -= qnum;
                this.ques_type[i].secondary[j].end -= qnum;
              }
            }
            for (let i = 0; i < this.editor.length; i++) {
              await this.editor[i].destroy();
            }
            this.createEdit();
          }
        }
      } else {
        //有多个二级题型
        if (this.ques_type.length == 1) {
          //只有一个一级题型
          if (valj == this.ques_type[vali].secondary.length - 1) {
            //二级题型是最后一个
            let start = this.ques_type[vali].secondary[valj].start;
            let qnum = this.ques_type[vali].secondary[valj].num;
            this.currentQues = start;
            this.SCurrentQues = this.currentQues.toString();
            this.currentSubQues =
              this.questions[this.currentQues - 1].sub_question.length;
            this.ques_score -= this.ques_type[vali].secondary[valj].score;
            this.ques_num -= qnum;
            this.ques_type[vali].total_score -=
              this.ques_type[vali].secondary[valj].score;
            this.ques_type[vali].total_num -= qnum;
            this.max_sequence = this.ques_num;
            this.questions.splice(start, qnum);
            this.ques_type[vali].secondary.splice(valj, 1);
            for (let i = 0; i < this.editor.length; i++) {
              await this.editor[i].destroy();
            }
            this.createEdit();
          } else {
            //二级题型不是最后一个
            let start = this.ques_type[vali].secondary[valj].start;
            let qnum = this.ques_type[vali].secondary[valj].num;
            this.currentQues = start + 1;
            this.SCurrentQues = this.currentQues.toString();
            this.currentSubQues =
              this.questions[this.currentQues - 1].sub_question.length;
            this.ques_score -= this.ques_type[vali].secondary[valj].score;
            this.ques_num -= qnum;
            this.ques_type[vali].total_score -=
              this.ques_type[vali].secondary[valj].score;
            this.ques_type[vali].total_num -= qnum;
            this.max_sequence = this.ques_num;
            this.questions.splice(start, qnum);
            this.ques_type[vali].secondary.splice(valj, 1);
            let num = 1;
            for (let i = 0; i < this.questions.length; i++) {
              this.questions[i].sequence = i + 1;
              this.questions[i].name = this.questions[i].sequence.toString();
              for (let j = 0; j < this.questions[i].sub_question.length; j++) {
                this.questions[i].sub_question[j].sub_sequence = j + 1;
                this.questions[i].sub_question[j].actual_sequence = num;
                num++;
              }
            }
            for (let i = valj; i < this.ques_type[vali].secondary.length; i++) {
              this.ques_type[vali].secondary[i].start -= qnum;
              this.ques_type[vali].secondary[i].end -= qnum;
            }
            for (let i = 0; i < this.editor.length; i++) {
              await this.editor[i].destroy();
            }
            this.createEdit();
          }
        } else {
          //有多个一级题型
          if (vali == this.ques_type.length - 1) {
            //一级题型是最后一个
            if (valj == this.ques_type[vali].secondary.length - 1) {
              //二级题型是最后一个
              let start = this.ques_type[vali].secondary[valj].start;
              let qnum = this.ques_type[vali].secondary.num;
              this.currentQues = start;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.ques_type[vali].secondary[valj].score;
              this.ques_num -= qnum;
              this.ques_type[vali].total_score -=
                this.ques_type[vali].secondary[valj].score;
              this.ques_type[vali].total_num -= qnum;
              this.max_sequence = this.ques_num;
              this.questions.splice(start, qnum);
              this.ques_type[vali].secondary.splice(valj, 1);
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            } else {
              //二级题型不是最后一个
              let start = this.ques_type[vali].secondary[valj].start;
              let qnum = this.ques_type[vali].secondary[valj].num;
              this.currentQues = start + 1;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.ques_type[vali].secondary[valj].score;
              this.ques_num -= qnum;
              this.ques_type[vali].total_score -=
                this.ques_type[vali].secondary[valj].score;
              this.ques_type[vali].total_num -= qnum;
              this.max_sequence = this.ques_num;
              this.questions.splice(start, qnum);
              this.ques_type[vali].secondary.splice(valj, 1);
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (
                let i = valj;
                i < this.ques_type[vali].secondary.length;
                i++
              ) {
                this.ques_type[vali].secondary[i].start -= qnum;
                this.ques_type[vali].secondary[i].end -= qnum;
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            }
          } else {
            //一级题型不是最后一个
            if (valj == this.ques_type[vali].secondary.length - 1) {
              //二级题型是最后一个
              let start = this.ques_type[vali].secondary[valj].start;
              let qnum = this.ques_type[vali].secondary[valj].num;
              this.currentQues = start;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.ques_type[vali].secondary[valj].score;
              this.ques_num -= qnum;
              this.ques_type[vali].total_score -=
                this.ques_type[vali].secondary[valj].score;
              this.ques_type[vali].total_num -= qnum;
              this.max_sequence = this.ques_num;
              this.questions.splice(start, qnum);
              this.ques_type[vali].secondary.splice(valj, 1);
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (let i = vali + 1; i < this.ques_type.length; i++) {
                for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                  this.ques_type[i].secondary[j].start -= qnum;
                  this.ques_type[i].secondary[j].end -= qnum;
                }
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            } else {
              //二级题型不是最后一个
              let start = this.ques_type[vali].secondary[valj].start;
              let qnum = this.ques_type[vali].secondary[valj].num;
              this.currentQues = start + 1;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.ques_type[vali].secondary[valj].score;
              this.ques_num -= qnum;
              this.ques_type[vali].total_score -=
                this.ques_type[vali].secondary[valj].score;
              this.ques_type[vali].total_num -= qnum;
              this.max_sequence = this.ques_num;
              this.questions.splice(start, qnum);
              this.ques_type[vali].secondary.splice(valj, 1);
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (
                let i = valj;
                i < this.ques_type[vali].secondary.length;
                i++
              ) {
                this.ques_type[vali].secondary[i].start -= qnum;
                this.ques_type[vali].secondary[i].end -= qnum;
              }
              for (let i = vali + 1; i < this.ques_type.length; i++) {
                for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                  this.ques_type[i].secondary[j].start -= qnum;
                  this.ques_type[i].secondary[j].end -= qnum;
                }
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            }
          }
        }
      }
    },
    async quesDel(vali, valj, valk) {
      if (this.ques_type[vali].secondary[valj].num == 1) {
        //只有一个题目
        if (this.ques_type[vali].secondary.length == 1) {
          //只有一个二级题型
          if (this.ques_type.length == 1) {
            //只有一个一级题型
            this.ques_type = [];
            this.questions = [];
            this.ques_num = 0;
            this.ques_score = 0;
            this.currentQues = 1;
            this.max_sequence = 1;
            for (let i = 0; i < this.editor.length; i++) {
              await this.editor[i].destroy();
            }
            this.init();
          } else {
            //有多个一级题型
            if (vali == this.ques_type.length - 1) {
              //一级题型是最后一个
              // let start = this.ques_type[vali].secondary[0].start;
              this.currentQues = valk;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.ques_type[vali].total_score;
              this.ques_num -= this.ques_type[vali].total_num;
              this.max_sequence = this.ques_num;
              this.questions.splice(valk, 1);
              this.ques_type.splice(vali, 1);
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            } else {
              //一级题型不是最后一个
              let start = this.ques_type[vali].secondary[0].start;
              this.currentQues = start + 1;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.ques_type[vali].total_score;
              this.ques_num -= this.ques_type[vali].total_num;
              this.max_sequence = this.ques_num;
              this.questions.splice(start, 1);
              this.ques_type.splice(vali, 1);
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (let i = vali; i < this.ques_type.length; i++) {
                for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                  this.ques_type[i].secondary[j].start -= 1;
                  this.ques_type[i].secondary[j].end -= 1;
                }
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            }
          }
        } else {
          //有多个二级题型
          if (this.ques_type.length == 1) {
            //只有一个一级题型
            if (valj == this.ques_type[vali].secondary.length - 1) {
              //二级题型是最后一个
              // let start = this.ques_type[vali].secondary[valj].start;
              this.currentQues = valk;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.ques_type[vali].secondary[valj].score;
              this.ques_num -= this.ques_type[vali].secondary[valj].num;
              this.ques_type[vali].total_score -=
                this.ques_type[vali].secondary[valj].score;
              this.ques_type[vali].total_num -=
                this.ques_type[vali].secondary[valj].num;
              this.max_sequence = this.ques_num;
              this.questions.splice(valk, 1);
              this.ques_type[vali].secondary.splice(valj, 1);
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            } else {
              //二级题型不是最后一个
              // let start = this.ques_type[vali].secondary[valj].start;
              this.currentQues = valk + 1;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.ques_type[vali].secondary[valj].score;
              this.ques_num -= this.ques_type[vali].secondary[valj].num;
              this.ques_type[vali].total_score -=
                this.ques_type[vali].secondary[valj].score;
              this.ques_type[vali].total_num -=
                this.ques_type[vali].secondary[valj].num;
              this.max_sequence = this.ques_num;
              this.questions.splice(valk, 1);
              this.ques_type[vali].secondary.splice(valj, 1);
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (
                let i = valj;
                i < this.ques_type[vali].secondary.length;
                i++
              ) {
                this.ques_type[vali].secondary[i].start -= 1;
                this.ques_type[vali].secondary[i].end -= 1;
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            }
          } else {
            //有多个一级题型
            if (vali == this.ques_type.length - 1) {
              //一级题型是最后一个
              if (valj == this.ques_type[vali].secondary.length - 1) {
                //二级题型是最后一个
                // let start = this.ques_type[vali].secondary[valj].start;
                this.currentQues = valk;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.ques_type[vali].secondary[valj].score;
                this.ques_num -= this.ques_type[vali].secondary[valj].num;
                this.ques_type[vali].total_score -=
                  this.ques_type[vali].secondary[valj].score;
                this.ques_type[vali].total_num -=
                  this.ques_type[vali].secondary[valj].num;
                this.max_sequence = this.ques_num;
                this.questions.splice(valk, 1);
                this.ques_type[vali].secondary.splice(valj, 1);
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              } else {
                //二级题型不是最后一个
                // let start = this.ques_type[vali].secondary[valj].start;
                this.currentQues = valk + 1;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.ques_type[vali].secondary[valj].score;
                this.ques_num -= this.ques_type[vali].secondary[valj].num;
                this.ques_type[vali].total_score -=
                  this.ques_type[vali].secondary[valj].score;
                this.ques_type[vali].total_num -=
                  this.ques_type[vali].secondary[valj].num;
                this.max_sequence = this.ques_num;
                this.questions.splice(valk, 1);
                this.ques_type[vali].secondary.splice(valj, 1);
                let num = 1;
                for (let i = 0; i < this.questions.length; i++) {
                  this.questions[i].sequence = i + 1;
                  this.questions[i].name =
                    this.questions[i].sequence.toString();
                  for (
                    let j = 0;
                    j < this.questions[i].sub_question.length;
                    j++
                  ) {
                    this.questions[i].sub_question[j].sub_sequence = j + 1;
                    this.questions[i].sub_question[j].actual_sequence = num;
                    num++;
                  }
                }
                for (
                  let i = valj;
                  i < this.ques_type[vali].secondary.length;
                  i++
                ) {
                  this.ques_type[vali].secondary[i].start -= 1;
                  this.ques_type[vali].secondary[i].end -= 1;
                }
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              }
            } else {
              //一级题型不是最后一个
              if (valj == this.ques_type[vali].secondary.length - 1) {
                //二级题型是最后一个
                let start = this.ques_type[vali].secondary[valj].start;
                this.currentQues = start;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.ques_type[vali].secondary[valj].score;
                this.ques_num -= this.ques_type[vali].secondary[valj].num;
                this.ques_type[vali].total_score -=
                  this.ques_type[vali].secondary[valj].score;
                this.ques_type[vali].total_num -=
                  this.ques_type[vali].secondary[valj].num;
                this.max_sequence = this.ques_num;
                this.questions.splice(start, 1);
                this.ques_type[vali].secondary.splice(valj, 1);
                let num = 1;
                for (let i = 0; i < this.questions.length; i++) {
                  this.questions[i].sequence = i + 1;
                  this.questions[i].name =
                    this.questions[i].sequence.toString();
                  for (
                    let j = 0;
                    j < this.questions[i].sub_question.length;
                    j++
                  ) {
                    this.questions[i].sub_question[j].sub_sequence = j + 1;
                    this.questions[i].sub_question[j].actual_sequence = num;
                    num++;
                  }
                }
                for (let i = vali + 1; i < this.ques_type.length; i++) {
                  for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                    this.ques_type[i].secondary[j].start -= 1;
                    this.ques_type[i].secondary[j].end -= 1;
                  }
                }
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              } else {
                //二级题型不是最后一个
                let start = this.ques_type[vali].secondary[valj].start;
                this.currentQues = start + 1;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.ques_type[vali].secondary[valj].score;
                this.ques_num -= this.ques_type[vali].secondary[valj].num;
                this.ques_type[vali].total_score -=
                  this.ques_type[vali].secondary[valj].score;
                this.ques_type[vali].total_num -=
                  this.ques_type[vali].secondary[valj].num;
                this.max_sequence = this.ques_num;
                this.questions.splice(start, 1);
                this.ques_type[vali].secondary.splice(valj, 1);
                let num = 1;
                for (let i = 0; i < this.questions.length; i++) {
                  this.questions[i].sequence = i + 1;
                  this.questions[i].name =
                    this.questions[i].sequence.toString();
                  for (
                    let j = 0;
                    j < this.questions[i].sub_question.length;
                    j++
                  ) {
                    this.questions[i].sub_question[j].sub_sequence = j + 1;
                    this.questions[i].sub_question[j].actual_sequence = num;
                    num++;
                  }
                }
                for (
                  let i = valj;
                  i < this.ques_type[vali].secondary.length;
                  i++
                ) {
                  this.ques_type[vali].secondary[i].start -= 1;
                  this.ques_type[vali].secondary[i].end -= 1;
                }
                for (let i = vali + 1; i < this.ques_type.length; i++) {
                  for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                    this.ques_type[i].secondary[j].start -= 1;
                    this.ques_type[i].secondary[j].end -= 1;
                  }
                }
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              }
            }
          }
        }
      } else {
        //有多个题目
        if (this.ques_type[vali].secondary.length == 1) {
          //只有一个二级题型
          if (this.ques_type.length == 1) {
            //只有一个一级题型
            if (valk == this.ques_type[vali].secondary[valj].end) {
              //题目是最后一个
              this.currentQues = valk;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.questions[valk].total_score;
              this.ques_num -= this.questions[valk].sub_question.length;
              this.ques_type[vali].total_score -=
                this.questions[valk].total_score;
              this.ques_type[vali].total_num -=
                this.questions[valk].sub_question.length;
              this.ques_type[vali].secondary[valj].score -=
                this.questions[valk].total_score;
              this.ques_type[vali].secondary[valj].num -=
                this.questions[valk].sub_question.length;
              this.max_sequence = this.ques_num;
              this.questions.splice(valk, 1);
              this.ques_type[vali].secondary[valj].end -= 1;
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            } else {
              //题目不是最后一个
              this.currentQues = valk + 1;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.questions[valk].total_score;
              this.ques_num -= this.questions[valk].sub_question.length;
              this.ques_type[vali].total_score -=
                this.questions[valk].total_score;
              this.ques_type[vali].total_num -=
                this.questions[valk].sub_question.length;
              this.ques_type[vali].secondary[valj].score -=
                this.questions[valk].total_score;
              this.ques_type[vali].secondary[valj].num -=
                this.questions[valk].sub_question.length;
              this.max_sequence = this.ques_num;
              this.questions.splice(valk, 1);
              this.ques_type[vali].secondary[valj].end -= 1;
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            }
          } else {
            //有多个一级题型
            if (vali == this.ques_type.length - 1) {
              //一级题型是最后一个
              if (valk == this.ques_type[vali].secondary[valj].end) {
                //题目是最后一个
                this.currentQues = valk;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.questions[valk].total_score;
                this.ques_num -= this.questions[valk].sub_question.length;
                this.ques_type[vali].total_score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].total_num -=
                  this.questions[valk].sub_question.length;
                this.ques_type[vali].secondary[valj].score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].secondary[valj].num -=
                  this.questions[valk].sub_question.length;
                this.max_sequence = this.ques_num;
                this.questions.splice(valk, 1);
                this.ques_type[vali].secondary[valj].end -= 1;
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              } else {
                //题目不是最后一个
                this.currentQues = valk + 1;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.questions[valk].total_score;
                this.ques_num -= this.questions[valk].sub_question.length;
                this.ques_type[vali].total_score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].total_num -=
                  this.questions[valk].sub_question.length;
                this.ques_type[vali].secondary[valj].score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].secondary[valj].num -=
                  this.questions[valk].sub_question.length;
                this.max_sequence = this.ques_num;
                this.questions.splice(valk, 1);
                this.ques_type[vali].secondary[valj].end -= 1;
                let num = 1;
                for (let i = 0; i < this.questions.length; i++) {
                  this.questions[i].sequence = i + 1;
                  this.questions[i].name =
                    this.questions[i].sequence.toString();
                  for (
                    let j = 0;
                    j < this.questions[i].sub_question.length;
                    j++
                  ) {
                    this.questions[i].sub_question[j].sub_sequence = j + 1;
                    this.questions[i].sub_question[j].actual_sequence = num;
                    num++;
                  }
                }
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              }
            } else {
              this.currentQues = valk + 1;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.questions[valk].total_score;
              this.ques_num -= this.questions[valk].sub_question.length;
              this.ques_type[vali].total_score -=
                this.questions[valk].total_score;
              this.ques_type[vali].total_num -=
                this.questions[valk].sub_question.length;
              this.ques_type[vali].secondary[valj].score -=
                this.questions[valk].total_score;
              this.ques_type[vali].secondary[valj].num -=
                this.questions[valk].sub_question.length;
              this.max_sequence = this.ques_num;
              this.questions.splice(valk, 1);
              this.ques_type[vali].secondary[valj].end -= 1;
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (let i = vali + 1; i < this.ques_type.length; i++) {
                for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                  this.ques_type[i].secondary[j].start -= 1;
                  this.ques_type[i].secondary[j].end -= 1;
                }
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            }
          }
        } else {
          //有多个二级题型
          if (this.ques_type.length == 1) {
            //只有一个一级题型
            if (valj == this.ques_type[vali].secondary.length - 1) {
              //二级题型是最后一个
              this.currentQues = valk;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.questions[valk].total_score;
              this.ques_num -= this.questions[valk].sub_question.length;
              this.ques_type[vali].total_score -=
                this.questions[valk].total_score;
              this.ques_type[vali].total_num -=
                this.questions[valk].sub_question.length;
              this.ques_type[vali].secondary[valj].score -=
                this.questions[valk].total_score;
              this.ques_type[vali].secondary[valj].num -=
                this.questions[valk].sub_question.length;
              this.questions.splice(valk, 1);
              this.ques_type[vali].secondary[valj].end -= 1;
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            } else {
              //二级题型不是最后一个
              this.currentQues = valk + 1;
              this.SCurrentQues = this.currentQues.toString();
              this.currentSubQues =
                this.questions[this.currentQues - 1].sub_question.length;
              this.ques_score -= this.questions[valk].total_score;
              this.ques_num -= this.questions[valk].sub_question.length;
              this.ques_type[vali].total_score -=
                this.questions[valk].total_score;
              this.ques_type[vali].total_num -=
                this.questions[valk].sub_question.length;
              this.ques_type[vali].secondary[valj].score -=
                this.questions[valk].total_score;
              this.ques_type[vali].secondary[valj].num -=
                this.questions[valk].sub_question.length;
              this.questions.splice(valk, 1);
              this.ques_type[vali].secondary[valj].end -= 1;
              let num = 1;
              for (let i = 0; i < this.questions.length; i++) {
                this.questions[i].sequence = i + 1;
                this.questions[i].name = this.questions[i].sequence.toString();
                for (
                  let j = 0;
                  j < this.questions[i].sub_question.length;
                  j++
                ) {
                  this.questions[i].sub_question[j].sub_sequence = j + 1;
                  this.questions[i].sub_question[j].actual_sequence = num;
                  num++;
                }
              }
              for (
                let i = valj + 1;
                i < this.ques_type[vali].secondary.length;
                i++
              ) {
                this.ques_type[vali].secondary[i].start -= 1;
                this.ques_type[vali].secondary[i].end -= 1;
              }
              for (let i = 0; i < this.editor.length; i++) {
                await this.editor[i].destroy();
              }
              this.createEdit();
            }
          } else {
            //有多个一级题型
            if (vali == this.ques_type.length - 1) {
              //一级题型是最后一个
              if (valj == this.ques_type[vali].secondary.length - 1) {
                //二级题型是最后一个
                this.currentQues = valk;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.questions[valk].total_score;
                this.ques_num -= this.questions[valk].sub_question.length;
                this.ques_type[vali].total_score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].total_num -=
                  this.questions[valk].sub_question.length;
                this.ques_type[vali].secondary[valj].score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].secondary[valj].num -=
                  this.questions[valk].sub_question.length;
                this.questions.splice(valk, 1);
                this.ques_type[vali].secondary[valj].end -= 1;
                let num = 1;
                for (let i = 0; i < this.questions.length; i++) {
                  this.questions[i].sequence = i + 1;
                  this.questions[i].name =
                    this.questions[i].sequence.toString();
                  for (
                    let j = 0;
                    j < this.questions[i].sub_question.length;
                    j++
                  ) {
                    this.questions[i].sub_question[j].sub_sequence = j + 1;
                    this.questions[i].sub_question[j].actual_sequence = num;
                    num++;
                  }
                }
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              } else {
                //二级题型不是最后一个
                this.currentQues = valk + 1;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.questions[valk].total_score;
                this.ques_num -= this.questions[valk].sub_question.length;
                this.ques_type[vali].total_score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].total_num -=
                  this.questions[valk].sub_question.length;
                this.ques_type[vali].secondary[valj].score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].secondary[valj].num -=
                  this.questions[valk].sub_question.length;
                this.questions.splice(valk, 1);
                this.ques_type[vali].secondary[valj].end -= 1;
                let num = 1;
                for (let i = 0; i < this.questions.length; i++) {
                  this.questions[i].sequence = i + 1;
                  this.questions[i].name =
                    this.questions[i].sequence.toString();
                  for (
                    let j = 0;
                    j < this.questions[i].sub_question.length;
                    j++
                  ) {
                    this.questions[i].sub_question[j].sub_sequence = j + 1;
                    this.questions[i].sub_question[j].actual_sequence = num;
                    num++;
                  }
                }
                for (
                  let i = valj + 1;
                  i < this.ques_type[vali].secondary.length;
                  i++
                ) {
                  this.ques_type[vali].secondary[i].start -= 1;
                  this.ques_type[vali].secondary[i].end -= 1;
                }
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              }
            } else {
              //一级题型不是最后一个
              if (valj == this.ques_type[vali].secondary.length - 1) {
                //二级题型是最后一个
                this.currentQues = valk;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.questions[valk].total_score;
                this.ques_num -= this.questions[valk].sub_question.length;
                this.ques_type[vali].total_score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].total_num -=
                  this.questions[valk].sub_question.length;
                this.ques_type[vali].secondary[valj].score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].secondary[valj].num -=
                  this.questions[valk].sub_question.length;
                this.questions.splice(valk, 1);
                this.ques_type[vali].secondary[valj].end -= 1;
                let num = 1;
                for (let i = 0; i < this.questions.length; i++) {
                  this.questions[i].sequence = i + 1;
                  this.questions[i].name =
                    this.questions[i].sequence.toString();
                  for (
                    let j = 0;
                    j < this.questions[i].sub_question.length;
                    j++
                  ) {
                    this.questions[i].sub_question[j].sub_sequence = j + 1;
                    this.questions[i].sub_question[j].actual_sequence = num;
                    num++;
                  }
                }
                for (let i = vali + 1; i < this.ques_type.length; i++) {
                  for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                    this.ques_type[i].secondary[j].start -= 1;
                    this.ques_type[i].secondary[j].end -= 1;
                  }
                }
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              } else {
                //二级题型不是最后一个
                this.currentQues = valk + 1;
                this.SCurrentQues = this.currentQues.toString();
                this.currentSubQues =
                  this.questions[this.currentQues - 1].sub_question.length;
                this.ques_score -= this.questions[valk].total_score;
                this.ques_num -= this.questions[valk].sub_question.length;
                this.ques_type[vali].total_score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].total_num -=
                  this.questions[valk].sub_question.length;
                this.ques_type[vali].secondary[valj].score -=
                  this.questions[valk].total_score;
                this.ques_type[vali].secondary[valj].num -=
                  this.questions[valk].sub_question.length;
                this.questions.splice(valk, 1);
                this.ques_type[vali].secondary[valj].end -= 1;
                let num = 1;
                for (let i = 0; i < this.questions.length; i++) {
                  this.questions[i].sequence = i + 1;
                  this.questions[i].name =
                    this.questions[i].sequence.toString();
                  for (
                    let j = 0;
                    j < this.questions[i].sub_question.length;
                    j++
                  ) {
                    this.questions[i].sub_question[j].sub_sequence = j + 1;
                    this.questions[i].sub_question[j].actual_sequence = num;
                    num++;
                  }
                }
                for (
                  let i = valj + 1;
                  i < this.ques_type[vali].secondary.length;
                  i++
                ) {
                  this.ques_type[vali].secondary[i].start -= 1;
                  this.ques_type[vali].secondary[i].end -= 1;
                }
                for (let i = vali + 1; i < this.ques_type.length; i++) {
                  for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
                    this.ques_type[i].secondary[j].start -= 1;
                    this.ques_type[i].secondary[j].end -= 1;
                  }
                }
                for (let i = 0; i < this.editor.length; i++) {
                  await this.editor[i].destroy();
                }
                this.createEdit();
              }
            }
          }
        }
      }
    },
    typeUp(val) {
      if (val != 0) {
        let type = this.ques_type[val];
        let fstart = this.ques_type[val - 1].secondary[0].start;
        let fend =
          this.ques_type[val - 1].secondary[
            this.ques_type[val - 1].secondary.length - 1
          ].end;
        let sstart = this.ques_type[val].secondary[0].start;
        let send =
          this.ques_type[val].secondary[
            this.ques_type[val].secondary.length - 1
          ].end;
        let fnum = fend - fstart + 1;
        let snum = send - sstart + 1;
        this.ques_type[val] = this.ques_type[val - 1];
        this.ques_type[val - 1] = type;
        for (let i = 0; i < this.ques_type[val].secondary.length; i++) {
          this.ques_type[val].secondary[i].start += snum;
          this.ques_type[val].secondary[i].end += snum;
        }
        for (let i = 0; i < this.ques_type[val - 1].secondary.length; i++) {
          this.ques_type[val - 1].secondary[i].start -= fnum;
          this.ques_type[val - 1].secondary[i].end -= fnum;
        }
        let ques = [];
        for (let i = fstart; i <= fend; i++) {
          ques.push(this.questions[i]);
        }
        let s = fstart;
        for (let i = sstart; i <= send; i++) {
          this.questions[s] = this.questions[i];
          s++;
        }
        for (let i = 0; i < ques.length; i++) {
          this.questions[s] = ques[i];
          s++;
        }
        let sequence = 1;
        let actual_sequence = 1;
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].sequence = sequence;
          this.questions[i].name = this.questions[i].sequence.toString();
          sequence++;
          for (let j = 0; j < this.questions[i].sub_question.length; j++) {
            this.questions[i].sub_question[j].actual_sequence = actual_sequence;
            actual_sequence++;
          }
        }
      } else {
        this.$message({
          message: "已经是第一个",
          type: "warning",
        });
      }
    },
    typeDown(val) {
      if (val != this.ques_type.length - 1) {
        let type = this.ques_type[val];
        let fstart = this.ques_type[val].secondary[0].start;
        let fend =
          this.ques_type[val].secondary[
            this.ques_type[val].secondary.length - 1
          ].end;
        let sstart = this.ques_type[val + 1].secondary[0].start;
        let send =
          this.ques_type[val + 1].secondary[
            this.ques_type[val + 1].secondary.length - 1
          ].end;
        let fnum = fend - fstart + 1;
        let snum = send - sstart + 1;
        this.ques_type[val] = this.ques_type[val + 1];
        this.ques_type[val + 1] = type;
        for (let i = 0; i < this.ques_type[val].secondary.length; i++) {
          this.ques_type[val].secondary[i].start -= fnum;
          this.ques_type[val].secondary[i].end -= fnum;
        }
        for (let i = 0; i < this.ques_type[val + 1].secondary.length; i++) {
          this.ques_type[val + 1].secondary[i].start += snum;
          this.ques_type[val + 1].secondary[i].end += snum;
        }
        let ques = [];
        for (let i = fstart; i <= fend; i++) {
          ques.push(this.questions[i]);
        }
        let s = fstart;
        for (let i = sstart; i <= send; i++) {
          this.questions[s] = this.questions[i];
          s++;
        }
        for (let i = 0; i < ques.length; i++) {
          this.questions[s] = ques[i];
          s++;
        }
        let sequence = 1;
        let actual_sequence = 1;
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].sequence = sequence;
          this.questions[i].name = this.questions[i].sequence.toString();
          sequence++;
          for (let j = 0; j < this.questions[i].sub_question.length; j++) {
            this.questions[i].sub_question[j].actual_sequence = actual_sequence;
            actual_sequence++;
          }
        }
      } else {
        this.$message({
          message: "已经是最后一个",
          type: "warning",
        });
      }
    },
    stypeUp(vali, valj) {
      if (valj != 0) {
        let type = this.ques_type[vali].secondary[valj];
        let fstart = this.ques_type[vali].secondary[valj - 1].start;
        let fend = this.ques_type[vali].secondary[valj - 1].end;
        let sstart = this.ques_type[vali].secondary[valj].start;
        let send = this.ques_type[vali].secondary[valj].end;
        let fnum = fend - fstart + 1;
        let snum = send - sstart + 1;
        this.ques_type[vali].secondary[valj] =
          this.ques_type[vali].secondary[valj - 1];
        this.ques_type[vali].secondary[valj - 1] = type;
        this.ques_type[vali].secondary[valj].start += snum;
        this.ques_type[vali].secondary[valj].end += snum;
        this.ques_type[vali].secondary[valj - 1].start -= fnum;
        this.ques_type[vali].secondary[valj - 1].end -= fnum;
        let ques = [];
        for (let i = fstart; i <= fend; i++) {
          ques.push(this.questions[i]);
        }
        let s = fstart;
        for (let i = sstart; i <= send; i++) {
          this.questions[s] = this.questions[i];
          s++;
        }
        for (let i = 0; i < ques.length; i++) {
          this.questions[s] = ques[i];
          s++;
        }
        let sequence = 1;
        let actual_sequence = 1;
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].sequence = sequence;
          this.questions[i].name = this.questions[i].sequence.toString();
          sequence++;
          for (let j = 0; j < this.questions[i].sub_question.length; j++) {
            this.questions[i].sub_question[j].actual_sequence = actual_sequence;
            actual_sequence++;
          }
        }
      } else {
        this.$message({
          message: "已经是第一个",
          type: "warning",
        });
      }
    },
    stypeDown(vali, valj) {
      if (valj != this.ques_type[vali].secondary.length - 1) {
        let type = this.ques_type[vali].secondary[valj];
        let fstart = this.ques_type[vali].secondary[valj].start;
        let fend = this.ques_type[vali].secondary[valj].end;
        let sstart = this.ques_type[vali].secondary[valj + 1].start;
        let send = this.ques_type[vali].secondary[valj + 1].end;
        let fnum = fend - fstart + 1;
        let snum = send - sstart + 1;
        this.ques_type[vali].secondary[valj] =
          this.ques_type[vali].secondary[valj + 1];
        this.ques_type[vali].secondary[valj + 1] = type;
        this.ques_type[vali].secondary[valj].start -= fnum;
        this.ques_type[vali].secondary[valj].end -= fnum;
        this.ques_type[vali].secondary[valj + 1].start += snum;
        this.ques_type[vali].secondary[valj + 1].end += snum;
        let ques = [];
        for (let i = fstart; i <= fend; i++) {
          ques.push(this.questions[i]);
        }
        let s = fstart;
        for (let i = sstart; i <= send; i++) {
          this.questions[s] = this.questions[i];
          s++;
        }
        for (let i = 0; i < ques.length; i++) {
          this.questions[s] = ques[i];
          s++;
        }
        let sequence = 1;
        let actual_sequence = 1;
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].sequence = sequence;
          this.questions[i].name = this.questions[i].sequence.toString();
          sequence++;
          for (let j = 0; j < this.questions[i].sub_question.length; j++) {
            this.questions[i].sub_question[j].actual_sequence = actual_sequence;
            actual_sequence++;
          }
        }
      } else {
        this.$message({
          message: "已经是最后一个",
          type: "warning",
        });
      }
    },
    quesUp(vali, valj, valk) {
      if (valk != this.ques_type[vali].secondary[valj].start) {
        let ques = this.questions[valk];
        this.questions[valk] = this.questions[valk - 1];
        this.questions[valk - 1] = ques;
        let sequence = 1;
        let actual_sequence = 1;
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].sequence = sequence;
          this.questions[i].name = this.questions[i].sequence.toString();
          sequence++;
          for (let j = 0; j < this.questions[i].sub_question.length; j++) {
            this.questions[i].sub_question[j].actual_sequence = actual_sequence;
            actual_sequence++;
          }
        }
      } else {
        this.$message({
          message: "已经是第一个",
          type: "warning",
        });
      }
    },
    quesDown(vali, valj, valk) {
      if (valk != this.ques_type[vali].secondary[valj].end) {
        let ques = this.questions[valk];
        this.questions[valk] = this.questions[valk + 1];
        this.questions[valk + 1] = ques;
        let sequence = 1;
        let actual_sequence = 1;
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].sequence = sequence;
          this.questions[i].name = this.questions[i].sequence.toString();
          sequence++;
          for (let j = 0; j < this.questions[i].sub_question.length; j++) {
            this.questions[i].sub_question[j].actual_sequence = actual_sequence;
            actual_sequence++;
          }
        }
      } else {
        this.$message({
          message: "已经是最后一个",
          type: "warning",
        });
      }
    },
    grade(type, se) {
      if (type != undefined) {
        var arr = new Array();
        for (let i = 0; i < type.length; i++) {
          let temp;
          temp = type[i][0] + "," + type[i][1];
          arr.push(temp);
        }
        this.questions[this.currentQues - 1].sub_question[se - 1].grade_value =
          arr;
      }
    },
    topic(type, se) {
      if (type != undefined) {
        var arr = new Array();
        for (let i = 0; i < type.length; i++) {
          let temp;
          temp = type[i][0] + "," + type[i][1];
          arr.push(temp);
        }
        this.questions[this.currentQues - 1].sub_question[se - 1].topic_value =
          arr;
      }
    },
    savePaper() {
      if (this.questions[this.currentQues - 1].saveQ == false) {
        this.checkQues();
      }
      if (this.title == "") {
        this.$message({
          message: "请填写试卷标题",
          type: "warning",
        });
      }
      if (Cookie.get("paperEdit") == "true") {
        let paper = new BaaS.TableObject("test_paper");
        paper.delete(Cookie.get("paperInfo")).then(
          (res) => {
            console.log(res);
            if (this.exam == false) {
              if (
                this.questions[this.currentQues - 1].saveQ == true &&
                this.title != ""
              ) {
                //试卷标题是否已存在
                let findPaper = new BaaS.TableObject("test_paper");
                let find_paper = new BaaS.Query();
                find_paper.compare("paper_title", "=", this.title);
                findPaper
                  .setQuery(find_paper)
                  .find()
                  .then((res0) => {
                    if (res0.data.objects.length != 0) {
                      this.$message({
                        message: "试卷标题已存在，请重新填写",
                        type: "warning",
                      });
                    } else {
                      let question_detail = new Array();
                      for (let i = 0; i < this.questions.length; i++) {
                        //找是否有已存在题干
                        let findContent = new BaaS.TableObject(
                          "question_content"
                        );
                        let find_content = new BaaS.Query();
                        find_content.compare(
                          "content",
                          "=",
                          this.questions[i].question_content
                        );
                        findContent
                          .setQuery(find_content)
                          .find()
                          .then(
                            (res1) => {
                              if (res1.data.objects.length > 0) {
                                //在数据库里找到该题干
                                let contentId = res1.data.objects[0].id;
                                for (
                                  let j = 0;
                                  j < this.questions[i].sub_question.length;
                                  j++
                                ) {
                                  //题目是否存在
                                  let findQuestion = new BaaS.TableObject(
                                    "questions_information"
                                  );
                                  let question_content_id = new BaaS.Query();
                                  let primary_ques_type = new BaaS.Query();
                                  let secondary_ques_type = new BaaS.Query();
                                  let question = new BaaS.Query();
                                  let options = new BaaS.Query();
                                  let answer = new BaaS.Query();
                                  let analysis = new BaaS.Query();
                                  let grade_standard = new BaaS.Query();
                                  let topic_outline = new BaaS.Query();
                                  let department = new BaaS.Query();
                                  let task_outline = new BaaS.Query();
                                  let ques_level = new BaaS.Query();
                                  let question_class = new BaaS.Query();
                                  let question_type_5he = new BaaS.Query();
                                  let author = new BaaS.Query();
                                  let author_org = new BaaS.Query();
                                  let time_created = new BaaS.Query();
                                  question_content_id.compare(
                                    "question_content_id",
                                    "=",
                                    contentId
                                  );
                                  primary_ques_type.compare(
                                    "primary_ques_type",
                                    "=",
                                    this.questions[i].primary_ques_type
                                  );
                                  secondary_ques_type.compare(
                                    "secondary_ques_type",
                                    "=",
                                    this.questions[i].secondary_ques_type
                                  );
                                  if (
                                    this.questions[i].sub_question[j]
                                      .question != null
                                  ) {
                                    question.compare(
                                      "question",
                                      "=",
                                      this.questions[i].sub_question[j].question
                                    );
                                  } else {
                                    question.isNull("question");
                                  }
                                  if (
                                    this.questions[i].sub_question[j].options !=
                                    null
                                  ) {
                                    options.compare(
                                      "options",
                                      "=",
                                      JSON.stringify(
                                        this.questions[i].sub_question[j]
                                          .options
                                      )
                                    );
                                  } else {
                                    options.isNull("options");
                                  }
                                  answer.compare(
                                    "answer",
                                    "=",
                                    this.questions[i].sub_question[j].answer
                                  );
                                  if (
                                    this.questions[i].sub_question[j]
                                      .analysis != null
                                  ) {
                                    analysis.compare(
                                      "analysis",
                                      "=",
                                      this.questions[i].sub_question[j].analysis
                                    );
                                  } else {
                                    analysis.isNull("analysis");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .grade_value != null
                                  ) {
                                    grade_standard.compare(
                                      "grade_standard",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .grade_value
                                    );
                                  } else {
                                    grade_standard.isNull("grade_standard");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .topic_value != null
                                  ) {
                                    topic_outline.compare(
                                      "topic_outline",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .topic_value
                                    );
                                  } else {
                                    topic_outline.isNull("topic_outline");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .department_value != null
                                  ) {
                                    department.compare(
                                      "department",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .department_value
                                    );
                                  } else {
                                    department.isNull("department");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .task_value != null
                                  ) {
                                    task_outline.compare(
                                      "task_outline",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .task_value
                                    );
                                  } else {
                                    task_outline.isNull("task_outline");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .level_value != null
                                  ) {
                                    ques_level.compare(
                                      "ques_level",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .level_value
                                    );
                                  } else {
                                    ques_level.isNull("ques_level");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .qclass_value != null
                                  ) {
                                    question_class.compare(
                                      "question_class",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .qclass_value
                                    );
                                  } else {
                                    question_class.isNull("question_class");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .fivehe_value != null
                                  ) {
                                    question_type_5he.compare(
                                      "question_type_5he",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .fivehe_value
                                    );
                                  } else {
                                    question_type_5he.isNull(
                                      "question_type_5he"
                                    );
                                  }
                                  if (
                                    this.questions[i].sub_question[j].author !=
                                    null
                                  ) {
                                    author.compare(
                                      "author",
                                      "=",
                                      this.questions[i].sub_question[j].author
                                    );
                                  } else {
                                    author.isNull("author");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .author_org != null
                                  ) {
                                    author_org.compare(
                                      "author_org",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .author_org
                                    );
                                  } else {
                                    author_org.isNull("author_org");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .time_created != null
                                  ) {
                                    time_created.compare(
                                      "time_created",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .time_created
                                    );
                                  } else {
                                    time_created.isNull("time_created");
                                  }
                                  let andQuery = BaaS.Query.and(
                                    question_content_id,
                                    primary_ques_type,
                                    secondary_ques_type,
                                    question,
                                    options,
                                    answer,
                                    analysis,
                                    grade_standard,
                                    topic_outline,
                                    department,
                                    task_outline,
                                    ques_level,
                                    question_class,
                                    question_type_5he,
                                    author,
                                    author_org,
                                    time_created
                                  );
                                  findQuestion
                                    .setQuery(andQuery)
                                    .find()
                                    .then(
                                      (res2) => {
                                        if (res2.data.objects.length == 0) {
                                          //没找到存在的题目
                                          //存储题目
                                          let saveQuestion =
                                            new BaaS.TableObject(
                                              "questions_information"
                                            );
                                          let save_question =
                                            saveQuestion.create();
                                          let temp1;
                                          if (
                                            (this.questions[i]
                                              .primary_ques_type == "听力" &&
                                              this.questions[i]
                                                .secondary_ques_type ==
                                                "听句子，判断对错") ||
                                            this.questions[i]
                                              .primary_ques_type == "判断题"
                                          ) {
                                            temp1 = {
                                              question_content_id: contentId,
                                              primary_ques_type:
                                                this.questions[i]
                                                  .primary_ques_type,
                                              secondary_ques_type:
                                                this.questions[i]
                                                  .secondary_ques_type,
                                              question:
                                                this.questions[i].sub_question[
                                                  j
                                                ].question,
                                              options: JSON.stringify(
                                                this.questions[i].sub_question[
                                                  j
                                                ].options
                                              ),
                                              answer:
                                                this.questions[i].sub_question[
                                                  j
                                                ].answer,
                                              analysis:
                                                this.questions[i].sub_question[
                                                  j
                                                ].analysis,
                                              grade_standard:
                                                this.questions[i].sub_question[
                                                  j
                                                ].grade_value,
                                              topic_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].topic_value,
                                              department:
                                                this.questions[i].sub_question[
                                                  j
                                                ].department_value,
                                              task_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].task_value,
                                              ques_level:
                                                this.questions[i].sub_question[
                                                  j
                                                ].level_value,
                                              question_class:
                                                this.questions[i].sub_question[
                                                  j
                                                ].qclass_value,
                                              question_type_5he:
                                                this.questions[i].sub_question[
                                                  j
                                                ].fivehe_value,
                                              // sub_sequence:
                                              //   this.questions[i].sub_question[j]
                                              //     .actual_sequence,
                                              score:
                                                this.questions[i].sub_question[
                                                  j
                                                ].score * 1,
                                              author:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author,
                                              author_org:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author_org,
                                              time_created:
                                                this.questions[i].sub_question[
                                                  j
                                                ].time_created,
                                            };
                                          } else if (
                                            (this.questions[i]
                                              .primary_ques_type == "听力" &&
                                              this.questions[i]
                                                .secondary_ques_type !=
                                                "听句子，判断对错") ||
                                            this.questions[i]
                                              .primary_ques_type == "阅读" ||
                                            this.questions[i]
                                              .primary_ques_type == "单选题" ||
                                            this.questions[i]
                                              .primary_ques_type == "多选题" ||
                                            this.questions[i]
                                              .primary_ques_type == "填空题"
                                          ) {
                                            temp1 = {
                                              question_content_id: contentId,
                                              primary_ques_type:
                                                this.questions[i]
                                                  .primary_ques_type,
                                              secondary_ques_type:
                                                this.questions[i]
                                                  .secondary_ques_type,
                                              question:
                                                this.questions[i].sub_question[
                                                  j
                                                ].question,
                                              options: JSON.stringify(
                                                this.questions[i].sub_question[
                                                  j
                                                ].options
                                              ),
                                              answer:
                                                this.questions[i].sub_question[
                                                  j
                                                ].answer,
                                              analysis:
                                                this.questions[i].sub_question[
                                                  j
                                                ].analysis,
                                              grade_standard:
                                                this.questions[i].sub_question[
                                                  j
                                                ].grade_value,
                                              topic_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].topic_value,
                                              department:
                                                this.questions[i].sub_question[
                                                  j
                                                ].department_value,
                                              task_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].task_value,
                                              ques_level:
                                                this.questions[i].sub_question[
                                                  j
                                                ].level_value,
                                              question_class:
                                                this.questions[i].sub_question[
                                                  j
                                                ].qclass_value,
                                              question_type_5he:
                                                this.questions[i].sub_question[
                                                  j
                                                ].fivehe_value,
                                              author:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author,
                                              author_org:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author_org,
                                              time_created:
                                                this.questions[i].sub_question[
                                                  j
                                                ].time_created,
                                            };
                                          } else if (
                                            this.questions[i]
                                              .primary_ques_type == "写作" ||
                                            this.questions[i]
                                              .primary_ques_type == "简答题"
                                          ) {
                                            temp1 = {
                                              question_content_id: contentId,
                                              primary_ques_type:
                                                this.questions[i]
                                                  .primary_ques_type,
                                              secondary_ques_type:
                                                this.questions[i]
                                                  .secondary_ques_type,
                                              question:
                                                this.questions[i].sub_question[
                                                  j
                                                ].question,
                                              options: null,
                                              answer:
                                                this.questions[i].sub_question[
                                                  j
                                                ].answer,
                                              analysis:
                                                this.questions[i].sub_question[
                                                  j
                                                ].analysis,
                                              grade_standard:
                                                this.questions[i].sub_question[
                                                  j
                                                ].grade_value,
                                              topic_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].topic_value,
                                              department:
                                                this.questions[i].sub_question[
                                                  j
                                                ].department_value,
                                              task_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].task_value,
                                              ques_level:
                                                this.questions[i].sub_question[
                                                  j
                                                ].level_value,
                                              question_class:
                                                this.questions[i].sub_question[
                                                  j
                                                ].qclass_value,
                                              question_type_5he:
                                                this.questions[i].sub_question[
                                                  j
                                                ].fivehe_value,
                                              author:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author,
                                              author_org:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author_org,
                                              time_created:
                                                this.questions[i].sub_question[
                                                  j
                                                ].time_created,
                                            };
                                          }
                                          save_question
                                            .set(temp1)
                                            .save()
                                            .then(
                                              (res3) => {
                                                let q = {
                                                  id: res3.data.id,
                                                  sub_sequence:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .actual_sequence,
                                                  score:
                                                    this.questions[i]
                                                      .sub_question[j].score *
                                                    1,
                                                };
                                                question_detail.push(q);
                                                if (
                                                  question_detail.length ==
                                                  this.ques_num
                                                ) {
                                                  let savePaper =
                                                    new BaaS.TableObject(
                                                      "test_paper"
                                                    );
                                                  let save_paper =
                                                    savePaper.create();
                                                  let paper_type;
                                                  paper_type = "练习";
                                                  let p = {
                                                    paper_title: this.title,
                                                    paper_type: paper_type,
                                                    questions_num:
                                                      this.ques_num,
                                                    points: this.ques_score,
                                                    questions_detail:
                                                      JSON.stringify(
                                                        question_detail
                                                      ),
                                                    ques_type: JSON.stringify(
                                                      this.ques_type
                                                    ),
                                                  };
                                                  save_paper
                                                    .set(p)
                                                    .save()
                                                    .then(
                                                      (res) => {
                                                        console.log(res);
                                                        this.$message({
                                                          message: "保存成功",
                                                          type: "success",
                                                        });
                                                        Cookies.set(
                                                          "paperInfo",
                                                          res.data.id
                                                        );
                                                        this.back();
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
                                        } else {
                                          //找到了已存在的题目
                                          let q = {
                                            id: res2.data.objects[0].id,
                                            sub_sequence:
                                              this.questions[i].sub_question[j]
                                                .actual_sequence,
                                            score:
                                              this.questions[i].sub_question[j]
                                                .score * 1,
                                          };
                                          question_detail.push(q);
                                          if (
                                            question_detail.length ==
                                            this.ques_num
                                          ) {
                                            let savePaper =
                                              new BaaS.TableObject(
                                                "test_paper"
                                              );
                                            let save_paper = savePaper.create();
                                            let paper_type;
                                            paper_type = "练习";
                                            let p = {
                                              paper_title: this.title,
                                              paper_type: paper_type,
                                              questions_num: this.ques_num,
                                              points: this.ques_score,
                                              questions_detail:
                                                JSON.stringify(question_detail),
                                              ques_type: JSON.stringify(
                                                this.ques_type
                                              ),
                                            };
                                            save_paper
                                              .set(p)
                                              .save()
                                              .then(
                                                (res) => {
                                                  console.log(res);
                                                  this.$message({
                                                    message: "保存成功",
                                                    type: "success",
                                                  });
                                                  Cookies.set(
                                                    "paperInfo",
                                                    res.data.id
                                                  );
                                                  this.back();
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
                              } else {
                                //数据库里没有该题干
                                let saveContent = new BaaS.TableObject(
                                  "question_content"
                                );
                                let save_content = saveContent.create();
                                let tempc = {
                                  content: this.questions[i].question_content,
                                  file_url: null,
                                  catalog: null,
                                };
                                save_content
                                  .set(tempc)
                                  .save()
                                  .then(
                                    (res4) => {
                                      for (
                                        let j = 0;
                                        j <
                                        this.questions[i].sub_question.length;
                                        j++
                                      ) {
                                        let tempq;
                                        //存储题目
                                        let saveQuestion = new BaaS.TableObject(
                                          "questions_information"
                                        );
                                        let save_question =
                                          saveQuestion.create();
                                        if (
                                          (this.questions[i]
                                            .primary_ques_type == "听力" &&
                                            this.questions[i]
                                              .secondary_ques_type ==
                                              "听句子，判断对错") ||
                                          this.questions[i].primary_ques_type ==
                                            "判断题"
                                        ) {
                                          tempq = {
                                            question_content_id: res4.data.id,
                                            primary_ques_type:
                                              this.questions[i]
                                                .primary_ques_type,
                                            secondary_ques_type:
                                              this.questions[i]
                                                .secondary_ques_type,
                                            question:
                                              this.questions[i].sub_question[j]
                                                .question,
                                            options: JSON.stringify(
                                              this.questions[i].sub_question[j]
                                                .options
                                            ),
                                            answer:
                                              this.questions[i].sub_question[j]
                                                .answer,
                                            analysis:
                                              this.questions[i].sub_question[j]
                                                .analysis,
                                            grade_standard:
                                              this.questions[i].sub_question[j]
                                                .grade_value,
                                            topic_outline:
                                              this.questions[i].sub_question[j]
                                                .topic_value,
                                            department:
                                              this.questions[i].sub_question[j]
                                                .department_value,
                                            task_outline:
                                              this.questions[i].sub_question[j]
                                                .task_value,
                                            ques_level:
                                              this.questions[i].sub_question[j]
                                                .level_value,
                                            question_class:
                                              this.questions[i].sub_question[j]
                                                .qclass_value,
                                            question_type_5he:
                                              this.questions[i].sub_question[j]
                                                .fivehe_value,
                                            author:
                                              this.questions[i].sub_question[j]
                                                .author,
                                            author_org:
                                              this.questions[i].sub_question[j]
                                                .author_org,
                                            time_created:
                                              this.questions[i].sub_question[j]
                                                .time_created,
                                          };
                                        } else if (
                                          (this.questions[i]
                                            .primary_ques_type == "听力" &&
                                            this.questions[i]
                                              .secondary_ques_type !=
                                              "听句子，判断对错") ||
                                          this.questions[i].primary_ques_type ==
                                            "阅读" ||
                                          this.questions[i].primary_ques_type ==
                                            "单选题" ||
                                          this.questions[i].primary_ques_type ==
                                            "多选题" ||
                                          this.questions[i].primary_ques_type ==
                                            "填空题"
                                        ) {
                                          tempq = {
                                            question_content_id: res4.data.id,
                                            primary_ques_type:
                                              this.questions[i]
                                                .primary_ques_type,
                                            secondary_ques_type:
                                              this.questions[i]
                                                .secondary_ques_type,
                                            question:
                                              this.questions[i].sub_question[j]
                                                .question,
                                            options: JSON.stringify(
                                              this.questions[i].sub_question[j]
                                                .options
                                            ),
                                            answer:
                                              this.questions[i].sub_question[j]
                                                .answer,
                                            analysis:
                                              this.questions[i].sub_question[j]
                                                .analysis,
                                            grade_standard:
                                              this.questions[i].sub_question[j]
                                                .grade_value,
                                            topic_outline:
                                              this.questions[i].sub_question[j]
                                                .topic_value,
                                            department:
                                              this.questions[i].sub_question[j]
                                                .department_value,
                                            task_outline:
                                              this.questions[i].sub_question[j]
                                                .task_value,
                                            ques_level:
                                              this.questions[i].sub_question[j]
                                                .level_value,
                                            question_class:
                                              this.questions[i].sub_question[j]
                                                .qclass_value,
                                            question_type_5he:
                                              this.questions[i].sub_question[j]
                                                .fivehe_value,
                                            author:
                                              this.questions[i].sub_question[j]
                                                .author,
                                            author_org:
                                              this.questions[i].sub_question[j]
                                                .author_org,
                                            time_created:
                                              this.questions[i].sub_question[j]
                                                .time_created,
                                          };
                                        } else if (
                                          this.questions[i].primary_ques_type ==
                                            "写作" ||
                                          this.questions[i].primary_ques_type ==
                                            "简答题"
                                        ) {
                                          tempq = {
                                            question_content_id: res4.data.id,
                                            primary_ques_type:
                                              this.questions[i]
                                                .primary_ques_type,
                                            secondary_ques_type:
                                              this.questions[i]
                                                .secondary_ques_type,
                                            question:
                                              this.questions[i].sub_question[j]
                                                .question,
                                            options: null,
                                            answer:
                                              this.questions[i].sub_question[j]
                                                .answer,
                                            analysis:
                                              this.questions[i].sub_question[j]
                                                .analysis,
                                            grade_standard:
                                              this.questions[i].sub_question[j]
                                                .grade_value,
                                            topic_outline:
                                              this.questions[i].sub_question[j]
                                                .topic_value,
                                            department:
                                              this.questions[i].sub_question[j]
                                                .department_value,
                                            task_outline:
                                              this.questions[i].sub_question[j]
                                                .task_value,
                                            ques_level:
                                              this.questions[i].sub_question[j]
                                                .level_value,
                                            question_class:
                                              this.questions[i].sub_question[j]
                                                .qclass_value,
                                            question_type_5he:
                                              this.questions[i].sub_question[j]
                                                .fivehe_value,
                                            author:
                                              this.questions[i].sub_question[j]
                                                .author,
                                            author_org:
                                              this.questions[i].sub_question[j]
                                                .author_org,
                                            time_created:
                                              this.questions[i].sub_question[j]
                                                .time_created,
                                          };
                                        }
                                        save_question
                                          .set(tempq)
                                          .save()
                                          .then(
                                            (res) => {
                                              let q = {
                                                id: res.data.id,
                                                sub_sequence:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .actual_sequence,
                                                score:
                                                  this.questions[i]
                                                    .sub_question[j].score * 1,
                                              };
                                              question_detail.push(q);
                                              if (
                                                question_detail.length ==
                                                this.ques_num
                                              ) {
                                                let savePaper =
                                                  new BaaS.TableObject(
                                                    "test_paper"
                                                  );
                                                let save_paper =
                                                  savePaper.create();
                                                let paper_type;
                                                paper_type = "练习";
                                                let p = {
                                                  paper_title: this.title,
                                                  paper_type: paper_type,
                                                  questions_num: this.ques_num,
                                                  points: this.ques_score,
                                                  questions_detail:
                                                    JSON.stringify(
                                                      question_detail
                                                    ),
                                                  ques_type: JSON.stringify(
                                                    this.ques_type
                                                  ),
                                                };
                                                save_paper
                                                  .set(p)
                                                  .save()
                                                  .then(
                                                    (res) => {
                                                      console.log(res);
                                                      this.$message({
                                                        message: "保存成功",
                                                        type: "success",
                                                      });
                                                      Cookies.set(
                                                        "paperInfo",
                                                        res.data.id
                                                      );
                                                      this.back();
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
                    }
                  });
              }
            } else {
              //模考卷
              if (this.ques_num == 101 && this.ques_score == 300) {
                let ln1 = 0,
                  ls1 = 0,
                  ln2 = 0,
                  ls2 = 0,
                  ln3 = 0,
                  ls3 = 0,
                  ln4 = 0,
                  ls4 = 0,
                  rn1 = 0,
                  rs1 = 0,
                  rn2 = 0,
                  rs2 = 0,
                  rn3 = 0,
                  rs3 = 0,
                  rn4 = 0,
                  rs4 = 0,
                  wn = 0,
                  ws = 0;
                for (let f = 0; f < this.questions.length; f++) {
                  if (
                    this.questions[f].secondary_ques_type == "听句子，判断对错"
                  ) {
                    ln1 += this.questions[f].sub_question.length;
                    ls1 += this.questions[f].total_score;
                  } else if (
                    this.questions[f].secondary_ques_type ==
                    "听短对话，选择正确答案"
                  ) {
                    ln2 += this.questions[f].sub_question.length;
                    ls2 += this.questions[f].total_score;
                  } else if (
                    this.questions[f].secondary_ques_type ==
                    "听长对话，选择正确答案"
                  ) {
                    ln3 += this.questions[f].sub_question.length;
                    ls3 += this.questions[f].total_score;
                  } else if (
                    this.questions[f].secondary_ques_type ==
                    "听短文，选择正确答案"
                  ) {
                    ln4 += this.questions[f].sub_question.length;
                    ls4 += this.questions[f].total_score;
                  } else if (
                    this.questions[f].secondary_ques_type ==
                    "选择正确的词语填空"
                  ) {
                    rn1 += this.questions[f].sub_question.length;
                    rs1 += this.questions[f].total_score;
                  } else if (
                    this.questions[f].secondary_ques_type ==
                    "阅读语段，选择与语段意思一致的一项"
                  ) {
                    rn2 += this.questions[f].sub_question.length;
                    rs2 += this.questions[f].total_score;
                  } else if (
                    this.questions[f].secondary_ques_type ==
                    "阅读材料，选择正确答案"
                  ) {
                    rn3 += this.questions[f].sub_question.length;
                    rs3 += this.questions[f].total_score;
                  } else if (
                    this.questions[f].secondary_ques_type ==
                    "阅读短文，选出正确答案"
                  ) {
                    rn4 += this.questions[f].sub_question.length;
                    rs4 += this.questions[f].total_score;
                  } else if (
                    this.questions[f].secondary_ques_type ==
                    "根据一段长对话完成门诊病历记录"
                  ) {
                    wn += this.questions[f].sub_question.length;
                    ws += this.questions[f].total_score;
                  } else {
                    this.$message({
                      message: "出现不属于MCT模考卷的题型，请修改！",
                      type: "warning",
                    });
                    break;
                  }
                }
                if (
                  ln1 == 10 &&
                  ln2 == 10 &&
                  ln3 == 10 &&
                  ln4 == 20 &&
                  ls1 + ls2 + ls3 + ls4 == 100 &&
                  rn1 == 10 &&
                  rn2 == 10 &&
                  rn3 == 10 &&
                  rn4 == 20 &&
                  rs1 + rs2 + rs3 + rs4 == 100 &&
                  wn == 1 &&
                  ws == 100
                ) {
                  if (
                    this.questions[this.currentQues - 1].saveQ == true &&
                    this.title != ""
                  ) {
                    //试卷标题是否已存在
                    let findPaper = new BaaS.TableObject("test_paper");
                    let find_paper = new BaaS.Query();
                    find_paper.compare("paper_title", "=", this.title);
                    findPaper
                      .setQuery(find_paper)
                      .find()
                      .then((res0) => {
                        if (res0.data.objects.length != 0) {
                          this.$message({
                            message: "试卷标题已存在，请重新填写",
                            type: "warning",
                          });
                        } else {
                          let question_detail = new Array();
                          for (let i = 0; i < this.questions.length; i++) {
                            //找是否有已存在题干
                            let findContent = new BaaS.TableObject(
                              "question_content"
                            );
                            let find_content = new BaaS.Query();
                            find_content.compare(
                              "content",
                              "=",
                              this.questions[i].question_content
                            );
                            findContent
                              .setQuery(find_content)
                              .find()
                              .then(
                                (res1) => {
                                  if (res1.data.objects.length > 0) {
                                    //在数据库里找到该题干
                                    let contentId = res1.data.objects[0].id;
                                    for (
                                      let j = 0;
                                      j < this.questions[i].sub_question.length;
                                      j++
                                    ) {
                                      //题目是否存在
                                      let findQuestion = new BaaS.TableObject(
                                        "questions_information"
                                      );
                                      let question_content_id =
                                        new BaaS.Query();
                                      let primary_ques_type = new BaaS.Query();
                                      let secondary_ques_type =
                                        new BaaS.Query();
                                      let question = new BaaS.Query();
                                      let options = new BaaS.Query();
                                      let answer = new BaaS.Query();
                                      let analysis = new BaaS.Query();
                                      let grade_standard = new BaaS.Query();
                                      let topic_outline = new BaaS.Query();
                                      let department = new BaaS.Query();
                                      let task_outline = new BaaS.Query();
                                      let ques_level = new BaaS.Query();
                                      let question_class = new BaaS.Query();
                                      let question_type_5he = new BaaS.Query();
                                      let author = new BaaS.Query();
                                      let author_org = new BaaS.Query();
                                      let time_created = new BaaS.Query();
                                      question_content_id.compare(
                                        "question_content_id",
                                        "=",
                                        contentId
                                      );
                                      primary_ques_type.compare(
                                        "primary_ques_type",
                                        "=",
                                        this.questions[i].primary_ques_type
                                      );
                                      secondary_ques_type.compare(
                                        "secondary_ques_type",
                                        "=",
                                        this.questions[i].secondary_ques_type
                                      );
                                      if (
                                        this.questions[i].sub_question[j]
                                          .question != null
                                      ) {
                                        question.compare(
                                          "question",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .question
                                        );
                                      } else {
                                        question.isNull("question");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .options != null
                                      ) {
                                        options.compare(
                                          "options",
                                          "=",
                                          JSON.stringify(
                                            this.questions[i].sub_question[j]
                                              .options
                                          )
                                        );
                                      } else {
                                        options.isNull("options");
                                      }
                                      answer.compare(
                                        "answer",
                                        "=",
                                        this.questions[i].sub_question[j].answer
                                      );
                                      if (
                                        this.questions[i].sub_question[j]
                                          .analysis != null
                                      ) {
                                        analysis.compare(
                                          "analysis",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .analysis
                                        );
                                      } else {
                                        analysis.isNull("analysis");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .grade_value != null
                                      ) {
                                        grade_standard.compare(
                                          "grade_standard",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .grade_value
                                        );
                                      } else {
                                        grade_standard.isNull("grade_standard");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .topic_value != null
                                      ) {
                                        topic_outline.compare(
                                          "topic_outline",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .topic_value
                                        );
                                      } else {
                                        topic_outline.isNull("topic_outline");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .department_value != null
                                      ) {
                                        department.compare(
                                          "department",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .department_value
                                        );
                                      } else {
                                        department.isNull("department");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .task_value != null
                                      ) {
                                        task_outline.compare(
                                          "task_outline",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .task_value
                                        );
                                      } else {
                                        task_outline.isNull("task_outline");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .level_value != null
                                      ) {
                                        ques_level.compare(
                                          "ques_level",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .level_value
                                        );
                                      } else {
                                        ques_level.isNull("ques_level");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .qclass_value != null
                                      ) {
                                        question_class.compare(
                                          "question_class",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .qclass_value
                                        );
                                      } else {
                                        question_class.isNull("question_class");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .fivehe_value != null
                                      ) {
                                        question_type_5he.compare(
                                          "question_type_5he",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .fivehe_value
                                        );
                                      } else {
                                        question_type_5he.isNull(
                                          "question_type_5he"
                                        );
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .author != null
                                      ) {
                                        author.compare(
                                          "author",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .author
                                        );
                                      } else {
                                        author.isNull("author");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .author_org != null
                                      ) {
                                        author_org.compare(
                                          "author_org",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .author_org
                                        );
                                      } else {
                                        author_org.isNull("author_org");
                                      }
                                      if (
                                        this.questions[i].sub_question[j]
                                          .time_created != null
                                      ) {
                                        time_created.compare(
                                          "time_created",
                                          "=",
                                          this.questions[i].sub_question[j]
                                            .time_created
                                        );
                                      } else {
                                        time_created.isNull("time_created");
                                      }
                                      let andQuery = BaaS.Query.and(
                                        question_content_id,
                                        primary_ques_type,
                                        secondary_ques_type,
                                        question,
                                        options,
                                        answer,
                                        analysis,
                                        grade_standard,
                                        topic_outline,
                                        department,
                                        task_outline,
                                        ques_level,
                                        question_class,
                                        question_type_5he,
                                        author,
                                        author_org,
                                        time_created
                                      );
                                      findQuestion
                                        .setQuery(andQuery)
                                        .find()
                                        .then(
                                          (res2) => {
                                            if (res2.data.objects.length == 0) {
                                              //没找到存在的题目
                                              //存储题目
                                              let saveQuestion =
                                                new BaaS.TableObject(
                                                  "questions_information"
                                                );
                                              let save_question =
                                                saveQuestion.create();
                                              let temp1;
                                              if (
                                                (this.questions[i]
                                                  .primary_ques_type ==
                                                  "听力" &&
                                                  this.questions[i]
                                                    .secondary_ques_type ==
                                                    "听句子，判断对错") ||
                                                this.questions[i]
                                                  .primary_ques_type == "判断题"
                                              ) {
                                                temp1 = {
                                                  question_content_id:
                                                    contentId,
                                                  primary_ques_type:
                                                    this.questions[i]
                                                      .primary_ques_type,
                                                  secondary_ques_type:
                                                    this.questions[i]
                                                      .secondary_ques_type,
                                                  question:
                                                    this.questions[i]
                                                      .sub_question[j].question,
                                                  options: JSON.stringify(
                                                    this.questions[i]
                                                      .sub_question[j].options
                                                  ),
                                                  answer:
                                                    this.questions[i]
                                                      .sub_question[j].answer,
                                                  analysis:
                                                    this.questions[i]
                                                      .sub_question[j].analysis,
                                                  grade_standard:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .grade_value,
                                                  topic_outline:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .topic_value,
                                                  department:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .department_value,
                                                  task_outline:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .task_value,
                                                  ques_level:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .level_value,
                                                  question_class:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .qclass_value,
                                                  question_type_5he:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .fivehe_value,
                                                  // sub_sequence:
                                                  //   this.questions[i].sub_question[j]
                                                  //     .actual_sequence,
                                                  score:
                                                    this.questions[i]
                                                      .sub_question[j].score *
                                                    1,
                                                  author:
                                                    this.questions[i]
                                                      .sub_question[j].author,
                                                  author_org:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .author_org,
                                                  time_created:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .time_created,
                                                };
                                              } else if (
                                                (this.questions[i]
                                                  .primary_ques_type ==
                                                  "听力" &&
                                                  this.questions[i]
                                                    .secondary_ques_type !=
                                                    "听句子，判断对错") ||
                                                this.questions[i]
                                                  .primary_ques_type ==
                                                  "阅读" ||
                                                this.questions[i]
                                                  .primary_ques_type ==
                                                  "单选题" ||
                                                this.questions[i]
                                                  .primary_ques_type ==
                                                  "多选题" ||
                                                this.questions[i]
                                                  .primary_ques_type == "填空题"
                                              ) {
                                                temp1 = {
                                                  question_content_id:
                                                    contentId,
                                                  primary_ques_type:
                                                    this.questions[i]
                                                      .primary_ques_type,
                                                  secondary_ques_type:
                                                    this.questions[i]
                                                      .secondary_ques_type,
                                                  question:
                                                    this.questions[i]
                                                      .sub_question[j].question,
                                                  options: JSON.stringify(
                                                    this.questions[i]
                                                      .sub_question[j].options
                                                  ),
                                                  answer:
                                                    this.questions[i]
                                                      .sub_question[j].answer,
                                                  analysis:
                                                    this.questions[i]
                                                      .sub_question[j].analysis,
                                                  grade_standard:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .grade_value,
                                                  topic_outline:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .topic_value,
                                                  department:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .department_value,
                                                  task_outline:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .task_value,
                                                  ques_level:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .level_value,
                                                  question_class:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .qclass_value,
                                                  question_type_5he:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .fivehe_value,
                                                  author:
                                                    this.questions[i]
                                                      .sub_question[j].author,
                                                  author_org:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .author_org,
                                                  time_created:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .time_created,
                                                };
                                              } else if (
                                                this.questions[i]
                                                  .primary_ques_type ==
                                                  "写作" ||
                                                this.questions[i]
                                                  .primary_ques_type == "简答题"
                                              ) {
                                                temp1 = {
                                                  question_content_id:
                                                    contentId,
                                                  primary_ques_type:
                                                    this.questions[i]
                                                      .primary_ques_type,
                                                  secondary_ques_type:
                                                    this.questions[i]
                                                      .secondary_ques_type,
                                                  question:
                                                    this.questions[i]
                                                      .sub_question[j].question,
                                                  options: null,
                                                  answer:
                                                    this.questions[i]
                                                      .sub_question[j].answer,
                                                  analysis:
                                                    this.questions[i]
                                                      .sub_question[j].analysis,
                                                  grade_standard:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .grade_value,
                                                  topic_outline:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .topic_value,
                                                  department:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .department_value,
                                                  task_outline:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .task_value,
                                                  ques_level:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .level_value,
                                                  question_class:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .qclass_value,
                                                  question_type_5he:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .fivehe_value,
                                                  author:
                                                    this.questions[i]
                                                      .sub_question[j].author,
                                                  author_org:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .author_org,
                                                  time_created:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .time_created,
                                                };
                                              }
                                              save_question
                                                .set(temp1)
                                                .save()
                                                .then(
                                                  (res3) => {
                                                    let q = {
                                                      id: res3.data.id,
                                                      sub_sequence:
                                                        this.questions[i]
                                                          .sub_question[j]
                                                          .actual_sequence,
                                                      score:
                                                        this.questions[i]
                                                          .sub_question[j]
                                                          .score * 1,
                                                    };
                                                    question_detail.push(q);
                                                    if (
                                                      question_detail.length ==
                                                      this.ques_num
                                                    ) {
                                                      let savePaper =
                                                        new BaaS.TableObject(
                                                          "test_paper"
                                                        );
                                                      let save_paper =
                                                        savePaper.create();
                                                      let paper_type;
                                                      paper_type = "模考";
                                                      let p = {
                                                        paper_title: this.title,
                                                        paper_type: paper_type,
                                                        questions_num:
                                                          this.ques_num,
                                                        points: this.ques_score,
                                                        questions_detail:
                                                          JSON.stringify(
                                                            question_detail
                                                          ),
                                                        ques_type:
                                                          JSON.stringify(
                                                            this.ques_type
                                                          ),
                                                      };
                                                      save_paper
                                                        .set(p)
                                                        .save()
                                                        .then(
                                                          (res) => {
                                                            console.log(res);
                                                            this.$message({
                                                              message:
                                                                "保存成功",
                                                              type: "success",
                                                            });
                                                            Cookies.set(
                                                              "paperInfo",
                                                              res.data.id
                                                            );
                                                            this.back();
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
                                            } else {
                                              //找到了已存在的题目
                                              let q = {
                                                id: res2.data.objects[0].id,
                                                sub_sequence:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .actual_sequence,
                                                score:
                                                  this.questions[i]
                                                    .sub_question[j].score * 1,
                                              };
                                              question_detail.push(q);
                                              if (
                                                question_detail.length ==
                                                this.ques_num
                                              ) {
                                                let savePaper =
                                                  new BaaS.TableObject(
                                                    "test_paper"
                                                  );
                                                let save_paper =
                                                  savePaper.create();
                                                let paper_type;
                                                paper_type = "模考";
                                                let p = {
                                                  paper_title: this.title,
                                                  paper_type: paper_type,
                                                  questions_num: this.ques_num,
                                                  points: this.ques_score,
                                                  questions_detail:
                                                    JSON.stringify(
                                                      question_detail
                                                    ),
                                                  ques_type: JSON.stringify(
                                                    this.ques_type
                                                  ),
                                                };
                                                save_paper
                                                  .set(p)
                                                  .save()
                                                  .then(
                                                    (res) => {
                                                      console.log(res);
                                                      this.$message({
                                                        message: "保存成功",
                                                        type: "success",
                                                      });
                                                      Cookies.set(
                                                        "paperInfo",
                                                        res.data.id
                                                      );
                                                      this.back();
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
                                  } else {
                                    //数据库里没有该题干
                                    let saveContent = new BaaS.TableObject(
                                      "question_content"
                                    );
                                    let save_content = saveContent.create();
                                    let tempc = {
                                      content:
                                        this.questions[i].question_content,
                                      file_url: null,
                                      catalog: null,
                                    };
                                    save_content
                                      .set(tempc)
                                      .save()
                                      .then(
                                        (res4) => {
                                          for (
                                            let j = 0;
                                            j <
                                            this.questions[i].sub_question
                                              .length;
                                            j++
                                          ) {
                                            //查找知识点等
                                            let tempq;
                                            //存储题目
                                            let saveQuestion =
                                              new BaaS.TableObject(
                                                "questions_information"
                                              );
                                            let save_question =
                                              saveQuestion.create();
                                            if (
                                              (this.questions[i]
                                                .primary_ques_type == "听力" &&
                                                this.questions[i]
                                                  .secondary_ques_type ==
                                                  "听句子，判断对错") ||
                                              this.questions[i]
                                                .primary_ques_type == "判断题"
                                            ) {
                                              tempq = {
                                                question_content_id:
                                                  res4.data.id,
                                                primary_ques_type:
                                                  this.questions[i]
                                                    .primary_ques_type,
                                                secondary_ques_type:
                                                  this.questions[i]
                                                    .secondary_ques_type,
                                                question:
                                                  this.questions[i]
                                                    .sub_question[j].question,
                                                options: JSON.stringify(
                                                  this.questions[i]
                                                    .sub_question[j].options
                                                ),
                                                answer:
                                                  this.questions[i]
                                                    .sub_question[j].answer,
                                                analysis:
                                                  this.questions[i]
                                                    .sub_question[j].analysis,
                                                grade_standard:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .grade_value,
                                                topic_outline:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .topic_value,
                                                department:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .department_value,
                                                task_outline:
                                                  this.questions[i]
                                                    .sub_question[j].task_value,
                                                ques_level:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .level_value,
                                                question_class:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .qclass_value,
                                                question_type_5he:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .fivehe_value,
                                                author:
                                                  this.questions[i]
                                                    .sub_question[j].author,
                                                author_org:
                                                  this.questions[i]
                                                    .sub_question[j].author_org,
                                                time_created:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .time_created,
                                              };
                                            } else if (
                                              (this.questions[i]
                                                .primary_ques_type == "听力" &&
                                                this.questions[i]
                                                  .secondary_ques_type !=
                                                  "听句子，判断对错") ||
                                              this.questions[i]
                                                .primary_ques_type == "阅读" ||
                                              this.questions[i]
                                                .primary_ques_type ==
                                                "单选题" ||
                                              this.questions[i]
                                                .primary_ques_type ==
                                                "多选题" ||
                                              this.questions[i]
                                                .primary_ques_type == "填空题"
                                            ) {
                                              tempq = {
                                                question_content_id:
                                                  res4.data.id,
                                                primary_ques_type:
                                                  this.questions[i]
                                                    .primary_ques_type,
                                                secondary_ques_type:
                                                  this.questions[i]
                                                    .secondary_ques_type,
                                                question:
                                                  this.questions[i]
                                                    .sub_question[j].question,
                                                options: JSON.stringify(
                                                  this.questions[i]
                                                    .sub_question[j].options
                                                ),
                                                answer:
                                                  this.questions[i]
                                                    .sub_question[j].answer,
                                                analysis:
                                                  this.questions[i]
                                                    .sub_question[j].analysis,
                                                grade_standard:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .grade_value,
                                                topic_outline:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .topic_value,
                                                department:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .department_value,
                                                task_outline:
                                                  this.questions[i]
                                                    .sub_question[j].task_value,
                                                ques_level:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .level_value,
                                                question_class:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .qclass_value,
                                                question_type_5he:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .fivehe_value,
                                                author:
                                                  this.questions[i]
                                                    .sub_question[j].author,
                                                author_org:
                                                  this.questions[i]
                                                    .sub_question[j].author_org,
                                                time_created:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .time_created,
                                              };
                                            } else if (
                                              this.questions[i]
                                                .primary_ques_type == "写作" ||
                                              this.questions[i]
                                                .primary_ques_type == "简答题"
                                            ) {
                                              tempq = {
                                                question_content_id:
                                                  res4.data.id,
                                                primary_ques_type:
                                                  this.questions[i]
                                                    .primary_ques_type,
                                                secondary_ques_type:
                                                  this.questions[i]
                                                    .secondary_ques_type,
                                                question:
                                                  this.questions[i]
                                                    .sub_question[j].question,
                                                options: null,
                                                answer:
                                                  this.questions[i]
                                                    .sub_question[j].answer,
                                                analysis:
                                                  this.questions[i]
                                                    .sub_question[j].analysis,
                                                grade_standard:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .grade_value,
                                                topic_outline:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .topic_value,
                                                department:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .department_value,
                                                task_outline:
                                                  this.questions[i]
                                                    .sub_question[j].task_value,
                                                ques_level:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .level_value,
                                                question_class:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .qclass_value,
                                                question_type_5he:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .fivehe_value,
                                                author:
                                                  this.questions[i]
                                                    .sub_question[j].author,
                                                author_org:
                                                  this.questions[i]
                                                    .sub_question[j].author_org,
                                                time_created:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .time_created,
                                              };
                                            }
                                            save_question
                                              .set(tempq)
                                              .save()
                                              .then(
                                                (res) => {
                                                  let q = {
                                                    id: res.data.id,
                                                    sub_sequence:
                                                      this.questions[i]
                                                        .sub_question[j]
                                                        .actual_sequence,
                                                    score:
                                                      this.questions[i]
                                                        .sub_question[j].score *
                                                      1,
                                                  };
                                                  question_detail.push(q);
                                                  if (
                                                    question_detail.length ==
                                                    this.ques_num
                                                  ) {
                                                    let savePaper =
                                                      new BaaS.TableObject(
                                                        "test_paper"
                                                      );
                                                    let save_paper =
                                                      savePaper.create();
                                                    let paper_type;
                                                    paper_type = "模考";
                                                    let p = {
                                                      paper_title: this.title,
                                                      paper_type: paper_type,
                                                      questions_num:
                                                        this.ques_num,
                                                      points: this.ques_score,
                                                      questions_detail:
                                                        JSON.stringify(
                                                          question_detail
                                                        ),
                                                      ques_type: JSON.stringify(
                                                        this.ques_type
                                                      ),
                                                    };
                                                    save_paper
                                                      .set(p)
                                                      .save()
                                                      .then(
                                                        (res) => {
                                                          console.log(res);
                                                          this.$message({
                                                            message: "保存成功",
                                                            type: "success",
                                                          });
                                                          Cookies.set(
                                                            "paperInfo",
                                                            res.data.id
                                                          );
                                                          this.back();
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
                        }
                      });
                  }
                } else {
                  this.$message({
                    message: "不符合模考卷题量和分数，请修改！",
                    type: "warning",
                  });
                }
              } else {
                this.$message({
                  message: "MCT模考卷题量为101题，总分为300分，请修改！",
                  type: "warning",
                });
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        if (this.exam == false) {
          if (
            this.questions[this.currentQues - 1].saveQ == true &&
            this.title != ""
          ) {
            //试卷标题是否已存在
            let findPaper = new BaaS.TableObject("test_paper");
            let find_paper = new BaaS.Query();
            find_paper.compare("paper_title", "=", this.title);
            findPaper
              .setQuery(find_paper)
              .find()
              .then((res0) => {
                if (res0.data.objects.length != 0) {
                  this.$message({
                    message: "试卷标题已存在，请重新填写",
                    type: "warning",
                  });
                } else {
                  let question_detail = new Array();
                  for (let i = 0; i < this.questions.length; i++) {
                    //找是否有已存在题干
                    let findContent = new BaaS.TableObject("question_content");
                    let find_content = new BaaS.Query();
                    find_content.compare(
                      "content",
                      "=",
                      this.questions[i].question_content
                    );
                    findContent
                      .setQuery(find_content)
                      .find()
                      .then(
                        (res1) => {
                          if (res1.data.objects.length > 0) {
                            //在数据库里找到该题干
                            let contentId = res1.data.objects[0].id;
                            for (
                              let j = 0;
                              j < this.questions[i].sub_question.length;
                              j++
                            ) {
                              //题目是否存在
                              let findQuestion = new BaaS.TableObject(
                                "questions_information"
                              );
                              let question_content_id = new BaaS.Query();
                              let primary_ques_type = new BaaS.Query();
                              let secondary_ques_type = new BaaS.Query();
                              let question = new BaaS.Query();
                              let options = new BaaS.Query();
                              let answer = new BaaS.Query();
                              let analysis = new BaaS.Query();
                              let grade_standard = new BaaS.Query();
                              let topic_outline = new BaaS.Query();
                              let department = new BaaS.Query();
                              let task_outline = new BaaS.Query();
                              let ques_level = new BaaS.Query();
                              let question_class = new BaaS.Query();
                              let question_type_5he = new BaaS.Query();
                              let author = new BaaS.Query();
                              let author_org = new BaaS.Query();
                              let time_created = new BaaS.Query();
                              question_content_id.compare(
                                "question_content_id",
                                "=",
                                contentId
                              );
                              primary_ques_type.compare(
                                "primary_ques_type",
                                "=",
                                this.questions[i].primary_ques_type
                              );
                              secondary_ques_type.compare(
                                "secondary_ques_type",
                                "=",
                                this.questions[i].secondary_ques_type
                              );
                              if (
                                this.questions[i].sub_question[j].question !=
                                null
                              ) {
                                question.compare(
                                  "question",
                                  "=",
                                  this.questions[i].sub_question[j].question
                                );
                              } else {
                                question.isNull("question");
                              }
                              if (
                                this.questions[i].sub_question[j].options !=
                                null
                              ) {
                                options.compare(
                                  "options",
                                  "=",
                                  JSON.stringify(
                                    this.questions[i].sub_question[j].options
                                  )
                                );
                              } else {
                                options.isNull("options");
                              }
                              answer.compare(
                                "answer",
                                "=",
                                this.questions[i].sub_question[j].answer
                              );
                              if (
                                this.questions[i].sub_question[j].analysis !=
                                null
                              ) {
                                analysis.compare(
                                  "analysis",
                                  "=",
                                  this.questions[i].sub_question[j].analysis
                                );
                              } else {
                                analysis.isNull("analysis");
                              }
                              if (
                                this.questions[i].sub_question[j].grade_value !=
                                null
                              ) {
                                grade_standard.compare(
                                  "grade_standard",
                                  "=",
                                  this.questions[i].sub_question[j].grade_value
                                );
                              } else {
                                grade_standard.isNull("grade_standard");
                              }
                              if (
                                this.questions[i].sub_question[j].topic_value !=
                                null
                              ) {
                                topic_outline.compare(
                                  "topic_outline",
                                  "=",
                                  this.questions[i].sub_question[j].topic_value
                                );
                              } else {
                                topic_outline.isNull("topic_outline");
                              }
                              if (
                                this.questions[i].sub_question[j]
                                  .department_value != null
                              ) {
                                department.compare(
                                  "department",
                                  "=",
                                  this.questions[i].sub_question[j]
                                    .department_value
                                );
                              } else {
                                department.isNull("department");
                              }
                              if (
                                this.questions[i].sub_question[j].task_value !=
                                null
                              ) {
                                task_outline.compare(
                                  "task_outline",
                                  "=",
                                  this.questions[i].sub_question[j].task_value
                                );
                              } else {
                                task_outline.isNull("task_outline");
                              }
                              if (
                                this.questions[i].sub_question[j].level_value !=
                                null
                              ) {
                                ques_level.compare(
                                  "ques_level",
                                  "=",
                                  this.questions[i].sub_question[j].level_value
                                );
                              } else {
                                ques_level.isNull("ques_level");
                              }
                              if (
                                this.questions[i].sub_question[j]
                                  .qclass_value != null
                              ) {
                                question_class.compare(
                                  "question_class",
                                  "=",
                                  this.questions[i].sub_question[j].qclass_value
                                );
                              } else {
                                question_class.isNull("question_class");
                              }
                              if (
                                this.questions[i].sub_question[j]
                                  .fivehe_value != null
                              ) {
                                question_type_5he.compare(
                                  "question_type_5he",
                                  "=",
                                  this.questions[i].sub_question[j].fivehe_value
                                );
                              } else {
                                question_type_5he.isNull("question_type_5he");
                              }
                              if (
                                this.questions[i].sub_question[j].author != null
                              ) {
                                author.compare(
                                  "author",
                                  "=",
                                  this.questions[i].sub_question[j].author
                                );
                              } else {
                                author.isNull("author");
                              }
                              if (
                                this.questions[i].sub_question[j].author_org !=
                                null
                              ) {
                                author_org.compare(
                                  "author_org",
                                  "=",
                                  this.questions[i].sub_question[j].author_org
                                );
                              } else {
                                author_org.isNull("author_org");
                              }
                              if (
                                this.questions[i].sub_question[j]
                                  .time_created != null
                              ) {
                                time_created.compare(
                                  "time_created",
                                  "=",
                                  this.questions[i].sub_question[j].time_created
                                );
                              } else {
                                time_created.isNull("time_created");
                              }
                              let andQuery = BaaS.Query.and(
                                question_content_id,
                                primary_ques_type,
                                secondary_ques_type,
                                question,
                                options,
                                answer,
                                analysis,
                                grade_standard,
                                topic_outline,
                                department,
                                task_outline,
                                ques_level,
                                question_class,
                                question_type_5he,
                                author,
                                author_org,
                                time_created
                              );
                              findQuestion
                                .setQuery(andQuery)
                                .find()
                                .then(
                                  (res2) => {
                                    if (res2.data.objects.length == 0) {
                                      //没找到存在的题目
                                      //存储题目
                                      let saveQuestion = new BaaS.TableObject(
                                        "questions_information"
                                      );
                                      let save_question = saveQuestion.create();
                                      let temp1;
                                      if (
                                        (this.questions[i].primary_ques_type ==
                                          "听力" &&
                                          this.questions[i]
                                            .secondary_ques_type ==
                                            "听句子，判断对错") ||
                                        this.questions[i].primary_ques_type ==
                                          "判断题"
                                      ) {
                                        temp1 = {
                                          question_content_id: contentId,
                                          primary_ques_type:
                                            this.questions[i].primary_ques_type,
                                          secondary_ques_type:
                                            this.questions[i]
                                              .secondary_ques_type,
                                          question:
                                            this.questions[i].sub_question[j]
                                              .question,
                                          options: JSON.stringify(
                                            this.questions[i].sub_question[j]
                                              .options
                                          ),
                                          answer:
                                            this.questions[i].sub_question[j]
                                              .answer,
                                          analysis:
                                            this.questions[i].sub_question[j]
                                              .analysis,
                                          grade_standard:
                                            this.questions[i].sub_question[j]
                                              .grade_value,
                                          topic_outline:
                                            this.questions[i].sub_question[j]
                                              .topic_value,
                                          department:
                                            this.questions[i].sub_question[j]
                                              .department_value,
                                          task_outline:
                                            this.questions[i].sub_question[j]
                                              .task_value,
                                          ques_level:
                                            this.questions[i].sub_question[j]
                                              .level_value,
                                          question_class:
                                            this.questions[i].sub_question[j]
                                              .qclass_value,
                                          question_type_5he:
                                            this.questions[i].sub_question[j]
                                              .fivehe_value,
                                          // sub_sequence:
                                          //   this.questions[i].sub_question[j]
                                          //     .actual_sequence,
                                          score:
                                            this.questions[i].sub_question[j]
                                              .score * 1,
                                          author:
                                            this.questions[i].sub_question[j]
                                              .author,
                                          author_org:
                                            this.questions[i].sub_question[j]
                                              .author_org,
                                          time_created:
                                            this.questions[i].sub_question[j]
                                              .time_created,
                                        };
                                      } else if (
                                        (this.questions[i].primary_ques_type ==
                                          "听力" &&
                                          this.questions[i]
                                            .secondary_ques_type !=
                                            "听句子，判断对错") ||
                                        this.questions[i].primary_ques_type ==
                                          "阅读" ||
                                        this.questions[i].primary_ques_type ==
                                          "单选题" ||
                                        this.questions[i].primary_ques_type ==
                                          "多选题" ||
                                        this.questions[i].primary_ques_type ==
                                          "填空题"
                                      ) {
                                        temp1 = {
                                          question_content_id: contentId,
                                          primary_ques_type:
                                            this.questions[i].primary_ques_type,
                                          secondary_ques_type:
                                            this.questions[i]
                                              .secondary_ques_type,
                                          question:
                                            this.questions[i].sub_question[j]
                                              .question,
                                          options: JSON.stringify(
                                            this.questions[i].sub_question[j]
                                              .options
                                          ),
                                          answer:
                                            this.questions[i].sub_question[j]
                                              .answer,
                                          analysis:
                                            this.questions[i].sub_question[j]
                                              .analysis,
                                          grade_standard:
                                            this.questions[i].sub_question[j]
                                              .grade_value,
                                          topic_outline:
                                            this.questions[i].sub_question[j]
                                              .topic_value,
                                          department:
                                            this.questions[i].sub_question[j]
                                              .department_value,
                                          task_outline:
                                            this.questions[i].sub_question[j]
                                              .task_value,
                                          ques_level:
                                            this.questions[i].sub_question[j]
                                              .level_value,
                                          question_class:
                                            this.questions[i].sub_question[j]
                                              .qclass_value,
                                          question_type_5he:
                                            this.questions[i].sub_question[j]
                                              .fivehe_value,
                                          author:
                                            this.questions[i].sub_question[j]
                                              .author,
                                          author_org:
                                            this.questions[i].sub_question[j]
                                              .author_org,
                                          time_created:
                                            this.questions[i].sub_question[j]
                                              .time_created,
                                        };
                                      } else if (
                                        this.questions[i].primary_ques_type ==
                                          "写作" ||
                                        this.questions[i].primary_ques_type ==
                                          "简答题"
                                      ) {
                                        temp1 = {
                                          question_content_id: contentId,
                                          primary_ques_type:
                                            this.questions[i].primary_ques_type,
                                          secondary_ques_type:
                                            this.questions[i]
                                              .secondary_ques_type,
                                          question:
                                            this.questions[i].sub_question[j]
                                              .question,
                                          options: null,
                                          answer:
                                            this.questions[i].sub_question[j]
                                              .answer,
                                          analysis:
                                            this.questions[i].sub_question[j]
                                              .analysis,
                                          grade_standard:
                                            this.questions[i].sub_question[j]
                                              .grade_value,
                                          topic_outline:
                                            this.questions[i].sub_question[j]
                                              .topic_value,
                                          department:
                                            this.questions[i].sub_question[j]
                                              .department_value,
                                          task_outline:
                                            this.questions[i].sub_question[j]
                                              .task_value,
                                          ques_level:
                                            this.questions[i].sub_question[j]
                                              .level_value,
                                          question_class:
                                            this.questions[i].sub_question[j]
                                              .qclass_value,
                                          question_type_5he:
                                            this.questions[i].sub_question[j]
                                              .fivehe_value,
                                          author:
                                            this.questions[i].sub_question[j]
                                              .author,
                                          author_org:
                                            this.questions[i].sub_question[j]
                                              .author_org,
                                          time_created:
                                            this.questions[i].sub_question[j]
                                              .time_created,
                                        };
                                      }
                                      save_question
                                        .set(temp1)
                                        .save()
                                        .then(
                                          (res3) => {
                                            let q = {
                                              id: res3.data.id,
                                              sub_sequence:
                                                this.questions[i].sub_question[
                                                  j
                                                ].actual_sequence,
                                              score:
                                                this.questions[i].sub_question[
                                                  j
                                                ].score * 1,
                                            };
                                            question_detail.push(q);
                                            if (
                                              question_detail.length ==
                                              this.ques_num
                                            ) {
                                              let savePaper =
                                                new BaaS.TableObject(
                                                  "test_paper"
                                                );
                                              let save_paper =
                                                savePaper.create();
                                              let paper_type;
                                              paper_type = "练习";
                                              let p = {
                                                paper_title: this.title,
                                                paper_type: paper_type,
                                                questions_num: this.ques_num,
                                                points: this.ques_score,
                                                questions_detail:
                                                  JSON.stringify(
                                                    question_detail
                                                  ),
                                                ques_type: JSON.stringify(
                                                  this.ques_type
                                                ),
                                              };
                                              save_paper
                                                .set(p)
                                                .save()
                                                .then(
                                                  (res) => {
                                                    console.log(res);
                                                    this.$message({
                                                      message: "保存成功",
                                                      type: "success",
                                                    });
                                                    Cookies.set(
                                                      "paperInfo",
                                                      res.data.id
                                                    );
                                                    this.back();
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
                                    } else {
                                      //找到了已存在的题目
                                      let q = {
                                        id: res2.data.objects[0].id,
                                        sub_sequence:
                                          this.questions[i].sub_question[j]
                                            .actual_sequence,
                                        score:
                                          this.questions[i].sub_question[j]
                                            .score * 1,
                                      };
                                      question_detail.push(q);
                                      if (
                                        question_detail.length == this.ques_num
                                      ) {
                                        let savePaper = new BaaS.TableObject(
                                          "test_paper"
                                        );
                                        let save_paper = savePaper.create();
                                        let paper_type;
                                        paper_type = "练习";
                                        let p = {
                                          paper_title: this.title,
                                          paper_type: paper_type,
                                          questions_num: this.ques_num,
                                          points: this.ques_score,
                                          questions_detail:
                                            JSON.stringify(question_detail),
                                          ques_type: JSON.stringify(
                                            this.ques_type
                                          ),
                                        };
                                        save_paper
                                          .set(p)
                                          .save()
                                          .then(
                                            (res) => {
                                              console.log(res);
                                              this.$message({
                                                message: "保存成功",
                                                type: "success",
                                              });
                                              Cookies.set(
                                                "paperInfo",
                                                res.data.id
                                              );
                                              this.back();
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
                          } else {
                            //数据库里没有该题干
                            let saveContent = new BaaS.TableObject(
                              "question_content"
                            );
                            let save_content = saveContent.create();
                            let tempc = {
                              content: this.questions[i].question_content,
                              file_url: null,
                              catalog: null,
                            };
                            save_content
                              .set(tempc)
                              .save()
                              .then(
                                (res4) => {
                                  for (
                                    let j = 0;
                                    j < this.questions[i].sub_question.length;
                                    j++
                                  ) {
                                    let tempq;
                                    //存储题目
                                    let saveQuestion = new BaaS.TableObject(
                                      "questions_information"
                                    );
                                    let save_question = saveQuestion.create();
                                    if (
                                      (this.questions[i].primary_ques_type ==
                                        "听力" &&
                                        this.questions[i].secondary_ques_type ==
                                          "听句子，判断对错") ||
                                      this.questions[i].primary_ques_type ==
                                        "判断题"
                                    ) {
                                      tempq = {
                                        question_content_id: res4.data.id,
                                        primary_ques_type:
                                          this.questions[i].primary_ques_type,
                                        secondary_ques_type:
                                          this.questions[i].secondary_ques_type,
                                        question:
                                          this.questions[i].sub_question[j]
                                            .question,
                                        options: JSON.stringify(
                                          this.questions[i].sub_question[j]
                                            .options
                                        ),
                                        answer:
                                          this.questions[i].sub_question[j]
                                            .answer,
                                        analysis:
                                          this.questions[i].sub_question[j]
                                            .analysis,
                                        grade_standard:
                                          this.questions[i].sub_question[j]
                                            .grade_value,
                                        topic_outline:
                                          this.questions[i].sub_question[j]
                                            .topic_value,
                                        department:
                                          this.questions[i].sub_question[j]
                                            .department_value,
                                        task_outline:
                                          this.questions[i].sub_question[j]
                                            .task_value,
                                        ques_level:
                                          this.questions[i].sub_question[j]
                                            .level_value,
                                        question_class:
                                          this.questions[i].sub_question[j]
                                            .qclass_value,
                                        question_type_5he:
                                          this.questions[i].sub_question[j]
                                            .fivehe_value,
                                        author:
                                          this.questions[i].sub_question[j]
                                            .author,
                                        author_org:
                                          this.questions[i].sub_question[j]
                                            .author_org,
                                        time_created:
                                          this.questions[i].sub_question[j]
                                            .time_created,
                                      };
                                    } else if (
                                      (this.questions[i].primary_ques_type ==
                                        "听力" &&
                                        this.questions[i].secondary_ques_type !=
                                          "听句子，判断对错") ||
                                      this.questions[i].primary_ques_type ==
                                        "阅读" ||
                                      this.questions[i].primary_ques_type ==
                                        "单选题" ||
                                      this.questions[i].primary_ques_type ==
                                        "多选题" ||
                                      this.questions[i].primary_ques_type ==
                                        "填空题"
                                    ) {
                                      tempq = {
                                        question_content_id: res4.data.id,
                                        primary_ques_type:
                                          this.questions[i].primary_ques_type,
                                        secondary_ques_type:
                                          this.questions[i].secondary_ques_type,
                                        question:
                                          this.questions[i].sub_question[j]
                                            .question,
                                        options: JSON.stringify(
                                          this.questions[i].sub_question[j]
                                            .options
                                        ),
                                        answer:
                                          this.questions[i].sub_question[j]
                                            .answer,
                                        analysis:
                                          this.questions[i].sub_question[j]
                                            .analysis,
                                        grade_standard:
                                          this.questions[i].sub_question[j]
                                            .grade_value,
                                        topic_outline:
                                          this.questions[i].sub_question[j]
                                            .topic_value,
                                        department:
                                          this.questions[i].sub_question[j]
                                            .department_value,
                                        task_outline:
                                          this.questions[i].sub_question[j]
                                            .task_value,
                                        ques_level:
                                          this.questions[i].sub_question[j]
                                            .level_value,
                                        question_class:
                                          this.questions[i].sub_question[j]
                                            .qclass_value,
                                        question_type_5he:
                                          this.questions[i].sub_question[j]
                                            .fivehe_value,
                                        author:
                                          this.questions[i].sub_question[j]
                                            .author,
                                        author_org:
                                          this.questions[i].sub_question[j]
                                            .author_org,
                                        time_created:
                                          this.questions[i].sub_question[j]
                                            .time_created,
                                      };
                                    } else if (
                                      this.questions[i].primary_ques_type ==
                                        "写作" ||
                                      this.questions[i].primary_ques_type ==
                                        "简答题"
                                    ) {
                                      tempq = {
                                        question_content_id: res4.data.id,
                                        primary_ques_type:
                                          this.questions[i].primary_ques_type,
                                        secondary_ques_type:
                                          this.questions[i].secondary_ques_type,
                                        question:
                                          this.questions[i].sub_question[j]
                                            .question,
                                        options: null,
                                        answer:
                                          this.questions[i].sub_question[j]
                                            .answer,
                                        analysis:
                                          this.questions[i].sub_question[j]
                                            .analysis,
                                        grade_standard:
                                          this.questions[i].sub_question[j]
                                            .grade_value,
                                        topic_outline:
                                          this.questions[i].sub_question[j]
                                            .topic_value,
                                        department:
                                          this.questions[i].sub_question[j]
                                            .department_value,
                                        task_outline:
                                          this.questions[i].sub_question[j]
                                            .task_value,
                                        ques_level:
                                          this.questions[i].sub_question[j]
                                            .level_value,
                                        question_class:
                                          this.questions[i].sub_question[j]
                                            .qclass_value,
                                        question_type_5he:
                                          this.questions[i].sub_question[j]
                                            .fivehe_value,
                                        author:
                                          this.questions[i].sub_question[j]
                                            .author,
                                        author_org:
                                          this.questions[i].sub_question[j]
                                            .author_org,
                                        time_created:
                                          this.questions[i].sub_question[j]
                                            .time_created,
                                      };
                                    }
                                    save_question
                                      .set(tempq)
                                      .save()
                                      .then(
                                        (res) => {
                                          let q = {
                                            id: res.data.id,
                                            sub_sequence:
                                              this.questions[i].sub_question[j]
                                                .actual_sequence,
                                            score:
                                              this.questions[i].sub_question[j]
                                                .score * 1,
                                          };
                                          question_detail.push(q);
                                          if (
                                            question_detail.length ==
                                            this.ques_num
                                          ) {
                                            let savePaper =
                                              new BaaS.TableObject(
                                                "test_paper"
                                              );
                                            let save_paper = savePaper.create();
                                            let paper_type;
                                            paper_type = "练习";
                                            let p = {
                                              paper_title: this.title,
                                              paper_type: paper_type,
                                              questions_num: this.ques_num,
                                              points: this.ques_score,
                                              questions_detail:
                                                JSON.stringify(question_detail),
                                              ques_type: JSON.stringify(
                                                this.ques_type
                                              ),
                                            };
                                            save_paper
                                              .set(p)
                                              .save()
                                              .then(
                                                (res) => {
                                                  console.log(res);
                                                  this.$message({
                                                    message: "保存成功",
                                                    type: "success",
                                                  });
                                                  Cookies.set(
                                                    "paperInfo",
                                                    res.data.id
                                                  );
                                                  this.back();
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
                }
              });
          }
        } else {
          //模考卷
          if (this.ques_num == 101 && this.ques_score == 300) {
            let ln1 = 0,
              ls1 = 0,
              ln2 = 0,
              ls2 = 0,
              ln3 = 0,
              ls3 = 0,
              ln4 = 0,
              ls4 = 0,
              rn1 = 0,
              rs1 = 0,
              rn2 = 0,
              rs2 = 0,
              rn3 = 0,
              rs3 = 0,
              rn4 = 0,
              rs4 = 0,
              wn = 0,
              ws = 0;
            for (let f = 0; f < this.questions.length; f++) {
              if (this.questions[f].secondary_ques_type == "听句子，判断对错") {
                ln1 += this.questions[f].sub_question.length;
                ls1 += this.questions[f].total_score;
              } else if (
                this.questions[f].secondary_ques_type ==
                "听短对话，选择正确答案"
              ) {
                ln2 += this.questions[f].sub_question.length;
                ls2 += this.questions[f].total_score;
              } else if (
                this.questions[f].secondary_ques_type ==
                "听长对话，选择正确答案"
              ) {
                ln3 += this.questions[f].sub_question.length;
                ls3 += this.questions[f].total_score;
              } else if (
                this.questions[f].secondary_ques_type == "听短文，选择正确答案"
              ) {
                ln4 += this.questions[f].sub_question.length;
                ls4 += this.questions[f].total_score;
              } else if (
                this.questions[f].secondary_ques_type == "选择正确的词语填空"
              ) {
                rn1 += this.questions[f].sub_question.length;
                rs1 += this.questions[f].total_score;
              } else if (
                this.questions[f].secondary_ques_type ==
                "阅读语段，选择与语段意思一致的一项"
              ) {
                rn2 += this.questions[f].sub_question.length;
                rs2 += this.questions[f].total_score;
              } else if (
                this.questions[f].secondary_ques_type ==
                "阅读材料，选择正确答案"
              ) {
                rn3 += this.questions[f].sub_question.length;
                rs3 += this.questions[f].total_score;
              } else if (
                this.questions[f].secondary_ques_type ==
                "阅读短文，选出正确答案"
              ) {
                rn4 += this.questions[f].sub_question.length;
                rs4 += this.questions[f].total_score;
              } else if (
                this.questions[f].secondary_ques_type ==
                "根据一段长对话完成门诊病历记录"
              ) {
                wn += this.questions[f].sub_question.length;
                ws += this.questions[f].total_score;
              } else {
                this.$message({
                  message: "出现不属于MCT模考卷的题型，请修改！",
                  type: "warning",
                });
                break;
              }
            }
            if (
              ln1 == 10 &&
              ln2 == 10 &&
              ln3 == 10 &&
              ln4 == 20 &&
              ls1 + ls2 + ls3 + ls4 == 100 &&
              rn1 == 10 &&
              rn2 == 10 &&
              rn3 == 10 &&
              rn4 == 20 &&
              rs1 + rs2 + rs3 + rs4 == 100 &&
              wn == 1 &&
              ws == 100
            ) {
              if (
                this.questions[this.currentQues - 1].saveQ == true &&
                this.title != ""
              ) {
                //试卷标题是否已存在
                let findPaper = new BaaS.TableObject("test_paper");
                let find_paper = new BaaS.Query();
                find_paper.compare("paper_title", "=", this.title);
                findPaper
                  .setQuery(find_paper)
                  .find()
                  .then((res0) => {
                    if (res0.data.objects.length != 0) {
                      this.$message({
                        message: "试卷标题已存在，请重新填写",
                        type: "warning",
                      });
                    } else {
                      let tempQues = this.questions;
                      this.questions = [];
                      let tempType = this.ques_type;
                      this.ques_type = [];
                      let seq = [
                        "听句子，判断对错",
                        "听短对话，选择正确答案",
                        "听长对话，选择正确答案",
                        "听短文，选择正确答案",
                        "选择正确的词语填空",
                        "阅读语段，选择与语段意思一致的一项",
                        "阅读材料，选择正确答案",
                        "阅读短文，选择正确答案",
                        "根据一段长对话写门诊病历记录",
                      ];
                      for (let i = 0; i < seq.length; i++) {
                        for (let j = 0; j < tempQues.length; j++) {
                          if (seq[i] == tempQues[j].secondary_ques_type) {
                            this.questions.push(tempQues[j]);
                          }
                        }
                      }
                      let tseq = [
                        {
                          p: "听力",
                          s: [
                            "听句子，判断对错",
                            "听短对话，选择正确答案",
                            "听长对话，选择正确答案",
                            "听短文，选择正确答案",
                          ],
                        },
                        {
                          p: "阅读",
                          s: [
                            "选择正确的词语填空",
                            "阅读语段，选择与语段意思一致的一项",
                            "阅读材料，选择正确答案",
                            "阅读短文，选择正确答案",
                          ],
                        },
                        {
                          p: "写作",
                          s: ["根据一段长对话写门诊病历记录"],
                        },
                      ];
                      for (let i = 0; i < tseq.length; i++) {
                        for (let j = 0; j < tempType.length; j++) {
                          if (tseq[i].p == tempType[j].primary) {
                            let t = tempType[j].secondary;
                            tempType[j].secondary = [];
                            for (let k = 0; k < tseq[i].s.length; k++) {
                              for (let n = 0; n < t.length; n++) {
                                if (tseq[i].s[k] == t[n].type) {
                                  tempType[j].secondary.push(t[n]);
                                }
                              }
                            }
                            this.ques_type.push(tempType[j]);
                          }
                        }
                      }
                      let num = 1;
                      for (let i = 0; i < this.questions.length; i++) {
                        this.questions[i].sequence = i + 1;
                        this.questions[i].name =
                          this.questions[i].sequence.toString();
                        for (
                          let j = 0;
                          j < this.questions[i].sub_question.length;
                          j++
                        ) {
                          this.questions[i].sub_question[j].sub_sequence =
                            j + 1;
                          this.questions[i].sub_question[j].actual_sequence =
                            num;
                          num++;
                        }
                      }
                      this.ques_type[0].secondary[0].start = 0;
                      for (let i = 0; i < this.ques_type.length; i++) {
                        for (
                          let j = 0;
                          j < this.ques_type[i].secondary.length;
                          j++
                        ) {
                          for (let k = this.questions.length - 1; k >= 0; k--) {
                            if (
                              this.ques_type[i].secondary[j].type ==
                              this.questions[k].secondary_ques_type
                            ) {
                              this.ques_type[i].secondary[j].end = k;
                              if (j != this.ques_type[i].secondary.length - 1) {
                                this.ques_type[i].secondary[j + 1].start =
                                  k + 1;
                              } else {
                                if (i != this.ques_type.length - 1) {
                                  this.ques_type[i + 1].secondary[0].start =
                                    k + 1;
                                }
                              }
                              break;
                            }
                          }
                        }
                      }
                      let question_detail = new Array();
                      for (let i = 0; i < this.questions.length; i++) {
                        //找是否有已存在题干
                        let findContent = new BaaS.TableObject(
                          "question_content"
                        );
                        let find_content = new BaaS.Query();
                        find_content.compare(
                          "content",
                          "=",
                          this.questions[i].question_content
                        );
                        findContent
                          .setQuery(find_content)
                          .find()
                          .then(
                            (res1) => {
                              if (res1.data.objects.length > 0) {
                                //在数据库里找到该题干
                                let contentId = res1.data.objects[0].id;
                                for (
                                  let j = 0;
                                  j < this.questions[i].sub_question.length;
                                  j++
                                ) {
                                  //题目是否存在
                                  let findQuestion = new BaaS.TableObject(
                                    "questions_information"
                                  );
                                  let question_content_id = new BaaS.Query();
                                  let primary_ques_type = new BaaS.Query();
                                  let secondary_ques_type = new BaaS.Query();
                                  let question = new BaaS.Query();
                                  let options = new BaaS.Query();
                                  let answer = new BaaS.Query();
                                  let analysis = new BaaS.Query();
                                  let grade_standard = new BaaS.Query();
                                  let topic_outline = new BaaS.Query();
                                  let department = new BaaS.Query();
                                  let task_outline = new BaaS.Query();
                                  let ques_level = new BaaS.Query();
                                  let question_class = new BaaS.Query();
                                  let question_type_5he = new BaaS.Query();
                                  let author = new BaaS.Query();
                                  let author_org = new BaaS.Query();
                                  let time_created = new BaaS.Query();
                                  question_content_id.compare(
                                    "question_content_id",
                                    "=",
                                    contentId
                                  );
                                  primary_ques_type.compare(
                                    "primary_ques_type",
                                    "=",
                                    this.questions[i].primary_ques_type
                                  );
                                  secondary_ques_type.compare(
                                    "secondary_ques_type",
                                    "=",
                                    this.questions[i].secondary_ques_type
                                  );
                                  if (
                                    this.questions[i].sub_question[j]
                                      .question != null
                                  ) {
                                    question.compare(
                                      "question",
                                      "=",
                                      this.questions[i].sub_question[j].question
                                    );
                                  } else {
                                    question.isNull("question");
                                  }
                                  if (
                                    this.questions[i].sub_question[j].options !=
                                    null
                                  ) {
                                    options.compare(
                                      "options",
                                      "=",
                                      JSON.stringify(
                                        this.questions[i].sub_question[j]
                                          .options
                                      )
                                    );
                                  } else {
                                    options.isNull("options");
                                  }
                                  answer.compare(
                                    "answer",
                                    "=",
                                    this.questions[i].sub_question[j].answer
                                  );
                                  if (
                                    this.questions[i].sub_question[j]
                                      .analysis != null
                                  ) {
                                    analysis.compare(
                                      "analysis",
                                      "=",
                                      this.questions[i].sub_question[j].analysis
                                    );
                                  } else {
                                    analysis.isNull("analysis");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .grade_value != null
                                  ) {
                                    grade_standard.compare(
                                      "grade_standard",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .grade_value
                                    );
                                  } else {
                                    grade_standard.isNull("grade_standard");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .topic_value != null
                                  ) {
                                    topic_outline.compare(
                                      "topic_outline",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .topic_value
                                    );
                                  } else {
                                    topic_outline.isNull("topic_outline");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .department_value != null
                                  ) {
                                    department.compare(
                                      "department",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .department_value
                                    );
                                  } else {
                                    department.isNull("department");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .task_value != null
                                  ) {
                                    task_outline.compare(
                                      "task_outline",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .task_value
                                    );
                                  } else {
                                    task_outline.isNull("task_outline");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .level_value != null
                                  ) {
                                    ques_level.compare(
                                      "ques_level",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .level_value
                                    );
                                  } else {
                                    ques_level.isNull("ques_level");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .qclass_value != null
                                  ) {
                                    question_class.compare(
                                      "question_class",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .qclass_value
                                    );
                                  } else {
                                    question_class.isNull("question_class");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .fivehe_value != null
                                  ) {
                                    question_type_5he.compare(
                                      "question_type_5he",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .fivehe_value
                                    );
                                  } else {
                                    question_type_5he.isNull(
                                      "question_type_5he"
                                    );
                                  }
                                  if (
                                    this.questions[i].sub_question[j].author !=
                                    null
                                  ) {
                                    author.compare(
                                      "author",
                                      "=",
                                      this.questions[i].sub_question[j].author
                                    );
                                  } else {
                                    author.isNull("author");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .author_org != null
                                  ) {
                                    author_org.compare(
                                      "author_org",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .author_org
                                    );
                                  } else {
                                    author_org.isNull("author_org");
                                  }
                                  if (
                                    this.questions[i].sub_question[j]
                                      .time_created != null
                                  ) {
                                    time_created.compare(
                                      "time_created",
                                      "=",
                                      this.questions[i].sub_question[j]
                                        .time_created
                                    );
                                  } else {
                                    time_created.isNull("time_created");
                                  }
                                  let andQuery = BaaS.Query.and(
                                    question_content_id,
                                    primary_ques_type,
                                    secondary_ques_type,
                                    question,
                                    options,
                                    answer,
                                    analysis,
                                    grade_standard,
                                    topic_outline,
                                    department,
                                    task_outline,
                                    ques_level,
                                    question_class,
                                    question_type_5he,
                                    author,
                                    author_org,
                                    time_created
                                  );
                                  findQuestion
                                    .setQuery(andQuery)
                                    .find()
                                    .then(
                                      (res2) => {
                                        if (res2.data.objects.length == 0) {
                                          //没找到存在的题目
                                          //存储题目
                                          let saveQuestion =
                                            new BaaS.TableObject(
                                              "questions_information"
                                            );
                                          let save_question =
                                            saveQuestion.create();
                                          let temp1;
                                          if (
                                            (this.questions[i]
                                              .primary_ques_type == "听力" &&
                                              this.questions[i]
                                                .secondary_ques_type ==
                                                "听句子，判断对错") ||
                                            this.questions[i]
                                              .primary_ques_type == "判断题"
                                          ) {
                                            temp1 = {
                                              question_content_id: contentId,
                                              primary_ques_type:
                                                this.questions[i]
                                                  .primary_ques_type,
                                              secondary_ques_type:
                                                this.questions[i]
                                                  .secondary_ques_type,
                                              question:
                                                this.questions[i].sub_question[
                                                  j
                                                ].question,
                                              options: JSON.stringify(
                                                this.questions[i].sub_question[
                                                  j
                                                ].options
                                              ),
                                              answer:
                                                this.questions[i].sub_question[
                                                  j
                                                ].answer,
                                              analysis:
                                                this.questions[i].sub_question[
                                                  j
                                                ].analysis,
                                              grade_standard:
                                                this.questions[i].sub_question[
                                                  j
                                                ].grade_value,
                                              topic_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].topic_value,
                                              department:
                                                this.questions[i].sub_question[
                                                  j
                                                ].department_value,
                                              task_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].task_value,
                                              ques_level:
                                                this.questions[i].sub_question[
                                                  j
                                                ].level_value,
                                              question_class:
                                                this.questions[i].sub_question[
                                                  j
                                                ].qclass_value,
                                              question_type_5he:
                                                this.questions[i].sub_question[
                                                  j
                                                ].fivehe_value,
                                              // sub_sequence:
                                              //   this.questions[i].sub_question[j]
                                              //     .actual_sequence,
                                              score:
                                                this.questions[i].sub_question[
                                                  j
                                                ].score * 1,
                                              author:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author,
                                              author_org:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author_org,
                                              time_created:
                                                this.questions[i].sub_question[
                                                  j
                                                ].time_created,
                                            };
                                          } else if (
                                            (this.questions[i]
                                              .primary_ques_type == "听力" &&
                                              this.questions[i]
                                                .secondary_ques_type !=
                                                "听句子，判断对错") ||
                                            this.questions[i]
                                              .primary_ques_type == "阅读" ||
                                            this.questions[i]
                                              .primary_ques_type == "单选题" ||
                                            this.questions[i]
                                              .primary_ques_type == "多选题" ||
                                            this.questions[i]
                                              .primary_ques_type == "填空题"
                                          ) {
                                            temp1 = {
                                              question_content_id: contentId,
                                              primary_ques_type:
                                                this.questions[i]
                                                  .primary_ques_type,
                                              secondary_ques_type:
                                                this.questions[i]
                                                  .secondary_ques_type,
                                              question:
                                                this.questions[i].sub_question[
                                                  j
                                                ].question,
                                              options: JSON.stringify(
                                                this.questions[i].sub_question[
                                                  j
                                                ].options
                                              ),
                                              answer:
                                                this.questions[i].sub_question[
                                                  j
                                                ].answer,
                                              analysis:
                                                this.questions[i].sub_question[
                                                  j
                                                ].analysis,
                                              grade_standard:
                                                this.questions[i].sub_question[
                                                  j
                                                ].grade_value,
                                              topic_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].topic_value,
                                              department:
                                                this.questions[i].sub_question[
                                                  j
                                                ].department_value,
                                              task_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].task_value,
                                              ques_level:
                                                this.questions[i].sub_question[
                                                  j
                                                ].level_value,
                                              question_class:
                                                this.questions[i].sub_question[
                                                  j
                                                ].qclass_value,
                                              question_type_5he:
                                                this.questions[i].sub_question[
                                                  j
                                                ].fivehe_value,
                                              author:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author,
                                              author_org:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author_org,
                                              time_created:
                                                this.questions[i].sub_question[
                                                  j
                                                ].time_created,
                                            };
                                          } else if (
                                            this.questions[i]
                                              .primary_ques_type == "写作" ||
                                            this.questions[i]
                                              .primary_ques_type == "简答题"
                                          ) {
                                            temp1 = {
                                              question_content_id: contentId,
                                              primary_ques_type:
                                                this.questions[i]
                                                  .primary_ques_type,
                                              secondary_ques_type:
                                                this.questions[i]
                                                  .secondary_ques_type,
                                              question:
                                                this.questions[i].sub_question[
                                                  j
                                                ].question,
                                              options: null,
                                              answer:
                                                this.questions[i].sub_question[
                                                  j
                                                ].answer,
                                              analysis:
                                                this.questions[i].sub_question[
                                                  j
                                                ].analysis,
                                              grade_standard:
                                                this.questions[i].sub_question[
                                                  j
                                                ].grade_value,
                                              topic_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].topic_value,
                                              department:
                                                this.questions[i].sub_question[
                                                  j
                                                ].department_value,
                                              task_outline:
                                                this.questions[i].sub_question[
                                                  j
                                                ].task_value,
                                              ques_level:
                                                this.questions[i].sub_question[
                                                  j
                                                ].level_value,
                                              question_class:
                                                this.questions[i].sub_question[
                                                  j
                                                ].qclass_value,
                                              question_type_5he:
                                                this.questions[i].sub_question[
                                                  j
                                                ].fivehe_value,
                                              author:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author,
                                              author_org:
                                                this.questions[i].sub_question[
                                                  j
                                                ].author_org,
                                              time_created:
                                                this.questions[i].sub_question[
                                                  j
                                                ].time_created,
                                            };
                                          }
                                          save_question
                                            .set(temp1)
                                            .save()
                                            .then(
                                              (res3) => {
                                                let q = {
                                                  id: res3.data.id,
                                                  sub_sequence:
                                                    this.questions[i]
                                                      .sub_question[j]
                                                      .actual_sequence,
                                                  score:
                                                    this.questions[i]
                                                      .sub_question[j].score *
                                                    1,
                                                };
                                                question_detail.push(q);
                                                if (
                                                  question_detail.length ==
                                                  this.ques_num
                                                ) {
                                                  let savePaper =
                                                    new BaaS.TableObject(
                                                      "test_paper"
                                                    );
                                                  let save_paper =
                                                    savePaper.create();
                                                  let paper_type;
                                                  paper_type = "模考";
                                                  let p = {
                                                    paper_title: this.title,
                                                    paper_type: paper_type,
                                                    questions_num:
                                                      this.ques_num,
                                                    points: this.ques_score,
                                                    questions_detail:
                                                      JSON.stringify(
                                                        question_detail
                                                      ),
                                                    ques_type: JSON.stringify(
                                                      this.ques_type
                                                    ),
                                                  };
                                                  save_paper
                                                    .set(p)
                                                    .save()
                                                    .then(
                                                      (res) => {
                                                        console.log(res);
                                                        this.$message({
                                                          message: "保存成功",
                                                          type: "success",
                                                        });
                                                        Cookies.set(
                                                          "paperInfo",
                                                          res.data.id
                                                        );
                                                        this.back();
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
                                        } else {
                                          //找到了已存在的题目
                                          let q = {
                                            id: res2.data.objects[0].id,
                                            sub_sequence:
                                              this.questions[i].sub_question[j]
                                                .actual_sequence,
                                            score:
                                              this.questions[i].sub_question[j]
                                                .score * 1,
                                          };
                                          question_detail.push(q);
                                          if (
                                            question_detail.length ==
                                            this.ques_num
                                          ) {
                                            let savePaper =
                                              new BaaS.TableObject(
                                                "test_paper"
                                              );
                                            let save_paper = savePaper.create();
                                            let paper_type;
                                            paper_type = "模考";
                                            let p = {
                                              paper_title: this.title,
                                              paper_type: paper_type,
                                              questions_num: this.ques_num,
                                              points: this.ques_score,
                                              questions_detail:
                                                JSON.stringify(question_detail),
                                              ques_type: JSON.stringify(
                                                this.ques_type
                                              ),
                                            };
                                            save_paper
                                              .set(p)
                                              .save()
                                              .then(
                                                (res) => {
                                                  console.log(res);
                                                  this.$message({
                                                    message: "保存成功",
                                                    type: "success",
                                                  });
                                                  Cookies.set(
                                                    "paperInfo",
                                                    res.data.id
                                                  );
                                                  this.back();
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
                              } else {
                                //数据库里没有该题干
                                let saveContent = new BaaS.TableObject(
                                  "question_content"
                                );
                                let save_content = saveContent.create();
                                let tempc = {
                                  content: this.questions[i].question_content,
                                  file_url: null,
                                  catalog: null,
                                };
                                save_content
                                  .set(tempc)
                                  .save()
                                  .then(
                                    (res4) => {
                                      for (
                                        let j = 0;
                                        j <
                                        this.questions[i].sub_question.length;
                                        j++
                                      ) {
                                        let tempq;
                                        //存储题目
                                        let saveQuestion = new BaaS.TableObject(
                                          "questions_information"
                                        );
                                        let save_question =
                                          saveQuestion.create();
                                        if (
                                          (this.questions[i]
                                            .primary_ques_type == "听力" &&
                                            this.questions[i]
                                              .secondary_ques_type ==
                                              "听句子，判断对错") ||
                                          this.questions[i].primary_ques_type ==
                                            "判断题"
                                        ) {
                                          tempq = {
                                            question_content_id: res4.data.id,
                                            primary_ques_type:
                                              this.questions[i]
                                                .primary_ques_type,
                                            secondary_ques_type:
                                              this.questions[i]
                                                .secondary_ques_type,
                                            question:
                                              this.questions[i].sub_question[j]
                                                .question,
                                            options: JSON.stringify(
                                              this.questions[i].sub_question[j]
                                                .options
                                            ),
                                            answer:
                                              this.questions[i].sub_question[j]
                                                .answer,
                                            analysis:
                                              this.questions[i].sub_question[j]
                                                .analysis,
                                            grade_standard:
                                              this.questions[i].sub_question[j]
                                                .grade_value,
                                            topic_outline:
                                              this.questions[i].sub_question[j]
                                                .topic_value,
                                            department:
                                              this.questions[i].sub_question[j]
                                                .department_value,
                                            task_outline:
                                              this.questions[i].sub_question[j]
                                                .task_value,
                                            ques_level:
                                              this.questions[i].sub_question[j]
                                                .level_value,
                                            question_class:
                                              this.questions[i].sub_question[j]
                                                .qclass_value,
                                            question_type_5he:
                                              this.questions[i].sub_question[j]
                                                .fivehe_value,
                                            author:
                                              this.questions[i].sub_question[j]
                                                .author,
                                            author_org:
                                              this.questions[i].sub_question[j]
                                                .author_org,
                                            time_created:
                                              this.questions[i].sub_question[j]
                                                .time_created,
                                          };
                                        } else if (
                                          (this.questions[i]
                                            .primary_ques_type == "听力" &&
                                            this.questions[i]
                                              .secondary_ques_type !=
                                              "听句子，判断对错") ||
                                          this.questions[i].primary_ques_type ==
                                            "阅读" ||
                                          this.questions[i].primary_ques_type ==
                                            "单选题" ||
                                          this.questions[i].primary_ques_type ==
                                            "多选题" ||
                                          this.questions[i].primary_ques_type ==
                                            "填空题"
                                        ) {
                                          tempq = {
                                            question_content_id: res4.data.id,
                                            primary_ques_type:
                                              this.questions[i]
                                                .primary_ques_type,
                                            secondary_ques_type:
                                              this.questions[i]
                                                .secondary_ques_type,
                                            question:
                                              this.questions[i].sub_question[j]
                                                .question,
                                            options: JSON.stringify(
                                              this.questions[i].sub_question[j]
                                                .options
                                            ),
                                            answer:
                                              this.questions[i].sub_question[j]
                                                .answer,
                                            analysis:
                                              this.questions[i].sub_question[j]
                                                .analysis,
                                            grade_standard:
                                              this.questions[i].sub_question[j]
                                                .grade_value,
                                            topic_outline:
                                              this.questions[i].sub_question[j]
                                                .topic_value,
                                            department:
                                              this.questions[i].sub_question[j]
                                                .department_value,
                                            task_outline:
                                              this.questions[i].sub_question[j]
                                                .task_value,
                                            ques_level:
                                              this.questions[i].sub_question[j]
                                                .level_value,
                                            question_class:
                                              this.questions[i].sub_question[j]
                                                .qclass_value,
                                            question_type_5he:
                                              this.questions[i].sub_question[j]
                                                .fivehe_value,
                                            author:
                                              this.questions[i].sub_question[j]
                                                .author,
                                            author_org:
                                              this.questions[i].sub_question[j]
                                                .author_org,
                                            time_created:
                                              this.questions[i].sub_question[j]
                                                .time_created,
                                          };
                                        } else if (
                                          this.questions[i].primary_ques_type ==
                                            "写作" ||
                                          this.questions[i].primary_ques_type ==
                                            "简答题"
                                        ) {
                                          tempq = {
                                            question_content_id: res4.data.id,
                                            primary_ques_type:
                                              this.questions[i]
                                                .primary_ques_type,
                                            secondary_ques_type:
                                              this.questions[i]
                                                .secondary_ques_type,
                                            question:
                                              this.questions[i].sub_question[j]
                                                .question,
                                            options: null,
                                            answer:
                                              this.questions[i].sub_question[j]
                                                .answer,
                                            analysis:
                                              this.questions[i].sub_question[j]
                                                .analysis,
                                            grade_standard:
                                              this.questions[i].sub_question[j]
                                                .grade_value,
                                            topic_outline:
                                              this.questions[i].sub_question[j]
                                                .topic_value,
                                            department:
                                              this.questions[i].sub_question[j]
                                                .department_value,
                                            task_outline:
                                              this.questions[i].sub_question[j]
                                                .task_value,
                                            ques_level:
                                              this.questions[i].sub_question[j]
                                                .level_value,
                                            question_class:
                                              this.questions[i].sub_question[j]
                                                .qclass_value,
                                            question_type_5he:
                                              this.questions[i].sub_question[j]
                                                .fivehe_value,
                                            author:
                                              this.questions[i].sub_question[j]
                                                .author,
                                            author_org:
                                              this.questions[i].sub_question[j]
                                                .author_org,
                                            time_created:
                                              this.questions[i].sub_question[j]
                                                .time_created,
                                          };
                                        }
                                        save_question
                                          .set(tempq)
                                          .save()
                                          .then(
                                            (res) => {
                                              let q = {
                                                id: res.data.id,
                                                sub_sequence:
                                                  this.questions[i]
                                                    .sub_question[j]
                                                    .actual_sequence,
                                                score:
                                                  this.questions[i]
                                                    .sub_question[j].score * 1,
                                              };
                                              question_detail.push(q);
                                              if (
                                                question_detail.length ==
                                                this.ques_num
                                              ) {
                                                let savePaper =
                                                  new BaaS.TableObject(
                                                    "test_paper"
                                                  );
                                                let save_paper =
                                                  savePaper.create();
                                                let paper_type;
                                                paper_type = "模考";
                                                let p = {
                                                  paper_title: this.title,
                                                  paper_type: paper_type,
                                                  questions_num: this.ques_num,
                                                  points: this.ques_score,
                                                  questions_detail:
                                                    JSON.stringify(
                                                      question_detail
                                                    ),
                                                  ques_type: JSON.stringify(
                                                    this.ques_type
                                                  ),
                                                };
                                                save_paper
                                                  .set(p)
                                                  .save()
                                                  .then(
                                                    (res) => {
                                                      console.log(res);
                                                      this.$message({
                                                        message: "保存成功",
                                                        type: "success",
                                                      });
                                                      Cookies.set(
                                                        "paperInfo",
                                                        res.data.id
                                                      );
                                                      this.back();
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
                    }
                  });
              }
            } else {
              this.$message({
                message: "不符合模考卷题量和分数，请修改！",
                type: "warning",
              });
            }
          } else {
            this.$message({
              message: "MCT模考卷题量为101题，总分为300分，请修改！",
              type: "warning",
            });
          }
        }
      }
    },
    selectQues() {
      sessionStorage.setItem("questions", JSON.stringify(this.questions));
      sessionStorage.setItem("ques_type", JSON.stringify(this.ques_type));
      sessionStorage.setItem("currentQues", this.currentQues);
      sessionStorage.setItem("currentSubQues", this.currentSubQues);
      sessionStorage.setItem("title", this.title);
      sessionStorage.setItem("exam", this.exam);
      sessionStorage.setItem("ques_num", this.ques_num);
      sessionStorage.setItem("ques_score", this.ques_score);
      for (let i = 0; i < this.editor.length; i++) {
        this.editor[i].destroy();
      }
      this.$router.push("/selectQues");
    },
    preview() {
      sessionStorage.setItem("questions", JSON.stringify(this.questions));
      sessionStorage.setItem("ques_type", JSON.stringify(this.ques_type));
      sessionStorage.setItem("currentQues", this.currentQues);
      sessionStorage.setItem("currentSubQues", this.currentSubQues);
      sessionStorage.setItem("title", this.title);
      sessionStorage.setItem("exam", this.exam);
      sessionStorage.setItem("ques_num", this.ques_num);
      sessionStorage.setItem("ques_score", this.ques_score);
      for (let i = 0; i < this.editor.length; i++) {
        this.editor[i].destroy();
      }
      this.$router.push("/preview");
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.mcreatePaper {
  padding: 10px 30px;
}
.mcreatePaper .top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 70px;
  border-bottom: 1px solid rgb(180, 180, 180);
  margin-bottom: 20px;
}
.mcreatePaper .top_left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.mcreatePaper .top_left .title,
.mcreatePaper .top_left .el-input {
  margin-right: 20px;
}
.mcreatePaper .main_detail {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: white;
  border: 1px solid rgb(180, 180, 180);
}
.mcreatePaper .main_left {
  flex: 2;
}
.mcreatePaper .main_left_main {
  display: flex;
  flex-direction: column;
}
.mcreatePaper .main_left_main .el-card {
  margin-bottom: 0;
}
.mcreatePaper .main_left_main .el-card__body {
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.mcreatePaper .main_left_main .el-card__body .temp {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.mcreatePaper .main_left_main .type_detail {
  display: flex;
  flex-direction: row;
  font-weight: 100;
  justify-content: flex-end;
  align-items: center;
}
.mcreatePaper .main_left_main .type_detail .type_del,
.mcreatePaper .main_left_main .ques_del {
  color: red;
  display: none;
}
.mcreatePaper .main_left_main .type_detail .type_up,
.mcreatePaper .main_left_main .type_detail .type_down,
.mcreatePaper .main_left_main .ques_up,
.mcreatePaper .main_left_main .ques_down {
  color: rgb(62, 62, 249);
  display: none;
}
.mcreatePaper .main_left_main .type_detail .type_del:hover,
.mcreatePaper .main_left_main .ques_del:hover,
.mcreatePaper .main_left_main .type_detail .type_up:hover,
.mcreatePaper .main_left_main .type_detail .type_down:hover,
.mcreatePaper .main_left_main .ques_up:hover,
.mcreatePaper .main_left_main .ques_down:hover {
  cursor: pointer;
}
.mcreatePaper .main_left_main .primary {
  display: flex;
  flex-direction: row;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  flex: 3;
}
.mcreatePaper .main_left_main .ques_content_detail {
  text-align: left;
  width: 196px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mcreatePaper .main_left_main .type {
  text-align: left;
  font-weight: bold;
  flex: 3;
}
.el-tabs--left .el-tabs__header.is-left {
  width: 200px;
}
.el-tabs--left.el-tabs--card .el-tabs__item.is-left.is-active:last-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mcreatePaper .main_left_top {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  line-height: 50px;
  border-bottom: 1px solid rgb(180, 180, 180);
}
.mcreatePaper .main_left_top .ques_detail {
  display: flex;
  flex-direction: row;
}
.mcreatePaper .main_left_top .ques_details {
  color: red;
  font-size: 25px;
}
.mcreatePaper .main_right {
  flex: 7;
  background-color: white;
  border-left: 1px solid rgb(180, 180, 180);
  display: flex;
  flex-direction: column;
}
.mcreatePaper .main_right_top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid rgb(180, 180, 180);
}
.mcreatePaper .main_right_ques {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
}
.mcreatePaper .main_right_ques .score,
.mcreatePaper .main_right_ques .ques_content,
.mcreatePaper .main_right_ques .question,
.mcreatePaper .main_right_ques .answer,
.mcreatePaper .main_right_ques .analysis,
.mcreatePaper .main_right_ques .warn,
.mcreatePaper .main_right_ques .options .select_options {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
}
.mcreatePaper .main_right_ques .score .el-input {
  width: 150px;
}
.mcreatePaper .main_right_ques .options {
  display: flex;
  flex-direction: column;
}
.mcreatePaper .main_right_ques .select_bar .knowledge {
  display: flex;
  flex-direction: row;
  width: 325px;
  justify-content: center;
}
.mcreatePaper .main_right_ques .sub_ques_check {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 10px 0;
}
.mcreatePaper .main_right_check {
  margin: 10px 0;
}
.mcreatePaper .knowledge .el-input {
  width: initial;
}
</style>