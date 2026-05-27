import os

database_path = os.getenv('DATABASE_PATH', '/data')
os.makedirs(database_path, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_path}/ksemantix.db'
