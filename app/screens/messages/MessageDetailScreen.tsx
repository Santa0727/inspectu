import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessageStackParamList } from '../../navigation/AppStackParams';
import MainContainer from '../../components/container/MainContainer';
import Input from '../../components/ui/Input';
import { COLORS } from '../../config/constants';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks';
import { selectProfile } from '../../store/auth/authSlice';
import { sendRequest } from '../../config/compose';

type Props = NativeStackScreenProps<MessageStackParamList, 'MessageDetail'>;

const MessageDetailScreen = ({ route, navigation }: Props) => {
  const { conversation: initialConversation } = route.params;
  const profile = useAppSelector(selectProfile);

  const [conversation, setConversation] = useState(initialConversation);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const reloadMessages = async () => {
    const response = await sendRequest(
      `api/conversations/${conversation.id}/messages`,
      {},
      'GET',
    );
    if (response.status && response.data) {
      setConversation((prv) => ({ ...prv, messages: response.data || [] }));
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }
    setSending(true);
    try {
      const payload = {
        conversation_id: conversation.id,
        body: newMessage.trim(),
      };
      const response = await sendRequest(
        'api/conversations/messages',
        payload,
        'POST',
      );
      if (response.status) {
        await reloadMessages();
        setNewMessage('');
      } else {
        alert(response.message ?? 'Failed to send message');
      }
    } catch (error) {
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  return (
    <MainContainer
      style={styles.container}
      headerComponent={
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back-circle-outline" size={38} color="black" />
        </TouchableOpacity>
      }
      footerComponent={
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={setNewMessage}
              style={styles.messageInput}
              disabled={sending}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              style={[
                styles.sendButton,
                (sending || !newMessage.trim()) && styles.sendButtonDisabled,
              ]}>
              <FontAwesome
                name="send"
                size={24}
                color={sending || !newMessage.trim() ? '#555' : 'white'}
              />
            </TouchableOpacity>
          </View>
        </View>
      }>
      <View style={styles.messagesContainer}>
        <View style={styles.messagesList}>
          {conversation.messages.map((message) => {
            const isMyMessage = message.user_id === profile?.id;
            return (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  isMyMessage
                    ? styles.myMessageContainer
                    : styles.otherMessageContainer,
                ]}>
                <View
                  style={[
                    styles.messageContent,
                    isMyMessage
                      ? styles.myMessageContent
                      : styles.otherMessageContent,
                  ]}>
                  <Text
                    style={[
                      styles.messageBody,
                      isMyMessage
                        ? styles.myMessageBody
                        : styles.otherMessageBody,
                    ]}>
                    {message.body}
                  </Text>
                  <Text
                    style={[
                      styles.messageDateTime,
                      isMyMessage
                        ? styles.myMessageDateTime
                        : styles.otherMessageDateTime,
                    ]}>
                    {`${message.created_date} ${message.created_time}`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 120,
    zIndex: 1,
    left: 10,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesList: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    borderRadius: 12,
    padding: 12,
  },
  myMessageContent: {
    backgroundColor: 'rgb(60, 80, 224)',
    borderBottomRightRadius: 0,
  },
  otherMessageContent: {
    backgroundColor: COLORS.blueGrey,
    borderTopLeftRadius: 0,
  },
  messageBody: {
    fontSize: 16,
    marginBottom: 4,
  },
  myMessageBody: {
    color: 'white',
  },
  otherMessageBody: {
    color: COLORS.dark,
  },
  messageDateTime: {
    fontSize: 12,
    textAlign: 'right',
  },
  myMessageDateTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageDateTime: {
    color: COLORS.greyBlue,
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.inactive,
    backgroundColor: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  messageInput: {
    flex: 1,
    marginVertical: 0,
    paddingVertical: 0,
  },
  sendButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(60, 80, 224)',
    borderRadius: 8,
    opacity: 1,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.disabled,
    opacity: 0.6,
  },
});

export default MessageDetailScreen;
