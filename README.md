# Noom

zoom clone using nodejs, webrtc and websockets.

```
      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s/namespace.yaml
          kubectl apply -f k8s/configmap.yaml
          kubectl apply -f k8s/secret.yaml
          kubectl apply -f k8s/deployment.yaml
          kubectl apply -f k8s/service.yaml
          kubectl apply -f k8s/ingress.yaml
          kubectl apply -f k8s/hpa.yaml
```




# hpa scale
```
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: chat-server-app-hpa
  namespace: chat
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: chat-server-app
  minReplicas: 2
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70

```