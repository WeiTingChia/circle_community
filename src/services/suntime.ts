import axios from 'axios';
import { City, SunTimeResponse } from '../types/suntime';

const CWA_API_KEY = 'CWA-22CE74D4-4F79-437C-A8A5-648200269E8D';

export const fetchCities = async (): Promise<City[]> => {
  const response = await axios.get('https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/refs/heads/master/CityCountyData.json');
  return response.data;
};

export const fetchSunTime = async (
  cityName: string,
  date: string
): Promise<SunTimeResponse> => {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const response = await axios.get('https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001', {
    params: {
      Authorization: CWA_API_KEY,
      limit: 3,
      CountyName: cityName,
      parameter: 'SunRiseTime,SunSetTime',
      timeFrom: date,
      timeTo: tomorrowStr
    }
  });
  return response.data;
};