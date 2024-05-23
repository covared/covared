import os
import time
import uuid
import json
import logging
import requests
import random
import traceback
from datetime import datetime, timedelta
from backports.zoneinfo import ZoneInfo

from fastapi import FastAPI, WebSocket, Response, Request, Query
from fastapi import Depends, Cookie, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware, db
from sqlalchemy.sql import func

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

import jwt

import stripe

from models import BreezedUser as ModelBreezedUser

from pydantic import BaseModel


import openai
from openai import OpenAI

from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, filename='app.log', filemode='a',
                    format='%(name)s - %(levelname)s - %(message)s')

load_dotenv('.env')

openai.api_key = os.environ["OPENAI_API_KEY"]  # btw remember to set this in production
client = OpenAI()

app = FastAPI()


# to avoid csrftokenError
app.add_middleware(DBSessionMiddleware, db_url=os.environ['DATABASE_URI'])  # is this right?
origins = []
front_end_url = os.getenv("FRONT_END_URL", None)
if front_end_url:
    origins = [front_end_url, front_end_url.replace("https://", "https://www.")]
else:
    origins = ["http://localhost:3000"]

print(f'origins={origins}')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, #["*"], # origins, # can't work this out should it be http or https, seems to work sometimes but not others
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


############################ REPORT WRITER ############################

@app.post('/report-writer')
async def message(data: dict, response: Response):
    print(f'in report writer, data={data}')
    student_name = data['student_name']
    class_name = data['class_name']
    competencies = data['competencies']
    topics = data['topics']
    email = data['email']

    user = db.session.query(ModelBreezedUser).filter(ModelBreezedUser.email==email).first()
    if (not user.subscribed_lifetime and not user.subscribed_monthly) and user.api_calls >= 5:
        return {'report': 'You have reached your limit of 5 better layouts, please subscribe'}
    user.api_calls += 1
    db.session.commit()
        
    print('competencies=', competencies)
    print('topics=', topics)
    set_access_cookies(response, email, user.subscribed_monthly, user.subscribed_lifetime)  # reset the access cookie to avoid log out

    use_gpt4 = data['use_gpt4']
    
    # subjects = [
    #     { 'name': 'material states, solid, liquids and gases', 'performance': 'meets expectations' },
    #     { 'name': 'the human body, food and nutrition', 'performance': 'good student' },
    #     { 'name': 'electromagnetism and how magnets work', 'performance': 'exceptional student' }
    # ]
    # competencies = [
    #   { 'name': 'Behaviour, concentration and listening', 'performance': 'needs improvement' },
    #   { 'name': 'Interacting and helping other students', 'performance': 'exceptional student' },
    #   { 'name': 'Contributing to class discussions', 'performance': 'meets expectations' },
    # ]
    
  
    system_prompt = get_report_writer_prompt(student_name, class_name, topics, competencies)
    answer = send_prompt_to_gpt(system_prompt, use_gpt4=use_gpt4)
    print(f'raw answer={answer}')
    answer = json.loads(answer)
    return answer

@app.post("/send-email")
async def send_verification_email(data: dict):
    email = data['email']
    print(f'in send verification email, email={email}')
    email = email.lower()
    users = db.session.query(ModelBreezedUser).filter(ModelBreezedUser.email==email).all()
    if len(users) == 0:
        user = ModelBreezedUser(
            email=email,
        )
        db.session.add(user)
        db.session.commit()
    else:
        user = db.session.query(ModelBreezedUser).filter(ModelBreezedUser.email==email).first()
    
    verification_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    user.email_verification_code = verification_code
    db.session.commit()

    subject = "BreezEd Verification Email"
    
    print(f'verification_code={verification_code}')
    content = f"""
    <html>
        <body>
            <p>Thank you for logging in. Your verification code is {verification_code}</p>
        </body>
    </html>
    """
    try:
        send_email(email_address=email, subject=subject, html_content=content)
        return {"message": "Email sent successfully."}
    except Exception as e:
        error_message = f"Error sending email: {e}"
        print(error_message)
        return {"message": error_message}

    
