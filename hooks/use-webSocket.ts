import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSocketConnected,
  setSocketDisconnected,
} from "@/redux/features/authSlice";

const useWebSocket = (): WebSocket | null => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;

    if (isAuthenticated && !socket) {
      ws = new WebSocket("ws://localhost:8000/api/v1/chat/");
      setSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connected");
        dispatch(setSocketConnected());
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setSocket(null);
        dispatch(setSocketDisconnected());
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };

      return () => {
        setSocket(null);
        dispatch(setSocketDisconnected());
      };
    }
  }, [isAuthenticated]);

  return socket;
};

export default useWebSocket;
