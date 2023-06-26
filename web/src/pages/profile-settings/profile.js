import React from 'react';
import useDarkMode from '../../hooks/useDarkMode';

const Profile = () => {
  const { darkMode } = useDarkMode();
  return (
    <div className="h-screen w-screen fixed">
      <div className="flex flex-col items-start gap-6 absolute w-[70%] h-3/6 p-0 left-[4%] top-[12%]">
        <div className="flex flex-row items-center gap-[2%] w-full h-[10%] p-0">
          <div
            className={`w-fit h-full not-italic font-semibold text-3xl text-[#1e1e1e] ${
              darkMode && 'text-white'
            }`}
          >
            Profile Settings
          </div>
        </div>
        <div className="flex flex-col items-start gap-[10%] w-2/5 h-[90%] p-0">
          <div className="flex flex-col items-start gap-[10%] w-full h-[90%] p-0">
            <div className="flex flex-col items-start gap-[3%] w-full h-[26%] p-0">
              <label
                className={`w-auto h-2/5 not-italic font-medium text-sm text-[#344054] mb-[5px] ${
                  darkMode && 'text-dark-text'
                }`}
                htmlFor="first-name"
              >
                First Name
              </label>
              <input
                type="text"
                className="bg-[#ffffff] box-border flex flex-row items-center gap-2 w-full h-auto border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-3.5 py-2.5 rounded-lg border-solid border-[#d0d5dd]"
              />
            </div>
            <div className="flex flex-col items-start gap-[3%] w-full h-[26%] p-0">
              <label
                className={`w-auto h-2/5 not-italic font-medium text-sm text-[#344054] mb-[5px] ${
                  darkMode && 'text-dark-text'
                }`}
                htmlFor="last-name"
              >
                Last Name
              </label>
              <input
                type="text"
                className="bg-[#ffffff] box-border flex flex-row items-center gap-2 w-full h-auto border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-3.5 py-2.5 rounded-lg border-solid border-[#d0d5dd]"
              />
            </div>

            <div className="flex flex-col items-start gap-[3%] w-full h-[26%] p-0">
              <label
                className={`w-auto h-2/5 not-italic font-medium text-sm text-[#344054] mb-[5px] ${
                  darkMode && 'text-dark-text'
                }`}
                htmlFor="e-mail"
              >
                E-Mail
              </label>
              <input
                placeholder="abcd@xyz.com"
                type="email"
                className="bg-[#ffffff] box-border flex flex-row items-center gap-2 w-full h-auto border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] px-3.5 py-2.5 rounded-lg border-solid border-[#d0d5dd]"
              />
            </div>
          </div>
          <button className="bg-[#1e1e1e] box-border flex flex-row justify-center items-center gap-2 text-base w-3/12 h-[12%] border shadow-[0px_1px_2px_rgba(16,24,40,0.05)] text-white px-[5%] py-[2%] rounded-lg border-solid border-[#1E1E1E]">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
