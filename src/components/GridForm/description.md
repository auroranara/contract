## 表格式表单

- 参数

  |   名称   |                  说明                  | 是否必须 |  类型  |
  | :------: | :------------------------------------: | :------: | :----: |
  |  model   |              表单数据对象              |    否    | object |
  | settings |               配置项列表               |    是    | array  |
  |  rules   | 表单验证规则（暂时用于显示必填的红星） |    否    | object |

- rules 参照 element-ui 表单 rules

- setting 配置

  |   名称   |                 说明                 | 是否必须 |   类型   |        可选         |  默认   |
  | :------: | :----------------------------------: | :------: | :------: | :-----------------: | :-----: |
  |   type   |              单元格类型              |    是    |  string  | label/empty/handler | handler |
  | required |               是否必填               |    否    | boolean  |         ——          |   ——    |
  |  showBg  |            是否显示背景色            |    否    | boolean  |         ——          |   ——    |
  |  label   |      type 为 label 时单元格内容      |    否    |  string  |         ——          |   ——    |
  |  field   | model 中的参数名，用于数据绑定及校验 |    否    |  string  |         ——          |   ——    |
  | disabled |        是否显示禁止操作背景色        |    否    | boolean  |         ——          |   ——    |
  |  render  |               渲染函数               |    否    | function |         ——          |   ——    |
  | rowspan  |   单元格占据行数，当为'0'时不显示    |    否    |  string  |     数字字符串      |   '1'   |
  | colspan  |    单元格占据列数，当为'0'时不显     |    否    |  string  |     数字字符串      |   '1'   |
  |  align   |             字体对齐方式             |    否    |  string  |  left/center/right  |  left   |
  | colStyle |             单元格 style             |    否    |  object  |         ——          |   ——    |
  |   tag    | type 为 handler 时单元格内显示的标签 |    否    |  string  |         ——          |   ——    |
  | tagProps |             tag 传入参数             |    否    |  object  |         ——          |   ——    |
