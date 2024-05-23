from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Float, TEXT, Boolean, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base  = declarative_base()

class BreezedUser(Base):
    __tablename__ = 'breezed_user'
    id = Column(Integer, primary_key=True)
    email = Column(String)
    email_verification_code = Column(String)
    logins = Column(Integer, default=0)
    api_calls = Column(Integer, default=0)
    subscribed_monthly = Column(Boolean, default=False)
    subscribed_lifetime = Column(Boolean, default=False)
    
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    