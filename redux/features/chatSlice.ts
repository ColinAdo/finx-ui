import { apiSlice } from "../services/apiSlice";

const chatSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation({
      query: ({ users }) => ({
        url: "/conversations/",
        method: "POST",
        body: { users },
      }),
    }),
  }),
});

export const { useCreateConversationMutation } = chatSlice;
