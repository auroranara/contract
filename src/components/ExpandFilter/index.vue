<script>
export default {
  name: 'ExpandFilter',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    fields: {
      type: Array,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    layout: {
      type: Object,
      default: () => ({
        md: 12,
        sm: 24,
      }),
    },
    showExpand: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      expand: false, // 不展开（默认）
    }
  },
  methods: {
    onClickExpand() {
      this.expand = !this.expand
    },
  },
  render(h) {
    if (this.type === 'inline') {
      return (
        <div class="filter-container">
          <div class="filter">
            <el-form inline={true}>
              {this.fields.map((item) =>
                this.expand || (!this.expand && item.alwaysShow) ? (
                  <el-form-item
                    label={this.showLabel ? item.label : null}
                    key={item.field}
                  >
                    {item.render && item.render(this.model)}
                  </el-form-item>
                ) : null
              )}
            </el-form>
          </div>
          <div class="operations">
            {this.$slots.operations}
            {this.showExpand && this.fields.length > 2 && (
              <el-link
                type="primary"
                underline={false}
                onClick={this.onClickExpand}
              >
                <i
                  class={{
                    'el-icon-arrow-down': true,
                    'expand-icon': true,
                    expand: this.expand,
                  }}
                ></i>
                {this.expand ? '收起' : '展开'}
              </el-link>
            )}
          </div>
        </div>
      )
    }
    return (
      <div>
        <el-form label-position="right" label-width="100px">
          <el-row gutter={12}>
            {this.fields.map((item) => (
              <el-col attrs={{ ...this.layout }} key={item.field}>
                {this.expand || (!this.expand && item.alwaysShow) ? (
                  <el-form-item label={this.showLabel ? item.label : null}>
                    {item.render && item.render(this.model)}
                  </el-form-item>
                ) : null}
              </el-col>
            ))}
          </el-row>
        </el-form>
        <el-row gutter={12}>
          <el-col class="is-right" span={24}>
            {this.$slots.operations}
            {this.showExpand && this.fields.length > 2 && (
              <el-link
                type="primary"
                underline={false}
                onClick={this.onClickExpand}
              >
                <i
                  class={{
                    'el-icon-arrow-down': true,
                    'expand-icon': true,
                    expand: this.expand,
                  }}
                ></i>
                {this.expand ? '收起' : '展开'}
              </el-link>
            )}
          </el-col>
        </el-row>
      </div>
    )
  },
}
</script>

<style lang="scss" scoped>
.filter-container {
  display: flex;
  .filter {
    flex: 1 1;
    & > div {
      display: inline-block;
      margin: 0 7px 10px 0;
    }
  }
  .operations {
    flex: none;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
.mb10px {
  margin-bottom: 10px;
}
.is-right {
  text-align: right;
}
.expand-icon {
  margin-left: 10px;
  transition: transform 0.3s ease;
}
.expand {
  transform: rotate(180deg);
}
</style>
