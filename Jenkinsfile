pipeline {
  agent any

  environment {
    SONARQUBE_ENV = 'SonarQubeJenkins' // bạn đã cấu hình Sonar server
    VERSION = "v${BUILD_NUMBER}"
    BRANCH_NAME = "${params.BRANCH_NAME}"
    // SONAR_TOKEN = "sqa_635740e8423141bdc81e635384a16cbb21de9693"
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

                    sh'''
                    echo "🧪 Chạy test và tạo báo cáo coverage"
                    pytest --cov=./ --cov-report=xml
                    '''

                    sh '''
                    echo "📤 Gửi báo cáo lên SonarQube bằng Docker"
                    docker run --rm -e SONAR_TOKEN=$DOCKER_PASS -v "$(pwd):/usr/src" sonarsource/sonar-scanner-cli -Dsonar.projectKey=crud-app -Dsonar.host.url=http://host.docker.internal:9000
                    '''
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


    // stage('6. Deploy to Remote Server') {
    //   steps {
    //     sshagent(credentials: ['from-github-to-jenkins']) {
    //       sh '''
    //       echo "📦 Gửi docker-compose.yml và prometheus.yml lên server"
    //       scp -P 22001 docker-compose.yml it23@101.99.23.156:~/cicd/
    //       scp -P 22001 -r monitoring it23@101.99.23.156:~/cicd/
          
    //       echo "🚀 Triển khai lại toàn bộ hệ thống"
    //       ssh -p 22001 it23@101.99.23.156 "cd ~/cicd && docker-compose down && docker-compose pull && docker-compose up -d"
    //       '''
    //     }
    //   }
    // }

    stage('7. Update DockerHub Description') {
      steps {
          script {
            def readmeContent = readFile('README.md').bytes.encodeBase64().toString()
            def repo = "${DOCKER_USER}/backend"
            
            sh """
            echo "📄 Đẩy README.md lên Docker Hub"
            curl -X PATCH https://hub.docker.com/v2/repositories/${repo}/ \\
                -u "${DOCKER_USER}:${DOCKER_PASS}" \\
                -H "Content-Type: application/json" \\
                -d '{\"full_description\": \"${readmeContent}\"}'
            """
        }
      }
    }

    stage('8. Tag Git (optional)') {
      when {
        expression {
          return sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim() == "main"
        }
      }
      steps {
        sshagent(credentials: ['from-github-to-jenkins']) {
          sh '''
          echo "🏷️ Gắn tag ${VERSION} và đẩy lên GitHub"
          git config user.name "tranthihuong-753"
          git config user.email "dhhuongdhlt1@gmail.com"
          git tag -a ${VERSION} -m "CI Build ${VERSION}"
          git push origin ${VERSION}
          '''
        }
      }
    }

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
