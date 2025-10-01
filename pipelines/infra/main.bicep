param location string = 'eastus'
param resourceGroupName string
param containerAppName string
param containerImage string
param acrName string
param apimName string

resource containerEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${containerAppName}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: containerEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
      }
      registries: [
        {
          server: '${acrName}.azurecr.io'
        }
      ]
    }
    template: {
      containers: [
        {
          name: containerAppName
          image: containerImage
        }
      ]
    }
  }
}

resource apim 'Microsoft.ApiManagement/service@2023-03-01-preview' = {
  name: apimName
  location: location
  sku: {
    name: 'Consumption'
    capacity: 0
  }
  properties: {
    publisherEmail: 'admin@example.com'
    publisherName: 'API Team'
  }
}

resource api 'Microsoft.ApiManagement/service/apis@2023-03-01-preview' = {
  parent: apim
  name: 'claim-status-api'
  properties: {
    displayName: 'Claim Status API'
    path: 'claim-status'
    protocols: [
      'https'
    ]
    serviceUrl: 'https://${containerAppName}.azurecontainerapps.io'
  }
}
