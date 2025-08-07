# cicd

1/ Chuẩn bị môi trường ảo 

python -m venv venv 

venv\Scripts\Activate.ps1

2/ Cấu trúc dự án 

CICD/

├── backend/

│   ├── app/

│   │   ├── main.py

│   │   ├── models.py

│   │   ├── schemas.py

│   │   ├── crud.py

│   │   └── database.py

│   └── tests/

│   │   ├── __init__.py

│   │   └── test_main.py

│   └── requirements.txt

│   └── sonar-project.properties

│   └── .env 

├── frontend/

│   └── [React App]

├── monitoring/              

│   └── prometheus.yml  
├── deploy/              

│   ├── monitoring/              

│   │   └── prometheus.yml  

│   ├── .env

│   ├── backend.env

│   ├── docker-compose. 

├── docker-compose.yml

├── sonar-project.properties


3/ Chuỗi kết nối tới DB postgre 

dialect+driver://username:password@host:port/database

dialect+driver://postgres:123456@db:5432/postgres

4/ Chạy back FastAPI 

port 8000 

uvicorn app.main:app --reload

Lỗi hay gặp ở chuỗi kết nối, nhớ check sự tồn tại của DB, role(user,pass) 

pip freeze > requirements.txt

5/ Chạy front react 

port 3000 

npm install 

npm start 

6/ Công nghệ 

Fontend react viev 

Backend FastAPI 

DB Postgres 

7/ Docker 

docker-compose up --build

docker-compose down -v

docker tag <image_name>:<old_tag> <new_name>:<new_tag>

docker tag cicd-backend:latest huongduong/myapp-frontend:latest

docker push huongduong/cicd-backend:v1

docker push huongduong/cicd-frontend:v1

docker pull  

docker run -p ?:? n-a-m-e

7/ Sona

port 9000 

pytest --cov=./ --cov-report=xml

docker run --rm -v "$(pwd):/usr/src" sonarsource/sonar-scanner-cli

8/ Prometheus 

port 9099

Khởi tạo đối tượng trong main 

Tạo monitoring/prometheus.yml 

10/ Grafana

port 3000

11/ ssh 1 image 

ssh it23@101.99.23.156 -p 22001
= ED25519 key fingerprint is SHA256:d1jDLs2l5V2xNeKkxlacfVTSw+UqxiQADPZNbgETdao.

# Test kéo image
docker pull yourdockerhubusername/yourimage:latest

# Chạy thử
docker run -d --name app -p 80:8000 yourdockerhubusername/yourimage:latest

12/ ssh nhiều image 
doi het localhost sang ipv4 may 

ssh it23@101.99.23.156 -p 22001

mkdir -p ~/cicd
exit

scp -P 22001 docker-compose.yml it23@101.99.23.156:~/cicd/
scp -P 22001 .env it23@101.99.23.156:~/cicd/
scp -P 22001 backend/.env it23@101.99.23.156:~/cicd/
scp -P 22001 -r monitoring it23@101.99.23.156:~/cicd/

scp -P 22001 D:\cmc\software-development\ck\cicd\deploy\docker-compose.yml it23@101.99.23.156:~/cicd/
scp -P 22001 D:\cmc\software-development\ck\cicd\deploy\.env it23@101.99.23.156:~/cicd/
scp -P 22001 D:\cmc\software-development\ck\cicd\deploy\backend.env it23@101.99.23.156:~/cicd/
scp -P 22001 -r D:\cmc\software-development\ck\cicd\deploy\monitoring it23@101.99.23.156:~/cicd/


ssh it23@101.99.23.156 -p 22001 << EOF
cd ~/cicd
export $(cat .env | xargs)        # load biến VERSION
docker-compose down
docker-compose pull
docker-compose up -d
EOF

docker ps

7/ Devops CI/CD

| Bước | Mục tiêu                                                | Ghi chú |
| ---- | ------------------------------------------------------- | ------- |
| 1️⃣  | GitHub repo đầy đủ code                                 | ✔️      |
| 2️⃣  | Dockerfile backend + frontend                           | ✔️      |
| 3️⃣  | **SonarQube tích hợp sớm trong Jenkins** (code quality) | 🚀 Sớm  |
| 4️⃣  | Jenkinsfile có CI/CD logic                              | ✔️      |
| 5️⃣  | Cấu hình Jenkins SSH và Docker Hub creds                | ✔️      |
| 6️⃣  | Build image và push lên Docker Hub                      | ✔️      |
| 7️⃣  | SSH vào server OK                                       | ✔️      |
| 8️⃣  | Có `docker-compose.yml` trên server                     | ✔️      |
| 9️⃣  | Pull & run image trên server thành công                 | ✔️      |
| 🔟   | Domain + HTTPS (nếu cần)                                | ➖       |
| 🔁   | **Grafana (giám sát hệ thống sau khi chạy)**            | ✅ Sau   |



