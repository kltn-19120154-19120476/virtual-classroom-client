import React from "react";
import { Avatar } from '@mui/material'

import styles from "./styles.module.scss";

const ChatMessage = ({messageList, user, lastMessRef, messageLatestRef}) => {

    return (    
            <div className={styles.chat_body}>
                <div className={styles.message_container}>
                    {messageList.map((messageContent, index) => {
                        if (index === 0) {
                            return (
                                <div
                                    key={index}
                                    className={styles.message}
                                    id={user?.name === messageContent.name ? styles.you : styles.other}
                                    ref={lastMessRef}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {user?.name !== messageContent.name && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <Avatar sx={{ width: 20, height: 20, marginX: 'auto' }}>{messageContent.name[0]}</Avatar>
                                            </div>}
                                            <div className={styles.message_content}>
                                                <p>{messageContent.message}</p>
                                            </div>
                                        </div>
    
                                        <div className={styles.message_meta}>
                                            {/* <p id={styles.time}>{messageContent.time}</p> */}
                                            <p id={styles.name}>{messageContent.name.length < 10 ? messageContent.name : messageContent.name.substring(0, 10) + '...'}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div
                                key={index}
                                className={styles.message}
                                id={user?.name === messageContent.name ? styles.you : styles.other}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {user?.name !== messageContent.name && <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Avatar sx={{ width: 20, height: 20, marginX: 'auto' }}>{messageContent.name[0]}</Avatar>
                                        </div>}
                                        <div className={styles.message_content}>
                                            <p>{messageContent.message}</p>
                                        </div>
                                    </div>

                                    <div className={styles.message_meta}>
                                        {/* <p id={styles.time}>{messageContent.time}</p> */}
                                        <p id={styles.name}>{messageContent.name.length < 10 ? messageContent.name : messageContent.name.substring(0, 10) + '...'}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messageLatestRef}></div>
                </div>
            </div>
    )

}

export default ChatMessage