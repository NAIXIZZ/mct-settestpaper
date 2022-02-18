//任务大纲
<template>
  <div>
    <h1>任务大纲</h1>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="一 | 病史采集" name="1">
        <div class="task_content">
          <p>
            1.能听懂症状的描述、用药情况、持续时间等关于病情的说明及患者个人信息。
          </p>
          <p>
            2.能询问患者的个人信息、病情、发病时间、发病缓急、诱因、病史等相关信息；能向他人陈述患者情况。
          </p>
          <p>3.能看懂病程记录、处方、转诊记录等相关医疗文件。</p>
          <p>4.能书写病史采集的书面材料，包括病史、病情、患者信息等内容。</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="二 | 体格检查" name="2">
        <div class="task_content">
          <p>
            1.能听懂症状的描述、用药情况、持续时间等关于病情的说明及患者个人信息。
          </p>
          <p>
            2.能询问患者的个人信息、病情、发病时间、发病缓急、诱因、病史等相关信息；能向他人陈述患者情况。
          </p>
          <p>3.能看懂病程记录、处方、转诊记录等相关医疗文件。</p>
          <p>4.能书写病史采集的书面材料，包括病史、病情、患者信息等内容。</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="三 | 疾病诊断" name="3">
        <div class="task_content">
          <p>
            1.能听懂症状的描述、用药情况、持续时间等关于病情的说明及患者个人信息。
          </p>
          <p>
            2.能询问患者的个人信息、病情、发病时间、发病缓急、诱因、病史等相关信息；能向他人陈述患者情况。
          </p>
          <p>3.能看懂病程记录、处方、转诊记录等相关医疗文件。</p>
          <p>4.能书写病史采集的书面材料，包括病史、病情、患者信息等内容。</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="四 | 临床操作" name="4">
        <div class="task_content">
          <p>
            1.能听懂症状的描述、用药情况、持续时间等关于病情的说明及患者个人信息。
          </p>
          <p>
            2.能询问患者的个人信息、病情、发病时间、发病缓急、诱因、病史等相关信息；能向他人陈述患者情况。
          </p>
          <p>3.能看懂病程记录、处方、转诊记录等相关医疗文件。</p>
          <p>4.能书写病史采集的书面材料，包括病史、病情、患者信息等内容。</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="五 | 治疗方案商讨" name="5">
        <div class="task_content">
          <p>
            1.能听懂症状的描述、用药情况、持续时间等关于病情的说明及患者个人信息。
          </p>
          <p>
            2.能询问患者的个人信息、病情、发病时间、发病缓急、诱因、病史等相关信息；能向他人陈述患者情况。
          </p>
          <p>3.能看懂病程记录、处方、转诊记录等相关医疗文件。</p>
          <p>4.能书写病史采集的书面材料，包括病史、病情、患者信息等内容。</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="六 | 诊疗计划制订" name="6">
        <div class="task_content">
          <p>
            1.能听懂症状的描述、用药情况、持续时间等关于病情的说明及患者个人信息。
          </p>
          <p>
            2.能询问患者的个人信息、病情、发病时间、发病缓急、诱因、病史等相关信息；能向他人陈述患者情况。
          </p>
          <p>3.能看懂病程记录、处方、转诊记录等相关医疗文件。</p>
          <p>4.能书写病史采集的书面材料，包括病史、病情、患者信息等内容。</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="七 | 疾病预防" name="7">
        <div class="task_content">
          <p>
            1.能听懂症状的描述、用药情况、持续时间等关于病情的说明及患者个人信息。
          </p>
          <p>
            2.能询问患者的个人信息、病情、发病时间、发病缓急、诱因、病史等相关信息；能向他人陈述患者情况。
          </p>
          <p>3.能看懂病程记录、处方、转诊记录等相关医疗文件。</p>
          <p>4.能书写病史采集的书面材料，包括病史、病情、患者信息等内容。</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="八 | 人际交往" name="8">
        <div class="task_content">
          <p>
            1.能听懂症状的描述、用药情况、持续时间等关于病情的说明及患者个人信息。
          </p>
          <p>
            2.能询问患者的个人信息、病情、发病时间、发病缓急、诱因、病史等相关信息；能向他人陈述患者情况。
          </p>
          <p>3.能看懂病程记录、处方、转诊记录等相关医疗文件。</p>
          <p>4.能书写病史采集的书面材料，包括病史、病情、患者信息等内容。</p>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      activeNames: ["1"],
    };
  },
  methods: {},
};
</script>
<style>
.task_content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 25px;
}
</style>