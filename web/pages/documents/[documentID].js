import { useState } from 'react'
import arrowIcon from '../../public/icons/arrow-left.svg'
import infoIcon from '../../public/icons/info-icon.svg'
import arrow from '../../public/icons/arrow.svg'

export default function Document(){ 

  const [prompt, setPrompt] = useState('');
  const styles = {
    input: {
      borderColor: "#D0D5DD",
      placeholderColor: "#667085"
    },
    countColor: "#929DAF",
  }

  const handleGoBack = () => {
    console.log('go back')
  }

  const handlePromptChange = (value) => {
    setPrompt(value)
  }

  return (
  // container for new/edit document page 
  <div className="h-screen w-full ">
    {/* this is control section, it will have a prompt input, keyword input, language input and output length */}
    <div className={`w-1/4 h-screen bg-background-sidebar`}>
      {/* actions container */}
      <div className='p-10 cursor-pointer flex flex-col gap-11'>
        {/* image container */}
        <div>
          {/* backbutton icon */}
          <img src={arrowIcon.src} onClick={handleGoBack}></img>
        </div>
        {/* input division - each input division will have label, a form input type and input-length counter */}
        {/* prompt section */}
        <div className={`flex flex-col gap-2`}>
          {/* label division*/}
          <div className='flex gap-2'>
            <label htmlFor="contentDescription" className={`font-medium text-form-label text-sm`}>Content description / brief</label>
            <img src={infoIcon.src}/>
          </div>
          <textarea className={`pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg resize-none h-32 placeholder:[${styles.input.placeholderColor}]`} placeholder="Write an article about..." maxLength={600} onChange={(e) => handlePromptChange(e.target.value)}></textarea>
          <div className='flex flex-row-reverse'>
            <p className={`text-[${styles.countColor}]`}>{`${prompt?.length}/600`}</p>
          </div>
        </div>
        {/* keywords section */}
        <div className={`flex flex-col gap-2`}>
          <div className='flex gap-2'>
            <label htmlFor="keywords" className={`font-medium text-form-label text-sm`}> Keywords </label>
            <img src={infoIcon.src}/>
          </div>
          <input className={`pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg placeholder:[${styles.input.placeholderColor}]`} placeholder={'enter keywords'}></input>
        </div>
        {/* languages section */}
        <div className={`flex flex-col gap-2`}>
          <div className='flex gap-2'>
            <label htmlFor="languages" className={`font-medium text-form-label text-sm`}>Select language</label>
            <img src={infoIcon.src}/>
          </div>
          <div className='flex w-full pt-2 pb-2 pl-3 pr-3 border-[${styles.input.borderColor}] border rounded-lg bg-white'>
            <select className={`appearance-none w-[98%] cursor-pointer focus:outline-none`}>
              <option value="english">English</option>
              <option value="spanish">Hindi</option>
              <option value="french">Telugu</option>
            </select>
            <img src={arrow.src}/>
          </div>
        </div>
        <div className='flex flex-col gap-2`'>

        </div>
      </div>
    </div>
  </div>
  )
}