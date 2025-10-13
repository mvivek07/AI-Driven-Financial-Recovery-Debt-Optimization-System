import os
from dotenv import load_dotenv

# This loads the variables from your .env file
load_dotenv()

# This attempts to read the variable
api_key = os.getenv("GOOGLE_API_KEY")

if api_key:
    print("✅ Success! The GOOGLE_API_KEY was loaded correctly.")
    print(f"   Your key starts with: {api_key[:4]}...")
else:
    print("❌ Error! The GOOGLE_API_KEY could not be found.")