@app.post("/send-code")
async def check_verification_code(data: dict, response: Response):
    email = data['email']
    code = data['code']
    print(f'in check_verification_code, code={code}, email={email}')
    # check in database and check against code
    try:
        print(f'getting user with the same email')
        user = db.session.query(ModelBreezedUser).filter(ModelBreezedUser.email==email).first()
        print(f'pulled out relevant user')
        if code == user.email_verification_code:
            print(f'code matches')
            set_access_cookies(response, user.email, user.subscribed_monthly, user.subscribed_lifetime)  # reset the access cookie to avoid log out
            user.logins += 1
            db.session.commit()
            print(f'sending back success True')
            return {'success': True, 'message': 'code matches'}
        else:
            print(f'code does not match, code entered={code}, db code={user.email_verification_code}')
            return {'success': False, 'message': 'code does not match'}
    except:
        print('some sort of error finding hte user or setting access code')
        print(f'traceback={traceback.format_exc()}')
        return {'success': False, 'message': 'user not found'}

# Pydantic model for the response
class UserStatus(BaseModel):
    isLoggedIn: bool
    email: str = None
    isSubscribedMonthly: bool = False
    isSubscribedLifetime: bool = False



def verify_jwt_token(token: str = Cookie(None, alias='access_token')) -> dict:
    if token is None:
        print('verify jwt, no token')
        return {"isLoggedIn": False}
    try:
        # remember these need to be set in production
        JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
        JWT_ALGORITHM = os.environ["JWT_ALGORITHM"]
        print('decoding token')
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        print(f'decoded token payload={payload}')
        return {"isLoggedIn": True, "email": payload.get("email"), "is_subscribed_monthly": payload.get("is_subscribed_monthly"), "is_subscribed_lifetime": payload.get("is_subscribed_lifetime")}
    except jwt.ExpiredSignatureError:
        print('jwt.ExpiredSignatureError')
        return {"isLoggedIn": False}
    except jwt.PyJWTError:
        print('jwt.PyJWTError')
        return {"isLoggedIn": False}

    
@app.get("/auth/status", response_model=UserStatus)
async def get_login_status(request: Request, payload: dict = Depends(verify_jwt_token)):
    try:
        print(f'payload={payload}')
        if payload.get("isLoggedIn"):
            email = payload.get("email")
            is_subscribed_monthly = payload.get("is_subscribed_monthly")
            is_subscribed_lifetime = payload.get("is_subscribed_lifetime")
            return UserStatus(isLoggedIn=True, email=email, isSubscribedMonthly=is_subscribed_monthly, isSubscribedLifetime=is_subscribed_lifetime)
        else:
            return UserStatus(isLoggedIn=False)
    except:
        return UserStatus(isLoggedIn=False)

@app.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}


IS_STRIPE_LIVE = True
if IS_STRIPE_LIVE:
    stripe.api_key = os.environ["STRIPE_SECRET_API_KEY_LIVE"]
else:
    stripe.api_key = os.environ["STRIPE_SECRET_API_KEY_TEST"]

all_countries=['AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 
               'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'CV', 'CM', 'CA', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CD', 'CG', 'CK', 
               'CR', 'HR', 'CU', 'CW', 'CY', 'CZ', 'CI', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'El', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 
               'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 
               'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 
               'LT', 'LU', 'MO', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 
               'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 
               'MK', 'RO', 'RU', 'RW', 'RE', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 
               'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 
               'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'UM', 'US', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW', 'AX']

