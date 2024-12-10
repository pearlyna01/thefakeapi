# from typing import Union
import requests
import os
from dotenv import load_dotenv 
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
from fastapi.encoders import jsonable_encoder

load_dotenv()
backend_api = os.getenv("BACKEND_API")
app = FastAPI()

class Message(BaseModel):
    number: int = Field(examples=[1])
    message: str = Field(examples=["Add a message"])
    class Config:
        from_attributes = True

class Url(BaseModel):
    url: str = Field(examples=["https://webhook-test.com/11234567"])
    name: str = Field(examples=["webhook-tester"])
    token: str = Field(examples=["itsjustatokensir"])

# CREATE or UPDATE a message
@app.post("/thefakeapi", 
          description="Create or update a message by sending a post request with its number and message",
          responses={ 
            200: {
                "description": "A message has been updated",
                "content": {
                    "application/json": {
                        "example": "Your message is updated!"
                    }
                },
            },
            201: {
                "description": "A message created",
                "content": {
                    "application/json": {
                        "example": "Your message is created!"
                    }
                },
        },})
def create_or_update_a_message(message:Message):
    item = jsonable_encoder(message)
    response = requests.post(backend_api+"/thefakeapi", json=item)
    if response.status_code == 200 or response.status_code == 201:
        return response.text
    else:
        return "Unable to reach /thefakeapi"

# READ message
@app.get("/thefakeapi", response_model=List[Message])
def read_messages():
    response = requests.get(backend_api+"/thefakeapi")
    if response.status_code == 200:
        output = response.json()
        return output
    else:
        return "Unable to reach /thefakeapi"

# DELETE message
@app.delete("/thefakeapi/{number}")
def delete_a_message(number):
    response = requests.delete(backend_api+"/thefakeapi/"+str(number))
    if response.status_code == 200:
        return response
    else:
        return "Unable to reach /thefakeapi"
    
# Register url to /webhook and subscribe for new mesages
@app.post("/webhook",
          description="Register your url to receive new message updates",
          responses={ 
            200: {
                "description": "Url has been updated or registered",
                "content": {
                    "application/json": {
                        "example": "Url is registered to receive message updates"
                    }
                },
            }})
def register_url(url:Url):
    item = jsonable_encoder(url)
    response = requests.post(backend_api+"/webhook", json=item)
    if response.status_code == 200:
        return response.text
    else:
        return "Unable to reach /thefakeapi" 