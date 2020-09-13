<script>
export default {
  name: 'cellItem',
  props: ['setting', 'data'],
  render(h) {
    const {
      render,
      type,
      required,
      label,
      field,
      tag,
      rowspan,
      colspan,
      cellStyle,
      align = 'left',
      showBg,
      tagProps = {},
    } = this.setting
    const tdClass = {
      'border-cell': true,
      'is-center': align === 'center',
      'is-right': align === 'right',
      'label-bg': showBg,
    }
    if (rowspan === '0' || colspan === '0') return null
    if (type === 'label') {
      return (
        <td class={tdClass} rowspan={rowspan} colspan={colspan}>
          <div class={{ label: true, required: required }}>{label}</div>
        </td>
      )
    } else if (type === 'empty') {
      return <td class={tdClass}></td>
    } else {
      return (
        <td class={tdClass} rowspan={rowspan} colspan={colspan}>
          <div class="cell" style={cellStyle}>
            <el-form-item prop={field}>
              {render ? (
                render(this.data)
              ) : (
                <tag attrs={tagProps} vModel={this.data[field]} />
              )}
            </el-form-item>
          </div>
        </td>
      )
    }
  },
}
</script>
<style lang="scss" scoped>
$border: #d3d3d3;
.container {
  padding: 10px 20px;
}
.btn_container {
  margin-bottom: 10px;
}
.table-border {
  margin-bottom: 20px;
  border: 1px solid $border;
  border-right: none;
  border-bottom: none;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  font-size: 14px;
  color: #606266;
}
.label-bg {
  background: #e2f5fd;
}
td {
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
td.is-center {
  text-align: center;
}
td.is-right {
  text-align: right;
}
.required:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.border-cell {
  border-bottom: 1px solid $border;
  border-right: 1px solid $border;
}
.label {
  color: #909399;
  font-weight: bold;
}
.cell,
.label {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  margin: 5px 10px;
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
</style>
