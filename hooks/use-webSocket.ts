import useWebSocket from "react-use-websocket";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSocketConnected,
  setSocketDisconnected,
} from "@/redux/features/authSlice";

const WS_URL = `${process.env.NEXT_PUBLIC_WS_HOST}/api/v1/chat/`;

const useWebSocketConnection = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    isAuthenticated ? WS_URL : null,
    {
      onOpen: () => {
        console.log("WebSocket connected");
        dispatch(setSocketConnected());
      },
      onClose: () => {
        console.log("WebSocket disconnected");
        dispatch(setSocketDisconnected());
      },
      onError: (error) => {
        console.error("WebSocket Error:", error);
      },
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User is not authenticated. Closing socket.");
      getWebSocket()?.close();
    }
  }, [isAuthenticated, getWebSocket]);

  return { sendMessage, lastMessage, readyState };
};

export default useWebSocketConnection;
