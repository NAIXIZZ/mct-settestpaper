//资料
<template>
  <div class="material">
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
              scope.row.file_url && scope.row.file_url.path.search('.mp3') != -1
            "
          ></audio>
          <el-image
            style="width: 150px"
            :preview-src-list="srcList"
            :src="scope.row.file_url.path"
            v-if="
              scope.row.file_url && scope.row.file_url.path.search('.png') != -1
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
            <el-button type="warning" plain @click="handleSet(scope.row.id)"
              >出题/出卷</el-button
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
            <el-button type="primary" plain @click="moveTo(scope.row.id,1)"
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
      <el-button type="primary" icon="el-icon-delete" @click="trash">回收站</el-button>
    </div>
    <el-dialog title="自动出题" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="题目数量：" :label-width="formLabelWidth">
          <el-input v-model="form.quesnum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目类型：" :label-width="formLabelWidth">
          <el-cascader
            :options="ques_select"
            :props="{
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            placeholder="请选择题型"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setQues">保存到题库</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
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
        quesnum: "",
      },
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
        },
      ],
      catalog: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    init() {
      let query = new BaaS.Query();
      query.compare("created_by", "=", Cookie.get("user_id") * 1);
      let q2 = new BaaS.Query();
      q2.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query, q2);
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
              let q3 = new BaaS.Query();
              q3.compare("question_content_id", "=", element.id);
              let Question = new BaaS.TableObject("questions_information");
              let and = BaaS.Query.and(query, q2, q3);
              Question.setQuery(and)
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
                (key) => !map.has(key.catalog) && map.set(key.catalog, 1)
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
            sessionStorage.setItem("contentCatalog",JSON.stringify(this.catalog))
            this.tableData = res.data.objects;
            this.initial = res.data.objects;
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
        let andQuery = BaaS.Query.and(query, q2);
        let Catalog = new BaaS.TableObject("question_content");
        Catalog.setQuery(andQuery)
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
                      sessionStorage.setItem("contentCatalog",JSON.stringify(this.catalog))
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
      let andQuery = BaaS.Query.and(query, q2);
      let Catalog = new BaaS.TableObject("question_content");
      Catalog.setQuery(andQuery)
        .find()
        .then(
          (res) => {
            console.log(res);
            if (res.data.objects.length == 0) {
              let catalog = Catalog.getWithoutData(row.id);
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
      q3.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(query, q2, q3);
      Catalog.setQuery(andQuery)
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
      let findCata = new BaaS.TableObject("question_content");
      let findc = new BaaS.Query();
      let q2 = new BaaS.Query();
      findc.compare("catalog", "=", row.catalog);
      q2.compare("is_delete", "=", false);
      let andQuery = BaaS.Query.and(findc, q2);
      findCata
        .setQuery(andQuery)
        .find()
        .then(
          (res) => {
            let Catalog = new BaaS.TableObject("question_content");
            let cata = Catalog.getWithoutData(res.data.objects[0].id);
            cata.set("is_delete", true);
            cata.update().then(
              (res) => {
                console.log(res);
                this.$message({
                  message: "文件夹删除成功",
                  type: "success",
                });
                this.tableData.splice(index,1)
                for(let i=0;i<this.catalog.length;i++){
                  if(this.catalog[i].catalog==row.catalog){
                    this.catalog.splice(i,1)
                    sessionStorage.setItem("contentCatalog",JSON.stringify(this.catalog))
                    break
                  }
                }
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
    moveTo(val,type) {
      if(type==1){
        this.preMove.push(val);
      }else if(type==2){
        this.preMove = val
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
        let ca = false
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].catalog != null) {
            this.$message({
              message: "文件夹不可移动",
              type: "warning",
            });
            ca=true
            break
          }
        }
        if(ca==false){
          let temp = []
          this.multipleSelection.forEach(element=>{
            temp.push(element.id)
          })
          this.moveTo(temp,2)
        }
      }
    },
    enterFolder(row) {
      Cookies.set("catalog", row.catalog);
      Cookies.set("catalogall",JSON.stringify(this.catalog))
      this.$router.push("/materialCatalog");
    },
    checkQuesP(id) {
      Cookies.set("material_id", id);
      this.$router.push("/checkQuesP");
    },
    handleSet(val) {
      Cookies.set("material_id", val);
      this.dialogFormVisible = true;
    },
    setQues() {
      this.dialogFormVisible = false;
    },
    trash(){
      Cookies.set("trash","content")
      this.$router.push("/trash_list")
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
  width: 450px;
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
</style>