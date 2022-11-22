# Installation / Setup Instructions:

_Note: The creators of this ReadMe file utilized MacOS machines to complete this project. Though the instructions below do make an effort to be as platform agnostic as possible, there may be some differences in the setup process, depending on your operating system, that you will need to troubleshoot through._

&nbsp;

&nbsp;

## Installation of required packages

_NOTE: At times you will be asked to port forward applications in this guide. Follow along exactly as shown in the guides/this ReadMe to avoid issues. You may also benefit from writing down the ports and port forwards associated with each tool._
&nbsp;

&nbsp;

### Kubernetes

_For the purposes of VaaS, we will be setting up a Kubernetes cluster using minikube, which will help set up a single-node Kubernetes cluster on your local machine._

1. Install minikube first by following the instructions at this [link](https://minikube.sigs.k8s.io/docs/start/).

   - **Make sure that you choose the correct installation instructions for your operating system, accounting for the correct architecture, as well.** (For example, M1 or M2 Macs will need to install the arm64 version of minikube, whereas Intel Macs will need to install the x86_64 version.)
   - You can verify that minikube is installed correctly by running the following command:

     ```
     minikube version
     ```

2. Start your minikube cluster by running the following command:

   ```
     minikube start
   ```

   _Note: minikube will continue to run until you stop it with `minikube stop`. This should not be too great a concern as minikube is very lightweight and will not take up too much of your computer's resources, though it is something to be aware of._

3. Verify that your minikube cluster is running by running the following command:

   - ```
     minikube kubectl -- get po -A
     ```
   - This command should not only start your local Kubernetes cluster, but it will also install kubectl, which is the command line tool for Kubernetes. You can verify that kubectl is installed correctly by running the following command:

     ```
     kubectl version --client
     ```

   - Now, you can make your life easier by setting up an alias for kubectl, so that you don't have to type out the entire command every time you want to run a kubectl command. You can do this by running the following command:

     ```
     alias kubectl="minikube kubectl --"
     ```

     _Now, you can run kubectl commands by simply typing `kubectl` instead of `minikube kubectl --`._

4. <font size='2'>Let's take a look at the minikube dashboard: </font>

   - The dashboard is a web-based UI that allows you to see the status of your minikube Kubernetes cluster. You can access the dashboard by running the following command:

     ```
     minikube dashboard
     ```

   - This should open up a new tab in your browser where you can see the dashboard.
   - If you close out of this tab and need to access the dashboard again, simply rerun the command above.

&nbsp;

### Prometheus

_Prometheus is an open-source monitoring system that is used to monitor and alert on various metrics. We will be using Prometheus to monitor the health of our Kubernetes cluster._

1. For clarity, we will be setting up Prometheus in a separate namespace called `monitoring`. To create this namespace, run the following command:

   ```
   kubectl create namespace monitoring
   ```

2. Create a specific folder to house all the monitoring-related tools we will be setting up. This folder can be housed anywhere; however, for the purposes of this guide, we will be creating it in the home directory. To create this folder, run the following command:

   ```
   mkdir ~/monitoring
   ```

3. Next, inside of this folder, we will create a `clusterRole.yaml` file in the root directory and copy the following code into it:

   ```
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: prometheus
   rules:
   - apiGroups: [""]
     resources:
     - nodes
     - nodes/proxy
     - services
     - endpoints
     - pods
     verbs: ["get", "list", "watch"]
   - apiGroups:
     - extensions
     resources:
     - ingresses
     verbs: ["get", "list", "watch"]
   - nonResourceURLs: ["/metrics"]
     verbs: ["get"]
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: prometheus
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: prometheus
   subjects:
   - kind: ServiceAccount
     name: default
     namespace: monitoring
   ```

4. Create the cluster role by running the following command:

   ```
   kubectl create -f clusterRole.yaml
   ```

   _This creates a cluster role that allows Prometheus to access the Kubernetes API server._

5. Next, we will create a config-map.yaml file in the root directory. Copy the following code into it:

   ```
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: prometheus-server-conf
     labels:
       name: prometheus-server-conf
     namespace: monitoring
   data:
     prometheus.rules: |-
       groups:
       - name: devopscube demo alert
         rules:
         - alert: High Pod Memory
           expr: sum(container_memory_usage_bytes) > 1
           for: 1m
           labels:
             severity: slack
           annotations:
             summary: High Memory Usage
     prometheus.yml: |-
       global:
         scrape_interval: 5s
         evaluation_interval: 5s
       rule_files:
         - /etc/prometheus/prometheus.rules
       alerting:
         alertmanagers:
         - scheme: http
           static_configs:
           - targets:
             - "alertmanager.monitoring.svc:9093"

       scrape_configs:
         - job_name: 'node-exporter'
           kubernetes_sd_configs:
             - role: endpoints
           relabel_configs:
           - source_labels: [__meta_kubernetes_endpoints_name]
             regex: 'node-exporter'
             action: keep

         - job_name: 'kubernetes-apiservers'

           kubernetes_sd_configs:
           - role: endpoints
           scheme: https

           tls_config:
             ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
           bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token

           relabel_configs:
           - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
             action: keep
             regex: default;kubernetes;https

         - job_name: 'kubernetes-nodes'

           scheme: https

           tls_config:
             ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
           bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token

           kubernetes_sd_configs:
           - role: node

           relabel_configs:
           - action: labelmap
             regex: __meta_kubernetes_node_label_(.+)
           - target_label: __address__
             replacement: kubernetes.default.svc:443
           - source_labels: [__meta_kubernetes_node_name]
             regex: (.+)
             target_label: __metrics_path__
             replacement: /api/v1/nodes/${1}/proxy/metrics

         - job_name: 'kubernetes-pods'

           kubernetes_sd_configs:
           - role: pod

           relabel_configs:
           - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
             action: keep
             regex: true
           - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
             action: replace
             target_label: __metrics_path__
             regex: (.+)
           - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
             action: replace
             regex: ([^:]+)(?::\d+)?;(\d+)
             replacement: $1:$2
             target_label: __address__
           - action: labelmap
             regex: __meta_kubernetes_pod_label_(.+)
           - source_labels: [__meta_kubernetes_namespace]
             action: replace
             target_label: kubernetes_namespace
           - source_labels: [__meta_kubernetes_pod_name]
             action: replace
             target_label: kubernetes_pod_name

         - job_name: 'kube-state-metrics'
           static_configs:
             - targets: ['kube-state-metrics.kube-system.svc.cluster.local:8080']

         - job_name: 'kubernetes-cadvisor'

           scheme: https

           tls_config:
             ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
           bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token

           kubernetes_sd_configs:
           - role: node

           relabel_configs:
           - action: labelmap
             regex: __meta_kubernetes_node_label_(.+)
           - target_label: __address__
             replacement: kubernetes.default.svc:443
           - source_labels: [__meta_kubernetes_node_name]
             regex: (.+)
             target_label: __metrics_path__
             replacement: /api/v1/nodes/${1}/proxy/metrics/cadvisor

         - job_name: 'kubernetes-service-endpoints'

           kubernetes_sd_configs:
           - role: endpoints

           relabel_configs:
           - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
             action: keep
             regex: true
           - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
             action: replace
             target_label: __scheme__
             regex: (https?)
           - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
             action: replace
             target_label: __metrics_path__
             regex: (.+)
           - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
             action: replace
             target_label: __address__
             regex: ([^:]+)(?::\d+)?;(\d+)
             replacement: $1:$2
           - action: labelmap
             regex: __meta_kubernetes_service_label_(.+)
           - source_labels: [__meta_kubernetes_namespace]
             action: replace
             target_label: kubernetes_namespace
           - source_labels: [__meta_kubernetes_service_name]
             action: replace
             target_label: kubernetes_name
   ```

6. Create the config map by running the following command:

   ```
   kubectl create -f config-map.yaml
   ```

   \*This command creates 2 files within your monitoring directory:  
   `prometheus.yaml` contains a scrape configuration for scraping the Kubernetes API server, kubelets, kube-state-metrics, and cAdvisor.

   - The following scrape jobs are present in the configuration:
     - kubernetes-apiservers: Scrapes all the metrics from the API servers.
     - kubernetes-nodes: Scrapes all the metrics from the nodes.
     - kubernetes-pods: Scrapes all the metrics from the pods. This only works if the pod metadata is annotated with 'prometheus.io/scrape' and 'prometheus.io/port'.
     - kubernetes-cadvisor: Scrapes all the metrics from the cAdvisor.
       - cAdvisor is a daemon that collects resource usage and performance metrics from running containers.
     - kubernetes-service-endpoints: Scrapes all the metrics from the service endpoints.

   `prometheus.rules` contains the rule configuration for alerting.\*

7. Next, we will create a `prometheus-deployment.yaml` file in the root directory and copy the following into it:

   ```
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: prometheus-deployment
     namespace: monitoring
     labels:
       app: prometheus-server
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: prometheus-server
     template:
       metadata:
         labels:
           app: prometheus-server
       spec:
         containers:
           - name: prometheus
             image: prom/prometheus
             args:
               - "--storage.tsdb.retention.time=12h"
               - "--config.file=/etc/prometheus/prometheus.yml"
               - "--storage.tsdb.path=/prometheus/"
             ports:
               - containerPort: 9090
             resources:
               requests:
                 cpu: 500m
                 memory: 500M
               limits:
                 cpu: '1'
                 memory: 1Gi
             volumeMounts:
               - name: prometheus-config-volume
                 mountPath: /etc/prometheus/
               - name: prometheus-storage-volume
                 mountPath: /prometheus/
         volumes:
           - name: prometheus-config-volume
             configMap:
               defaultMode: 420
               name: prometheus-server-conf

           - name: prometheus-storage-volume
             emptyDir: {}
   ```

8. Create the deployment by running the following command:

   ```
   kubectl create -f prometheus-deployment.yaml
   ```

   _This command creates a deployment for Prometheus. The deployment creates a pod with a Prometheus container. The container mounts the config map as a volume and uses the configuration file to scrape the metrics from the pods._

   _You can check the created deployment using:_ `kubectl get deployments --namespace=monitoring`
   _This should show the 'prometheus-deployment' with a READY status of '0/1'_

9. Next, we will connect to the Prometheus dashboard via port forwarding. First, we will need to get the Prometheus pod's name by running the following command:

   ```
   kubectl get pods --namespace=monitoring
   ```

   _This command lists all the pods in the monitoring namespace in the following format:_

   ```
   ->  kubectl get pods --namespace=monitoring
   NAME                                   READY   STATUS    RESTARTS   AGE
   prometheus-deployment-5f4b8b7b-5x7xg   1/1     Running   0          2m
   ```

   _Copy the entire Prometheus pod name_

10. Next, we will port forward the Prometheus pod to the local machine by running the following command:

    ```
    kubectl port-forward prometheus-deployment-5f4b8b7b-5x7xg 8080:9090 --namespace=monitoring
    ```

    _This command forwards the Prometheus pod to the local machine on port 8080._

11. Open a browser and navigate to `http://localhost:8080`. You should see the Prometheus dashboard.

### Kube State Metrics

_The kube-state-metrics component is a service that listens to the Kubernetes API server and generates metrics about the state of the objects._

1. For this part, we will be following along with this [guide](https://devopscube.com/setup-kube-state-metrics/). **Please follow the guide through 'Step 3'.**

   _The author recommends cloning the github repo. Clone this into the 'monitoring' directory we performed the Prometheus setup in to help keep everything in one place._

   _Open a terminal in the root 'Monitoring' directory to execute the commands in the guide._

### Alertmanager

_Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email._

1. As with Kube State Metrics, we will again be following along with this [guide](https://devopscube.com/alert-manager-kubernetes-guide/). **Please follow the guide through the creation of the service using kubectl.**

   _Again, clone the github repo they provide into the 'monitoring' directory._

   _For this part, you will need to open a terminal in the actual 'alertmanager' directory._

   _Given that they have already provided the .yaml files in the repo, you can simply skip to the step using "kubectl create -f <file-name>" for each file._

### Grafana

_Grafana is an open source visualization and analytics software. It allows you to query, visualize, alert on and understand your metrics no matter where they are stored. In our case, we take data from Prometheus and visualize it in Grafana._

1. As with the above 2 tools, we will be following along with this [guide](https://devopscube.com/setup-grafana-kubernetes/).

   _Again, clone the github repo they provide into the 'monitoring' directory._

   **Please note: When logging into Grafana while following along with the guide, you will be prompted to enter a new password. YOU MUST SAVE THIS PASSWORD TO LATER BE ABLE TO ACCESS GRAFANA.**

   **Please make sure to port forward Grafana towards the end of the 'Deploy Grafana on Kubernetes' section. You will need to get the Grafana pod's name by running the following command:**

   ```
     kubectl get pods --all-namespaces
   ```

### Node Exporter

_The Node Exporter is a Prometheus exporter that collects hardware and OS metrics._

1. For this part, we will be following along with this [guide](https://devopscube.com/node-exporter-kubernetes/).

   _Again, clone the github repo they provide into the 'monitoring' directory._

   _Given that they have already provided the .yaml files in the repo, you can simply skip to the step using "kubectl create -f <file-name>" for each file._

### OpenFaaS

_OpenFaaS is a serverless framework for Kubernetes. It allows you to deploy functions to Kubernetes without having to worry about the underlying infrastructure._

1. First, we will install Arkade, a CLI tool that allows us to install OpenFaaS with a single command. To install Arkade, run the following command:

   ```
   arkade get arkade
   ```

2. Next, we will install OpenFaaS using Arkade. Run the following command:

   ```
   arkade install openfaas
   ```

3. Next, we will install the OpenFaaS CLI. Run the following command:

   ```
   arkade get faas-cli
   ```

4. Next, we will port forward the gateway to the local machine. _Run the following 2 commands:_

   ```
   kubectl rollout status -n openfaas deploy/gateway
   ```

   _Followed by:_

   ```
   kubectl port-forward -n openfaas svc/gateway 8080:8080 &
   ```

5. Now, we log into the OpenFaaS dashboard. Run the following commands in a new Terminal window/tab _(copy and paste the entire block)_:

   ```
   PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
   echo -n $PASSWORD | faas-cli login --username admin --password-stdin
   ```

   Now our OpenFaaS cluster should be ready to use!

   _To check, navigate to http://localhost:8080_

   _You will be prompted to input a username and password. You will not have the username at this time because the CLI automatically generated a random password with a secret and stored it away._

   - _To access this password, go to the terminal and enter `echo $PASSWORD`_
   - _This will print your password on the next line._

### Finishing Tools Setup

_For the port forwarding portions, make sure to forward ports to/from the exact ones shown._

1. Now we need to port forward the Prometheus deployment with the following command:

   _You may need to get the Prometheus pod's name via `kubectl get pods --namespace=monitoring`_

   ```
   kubectl port-forward prometheus-deployment-5f4b8b7b-5x7xg 30000:9090 --namespace=monitoring
   ```

   _This command forwards the Prometheus pod to the local machine on port 30000._

2. Next, we port forward Kube State Metrics:

   _You may need to get the Kube State Metrics pod's name via `kubectl get pods --namespace=monitoring`_

   ```
   kubectl port-forward kube-state-metrics-5f4b8b7b-5x7xg 30135:8080 --namespace=monitoring
   ```

   _This command forwards the Kube State Metrics pod to the local machine on port 30135._

3. Next, we will download a standalone package of Grafana and install this. Download the package from [here](https://grafana.com/grafana/download). **Make sure to download the version that matches your OS.**

   _If you're on MacOS, you can simply click the curl link and it will start the download._
   _If you're on Linux, you can simply click the wget link and it will start the download._

4. Once downloaded, make sure to unzip the package.

5. Next, we will take the Grafana binary and move its contents to the Grafana folder in your user's root directory (the directory containing your 'Monitoring' folder)

6. Navigate to ~/grafana/conf and create a copy of the default.ini file. Rename this copy to custom.ini.

7. Open the custom.ini file and change the following lines:

   ```
   allow_embedding = true
   ```

   _You can CMD+F or CTRL+F to search for 'allow_embedding'._

   ```
   [auth.anonymous]
   enabled = true
   ```

   _You can CMD+F or CTRL+F to search for 'auth.anonymous'._

   ```
   http_port = 3001
   ```

   _You can CMD+F or CTRL+F to search for 'http_port'._

&nbsp;

**Congratulations! You have now finished setting up the tools needed for this project!**

&nbsp;

## Part 2: Setting up VaaS

1. Clone down the VaaS repo onto your machine. You can locate this clone wherever you like.

   ```
    git clone https://github.com/oslabs-beta/VaaS.git
   ```

2. Now, go into the VaaS project folder and install the dependencies. _At this time, you will need to use the specific command below due to issues with some packages being deprecated._

   ```
   npm install --legacy-peer-deps
   ```

3. Create a .env file in the root of VaaS. You can literally name this file '.env'

4. Within the .env file, paste the following:

   ```
   JWT_ACCESS_SECRET=hello
   JWT_REFRESH_SECRET=hello
   JWT_EXP=400000000
   JWT_GRACE=4000000000

   MONGO_URL=@
   MONGO_PORT=
   MONGO_USERNAME=
   MONGO_PASSWORD=
   MONGO_COLLECTION=

   EXPRESS_PORT=3020
   EXPRESS_CONSOLE_LOG=on
   ```

5. You should now get your mongoDB set up. You can either use a cloud DB or localhost; however, make sure to add the DB URI to the 'URL' field in the .env file. Fill out the rest of the DB fields with the appropriate information.

   **Do note that you should only paste whatever comes after the '@' symbol in the URI.**

   _If you're using a cloud DB, you can simply copy the connection string and paste it into the .env file._

   _If you're using localhost, you will need to install MongoDB and create a database._

6. You should now be able to run the project. Run the following command:

   ```
   npm run dev:server
   ```

   OR

   ```
   yarn dev:server
   ```
