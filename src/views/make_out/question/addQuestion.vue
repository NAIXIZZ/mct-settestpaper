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
          <el-radio-group
            v-model="questions.primary_ques_type"
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
            questions.primary_ques_type == '听力' ||
            questions.primary_ques_type == '阅读' ||
            questions.primary_ques_type == '写作'
          "
        >
          二级题型：
          <el-radio-group
            v-model="questions.secondary_ques_type"
            v-if="questions.primary_ques_type == '听力'"
          >
            <el-radio-button label="听句子，判断对错"></el-radio-button>
            <el-radio-button label="听短对话，选择正确答案"></el-radio-button>
            <el-radio-button label="听长对话，选择正确答案"></el-radio-button>
            <el-radio-button label="听短文，选择正确答案"></el-radio-button>
          </el-radio-group>
          <el-radio-group
            v-model="questions.secondary_ques_type"
            v-if="questions.primary_ques_type == '阅读'"
          >
            <el-radio-button label="选择正确的词语填空"></el-radio-button>
            <el-radio-button
              label="阅读语段，选择与语段意思一致的一项"
            ></el-radio-button>
            <el-radio-button label="阅读材料，选择正确答案"></el-radio-button>
            <el-radio-button label="阅读短文，选择正确答案"></el-radio-button>
          </el-radio-group>
          <el-radio-group
            v-model="questions.secondary_ques_type"
            v-if="questions.primary_ques_type == '写作'"
          >
            <el-radio-button
              label="根据一段长对话写门诊病历记录"
            ></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
        <div class="edit_ques_content">
          <div class="material">
            题干：
            <div id="material">
              <p>{{ questions.question_content }}</p>
            </div>
          </div>
          <el-upload
            v-if="questions.primary_ques_type == '听力'"
            ref="upload"
            action=""
            class="upload-demo"
            :multiple="false"
            accept=".mp3,.wav,.ogg"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :limit="1"
            :file-list="fileList"
          >
            <el-button>上传音频</el-button>
          </el-upload>
          <audio
            :src="audio"
            controls="controls"
            v-if="audio != '' && questions.primary_ques_type == '听力'"
          ></audio>
          <div
            v-if="questions.secondary_ques_type == '阅读材料，选择正确答案'"
            style="display: flex; flex-direction: row; align-items: center"
          >
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
              :file-list="excelfileList"
            >
              <el-button>上传表格</el-button>
            </el-upload>
            <el-tooltip
              class="item"
              effect="light"
              content="点击查看上传格式"
              placement="right"
            >
              <i class="el-icon-info" @click="excelMode = true"></i>
            </el-tooltip>
          </div>
        </div>
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="s in questions.sub_question"
            :key="s.sub_sequence"
            :title="s.sub_sequence + '.' + s.question"
            :name="s.sub_sequence + ''"
          >
            <div class="question">
              问题：
              <div :id="'question' + s.sub_sequence">
                <p>{{ s.question }}</p>
              </div>
            </div>
            <p
              class="warn"
              v-show="
                questions.primary_ques_type != '' &&
                questions.primary_ques_type != '写作' &&
                questions.primary_ques_type != '简答题'
              "
            >
              选项：答案选中项为正确答案标示。
            </p>
            <div
              class="options"
              v-show="
                questions.primary_ques_type != '' &&
                questions.primary_ques_type != '写作' &&
                questions.primary_ques_type != '简答题'
              "
            >
              <div
                v-show="
                  questions.secondary_ques_type == '听句子，判断对错' ||
                  questions.primary_ques_type == '判断题'
                "
                class="judge"
              >
                <el-radio v-model="s.answer" label="√">√</el-radio>
                <el-radio v-model="s.answer" label="×">×</el-radio>
              </div>
              <div
                class="edit_ques_options"
                v-show="
                  questions.secondary_ques_type != '听句子，判断对错' &&
                  questions.primary_ques_type != '判断题'
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
                <div :id="o + s.sub_sequence" class="input_options">
                  <p v-if="o == 'A'">{{ s.A }}</p>
                  <p v-else-if="o == 'B'">{{ s.B }}</p>
                  <p v-else-if="o == 'C'">{{ s.C }}</p>
                  <p v-else-if="o == 'D'">{{ s.D }}</p>
                </div>
              </div>
            </div>
            <div
              class="write_answer"
              v-show="
                questions.primary_ques_type == '写作' ||
                questions.primary_ques_type == '简答题'
              "
            >
              答案：
              <div :id="'answer' + s.sub_sequence">
                <p>{{ s.answer }}</p>
              </div>
            </div>
            <div class="ques_analysis">
              解析：
              <div :id="'analysis' + s.sub_sequence">
                <p>{{ s.analysis }}</p>
              </div>
            </div>
            <div class="select_bar">
              <!-- <div class="knowledge">
                等级：
                <el-select v-model="s.level_value" placeholder="请选择题目等级">
                  <el-option
                    v-for="item in level"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div> -->
              <div class="knowledge">
                MCT等级：
                <!-- <el-cascader
                  v-model="s.grade_value"
                  :options="grade_standard"
                  :props="props"
                  collapse-tags
                  clearable
                  placeholder="请选择等级标准"
                  @change="(type) => grade(type, s.sub_sequence)"
                ></el-cascader> -->
                <el-select
                  v-model="s.grade_value1"
                  placeholder="请选择"
                  @change="levelChange(s.sub_sequence)"
                  clearable
                >
                  <el-option
                    v-for="item in grade_standard1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="s.grade_value2"
                  placeholder="请选择"
                  v-if="s.grade_value1 != ''"
                >
                  <el-option
                    v-for="item in grade_standard2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
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
                <!-- <el-cascader
                  v-model="s.topic_value"
                  :options="topic_outline"
                  :props="props"
                  collapse-tags
                  clearable
                  placeholder="请选择话题大纲"
                  @change="(type) => topic(type, s.sub_sequence)"
                ></el-cascader> -->
                <el-select
                  v-model="s.topic_value1"
                  placeholder="请选择"
                  @change="topicChange(s.sub_sequence)"
                  clearable
                >
                  <el-option
                    v-for="item in topic_outline1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="s.topic_value2"
                  placeholder="请选择"
                  v-if="s.topic_value1 == '医生-医生'"
                >
                  <el-option
                    v-for="item in topic_outline2_1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="s.topic_value2"
                  placeholder="请选择"
                  v-if="s.topic_value1 == '医生-患者'"
                >
                  <el-option
                    v-for="item in topic_outline2_2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="s.topic_value2"
                  placeholder="请选择"
                  v-if="s.topic_value1 == '医生-护士'"
                >
                  <el-option
                    v-for="item in topic_outline2_3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-model="s.topic_value2"
                  placeholder="请选择"
                  v-if="s.topic_value1 == '患者-护士'"
                >
                  <el-option
                    v-for="item in topic_outline2_4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
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
                  clearable
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
                  clearable
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
                  clearable
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
                  clearable
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
                <el-input
                  v-model="s.time_created"
                  placeholder="选择题目创作日期"
                ></el-input>
              </div>
            </div>
            <div class="sub_ques_check">
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
        <el-button type="primary" plain @click="checkQues">保存该题</el-button>
        <el-button type="success" plain @click="addSub">添加小题</el-button>
      </div>
    </div>
    <el-dialog title="添加题目" :visible.sync="dialogVisible" width="30%">
      <span>确认添加题目吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveQues">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="表格上传格式" :visible.sync="excelMode">
      <p>表格模板</p>
      <el-image src="excelMode.jpg" :preview-src-list="srcList"> </el-image>
      <p>结果提示字典</p>
      <el-image src="hint.jpg" :preview-src-list="srcList"> </el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="excelMode = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="//cdn.jsdelivr.net/npm/xgplayer@2.9.6/browser/index.js" type="text/javascript"></script>
