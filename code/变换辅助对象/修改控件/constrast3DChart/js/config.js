import base from './base';

export const config = {
  base,
  configuration: [
    {
      _name: 'chart',
      _displayName: '组件',
      _value: [
        {
          _name: 'dimension',
          _displayName: '位置尺寸',
          _value: [
            {
              _name: 'chartPosition',
              _displayName: '图表位置',
              _value: [
                {
                  _name: 'left',
                  _displayName: 'X轴坐标',
                  _labelLayout: 24,
                  _labelPosition: 'bottom',
                  _value: 100,
                },
                {
                  _name: 'top',
                  _labelLayout: 24,
                  _labelPosition: 'bottom',
                  _displayName: 'Y轴坐标',
                  _value: 100,
                },
              ],
              _labelLayout: 8,
            },
            {
              _name: 'chartDimension',
              _displayName: '图表尺寸',
              _value: [
                {
                  _name: 'width',
                  _displayName: '宽度',
                  _labelLayout: 24,
                  _labelPosition: 'bottom',
                  _value: 600,
                },
                {
                  _name: 'height',
                  _displayName: '高度',
                  _labelLayout: 24,
                  _labelPosition: 'bottom',
                  _value: 400,
                },
              ],
              _labelLayout: 8,
            },
          ],
        },
        {
          _name: 'component',
          _displayName: '全局样式',
          _value: [
            {
              _name: 'animStopTime',
              _displayName: '停止时长/秒',
              _type: 'number',
              _value: 1,
              _min: 0.1,
            },
            {
              _name: 'animTime',
              _displayName: '动画间隔/秒',
              _type: 'number',
              _value: 1,
              _min: 0.1,
            },
            {
              _name: 'panelLineWidth',
              _displayName: '面板线宽度',
              _type: 'number',
              _value: '2',
              _min: 1,
            },
            {
              _name: 'baseY',
              _displayName: '基础高度',
              _value: -20,
              _type: 'number',
            },
            {
              _name: 'scaleX',
              _displayName: '图表横向宽度',
              _value: 50,
              _type: 'number',
              _value: 50,
              _min: 0,
            },
          ],
        },
        {
          _name: 'infoBox',
          _displayName: '信息提示框',
          _value: [
            {
              _name: 'infoTextColor',
              _displayName: '提示框字体颜色',
              _value: '#ffffff',
              _type: 'color',
            },
            {
              _name: 'fontFamily',
              _displayName: '字体',
              _value: 'Microsoft Yahei',
              _type: 'font',
            },
            {
              _name: 'fontSize',
              _displayName: '字体大小',
              _value: 50,
              _type: 'number',
              _min: 0,
            },
            {
              _name: 'horizaltalLineLength',
              _displayName: '横线增加长度',
              _value: 0,
              _type: 'number',
            },
            {
              _name: 'infoBoxAddWidth',
              _displayName: '增加宽度',
              _value: 0,
              _type: 'number',
              _min: 0,
            },
            {
              _name: 'infoBoxAddHeight',
              _displayName: '增加高度',
              _value: 0,
              _type: 'number',
              _min: 0,
            },
          ],
        },
        {
          _name: 'axisY',
          _displayName: 'Y轴',
          _value: [
            {
              _name: 'axisMark',
              _displayName: '轴标签',
              _value: [
                {
                  _name: 'max',
                  _displayName: '最大值',
                  _type: 'number',
                  _value: 50,
                  _min: 1,
                },
                {
                  _name: 'min',
                  _displayName: '最小值',
                  _type: 'number',
                  _value: 0,
                },
                {
                  _name: 'count',
                  _displayName: '数量',
                  _type: 'number',
                  _value: 5,
                  _min: 1,
                },
              ],
            },
            {
              _name: 'axisColor',
              _displayName: 'Y轴颜色',
              _type: 'color',
              _value: '#cccccc',
            },
            {
              _name: 'axisTextColor',
              _displayName: 'Y轴文字颜色',
              _type: 'color',
              _value: '#cccccc',
            },
            {
              _name: 'spaceToAxis',
              _displayName: 'Y轴文本距轴间隔',
              _type: 'number',
              _value: 50,
              _max: 120,
              _min: 0,
            },
            {
              _name: 'axisLength',
              _displayName: 'Y轴基础高度',
              _type: 'number',
              _value: 50,
              _min: 1,
            },
            {
              _name: 'axisWidth',
              _displayName: 'Y轴粗细',
              _type: 'number',
              _value: 2,
              _min: 1,
            },
            {
              _name: 'fontSize',
              _displayName: 'Y轴字体大小',
              _type: 'number',
              _value: 20,
              _max: 30,
              _min: 5,
            },
          ],
        },
        {
          _name: 'cameraPosition',
          _displayName: '相机位置',
          _value: [
            {
              _name: 'x',
              _displayName: 'x',
              _value: 0,
            },
            {
              _name: 'y',
              _displayName: 'y',
              _value: 0,
            },
            {
              _name: 'z',
              _displayName: 'z',
              _value: 130,
            },
          ],
        },
        {
          _name: 'iconConfig',
          _displayName: '图例配置',
          _value: [
            {
              _name: 'show',
              _displayName: '显示',
              _value: true,
              _type: 'boolean',
            },
            // {
            //   _rule: [['show', '$eq', true]],
            //   _name: 'fontFamily',
            //   _displayName: '字体',
            //   _value: 'Microsoft Yahei',
            //   _type: 'font',
            // },
            // {
            //   _rule: [['show', '$eq', true]],
            //   _name: 'fontSize',
            //   _displayName: '字体大小',
            //   _value: 24,
            //   _type: 'number',
            // },
            // {
            //   _rule: [['show', '$eq', true]],
            //   _name: 'iconSize',
            //   _displayName: '图标大小',
            //   _value: 24,
            //   _type: 'number',
            // },
            // {
            //   _rule: [['show', '$eq', true]],
            //   _name: 'color',
            //   _displayName: '字体颜色',
            //   _type: 'color',
            //   _value: '#ffffff',
            // },
            {
              _rule: [['show', '$eq', true]],
              _name: 'textStyle',
              _displayName: '图例文本',
              _value: [
                {
                  // _rule: [['show', '$eq', true]],
                  _name: 'fontFamily',
                  _displayName: '字体',
                  _value: 'Microsoft Yahei',
                  _type: 'font'
                },
                {
                  // _rule: [['show', '$eq', true]],
                  _name: 'fontSize',
                  _displayName: '字体大小',
                  _value: 24,
                  _type: 'number',
                },
                {
                  // _rule: [['show', '$eq', true]],
                  _name: 'iconSize',
                  _displayName: '图标大小',
                  _value: 24,
                  _type: 'number',
                },
                {
                  // _rule: [['show', '$eq', true]],
                  _name: 'color',
                  _displayName: '字体颜色',
                  _type: 'color',
                  _value: '#ffffff',
                }
              ]
            },
            {
              _rule: [['show', '$eq', true]],
              _name: 'layout',
              _displayName: '图例布局',
              _value: [
                {
                  _name: 'position',
                  _displayName: '位置',
                  _value: 'left',
                  _type: 'radio',
                  _options: [
                    { name: '左', value: 'left' },
                    { name: '右', value: 'right' },
                    { name: '下', value: 'bottom' },
                  ],
                },
                {
                  _rule: [['position', '$eq', 'bottom']],
                  _name: 'align',
                  _displayName: '对齐',
                  _value: 'center',
                  _type: 'radio',
                  _options: [
                    { name: '开头', value: 'left' },
                    { name: '中央', value: 'center' },
                    { name: '结尾', value: 'right' },
                  ],
                },
                {
                  _name: 'marginRight',
                  _displayName: '间距',
                  _value: 10,
                  _min: 0,
                  _type: 'number',
                },
              ],
            },
          ],
        },
        {
          _name: 'dtseries',
          _displayName: '数据系列',
          _type: 'array',
          _template: [
            {
              _name: 'serie',
              _displayName: '系列',
              _type: 'object',
              _value: [
                {
                  _name: 'name',
                  _displayName: '系列名',
                  _value: '系列一',
                  _type: 'input',
                },
                {
                  _name: 'color',
                  _displayName: '颜色',
                  _value: '颜色',
                  _type: 'color',
                },
              ],
            },
          ],
          _value: [
            {
              _name: '系列一',
              _displayName: '系列',
              _type: 'object',
              _value: [
                {
                  _name: 'name',
                  _displayName: '系列名',
                  _value: '系列一',
                  _type: 'input',
                },
                {
                  _name: 'color',
                  _displayName: '颜色',
                  _value: '#ffff00',
                  _type: 'color',
                },
              ],
            },
            {
              _name: '系列二',
              _displayName: '系列',
              _type: 'object',
              _value: [
                {
                  _name: 'name',
                  _displayName: '系列名',
                  _value: '系列二',
                  _type: 'input',
                },
                {
                  _name: 'color',
                  _displayName: '颜色',
                  _value: '#0fff00',
                  _type: 'color',
                },
              ],
            },
            {
              _name: '系列三',
              _displayName: '系列',
              _value: [
                {
                  _name: 'name',
                  _displayName: '系列名',
                  _value: '系列三',
                  _type: 'input',
                },
                {
                  _name: 'color',
                  _displayName: '颜色',
                  _value: '#00fff0',
                  _type: 'color',
                },
              ],
            },
            {
              _name: '系列四',
              _displayName: '系列',
              _value: [
                {
                  _name: 'name',
                  _displayName: '系列名',
                  _value: '系列四',
                  _type: 'input',
                },
                {
                  _name: 'color',
                  _displayName: '颜色',
                  _value: '#0000ff',
                  _type: 'color',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
