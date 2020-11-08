# demo-zero-downtime

Demo zero downtime with k8s

## Thông tin ứng dụng

Docker image:

- Version 1: `minhpq331/demo-zero-downtime:v1.0`
- Version 2: `minhpq331/demo-zero-downtime:v2.0`

Biến môi trường:

- `PORT=3000`

Application sẽ chạy trên cổng `3000`

## Thực hành 1: Khởi chạy application với version 1.0

- Tạo 1 file `deployment.yaml` với mẫu từ các bài trước để triển khai ứng dụng với image được cung cấp ở trên. Chọn replica = 2
- Tạo 1 file `service.yaml` với mẫu từ các bài trước để expose ứng dụng dạng `ClusterIP`
- Tạo 1 file `ingress.yaml` với mẫu từ bài trước để gọi tới ứng dụng bằng domain

## Thực hành 2: Test rolling update 

- Tải tool load test: [https://github.com/fortio/fortio](https://github.com/fortio/fortio)
- Sửa file `depbằngloyment.yaml` và thêm cấu hình sau vào phần `spec` của deployment

```yaml
spec:
  strategy:
    type: RollingUpdate        # Strategy name
    rollingUpdate:
      maxSurge: 1              # Number of over-scheduled pod
      maxUnavailable: 0  
```

- Sửa image tag thành version 2: `v2.0`
- Apply thay đổi bằng `kubectl -n <ns> apply -f deployment.yaml`
- Chạy câu lệnh sau để load test: 

```yaml
fortio load -qps 100 -t 60s "http://<domain>:30080/"
```

- Kiểm tra kết quả xem bao nhiêu request failed 

## Thực hành 3: Cấu hình healthcheck và PreStop hook

- Sửa lại file `deployment.yaml` và thêm cấu hình sau:

```yaml
containers:
  - image: minhpq331/demo-zero-downtime:v1.0

    livenessProbe:
      httpGet:
        path: /live
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 5

    readinessProbe:
      httpGet:
        path: /ready
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 5

    lifecycle:
      preStop:
        exec:
          command: ["/bin/sh", "-c", "sleep 10"]
```

- Sửa lại image ứng dụng từ version `v2.0` thành `v1.0`
- Apply thay đổi bằng `kubectl -n <ns> apply -f deployment.yaml`
- Chạy câu lệnh sau để load test: 

```yaml
fortio load -qps 100 -t 60s "http://<domain>:30080/"
```

- Kiểm tra kết quả xem bao nhiêu request failed 