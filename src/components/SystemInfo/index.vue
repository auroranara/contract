<template>
  <el-row>
    <el-col :md="12" :sm="24">
      <grid-form :settings="systemSettings(this.data)"></grid-form>
    </el-col>
  </el-row>
</template>
<script>
import GridForm from '@/components/GridForm'

export default {
  components: { GridForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      default: () => ({
        status: 'status',
        createTime: 'createTime',
        createPerson: 'createPerson',
        modifyTime: 'modifyTime',
        modifyPerson: 'modifyPerson',
      }),
    },
  },
  methods: {
    systemSettings(data) {
      return [
        [
          {
            type: 'label',
            label: '状态',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data[this.model['status']],
          },
        ],
        [
          {
            type: 'label',
            label: '创建时间',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data[this.model['createTime']],
          },
        ],
        [
          {
            type: 'label',
            label: '创建人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data[this.model['createPerson']],
          },
        ],
        [
          {
            type: 'label',
            label: '修改时间',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data[this.model['modifyTime']],
          },
        ],
        [
          {
            type: 'label',
            label: '修改人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data[this.model['modifyPerson']],
          },
        ],
      ]
    },
  },
}
</script>
