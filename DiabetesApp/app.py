from flask import Flask, render_template, request
import pickle
import numpy as np
import os

app = Flask(__name__)

# Set base directory
basedir = os.path.abspath(os.path.dirname(__file__))

# Load model and scaler using absolute paths
scaler_path = os.path.join(basedir, 'scaler.pkl')
model_path = os.path.join(basedir, 'lr.pkl')

scaler = pickle.load(open(scaler_path, 'rb'))
lr = pickle.load(open(model_path, 'rb'))

@app.route('/')
def home():
    return render_template("landing.html")

@app.route('/predict')
def predict_form():
    return render_template("index.html")

@app.route('/result', methods=['POST'])
def result():
    try:
        Age = int(request.form.get("Age"))
        Glucose = int(request.form.get("Glucose"))
        BloodPressure = int(request.form.get("BloodPressure"))
        Insulin = int(request.form.get("Insulin"))
        BMIs = float(request.form.get("BMI"))
        SkinThickness = int(request.form.get("SkinThickness"))
        DiabetesPedigreeFunction = float(request.form.get("DiabetesPedigreeFunction"))

        temp_arr = [Glucose, BloodPressure, SkinThickness, Insulin, BMIs, DiabetesPedigreeFunction, Age]
        data = np.array([temp_arr])
        temp_sc = scaler.transform(data)
        pred = lr.predict(temp_sc)[0]
        
        # Get prediction probability for confidence score
        pred_proba = lr.predict_proba(temp_sc)[0]
        confidence = max(pred_proba) * 100

        res = "indicates" if pred == 1 else "does not indicate"
        
        # Prepare user data for display
        user_data = {
            'Age': Age,
            'Glucose': Glucose,
            'BloodPressure': BloodPressure,
            'Insulin': Insulin,
            'BMI': BMIs,
            'SkinThickness': SkinThickness,
            'DiabetesPedigreeFunction': DiabetesPedigreeFunction
        }
        
        return render_template('result.html', 
                             prediction=res, 
                             user_data=user_data, 
                             confidence=round(confidence, 1))

    except Exception as e:
        return f"Error: {e}", 400

if __name__ == '__main__':
    app.run(debug=True)
