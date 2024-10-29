import { apiSlice } from "../services/apiSlice";
import { Post } from "@/lib/exports";

const postSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: ({ caption, fileUrl }) => ({
        url: "/posts/",
        method: "POST",
        body: { caption, fileUrl },
      }),
    }),
    getPost: builder.query<Post[], void>({
      query: () => ({
        url: "/posts/",
      }),
    }),
    getUserPost: builder.query<void, string>({
      query: (username) => ({
        url: `/posts/author-posts/${username}/`,
      }),
    }),
    retrievePost: builder.query<void, number>({
      query: (postId) => ({
        url: `/posts/${postId}/`,
      }),
    }),
    deletePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/posts/${postId}/`,
        method: "DELETE",
      }),
    }),
    updatePost: builder.mutation({
      query: ({ postId, caption }) => ({
        url: `/posts/${postId}/`,
        method: "PUT",
        body: { caption },
      }),
    }),
    likePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/like/${postId}/`,
        method: "POST",
      }),
    }),
    bookmarkPost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/bookmark/${postId}/`,
        method: "POST",
      }),
    }),
    getBookmarkedPosts: builder.query<Post[], string>({
      query: (username) => ({
        url: `/bookmarked/${username}/posts/`,
        method: "GET",
      }),
    }),
    commentOnPost: builder.mutation({
      query: ({ post, comment, comment_image }) => ({
        url: "/comment/",
        method: "POST",
        body: { post, comment, comment_image },
      }),
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comment/${commentId}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostQuery,
  useRetrievePostQuery,
  useDeletePostMutation,
  useLikePostMutation,
  useBookmarkPostMutation,
  useGetBookmarkedPostsQuery,
  useCommentOnPostMutation,
  useGetUserPostQuery,
  useUpdatePostMutation,
  useDeleteCommentMutation,
} = postSlice;
