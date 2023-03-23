import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { SocketContext } from "../../context/socketContext";
import { AuthContext } from "../../context/authContext";
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import styles from "./styles.module.scss";
import { clearChat, getChatPaging, saveChat } from "../../client/presentation";
import ChatMessage from "./ChatMessage";
import useMessageLoading from "./useMessageLoading";
import { IconButton, Tooltip } from "@mui/material";
import { CustomNotifyComponent } from "../CustomNotify";
import { customToast } from "../../utils";

export default function ChatBox({ room, owner }) {
    const [openChatBox, setOpenChatBox] = useState(false);
    const { socket } = useContext(SocketContext);
    const { user, isLoadingAuth, isAuthenticated } = useContext(AuthContext);
    const [messageList, setMessageList] = useState([])
    const [newMessageList, setNewMessageList] = useState([])
    const [chatValue, setChatValue] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [isWaiting, setIsWaiting] = useState(false)
    const messageLatestRef = useRef(null)

    const { isLoading, isError, error, results, hasNextPage } = useMessageLoading(pageNumber, room)

    const observer = useRef()
    const lastMessRef = useCallback(node => {

        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            messageLatestRef.current?.scrollIntoView({ behavior: 'smooth' })

            if (hasNextPage)
                setIsWaiting(true)

            if (entries[0].isIntersecting && hasNextPage) {
                const allTimeout = setTimeout(() => {
                    setPageNumber(prevPage => prevPage + 1)
                }, 3000)
                localStorage.setItem('timeout', allTimeout)
            }

            if (!entries[0].isIntersecting) {
                const timeoutToClear = localStorage.getItem('timeout')
                clearTimeout(timeoutToClear)
                setIsWaiting(false)
            }
        })
        if (node) observer.current.observe(node)

    }, [isLoading, hasNextPage])

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenChatBox(open);
    };

    useEffect(() => {
        socket.on('messageToNotify', data => {
          /* Checking if the user is the same as the data.name. If it is not, it will show a toast message. */
          if (user?.name !== data.name && !openChatBox) {
            customToast("INFO", <CustomNotifyComponent content={"A new messenger is comming !!!"} onChatClick={toggleDrawer(true)}/>)
          }
        })
        return () => { socket.off('messageToNotify') }
      }, [socket, openChatBox])

    useEffect(() => {
        // create a interval and get the id
        const myInterval = setInterval(() => {
            if (newMessageList.length > 0 && user?._id === owner) {
                saveChat({ presentationId: room, newChats: newMessageList.map(mess => JSON.stringify(mess)) })
                    .then((res) => {
                        setNewMessageList([])
                    })
            }

        }, 3000);
        // clear out the interval using the id when unmounting the component
        return () => clearInterval(myInterval);
    }, [newMessageList]);

    useEffect(() => {
        socket.emit("join_presentation", room);
    }, [room])

    useEffect(() => {
        setMessageList((list) => [... new Set([...results, ...list])])
    }, [results])

    useEffect(() => {
        messageLatestRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [newMessageList])

    useEffect(() => {
        socket.on('receiveMessage', async data => {
            setMessageList((list) => [...list, data])
            setNewMessageList((list) => [...list, data])
        })
        return () => { socket.off('receiveMessage') }
    }, [socket])

    const sendMessage = async () => {
        if (chatValue !== '') {
            const newChats = {
                name: user?.name || "Anonymous",
                message: chatValue,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                room
            }
            await socket.emit('sendMessage', newChats)
            setChatValue('')
        }
    }

    // if (isError) return <p>Error: {error.message}</p>

    return (
        <div>
            <Tooltip title="Open chatbox">
                <IconButton color="primary" size="large" variant="contained" onClick={toggleDrawer(true)}>
                    <ChatIcon />
                </IconButton>
            </Tooltip>
            <Drawer
                anchor={'right'}
                open={openChatBox}
                onClose={toggleDrawer(false)}
            >
                <div className={styles.chat_window}>
                    <div className={styles.chat_header}>
                        <p>Live Chat</p>
                    </div>
                    <div style={{ display: 'flex', height: '40px', justifyContent: 'center' }}>
                        {isWaiting && <img src="/images/spinner.svg" alt="LOADING..." />}
                    </div>
                    <ChatMessage messageList={messageList} user={user} lastMessRef={lastMessRef} messageLatestRef={messageLatestRef} />
                    <div className={styles.chat_footer}>
                        <input
                            type="text"
                            value={chatValue}
                            placeholder="Type your message..."
                            onChange={(event) => {
                                setChatValue(event.target.value);
                            }}
                            onKeyPress={(event) => {
                                event.key === "Enter" && sendMessage();
                            }}
                        />
                        <SendIcon className={styles.message_icon} onClick={sendMessage} />
                    </div>
                </div>
            </Drawer>
        </div>
    );
}