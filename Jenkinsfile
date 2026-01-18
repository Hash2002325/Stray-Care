pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'hash2002325'
        BACKEND_IMAGE  = 'backend'
        FRONTEND_IMAGE = 'frontend'
    }

    stages {

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/$BACKEND_IMAGE:latest ./backend'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/$FRONTEND_IMAGE:latest ./frontend'
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh 'docker push $DOCKERHUB_USER/$BACKEND_IMAGE:latest'
                sh 'docker push $DOCKERHUB_USER/$FRONTEND_IMAGE:latest'
            }
        }
    }

    post {
        success {
            echo ' CI Pipeline completed successfully. Images pushed to Docker Hub.'
        }
        failure {
            echo ' CI Pipeline failed. Check logs.'
        }
    }
}
