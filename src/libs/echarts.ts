// src/libs/echarts.ts
import * as echarts from 'echarts/core';
import {BarChart} from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    DatasetComponent,
    TransformComponent,
} from 'echarts/components';
import {LabelLayout, UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
    BarChart,
    GridComponent,
    TooltipComponent,
    DatasetComponent,
    TransformComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
]);

export {echarts};
