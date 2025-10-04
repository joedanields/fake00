from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import requests
import google.generativeai as genai
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure API keys from environment variables
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# WeatherAPI.com base URL
WEATHER_BASE_URL = "http://api.weatherapi.com/v1"


@app.route('/weather/current', methods=['GET'])
def get_current_weather():
    """
    Endpoint 1: Get current weather data for a location
    Query Parameters:
        - location: City name, coordinates, or postal code
    Example: /weather/current?location=London
    """
    try:
        location = request.args.get('location')
        
        if not location:
            return jsonify({'error': 'Location parameter is required'}), 400
        
        if not WEATHER_API_KEY:
            return jsonify({'error': 'Weather API key not configured'}), 500
        
        # Make request to WeatherAPI.com
        url = f"{WEATHER_BASE_URL}/current.json"
        params = {
            'key': WEATHER_API_KEY,
            'q': location,
            'aqi': 'yes'  # Include air quality data
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            # Format the response
            weather_data = {
                'location': {
                    'name': data['location']['name'],
                    'region': data['location']['region'],
                    'country': data['location']['country'],
                    'coordinates': {
                        'lat': data['location']['lat'],
                        'lon': data['location']['lon']
                    },
                    'timezone': data['location']['tz_id'],
                    'localtime': data['location']['localtime']
                },
                'current': {
                    'temperature_c': data['current']['temp_c'],
                    'temperature_f': data['current']['temp_f'],
                    'condition': data['current']['condition']['text'],
                    'icon': data['current']['condition']['icon'],
                    'wind_kph': data['current']['wind_kph'],
                    'wind_direction': data['current']['wind_dir'],
                    'pressure_mb': data['current']['pressure_mb'],
                    'precipitation_mm': data['current']['precip_mm'],
                    'humidity': data['current']['humidity'],
                    'cloud': data['current']['cloud'],
                    'feels_like_c': data['current']['feelslike_c'],
                    'visibility_km': data['current']['vis_km'],
                    'uv_index': data['current']['uv']
                }
            }
            
            return jsonify(weather_data), 200
        else:
            return jsonify({'error': 'Failed to fetch weather data', 'details': response.json()}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/weather/forecast', methods=['POST'])
def get_weather_forecast_with_ai():
    """
    Endpoint 2: Get weather forecast for specific date/time and AI analysis
    Request Body (JSON):
        - location: City name or coordinates
        - date: Date in YYYY-MM-DD format
        - time: Time in HH:MM format (24-hour)
    Example: {"location": "London", "date": "2025-10-15", "time": "14:00"}
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        location = data.get('location')
        date = data.get('date')
        time = data.get('time')
        
        if not all([location, date, time]):
            return jsonify({'error': 'location, date, and time are required'}), 400
        
        if not WEATHER_API_KEY or not GEMINI_API_KEY:
            return jsonify({'error': 'API keys not configured'}), 500
        
        # Validate date format
        try:
            datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Make request to WeatherAPI.com forecast endpoint
        url = f"{WEATHER_BASE_URL}/forecast.json"
        params = {
            'key': WEATHER_API_KEY,
            'q': location,
            'dt': date
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            weather_response = response.json()
            
            # Extract location information
            location_info = {
                'name': weather_response['location']['name'],
                'region': weather_response['location']['region'],
                'country': weather_response['location']['country']
            }
            
            # Extract forecast day data
            forecast_day = weather_response['forecast']['forecastday'][0]
            
            # Find the specific hour
            hour_data = None
            requested_hour = int(time.split(':')[0])
            
            for hour in forecast_day['hour']:
                if hour['time'].endswith(f" {str(requested_hour).zfill(2)}:00"):
                    hour_data = hour
                    break
            
            # Fallback to closest hour if exact match not found
            if not hour_data:
                hour_data = forecast_day['hour'][min(requested_hour, len(forecast_day['hour'])-1)]
            
            # Essential weather data only
            weather_data = {
                'temperature': {
                    'current': hour_data['temp_c'],
                    'feels_like': hour_data['feelslike_c'],
                    'min': forecast_day['day']['mintemp_c'],
                    'max': forecast_day['day']['maxtemp_c']
                },
                'condition': {
                    'text': hour_data['condition']['text'],
                    'icon': hour_data['condition']['icon']
                },
                'wind': {
                    'speed_kph': hour_data['wind_kph'],
                    'direction': hour_data['wind_dir']
                },
                'precipitation': {
                    'chance_of_rain': hour_data['chance_of_rain'],
                    'amount_mm': hour_data['precip_mm']
                },
                'humidity': hour_data['humidity'],
                'visibility_km': hour_data['vis_km'],
                'uv_index': hour_data['uv']
            }
            
            # Generate AI analysis using Gemini
            prompt = f"""
            Analyze the following weather forecast and provide a brief, helpful summary:
            
            Location: {location_info['name']}, {location_info['country']}
            Date & Time: {date} at {time}
            
            Temperature: {weather_data['temperature']['current']}°C (Feels like: {weather_data['temperature']['feels_like']}°C)
            Daily Range: {weather_data['temperature']['min']}°C to {weather_data['temperature']['max']}°C
            Condition: {weather_data['condition']['text']}
            Wind: {weather_data['wind']['speed_kph']} km/h {weather_data['wind']['direction']}
            Chance of Rain: {weather_data['precipitation']['chance_of_rain']}%
            Precipitation: {weather_data['precipitation']['amount_mm']} mm
            Humidity: {weather_data['humidity']}%
            Visibility: {weather_data['visibility_km']} km
            UV Index: {weather_data['uv_index']}
            
            Provide a concise 2-3 sentence summary of what to expect.
            """
            
            ai_response = model.generate_content(prompt)
            
            result = {
                'location': location_info,
                'date': date,
                'time': time,
                'weather': weather_data,
                'ai_analysis': ai_response.text
            }
            
            return jsonify(result), 200
        else:
            return jsonify({'error': 'Failed to fetch forecast data', 'details': response.json()}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/weather/recommendations', methods=['POST'])
def get_weather_recommendations():
    """
    Endpoint 3: Get AI-powered recommendations based on weather conditions
    Request Body (JSON):
        - location: City name or coordinates
        - date: Date in YYYY-MM-DD format
        - time: Time in HH:MM format (24-hour)
    Example: {"location": "Mumbai", "date": "2025-10-15", "time": "09:00"}
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        location = data.get('location')
        date = data.get('date')
        time = data.get('time')
        
        if not all([location, date, time]):
            return jsonify({'error': 'location, date, and time are required'}), 400
        
        if not WEATHER_API_KEY or not GEMINI_API_KEY:
            return jsonify({'error': 'API keys not configured'}), 500
        
        # Make request to WeatherAPI.com
        url = f"{WEATHER_BASE_URL}/forecast.json"
        params = {
            'key': WEATHER_API_KEY,
            'q': location,
            'dt': date
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            weather_response = response.json()
            forecast_day = weather_response['forecast']['forecastday'][0]
            
            # Find specific hour
            hour_data = forecast_day['hour'][0]
            requested_hour = int(time.split(':')[0])
            
            for hour in forecast_day['hour']:
                if hour['time'].endswith(f" {str(requested_hour).zfill(2)}:00"):
                    hour_data = hour
                    break
            
            # Prepare detailed weather information for Gemini
            weather_details = f"""
            Temperature: {hour_data['temp_c']}°C (Feels like: {hour_data['feelslike_c']}°C)
            Condition: {hour_data['condition']['text']}
            Wind Speed: {hour_data['wind_kph']} km/h
            Chance of Rain: {hour_data['chance_of_rain']}%
            Humidity: {hour_data['humidity']}%
            UV Index: {hour_data['uv']}
            """
            
            # Generate concise recommendations using Gemini
            prompt = f"""
            Based on the following weather conditions, provide ONLY 4-5 SHORT bullet points with specific recommendations.
            
            {weather_details}
            
            Rules:
            - Each point must be maximum 8-10 words
            - Start each point with a dash (-)
            - Focus on: clothing, items to bring (umbrella/sunscreen/raincoat), and precautions
            - NO introductory text, NO explanations, NO extra sentences
            - ONLY the bullet points
            
            Example format:
            - Wear light cotton clothes
            - Carry umbrella, 60% rain expected
            - Apply SPF 30+ sunscreen
            - Stay hydrated, high humidity
            """
            
            ai_response = model.generate_content(prompt)
            
            result = {
                'location': weather_response['location']['name'],
                'date': date,
                'time': time,
                'recommendations': ai_response.text.strip()
            }
            
            return jsonify(result), 200
        else:
            return jsonify({'error': 'Failed to fetch weather data', 'details': response.json()}), response.status_code
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'weather_api_configured': bool(WEATHER_API_KEY),
        'gemini_api_configured': bool(GEMINI_API_KEY)
    }), 200


if __name__ == '__main__':
    port = int(os.getenv('PORT', 10000))  
    app.run(host='0.0.0.0', port=port, debug=False)  