import React, { useState, useEffect } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
const ChatRoom = () => {
    
    async function checkServer(){
        try{
            const res = await fetch('https://chatterbox-server-pske.onrender.com');
            if(res.status === 200){
                console.log('Server is running');
            }
        }
        catch(err){
            console.log(err + '\nServer is not running');
        }   
    }

    useEffect(() => {
        checkServer();
    }, []);

    const [publicChat, setPublicChat] = useState([]);
    const [privateChat, setPrivateChat] = useState(new Map());
    const [flag, setFlag] = useState("COMMON_ROOM")
    const [user, setUser] = useState({
        username: "",
        receivername: "",
        message: "",
        connected: false,
        time: ""
    });

    const handleUserName = (e) => {
        setUser({ ...user, "username": e.target.value });
    }

    const handleMessage = (e) => {
        setUser({ ...user, "message": e.target.value });
    }

    const handleRegister = () => {
        // let socket = new SockJS('http://localhost:8080/ws');
        let socket = new SockJS('https://chatterbox-server-pske.onrender.com/ws');
        stompClient = over(socket);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUser({ ...user, "connected": true });
        stompClient.subscribe('/common-room/public', onPublicMessageReceived);
        stompClient.subscribe('/user/' + user.username + '/private', onPrivateMessageReceived);
        userJoin();
    }

    const userJoin = () => {
        let chatMessage = {
            senderName: user.username,
            status: "JOIN"
        };
        stompClient.send("/app/send-message", {}, JSON.stringify(chatMessage));
    }

    const onPublicMessageReceived = (payload) => {
        let message = JSON.parse(payload.body);
        switch (message.status) {
            case 'JOIN':
                if (!privateChat.get(message.senderName)) {
                    privateChat.set(message.senderName, []);
                    setPrivateChat(new Map(privateChat));
                }
                break;
            case 'MESSAGE':
                publicChat.push(message);
                setPublicChat([...publicChat]);
                break;
        }
    }

    const onPrivateMessageReceived = (payload) => {
        let message = JSON.parse(payload.body);
        if (privateChat.get(message.senderName)) {
            privateChat.get(message.senderName).push(message);
            setPrivateChat(new Map(privateChat));
        }
        else {
            let temp = [];
            temp.push(message);
            privateChat.set(message.senderName, temp);
            setPrivateChat(new Map(privateChat));
        }
    }

    const onError = (error) => {
        console.log(error);
    }

    const sendRoomMessage = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: user.username,
                content: user.message,
                time: new Date().toLocaleString('en-IN', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                }),
                status: "MESSAGE"
            };
            stompClient.send("/app/send-message", {}, JSON.stringify(chatMessage));
            setUser({ ...user, "message": "" });
        }
    }

    const sendPrivateMessage = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: user.username,
                receiverName: flag,
                content: user.message,
                time: new Date().toLocaleString('en-IN', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                }),
                status: "MESSAGE"
            };
            if (user.username !== flag) {
                privateChat.get(flag).push(chatMessage);
                setPrivateChat(new Map(privateChat));
            }
            stompClient.send("/app/send-private-message", {}, JSON.stringify(chatMessage));
            setUser({ ...user, "message": "" });
        }
    }

    return (
        <div className='container'>
            {user.connected ? (
                <div className='chat-box'>
                    <div className='member-list'>
                        <ul>
                            <li onClick={() => { setFlag("COMMON_ROOM") }} className={`member ${flag === "COMMON_ROOM" && "active"}`}>Common Room</li>
                            {[...privateChat.keys()].map((name, index) => (
                                <li onClick={() => { setFlag(name) }} className={`member ${flag === name && "active"}`} key={index}>{name}</li>
                            ))}
                        </ul>
                    </div>
                    {flag === "COMMON_ROOM" ? (
                        <div className='chat-content'>
                            <ul className='chat-messages'>
                                {publicChat.map((chat, index) => (
                                    chat.senderName === user.username ? (
                                        <li className='self-message' key={index}>
                                            <div className='message-data'>{chat.content}</div>
                                            <div className='avatar self'>{chat.senderName}</div>
                                            <span className='message-time'>{chat.time}</span>
                                        </li>) : (
                                        <li className='message' key={index}>
                                            <div className='avatar'>{chat.senderName}</div>
                                            <div className='message-data'>{chat.content}</div>
                                            <span className='message-time'>{chat.time}</span>
                                        </li>)
                                ))}
                            </ul>
                            <div className='send-message'>
                                <input
                                    className='input-message'
                                    type="text"
                                    placeholder="Message"
                                    value={user.message}
                                    onChange={handleMessage}
                                />
                                <button type="button" className='send-button' onClick={sendRoomMessage}>Send</button>
                            </div>
                        </div>) : (
                        <div className='chat-content'>
                            <ul className='chat-messages'>
                                {[...privateChat.get(flag)].map((chat, index) => (
                                    chat.senderName === user.username ? (
                                        <li className='self-message' key={index}>
                                            <div className='message-data'>{chat.content}</div>
                                            <div className='avatar self'>{chat.senderName}</div>
                                            <span className='message-time'>{chat.time}</span>
                                        </li>) : (
                                        <li className='message' key={index}>
                                            <div className='avatar'>{chat.senderName}</div>
                                            <div className='message-data'>{chat.content}</div>
                                            <span className='message-time'>{chat.time}</span>
                                        </li>)
                                ))}
                            </ul>
                            <div className='send-message'>
                                <input
                                    className='input-message'
                                    type="text"
                                    placeholder={`Message ${flag}`}
                                    value={user.message}
                                    onChange={handleMessage}
                                />
                                <button type="button" className='send-button' onClick={sendPrivateMessage}>Send</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="register">
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={user.username}
                        onChange={handleUserName}
                    />
                    <button type="button" className='btn-success ms-2' onClick={handleRegister}>Enter Chat</button>
                </div>
            )}

        </div>
    )
}

export default ChatRoom