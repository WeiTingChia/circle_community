'use client';
import { useState } from 'react';
import { Input, Button, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      message.warning('請輸入帳號和密碼');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        message.success('登入成功');
        router.push('/dashboard');
      } else {
        message.error(data.error || '登入失敗');
      }
    } catch (error) {
      message.error('系統錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password) {
      message.warning('請輸入帳號和密碼');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      message.error('兩次輸入的密碼不一致');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('註冊成功，請登入');
        setActiveTab('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        message.error(data.error || '註冊失敗');
      }
    } catch (error) {
      message.error('系統錯誤');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'login',
      label: '登入',
      children: (
        <div className="space-y-4">
          <Input
            size="large"
            prefix={<UserOutlined />}
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="請輸入帳號"
          />
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="請輸入密碼"
            onPressEnter={handleLogin}
          />
          <Button
            type="primary"
            size="large"
            block
            onClick={handleLogin}
            loading={loading}
          >
            登入
          </Button>
        </div>
      ),
    },
    {
      key: 'register',
      label: '註冊',
      children: (
        <div className="space-y-4">
          <Input
            size="large"
            prefix={<UserOutlined />}
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="請輸入帳號"
          />
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="請輸入密碼"
          />
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="請確認密碼"
            onPressEnter={handleRegister}
          />
          <Button
            type="primary"
            size="large"
            block
            onClick={handleRegister}
            loading={loading}
          >
            註冊
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">小圈圈</h1>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          centered
          className="max-w-full"
        />
      </div>
    </div>
  );
}
