import React, { FC } from "react";

type Props = {
  percentage: number;
  height?: string;
  color?: string;
  bgColor?: string;
};

const StudentProgressBar: FC<Props> = ({
  percentage,
  height = "8px",
  color = "#37a39a",
  bgColor = "bg-gray-200 dark:bg-slate-700",
}) => {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">Progress</span>
        <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">{safePercentage}%</span>
      </div>
      <div className={`w-full ${bgColor} rounded-full`} style={{ height }}>
        <div
          className="rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${safePercentage}%`, height: "100%", backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default StudentProgressBar;
