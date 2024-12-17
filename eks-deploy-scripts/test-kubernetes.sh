#!/bin/bash

kubectl apply -f deploy-services.yaml &&\
kubectl apply -f deploy-kube.yaml &&\
kubectl apply -f deploy-ingress.yaml 
