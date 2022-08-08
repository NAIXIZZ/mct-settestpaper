<template>
  <el-dialog
    top='1vh'
    :title="title"
    :visible.sync="visible"
    :width="width + 'px'"
    :before-close="onClose"
    center
  >
    <div
      class="container"
      :style="{ height:height + 'px' }"
    >
      <slot name="content"></slot>
      <slot name="content1"></slot>
    </div>
    <span slot="footer">
      <el-button
        type="danger"
        @click="onClose"
      >取消</el-button>
      <el-button
        type="primary"
        @click="onConfirm"
      >确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 300
    }
  },
  methods: {
    onClose () {
      this.$emit('onClose')
    },
    onConfirm () {
      this.$emit('onConfirm')
    }
  }
}
</script>