<script>
export default {
  name: 'BlcokTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  render(h) {
    return (
      <div class="block-title">
        <span>{this.title}</span>
      </div>
    )
  },
}
</script>
<style lang="scss" scoped>
.block-title {
  // border-bottom: 2px solid #1890ff;
  padding-left: 10px;
  padding-bottom: 5px;
  margin-bottom: 10px;
  & > span {
    display: inline-block;
    padding-left: 8px;
    height: 26px;
    line-height: 26px;
    border-left: 4px solid #1890ff;
    font-size: 18px;
  }
}
</style>
