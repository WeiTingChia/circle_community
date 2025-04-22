'use client';

import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Card, Spin } from 'antd';
import { fetchCities, fetchSunTime } from '../services/suntime';
import { City, SunTimeData } from '../types/suntime';
import dayjs from 'dayjs';
import { isArrayBuffer } from 'util/types';

export default function SunTimeQuery() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sunTimeData, setSunTimeData] = useState<SunTimeData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const citiesData = await fetchCities();
      setCities(citiesData);
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const handleSearch = async (date: string) => {
    if (!selectedCity || !date) return;

    setLoading(true);
    try {
      const data = await fetchSunTime(selectedCity, date);
      console.log('TimePicker:', date)
      if (data.records.locations.location[0]?.time[0]) {
        setSunTimeData({
          CountyName: selectedCity,
          ...data.records.locations.location[0].time[0]
        });
      }
    } catch (error) {
      console.error('Failed to fetch sun time:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="日出日落時間查詢" style={{ maxWidth: 600, margin: '20px auto' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <Select
          style={{ width: 200 }}
          placeholder="選擇縣市"
          onChange={(value) => setSelectedCity(value)}
          options={cities.map(city => ({
            label: city.CityName,
            value: city.CityName
          }))}
        />
        <DatePicker
          onChange={(date, dateString) => {
            console.log("DatePicker:", dateString);
            if (Array.isArray(dateString))
              dateString = dateString[0];
            setSelectedDate(dateString);
            handleSearch(dateString);
          }}
        />
      </div>

      {loading ? (
        <Spin />
      ) : sunTimeData && (
        <div>
          <p>縣市：{sunTimeData.CountyName}</p>
          <p>日期：{sunTimeData.Date}</p>
          <p>日出時間：{sunTimeData.SunRiseTime}</p>
          <p>日落時間：{sunTimeData.SunSetTime}</p>
        </div>
      )}
    </Card>
  );
}