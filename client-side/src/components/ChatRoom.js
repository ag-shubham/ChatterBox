import React, { useState } from 'react';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
const ChatRoom = () => {

    const [publicChat, setpublicChat] = useState([]);
    const [privateChat, setprivateChat] = useState(new Map());
    const [user, setUser] = useState({
        username: "",
        receivername: "",
        message: "",
        connected: false,
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.id]: e.target.value });
    }

    const handleRegister = () => {
        let socket = new SockJS('http://localhost:8080/ws');
        stompClient = over(socket);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUser({ ...user, "connected": true });
        stompClient.subscribe('/common-room/public', onPublicMessageReceived);
        stompClient.subscribe('/user/'+user.username+'private', onPrivateMessageReceived);
        stompClient.send("/app/chat.register",
            {},
            JSON.stringify({ sender: user.username, type: 'JOIN' })
        )
    }

    const onPublicMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        switch(message.status){
            case 'JOIN':
                break;
            case 'MESSAGE':
                publicChat.push(message);
                setpublicChat([...publicChat, message]);
                break;
        }
    }

    const onPrivateMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        if(privateChat.get(message.senderName)){
            privateChat.get(message.senderName).push(message);
            setprivateChat(new Map(privateChat));
        }
        else{
            let temp = [];
            temp.push(message);
            privateChat.set(message.senderName, temp);
            setprivateChat(new Map(privateChat));
        }
    }

    const onError = (error) => {
        console.log(error);
    }

    return (
        <div className='container'>
            {user.connected ? (
                <div>Offline</div>
            ) : (
                <div className="register">
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={user.username}
                        onChange={handleChange}
                    />
                    <button type="button" onClick={handleRegister}>Enter Chat</button>
                </div>
            )}

        </div>
    )
}

export default ChatRoom