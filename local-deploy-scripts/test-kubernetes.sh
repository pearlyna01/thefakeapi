#!/bin/bash

kubectl apply -f deploy-local-ingress-controller.yaml &&\
kubectl apply -f deploy-services.yaml &&\
kubectl apply -f deploy-kube.yaml

echo "Please wait for ingress controller to be setup"
sleep 30
kubectl apply -f deploy-local-ingress.yaml 
