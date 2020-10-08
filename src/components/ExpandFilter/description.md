## 筛选组件

- 参数

  | 参数       |                    说明                     | 是否必须 |  类型   |     可选值     |    默认值     |
  | ---------- | :-----------------------------------------: | :------: | :-----: | :------------: | :-----------: |
  | fields     |                  配置筛选                   |    是    |  array  |       ——       |      ——       |
  | model      |               数据绑定的对象                |    是    | object  |       ——       |      ——       |
  | type       |         行内筛选还是使用响应式布局          |    否    | string  | inline/default |    default    |
  | showLabel  |               是否显示 label                |    否    | boolean |       ——       |     true      |
  | layout     | 当 type 不为 inline 时控制布局，参考 el-col |    否    | object  |       ——       | {md:12,sm:24} |
  | showExpand |            是否显示展开/收起按钮            |    否    | boolean |       ——       |     true      |

- fields 配置

  | 参数       |           说明            | 是否必填 |   类型   |
  | ---------- | :-----------------------: | :------: | :------: |
  | field      | 与 model 绑定的参数，唯一 |    是    |  string  |
  | render     |  渲染函数,传入参数 model  |    是    | function |
  | alwaysShow |  是否在筛选栏收起时显示   |    否    | boolean  |
