import { apiSlice } from "../services/apiSlice";

interface Users {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
}

interface Conversations {
  id: string;
  users: Users[];
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

const chatSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation({
      query: ({ users }) => ({
        url: "/conversations/",
        method: "POST",
        body: { users },
      }),
    }),
    getConversations: builder.query<Conversations[], void>({
      query: () => ({
        url: "/conversations/",
      }),
    }),
    retrieveConversation: builder.query<ConversationData, string>({
      query: (id) => ({
        url: `/conversations/${id}/`,
      }),
    }),
  }),
});

export const {
  useCreateConversationMutation,
  useGetConversationsQuery,
  useRetrieveConversationQuery,
} = chatSlice;
