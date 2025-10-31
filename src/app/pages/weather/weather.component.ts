import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChildHeaderComponent } from 'src/app/components/child-header/child-header.component';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { WeatherService, WeatherForecastResponse } from 'src/app/shared/services/weather/weather.service';

interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  isCurrentLocation?: boolean;
  weather?: WeatherForecastResponse;
  loading?: boolean;
  error?: string;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule,
    MatSnackBarModule,
    ChildHeaderComponent,
    IconComponent
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {
  private weatherService = inject(WeatherService);
  private snackBar = inject(MatSnackBar);

  // Locations management
  locations: LocationData[] = [];
  selectedLocationId: string | null = null;

  // Search
  searchQuery: string = '';
  searchResults: any[] = [];
  isAddingLocation: boolean = false;

  // View modes
  viewMode: 'daily' | 'hourly' = 'hourly';

  private readonly STORAGE_KEY = 'weather_locations';

  ngOnInit(): void {
    this.loadLocationsFromStorage();
    if (this.locations.length === 0) {
      this.getCurrentLocation();
    } else {
      // Load weather for all saved locations
      this.locations.forEach(location => {
        this.loadWeatherForLocation(location.id);
      });
      // Auto-select first location to show today's data
      if (!this.selectedLocationId && this.locations.length > 0) {
        this.selectedLocationId = this.locations[0].id;
      }
    }
  }

  loadLocationsFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.locations = JSON.parse(stored);
      } catch (e) {
        console.error('Error loading locations from storage:', e);
        this.locations = [];
      }
    }
  }

  saveLocationsToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.locations));
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            id: 'current',
            name: 'Vị trí của bạn',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isCurrentLocation: true
          };
          this.addLocation(location);
          this.selectedLocationId = location.id;
        },
        (error) => {
          console.error('Error getting location:', error);
          // Add default location if geolocation fails
          const defaultLocation: LocationData = {
            id: 'hanoi',
            name: 'Hà Nội, Việt Nam',
            latitude: 21.0285,
            longitude: 105.8542,
            country: 'Việt Nam'
          };
          this.addLocation(defaultLocation);
          this.selectedLocationId = defaultLocation.id;
        }
      );
    } else {
      // Add default location
      const defaultLocation: LocationData = {
        id: 'hanoi',
        name: 'Hà Nội, Việt Nam',
        latitude: 21.0285,
        longitude: 105.8542,
        country: 'Việt Nam'
      };
      this.addLocation(defaultLocation);
      this.selectedLocationId = defaultLocation.id;
    }
  }

  addLocation(location: LocationData): void {
    // Check if location already exists
    const exists = this.locations.find(l => l.id === location.id);
    if (exists) {
      this.snackBar.open('Địa điểm này đã được thêm', 'Đóng', { duration: 2000 });
      return;
    }

    this.locations.push(location);
    this.saveLocationsToStorage();
    this.loadWeatherForLocation(location.id);
    
    if (!this.selectedLocationId) {
      this.selectedLocationId = location.id;
    }
  }

  removeLocation(locationId: string): void {
    this.locations = this.locations.filter(l => l.id !== locationId);
    this.saveLocationsToStorage();
    
    if (this.selectedLocationId === locationId) {
      this.selectedLocationId = this.locations.length > 0 ? this.locations[0].id : null;
    }
  }

  selectLocation(locationId: string): void {
    this.selectedLocationId = locationId;
  }

  getSelectedLocation(): LocationData | null {
    return this.locations.find(l => l.id === this.selectedLocationId) || null;
  }

  loadWeatherForLocation(locationId: string): void {
    const location = this.locations.find(l => l.id === locationId);
    if (!location) return;

    location.loading = true;
    location.error = undefined;

    this.weatherService.getFullForecast(location.latitude, location.longitude, 7).subscribe({
      next: (data) => {
        location.weather = data;
        location.loading = false;
        this.saveLocationsToStorage();
      },
      error: (err) => {
        console.error('Error loading weather:', err);
        location.error = 'Không thể tải dữ liệu thời tiết';
        location.loading = false;
      }
    });
  }

  refreshAllWeather(): void {
    this.locations.forEach(location => {
      this.loadWeatherForLocation(location.id);
    });
    this.snackBar.open('Đang làm mới dữ liệu thời tiết...', 'Đóng', { duration: 2000 });
  }

  refreshLocation(locationId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.loadWeatherForLocation(locationId);
  }

  onSearchInput(): void {
    if (!this.searchQuery || this.searchQuery.length < 2) {
      this.searchResults = [];
      return;
    }

    this.weatherService.searchLocation(this.searchQuery, 5).subscribe({
      next: (data: any) => {
        this.searchResults = data.results || [];
      },
      error: (err) => {
        console.error('Error searching location:', err);
        this.searchResults = [];
      }
    });
  }

  selectLocationFromSearch(location: any): void {
    const locationData: LocationData = {
      id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      country: location.country,
      admin1: location.admin1
    };
    
    this.addLocation(locationData);
    this.searchQuery = '';
    this.searchResults = [];
    this.isAddingLocation = false;
    this.selectedLocationId = locationData.id;
    this.snackBar.open(`Đã thêm ${location.name}`, 'Đóng', { duration: 2000 });
  }


  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'daily' ? 'hourly' : 'daily';
  }

  toggleAddLocation(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isAddingLocation = !this.isAddingLocation;
    if (!this.isAddingLocation) {
      this.searchQuery = '';
      this.searchResults = [];
    }
  }

  // Helper methods
  getWeatherDescription(code: number | undefined): string {
    if (code === undefined) return 'Không xác định';
    return this.weatherService.getWeatherDescription(code);
  }

  getTemperature(temp: number | undefined): string {
    if (temp === undefined) return '--';
    return `${Math.round(temp)}°C`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Ngày mai';
    } else {
      return date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'short' });
    }
  }

  isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isTomorrow(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  }

  isNightTime(timeString?: string): boolean {
    if (!timeString) return false;
    const date = new Date(timeString);
    const hour = date.getHours();
    // Consider night time from 18:00 to 6:00 (next day)
    return hour >= 18 || hour < 6;
  }

  getWeatherIcon(code: number | undefined, timeString?: string): string {
    if (code === undefined) return 'help_outline';
    
    const isNight = this.isNightTime(timeString);
    
    // Clear sky
    if (code === 0 || code === 1) {
      return isNight ? 'nightlight' : 'wb_sunny';
    }
    
    // Partly cloudy
    if (code >= 2 && code <= 3) {
      return isNight ? 'partly_cloudy_night' : 'partly_cloudy_day';
    }
    
    // Fog (same for day/night)
    if (code === 45 || code === 48) return 'foggy';
    
    // Drizzle (same for day/night)
    if (code >= 51 && code <= 57) return 'grain';
    
    // Rain (same for day/night)
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'umbrella';
    
    // Snow (same for day/night)
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'ac_unit';
    
    // Thunderstorm (same for day/night)
    if (code >= 95 && code <= 99) return 'thunderstorm';
    
    return 'help_outline';
  }

  getWeatherIconClass(code: number | undefined): string {
    if (code === undefined) return '';
    if (code === 0 || code === 1) return 'weather-icon-sunny';
    if (code >= 95 && code <= 99) return 'weather-icon-storm';
    return '';
  }

  formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  getDailyForecastArray(location: LocationData): Array<{
    time: string;
    maxTemp: number | undefined;
    minTemp: number | undefined;
    weatherCode: number | undefined;
  }> {
    if (!location.weather || !location.weather.daily) return [];
    
    const daily = location.weather.daily;
    const result = [];
    
    for (let i = 0; i < daily.time.length; i++) {
      result.push({
        time: daily.time[i],
        maxTemp: daily.temperature_2m_max?.[i],
        minTemp: daily.temperature_2m_min?.[i],
        weatherCode: daily.weather_code?.[i]
      });
    }
    
    return result;
  }

  getLocationDisplayName(location: LocationData): string {
    const parts = [location.name];
    if (location.admin1) parts.push(location.admin1);
    if (location.country) parts.push(location.country);
    return parts.filter(p => p).join(', ');
  }

  getSimpleAddress(location: LocationData): string {
    const parts: string[] = [];
    
    if (location.name) {
      // Only add name if it's not too generic
      if (location.name !== 'Vị trí của bạn') {
        parts.push(location.name);
      }
    }
    
    if (location.admin1) {
      parts.push(location.admin1);
    }
    
    if (location.country) {
      parts.push(location.country);
    }
    
    return parts.filter(p => p).join(', ') || location.name;
  }

  // Additional helper methods for new data
  getWindSpeed(speed: number | undefined): string {
    if (speed === undefined) return '--';
    return `${Math.round(speed)} km/h`;
  }

  getWindDirection(direction: number | undefined): string {
    if (direction === undefined) return '--';
    const directions = ['Bắc', 'Bắc Đông Bắc', 'Đông Bắc', 'Đông Đông Bắc', 'Đông', 'Đông Đông Nam', 'Đông Nam', 'Nam Đông Nam', 'Nam', 'Nam Tây Nam', 'Tây Nam', 'Tây Tây Nam', 'Tây', 'Tây Tây Bắc', 'Tây Bắc', 'Bắc Tây Bắc', 'Bắc'];
    const index = Math.round(direction / 22.5) % 16;
    return directions[index];
  }

  getHumidity(humidity: number | undefined): string {
    if (humidity === undefined) return '--';
    return `${Math.round(humidity)}%`;
  }

  getPrecipitation(precip: number | undefined): string {
    if (precip === undefined || precip === 0) return '0 mm';
    return `${precip.toFixed(1)} mm`;
  }

  getHourlyForecastArray(location: LocationData): Array<{
    time: string;
    temperature: number | undefined;
    weatherCode: number | undefined;
    precipitation: number | undefined;
    precipitationProbability: number | undefined;
    windSpeed: number | undefined;
    humidity: number | undefined;
  }> {
    if (!location.weather || !location.weather.hourly) return [];
    
    const hourly = location.weather.hourly;
    const result = [];
    const now = new Date();
    // Subtract 1 hour to allow current hour to show
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < hourly.time.length; i++) {
      const hourTime = new Date(hourly.time[i]);
      
      // Only include current time and future times (skip past times)
      if (hourTime < oneHourAgo) continue; // Skip past hours
      if (hourTime > next24Hours) break; // Stop after 24 hours
      
      result.push({
        time: hourly.time[i],
        temperature: hourly.temperature_2m?.[i],
        weatherCode: hourly.weather_code?.[i],
        precipitation: hourly.precipitation?.[i],
        precipitationProbability: hourly.precipitation_probability?.[i],
        windSpeed: hourly.wind_speed_10m?.[i],
        humidity: hourly.relative_humidity_2m?.[i]
      });
    }
    
    return result;
  }

  formatHour(timeString: string): string {
    const date = new Date(timeString);
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    // Show "Bây giờ" if within 30 minutes
    if (minutesDiff >= -30 && minutesDiff <= 30) {
      return 'Bây giờ';
    }
    
    // Show actual time for all other hours
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  Math = Math; // Expose Math to template
}

