# Claim Status API

This project implements a simple Node.js API with two endpoints:
- `GET /claims/:id` returns claim data from `claims.json`
- `POST /claims/:id/summarize` summarizes notes using Azure OpenAI

## Folder Structure
- `src/` contains the API code and Dockerfile
- `mocks/` contains static data files

## GenAI prompts
Generate an Azure DevOps pipeline YAML that:

Triggers on main branch
Builds and pushes a Docker image to Azure Container Registry using az acr build
Runs a Snyk container security scan
Deploys the image to Azure Container Apps
Imports an OpenAPI spec into Azure API Management with the Container App URL as backend
Uses variables for image name, ACR name, resource group, container app name, APIM name, and location.




Author,
Prathap Mathiyalagan