@app.post('/create-checkout-session')
async def create_checkout_session(data: dict):
    try:
        print('creating checkout session')
        email = data['email']
        plan_type = data['plan_type']
        print(f'email={email}, plan_type={plan_type}')
        # price options
        # price_1Os2M204Qdp2dmlvVsz5WAAV - this is monthly sub £5
        # price_1Os2Mq04Qdp2dmlv6tHFPRW5 - this is lifetime sub £15
        # price_1Os2Kx04Qdp2dmlve1U8CAhd - this is a 1p live test item - archived must be at least 30p
        # price_1Ot6BD04Qdp2dmlv9JaPzdrT - this is a 35p live test item
        # price_1Os5hA04Qdp2dmlvKE86lW4Q - this is a test price object
        country_list = ['GB', 'US', 'CA', 'AU', 'NZ', 'IE']  # all_countries,  # what are the legal implications of selling to other countries, explore
        shipping_address_collection = {'allowed_countries': country_list}
        if plan_type == 'Monthly Subscription':
            price_code = 'price_1Os2M204Qdp2dmlvVsz5WAAV'
            payment_mode = 'subscription'
        elif plan_type == 'Lifetime Subscription':
            price_code = 'price_1Os2Mq04Qdp2dmlv6tHFPRW5'
            payment_mode = 'payment'
        else:
            raise Exception('plan_type not recognised')
        # hard coded live test payment
        if not IS_STRIPE_LIVE:
            price_code = 'price_1Os5hA04Qdp2dmlvKE86lW4Q'
            payment_mode = 'payment'
        # use the live test item
        price_code = 'price_1Ot6BD04Qdp2dmlv9JaPzdrT'
        payment_mode = 'payment'
        line_items = [{'price': price_code, 'quantity': 1}]

        # this is not the best code, duplicated 4 times, based on the optional parameters that are excluded in some cases
        # not really sure how to improve this
        if email:
            if payment_mode == 'payment':
                session = stripe.checkout.Session.create(
                    ui_mode = 'embedded',
                    customer_email=email, # this is fixed if the user is logged in
                    submit_type='auto',
                    billing_address_collection='auto',
                    shipping_address_collection=shipping_address_collection,
                    line_items=line_items,
                    mode=payment_mode, # payment=one off payment, subscription=recurring payment
                    return_url=origins[0] + '/return?session_id={CHECKOUT_SESSION_ID}',
                    automatic_tax={'enabled': True},
                )
            else:
                session = stripe.checkout.Session.create(
                    ui_mode = 'embedded',
                    customer_email=email, # this is fixed if the user is logged in
                    billing_address_collection='auto',
                    shipping_address_collection=shipping_address_collection,
                    line_items=line_items,
                    mode=payment_mode, # payment=one off payment, subscription=recurring payment
                    return_url=origins[0] + '/return?session_id={CHECKOUT_SESSION_ID}',
                    automatic_tax={'enabled': True},
                )
        else:
            if payment_mode == 'payment':
                session = stripe.checkout.Session.create(
                    ui_mode = 'embedded',
                    submit_type='auto',
                    billing_address_collection='auto',
                    shipping_address_collection=shipping_address_collection,
                    line_items=line_items,
                    mode=payment_mode, # payment=one off payment, subscription=recurring payment
                    return_url=origins[0] + '/return?session_id={CHECKOUT_SESSION_ID}',
                    automatic_tax={'enabled': True},
                )
            else:
                session = stripe.checkout.Session.create(
                    ui_mode = 'embedded',
                    billing_address_collection='auto',
                    shipping_address_collection=shipping_address_collection,
                    line_items=line_items,
                    mode=payment_mode, # payment=one off payment, subscription=recurring payment
                    return_url=origins[0] + '/return?session_id={CHECKOUT_SESSION_ID}',
                    automatic_tax={'enabled': True},
                )
        print('finished getting session')
    except Exception as e:
        print(f'traceback={traceback.format_exc()}')
        print(f'error in create_checkout_session e={e}')
        return str(e)
    
    return {"clientSecret": session.client_secret}

@app.post('/stripe-webhook')
async def stripe_webhook(request: Request, response: Response):
    print(f'stripe webhook called')
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        STRIPE_WEBHOOK_SECRET = os.environ["STRIPE_WEBHOOK_SECRET"]
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
        print(f'received event["type"]={event["type"]}')

        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            email = session['customer_details']['email']
            if email:
                print(f'setting subcribed to True for email {email}')
                user = db.session.query(ModelBreezedUser).filter(ModelBreezedUser.email==email).first()
                amount_total = session['amount_total']
                if amount_total == 1500:
                    print(f'lifetime membership amount_total={amount_total}')
                    user.subscribed_lifetime = True
                elif amount_total == 500:
                    print(f'monthly membership amount_total={amount_total}')
                    user.subscribed_monthly = True
                else:
                    print(f'unexpected amount_total={amount_total}')
                    user.subscribed_lifetime = True  # take this out after an initial test
                db.session.commit()
                # set these cookies or they will not get updated to avoid multisubbing
                set_access_cookies(response, email, user.subscribed_monthly, user.subscribed_lifetime)

           

    except ValueError as e:
        # Invalid payload
        print(f'invalid payload, e={e}')
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        print(f'invalid signature, e={e}')
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        print(f'error in stripe_webhook e={e}')
        raise HTTPException(status_code=400, detail=f"Other error {e}")

    return {"status": "success"}

