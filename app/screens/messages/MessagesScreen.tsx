import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MessageStackParamList } from '../../navigation/AppStackParams';
import MainContainer from '../../components/container/MainContainer';
import { sendRequest } from '../../config/compose';
import { COLORS } from '../../config/constants';
import moment from 'moment';
import { IConversation } from '../../lib/task.entities';
import { FontAwesome } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MessageStackParamList, 'Messages'>;

const MessagesScreen = ({ navigation }: Props) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sendRequest('api/conversations', {}, 'GET');
      if (response.status) {
        setConversations(response.data ?? []);
      } else {
        alert(response.message ?? 'Failed to load conversations');
      }
    } catch (error) {
      alert('Error loading conversations');
    }
    setLoading(false);
  }, []);

  const conversationClick = (conversation: IConversation) =>
    navigation.navigate('MessageDetail', { conversation });

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [loadConversations]),
  );

  return (
    <MainContainer>
      <Text style={styles.screenTitle}>Messages</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations found</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {conversations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.conversationCard}
              onPress={() => conversationClick(item)}>
              <View style={styles.avatarContainer}>
                {!!item.user.avatar ? (
                  <Image
                    source={{ uri: item.user.avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <FontAwesome name="user-circle" size={42} color="black" />
                )}
              </View>
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.userName}>{item.user.name}</Text>
                  <Text style={styles.dateText}>
                    {moment(item.created_at).format('MM-DD-YYYY')}
                  </Text>
                </View>
                <View style={styles.conversationFooter}>
                  <Text style={styles.messageCount}>
                    {item.total_messages} messages
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.greyBlue,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  conversationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.inactive,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.greyBlue,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default MessagesScreen;
