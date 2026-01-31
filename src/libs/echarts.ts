// src/libs/echarts.ts
import * as echarts from 'echarts/core';
import {BarChart, PieChart} from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    GraphicComponent,
    DatasetComponent,
    TransformComponent,
} from 'echarts/components';
import {LabelLayout, UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
    BarChart,
    PieChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    GraphicComponent,
    DatasetComponent,
    TransformComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
]);

export {echarts};
