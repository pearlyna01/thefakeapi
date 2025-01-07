# thefakeapi

A simple CRUD API to create/read/update/delete messages. Scripts to setup the API are available.

## Getting Started
Running locally on your machine
     - Requirements:
       - Docker Desktop (kubernetes enabled)
       - kubectl
     - Using a bash terminal, run the following command to start the kubernetes cluster locally:
       - `sh local-deploy-scripts/test-kubernetes.sh`
     - Using a bash terminal, run the following command to stop the kubernetes cluster locally:
       - `sh local-deploy-scripts/delete-kubernetes.sh`
     - To access the website:
       - http://localhost
Running in cloud (AWS)
     - Requirements:
       - Terraform
       - AWS CLI
       - kubectl 
       - helm
     --- 
     - To setup EKS cluster and ingress controller, 
       - `cd eks-setup`
       - `sh setup-eks.sh` to setup the eks cluster using terraform
       - `sh setup-ingress-controller.sh` to setup the ingress controller
     - To deploy the containers in EKS cluster,
       - `sh eks-deploy-scripts/test-kubernetes.sh`
     - To access the website:
       - `kubectl get ingress` to find the ingress' address
       - `http://<address of the ingress>` 
     --- 
     - To delete the containers in EKS cluster,
       - `sh eks-deploy-scripts/delete-kubernetes.sh`
     - To destroy the EKS cluster and ingress controller, 
       - `cd eks-setup`
       - `sh delete-ingress-controller.sh` to delete the ingress controller
       - `sh delete-eks.sh` to delete the eks cluster using terraform
- For local development,
  - To start the frontend to test the api
    - `cd frontend` 
    - `pip install -r requirements.txt`
    - `fastapi dev main.py`
  - To start thefakeapi
    - `cd backend`
    - `npm i`
    - `npm run start`

## Architecure 
![architecture.png](architecture.png)

A CICD pipeline is setup using Github Actions. The pipeline can be found in .github/workflows/main.yml
