<template>
  <div>
    <el-row>
      <heads></heads>
    </el-row>
    <el-row class="tabs1">
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
        class="tabs2"
      >
        <el-tab-pane
          label="试卷统计"
          name="paper_statistics"
        >
          <paperStatistics />
        </el-tab-pane>
        <el-tab-pane
          label="题型统计"
          name="second"
        >
          <typeStatistics />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import Heads from '@/components/heads.vue';
import paperStatistics from './components/paperStatistics.vue';
import typeStatistics from './components/typeStatistics.vue';
export default {
  name: '',
  components: {
    Heads,
    paperStatistics,
    typeStatistics,
  },
  props: {},
  data () {
    return {
      activeName: 'paper_statistics'
    };
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    }
  },
};
</script>
<style scoped>
.tabs1 {
  padding-top: 1%;
  margin-left: 2%;
}
.tabs2 {
  width: 98%;
}
</style>