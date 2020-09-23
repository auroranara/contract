<script>
export default {
  name: 'cellItem',
  props: ['setting', 'data', 'rules'],
  render(h) {
    const {
      render,
      type = 'handler',
      required,
      label,
      field,
      tag,
      rowspan,
      colspan,
      cellStyle,
      align = 'left',
      showBg,
      disabled = false,
      tagProps = {},
      colStyle,
    } = this.setting
    const tdClass = {
      'border-cell': true,
      'is-center': align === 'center',
      'is-right': align === 'right',
      'label-bg': showBg && !disabled,
      disabled,
    }
    if (rowspan === '0' || colspan === '0') return null
    if (type === 'label') {
      const isRequired =
        typeof required === 'boolean'
          ? required
          : this.rules && this.rules[field]
          ? this.rules[field].some((item) => item.required)
          : false
      return (
        <td
          style={colStyle}
          class={tdClass}
          rowspan={rowspan}
          colspan={colspan}
        >
          <div class={{ label: true, required: isRequired }} style={cellStyle}>
            {render ? render() : label}
          </div>
        </td>
      )
    } else if (type === 'empty') {
      return (
        <td
          style={colStyle}
          class={tdClass}
          rowspan={rowspan}
          colspan={colspan}
        ></td>
      )
    } else {
      return (
        <td
          style={colStyle}
          class={tdClass}
          rowspan={rowspan}
          colspan={colspan}
        >
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
@import '~@/assets/styles/variables.scss';

td {
  min-width: 100px;
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
  border-bottom: 1px solid $gridBorder;
  border-right: 1px solid $gridBorder;
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
.label {
  color: #646464;
  font-weight: bold;
  margin: 10px;
}
.label-bg {
  background: #f5fdff;
}
.disabled {
  background: #f5f7fa;
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
</style>
