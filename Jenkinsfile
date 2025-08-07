pipeline {
  agent any

  environment {
    SONARQUBE_ENV = 'SonarQubeJenkins' // bạn đã cấu hình Sonar server
    VERSION = "v${BUILD_NUMBER}"
    BRANCH_NAME = "${params.BRANCH_NAME}"
  }

  stages {

    stage('0. Prepare DockerHub Credentials') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'from-docker-to-jenkins',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          script {
            env.DOCKER_USER = DOCKER_USER
            env.DOCKER_PASS = DOCKER_PASS
          }
        }
      }
    }

    stage('1. Checkout') {
      steps {
        git credentialsId: 'from-github-to-jenkins', url: 'https://github.com/tranthihuong-753/cicd.git', branch: 'main'
      }
    }

    stage('2. SonarQube Scan') {
      steps {
        dir('backend') {
          withSonarQubeEnv("${SONARQUBE_ENV}") {
            sh 'echo JAVA_HOME=$JAVA_HOME'
            sh 'which java'
            sh 'java -version'

            sh '''
            echo "📦 Cài dependencies"
            python -m pip install -r requirements.txt
            '''

            sh '''
            echo "🧪 Chạy test và tạo báo cáo coverage"
            pytest --cov=./ --cov-report=xml
            '''

            withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
              sh '''
              echo "📤 Gửi báo cáo lên SonarQube bằng Docker"
              docker run --rm \
                -e SONAR_TOKEN=$SONAR_TOKEN \
                -v "$(pwd):/usr/src" \
                sonarsource/sonar-scanner-cli \
                -Dsonar.projectKey=crud-app \
                -Dsonar.host.url=http://host.docker.internal:9000
              '''
            }
          }
        }
      }
    }


    stage('3. Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('4. Build Docker Images') {
        steps {         
            sh '''
            docker build -t ${DOCKER_USER}/backend:${VERSION} ./backend
            docker build -t ${DOCKER_USER}/frontend:${VERSION} ./frontend
            '''         
        }
    }

    stage('5. Push Docker Images') {
        steps {
            sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push ${DOCKER_USER}/backend:${VERSION}
            docker push ${DOCKER_USER}/frontend:${VERSION}
            docker logout
            '''
        }
    }

    // stage('7. Update DockerHub Description') {
    //   steps {    stage('6. Deploy to Remote Server') {
      steps {
        sshagent(credentials: ['from-github-to-jenkins']) {
          sh '''
          echo "📁 Tạo thư mục ~/cicd trên server (nếu chưa có)"
          ssh -p 22001 it23@101.99.23.156 "mkdir -p ~/cicd"

          echo "📦 Gửi các file deploy cần thiết lên server"
          scp -P 22001 deploy/docker-compose.yml it23@101.99.23.156:~/cicd/
          scp -P 22001 deploy/.env it23@101.99.23.156:~/cicd/
          scp -P 22001 deploy/backend.env it23@101.99.23.156:~/cicd/
          scp -P 22001 -r deploy/monitoring it23@101.99.23.156:~/cicd/

          echo "🚀 Triển khai hệ thống trên server từ Docker Hub"
          ssh -p 22001 it23@101.99.23.156 << EOF
            set -e
            cd ~/cicd
            export \$(cat .env | xargs)         # Load biến VERSION
            docker-compose down
            docker-compose pull
            docker-compose up -d
            docker ps
          EOF
          '''
        }
      }
    }
    //     script {
    //       def readme = readFile('README.md')
    //       .replace("\\", "\\\\")
    //       .replace("\"", "\\\"")
    //       .replace("\n", "\\n")

    //       def repo1 = "${env.DOCKER_USER}/backend"
    //       def repo2 = "${env.DOCKER_USER}/frontend"
          
    //       sh """
    //       echo "📄 Đẩy README.md lên Docker Hub"
    //       curl -X PATCH https://hub.docker.com/v2/repositories/${repo1}/ \\
    //           -u "${env.DOCKER_USER}:${env.DOCKER_PASS}" \\
    //           -H "Content-Type: application/json" \\
    //           -d '{\"description\": \"${readme}\"}'
    //       curl -X PATCH https://hub.docker.com/v2/repositories/${repo2}/ \\
    //           -u "${env.DOCKER_USER}:${env.DOCKER_PASS}" \\
    //           -H "Content-Type: application/json" \\
    //           -d '{\"description\": \"${readme}\"}'
    //       """
    //     }
    //   }
    // }

  }

  post {
      failure {
      echo "❌ Build failed at stage ${STAGE_NAME}"
      }
      success {
      echo "✅ Build & Push done: version ${VERSION}"
      }
  }

}
