export interface City {
  CityName: string;
  CityEngName: string;
}

export interface SunTimeData {
  CountyName: string;
  SunRiseTime: string;
  SunSetTime: string;
  Date: string;
}

export interface SunTimeResponse {
  success: string;
  records: {
    locations: {
      location: Array<{
        time: Array<{
          Date: string;
          SunRiseTime: string;
          SunSetTime: string;
        }>;
      }>;
    };
  };
}