package com.chatterbox.chatserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.chatterbox.chatserver.controller.model.Message;

@Controller
public class ChatController {

    @MessageMapping("/send-message")
    @SendTo("/common-room/public")
    public Message receivePublicMessage(@Payload Message message) {
        return message;
    }


    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/send-private-message")
    public Message receivePrivateMessage(@Payload Message message) {

        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
        return message;
    }
}
