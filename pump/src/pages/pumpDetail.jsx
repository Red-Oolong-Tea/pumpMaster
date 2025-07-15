import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPumpById } from '../api/api';

import {
 LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

export default function PumpDetail() {
  const { id } = useParams();
  const [pump, setPump] = useState(null);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const p = getPumpById(id);
    setPump(p);
  }, [id]);

  if (!pump) return <div className="p-6">Pump not found</div>;

  return (
    <div className="p-6 space-y-8">
        
    <div className="flex justify-between items-start">
    <div>
        <h1 className="text-3xl font-bold">Pump {pump.name}</h1>
    </div>
    <div className="text-sm grid gap-1">
        <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-2">
        <span className="text-gray-500">Pump ID:</span>
        <span className="text-right">{pump.id}</span>
        </div>
        <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-2">
        <span className="text-gray-500">Status:</span>
        <span className="text-right">{pump.status}</span>
        </div>
        <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-2">
        <span className="text-gray-500">Last Updated:</span>
        <span className="text-right">{pump.lastUpdated}</span>
        </div>
    </div>
    </div>

      {/* Attributes */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Attributes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Attribute label="Type" value={pump.type} />
          <Attribute label="Area" value={pump.area} />
          <Attribute
            label="Location"
            value={`${pump.latitude}°, ${pump.longitude}°`}
          />
          <Attribute label="FlowRate" value={pump.flowRate } />
          <Attribute label="Offset" value={pump.offset} />
          <Attribute
            label="Pressure"
            value={`${pump.pressureCurrent} psi | ${pump.pressureMin} psi | ${pump.pressureMax} psi`}
          />
        </div>
      </div>

      {/* Map Placeholder */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Map</h2>
        <div className="bg-gray-200 h-72 rounded flex items-center justify-center">
          <span className="text-gray-500">This is pump location map</span>
        </div>
      </div>

      {/* Pressure Over Time */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Pressure Over Time</h2>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-lg font-bold">{pump.pressureCurrent}</div>
            <div className="text-sm text-green-600">Last 24 Hours +5%</div>
          </div>
         <select
            className="border rounded px-2 py-1 text-sm"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
        </select>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
            {chartType === 'line' ? (
                <LineChart data={pump.pressureHistory || []}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[100, 200]} unit=" psi" />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="pressureMin"
                        stroke="#8884d8"
                        name="Pressure Min"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="pressureMax"
                        stroke="#82ca9d"
                        name="Pressure Max"
                        dot={false}
                    />
                </LineChart>
                
            ) : (
                <BarChart
                data={pump.pressureHistory || []}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis  domain={[100, 200]} unit=" psi" />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey="pressureMin"
                    fill="#8884d8"
                    name="Pressure Min"
                />
                <Bar
                    dataKey="pressureMax"
                    fill="#82ca9d"
                    name="Pressure Max"
                />
                </BarChart>
            )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Attribute({ label, value }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div>{value}</div>
    </div>
  );
}
