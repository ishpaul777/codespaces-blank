import React from "react";
import chat from "../../assets/icons/chat.svg";
import home from "../../assets/icons/home.svg";
import documents from "../../assets/icons/documents.svg";
import templates from "../../assets/icons/templates.svg";
import images from "../../assets/icons/images.svg";

export default function ChatPage() {
  return (
    // chat container, it has 2 sections
    // 1. chat list
    // 2. chat component
    <div className={`grid grid-cols-[2fr_8fr] h-[100vh]`}>
      <div className="bg-white h-full flex justify-center items-center p-[7px]">
        <div className="w-[88%] h-[95%] flex flex-col justify-between items-start gap-2 p-0">
          <div className="flex flex-row items-start gap-[10%] w-[101%] h-[6%] p-0">
            <div className="  flex flex-row  items-center w-4/5 h-full not-italic font-normal text-sm leading-[22px] border rounded border-solid border-[#1E1E1E] cursor-pointer ">
              <img className="ml-8 mr-2" src={chat} alt="chat" />
              <div>New Chat</div>
            </div>
            <div className="flex justify-center items-center w-[30%] h-[100%] border rounded border-solid border-[#1E1E1E] cursor-pointer">
              <img src={chat} alt="chat" />
            </div>
          </div>
          <div className="flex flex-col items-start w-4/5 h-[35%]">
            <div className="flex flex-row justify-center items-center gap-2 w-full h-[17%] rounded px-[12%] py-0 cursor-pointer">
              <img src={home} alt="" />
              <div className="h-[50%] w-[90%] flex items-center">
                Clear Connversations
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 w-full h-[17%] rounded px-[12%] py-0 cursor-pointer">
              <img src={documents} alt="" />
              <div className="h-[50%] w-[90%] flex items-center">
                Import Data
              </div>
            </div>
            <div className=" flex flex-row justify-center items-center gap-2 w-full h-[17%] rounded px-[12%] py-0 cursor-pointer">
              <img src={images} alt="" />
              <div className="h-[50%] w-[90%] flex items-center">
                Export Data
              </div>
            </div>
            <div className=" flex flex-row justify-center items-center gap-2 w-full h-[17%] rounded px-[12%] py-0 cursor-pointer">
              <img src={templates} alt="" />
              <div className="h-[50%] w-[90%] flex items-center">
                Light Mode
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 w-full h-[17%] rounded px-[12%] py-0 cursor-pointer">
              <img src={templates} alt="" />
              <div className="h-[50%] w-[90%] flex items-center">
                OpenAI API Keys
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 w-full h-[17%] rounded px-[12%] py-0 cursor-pointer">
              <img src={templates} alt="" />
              <div className="h-[50%] w-[90%] flex items-center">
                Plugin Keys
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-chat-background h-full">
        <div className="box-border flex flex-col items-start absolute w-[70%] h-[60%] p-0 left-[22%] top-[6%] ">
          <div className=" box-border bg-[#f3f4f6 flex flex-row items-center gap-2 w-full h-[8%] p-[3%] rounded-lg not-italic font-medium text-sm leading-5 text-[#1E1E1E]">
            Help me create a short story about blogging
          </div>
          <div className=" bg-[#e4e7ed] flex flex-row items-center gap-2 w-full h-[92%] p-[2%] rounded-lg">
            <div className=" w-[70%] h-full not-italic font-medium text-sm text-[#1E1E1E]">
              Once upon a time there was a blogger who wanted to make their
              voice heard. After months of hard work and dedication, they had
              finally managed to create a blog that people could read and
              appreciate.
              <br />
              <br />
              The blog contained articles about various topics from health and
              wellbeing to politics and current events. It began to grow in
              popularity quickly as the blogger had something unique to share
              with their readers. They were passionate about their work and
              wanted to do whatever it took to make sure that the blog gained
              more readership each day.
              <br />
              <br />
              One day, while browsing online, the blogger came across an
              opportunity that could make all their dreams come true - a chance
              to write for one of the biggest online publications in the world!
              Excited by this prospect, they applied straight away and waited
              anxiously for a response.
              <br />
              <br />
              Soon enough they got word back that they had been accepted! The
              blogger was overjoyed and couldn't wait to start writing for this
              amazing publication. However, despite being paid for their work,
              the blogger continued running their own personal blog every week
              just for fun - as it had started something special in them which
              no amount of fame or money could ever replace.
            </div>
          </div>
        </div>
        <div className="">
          
        </div>
      </div>
    </div>
  );
}
