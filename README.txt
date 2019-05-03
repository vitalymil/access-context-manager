
Basic access context manager HTTP service, 
allows to create context resources and limit the access by ip ranges (CIDR) or location (timezone).

Deployment:
    - requires Docker (v18.09.3+) and Docker Compose (v1.23.2+)
    - clone/download the source project
    - run docker-compose up
    - the service listens to HTTP requests on port 8080

Usage Examples (CURLs):
    - create new resources:
        - curl -d '{"name":"ResourceName", "context":"ResourceSecret", "ipRange": ["53.140.20.0/24","64.42.156.0/24"]}' -H "Content-Type: application/json" -X POST http://localhost:8080/resources
        - curl -d '{"name":"A", "context":"Asecret", "location":"Asia/Jerusalem"}' -H "Content-Type: application/json" -X POST http://localhost:8080/resources
    - request resources:
        - curl -i http://localhost:8080/resources/ResourceName?ip=53.140.20.127
