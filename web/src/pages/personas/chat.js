import { useState } from "react";
import ChatBar from "../chats/chatbar";
import SideBar from "../chats/sidebar";

export const PersonaChat = () => {
  const [stream, setStream] = useState(true);


  return (
    <div className="flex min-h-screen max-h-screen flex-row bg-gray-100 text-gray-800">
      {/* Persona Chat SideBar */}
      <SideBar />
      {/* Persona Chat Main */}
      <ChatBar 
        isSettingVisible={false}
        chat={{
          messages: [{
            'role': 'assistant',
            'message': 'Hello, how can I help you?',
  
          },
          {
            'role': 'user',
            'message': 'I need help with my account',
          }
        ]
        }}
      />
    </div>
  );
};
