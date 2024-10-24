import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import Link from "next/link";
import useWebSocket from "react-use-websocket";

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

interface Users {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
}

interface MessageType {
  id: string;
  name: string;
  body: string;
  send_to: Users;
  created_by: Users;
}

interface ConversationData {
  conversation: {
    id: string;
    users: Users[];
  };
  messages: MessageType[];
}

interface Props {
  recipientProfile: ProfileData;
  conversation: ConversationData;
  myProfile: Users;
}

export default function Messages({
  recipientProfile,
  myProfile,
  conversation,
}: Props) {
  const messagesDiv = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState<MessageType[]>([]);
  const { data: user } = useRetrieveUserQuery();
  const WS_URL = `ws://localhost:8000/api/v1/chat/${conversation.conversation.id}/`;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    console.log("Connection state changed", readyState);
  }, [readyState]);

  useEffect(() => {
    if (
      lastJsonMessage &&
      typeof lastJsonMessage === "object" &&
      "name" in lastJsonMessage &&
      "body" in lastJsonMessage
    ) {
      const message: MessageType = {
        // messages: {
        id: "",
        body: lastJsonMessage.body as string,
        name: lastJsonMessage.name as string,
        send_to: recipientProfile?.profile,
        created_by: myProfile,
        // },
      };

      setRealtimeMessages((realtimeMessages) => [...realtimeMessages, message]);
    }

    scrollToBottom();
  }, [lastJsonMessage]);

  const handleSendMessage = async () => {
    console.log("sendMessage"),
      sendJsonMessage({
        event: "chat_message",
        data: {
          body: newMessage,
          name: user?.username,
          sent_to_id: recipientProfile?.profile.id,
          conversation_id: conversation.conversation.id,
        },
      });

    setNewMessage("");

    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  const scrollToBottom = () => {
    if (messagesDiv.current) {
      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
    }
  };

  if (!conversation) {
    return null;
  }

  return (
    <div className=" flex flex-col h-screen lg:ml-8 lg:-mt-12 -mt-20 ">
      <div className="flex items-center fixed lg:left-auto sm:-left-10 right-11 w-96  lg:w-7/12 justify-between p-4 border-b  bg-white dark:bg-black">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/${recipientProfile.profile.username}`}>
            <img
              src={recipientProfile.profile.profile_picture}
              alt="Recipient Profile"
              className="w-10 h-10 rounded-full"
            />
          </Link>
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

      <div
        ref={messagesDiv}
        className="flex-1 p-4 lg:mt-10 lg:py-12 mt-20 mb-32 lg:-mb-6 overflow-y-auto  w-full"
      >
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              message.created_by.username === myProfile.username
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {message.created_by.username ===
              recipientProfile.profile.username && (
              <Link href={`/dashboard/${recipientProfile.profile.username}`}>
                <img
                  src={recipientProfile.profile.profile_picture}
                  alt="Recipient Profile"
                  className="w-8 h-8 rounded-full mr-3"
                />
              </Link>
            )}
            <div
              className={`max-w-xs p-3 rounded-lg text-white ${
                message.created_by.id === myProfile.id
                  ? "bg-gray-900"
                  : "bg-gray-400"
              }`}
            >
              {message.body}
            </div>
          </div>
        ))}

        {realtimeMessages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              message.name === myProfile.username
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {message.name === recipientProfile.profile.username && (
              <Link href={`/dashboard/${recipientProfile.profile.username}`}>
                <img
                  src={recipientProfile.profile.profile_picture}
                  alt="Recipient Profile"
                  className="w-8 h-8 rounded-full mr-3"
                />
              </Link>
            )}
            <div
              className={`max-w-xs p-3 rounded-lg text-white ${
                message.name === myProfile.username
                  ? "bg-gray-900"
                  : "bg-gray-400"
              }`}
            >
              {message.body}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-14 lg:bottom-0  w-full md:w-7/12 left-0 md:left-auto md:mr-3.5 p-4 border-t bg-white dark:bg-black z-10">
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Type a message"
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage}>
            {" "}
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
