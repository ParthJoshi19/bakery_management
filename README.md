# Backery

A simple bakery management web application built with Flask.

## Features
- Web-based interface for bakery management
- Static HTML and CSS for frontend
- Python Flask backend

## Project Structure
```

backery/
  app.py            # Main Flask application
  requirements.txt  # Python dependencies
  static/
    index.html      # Main HTML page
    style.css       # Stylesheet
```

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ParthJoshi19/bakery_management.git
   cd bakery_management
   ```
2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Unix or MacOS:
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the application:**
   ```bash
   python app.py
   ```

## Notes
- The `venv/` directory is not tracked by git (see `.gitignore`).
- Make sure to activate the virtual environment before running the app.

## License
MIT License 
