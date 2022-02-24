//查看题目
<template>
  <div class="checkQues">
    <div class="ques_top">
      <div class="ques_select">
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
        <el-select v-model="value" clearable placeholder="是否使用">
          <el-option
            v-for="item in use"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="ques_search">
          <el-input v-model="input" placeholder="按标题搜索"></el-input>
          <el-button type="success">搜索</el-button>
        </div>
      </div>
      <div class="top_button">
        <el-button type="success" plain @click="handleSet">自动出题</el-button>
        <el-button type="success" plain>添加题目</el-button>
        <el-button type="success" plain>添加目录</el-button>
        <el-button type="success" plain>批量导入</el-button>
      </div>
    </div>
    <div class="ques_content">
      <div class="ques_num">
        <span>共</span>
        <span>题</span>
      </div>
      <div class="ques_list">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" :index="indexMethod"> </el-table-column>
          <el-table-column
            prop="ques_content"
            label="题目"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="primary_ques_type" label="一级题型">
          </el-table-column>
          <el-table-column prop="secondary_ques_type" label="二级题型">
          </el-table-column>
          <el-table-column prop="usage_amount" label="使用量">
          </el-table-column>
          <el-table-column prop="created_by" label="创建者"> </el-table-column>
          <el-table-column prop="created_at" label="创建日期">
          </el-table-column>
          <el-table-column label="操作" width="300">
            <el-button type="success" plain>查看/编辑</el-button>
            <el-button type="warning" plain>复制</el-button>
            <el-button type="danger" plain>删除</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="ques_bottom">
      <div class="bottom_button">
        <el-button type="success" plain>导出选中</el-button>
        <el-button type="success" plain>删除选中</el-button>
        <el-button type="success" plain>批量移动</el-button>
        <el-button type="success" plain>批量复制</el-button>
        <el-button type="success" plain>导出全部</el-button>
      </div>
      <el-button type="primary" icon="el-icon-delete">回收站</el-button>
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
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
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
      tableData: [
        {
          ques_content:
            "张强，男，50岁。2019年12月5日上午10点23分上班途中，意外受伤，急诊入院。右侧股骨骨折，收入骨科。次日出现右下肢麻木，痛觉消失，特申请神经内科医师会诊，以协助诊断。A.张强左下肢神经受损;B.张强受伤当天失去痛觉;C.张强急诊入院，收入骨科;D.张强住院的科室请求外科医师会诊.答案:C",
          primary_ques_type: "阅读",
          secondary_ques_type: "阅读语段，选择与语段意思一致的一项",
          usage_amount: "0",
          created_by: "admin",
          created_at: "2021-01-01",
        },
        {
          ques_content:
            "张强，男，50岁。2019年12月5日上午10点23分上班途中，意外受伤，急诊入院。右侧股骨骨折，收入骨科。次日出现右下肢麻木，痛觉消失，特申请神经内科医师会诊，以协助诊断。A.张强左下肢神经受损;B.张强受伤当天失去痛觉;C.张强急诊入院，收入骨科;D.张强住院的科室请求外科医师会诊.答案:C",
          primary_ques_type: "阅读",
          secondary_ques_type: "阅读语段，选择与语段意思一致的一项",
          usage_amount: "0",
          created_by: "admin",
          created_at: "2021-01-01",
        },
        {
          ques_content:
            "张强，男，50岁。2019年12月5日上午10点23分上班途中，意外受伤，急诊入院。右侧股骨骨折，收入骨科。次日出现右下肢麻木，痛觉消失，特申请神经内科医师会诊，以协助诊断。A.张强左下肢神经受损;B.张强受伤当天失去痛觉;C.张强急诊入院，收入骨科;D.张强住院的科室请求外科医师会诊.答案:C",
          primary_ques_type: "阅读",
          secondary_ques_type: "阅读语段，选择与语段意思一致的一项",
          usage_amount: "0",
          created_by: "admin",
          created_at: "2021-01-01",
        },
        {
          ques_content:
            "张强，男，50岁。2019年12月5日上午10点23分上班途中，意外受伤，急诊入院。右侧股骨骨折，收入骨科。次日出现右下肢麻木，痛觉消失，特申请神经内科医师会诊，以协助诊断。A.张强左下肢神经受损;B.张强受伤当天失去痛觉;C.张强急诊入院，收入骨科;D.张强住院的科室请求外科医师会诊.答案:C",
          primary_ques_type: "阅读",
          secondary_ques_type: "阅读语段，选择与语段意思一致的一项",
          usage_amount: "0",
          created_by: "admin",
          created_at: "2021-01-01",
        },
        {
          ques_content:
            "张强，男，50岁。2019年12月5日上午10点23分上班途中，意外受伤，急诊入院。右侧股骨骨折，收入骨科。次日出现右下肢麻木，痛觉消失，特申请神经内科医师会诊，以协助诊断。A.张强左下肢神经受损;B.张强受伤当天失去痛觉;C.张强急诊入院，收入骨科;D.张强住院的科室请求外科医师会诊.答案:C",
          primary_ques_type: "阅读",
          secondary_ques_type: "阅读语段，选择与语段意思一致的一项",
          usage_amount: "0",
          created_by: "admin",
          created_at: "2021-01-01",
        },
        {
          ques_content:
            "张强，男，50岁。2019年12月5日上午10点23分上班途中，意外受伤，急诊入院。右侧股骨骨折，收入骨科。次日出现右下肢麻木，痛觉消失，特申请神经内科医师会诊，以协助诊断。A.张强左下肢神经受损;B.张强受伤当天失去痛觉;C.张强急诊入院，收入骨科;D.张强住院的科室请求外科医师会诊.答案:C",
          primary_ques_type: "阅读",
          secondary_ques_type: "阅读语段，选择与语段意思一致的一项",
          usage_amount: "0",
          created_by: "admin",
          created_at: "2021-01-01",
        },
      ],
      multipleSelection: [],
      dialogFormVisible: false,
      form: {
        title: "",
        quesnum: "",
      },
      formLabelWidth: "120px",
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },
    handleSet() {
      //   Cookies.set("material_id", val);
      this.dialogFormVisible = true;
    },
    setQues() {
      this.dialogFormVisible = false;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style>
.ques_top {
  display: flex;
  justify-content: space-between;
}
.ques_select {
  display: flex;
}
.ques_search .el-button {
  height: fit-content;
}
.ques_select .el-cascader,
.ques_select .el-select {
  margin-right: 10px;
}
.ques_search {
  display: flex;
  margin-right: 10px;
}
.ques_content {
  margin-bottom: 10px;
}
.ques_num {
  display: flex;
  float: right;
}
.ques_bottom {
  display: flex;
  justify-content: space-between;
}
.checkQues .el-input {
  width: 300px;
}
</style>