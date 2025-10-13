import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Configure the API key
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    print("✅ API Key configured successfully.")
except Exception as e:
    print(f"❌ ERROR: Failed to configure API key. Check your .env file. Error: {e}")
    exit()

print("\n--- Models available for your API key ---")
print("Copy one of the names below (e.g., 'gemini-1.0-pro') into your app.py file.\n")

# List all models and filter for the ones that can generate text
for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    # The name to use in the code is the part after "models/"
    model_name_for_code = m.name.replace("models/", "")
    print(f"- {model_name_for_code}")