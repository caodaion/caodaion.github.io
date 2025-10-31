import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  time: string;
}

export interface HourlyWeather {
  time: string[];
  temperature2m: number[];
  weatherCode: number[];
}

export interface DailyWeather {
  time: string[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  weatherCode: number[];
}

export interface WeatherForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: {
    time: string;
    interval?: string;
    temperature_2m?: string;
    weather_code?: string;
    relative_humidity_2m?: string;
    wind_speed_10m?: string;
    wind_direction_10m?: string;
    precipitation?: string;
  };
  current?: {
    time: string;
    interval?: number;
    temperature_2m?: number;
    weather_code?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    precipitation?: number;
  };
  hourly_units?: {
    time: string;
    temperature_2m?: string;
    weather_code?: string;
  };
  hourly?: {
    time: string[];
    temperature_2m?: number[];
    weather_code?: number[];
    relative_humidity_2m?: number[];
    precipitation?: number[];
    precipitation_probability?: number[];
    wind_speed_10m?: number[];
  };
  daily_units?: {
    time: string;
    temperature_2m_max?: string;
    temperature_2m_min?: string;
    weather_code?: string;
    precipitation_sum?: string;
    wind_speed_10m_max?: string;
  };
  daily?: {
    time: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weather_code?: number[];
    precipitation_sum?: number[];
    wind_speed_10m_max?: number[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1';

  constructor(private http: HttpClient) { }

  /**
   * Lấy thời tiết hiện tại theo tọa độ
   * @param latitude Vĩ độ
   * @param longitude Kinh độ
   * @returns Observable chứa dữ liệu thời tiết hiện tại
   */
  getCurrentWeather(latitude: number, longitude: number): Observable<WeatherForecastResponse> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('current', 'temperature_2m,weather_code')
      .set('timezone', 'auto');

    return this.http.get<WeatherForecastResponse>(`${this.baseUrl}/forecast`, { params });
  }

  /**
   * Lấy dự báo thời tiết theo giờ
   * @param latitude Vĩ độ
   * @param longitude Kinh độ
   * @param days Số ngày dự báo (mặc định 7 ngày)
   * @returns Observable chứa dữ liệu dự báo theo giờ
   */
  getHourlyForecast(latitude: number, longitude: number, days: number = 7): Observable<WeatherForecastResponse> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('hourly', 'temperature_2m,weather_code')
      .set('forecast_days', days.toString())
      .set('timezone', 'auto');

    return this.http.get<WeatherForecastResponse>(`${this.baseUrl}/forecast`, { params });
  }

  /**
   * Lấy dự báo thời tiết theo ngày
   * @param latitude Vĩ độ
   * @param longitude Kinh độ
   * @param days Số ngày dự báo (mặc định 7 ngày)
   * @returns Observable chứa dữ liệu dự báo theo ngày
   */
  getDailyForecast(latitude: number, longitude: number, days: number = 7): Observable<WeatherForecastResponse> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('daily', 'temperature_2m_max,temperature_2m_min,weather_code')
      .set('forecast_days', days.toString())
      .set('timezone', 'auto');

    return this.http.get<WeatherForecastResponse>(`${this.baseUrl}/forecast`, { params });
  }

  /**
   * Lấy dự báo thời tiết đầy đủ (hiện tại + theo giờ + theo ngày)
   * @param latitude Vĩ độ
   * @param longitude Kinh độ
   * @param days Số ngày dự báo (mặc định 7 ngày)
   * @returns Observable chứa dữ liệu thời tiết đầy đủ
   */
  getFullForecast(latitude: number, longitude: number, days: number = 7): Observable<WeatherForecastResponse> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code')
      .set('hourly', 'temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,weather_code,wind_speed_10m')
      .set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max')
      .set('forecast_days', days.toString())
      .set('timezone', 'auto');

    return this.http.get<WeatherForecastResponse>(`${this.baseUrl}/forecast`, { params });
  }

  /**
   * Lấy dữ liệu thời tiết lịch sử
   * @param latitude Vĩ độ
   * @param longitude Kinh độ
   * @param startDate Ngày bắt đầu (format: YYYY-MM-DD)
   * @param endDate Ngày kết thúc (format: YYYY-MM-DD)
   * @returns Observable chứa dữ liệu thời tiết lịch sử
   */
  getHistoricalWeather(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string
  ): Observable<WeatherForecastResponse> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('daily', 'temperature_2m_max,temperature_2m_min,weather_code')
      .set('start_date', startDate)
      .set('end_date', endDate)
      .set('timezone', 'auto');

    return this.http.get<WeatherForecastResponse>(`${this.baseUrl}/forecast`, { params });
  }

  /**
   * Tìm kiếm vị trí theo tên (sử dụng Geocoding API)
   * @param name Tên địa điểm
   * @param count Số lượng kết quả trả về (mặc định 10)
   * @returns Observable chứa danh sách vị trí
   */
  searchLocation(name: string, count: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('count', count.toString())
      .set('language', 'vi')
      .set('format', 'json');

    return this.http.get('https://geocoding-api.open-meteo.com/v1/search', { params });
  }

  /**
   * Lấy mã thời tiết dạng text (theo WMO Weather Interpretation Codes)
   * @param code Mã thời tiết
   * @returns Mô tả thời tiết bằng tiếng Việt
   */
  getWeatherDescription(code: number): string {
    const descriptions: { [key: number]: string } = {
      0: 'Trời quang đãng',
      1: 'Chủ yếu quang đãng',
      2: 'Nhiều mây',
      3: 'U ám',
      45: 'Có sương mù',
      48: 'Có sương mù đóng băng',
      51: 'Mưa phùn nhẹ',
      53: 'Mưa phùn vừa',
      55: 'Mưa phùn nặng',
      56: 'Mưa phùn nhẹ có đóng băng',
      57: 'Mưa phùn nặng có đóng băng',
      61: 'Mưa nhẹ',
      63: 'Mưa vừa',
      65: 'Mưa nặng',
      66: 'Mưa nhẹ có đóng băng',
      67: 'Mưa nặng có đóng băng',
      71: 'Tuyết nhẹ',
      73: 'Tuyết vừa',
      75: 'Tuyết nặng',
      77: 'Hạt tuyết',
      80: 'Mưa rào nhẹ',
      81: 'Mưa rào vừa',
      82: 'Mưa rào nặng',
      85: 'Mưa tuyết nhẹ',
      86: 'Mưa tuyết nặng',
      95: 'Dông',
      96: 'Dông có mưa đá',
      99: 'Dông có mưa đá nặng'
    };

    return descriptions[code] || 'Không xác định';
  }
}

