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

## KQL query
### API Errors (APIM):
requests
| where success == false
| summarize ErrorCount = count() by name, bin(timestamp, 5m)
| render timechart

### High Latency Calls:
requests
| summarize AvgDuration = avg(duration) by name, bin(timestamp, 5m)

### Container App Errors
ContainerAppConsoleLogs_CL
| where Log_s contains "error"
| summarize count() by ContainerAppName_s, bin(TimeGenerated, 5m)


Author,
Prathap Mathiyalagan