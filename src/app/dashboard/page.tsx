'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, List, Avatar, Input, Button, message, Modal, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  loginCount: number;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  content: string;
}

interface Message {
  _id: string;
  content: string;
  userId: {
    username: string;
  };
}

interface ApiError extends Error {
  message: string;
}

interface NewEvent {
  title: string;
  date: Date | null;
  content: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({
    events: false,
    messages: false,
    leaderboard: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    date: null,
    content: ''
  });

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    setLoading({ events: true, messages: true, leaderboard: true });

    try {
      const eventsRes = await api.getEvents();
      const messagesRes = await api.getMessages();
      const leaderboardRes = await api.getLeaderboard();

      setEvents(eventsRes);
      setMessages(messagesRes);
      setTopUsers(leaderboardRes);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.message?.includes('401')) {
        router.push('/');
      }
    } finally {
      setLoading({ events: false, messages: false, leaderboard: false });
    }
  }, [router]);

  const handlePostMessage = async () => {
    if (!newMessage.trim()) {
      message.warning('請輸入留言內容');
      return;
    }

    try {
      const response = await api.createMessage(newMessage);
      if (response.data) {
        message.success('留言成功');
        setNewMessage('');
        fetchData(); // 重新獲取數據
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.content) {
      message.warning('請填寫完整事件資訊');
      return;
    }

    try {
      await api.createEvent({
        title: newEvent.title,
        date: newEvent.date,
        content: newEvent.content
      });
      message.success('事件創建成功');
      setIsModalOpen(false);
      setNewEvent({ title: '', date: null, content: '' });
      fetchData();
    } catch (error) {
      message.error('創建事件失敗');
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, router]); // Add fetchData to dependencies

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-4 px-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <div className="md:col-span-3 order-2 md:order-1">
            <Card title="登入排行榜" loading={loading.leaderboard}>
              <List
                dataSource={topUsers}
                renderItem={(user: User) => (
                  <List.Item key={user._id} className="!block sm:!flex">
                    <List.Item.Meta
                      avatar={<Avatar>{user.username?.[0] || 'U'}</Avatar>}
                      title={user.username}
                      description={`登入次數: ${user.loginCount || 0}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>

          <div className="md:col-span-6 order-1 md:order-2">
            <Card
              title="活動事件"
              loading={loading.events}
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalOpen(true)}
                >
                  <span className="hidden sm:inline">新增事件</span>
                </Button>
              }
            >
              <List
                dataSource={events}
                renderItem={(event: Event) => (
                  <List.Item key={event._id} className="!block sm:!flex">
                    <List.Item.Meta
                      title={<div className="break-words">{event.title}</div>}
                      description={
                        <div className="space-y-2">
                          <div>{new Date(event.date).toLocaleDateString('zh-TW')}</div>
                          <div className="break-words">{event.content}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>

          <div className="md:col-span-3 order-3">
            <Card title="留言板" loading={loading.messages}>
              <div className="space-y-4">
                <List
                  dataSource={messages}
                  renderItem={(msg: Message) => (
                    <List.Item key={msg._id} className="!block sm:!flex">
                      <List.Item.Meta
                        avatar={<Avatar>{msg.userId?.username?.[0] || 'U'}</Avatar>}
                        title={msg.userId?.username || '未知用戶'}
                        description={<div className="break-words">{msg.content}</div>}
                      />
                    </List.Item>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="輸入留言"
                    onPressEnter={handlePostMessage}
                  />
                  <Button type="primary" onClick={handlePostMessage}>
                    發送
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title="創建新事件"
        open={isModalOpen}
        onOk={handleCreateEvent}
        onCancel={() => {
          setIsModalOpen(false);
          setNewEvent({ title: '', date: null, content: '' });
        }}
        width="90%"
        className="sm:max-w-lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="事件標題"
            value={newEvent.title}
            onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
          />
          <DatePicker
            style={{ width: '100%' }}
            placeholder="選擇日期"
            onChange={(date) => setNewEvent(prev => ({
              ...prev,
              date: date ? date.toDate() : null
            }))}
          />
          <Input.TextArea
            placeholder="事件內容"
            value={newEvent.content}
            onChange={(e) => setNewEvent(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
}