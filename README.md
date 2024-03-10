uvicorn main:app --reload

python3 server.py
python3 client.py --partition-id 0
python3 client.py --partition-id 1
