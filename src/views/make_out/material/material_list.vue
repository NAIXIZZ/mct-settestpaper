//资料
<template>
  <div class="material">
    <div class="top_button">
      <div class="ques_search">
        <el-input
          v-model="input"
          placeholder="搜索文件夹或材料内容"
          clearable
          @clear="use_clear"
        ></el-input>
        <el-button type="success" @click="title_search(input)">搜索</el-button>
      </div>
      <div>
        <el-button type="success" plain @click="createFolder"
          >新建文件夹</el-button
        >
        <el-button type="primary" plain @click="multipleMove"
          >移动选中</el-button
        >
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
      :row-key="
        (row) => {
          return row.id;
        }
      "
    >
      <el-table-column type="selection" width="55" :reserve-selection="true">
      </el-table-column>
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
            <i class="el-icon-error" @click="cancelFolder(scope.$index)"></i>
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
      <el-table-column label="材料内容" prop="content" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="图片/音频" prop="file_url">
        <template slot-scope="scope">
          <audio
            :src="scope.row.file_url.path"
            controls="controls"
            v-if="
              (scope.row.file_url &&
                scope.row.file_url.path.search('.mp3') != -1) ||
              (scope.row.file_url &&
                scope.row.file_url.path.search('.wav') != -1) ||
              (scope.row.file_url &&
                scope.row.file_url.path.search('.ogg') != -1)
            "
          ></audio>
          <el-image
            style="width: 150px"
            :preview-src-list="srcList"
            :src="scope.row.file_url.path"
            v-if="
              (scope.row.file_url &&
                scope.row.file_url.path.search('.png') != -1) ||
              (scope.row.file_url &&
                scope.row.file_url.path.search('.gif') != -1) ||
              (scope.row.file_url &&
                scope.row.file_url.path.search('.jpg') != -1)
            "
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <div v-show="scope.row.content != null || scope.row.file_url != null">
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
              @click="delContent(scope.$index, scope.row)"
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
            <!-- <el-button type="primary" plain @click="checkMaterial(scope.row.id)"
            >查看</el-button
          > -->
          </div>
          <div v-show="scope.row.catalog != null">
            <el-button type="primary" plain @click="rename(scope.row)"
              >重命名</el-button
            >
            <el-button
              v-if="!scope.row.have"
              type="danger"
              plain
              @click="delCatalog(scope.$index, scope.row)"
              >删除</el-button
            >
            <div style="margin-left: 10px" v-else>
              <el-tooltip
                class="item"
                effect="dark"
                content="文件夹中无项目时才可删除"
                placement="top"
              >
                <el-button type="info" plain>删除</el-button>
              </el-tooltip>
            </div>
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
        <el-button v-for="o in catalog" :key="o.index" @click="to(o.catalog)">
          {{ o.catalog }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import global from "@/util/global.js";
import { Read1, Read4 } from "@/api/api.js";
// import Cookies from "js-cookie";
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
      multipleSelection: [],
      moveVisible: false,
      cataContent: [],
      delCD: false,
      delC: "",
      delCN: 0,
      input: "",
      tableData: [],
      initial: [],
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
            grade: "一级",
          },
        ],
      },
      grade: [
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
      catalog: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      let ques = [];
      let query = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      // query.compare("created_by", "=", sessionStorage.getItem("user_id") * 1);
      let q2 = new BaaS.Query();
      q2.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query, q2);
      let Question = new BaaS.TableObject("questions_information");
      Question.setQuery(andQuery)
        .limit(1000)
        .offset(0)
        .find()
        .then(
          (res) => {
            if (res.data.objects.length != 0) {
              ques = res.data.objects;
              let Material = new BaaS.TableObject("question_content");
              Material.limit(1000)
                .offset(0)
                .setQuery(andQuery)
                .orderBy("-created_at")
                .find()
                .then(
                  (res) => {
                    res.data.objects.forEach((element) => {
                      element.have = false;
                      for (let i = 0; i < ques.length; i++) {
                        if (ques[i].question_content_id == element.id) {
                          element.have = true;
                          break;
                        }
                      }
                      if (
                        element.file_url != null &&
                        (element.file_url.path.search(".png") != -1 ||
                          element.file_url.path.search(".jpg") != -1 ||
                          element.file_url.path.search(".gif") != -1)
                      ) {
                        this.srcList.push(element.file_url.path);
                      }
                      if (element.catalog != null) {
                        var a = {
                          have: false,
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
                        (key) =>
                          !map.has(key.catalog) && map.set(key.catalog, 1)
                      );
                    }
                    this.catalog.forEach((element) => {
                      res.data.objects.forEach((item) => {
                        if (
                          element.catalog == item.catalog &&
                          (item.content != null || item.file_url != null)
                        ) {
                          element.have = true;
                        }
                      });
                    });
                    this.catalog.forEach((element) => {
                      res.data.objects = res.data.objects.filter(
                        (t) => t.catalog != element.catalog
                      );
                      res.data.objects.unshift(element);
                    });
                    this.loading = false;
                    sessionStorage.setItem(
                      "contentCatalog",
                      JSON.stringify(this.catalog)
                    );
                    this.tableData = res.data.objects;
                    this.initial = res.data.objects;
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
    },
    title_search(val) {
      console.log(val);
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
    createFolder() {
      if (this.addMore == true) {
        this.addMore = false;
        var folder = {
          finish: false,
          rename: false,
          catalog: null,
          content: null,
          file_url: null,
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
        let q2 = new BaaS.Query();
        query.compare("catalog", "=", name);
        q2.compare("is_delete", "=", false);
        let q = new BaaS.Query();
        q.compare("created_by", "=", Cookie.get("user_id") * 1);
        let andQuery = BaaS.Query.and(query, q2, q);
        let Catalog = new BaaS.TableObject("question_content");
        Catalog.setQuery(andQuery)
          .limit(1000)
          .find()
          .then(
            (res) => {
              if (res.data.objects.length == 0) {
                let catalog = Catalog.create();
                let add = {
                  content: null,
                  file_url: null,
                  catalog: name,
                };
                catalog
                  .set(add)
                  .save()
                  .then(
                    (res) => {
                      this.tableData[index].id = res.data.id;
                      this.tableData[index].catalog = res.data.catalog;
                      this.tableData[index].finish = true;
                      this.tableData[index].rename = false;
                      this.tableData[index].have = false;
                      this.addMore = true;
                      this.$message({
                        message: name + "文件创建成功",
                        type: "success",
                      });
                      let temp = {
                        have: false,
                        finish: true,
                        rename: false,
                        catalog: res.data.catalog,
                      };
                      this.catalog.push(temp);
                      sessionStorage.setItem(
                        "contentCatalog",
                        JSON.stringify(this.catalog)
                      );
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
      let query = new BaaS.Query();
      let q2 = new BaaS.Query();
      query.compare("catalog", "=", row.catalog);
      q2.compare("is_delete", "=", false);
      let q = new BaaS.Query();
      q.compare("created_by", "=", Cookie.get("user_id") * 1);
      let andQuery = BaaS.Query.and(query, q2, q);
      let Catalog = new BaaS.TableObject("question_content");
      Catalog.setQuery(andQuery)
        .limit(1000)
        .find()
        .then(
          (res) => {
            console.log(res);
            if (res.data.objects.length == 0) {
              let catalog = Catalog.limit(1000).getWithoutData(row.id);
              catalog.set("catalog", row.catalog);
              catalog.update().then(
                (res) => {
                  console.log(res);
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
    },
    cancelRename(index, row) {
      console.log(index);
      row.catalog = this.previousName;
      row.rename = false;
      this.previousName = "";
    },
    delCatalogDefine(index, row) {
      this.delC = row.catalog;
      let Catalog = new BaaS.TableObject("question_content");
      let query = new BaaS.Query();
      let q2 = new BaaS.Query();
      let q3 = new BaaS.Query();
      query.compare("catalog", "=", row.catalog);
      q2.compare("created_by", "=", Cookie.get("user_id") * 1);
      // q2.compare("created_by", "=", sessionStorage.getItem("user_id") * 1);
      q3.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query, q2, q3);
      Catalog.setQuery(andQuery)
        .limit(1000)
        .find()
        .then(
          (res) => {
            this.cataContent = res.data.objects;
            this.delCN = res.data.objects.length;
            res.data.objects.forEach((element) => {
              if (element.content == null && element.file_url == null) {
                this.delCN--;
              }
            });
            this.delCD = true;
          },
          (err) => {
            console.log(err);
          }
        );
    },
    delCatalog(index, row) {
      const loading = this.$loading({
        lock: true,
        text: "正在删除，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let num = 0;
      let findCata = new BaaS.TableObject("question_content");
      let findc = new BaaS.Query();
      let q2 = new BaaS.Query();
      findc.compare("catalog", "=", row.catalog);
      q2.compare("is_delete", "=", false);
      let q = new BaaS.Query();
      q.compare("created_by", "=", Cookie.get("user_id") * 1);
      let andQuery = BaaS.Query.and(findc, q2, q);
      findCata
        .setQuery(andQuery)
        .limit(1000)
        .find()
        .then(
          (res) => {
            let Catalog = new BaaS.TableObject("question_content");
            let cata = Catalog.limit(1000).getWithoutData(
              res.data.objects[0].id
            );
            cata.set("is_delete", true);
            cata.update().then(
              (res) => {
                console.log(res);
                if (num == 0) {
                  this.$message({
                    message: "文件夹删除成功",
                    type: "success",
                  });
                  this.tableData.splice(index, 1);
                  num++;
                  loading.close();
                  for (let i = 0; i < this.catalog.length; i++) {
                    if (this.catalog[i].catalog == row.catalog) {
                      this.catalog.splice(i, 1);
                      sessionStorage.setItem(
                        "contentCatalog",
                        JSON.stringify(this.catalog)
                      );
                      break;
                    }
                  }
                }
              },
              (err) => {
                loading.close();
                this.$message({
                  message: "文件夹删除失败",
                  type: "warning",
                });
                console.log(err);
              }
            );
          },
          (err) => {
            console.log(err);
          }
        );
    },
    delContent(index, row) {
      const loading = this.$loading({
        lock: true,
        text: "正在删除，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let Catalog = new BaaS.TableObject("question_content");
      let cata = Catalog.limit(1000).getWithoutData(row.id);
      cata.set("is_delete", true);
      cata.update().then(
        (res) => {
          console.log(res);
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.tableData.splice(index, 1);
          loading.close();
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
        let cata = Catalog.limit(1000).getWithoutData(this.preMove[i]);
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
    },
    multipleMove() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择移动项",
          type: "warning",
        });
      } else {
        let ca = false;
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].catalog != null) {
            this.$message({
              message: "文件夹不可移动",
              type: "warning",
            });
            ca = true;
            break;
          }
        }
        if (ca == false) {
          let temp = [];
          this.multipleSelection.forEach((element) => {
            temp.push(element.id);
          });
          this.moveTo(temp, 2);
        }
      }
    },
    enterFolder(row) {
      // Cookies.set("make_out", "third");
      // Cookies.set("catalog", row.catalog);
      // Cookies.set("catalogall", JSON.stringify(this.catalog));
      sessionStorage.setItem("make_out", "third");
      sessionStorage.setItem("catalog", row.catalog);
      sessionStorage.setItem("catalogall", JSON.stringify(this.catalog));
      this.$router.push("/materialCatalog");
    },
    checkQuesP(id) {
      // Cookies.set("make_out", "third");
      // Cookies.set("material_id", id);
      sessionStorage.setItem("make_out", "third");
      sessionStorage.setItem("material_id", id);
      this.$router.push("/checkQuesP");
    },
    handleSet(val) {
      console.log(val);
      // Cookies.set("material_id", val.id);
      sessionStorage.setItem("material_id", val.id);
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
            grade: "一级",
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
        let finish = 0;
        let success = 0;
        for (let i = 0; i < this.form.type.length; i++) {
          if (this.form.type[i].ques_type[1] == "选择正确词语填空") {
            let grade = 1;
            if (this.form.type[i].grade == "一级") {
              grade = 1;
            } else if (this.form.type[i].grade == "二级") {
              grade = 2;
            } else if (this.form.type[i].grade == "三级") {
              grade = 3;
            }
            Read1(this.form.ques_con, grade, this.form.type[i].ques_num).then(
              (res) => {
                console.log(res);
                if(typeof(res)=="string") {
                  this.$message({
                    message: res,
                    type: "warning",
                  });
                }else if (res.medical_data.length != 0) {
                  for (let j = 0; j < res.medical_data.length; j++) {
                    global.auto.push(res.medical_data[j]);
                  }
                  success++;
                }else if(res.medical_data.length == 0){
                  this.$message({
                    message: "无可出题目",
                    type: "warning",
                  });
                }
                finish++;
                setTimeout(() => {
                    if (finish == this.editableTabs[i].content.type.length) {
                      loading.close();
                      this.autoClose();
                      if (success > 0) {
                        sessionStorage.setItem("autoQues", "true");
                        sessionStorage.setItem("make_out", "third");
                        this.$router.push("/mcreatePaper");
                      }
                    }
                  }, 1000);
                // if (res.synthesis_data.length != 0) {
                //   for (let j = 0; j < res.synthesis_data.length; j++) {
                //     global.auto.push(res.synthesis_data[j]);
                //   }
                // }

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

                // Cookies.set("autoQues","true")
                // Cookies.set("make_out", "third");
                // sessionStorage.setItem("autoQues", "true");
                // sessionStorage.setItem("make_out", "third");
                // this.$router.push("/mcreatePaper");
              },
              (err) => {
                this.$message.error("出题失败");
                loading.close();
                console.log(err);
              }
            );
          }
          if (this.form.type[i].ques_type[1] == "阅读短文，选择正确答案") {
            Read4(
              this.form.ques_con,
              this.form.type[i].ques_num_yixue,
              this.form.type[i].ques_num_zonghe,
              this.form.type[i].grade
            ).then(
              (res) => {
                console.log(res);
                if (res.medical_data.length != 0) {
                  for (let j = 0; j < res.medical_data.length; j++) {
                    global.auto.push(res.medical_data[j]);
                  }
                  success++;
                }
                if (res.synthesis_data.length != 0) {
                  for (let j = 0; j < res.synthesis_data.length; j++) {
                    global.auto.push(res.synthesis_data[j]);
                  }
                }
                finish++;
                setTimeout(() => {
                    if (finish == this.editableTabs[i].content.type.length) {
                      loading.close();
                      this.autoClose();
                      if (success > 0) {
                        sessionStorage.setItem("autoQues", "true");
                        sessionStorage.setItem("make_out", "third");
                        this.$router.push("/mcreatePaper");
                      }
                    }
                  }, 1000);
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

                // Cookies.set("autoQues","true")
                // Cookies.set("make_out", "third");
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
        grade: "一级",
      };
      this.form.type.push(t);
    },
    delAuto(val) {
      console.log(val);
      this.form.type.splice(val, 1);
    },
    trash() {
      // Cookies.set("make_out", "third");
      // Cookies.set("trash", "content");
      sessionStorage.setItem("make_out", "third");
      sessionStorage.setItem("trash", "content");
      this.$router.push("/trash_list");
    },
    checkMaterial(id) {
      // Cookies.set("make_out", "third");
      // Cookies.set("material_id", id);
      sessionStorage.setItem("make_out", "third");
      sessionStorage.setItem("material_id", id);
      this.$router.push("/checkMaterial");
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
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>
<style>
.material .top_button {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.material .el-table {
  padding-left: 30px;
}
.material .el-table td.el-table__cell div {
  display: flex;
  flex-direction: row;
}
.material .demo-table-expand {
  font-size: 0;
}
.material .demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.material .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  margin-left: 57px;
}
.folder {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.folder:hover {
  cursor: pointer;
}
.folder:hover span {
  text-decoration: underline;
  color: #f90c0c;
}
.folder i {
  font-size: 30px;
  margin: 0 5px;
}
.folder .el-icon-folder {
  color: #f9be0c;
}
.folder .el-icon-success {
  color: #05bf3d;
}
.folder .el-icon-error {
  color: #f90c0c;
}
.material .el-dialog {
  width: 620px !important;
}
.material .el-cascader {
  width: 100%;
}
.material .trash {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.material .move {
  display: flex;
  flex-direction: column;
}
.material .move .el-button + .el-button {
  margin-left: 0px;
}
.material .autoQP .el-dialog__body {
  padding: 0 20px;
}
.material .el-icon-circle-plus-outline {
  font-size: 40px;
  color: green;
  float: left;
}
.material .el-icon-remove-outline {
  font-size: 30px;
  color: red;
  float: right;
}
.material .autoType {
  margin-bottom: 20px;
  padding-bottom: 40px;
  border-bottom: 1px dotted gray;
}
.material .autoType .el-cascader,
.material .autoType .el-input,
.material .autoType .el-select {
  width: 100%;
}
</style>