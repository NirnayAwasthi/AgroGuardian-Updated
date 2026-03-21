# AgroGuardian - Smart Crop Recommendation System

An intelligent crop recommendation system that uses machine learning to suggest the best crops based on soil nutrients and climate conditions.

## 🌟 Features

- **AI-Powered Predictions**: Uses Random Forest model trained on agricultural data
- **Beautiful UI**: Modern, responsive design with animated components
- **Real-time Analysis**: Instant crop recommendations based on input parameters
- **Confidence Scoring**: Shows prediction confidence percentage
- **Full-Screen Background**: Immersive agricultural-themed interface

## 📋 Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- pip (Python package manager)

## 🚀 Installation

### Backend Setup

1. **Navigate to the backend folder**:
   ```bash
   cd backend/Crop_Recommandation\ System
   ```

2. **Install Python dependencies**:
   ```bash
   pip install flask flask-cors numpy pandas scikit-learn --break-system-packages
   ```

3. **Ensure all model files are present**:
   - RandomForest.pkl
   - DecisionTree.pkl
   - KNeighborsClassifier.pkl
   - NBClassifier.pkl
   - XGBoost.pkl
   - Crop_recommendation.csv

4. **Start the Flask backend**:
   ```bash
   python webapp.py
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd agrogurdian-frontend
   ```

2. **Ensure the background image is in the public folder**:
   - Copy `crop-bg.jpg` to `public/crop-bg.jpg`

3. **Copy the new Crop component files**:
   - Copy `Crop.js` to `src/features/Crop/Crop.js`
   - Copy `Crop.css` to `src/features/Crop/Crop.css`

4. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

5. **Start the React development server**:
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3000`

## 📁 File Structure

```
agrogurdian-frontend/
├── public/
│   └── crop-bg.jpg              # Background image
├── src/
│   ├── features/
│   │   └── Crop/
│   │       ├── Crop.js          # Main component
│   │       └── Crop.css         # Styles
│   └── ...

backend/
└── Crop_Recommandation System/
    ├── webapp.py                # Flask API
    ├── RandomForest.pkl         # ML model
    ├── DecisionTree.pkl
    ├── KNeighborsClassifier.pkl
    ├── NBClassifier.pkl
    ├── XGBoost.pkl
    ├── Crop_recommendation.csv  # Training data
    └── requirements.txt
```

## 🔧 Usage

1. **Start both servers** (backend and frontend)

2. **Login to your account** (if authentication is enabled)

3. **Navigate to the Crop Recommendation page** by clicking on "Crop" in the navigation

4. **Fill in the form** with the following parameters:

   **Soil Nutrients:**
   - Nitrogen (N) - ratio value
   - Phosphorus (P) - ratio value
   - Potassium (K) - ratio value
   - pH Value - 0-14 scale

   **Climate Conditions:**
   - Temperature - in Celsius
   - Humidity - percentage (0-100)
   - Rainfall - in millimeters

5. **Click "Get Recommendation"** to receive AI-powered crop suggestions

6. **View Results**:
   - Recommended crop name
   - Confidence percentage
   - Summary of input parameters

## 📊 Input Examples

### Example 1: Rice
```
N: 90
P: 42
K: 43
Temperature: 20.9°C
Humidity: 82%
pH: 6.5
Rainfall: 202mm
```

### Example 2: Wheat
```
N: 50
P: 25
K: 30
Temperature: 15°C
Humidity: 65%
pH: 6.8
Rainfall: 120mm
```

### Example 3: Cotton
```
N: 120
P: 40
K: 50
Temperature: 28°C
Humidity: 70%
pH: 7.2
Rainfall: 150mm
```

## 🎨 Features of the UI

- **Gradient Overlay**: Beautiful green gradient over agricultural background
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in, slide-up, and pulse effects
- **Intuitive Form**: Clear sections for soil and climate data
- **Visual Feedback**: Loading states, error messages, and success cards
- **Modern Components**: Rounded corners, shadows, and glassmorphism effects

## 🛠️ Troubleshooting

### Backend Issues

**Error: Model not found**
- Ensure `RandomForest.pkl` is in the same directory as `webapp.py`
- Check file permissions

**Error: Module not found**
- Install missing Python packages: `pip install flask flask-cors numpy scikit-learn --break-system-packages`

**Error: Port 5000 already in use**
- Change the port in `webapp.py`: `app.run(port=5001)`
- Update the port in `Crop.js` fetch URL accordingly

### Frontend Issues

**Error: Cannot connect to server**
- Ensure the Flask backend is running on port 5000
- Check CORS settings in `webapp.py`
- Verify the API URL in `Crop.js`

**Background image not showing**
- Ensure `crop-bg.jpg` is in the `public` folder
- Check the path in `Crop.css`: `url('/crop-bg.jpg')`
- Clear browser cache

## 🔐 Security Notes

- The backend runs without authentication for development
- For production, add authentication middleware
- Validate all inputs on both client and server side
- Use environment variables for sensitive configuration

## 📝 API Endpoints

### GET /
Returns API status and model loaded state

### POST /predict
Accepts JSON with crop parameters and returns prediction

**Request Body:**
```json
{
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "temperature": 20.9,
  "humidity": 82,
  "ph": 6.5,
  "rainfall": 202
}
```

**Response:**
```json
{
  "success": true,
  "prediction": "rice",
  "confidence": 95.5,
  "input": { ... }
}
```

### GET /health
Returns server health status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is part of the AgroGuardian agricultural intelligence platform.

## 👥 Support

For issues or questions:
- Check the troubleshooting section
- Review the console logs (browser and terminal)
- Ensure all dependencies are installed correctly

---

**Happy Farming! 🌾**
