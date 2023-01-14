# API Gateway

## Goals of API gateway

FRONTEND ---- MIDDLEEND ---- BACKEND

- We need an intermediate layer between the clientside and microservices
- Using this middleend, when client sends request, we will be able to make decision that which microservice shoul actually respond to this request
- We can do messgae validation, response transformation, rate limiting.
- We try to prepare an API Gateway that acts as this middle-end.
