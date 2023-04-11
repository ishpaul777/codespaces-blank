export default function ChatPage() {
  return (
    // chat container, it has 2 sections
    // 1. chat list
    // 2. chat component
    <div className={`grid grid-cols-[2fr_8fr] h-[100vh]`}>
      <div className="bg-white h-full"> </div>
      <div className="bg-chat-background h-full"> </div>
    </div>
  );
}
