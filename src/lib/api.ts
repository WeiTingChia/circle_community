import { message } from 'antd';

const BASE_URL = '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  async getEvents() {
    const response = await fetch('/api/events', {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
  }

  async getMessages() {
    const response = await fetch('/api/messages', {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
  }

  async getLeaderboard() {
    const response = await fetch('/api/leaderboard', {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
  }

  async createMessage(content: string) {
    const token = localStorage.getItem('token');
    const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = tokenPayload?.userId;

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ 
        content,
        userId 
      })
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
  }

  async createEvent(eventData: {
    title: string;
    date: Date;
    content: string;
  }) {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(eventData)
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
  }

  async replyToMessage(messageId: string, content: string) {
    const token = localStorage.getItem('token');
    const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = tokenPayload?.userId;

    const response = await fetch(`/api/messages/${messageId}/reply`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ content, userId })
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
  }

  async toggleLike(messageId: string) {
    const token = localStorage.getItem('token');
    const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = tokenPayload?.userId;

    const response = await fetch(`/api/messages/${messageId}/like`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ userId })
    });
    if (!response.ok) throw new Error(`${response.status}`);
    return response.json();
  }
}

export const api = new ApiService();