@app.get('/session-status')
async def session_status(session_id: str = Query(None, alias='session_id')):
  session = stripe.checkout.Session.retrieve(session_id)

  return {"status": session.status, "customer_email": session.customer_details.email}

    
def set_access_cookies(response: Response, email: str, is_subscribed_monthly: bool, is_subscribed_lifetime: bool):
    try:
        print(f'setting access cookies for email={email}, is_subscribed_monthly={is_subscribed_monthly}, is_subscribed_lifetime={is_subscribed_lifetime}')
        access_token_expiration = timedelta(hours=2)
        token_data = {"email": email, "exp": datetime.now(ZoneInfo("UTC")) + access_token_expiration, "is_subscribed_monthly": is_subscribed_monthly, "is_subscribed_lifetime": is_subscribed_lifetime}
        JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
        JWT_ALGORITHM = os.environ["JWT_ALGORITHM"]

        token = jwt.encode(token_data, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        # samesite='Strict' restricts the cookie to the same domain, if we might log in from an external site this would need to change
        # need samesite='None' for production to work
        response.set_cookie(key="access_token", value=token, httponly=True, expires=access_token_expiration.total_seconds(), secure=True, samesite='None', path='/')
    except Exception as e:
        print(f'error in set_access_cookies e={e}')
        print(f'traceback={traceback.format_exc()}')

def send_email(email_address: str, subject: str, html_content: str):
    message = Mail(
        from_email='info@breezed.co.uk',
        to_emails=email_address,
        subject=subject,
        html_content=html_content
    )
    try:
        SENDGRID_API_KEY = os.environ["SENDGRID_API_KEY"]
        print(f'SENDGRID_API_KEY={SENDGRID_API_KEY}')
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
    except Exception as e:
        print(f'traceback={traceback.format_exc()}')
        print(f'error in send_email e={e}')
        raise e


def get_report_writer_prompt(student_name, class_name, topics, competencies):
    topics_text = ''
    for topic in topics:
        topics_text += topic['name'] + '. Performance '+ topic['performance'] + '. '
    competencies_text = ''
    for competency in competencies:
        competencies_text += competency['name'] + '. Performance '+ competency['performance'] + '. '
    prompt = f'''
        Return a student report which has up to 4 paragraphs. Only do the main writing, not titles or headers. 
        The student is {student_name}, the class is {class_name}.
        The topics and the students performance in each are: {topics_text}.
        The competencies and the students performance in each are: {competencies_text}.
        Make sure to add in new paragraphs by adding "\\n\\n".
        Return a valid json with the key 'report' which contains the report.
    ''' 
    return prompt
    


########################## BASIC MESSAGE TO GPT API #########################

def send_prompt_to_gpt(prompt, messages=[], use_gpt4=False, tools=None):
    if use_gpt4:
        # model = "gpt-4-1106-preview"
        model = "gpt-4-0125-preview"
    else:
        # model = "gpt-3.5-turbo-1106"
        model = "gpt-3.5-turbo-0125"
    
    response_format = { "type": "json_object" }
    # messages are first message first and of the form 
    #     [ {'role':'user', 'content':'tell me a joke'}, 
    #       {'role':'assistant', 'content':'why did the chicken cross the road'}, 
    #       {'role':'user', 'content':'I don't know, why did the chicken cross the road'}]
    if messages:
        gpt_prompt = [{"role": "system", "content": f"{prompt}"}] + messages
    else:
        gpt_prompt = [{"role": "system", "content": f"{prompt}"}]

    if tools:
        response = client.chat.completions.create(model=model, response_format=response_format, messages=gpt_prompt, tools=tools)
    else:
        response = client.chat.completions.create(model=model, response_format=response_format, messages=gpt_prompt)
    answer = response.choices[0].message
    
    return answer.content
