# build a schema using pydantic
from pydantic import BaseModel

class Conversation(BaseModel):
    title: str
    
    class Config:
        orm_mode = True

class Message(BaseModel):
    #index: int
    message: str
    user_name: str
    #conversation_id: int

    class Config:
        orm_mode = True
        
class Character(BaseModel):
    name: str
    
    class Config:
        orm_mode = True