<script>
import Cookie from "js-cookie";
// import Cookies from "js-cookie";
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
      srcList: ["excelMode.jpg", "hint.jpg"],
      excelMode: false,
      excelfileList: [],
      audior: "",
      audio: "",
      fileList: [],
      currentSubQues: 1,
      questions: {
        primary_ques_type: "",
        secondary_ques_type: "",
        question_content: "",
        sub_question: [],
      },
      option: ["A", "B", "C", "D"],
      editor: [],
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
      grade_standard1: [
        {
          value: "医学汉语能力总体等级",
          label: "医学汉语能力总体等级",
        },
        {
          value: "医学汉语口头理解能力（听）",
          label: "医学汉语口头理解能力（听）",
        },
        {
          value: "医学汉语口头理解能力（说）",
          label: "医学汉语口头理解能力（说）",
        },
        {
          value: "医学汉语口头理解能力（读）",
          label: "医学汉语口头理解能力（读）",
        },
        {
          value: "医学汉语口头理解能力（写）",
          label: "医学汉语口头理解能力（写）",
        },
      ],
      grade_standard2: [
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
      // grade_value: [],
      // grade_standard: [
      //   {
      //     value: "医学汉语能力总体等级",
      //     label: "医学汉语能力总体等级",
      //     children: [
      //       {
      //         value: "一级",
      //         label: "一级",
      //       },
      //       {
      //         value: "二级",
      //         label: "二级",
      //       },
      //       {
      //         value: "三级",
      //         label: "三级",
      //       },
      //     ],
      //   },
      //   {
      //     value: "医学汉语口头理解能力（听）",
      //     label: "医学汉语口头理解能力（听）",
      //     children: [
      //       {
      //         value: "一级",
      //         label: "一级",
      //       },
      //       {
      //         value: "二级",
      //         label: "二级",
      //       },
      //       {
      //         value: "三级",
      //         label: "三级",
      //       },
      //     ],
      //   },
      //   {
      //     value: "医学汉语口头理解能力（说）",
      //     label: "医学汉语口头理解能力（说）",
      //     children: [
      //       {
      //         value: "一级",
      //         label: "一级",
      //       },
      //       {
      //         value: "二级",
      //         label: "二级",
      //       },
      //       {
      //         value: "三级",
      //         label: "三级",
      //       },
      //     ],
      //   },
      //   {
      //     value: "医学汉语口头理解能力（读）",
      //     label: "医学汉语口头理解能力（读）",
      //     children: [
      //       {
      //         value: "一级",
      //         label: "一级",
      //       },
      //       {
      //         value: "二级",
      //         label: "二级",
      //       },
      //       {
      //         value: "三级",
      //         label: "三级",
      //       },
      //     ],
      //   },
      //   {
      //     value: "医学汉语口头理解能力（写）",
      //     label: "医学汉语口头理解能力（写）",
      //     children: [
      //       {
      //         value: "一级",
      //         label: "一级",
      //       },
      //       {
      //         value: "二级",
      //         label: "二级",
      //       },
      //       {
      //         value: "三级",
      //         label: "三级",
      //       },
      //     ],
      //   },
      // ],
      topic_outline1: [
        {
          value: "医生-医生",
          label: "医生-医生",
        },
        {
          value: "医生-患者",
          label: "医生-患者",
        },
        {
          value: "医生-护士",
          label: "医生-护士",
        },
        {
          value: "患者-护士",
          label: "患者-护士",
        },
      ],
      topic_outline2_1: [
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
      topic_outline2_2: [
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
      topic_outline2_3: [
        {
          value: "交流",
          label: "交流",
        },
        {
          value: "指令",
          label: "指令",
        },
      ],
      topic_outline2_4: [
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

      // topic_value: [],
      // topic_outline: [
      //   {
      //     value: "医生-医生",
      //     label: "医生-医生",
      //     children: [
      //       {
      //         value: "询问",
      //         label: "询问",
      //       },
      //       {
      //         value: "交流",
      //         label: "交流",
      //       },
      //       {
      //         value: "指令",
      //         label: "指令",
      //       },
      //     ],
      //   },
      //   {
      //     value: "医生-患者",
      //     label: "医生-患者",
      //     children: [
      //       {
      //         value: "问诊",
      //         label: "问诊",
      //       },
      //       {
      //         value: "诊断",
      //         label: "诊断",
      //       },
      //       {
      //         value: "治疗",
      //         label: "治疗",
      //       },
      //       {
      //         value: "主诉",
      //         label: "主诉",
      //       },
      //       {
      //         value: "交流",
      //         label: "交流",
      //       },
      //       {
      //         value: "指令",
      //         label: "指令",
      //       },
      //     ],
      //   },
      //   {
      //     value: "医生-护士",
      //     label: "医生-护士",
      //     children: [
      //       {
      //         value: "交流",
      //         label: "交流",
      //       },
      //       {
      //         value: "指令",
      //         label: "指令",
      //       },
      //     ],
      //   },
      //   {
      //     value: "患者-护士",
      //     label: "患者-护士",
      //     children: [
      //       {
      //         value: "交流",
      //         label: "交流",
      //       },
      //       {
      //         value: "指令",
      //         label: "指令",
      //       },
      //       {
      //         value: "咨询",
      //         label: "咨询",
      //       },
      //     ],
      //   },
      // ],
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
      dialogVisible: false,
      file_url: "",
      excelr: "",
    };
  },
  watch: {},
  computed: {},
  methods: {
    levelChange(s) {
      this.questions.sub_question[s - 1].grade_value2 = "";
    },
    topicChange(s) {
      this.questions.sub_question[s - 1].topic_value2 = "";
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
      this.excelfileList.push(file);
      if (/\.(xls)$/.test(file.raw.name) || /\.(xlsx)$/.test(file.raw.name)) {
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = () => {
          const result = this.dataURLtoFile(reader.result, file.raw.name);
          console.log(result);
          new Promise((resolve, reject) => {
            // this.audio = reader.result;
            this.excelr = result;
          });
        };
      }
    },
    excelRemove(file, fileList) {
      this.excelfileList = [];
      this.excelr = "";
    },
    beforeAvatarUpload(file) {
      let isFile =
        file.name.split(".")[file.name.split(".").length - 1] == "mp3" ||
        file.name.split(".")[file.name.split(".").length - 1] == "wav" ||
        file.name.split(".")[file.name.split(".").length - 1] == "ogg";
      if (!isFile) {
        this.$message.warning("导入文件格式不正确");
      }
      return isFile;
    },
    handleChange(file, fileList) {
      this.fileList.push(file);
      if (
        /\.(mp3)$/.test(this.fileList[0].raw.name) ||
        /\.(wav)$/.test(this.fileList[0].raw.name) ||
        /\.(ogg)$/.test(this.fileList[0].raw.name)
      ) {
        var reader = new FileReader();
        reader.readAsDataURL(this.fileList[0].raw);
        reader.onload = () => {
          const result = this.dataURLtoFile(
            reader.result,
            this.fileList[0].raw.name
          );
          new Promise((resolve, reject) => {
            this.audio = reader.result;
            this.audior = result;
          });
        };
      }
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      this.audior = "";
      this.audio = "";
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
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
    async init() {
      var sub = {
        sub_sequence: 1,
        question: "",
        options: [],
        answer: "",
        analysis: "",
        // level_value: "",
        grade_value1: "",
        grade_value2: "",
        topic_value1: "",
        topic_value2: "",
        task_value: "",
        department_value: "",
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
      await this.questions.sub_question.push(sub);
      this.createEdit();
    },
    back() {
      this.$router.go(-1);
    },
    dataURLtoFile(dataURL, fileName) {
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
    createEdit() {
      const material = new E("#material");
      // material.config.uploadImgServer = "/upload";
      material.config.uploadImgShowBase64 = true;
      material.config.uploadVideoServer = "/api/upload-video";
      material.config.uploadVideoAccept = ["mp3"];
      material.config.height = 200;
      material.config.zIndex = 4;
      material.config.placeholder = "请输入题干";
      material.create();
      this.editor.push(material);
      for (let i = 1; i <= this.currentSubQues; i++) {
        const question = new E("#question" + i);
        question.config.uploadImgShowBase64 = true;
        question.config.uploadVideoServer = "/api/upload-video";
        question.config.height = 50;
        question.config.zIndex = 5;
        question.config.placeholder = "请输入问题";
        question.create();
        this.editor.push(question);
        for (let j = 1; j <= this.option.length; j++) {
          var alphabet = String.fromCharCode(64 + parseInt(j));
          var option = new E("#" + alphabet + i);
          option.config.uploadImgShowBase64 = true;
          option.config.uploadVideoServer = "/api/upload-video";
          option.config.height = 50;
          option.config.zIndex = 9 - j;
          option.config.placeholder = "请输入选项";
          option.create();
          this.editor.push(option);
        }
        const answer = new E("#answer" + i);
        answer.config.uploadImgShowBase64 = true;
        answer.config.uploadVideoServer = "/api/upload-video";
        answer.config.height = 100;
        answer.config.zIndex = 9;
        answer.config.placeholder = "请输入答案";
        answer.create();
        this.editor.push(answer);
        const analysis = new E("#analysis" + i);
        analysis.config.uploadImgShowBase64 = true;
        analysis.config.uploadVideoServer = "/api/upload-video";
        analysis.config.height = 100;
        analysis.config.zIndex = 10;
        analysis.config.placeholder = "请输入解析";
        analysis.create();
        this.editor.push(analysis);
      }
    },
    async addSub() {
      var sub = {
        sub_sequence: this.currentSubQues + 1,
        question: "",
        options: [],
        answer: "",
        analysis: "",
        // level_value: "",
        grade_value1: "",
        grade_value2: "",
        topic_value1: "",
        topic_value2: "",
        task_value: "",
        department_value: "",
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
      await this.questions.sub_question.push(sub);
      this.currentSubQues += 1;
      const question = new E("#question" + this.currentSubQues);
      question.config.uploadImgShowBase64 = true;
      question.config.uploadVideoServer = "/api/upload-video";
      question.config.height = 50;
      question.config.zIndex = 5;
      question.config.placeholder = "请输入问题";
      question.create();
      this.editor.push(question);
      for (let i = 1; i <= this.option.length; i++) {
        var alphabet = String.fromCharCode(64 + parseInt(i));
        var option = new E("#" + alphabet + this.currentSubQues);
        option.config.uploadImgShowBase64 = true;
        option.config.uploadVideoServer = "/api/upload-video";
        option.config.height = 50;
        option.config.zIndex = 9 - i;
        option.config.placeholder = "请输入选项";
        option.create();
        this.editor.push(option);
      }
      const answer = new E("#answer" + this.currentSubQues);
      answer.config.uploadImgShowBase64 = true;
      answer.config.uploadVideoServer = "/api/upload-video";
      answer.config.height = 100;
      answer.config.zIndex = 9;
      answer.config.placeholder = "请输入答案";
      answer.create();
      this.editor.push(answer);
      const analysis = new E("#analysis" + this.currentSubQues);
      analysis.config.uploadImgShowBase64 = true;
      analysis.config.uploadVideoServer = "/api/upload-video";
      analysis.config.height = 100;
      analysis.config.zIndex = 10;
      analysis.config.placeholder = "请输入解析";
      analysis.create();
      this.editor.push(analysis);
    },
    async checkQues() {
      if (this.questions.primary_ques_type != "听力") {
        this.handleRemove();
      }
      if (this.questions.secondary_ques_type != "阅读材料，选择正确答案") {
        this.excelRemove();
      }
      this.file_url = "";
      var valid = true;
      for (let j = 1; j <= this.currentSubQues; j++) {
        // if (this.questions.sub_question[j - 1].level_value == "") {
        //   this.questions.sub_question[j - 1].level_value = null;
        // }
        if (this.questions.sub_question[j - 1].grade_value1 == "") {
          this.questions.sub_question[j - 1].grade_value = null;
        } else {
          if (this.questions.sub_question[j - 1].grade_value2 == "") {
            this.$message({
              message: "请选择MCT等级",
              type: "warning",
            });
            valid = false;
            break;
          } else {
            this.questions.sub_question[j - 1].grade_value = [
              this.questions.sub_question[j - 1].grade_value1,
              this.questions.sub_question[j - 1].grade_value2,
            ];
          }
        }
        if (
          this.questions.sub_question[j - 1].department_value == "" ||
          this.questions.sub_question[j - 1].department_value == []
        ) {
          this.questions.sub_question[j - 1].department_value = null;
        }
        if (
          this.questions.sub_question[j - 1].task_value == "" ||
          this.questions.sub_question[j - 1].task_value == []
        ) {
          this.questions.sub_question[j - 1].task_value = null;
        }
        if (this.questions.sub_question[j - 1].topic_value1 == "") {
          this.questions.sub_question[j - 1].topic_value = null;
        } else {
          if (this.questions.sub_question[j - 1].topic_value2 == "") {
            this.$message({
              message: "请选择话题大纲",
              type: "warning",
            });
            valid = false;
            break;
          } else {
            this.questions.sub_question[j - 1].topic_value = [
              this.questions.sub_question[j - 1].topic_value1,
              this.questions.sub_question[j - 1].topic_value2,
            ];
          }
        }
        if (this.questions.sub_question[j - 1].qclass_value == "") {
          this.questions.sub_question[j - 1].qclass_value = null;
        }
        if (this.questions.sub_question[j - 1].fivehe_value == "") {
          this.questions.sub_question[j - 1].fivehe_value = null;
        }
        if (this.questions.sub_question[j - 1].author == "") {
          this.questions.sub_question[j - 1].author = null;
        }
        if (this.questions.sub_question[j - 1].author_org == "") {
          this.questions.sub_question[j - 1].author_org = null;
        }
        if (this.questions.sub_question[j - 1].time_created == "") {
          this.questions.sub_question[j - 1].time_created = null;
        }
        console.log(
          this.questions.sub_question[j - 1].grade_value,
          this.questions.sub_question[j - 1].topic_value
        );
        let a = new Array();
        for (let i = 0; i < this.editor.length; i++) {
          if (valid == false) {
            break;
          }
          if (this.editor[i].toolbarSelector == "#material") {
            if (
              this.editor[i].txt.html() == "" &&
              this.audio == "" &&
              this.excelr == ""
            ) {
              this.questions.question_content = null;
              this.$message({
                message: "请填写题干",
                type: "warning",
              });
              valid = false;
              break;
            } else {
              if (
                this.editor[i].txt.html().search("<img src=") != -1 &&
                this.audio == ""
              ) {
                let src = "";
                let a = this.editor[i].txt.html().search("<img src=");
                let x = this.editor[i].txt.html();
                for (let b = a + 10; b < x.length; b++) {
                  if (x[b] != '"') {
                    src += x[b];
                  } else {
                    break;
                  }
                }
                this.file_url = src;
              } else if (
                this.editor[i].txt.html().search("<img src=") != -1 &&
                (this.audio != "" || this.excelr != "")
              ) {
                this.$message({
                  message: "图片、音频、表格只支持一项，请修改",
                  type: "warning",
                });
                valid = false;
                break;
              }
              this.questions.question_content = this.editor[i].txt.text();
            }
          }
          if (this.editor[i].toolbarSelector == "#question" + j) {
            if (
              this.editor[i].txt.text() == "" ||
              this.editor[i].txt.text() == "null" ||
              this.editor[i].txt.text() == "undefined" ||
              this.editor[i].txt.text() == undefined
            ) {
              this.questions.sub_question[j - 1].question = null;
            } else {
              this.questions.sub_question[j - 1].question =
                this.editor[i].txt.text();
            }
          } else if (this.editor[i].toolbarSelector == "#analysis" + j) {
            if (
              this.editor[i].txt.text() == "" ||
              this.editor[i].txt.text() == "null" ||
              this.editor[i].txt.text() == "undefined" ||
              this.editor[i].txt.text() == undefined
            ) {
              this.questions.sub_question[j - 1].analysis = null;
            } else {
              this.questions.sub_question[j - 1].analysis =
                this.editor[i].txt.text();
            }
          }
          if (this.questions.primary_ques_type != "") {
            if (
              (this.questions.primary_ques_type == "听力" ||
                this.questions.primary_ques_type == "阅读" ||
                this.questions.pFrimary_ques_type == "写作") &&
              this.questions.secondary_ques_type == ""
            ) {
              this.$message({
                message: "请选择二级题型",
                type: "warning",
              });
              valid = false;
              break;
            }
            if (
              this.questions.primary_ques_type == "写作" ||
              this.questions.primary_ques_type == "简答题"
            ) {
              if (this.editor[i].toolbarSelector == "#answer" + j) {
                if (this.editor[i].txt.text() == "") {
                  this.questions.sub_question[j - 1].answer = null;
                  this.$message({
                    message: "请填写答案",
                    type: "warning",
                  });
                  valid = false;
                  break;
                } else {
                  this.questions.sub_question[j - 1].answer =
                    this.editor[i].txt.text();
                }
              }
            } else {
              if (
                this.questions.secondary_ques_type != "听句子，判断对错" &&
                this.questions.primary_ques_type != "判断题"
              ) {
                for (let k = 0; k < this.option.length; k++) {
                  if (
                    "#" + this.option[k] + j ==
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
                        this.questions.sub_question[j - 1].A =
                          this.editor[i].txt.text();
                      } else if (this.option[k] == "B") {
                        this.questions.sub_question[j - 1].B =
                          this.editor[i].txt.text();
                      } else if (this.option[k] == "C") {
                        this.questions.sub_question[j - 1].C =
                          this.editor[i].txt.text();
                      } else if (this.option[k] == "D") {
                        this.questions.sub_question[j - 1].D =
                          this.editor[i].txt.text();
                      }
                      this.questions.sub_question[j - 1].options = null;
                      let b = {
                        content: this.editor[i].txt.text(),
                        index: this.option[k],
                      };
                      a.push(b);
                    }
                  }
                }
                this.questions.sub_question[j - 1].options = a;
                if (
                  this.questions.sub_question[j - 1].answer == "" ||
                  this.option.indexOf(
                    this.questions.sub_question[j - 1].answer
                  ) == -1
                ) {
                  this.$message({
                    message:
                      "请填写第" +
                      this.questions.sub_question[j - 1].actual_sequence +
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
                this.questions.sub_question[j - 1].options = null;
                this.questions.sub_question[j - 1].options = p;
                if (
                  this.questions.sub_question[j - 1].answer == "" ||
                  (this.questions.sub_question[j - 1].answer != "√" &&
                    this.questions.sub_question[j - 1].answer != "×")
                ) {
                  this.$message({
                    message:
                      "请填写第" +
                      this.questions.sub_question[j - 1].sub_sequence +
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
        this.dialogVisible = true;
      }
      return valid;
    },
    typePChange() {
      this.questions.secondary_ques_type = "";
    },
    async subDel(val) {
      if (this.questions.sub_question.length == 1) {
        this.questions.sub_question.splice(val, 1);
        this.currentSubQues = 0;
        for (let i = 0; i < this.editor.length; i++) {
          if (this.editor[i].toolbarSelector != "#material") {
            await this.editor[i].destroy();
          }
        }
        this.addSub();
      } else {
        if (val != this.questions.sub_question.length - 1) {
          for (let i = val + 1; i < this.currentSubQues; i++) {
            this.questions.sub_question[i].sub_sequence--;
          }
          for (let j = 1; j <= this.currentSubQues; j++) {
            for (let i = 0; i < this.editor.length; i++) {
              if (this.editor[i].toolbarSelector == "#question" + j) {
                this.questions.sub_question[j - 1].question =
                  this.editor[i].txt.text();
              } else if (this.editor[i].toolbarSelector == "#answer" + j) {
                this.questions.sub_question[j - 1].answer =
                  this.editor[i].txt.text();
              } else if (this.editor[i].toolbarSelector == "#analysis" + j) {
                this.questions.sub_question[j - 1].analysis =
                  this.editor[i].txt.text();
              } else {
                if (this.editor[i].toolbarSelector == "#A" + j) {
                  this.questions.sub_question[j - 1].A =
                    this.editor[i].txt.text();
                } else if (this.editor[i].toolbarSelector == "#B" + j) {
                  this.questions.sub_question[j - 1].B =
                    this.editor[i].txt.text();
                } else if (this.editor[i].toolbarSelector == "#C" + j) {
                  this.questions.sub_question[j - 1].C =
                    this.editor[i].txt.text();
                } else if (this.editor[i].toolbarSelector == "#D" + j) {
                  this.questions.sub_question[j - 1].D =
                    this.editor[i].txt.text();
                }
              }
            }
          }
        }
        this.questions.sub_question.splice(val, 1);
        this.currentSubQues--;
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
        this.questions.sub_question[se - 1].grade_value = arr;
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
        this.questions.sub_question[se - 1].topic_value = arr;
      }
    },
    saveQues() {
      let cata;
      // if (Cookie.get("catalog") != "") {
      //   cata = Cookie.get("catalog");
      if (sessionStorage.getItem("catalog") != "") {
        cata = sessionStorage.getItem("catalog");
      } else {
        cata = null;
      }
      const loading = this.$loading({
        lock: true,
        text: "正在保存中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.dialogVisible = false;
      if (this.file_url != "" && this.audio == "" && this.excelr == "") {
        const result = this.dataURLtoFile(this.file_url, "图片.png");
        let addFile = new BaaS.File();
        let file = { fileObj: result };
        addFile.upload(file).then(
          (res) => {
            let saveContent = new BaaS.TableObject("question_content");
            let savec = saveContent.create();
            savec.set({
              content: this.questions.question_content,
              file_url: res.data.file,
              catalog: null,
              is_delete: false,
            });
            savec.save().then(
              (res) => {
                this.questions.question_content = res.data.id;
                for (let i = 0; i < this.questions.sub_question.length; i++) {
                  let saveQ = new BaaS.TableObject("questions_information");
                  let saveq = saveQ.create();
                  let temp = {
                    question_content_id: this.questions.question_content,
                    primary_ques_type: this.questions.primary_ques_type,
                    secondary_ques_type: this.questions.secondary_ques_type,
                    question: this.questions.sub_question[i].question,
                    options: JSON.stringify(
                      this.questions.sub_question[i].options
                    ),
                    answer: this.questions.sub_question[i].answer,
                    analysis: this.questions.sub_question[i].analysis,
                    department: this.questions.sub_question[i].department_value,
                    is_delete: false,
                    catalog: cata,
                    // ques_level: this.questions.sub_question[i].level_value,
                    question_class: this.questions.sub_question[i].qclass_value,
                    question_type_5he:
                      this.questions.sub_question[i].fivehe_value,
                    author: this.questions.sub_question[i].author,
                    author_org: this.questions.sub_question[i].author_org,
                    time_created: this.questions.sub_question[i].time_created,
                    topic_outline: this.questions.sub_question[i].topic_value,
                    grade_standard: this.questions.sub_question[i].grade_value,
                    task_outline: this.questions.sub_question[i].task_value,
                    created_by: Cookie.get("user_id") * 1,
                  };
                  saveq
                    .set(temp)
                    .save()
                    .then(
                      (res) => {
                        console.log(res);
                        this.$message({
                          message: "第" + (i + 1) + "题保存成功",
                          type: "success",
                        });
                        if (i == this.questions.sub_question.length - 1) {
                          loading.close();
                          this.back();
                        }
                      },
                      (err) => {
                        this.$message({
                          message: "保存失败",
                          type: "warning",
                        });
                        loading.close();
                        console.log(err);
                      }
                    );
                }
              },
              (err) => {
                this.$message({
                  message: "保存失败",
                  type: "warning",
                });
                loading.close();
                console.log(err);
              }
            );
          },
          (err) => {
            this.$message({
              message: "保存失败",
              type: "warning",
            });
            loading.close();
            console.log(err);
          }
        );
      } else if (this.file_url == "" && this.audio != "" && this.excelr == "") {
        let addFile = new BaaS.File();
        let file = { fileObj: this.audior };
        addFile.upload(file).then(
          (res) => {
            let saveContent = new BaaS.TableObject("question_content");
            let savec = saveContent.create();
            savec.set({
              content: this.questions.question_content,
              file_url: res.data.file,
              catalog: null,
              is_delete: false,
            });
            savec.save().then(
              (res) => {
                this.questions.question_content = res.data.id;
                for (let i = 0; i < this.questions.sub_question.length; i++) {
                  let saveQ = new BaaS.TableObject("questions_information");
                  let saveq = saveQ.create();
                  let temp = {
                    question_content_id: this.questions.question_content,
                    primary_ques_type: this.questions.primary_ques_type,
                    secondary_ques_type: this.questions.secondary_ques_type,
                    question: this.questions.sub_question[i].question,
                    options: JSON.stringify(
                      this.questions.sub_question[i].options
                    ),
                    answer: this.questions.sub_question[i].answer,
                    analysis: this.questions.sub_question[i].analysis,
                    department: this.questions.sub_question[i].department_value,
                    is_delete: false,
                    catalog: cata,
                    // ques_level: this.questions.sub_question[i].level_value,
                    question_class: this.questions.sub_question[i].qclass_value,
                    question_type_5he:
                      this.questions.sub_question[i].fivehe_value,
                    author: this.questions.sub_question[i].author,
                    author_org: this.questions.sub_question[i].author_org,
                    time_created: this.questions.sub_question[i].time_created,
                    topic_outline: this.questions.sub_question[i].topic_value,
                    grade_standard: this.questions.sub_question[i].grade_value,
                    task_outline: this.questions.sub_question[i].task_value,
                    created_by: Cookie.get("user_id") * 1,
                  };
                  saveq
                    .set(temp)
                    .save()
                    .then(
                      (res) => {
                        console.log(res);
                        this.$message({
                          message: "第" + (i + 1) + "题保存成功",
                          type: "success",
                        });
                        if (i == this.questions.sub_question.length - 1) {
                          loading.close();
                          this.back();
                        }
                      },
                      (err) => {
                        this.$message({
                          message: "保存失败",
                          type: "warning",
                        });
                        loading.close();
                        console.log(err);
                      }
                    );
                }
              },
              (err) => {
                this.$message({
                  message: "保存失败",
                  type: "warning",
                });
                loading.close();
                console.log(err);
              }
            );
          },
          (err) => {
            this.$message({
              message: "保存失败",
              type: "warning",
            });
            loading.close();
            console.log(err);
          }
        );
      } else if (this.file_url == "" && this.audio == "" && this.excelr != "") {
        let addFile = new BaaS.File();
        let file = { fileObj: this.excelr };
        addFile.upload(file).then(
          (res) => {
            let saveContent = new BaaS.TableObject("question_content");
            let savec = saveContent.create();
            savec.set({
              content: this.questions.question_content,
              file_url: res.data.file, //调用api生成图片
              excel: res.data.file,
              catalog: null,
              is_delete: false,
            });
            savec.save().then(
              (res) => {
                this.questions.question_content = res.data.id;
                for (let i = 0; i < this.questions.sub_question.length; i++) {
                  let saveQ = new BaaS.TableObject("questions_information");
                  let saveq = saveQ.create();
                  let temp = {
                    question_content_id: this.questions.question_content,
                    primary_ques_type: this.questions.primary_ques_type,
                    secondary_ques_type: this.questions.secondary_ques_type,
                    question: this.questions.sub_question[i].question,
                    options: JSON.stringify(
                      this.questions.sub_question[i].options
                    ),
                    answer: this.questions.sub_question[i].answer,
                    analysis: this.questions.sub_question[i].analysis,
                    department: this.questions.sub_question[i].department_value,
                    is_delete: false,
                    catalog: cata,
                    // ques_level: this.questions.sub_question[i].level_value,
                    question_class: this.questions.sub_question[i].qclass_value,
                    question_type_5he:
                      this.questions.sub_question[i].fivehe_value,
                    author: this.questions.sub_question[i].author,
                    author_org: this.questions.sub_question[i].author_org,
                    time_created: this.questions.sub_question[i].time_created,
                    topic_outline: this.questions.sub_question[i].topic_value,
                    grade_standard: this.questions.sub_question[i].grade_value,
                    task_outline: this.questions.sub_question[i].task_value,
                    created_by: Cookie.get("user_id") * 1,
                  };
                  saveq
                    .set(temp)
                    .save()
                    .then(
                      (res) => {
                        console.log(res);
                        this.$message({
                          message: "第" + (i + 1) + "题保存成功",
                          type: "success",
                        });
                        if (i == this.questions.sub_question.length - 1) {
                          loading.close();
                          this.back();
                        }
                      },
                      (err) => {
                        this.$message({
                          message: "保存失败",
                          type: "warning",
                        });
                        loading.close();
                        console.log(err);
                      }
                    );
                }
              },
              (err) => {
                this.$message({
                  message: "保存失败",
                  type: "warning",
                });
                loading.close();
                console.log(err);
              }
            );
          },
          (err) => {
            this.$message({
              message: "保存失败",
              type: "warning",
            });
            loading.close();
            console.log(err);
          }
        );
      } else {
        let findContent = new BaaS.TableObject("question_content");
        let findc = new BaaS.Query();
        findc.compare("content", "=", this.questions.question_content);
        let q2 = new BaaS.Query();
        q2.compare("is_delete", "=", false);
        let q3 = new BaaS.Query();
        q3.compare("created_by", "=", Cookie.get("user_id") * 1);
        let andQuery = BaaS.Query.and(findc, q2, q3);
        findContent
          .setQuery(andQuery)
          .limit(1000)
          .find()
          .then(
            (res) => {
              if (res.data.objects.length == 0) {
                let saveContent = new BaaS.TableObject("question_content");
                let savec = saveContent.create();
                savec.set({
                  content: this.questions.question_content,
                  file_url: null,
                  catalog: null,
                  is_delete: false,
                });
                savec.save().then(
                  (res) => {
                    console.log(res);
                    this.questions.question_content = res.data.id;
                    for (
                      let i = 0;
                      i < this.questions.sub_question.length;
                      i++
                    ) {
                      let saveQ = new BaaS.TableObject("questions_information");
                      let saveq = saveQ.create();
                      let temp = {
                        question_content_id: this.questions.question_content,
                        primary_ques_type: this.questions.primary_ques_type,
                        secondary_ques_type: this.questions.secondary_ques_type,
                        question: this.questions.sub_question[i].question,
                        options: JSON.stringify(
                          this.questions.sub_question[i].options
                        ),
                        answer: this.questions.sub_question[i].answer,
                        analysis: this.questions.sub_question[i].analysis,
                        department:
                          this.questions.sub_question[i].department_value,
                        is_delete: false,
                        catalog: cata,
                        // ques_level: this.questions.sub_question[i].level_value,
                        question_class:
                          this.questions.sub_question[i].qclass_value,
                        question_type_5he:
                          this.questions.sub_question[i].fivehe_value,
                        author: this.questions.sub_question[i].author,
                        author_org: this.questions.sub_question[i].author_org,
                        time_created:
                          this.questions.sub_question[i].time_created,
                        topic_outline:
                          this.questions.sub_question[i].topic_value,
                        grade_standard:
                          this.questions.sub_question[i].grade_value,
                        task_outline: this.questions.sub_question[i].task_value,
                        created_by: Cookie.get("user_id") * 1,
                      };
                      saveq
                        .set(temp)
                        .save()
                        .then(
                          (res) => {
                            console.log(res);
                            this.$message({
                              message: "第" + (i + 1) + "题保存成功",
                              type: "success",
                            });
                            if (i == this.questions.sub_question.length - 1) {
                              loading.close();
                              this.back();
                            }
                          },
                          (err) => {
                            this.$message({
                              message: "保存失败",
                              type: "warning",
                            });
                            loading.close();
                            console.log(err);
                          }
                        );
                    }
                  },
                  (err) => {
                    this.$message({
                      message: "保存失败",
                      type: "warning",
                    });
                    loading.close();
                    console.log(err);
                  }
                );
              } else {
                this.questions.question_content = res.data.objects[0].id;
                for (let i = 0; i < this.questions.sub_question.length; i++) {
                  let findQ = new BaaS.TableObject("questions_information");
                  let q1 = new BaaS.Query();
                  let q2 = new BaaS.Query();
                  let q3 = new BaaS.Query();
                  let q4 = new BaaS.Query();
                  let q5 = new BaaS.Query();
                  let q6 = new BaaS.Query();
                  let q7 = new BaaS.Query();
                  let q8 = new BaaS.Query();
                  let q9 = new BaaS.Query();
                  // let q10 = new BaaS.Query();
                  let q11 = new BaaS.Query();
                  let q12 = new BaaS.Query();
                  let q13 = new BaaS.Query();
                  let q14 = new BaaS.Query();
                  let q15 = new BaaS.Query();
                  let q16 = new BaaS.Query();
                  let q17 = new BaaS.Query();
                  let q18 = new BaaS.Query();
                  let q19 = new BaaS.Query();
                  let q20 = new BaaS.Query();
                  q1.compare(
                    "question_content_id",
                    "=",
                    this.questions.question_content
                  );
                  q2.compare(
                    "primary_ques_type",
                    "=",
                    this.questions.primary_ques_type
                  );
                  q3.compare(
                    "secondary_ques_type",
                    "=",
                    this.questions.secondary_ques_type
                  );
                  if (this.questions.sub_question[i].question == null) {
                    q4.isNull("question");
                  } else {
                    q4.compare(
                      "question",
                      "=",
                      this.questions.sub_question[i].question
                    );
                  }
                  q5.compare(
                    "options",
                    "=",
                    JSON.stringify(this.questions.sub_question[i].options)
                  );
                  q6.compare(
                    "answer",
                    "=",
                    this.questions.sub_question[i].answer
                  );
                  if (this.questions.sub_question[i].analysis == null) {
                    q7.isNull("analysis");
                  } else {
                    q7.compare(
                      "analysis",
                      "=",
                      this.questions.sub_question[i].analysis
                    );
                  }
                  if (this.questions.sub_question[i].department_value == null) {
                    q8.isNull("department");
                  } else {
                    q8.compare(
                      "department",
                      "=",
                      this.questions.sub_question[i].department_value
                    );
                  }
                  q9.compare("is_delete", "=", false);
                  // if (this.questions.sub_question[i].level_value == null) {
                  //   q11.isNull("ques_level");
                  // } else {
                  //   q11.compare(
                  //     "ques_level",
                  //     "=",
                  //     this.questions.sub_question[i].level_value
                  //   );
                  // }
                  if (this.questions.sub_question[i].qclass_value == null) {
                    q12.isNull("question_class");
                  } else {
                    q12.compare(
                      "question_class",
                      "=",
                      this.questions.sub_question[i].qclass_value
                    );
                  }
                  if (this.questions.sub_question[i].fivehe_value == null) {
                    q13.isNull("question_type_5he");
                  } else {
                    q13.compare(
                      "question_type_5he",
                      "=",
                      this.questions.sub_question[i].fivehe_value
                    );
                  }
                  if (this.questions.sub_question[i].author == null) {
                    q14.isNull("author");
                  } else {
                    q14.compare(
                      "author",
                      "=",
                      this.questions.sub_question[i].author
                    );
                  }
                  if (this.questions.sub_question[i].author_org == null) {
                    q15.isNull("author_org");
                  } else {
                    q15.compare(
                      "author_org",
                      "=",
                      this.questions.sub_question[i].author_org
                    );
                  }
                  if (this.questions.sub_question[i].time_created == null) {
                    q16.isNull("time_created");
                  } else {
                    q16.compare(
                      "time_created",
                      "=",
                      this.questions.sub_question[i].time_created
                    );
                  }
                  if (this.questions.sub_question[i].topic_value == null) {
                    q17.isNull("topic_outline");
                  } else {
                    q17.compare(
                      "topic_outline",
                      "=",
                      this.questions.sub_question[i].topic_value
                    );
                  }
                  if (this.questions.sub_question[i].grade_value == null) {
                    q18.isNull("grade_standard");
                  } else {
                    q18.compare(
                      "grade_standard",
                      "=",
                      this.questions.sub_question[i].grade_value
                    );
                  }
                  if (this.questions.sub_question[i].task_value == null) {
                    q19.isNull("task_outline");
                  } else {
                    q19.compare(
                      "task_outline",
                      "=",
                      this.questions.sub_question[i].task_value
                    );
                  }
                  q20.compare("created_by", "=", Cookie.get("user_id" * 1));
                  let andQuery = BaaS.Query.and(
                    q1,
                    q2,
                    q3,
                    q4,
                    q5,
                    q6,
                    q7,
                    q8,
                    q9,
                    // q10,
                    q11,
                    q12,
                    q13,
                    q14,
                    q15,
                    q16,
                    q17,
                    q18,
                    q19,
                    q20
                  );
                  findQ
                    .setQuery(andQuery)
                    .limit(1000)
                    .find()
                    .then(
                      (res) => {
                        if (res.data.objects.length == 0) {
                          let saveQ = new BaaS.TableObject(
                            "questions_information"
                          );
                          let saveq = saveQ.create();
                          let temp = {
                            question_content_id:
                              this.questions.question_content,
                            primary_ques_type: this.questions.primary_ques_type,
                            secondary_ques_type:
                              this.questions.secondary_ques_type,
                            question: this.questions.sub_question[i].question,
                            options: JSON.stringify(
                              this.questions.sub_question[i].options
                            ),
                            answer: this.questions.sub_question[i].answer,
                            analysis: this.questions.sub_question[i].analysis,
                            department:
                              this.questions.sub_question[i].department_value,
                            is_delete: false,
                            catalog: cata,
                            // ques_level:
                            // this.questions.sub_question[i].level_value,
                            question_class:
                              this.questions.sub_question[i].qclass_value,
                            question_type_5he:
                              this.questions.sub_question[i].fivehe_value,
                            author: this.questions.sub_question[i].author,
                            author_org:
                              this.questions.sub_question[i].author_org,
                            time_created:
                              this.questions.sub_question[i].time_created,
                            topic_outline:
                              this.questions.sub_question[i].topic_value,
                            grade_standard:
                              this.questions.sub_question[i].grade_value,
                            task_outline:
                              this.questions.sub_question[i].task_value,
                            created_by: Cookie.get("user_id") * 1,
                          };
                          saveq
                            .set(temp)
                            .save()
                            .then(
                              (res) => {
                                console.log(res);
                                this.$message({
                                  message: "第" + (i + 1) + "题保存成功",
                                  type: "success",
                                });
                                if (
                                  i ==
                                  this.questions.sub_question.length - 1
                                ) {
                                  loading.close();
                                  this.back();
                                }
                              },
                              (err) => {
                                this.$message({
                                  message: "保存失败",
                                  type: "warning",
                                });
                                loading.close();
                                console.log(err);
                              }
                            );
                        } else {
                          this.$message({
                            message: "第" + (i + 1) + "题已存在",
                            type: "warning",
                          });
                          if (i == this.questions.sub_question.length - 1) {
                            loading.close();
                            this.back();
                          }
                        }
                      },
                      (err) => {
                        this.$message({
                          message: "保存失败",
                          type: "warning",
                        });
                        loading.close();
                        console.log(err);
                      }
                    );
                }
              }
            },
            (err) => {
              this.$message({
                message: "保存失败",
                type: "warning",
              });
              loading.close();
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
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px dashed #c0c4cc;
}
.edit_ques_content .material {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
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
.knowledge .el-input {
  width: initial;
}
.ques_checkEdit .sub_ques_check {
  display: flex;
  justify-content: flex-end;
}
.ques_checkEdit .main_right_check {
  margin-top: 10px;
}
</style>