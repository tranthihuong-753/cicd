pipeline {
  agent any

  environment {
    SONARQUBE_ENV = 'SonarQubeJenkins' // bạn đã cấu hình Sonar server
    VERSION = "v${BUILD_NUMBER}"
    BRANCH_NAME = "${params.BRANCH_NAME}"
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'from-github-to-jenkins', url: 'https://github.com/tranthihuong-753/cicd.git', branch: 'main'
      }
    }

    
    stage('SonarQube Scan') {
        steps {
            dir('backend') {
            withSonarQubeEnv("${SONARQUBE_ENV}") {
                sh'''
                echo "Running SonarQube analysis for backend..."
                #python -m venv venv
                #venv/Scripts/activate
                python -m pip install -r requirements.txt

                echo "Kiểm tra coding style..."
                flake8 app || true  # Không làm fail pipeline nếu lỗi style
                black --check app || true
                mypy app || true    # nếu bạn đã type hinting

                echo "Chạy test để tạo báo cáo coverage..."
                pytest --cov=./ --cov-report=xml

                echo "Gửi báo cáo lên SonarQube"
                sonar-scanner -Dsonar.projectKey=crud-app -Dsonar.sources=. -Dsonar.python.coverage.reportPaths=coverage.xml
                
                '''
            }
            }
        }
    }
    
    // stage('Build Frontend') {
    //   steps {
    //     dir('frontend') {
    //       sh 'npm install'
    //       sh 'npm run build'
    //     }
    //   }
    // }

    // stage('Build Docker Images') {
    //     steps {
    //         withCredentials([usernamePassword(
    //         credentialsId: 'from-docker-to-jenkins',
    //         usernameVariable: 'DOCKERHUB_CREDENTIALS_USR',
    //         passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW'
    //         )]) 
    //         {
    //         sh '''
    //         docker build -t ${DOCKERHUB_CREDENTIALS_USR}/backend:${VERSION} ./backend
    //         docker build -t ${DOCKERHUB_CREDENTIALS_USR}/frontend:${VERSION} ./frontend
    //         '''
    //         }
    //     }
    // }

    // stage('Push Docker Images') {
    //     steps {
    //         withCredentials([usernamePassword(
    //         credentialsId: 'from-docker-to-jenkins',
    //         usernameVariable: 'DOCKERHUB_CREDENTIALS_USR',
    //         passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW'
    //         )])
    //         {
    //         sh '''
    //         echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
    //         docker push ${DOCKERHUB_CREDENTIALS_USR}/backend:${VERSION}
    //         docker push ${DOCKERHUB_CREDENTIALS_USR}/frontend:${VERSION}
    //         docker logout
    //         '''
    //         }
    //     }
    // }

    // stage('Tag Git (optional)') {
    //     when { // Nhớ dùng Multibranch Pipeline
    //         expression { env.BRANCH_NAME == 'main' }
    //     }
    //     steps {
    //         sh '''
    //         git config user.name "tranthihuong-753"
    //         git config user.email "dhhuongdhlt1@gmail.com"
    //         git tag -a ${VERSION} -m "CI Build ${VERSION}"
    //         git push origin ${VERSION}
    //         '''
    //     }
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
