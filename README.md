# cicd

1/ Chuẩn bị môi trường ảo 

python -m venv venv 

venv\Scripts\Activate.ps1

2/ Cấu trúc dự án 

crud-project/

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

├── frontend/

│   └── [React App]

├── docker-compose.yml

├── sonar-project.properties


3/ Chuỗi kết nối tới DB postgre 

dialect+driver://username:password@host:port/database

dialect+driver://postgres:123456@db:5432/postgres

4/ Chạy back FastAPI 

uvicorn app.main:app --reload

Lỗi hay gặp ở chuỗi kết nối, nhớ check sự tồn tại của DB, role(user,pass) 

5/ Chạy front react 

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

6/ Devops CI/CD

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

