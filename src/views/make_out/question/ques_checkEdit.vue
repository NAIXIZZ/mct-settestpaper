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
        <audio :src="audio" controls="controls" v-if="audio != ''"></audio>
        <img
          :src="file_url"
          alt=""
          style="height: 250px"
          v-if="
            file_url != '' &&
            (file_url.search('.png') != -1 ||
              file_url.search('.jpg') != -1 ||
              file_url.search('.gif') != -1)
          "
        />
        <div class="details">
          <p
            class="details_ques_content"
            v-if="
              content.search('.png') == -1 &&
              content.search('.jpg') == -1 &&
              content.search('.gif') == -1 &&
              content.search('.mp3') == -1 &&
              content.search('.wav') == -1 &&
              content.search('.ogg') == -1
            "
          >
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
        <div class="edit_ques_content">
          <div class="material">
            题干：
            <div id="material">
              <p
                v-if="
                  content.search('.png') == -1 &&
                  content.search('.jpg') == -1 &&
                  content.search('.gif') == -1 &&
                  content.search('.mp3') == -1 &&
                  content.search('.wav') == -1 &&
                  content.search('.ogg') == -1
                "
              >
                {{ content }}
              </p>
              <img
                :src="file_url"
                alt=""
                height="250px"
                v-if="
                  file_url != '' &&
                  (file_url.search('.png') != -1 ||
                    file_url.search('.jpg') != -1 ||
                    file_url.search('.gif') != -1)
                "
              />
            </div>
          </div>
          <p class="warn">
            音频、表格和文本仅支持一项，表格上传请点击提示查看模板，保存后将生成图片。
          </p>
          <el-upload
            v-if="question.primary_ques_type == '听力'"
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
            v-if="audio != '' && question.primary_ques_type == '听力'"
          ></audio>
          <div
            v-if="question.secondary_ques_type == '阅读材料，选择正确答案'"
            style="display: flex; flex-direction: row; align-items: center"
          >
            <el-upload
              ref="upload"
              action=""
              class="upload-demo"
              :multiple="false"
              accept=".xls,.xlsx"
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
        <p class="warn">选项：答案选中项为正确答案标示。</p>
        <div style="border-bottom: 1px dashed #c0c4cc">
          <div class="question">
            问题：
            <div id="question">
              <p>{{ question.question }}</p>
            </div>
          </div>
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
          <div class="ques_analysis">
            解析：
            <div id="analysis">
              <p>{{ question.analysis }}</p>
            </div>
          </div>
        </div>
        <!-- <div class="knowledge">
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
        </div> -->
        <div class="knowledge">
          MCT等级：
          <!-- <el-cascader
            v-model="grade_value"
            :options="grade_standard"
            :props="props"
            collapse-tags
            clearable
            placeholder="请选择等级标准"
          ></el-cascader> -->
          <el-select
            v-model="grade_value1"
            placeholder="请选择"
            @change="levelChange"
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
            v-model="grade_value2"
            placeholder="请选择"
            v-if="grade_value1 != ''"
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
            v-model="topic_value"
            :options="topic_outline"
            :props="props"
            collapse-tags
            clearable
            placeholder="请选择话题大纲"
          ></el-cascader> -->
          <el-select
            v-model="topic_value1"
            placeholder="请选择"
            @change="topicChange"
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
            v-model="topic_value2"
            placeholder="请选择"
            v-if="topic_value1 == '医生-医生'"
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
            v-model="topic_value2"
            placeholder="请选择"
            v-if="topic_value1 == '医生-患者'"
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
            v-model="topic_value2"
            placeholder="请选择"
            v-if="topic_value1 == '医生-护士'"
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
            v-model="topic_value2"
            placeholder="请选择"
            v-if="topic_value1 == '患者-护士'"
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
          <el-input
            v-model="time_created"
            placeholder="选择题目创作日期"
          ></el-input>
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
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
// import Cookie from "js-cookie";
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
      audior: "",
      audio: "",
      fileList: [],
      option: ["A", "B", "C", "D"],
      selectQues: "",
      editor: [],
      // editorContent: "",
      initial: [],
      question: [],
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
      grade_value1: "",
      grade_value2: "",
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
      topic_value1: "",
      topic_value2: "",
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
      initial_content: "",
      initial_file: "",
      initail_audio: "",
      excelfileList: [],
      file_urlr: "",
    };
  },
  watch: {},
  computed: {},
  methods: {
    levelChange() {
      this.grade_value2 = "";
    },
    topicChange() {
      this.topic_value2 = "";
    },
    beforeAvatarUpload(file) {
      let isFile =
        file.name.split(".")[file.name.split(".").length - 1] == "mp3" ||
        file.name.split(".")[file.name.split(".").length - 1] == "wav" ||
        file.name.split(".")[file.name.split(".").length - 1] == "ogg";
      if (!isFile) {
        this.$message.error("导入文件格式不正确");
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
      const loading = this.$loading({
        lock: true,
        text: "请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      var BaaS = require("minapp-sdk");
      let clientID = "395062a19e209a770059";
      BaaS.init(clientID);
      var query = new BaaS.Query();
      // query.compare("id", "=", Cookie.get("ques_checkEdit"));
      query.compare("id", "=", sessionStorage.getItem("ques_checkEdit"));
      let Question = new BaaS.TableObject("questions_information");
      Question.setQuery(query).limit(1000)
        .find()
        .then(
          (res) => {
            this.question = res.data.objects[0];
            if (this.question.options != null) {
              let str = this.question.options.replace(/\s*/g, "");
              let tempa = -1;
              let tempb = -1;
              let tempc = -1;
              let tempd = -1;
              if (str.indexOf('","index":"A"') != -1) {
                tempa = str.indexOf('","index":"A"');
              } else if (str.indexOf("','index':'A'") != -1) {
                tempa = str.indexOf("','index':'A'");
              }
              if (str.indexOf('","index":"B"') != -1) {
                tempb = str.indexOf('","index":"B"');
              } else if (str.indexOf("','index':'B'") != -1) {
                tempb = str.indexOf("','index':'B'");
              }
              if (str.indexOf('","index":"C"') != -1) {
                tempc = str.indexOf('","index":"C"');
              } else if (str.indexOf("','index':'C'") != -1) {
                tempc = str.indexOf("','index':'C'");
              }
              if (str.indexOf('","index":"D"') != -1) {
                tempd = str.indexOf('","index":"D"');
              } else if (str.indexOf("','index':'D'") != -1) {
                tempd = str.indexOf("','index':'D'");
              }
              let a = "";
              let b = "";
              let c = "";
              let d = "";
              if (tempa != -1) {
                while (str[tempa - 1] != '"' && str[tempa - 1] != "'") {
                  a += str[tempa - 1];
                  tempa--;
                }
                a = a.split("").reverse().join("");
              }
              if (tempb != -1) {
                while (str[tempb - 1] != '"' && str[tempb - 1] != "'") {
                  b += str[tempb - 1];
                  tempb--;
                }
                b = b.split("").reverse().join("");
              }
              if (tempc != -1) {
                while (str[tempc - 1] != '"' && str[tempc - 1] != "'") {
                  c += str[tempc - 1];
                  tempc--;
                }
                c = c.split("").reverse().join("");
              }
              if (tempd != -1) {
                while (str[tempd - 1] != '"' && str[tempd - 1] != "'") {
                  d += str[tempd - 1];
                  tempd--;
                }
                d = d.split("").reverse().join("");
              }
              let o = [
                {
                  content: a,
                  index: "A",
                },
                {
                  content: b,
                  index: "B",
                },
                {
                  content: c,
                  index: "C",
                },
                {
                  content: d,
                  index: "D",
                },
              ];
              this.question.options = o;
            }
            this.initial = res.data.objects[0];
            // if (this.question.ques_level != null) {
            //   this.level_value = this.question.ques_level;
            // }
            if (this.question.grade_standard != null) {
              this.grade_value1 = this.question.grade_standard[0];
              this.grade_value2 = this.question.grade_standard[1];
            }
            if (this.question.topic_outline != null) {
              this.topic_value1 = this.question.topic_outline[0];
              this.topic_value2 = this.question.topic_outline[1];
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
            loading.close();
          },
          (err) => {
            console.log(err);
          }
        );
      this.initial_content = this.content;
      this.initial_file = this.file_url;
      this.initail_audio = this.audio;
    },
    back() {
      // Cookies.set("ques_checkEdit", "");
      // Cookies.set("question_content", "");
      // Cookies.set("question_file", "");
      // Cookies.set("selectQues", "false");
      sessionStorage.setItem("ques_checkEdit", "");
      sessionStorage.setItem("question_content", "");
      sessionStorage.setItem("question_file", "");
      sessionStorage.setItem("selectQues", "false");
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
      if (this.question.primary_ques_type != "听力") {
        this.handleRemove();
      }
      if (this.question.secondary_ques_type != "阅读材料，选择正确答案") {
        this.excelRemove();
      }
      var valid = true;
      // if (this.level_value == "") {
      //   this.question.ques_level = null;
      // } else {
      //   this.question.ques_level = this.level_value;
      // }
      if (this.grade_value1 == "") {
        this.question.grade_standard = null;
      } else {
        if (this.grade_value2 == "") {
          this.$message({
            message: "请选择MCT等级",
            type: "warning",
          });
          valid = false;
        } else {
          this.question.grade_standard = [this.grade_value1, this.grade_value2];
        }
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
        if (this.topic_value2 == "") {
          this.$message({
            message: "请选择话题大纲",
            type: "warning",
          });
          valid = false;
        } else {
          this.question.topic_outline = [this.topic_value1, this.topic_value2];
        }
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
          if (
            this.editor[i].txt.html() == "" &&
            this.audio == "" &&
            this.file_url == ""
          ) {
            this.content = "";
            this.$message({
              message: "请填写题干",
              type: "warning",
            });
            valid = false;
            break;
          } else {
            if (
              this.editor[i].txt.html().search("<img src=") != -1 &&
              this.audio == "" &&
              this.file_url == ""
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
              (this.editor[i].txt.html().search("<img src=") != -1 &&
                this.audio != "") ||
              (this.editor[i].txt.html().search("<img src=") != -1 &&
                this.file_url != "") ||
              (this.audio != "" && this.file_url != "")
            ) {
              this.$message({
                message: "音频、表格和文本只支持一项，请修改",
                type: "warning",
              });
              valid = false;
              break;
            }
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
    saveQues() {
      const loading = this.$loading({
        lock: true,
        text: "正在保存中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.dialogVisible = false;
      if (this.content != this.initial_content) {
        if (this.file_url != "" && this.file_url != this.initial_file) {
          if (
            this.file_url.search("image") != -1 ||
            this.file_url.search("mp3") != -1 ||
            this.file_url.search("wav") != -1 ||
            this.file_url.search("ogg") != -1
          ) {
            const result = this.dataURLtoFile(this.file_url, "图片.png");
            let addFile = new BaaS.File();
            let file = { fileObj: result };
            addFile.upload(file).then(
              (res) => {
                let saveContent = new BaaS.TableObject("question_content");
                let content = saveContent.limit(1000).getWithoutData(
                  this.question.question_content_id
                );
                content.set({
                  content: this.content,
                  file_url: res.data.file,
                  catalog: null,
                  is_delete: false,
                });
                content.update().then(
                  (res) => {
                    this.question.question_content_id = res.data.id;
                    // Cookies.set("question_file", res.data.file_url.path);
                    sessionStorage.setItem(
                      "question_file",
                      res.data.file_url.path
                    );
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
          } else if (
            this.file_url.search("sheet") != -1 ||
            this.file_url.search("xls") != -1 ||
            this.file_url.search("xlsx") != -1
          ) {
            const result = this.dataURLtoFile(this.file_url, "表格.xlsx");
            let addFile = new BaaS.File();
            let file = { fileObj: result };
            addFile.upload(file).then(
              (res) => {
                let saveContent = new BaaS.TableObject("question_content");
                let content = saveContent.limit(1000).getWithoutData(
                  this.question.question_content_id
                );
                content.set({
                  content: this.content,
                  file_url: res.data.file,
                  excel: res.data.file,
                  catalog: null,
                  is_delete: false,
                });
                content.update().then(
                  (res) => {
                    this.question.question_content_id = res.data.id;
                    // Cookies.set("question_file", res.data.file_url.path);
                    sessionStorage.setItem(
                      "question_file",
                      res.data.file_url.path
                    );
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
        } else if (this.audio != "" && this.audio != this.initail_audio) {
          let addFile = new BaaS.File();
          let file = { fileObj: this.audior };
          addFile.upload(file).then(
            (res) => {
              let saveContent = new BaaS.TableObject("question_content");
              let content = saveContent.limit(1000).getWithoutData(
                this.question.question_content_id
              );
              content.set({
                content: this.content,
                file_url: res.data.file,
                catalog: null,
                is_delete: false,
              });
              content.update().then(
                (res) => {
                  this.question.question_content_id = res.data.id;
                  // Cookies.set("question_file", res.data.file_url.path);
                  sessionStorage.setItem(
                    "question_file",
                    res.data.file_url.path
                  );
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
        } else {
          let saveContent = new BaaS.TableObject("question_content");
          let content = saveContent.limit(1000).getWithoutData(
            this.question.question_content_id
          );
          content.set("content", this.content);
          content.update().then(
            (res) => {
              this.question.question_content_id = res.data.id;
              // Cookies.set("question_content", this.content);
              sessionStorage.setItem("question_content", this.content);
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }
      if (this.question.options != null) {
        this.question.options = JSON.stringify(this.question.options);
      }
      // if (Cookie.get("catalog") != "") {
      //   this.question.catalog = Cookie.get("catalog");
      if (sessionStorage.getItem("catalog") != "") {
        this.question.catalog = sessionStorage.getItem("catalog");
      }
      console.log(this.question.grade_value);
      let saveQues = new BaaS.TableObject("questions_information");
      let question = saveQues.limit(1000).getWithoutData(this.question.id);
      question.set(this.question);
      question.update().then(
        (res) => {
          this.question.options = JSON.parse(this.question.options);
          this.$message({
            message: "题目保存成功",
            type: "success",
          });
          loading.close();
          this.quesCheck();
        },
        (err) => {
          console.log(err);
          this.$message({
            message: "题目保存失败",
            type: "danger",
          });
          loading.close();
        }
      );
    },
    createEdit() {
      const material = new E("#material");
      material.config.uploadImgShowBase64 = true;
      material.config.height = 200;
      material.config.zIndex = 7;
      material.config.placeholder = "请输入题干";
      material.create();
      this.editor.push(material);
      const question = new E("#question");
      question.config.uploadImgShowBase64 = true;
      question.config.height = 50;
      question.config.zIndex = 6;
      question.config.placeholder = "请输入问题";
      question.create();
      this.editor.push(question);
      if (this.question.options) {
        for (let i = 1; i <= this.question.options.length; i++) {
          var alphabet = String.fromCharCode(64 + parseInt(i));
          var option = new E("#" + alphabet);
          option.config.uploadImgShowBase64 = true;
          option.config.height = 50;
          option.config.zIndex = 6 - i;
          option.config.placeholder = "请输入选项";
          option.create();
          this.editor.push(option);
        }
      }
      if (this.question.primary_ques_type == "写作") {
        const answer = new E("#answer");
        answer.config.uploadImgShowBase64 = true;
        answer.config.height = 100;
        answer.config.zIndex = 1;
        answer.config.placeholder = "请输入答案";
        answer.create();
        this.editor.push(answer);
      }
      const analysis = new E("#analysis");
      analysis.config.uploadImgShowBase64 = true;
      analysis.config.height = 100;
      analysis.config.zIndex = 0;
      analysis.config.placeholder = "请输入解析";
      analysis.create();
      this.editor.push(analysis);
    },
    excelChange(file, fileList) {
      this.excelfileList.push(file);
      if (/\.(xls)$/.test(file.raw.name) || /\.(xlsx)$/.test(file.raw.name)) {
        var reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = () => {
          const result = this.dataURLtoFile(reader.result, file.raw.name);
          new Promise((resolve, reject) => {
            this.file_url = reader.result;
            this.file_urlr = result;
          });
        };
      }
    },
    excelRemove(file, fileList) {
      this.excelfileList = [];
      this.file_url = "";
      this.file_urlr = "";
    },
  },
  created() {},
  mounted() {
    // this.selectQues = Cookie.get("selectQues");
    // this.content = Cookie.get("question_content");
    // this.file_url = Cookie.get("question_file");
    this.selectQues = sessionStorage.getItem("selectQues");
    this.content = sessionStorage.getItem("question_content");
    this.file_url = sessionStorage.getItem("question_file");
    if (this.file_url != "") {
      if (
        this.file_url.search(".mp3") != -1 ||
        this.file_url.search(".wav") != -1 ||
        this.file_url.search("ogg") != -1
      ) {
        this.audio = this.file_url;
        this.file_url = "";
        this.fileList.push({ name: this.audio, url: this.audio });
      }
    }

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