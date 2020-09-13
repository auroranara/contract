<script>
export default {
  name: 'ExpandFilter',
  props: {
    fields: {
      type: Array,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
    layout: {
      type: Object,
      default: () => ({
        md: 12,
        sm: 24,
      }),
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
    return (
      <el-card>
        <el-form label-position="right" label-width="100px">
          <el-row gutter={12}>
            {this.fields.map((item) => (
              <el-col attrs={{ ...this.layout }} key={item.field}>
                {this.expand || (!this.expand && item.alwaysShow) ? (
                  <el-form-item label={item.label}>
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
          </el-col>
        </el-row>
      </el-card>
    )
  },
}
</script>

<style lang="scss" scoped>
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
