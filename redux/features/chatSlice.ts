import { apiSlice } from "../services/apiSlice";
import { Conversations, ConversationData } from "@/lib/exports";

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
