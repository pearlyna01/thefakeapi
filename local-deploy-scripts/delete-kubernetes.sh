#!/bin/bash

kubectl delete -f deploy-local-ingress-controller.yaml &&\
kubectl delete -f deploy-services.yaml &&\
kubectl delete -f deploy-kube.yaml &&\
kubectl delete -f deploy-local-ingress.yaml 