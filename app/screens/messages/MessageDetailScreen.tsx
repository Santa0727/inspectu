import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessageStackParamList } from '../../navigation/AppStackParams';
import MainContainer from '../../components/container/MainContainer';
import Input from '../../components/ui/Input';
import TouchButton from '../../components/ui/TouchButton';
import { COLORS } from '../../config/constants';

type Props = NativeStackScreenProps<MessageStackParamList, 'MessageDetail'>;

const MessageDetailScreen = ({ route, navigation }: Props) => {
  const { conversation } = route.params;

  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    setSending(true);
    try {
      setTimeout(() => {
        setNewMessage('');
        setSending(false);
        alert('Message sent successfully! (Demo mode)');
      }, 1000);
    } catch (error) {
      setSending(false);
      alert('Error sending message');
    }
  };

  return (
    <MainContainer style={styles.container}>
      <View style={styles.header}>
        <TouchButton
          label="← Back"
          scheme="secondary"
          size="small"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.conversationTitle}>
          Chat with {conversation.user.name}
        </Text>
      </View>

      <View style={styles.messagesContainer}>
        <View style={styles.messagesList}>
          {conversation.messages.map((message) => (
            <View key={message.id} style={styles.messageContainer}>
              <View style={styles.messageContent}>
                <Text style={styles.messageBody}>{message.body}</Text>
                <Text style={styles.messageDateTime}>
                  {`${message.created_date} ${message.created_time}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={setNewMessage}
            style={styles.messageInput}
            disabled={sending}
          />
          <TouchButton
            label="Send"
            scheme="primary"
            size="small"
            onPress={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            style={styles.sendButton}
          />
        </View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inactive,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  conversationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
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
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageContent: {
    backgroundColor: COLORS.blueGrey,
    borderRadius: 12,
    padding: 12,
  },
  messageBody: {
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 4,
  },
  messageDateTime: {
    fontSize: 12,
    color: COLORS.greyBlue,
    textAlign: 'right',
  },
  inputContainer: {
    paddingHorizontal: 16,
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
    minWidth: 70,
  },
});

export default MessageDetailScreen;
