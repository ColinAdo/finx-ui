import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send } from "lucide-react";

interface ProfileData {
  profile: {
    id: number;
    email: string;
    username: string;
    bio: string;
    profile_picture: string;
    website: string;
    gender: string;
  };
  following: any[];
  followers: any[];
  posts: any[];
  following_count: number;
  followers_count: number;
}

interface Props {
  recipientProfile: ProfileData;
}

export default function Messages({ recipientProfile }: Props) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "me", text: "Hello!", date: "12-8-2024" },
    { id: 2, sender: "them", text: "Hi, how are you?", date: "12-8-2024" },
    {
      id: 3,
      sender: "me",
      text: "I'm doing great, thanks!",
      date: "09-9-2024",
    },
    {
      id: 4,
      sender: "them",
      text: "The issue you're facing is likely due to how the layout is structured and how the widths are applied. To ensure that the scrollable message area (div.flex-1.w-auto) extends to the full width like the submit button, we can make sure the message container fills the entire available width and is responsive to the surrounding layout.",
      date: "09-9-2024",
    },
    {
      id: 5,
      sender: "me",
      text: "The issue you're facing is likely due to how the layout is structured and how the widths are applied. To ensure that the scrollable message area (div.flex-1.w-auto) extends to the full width like the submit button, we can make sure the message container fills the entire available width and is responsive to the surrounding layout.",
      date: "11-9-2024",
    },
  ]);

  return (
    <div className="flex flex-col h-screen lg:ml-8 lg:-mt-12 -mt-20 ">
      <div className="flex items-center fixed lg:left-auto sm:-left-10 right-11 w-96  lg:w-7/12 justify-between p-4 border-b  bg-white dark:bg-black">
        <div className="flex items-center gap-3">
          <img
            src={recipientProfile.profile.profile_picture}
            alt="Recipient Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
            {recipientProfile.profile.username}
          </span>
        </div>
        <button className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75h.008v.008H12V6.75zm0 5.25h.008v.008H12V12zm0 5.25h.008v.008H12v-.008z"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-4 lg:mt-10 lg:py-12 mt-20 mb-32 lg:-mb-6 overflow-y-auto  w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${
              message.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "them" && (
              <img
                src={recipientProfile.profile.profile_picture}
                alt="Recipient Profile"
                className="w-8 h-8 rounded-full mr-3"
              />
            )}
            <div
              className={`max-w-xs p-3 rounded-lg text-white ${
                message.sender === "me" ? "bg-gray-900" : "bg-gray-400"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-14 lg:bottom-0  w-full md:w-7/12 left-0 md:left-auto md:mr-3.5 p-4 border-t bg-white dark:bg-black z-10">
        <form className="flex items-center gap-2 w-full">
          <Input placeholder="Type a message" className="flex-1" />
          <Button type="submit">
            {" "}
            <Send />
          </Button>
        </form>
      </div>
    </div>
  );
}
