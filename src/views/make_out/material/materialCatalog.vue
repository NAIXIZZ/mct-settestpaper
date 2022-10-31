//资料
<template>
  <div class="materialCatalog">
    <div class="top_button">
      <div class="ques_search">
        <el-input
          v-model="input"
          placeholder="搜索题目或选项"
          clearable
          @clear="use_clear"
        ></el-input>
        <el-button type="success" @click="title_search(input)">搜索</el-button>
      </div>
      <h1 class="title">{{ catalog }}</h1>
      <div class="back">
        <el-button type="primary" plain @click="multipleMove"
          >移动选中</el-button
        >
        <el-button plain @click="back">返回</el-button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="
        tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" :index="indexMethod"> </el-table-column>
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="材料内容">
              <span>{{ props.row.content }}</span>
              <img
                :src="props.row.file_url.path"
                alt=""
                v-if="
                  props.row.file_url &&
                  props.row.file_url.path.search('.png') != -1
                "
              />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column label="材料内容" prop="content" show-overflow-tooltip>
        <template slot-scope="scope">
          <p
            v-if="
              scope.row.content.search('.mp3') == -1 &&
              scope.row.content.search('.wav') == -1 &&
              scope.row.content.search('.ogg') == -1 &&
              scope.row.content.search('.png') == -1 &&
              scope.row.content.search('.jpg') == -1 &&
              scope.row.content.search('.gif') == -1
            "
          >
            {{ scope.row.content }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="图片/音频" prop="file_url">
        <template slot-scope="scope">
          <audio
            :src="scope.row.content"
            controls="controls"
            v-if="
              scope.row.content &&
              (scope.row.content.search('.mp3') != -1 ||
                scope.row.content.search('.wav') != -1 ||
                scope.row.content.search('.ogg') != -1)
            "
          ></audio>
          <el-image
            style="width: 150px"
            :preview-src-list="srcList"
            :src="scope.row.content"
            v-if="
              scope.row.content &&
              (scope.row.content.search('.png') != -1 ||
                scope.row.content.search('.jpg') != -1 ||
                scope.row.content.search('.gif') != -1)
            "
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <div class="button_bar">
            <el-button type="success" plain @click="checkQuesP(scope.row.id)"
              >查看题目/试卷</el-button
            >
            <el-button type="warning" plain @click="handleSet(scope.row)"
              >自动出题</el-button
            >
            <el-button
              type="danger"
              plain
              v-if="!scope.row.have"
              @click="delContent(scope.row)"
              >删除</el-button
            >
            <div style="margin: 0 10px" v-else>
              <el-tooltip
                class="item"
                effect="dark"
                content="题干材料中无项目时才可删除"
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
    <div class="trash">
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
    <el-dialog
      title="移动到"
      :visible.sync="moveVisible"
      :before-close="handleClose"
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
  </div>
</template>

<script>
import { Read4 } from "@/api/api.js";
import Cookies from "js-cookie";
import Cookie from "js-cookie";
var BaaS = require("minapp-sdk");
let clientID = "395062a19e209a770059";
BaaS.init(clientID);
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      loading: true,
      preMove: [],
      catalog: "",
      input: "",
      tableData: [],
      initial: [],
      multipleSelection: [],
      dialogFormVisible: false,
      moveVisible: false,
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
      srcList: [],
      addMore: true,
      previousName: "",
      currentPage: 1,
      pageSize: 10,
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
      catalogall: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
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
      let query2 = new BaaS.Query();
      query2.compare("catalog", "=", this.catalog);
      let query3 = new BaaS.Query();
      query3.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query, query2, query3);
      let Material = new BaaS.TableObject("question_content");
      Material.limit(1000)
        .offset(0)
        .setQuery(andQuery)
        .orderBy("-created_at")
        .find()
        .then(
          (res) => {
            if (
              res.data.objects.length == 1 &&
              res.data.objects[0].file_url == null &&
              res.data.objects[0].content == null
            ) {
              this.loading = false;
              this.tableData = [];
            } else {
              for (let i = 0; i < res.data.objects.length; i++) {
                if (
                  res.data.objects[i].file_url == null &&
                  res.data.objects[i].content == null
                ) {
                  res.data.objects.splice(i, 1);
                  break;
                }
              }
              for (let i = 0; i < res.data.objects.length; i++) {
                res.data.objects[i].have = false;
                let q3 = new BaaS.Query();
                q3.compare("question_content_id", "=", res.data.objects[i].id);
                let Question = new BaaS.TableObject("questions_information");
                let and = BaaS.Query.and(query, query3, q3);
                Question.setQuery(and)
                  .limit(1000)
                  .offset(0)
                  .find()
                  .then(
                    (ress) => {
                      if (ress.data.objects.length != 0) {
                        res.data.objects[i].have = true;
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              }
              this.loading = false;
              this.tableData = res.data.objects;
              this.initial = res.data.objects;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },
    title_search(val) {
      if (val == "") {
        this.tableData = this.initial;
      } else {
        this.tableData = this.initial;
        var title_search = new Array();
        this.tableData.forEach((element) => {
          if (element.content != null && element.content.search(val) != -1) {
            title_search.push(element);
          } else if (
            element.catalog != null &&
            element.catalog.search(val) != -1
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
    use_clear() {
      this.tableData = this.initial;
    },
    delContent(row) {
      let Catalog = new BaaS.TableObject("question_content");
      let cata = Catalog.getWithoutData(row.id);
      cata.set("is_delete", true);
      cata.update().then(
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
        let Catalog = new BaaS.TableObject("question_content");
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
    checkQuesP(id) {
      Cookies.set("material_id", id);
      this.$router.push("checkQuesP");
    },
    trash() {
      Cookies.set("trash", "content");
      this.$router.push("/trash_list");
    },
    handleSet(val) {
      console.log(val);
      Cookies.set("material_id", val.id);
      this.form.ques_con = val.content;
      if (val.file_url != "" && val.file_url != null) {
        this.form.ques_file = val.file_url.path;
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
    checkMaterial(id) {
      Cookies.set("material_id", id);
      this.$router.push("checkMaterial");
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },
    back() {
      Cookies.set("catalog", "");
      Cookies.set("catalogall", "");
      this.$router.go(-1);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.materialCatalog {
  padding: 20px 20px;
}
.materialCatalog .top_button {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.materialCatalog .ques_search {
  flex: 1;
}
.materialCatalog .title {
  flex: 2;
}
.materialCatalog .back {
  flex: 1;
}
.materialCatalog .el-table {
  padding-left: 30px;
}
.materialCatalog .demo-table-expand {
  font-size: 0;
}
.materialCatalog .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.materialCatalog .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  margin-left: 57px;
}
.materialCatalog .el-dialog {
  width: 450px;
}
.materialCatalog .el-cascader {
  width: 100%;
}
.materialCatalog .trash {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.materialCatalog .button_bar {
  display: flex;
  flex-direction: row;
}
.materialCatalog .move {
  display: flex;
  flex-direction: column;
}
.materialCatalog .move .el-button + .el-button {
  margin-left: 0px;
}
.materialCatalog .autoQP .el-dialog__body {
  padding: 0 20px;
}
.materialCatalog .el-icon-circle-plus-outline {
  font-size: 40px;
  color: green;
  float: left;
}
.materialCatalog .el-icon-remove-outline {
  font-size: 30px;
  color: red;
  float: right;
}
.materialCatalog .autoType {
  margin-bottom: 20px;
  padding-bottom: 40px;
  border-bottom: 1px dotted gray;
}
.materialCatalog .autoType .el-cascader,
.materialCatalog .autoType .el-input,
.materialCatalog .autoType .el-select {
  width: 100%;
}
</style>