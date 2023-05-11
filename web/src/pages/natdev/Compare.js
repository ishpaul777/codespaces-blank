import React,{useState} from "react";
import ArrowLeftIOS from "../../assets/icons/ArrowLeftIOS.svg";
import Ellipse from "../../assets/icons/Ellipse.svg";
import reset from "../../assets/icons/reset.svg";
import refresh from "../../assets/icons/refresh.svg";
import clear from "../../assets/icons/clear.svg";
import eye from "../../assets/icons/eye.svg";

import DropDownInput from "./DropDownInput";
import SliderInput from "./SliderInput";
import ReactSlider from "react-slider";

const Compare = () => {
  return (
    <div className="w-100%">
        <div className="absolute bg-[#ffffff] box-border flex flex-col justify-center items-center gap-2  w-[100%] h-[10%] border-b-[#E9E9E9] border-b border-solid ">
        <div className=" flex flex-row justify-between items-center w-[95%] h-[80%] ">
          <div className="flex flex-row items-center  gap-2.5 w-fit h-[60%] px-[2%]">
            <img src={ArrowLeftIOS} alt="back" />
            <div className="flex flex-row items-center justify-center gap-7 w-[207px] h-[22px] p-0">
              <div className="w-[99px] h-[100%] not-italic font-semibold text-lg leading-[22px] text-[#9c9c9c] cursor-pointer">
                Playground
              </div>
              <div className="w-20 h-[100%] not-italic font-semibold text-lg leading-[22px] text-[#1e1e1e] cursor-pointer">
                Compare
              </div>
            </div>
          </div>
          <div className="flex flex-row relative items-center gap-3.5 w-fit h-[100%] p-0 right-0 ">
            <div className="bg-[#f2f2f2] flex flex-row items-center justify-center gap-2 w-97px h-6 px-5 py-0.5 rounded-[23px] not-italic font-semibold text-sm leading-5 text-[#1D2939]">
              100.000
            </div>
            <div className=" h-fit w-fit ">
              <img src={Ellipse} alt="pfl" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start justify-evenly gap-3 absolute min-w-[20%] h-[90%] px-[29px] py-[10px] right-[0] top-[10%] bg-[#f9fafb] ">
        <div className="flex flex-col items-start gap-4 w-[90%] h-[99%] p-0;">
          <div className="flex flex-col items-start gap-4 w-full h-[65%] p-0">
          <div className="flex justify-between w-full">
            <span className="not-italic font-medium text-xs leading-5 text-[#344054]">Parameters</span>
            <div className="flex flex-row justify-center items-center gap-2 w-7 h-6 border px-[5px] rounded-md border-solid border-[#EDEDED] cursor-pointer">
                <img src={eye} alt="eye" />
            </div>
          </div>
            <div className="w-full h-1/7 gap-2 flex flex-col justify-evenly">
            
              <SliderInput heading="Maximum Length" min={0} max={600} step={1} defaultValue={200}  />
            </div>
            <div className="w-full h-1/7 gap-2 flex flex-col justify-evenly">
              <SliderInput heading="Temperature" min={0} max={3} step={1} defaultValue={1}  />
            </div>
            <div className="w-full h-1/7 gap-2 flex flex-col justify-evenly">
              
              <SliderInput heading="Top P" min={0} max={3} step={1} defaultValue={1}  />
            </div>
            <div className="w-full h-1/7 gap-2 flex flex-col justify-evenly">
            
              <SliderInput heading="Top K" min={0} max={100} step={1} defaultValue={30}  />
            </div>
            <div className="w-full h-1/7 gap-2 flex flex-col justify-evenly">
              
              <SliderInput heading="Frequency Penalty" min={0} max={100} step={1} defaultValue={30}  />
            </div>
            <div className="w-full h-1/7 gap-2 flex flex-col justify-evenly">
              <SliderInput heading="Presence Penalty" min={0} max={100} step={1} defaultValue={30}  />
            </div>
          </div>
           
          <div className="flex flex-col gap-[2px] w-full">
            <div className="w-fit h-5 not-italic font-medium text-sm leading-5 text-[#344054]">
              Stop Sequences
            </div>
            <div className="w-[145px] h-5 not-italic font-medium text-[10px] leading-5 text-[#A7A7A7]">
              Enter sequence and press Tab
            </div>
            <input className="bg-[#ffffff] box-border flex flex-row items-start gap-2 w-full h-[46px] border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-3.5 py-2.5 rounded-lg border-solid border-[#D0D5DD] "></input>
          </div>
          <div className="flex flex-col items-start justify-between gap-2  w-full h-auto p-0">
                <div className="w-full flex justify-between ">
                    <div className="w-fit h-fit not-italic font-medium text-sm leading-5 text-[#344054]">Show Probabilities </div>
                    <input type="checkbox"/>
                </div>
                <div className="w-full h-fit flex justify-between ">
                    <div className="w-fit h-fit not-italic font-medium text-sm leading-5 text-[#344054]">Highlight Model</div>
                    <input type="checkbox"/>
                </div>
                <div className="w-full h-fit flex justify-between ">
                    <div className="w-fit h-fit not-italic font-medium text-sm leading-5 text-[#344054]">Enable All</div>
                    <input type="checkbox"/>
                </div>
                <input placeholder="Model name" className="bg-[#ffffff] box-border flex flex-row items-start gap-2 w-full h-[46px] border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-3.5 py-2.5 rounded-lg border-solid border-[#D0D5DD]" ></input>
          </div>
        </div>
      </div>

      <textarea placeholder="Type your prompt here.."  className="box-border absolute w-[74%] h-[28%] border rounded-lg border-solid border-[#DEDEDE] left-[3%] top-[14%] p-[15px]">
      
      </textarea>
      <div className="flex flex-row items-start gap-[11px] absolute w-fit h-fit p-0 left-[66.5%] top-[35%]">
        <button className="box-border flex flex-row justify-center items-center gap-2 w-[95px] h-[31px] border px-[18px] py-2.5 rounded-md border-solid border-[#1E1E1E] bg-[#1e1e1e] not-italic font-semibold text-sm leading-6 text-white">
          Submit
        </button>
        <button className="box-border flex flex-row justify-center items-center gap-2 w-[37px] h-[31px] border  rounded-md border-solid border-[#EDEDED] bg-[#ededed] ">
          <img src={clear} alt="clear" />
        </button>
      </div>
      <div >
      <label className="absolute left-[14%] top-[45%] not-italic font-medium text-sm leading-5 text-[#ABABAB]">
      cohere:command-xlarge-nightly
      </label>
        <textarea placeholder="Enter here.." className="box-border absolute w-[35%] h-[45%] border rounded-lg border-solid border-[#DEDEDE] left-[3%] top-[50%] p-[15px]">

        </textarea>
         <div className="absolute left-[4%] top-[91%] not-italic font-medium text-xs leading-5 text-[#1E1E1E]">00:00</div>
        <div className="absolute left-[34.5%] top-[91%] not-italic font-medium text-xs leading-5 text-[#1E1E1E]">
            0 chars
        </div>
      </div>      
      <div >
      <label className="absolute left-[55%] top-[45%] not-italic font-medium text-sm leading-5 text-[#ABABAB]">
      openai:gpt-3.5-turbo
      </label>
        <textarea placeholder="Enter here.." className="box-border absolute w-[35%] h-[45%] border rounded-lg border-solid border-[#DEDEDE] left-[42%] top-[50%] p-[15px]">

        </textarea>
        <div className="absolute left-[43%] top-[91%] not-italic font-medium text-xs leading-5 text-[#1E1E1E]">00:00</div>
        <div className="absolute left-[73.5%] top-[91%] not-italic font-medium text-xs leading-5 text-[#1E1E1E]">
            0 chars
        </div>
      </div>      
    </div>
  )
}

export default Compare