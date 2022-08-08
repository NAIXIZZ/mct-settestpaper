<template>
  <div class="preview">
    <div class="top">
      <h1 class="title">试卷预览</h1>
      <!-- <el-col :span="2" style="margin-left: 50%">
          <el-button type="success" @click="generate()">试卷导出</el-button>
        </el-col>
        <el-col :span="2">
          <template>
            <el-checkbox v-model="isAnswer" style="margin-top: 10px"
              >包含答案</el-checkbox
            >
          </template>
        </el-col>
        <el-col :span="2">
          <template>
            <el-checkbox v-model="isAnalysis" style="margin-top: 10px"
              >包含解析</el-checkbox
            >
          </template>
        </el-col> -->
      <el-button @click="returnHome">返回</el-button>
    </div>
    <!-- <el-row> -->
    <el-card class="box-card">
      <el-row
        ><span style="font-size: 25px">{{
          paper_message.paper_title
        }}</span></el-row
      >
      <el-row style="margin-top: 15px">
        <el-col :span="8" style="margin-left: 34%">
          <span style="font-size: 15px">
            创建人：{{ paper_message.created_user_id }}
            <el-divider direction="vertical"></el-divider>
            题量：{{ paper_message.questions_num }}
            <el-divider direction="vertical"></el-divider>
            满分：{{ paper_message.points }}
          </span>
        </el-col>
        <el-col :span="2">
          <template>
            <el-checkbox v-model="showAnswer">显示答案</el-checkbox>
          </template>
        </el-col>
        <el-col :span="2">
          <template>
            <el-checkbox v-model="showAnalysis">显示解析</el-checkbox>
          </template>
        </el-col>
      </el-row>
    </el-card>
    <!-- </el-row> -->
    <!-- <el-row> -->
    <el-card class="box-card" v-if="exam == true">
      <div class="left">
        <div
          v-if="
            listen_sentence.length != 0 ||
            listen_sdialogue.length != 0 ||
            listen_ldialogue.length != 0 ||
            listen_essay.length != 0
          "
        >
          <div class="primary">
            <div class="primary_title">一、听力</div>
            <div>（共{{ ln }}题，共{{ ls }}分）</div>
          </div>
          <div v-if="listen_sentence.length != 0" class="stype">
            <div class="secondary">
              <div class="secondary_title">
                {{ listen_sentence.types }}听句子，判断对错
              </div>
              <div>
                （共{{ listen_sentence.num }}题，共{{
                  listen_sentence.score
                }}分）
              </div>
            </div>
            <div v-for="item in listen_sentence" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="listen_sdialogue.length != 0">
            <div class="secondary">
              <div class="secondary_title">
                {{ listen_sdialogue.types }}听短对话，选择正确答案
              </div>
              <div>
                （共{{ listen_sdialogue.num }}题，共{{
                  listen_sdialogue.score
                }}分）
              </div>
            </div>
            <div v-for="item in listen_sdialogue" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.index }}.{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="listen_ldialogue.length != 0">
            <div class="secondary">
              <div class="secondary_title">
                {{ listen_ldialogue.types }}听长对话，选择正确答案
              </div>
              <div>
                （共{{ listen_ldialogue.num }}题，共{{
                  listen_ldialogue.score
                }}分）
              </div>
            </div>
            <div v-for="item in listen_ldialogue" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.index }}.{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="listen_essay.length != 0">
            <div class="secondary">
              <div class="secondary_title">
                {{ listen_essay.types }}听短文，选择正确答案
              </div>
              <div>
                （共{{ listen_essay.num }}题，共{{ listen_essay.score }}分）
              </div>
            </div>
            <div v-for="item in listen_essay" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.index }}.{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="
            read_word.length != 0 ||
            read_phrase.length != 0 ||
            read_material.length != 0 ||
            read_essay.length != 0
          "
        >
          <div class="primary">
            <div
              v-if="
                listen_sentence.length != 0 ||
                listen_sdialogue.length != 0 ||
                listen_ldialogue.length != 0 ||
                listen_essay.length != 0
              "
              class="primary_title"
            >
              二、阅读
            </div>
            <div v-else class="primary_title">一、阅读</div>
            <div>（共{{ rn }}题，共{{ rs }}分）</div>
          </div>
          <div v-if="read_word.length != 0">
            <div class="secondary">
              <div class="secondary_title">
                {{ read_word.types }}选择正确的词语填空
              </div>
              <div>（共{{ read_word.num }}题，共{{ read_word.score }}分）</div>
            </div>
            <div v-for="item in read_word" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.index }}.{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="read_phrase.length != 0">
            <div class="secondary">
              <div class="secondary_title">
                {{ read_phrase.types }}阅读语段，选择与语段意思一致的一项
              </div>
              <div>
                （共{{ read_phrase.num }}题，共{{ read_phrase.score }}分）
              </div>
            </div>
            <div v-for="item in read_phrase" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.index }}.{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="read_material.length != 0">
            <div class="secondary">
              <div class="secondary_title">
                {{ read_material.types }}阅读材料，选择正确答案
              </div>
              <div>
                （共{{ read_material.num }}题，共{{ read_material.score }}分）
              </div>
            </div>
            <div v-for="item in read_material" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.index }}.{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="read_essay.length != 0">
            <div class="secondary">
              <div class="secondary_title">
                {{ read_essay.types }}阅读短文，选择正确答案
              </div>
              <div>
                （共{{ read_essay.num }}题，共{{ read_essay.score }}分）
              </div>
            </div>
            <div v-for="item in read_essay" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.index }}.{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="write.length != 0">
          <div class="primary">
            <div
              v-if="
                (listen_sentence.length != 0 ||
                  listen_sdialogue.length != 0 ||
                  listen_ldialogue.length != 0 ||
                  listen_essay.length != 0) &&
                (read_word.length != 0 ||
                  read_phrase.length != 0 ||
                  read_material.length != 0 ||
                  read_essay.length != 0)
              "
              class="primary_title"
            >
              三、写作
            </div>
            <div
              v-else-if="
                listen_sentence.length == 0 &&
                listen_sdialogue.length == 0 &&
                listen_ldialogue.length == 0 &&
                listen_essay.length == 0 &&
                read_word.length == 0 &&
                read_phrase.length == 0 &&
                read_material.length == 0 &&
                read_essay.length == 0
              "
              class="primary_title"
            >
              一、写作
            </div>
            <div v-else class="primary_title">二、写作</div>
            <div>（共{{ wn }}题，共{{ ws }}分）</div>
          </div>

          <div v-if="write.length != 0">
            <div class="secondary">
              <div class="secondary_title">根据一段长对话写门诊病历记录</div>
              <div>（共{{ write.num }}题，共{{ write.score }}分）</div>
            </div>
            <div v-for="item in write" :key="item.id">
              <div class="question">
                <audio
                  :src="item.question_content"
                  controls="controls"
                  v-if="
                    item.question_content.search('.mp3') != -1 ||
                    item.question_content.search('.wav') != -1 ||
                    item.question_content.search('.ogg') != -1
                  "
                ></audio>
                <img
                  :src="item.question_content"
                  v-else-if="
                    item.question_content.search('.png') != -1 ||
                    item.question_content.search('.jpg') != -1 ||
                    item.question_content.search('.gif') != -1
                  "
                />
                <p v-else>{{ item.question_content }}</p>
                <div v-for="s in item.sub_question" :key="s.actual_sequence">
                  <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                  <div v-for="o in s.options" :key="o.index">
                    <p class="options">{{ o.index }}.{{ o.content }}</p>
                  </div>
                  <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                  <p class="analysis" v-if="showAnalysis">
                    解析：{{ s.analysis }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" v-if="exam == false">
      <div class="left">
        <div v-for="(type, i) in ques_type" :key="type.index">
          <div class="primary">
            <div class="primary_title">
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
            <div>（共{{ type.total_num }}题，共{{ type.total_score }}分）</div>
          </div>
          <div
            v-for="(stype, j) in type.secondary"
            :key="stype.start"
            class="stype"
          >
            <div class="secondary">
              <div class="secondary_title">
                <p v-if="j == 0">（一）</p>
                <p v-else-if="j == 1">（二）</p>
                <p v-else-if="j == 2">（三）</p>
                <p v-else-if="j == 3">（四）</p>
                {{ stype.type }}
              </div>
              <div>（共{{ stype.num }}题，共{{ stype.score }}分）</div>
            </div>
            <div v-for="item in questions" :key="item.sequence">
              <div
                v-if="
                  item.sequence - 1 >= stype.start &&
                  item.sequence - 1 <= stype.end
                "
              >
                <div class="question">
                  <audio
                    :src="item.question_content"
                    controls="controls"
                    v-if="
                      item.question_content.search('.mp3') != -1 ||
                      item.question_content.search('.wav') != -1 ||
                      item.question_content.search('.ogg') != -1
                    "
                  ></audio>
                  <img
                    :src="item.question_content"
                    v-else-if="
                      item.question_content.search('.png') != -1 ||
                      item.question_content.search('.jpg') != -1 ||
                      item.question_content.search('.gif') != -1
                    "
                  />
                  <p v-else>{{ item.question_content }}</p>
                  <div v-for="s in item.sub_question" :key="s.actual_sequence">
                    <div>{{ s.actual_sequence }}.{{ s.question }}</div>
                    <div v-for="o in s.options" :key="o.index">
                      <p
                        class="options"
                        v-if="stype.type == '听句子，判断对错'"
                      >
                        {{ o.content }}
                      </p>
                      <p class="options" v-else>
                        {{ o.index }}.{{ o.content }}
                      </p>
                    </div>
                    <p class="answer" v-if="showAnswer">答案：{{ s.answer }}</p>
                    <p class="analysis" v-if="showAnalysis">
                      解析：{{ s.analysis }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- </el-row> -->
  </div>
</template>

<script src="https://dl.ifanr.cn/hydrogen/sdk/sdk-web-latest.js"></script>
<script>
import Cookies from "js-cookie";
import Cookie from "js-cookie";
import "docxtemplater/build/docxtemplater.js";
import "pizzip/dist/pizzip.js";
import "pizzip/dist/pizzip-utils.js";
import "file-saver";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      isAnswer: false,
      isAnalysis: false,
      showAnswer: true,
      showAnalysis: true,
      paper_message: {
        paper_title: "",
        created_user_id: "",
        questions_num: "",
        points: "",
      },
      questions_id: [],
      questions_detail: [],
      listen_sentence: [],
      listen_sdialogue: [],
      listen_ldialogue: [],
      listen_essay: [],
      read_word: [],
      read_phrase: [],
      read_material: [],
      read_essay: [],
      write: [],
      exam: false,
      questions: [],
      ques_type: [],
      ln: 0,
      ls: 0,
      rn: 0,
      rs: 0,
      wn: 0,
      ws: 0,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    returnHome() {
      this.$router.go(-1);
    },
    getData() {
      this.paper_message.paper_title = sessionStorage.getItem("title");
      this.paper_message.created_user_id = Cookie.get("user_id");
      this.paper_message.questions_num = sessionStorage.getItem("ques_num");
      this.paper_message.points = sessionStorage.getItem("ques_score");
      if (sessionStorage.getItem("exam") == "true") {
        this.exam = true;
      } else {
        this.exam = false;
      }
      this.questions = JSON.parse(sessionStorage.getItem("questions"));
      this.ques_type = JSON.parse(sessionStorage.getItem("ques_type"));
      if (this.exam == true) {
        for (let i = 0; i < this.ques_type.length; i++) {
          if (this.ques_type[i].primary == "听力") {
            this.ln = this.ques_type[i].total_num;
            this.ls = this.ques_type[i].total_score;
          } else if (this.ques_type[i].primary == "阅读") {
            this.rn = this.ques_type[i].total_num;
            this.rs = this.ques_type[i].total_score;
          } else if (this.ques_type[i].primary == "写作") {
            this.wn = this.ques_type[i].total_num;
            this.ws = this.ques_type[i].total_score;
          }
          for (let j = 0; j < this.ques_type[i].secondary.length; j++) {
            if ((this.ques_type[i].secondary[j].type = "听句子，判断对错")) {
              this.listen_sentence.num = this.ques_type[i].secondary[j].num;
              this.listen_sentence.score = this.ques_type[i].secondary[j].score;
            } else if (
              (this.ques_type[i].secondary[j].type = "听短对话，选择正确答案")
            ) {
              this.listen_sdialogue.num = this.ques_type[i].secondary[j].num;
              this.listen_sdialogue.score =
                this.ques_type[i].secondary[j].score;
            } else if (
              (this.ques_type[i].secondary[j].type = "听长对话，选择正确答案")
            ) {
              this.listen_ldialogue.num = this.ques_type[i].secondary[j].num;
              this.listen_ldialogue.score =
                this.ques_type[i].secondary[j].score;
            } else if (
              (this.ques_type[i].secondary[j].type = "听短文，选择正确答案")
            ) {
              this.listen_essay.num = this.ques_type[i].secondary[j].num;
              this.listen_essay.score = this.ques_type[i].secondary[j].score;
            } else if (
              (this.ques_type[i].secondary[j].type = "选择正确的词语填空")
            ) {
              this.read_word.num = this.ques_type[i].secondary[j].num;
              this.read_word.score = this.ques_type[i].secondary[j].score;
            } else if (
              (this.ques_type[i].secondary[j].type =
                "阅读语段，选择与语段意思一致的一项")
            ) {
              this.read_phrase.num = this.ques_type[i].secondary[j].num;
              this.read_phrase.score = this.ques_type[i].secondary[j].score;
            } else if (
              (this.ques_type[i].secondary[j].type = "阅读材料，选择正确答案")
            ) {
              this.read_material.num = this.ques_type[i].secondary[j].num;
              this.read_material.score = this.ques_type[i].secondary[j].score;
            } else if (
              (this.ques_type[i].secondary[j].type = "阅读短文，选择正确答案")
            ) {
              this.read_essay.num = this.ques_type[i].secondary[j].num;
              this.read_essay.score = this.ques_type[i].secondary[j].score;
            } else if (
              (this.ques_type[i].secondary[j].type =
                "根据一段长对话写门诊病历记录")
            ) {
              this.write.num = this.ques_type[i].secondary[j].num;
              this.write.score = this.ques_type[i].secondary[j].score;
            }
          }
        }
        for (let i = 0; i < this.questions.length; i++) {
          if (this.questions[i].secondary_ques_type == "听句子，判断对错") {
            this.listen_sentence.push(this.questions[i]);
          } else if (
            this.questions[i].secondary_ques_type == "听短对话，选择正确答案"
          ) {
            this.listen_sdialogue.push(this.questions[i]);
          } else if (
            this.questions[i].secondary_ques_type == "听长对话，选择正确答案"
          ) {
            this.listen_ldialogue.push(this.questions[i]);
          } else if (
            this.questions[i].secondary_ques_type == "听短文，选择正确答案"
          ) {
            this.listen_essay.push(this.questions[i]);
          } else if (
            this.questions[i].secondary_ques_type == "选择正确的词语填空"
          ) {
            this.read_word.push(this.questions[i]);
          } else if (
            this.questions[i].secondary_ques_type ==
            "阅读语段，选择与语段意思一致的一项"
          ) {
            this.read_phrase.push(this.questions[i]);
          } else if (
            this.questions[i].secondary_ques_type == "阅读材料，选择正确答案"
          ) {
            this.read_material.push(this.questions[i]);
          } else if (
            this.questions[i].secondary_ques_type == "阅读短文，选择正确答案"
          ) {
            this.read_essay.push(this.questions[i]);
          } else if (
            this.questions[i].secondary_ques_type ==
            "根据一段长对话写门诊病历记录"
          ) {
            this.write.push(this.questions[i]);
          }
        }
        let sequence = 1;
        let types = ["（一）", "（二）", "（三）", "（四）"];
        let num = 0;
        if (this.listen_sentence.length != 0) {
          this.listen_sentence.types = types[num];
          num++;
          for (let i = 0; i < this.listen_sentence.length; i++) {
            for (
              let j = 0;
              j < this.listen_sentence[i].sub_question.length;
              j++
            ) {
              this.listen_sentence[i].sub_question[j].actual_sequence =
                sequence;
              sequence++;
            }
          }
        }
        if (this.listen_sdialogue.length != 0) {
          this.listen_sdialogue.types = types[num];
          num++;
          for (let i = 0; i < this.listen_sdialogue.length; i++) {
            for (
              let j = 0;
              j < this.listen_sdialogue[i].sub_question.length;
              j++
            ) {
              this.listen_sdialogue[i].sub_question[j].actual_sequence =
                sequence;
              sequence++;
            }
          }
        }
        if (this.listen_ldialogue.length != 0) {
          this.listen_ldialogue.types = types[num];
          num++;
          for (let i = 0; i < this.listen_ldialogue.length; i++) {
            for (
              let j = 0;
              j < this.listen_ldialogue[i].sub_question.length;
              j++
            ) {
              this.listen_ldialogue[i].sub_question[j].actual_sequence =
                sequence;
              sequence++;
            }
          }
        }
        if (this.listen_essay.length != 0) {
          this.listen_essay.types = types[num];
          num++;
          for (let i = 0; i < this.listen_essay.length; i++) {
            for (let j = 0; j < this.listen_essay[i].sub_question.length; j++) {
              this.listen_essay[i].sub_question[j].actual_sequence = sequence;
              sequence++;
            }
          }
        }
        num = 0;
        if (this.read_word.length != 0) {
          this.read_word.types = types[num];
          num++;
          for (let i = 0; i < this.read_word.length; i++) {
            for (let j = 0; j < this.read_word[i].sub_question.length; j++) {
              this.read_word[i].sub_question[j].actual_sequence = sequence;
              sequence++;
            }
          }
        }
        if (this.read_phrase.length != 0) {
          this.read_phrase.types = types[num];
          num++;
          for (let i = 0; i < this.read_phrase.length; i++) {
            for (let j = 0; j < this.read_phrase[i].sub_question.length; j++) {
              this.read_phrase[i].sub_question[j].actual_sequence = sequence;
              sequence++;
            }
          }
        }
        if (this.read_material.length != 0) {
          this.read_material.types = types[num];
          num++;
          for (let i = 0; i < this.read_material.length; i++) {
            for (
              let j = 0;
              j < this.read_material[i].sub_question.length;
              j++
            ) {
              this.read_material[i].sub_question[j].actual_sequence = sequence;
              sequence++;
            }
          }
        }
        if (this.read_essay.length != 0) {
          this.read_essay.types = types[num];
          num++;
          for (let i = 0; i < this.read_essay.length; i++) {
            for (let j = 0; j < this.read_essay[i].sub_question.length; j++) {
              this.read_essay[i].sub_question[j].actual_sequence = sequence;
              sequence++;
            }
          }
        }
        num = 0;
        if (this.write.length != 0) {
          this.write.types = types[num];
          for (let i = 0; i < this.write.length; i++) {
            for (let j = 0; j < this.write[i].sub_question.length; j++) {
              this.write[i].sub_question[j].actual_sequence = sequence;
              sequence++;
            }
          }
        }
      }
    },
    // 导出word
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
    generate() {
      var ImageModule = require("open-docxtemplater-image-module");
      // 点击导出word
      var that = this;
      this.loadFile("word.docx", function (error, content) {
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
          ...that.paper_message,
          listen_sentence: that.listen_sentence,
          listen_sdialogue: that.listen_sdialogue,
          listen_ldialogue: that.listen_ldialogue,
          listen_essay: that.listen_essay,
          read_word: that.read_word,
          read_phrase: that.read_phrase,
          read_material: that.read_material,
          read_essay: that.read_essay,
          write: that.write,
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
        saveAs(out, that.paper_message.paper_title + ".docx");
      });
    },
  },
};
</script>
<style>
.preview {
  padding: 10px 70px;
}
.preview .top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 70px;
  border-bottom: 1px solid #cecdcd;
  margin-bottom: 20px;
}
.preview .left {
  text-align: left;
  font-size: 20px;
}
.preview .primary,
.preview .secondary {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  line-height: 40px;
}
.preview .primary {
  background-color: #cecdcd;
}
.preview .primary_title {
  display: flex;
  flex-direction: row;
  font-size: 25px;
  font-weight: bolder;
}
.preview .secondary_title {
  display: flex;
  flex-direction: row;
  font-size: 20px;
  font-weight: 600;
}
.preview .question {
  border-bottom: 1px solid #cecdcd;
  margin-bottom: 10px;
}
.preview .stype {
  margin-bottom: 10px;
}
/* .preview .el-divider--horizontal {
  display: block;
  height: 1px;
  width: 90%;
  margin: 24px 75px;
}
.preview .box-card {
  width: 90%;
  margin-left: 75px;
  margin-top: 15px;
}
.preview .left {
  text-align: left;
}
.preview .title-bgc {
  background-color: #c0c0c0;
  height: 60px;
}
.preview .first-title {
  font-size: 30px;
}
.preview .second-title {
  font-size: 25px;
  line-height: 60px;
  margin-left: 10px;
}
.preview .ques-content {
  font-size: 20px;
}
.preview .options {
  font-size: 20px;
}
.preview .answer {
  font-size: 20px;
}
.preview .analysis {
  font-size: 20px;
} */
</style>