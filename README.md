# 🚀 CI/CD Project - FastAPI + React + PostgreSQL

## 👤 Thông tin
- **Gmail**: tthuong.work.378@gmail.com 
- **Docker Hub**: [huongduong](https://hub.docker.com/repositories/huongduong)  

---

## 📖 Giới thiệu dự án

Đây là một dự án **web fullstack** với:
- **Frontend**: React  
- **Backend**: FastAPI  
- **Database**: PostgreSQL  

Hệ thống tích hợp CI/CD với:
- **Docker**: Container hóa frontend + backend + DB  
- **Jenkins**: Tự động build, test, deploy  
- **SonarQube**: Kiểm tra chất lượng code  
- **Prometheus + Grafana**: Monitoring sau deploy  

👉 Dự án này đã hoàn thiện pipeline CI/CD.  
Người dùng có thể **clone repo, chạy local hoặc docker-compose** để trải nghiệm ứng dụng.

## 🌐 Tech Stack

| Layer        | Technology                |
|--------------|---------------------------|
| Frontend     | ReactJS (port `3000`)     |
| Backend      | FastAPI (port `8000`)     |
| Database     | PostgreSQL (port `5432`)  |
| CI/CD        | Jenkins + Docker Hub      |
| Code Quality | SonarQube (port `9000`)   |
| Monitoring   | Prometheus (9099) + Grafana (3000) |
| Deploy       | Docker Compose + SSH Remote |

---

## ⚡ How It Works

1. **Push code lên GitHub**  
2. **Jenkins Pipeline** chạy build & test  
3. **SonarQube Scan** để phân tích chất lượng code  
4. **Docker Build & Push** image lên Docker Hub  
5. **SSH Server** & `docker-compose up -d` để deploy  
6. **Prometheus + Grafana** giám sát hệ thống realtime  

📌 *Khi có code mới → Jenkins tự động build → Server auto deploy → Monitoring online.*

---

## 📂 Project Structure

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


---

## 🛠 Yêu cầu hệ thống

- Python **3.9+**
- Node.js **16+**
- Docker & Docker Compose
- Git

---

## 📥 Hướng dẫn cài đặt

Clone repo:

```bash
git clone [https://github.com/huongduong/cicd-project.git](https://github.com/tranthihuong-753/cicd.git)
cd cicd
```

---

## 📦 1. Chạy Local

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Truy cập: http://localhost:8000/docs

---

### Frontend (React)
```bash
cd frontend
npm install
npm start
```
Truy cập: http://localhost:3000

---

### Database (PostgreSQL)
Cập nhật chuỗi kết nối trong `backend/.env`:

```
DATABASE_URL=postgresql://postgres:123456@localhost:5432/postgres
```

---

## 🐳 2. Chạy bằng Docker

### Build & Run
```bash
docker-compose up --build
```

Ứng dụng sẽ chạy với các dịch vụ:
- Backend: http://localhost:8000  
- Frontend: http://localhost:3000  
- SonarQube: http://localhost:9000  
- Prometheus: http://localhost:9099  
- Grafana: http://localhost:3000 (port có thể đổi nếu trùng)

### Stop
```bash
docker-compose down -v
```

---

## 🔍 3. SonarQube (Code Quality)

1. Chạy test coverage:
```bash
pytest --cov=./ --cov-report=xml
```

2. Scan bằng Docker:
```bash
docker run --rm -v "$(pwd):/usr/src" sonarsource/sonar-scanner-cli
```

---

## 📊 4. Monitoring

- **Prometheus**: cấu hình trong `monitoring/prometheus.yml` (port **9099**)  
- **Grafana**: chạy trên port **3000**, truy cập dashboard qua browser  

---

## 🌐 5. Deploy lên server

### Bước 1: SSH vào server
```bash
ssh it23@101.99.23.156 -p 22001
```

### Bước 2: Copy file deploy
```bash
scp -P 22001 deploy/* it23@101.99.23.156:~/cicd/
```

### Bước 3: Deploy
```bash
ssh it23@101.99.23.156 -p 22001 << EOF
cd ~/cicd
export $(cat .env | xargs)
docker-compose down
docker-compose pull
docker-compose up -d
EOF
```

### Bước 4: Kiểm tra
```bash
docker ps
```

---

## 🔄 6. CI/CD Pipeline

Quy trình CI/CD của dự án:

1. Developer **push code** lên GitHub  
2. Jenkins **trigger pipeline**:  
   - Build & test code  
   - Kiểm tra chất lượng bằng SonarQube  
   - Build Docker image  
   - Push image lên Docker Hub  
3. Jenkins **SSH sang server**:  
   - Pull image mới  
   - Restart container bằng docker-compose  
4. Monitoring bằng **Prometheus + Grafana**  

---

## ✅ Trải nghiệm sản phẩm

Sau khi deploy, người dùng có thể truy cập:
- **Frontend**: http://<server-ip>:3000  
- **API docs** (FastAPI Swagger): http://<server-ip>:8000/docs  
- **SonarQube**: http://<server-ip>:9000  
- **Grafana**: http://<server-ip>:3000  

---

## Devops CI/CD

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

---
## 📧 Liên hệ

- Email: huong.tran@example.com  
- GitHub Issues: [tạo issue](https://github.com/huongduong/cicd-project/issues)  
- Docker Hub: [huongduong](https://hub.docker.com/u/huongduong)  

---

> ℹ️ README này dành cho **người dùng & developer** muốn chạy thử hoặc triển khai ứng dụng.  
> Nếu bạn chỉ muốn **deploy nhanh** trên server, xem mục [Deploy lên server](#-5-deploy-lên-server).



