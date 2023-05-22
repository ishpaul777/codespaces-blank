import React, { useState } from "react";
// import './SliderInput.css';

const SliderInput = ({ min, max, step, defaultValue, heading }) => {
  const [sliderValue, setSliderValue] = useState(defaultValue);

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value);
    setSliderValue(value);
  };

  const calculateTrackStyle = () => {
    const percentage = ((sliderValue - min) / (max - min)) * 100;

    return {
      background: `linear-gradient(to right, #1e1e1e ${percentage}%, #f2f2f2 ${percentage}%)`,
    };
  };

  return (
    <div>
      <div className="flex justify-between not-italic font-medium text-sm leading-5 text-[#344054]">
        {heading}
        <span>{sliderValue}</span>
      </div>
      <input
        style={calculateTrackStyle()}
        type="range"
        className=" w-[180px] h-[7px] bg-[#1e1e1e] rounded mr-2.5 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#fefefe] [&::-webkit-slider-thumb]:shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)] [&::-webkit-slider-thumb]: cursor-pointer [&::-webkit-slider-thumb]:border-[1.5px]  [&::-webkit-slider-thumb]:border-solid border-[#1e1e1e]  "
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default SliderInput;
