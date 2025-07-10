import React from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  color: string;
  fillOpacity?: number;
}

interface ChartProps {
  data?: Array<{ label: string; value: number }>; // Keep for backward compatibility
  datasets?: ChartDataset[]; // New prop for multi-line charts
  type: 'bar' | 'line' | 'pie';
  height?: number;
  color?: string;
}

const Chart: React.FC<ChartProps> = ({ data, datasets, type, height = 300, color = '#3B82F6' }) => {
  // Use datasets if provided, otherwise convert single data to datasets format
  const chartDatasets = datasets || (data ? [{
    label: 'Data',
    data: data,
    color: color,
    fillOpacity: 0.1
  }] : []);

  if (!chartDatasets || chartDatasets.length === 0 || chartDatasets.every(dataset => !dataset.data || dataset.data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Calculate max value across all datasets
  const maxValue = Math.max(...chartDatasets.flatMap(dataset => dataset.data.map(item => item.value)));
  if (maxValue === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }
  
  const padding = 50;
  const chartWidth = Math.max(400, (chartDatasets[0]?.data.length || 0) * 80); // Dynamic width based on data points
  const chartHeight = height - padding * 2;

  const renderBarChart = () => {
    const singleDataset = chartDatasets[0];
    if (!singleDataset) return null;

    const barWidth = Math.max(20, Math.min(60, (chartWidth - padding * 2) / singleDataset.data.length - 10));

    return (
      <div className="w-full overflow-x-auto">
        <svg 
          width={chartWidth} 
          height={height} 
          viewBox={`0 0 ${chartWidth} ${height}`} 
          className="min-w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = padding + (chartHeight * (1 - percent / 100));
            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                  fontSize="12"
                >
                  {Math.round((maxValue * percent) / 100)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {singleDataset.data.map((item, index) => {
            const x = padding + index * (barWidth + 10) + 5;
            const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
            const y = padding + chartHeight - barHeight;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={singleDataset.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  rx="2"
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="11"
                >
                  {item.label}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium"
                  fontSize="11"
                >
                  {item.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderLineChart = () => {
    if (!chartDatasets[0]) return null;

    const dataLength = chartDatasets[0].data.length;
    const pointSpacing = (chartWidth - padding * 2) / Math.max(1, dataLength - 1);

    return (
      <div className="w-full overflow-x-auto">
        <svg 
          width={chartWidth} 
          height={height} 
          viewBox={`0 0 ${chartWidth} ${height}`} 
          className="min-w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = padding + (chartHeight * (1 - percent / 100));
            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-400"
                  fontSize="11"
                >
                  {Math.round((maxValue * percent) / 100)}
                </text>
              </g>
            );
          })}

          {/* Render each dataset */}
          {chartDatasets.map((dataset, datasetIndex) => {
            const points = dataset.data.map((item, index) => ({
              x: padding + (dataLength === 1 ? (chartWidth - padding * 2) / 2 : index * pointSpacing),
              y: padding + chartHeight - (maxValue > 0 ? (item.value / maxValue) * chartHeight : 0)
            }));

            const pathData = points.map((point, index) => 
              `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
            ).join(' ');

            return (
              <g key={datasetIndex}>
                {/* Area under the line */}
                {points.length > 1 && (
                  <path
                    d={`${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`}
                    fill={dataset.color}
                    fillOpacity={dataset.fillOpacity || 0.1}
                  />
                )}

                {/* Line */}
                {points.length > 1 && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke={dataset.color}
                    strokeWidth="2.5"
                    className="drop-shadow-sm"
                  />
                )}

                {/* Points */}
                {points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={dataset.color}
                    className="hover:r-6 transition-all cursor-pointer drop-shadow-sm"
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}
              </g>
            );
          })}

          {/* X-axis labels */}
          {chartDatasets[0] && chartDatasets[0].data.map((item, index) => {
            const x = padding + (dataLength === 1 ? (chartWidth - padding * 2) / 2 : index * pointSpacing);
            return (
              <text
                key={index}
                x={x}
                y={height - 15}
                textAnchor="middle"
                className="text-xs fill-gray-600"
                fontSize="11"
              >
                {item.label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
    </div>
  );
};

export default Chart;