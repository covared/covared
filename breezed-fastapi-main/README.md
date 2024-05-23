# Getting started

## Set up virtual environment - First time only
`pip install virtualenv`
`python -m venv venv`

## Activate virtual environment
`source venv/bin/activate`

## Install requirements - First time or on requirement changes
`pip install -r requirements.txt`

## Set up database - First time only
Following this blog post - https://www.educative.io/answers/how-to-use-postgresql-database-in-fastapi
Run a database server, this can be done using the postgres app or through docker
Add a .env file with the line
`DATABASE_URI = '...'`

## Generate any outstanding database migrations and run those migrations
`alembic revision --autogenerate -m "New Migration"`
`alembic upgrade head`

## Run the server
`uvicorn main:app --reload`

