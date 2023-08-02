import React from "react";
import {
  AreaChart,
  BarChart,
  Area,
  Bar,
  XAxis,
  Legend,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UsageChart({ usageData, type }) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        {type === "daily" ? (
          <BarChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={
                // set the ticks to be every 5th element
                (tickProps) => {
                  console.log(tickProps);
                  const { x, y, payload } = tickProps;
                  const { index, value } = payload;
                  const isFourthTick = index % 4 === 0;
                  if (isFourthTick) {
                    return (
                      <text x={x} y={y} dy={16} textAnchor="middle" fill="#666">
                        {value}
                      </text>
                    );
                  }
                  return null;
                }
              }
            />
            <YAxis
              dataKey={"total_tokens"}
              label={{
                value: "Words generated",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="total_tokens"
              fill="#67c5ae"
              opacity={0.8}
              name="Total Words Generated"
              isAnimationActive={false}
            />
          </BarChart>
        ) : (
          <AreaChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickCount={10}
              tick={
                // set the ticks to be every 5th element
                (tickProps) => {
                  const { x, y, payload } = tickProps;
                  const { index, value } = payload;
                  const isFourthTick = index % 4 === 0;
                  if (isFourthTick) {
                    return (
                      <text x={x} y={y} dy={16} textAnchor="middle" fill="#666">
                        {value}
                      </text>
                    );
                  }
                  return null;
                }
              }
            />
            <YAxis
              dataKey={"total_tokens"}
              label={{
                value: "Tokens",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="total_tokens"
              fill="#67c5ae"
              name="Total Words Generated"
            />
          </AreaChart>
        )}
        {/* ) : (
          <AreaChart data={usageData}></AreaChart>
        )} */}
      </ResponsiveContainer>
    </div>
  );
}
