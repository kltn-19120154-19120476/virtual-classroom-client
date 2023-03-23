import React, { createContext, useRef } from "react";
import io from "socket.io-client";
import { WS_DOMAIN } from "../sysconfig";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  socketRef.current = io.connect(WS_DOMAIN, { transports: ["websocket"] });

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
