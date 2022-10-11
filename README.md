# VaaS
VaaS
Visualization tool for OpenFaas

NOTE: The initial instructions below are meant to get you in and testing the development version of VaaS as quickly as possible - RZ

Before firing up and installing VaaS, please make sure to have...
1) your Kuberenetes clusters set up and ports open
2) created a Prometheus deployment - with ports properly forwarded: https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/
3) Set up Kube State metrics: https://devopscube.com/setup-kube-state-metrics/
4) Set up node exporter; https://devopscube.com/node-exporter-kubernetes/

Skip to appropriate section - 

<b>Prerequisites</b>
( OPTIONAL ) Create a containerized image of your application
1) Set up a Kubernetes cluster https://kubernetes.io/docs/tasks/tools/ <br />
  a) Setting up Kind to run local cluster: https://kind.sigs.k8s.io/docs/user/quick-start/ <br />
  b) Setting up minikube to run local cluster: https://minikube.sigs.k8s.io/docs/start/ <br /> 
  c) Install kubectl <br />
2) Deploying Prometheus onto you clusters: https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/<br />
  a) Follow the guide to deploy and port forward properly - keep track of the monitoring pods and which port you're forwarding it to on localhost <br />
3) Deploy OpenFaaS to Kubernetes: https://goncalo-a-oliveira.medium.com/setting-up-openfaas-with-minikube-28ed2f78dd1b <br />
  a) Again keep track of your password, take special note of the command and how to temporarily store it as a temporary environment variable
  b) Note: If you close the terminal/command prompt you will have to refetch and reassign the PASSWORD before you can use the OpenFaaS CLI to sign in

If you want to set up and play with multiple clusters, make sure to have kind (requires Docker) and minikube up and running
1) Navigating and moving between clusters <br />
    i) To see all clusters - take note of the cluster names <br />
    ```kubectl config view``` <br />
    ii) To see current cluster <br />
    ```kubectl config current-context``` <br />
    iii) To switch into the cluster you want to configure/port forward <br />
    ```kubectl config use-context [clusterName]``` <br />
    iv) From here follow the steps under the "Using Kubectl port forwarding" - in link found in Step 2 of the pre-requisites <br />

Documentation on best practice utilizing configuration files (recommended read): 
https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/



<b>Installation</b>

1.  Clone this repository onto your local machine

```sh
 git clone https://github.com/oslabs-beta/VaaS.git
```

2.  Install dependencies

```sh
npm install or npm install --legacy-peer-deps
```

3. Set up .env file (create in root of VaaS folder)

```sh
JWT_ACCESS_SECRET=hello
JWT_REFRESH_SECRET=hello
JWT_EXP=400000000
JWT_GRACE=4000000000

MONGO_URL=@
MONGO_PORT=
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_COLLECTION=

EXPRESS_PORT=3000
EXPRESS_CONSOLE_LOG=on
```

4.  Run the app with

```sh
npm run dev
```
Set up order:
You will need to port-forward Promethesus and openFaaS
Grafana will need to be changed to port 3001 in customs.ini, but that will be in the documentation as well.

https://www.docker.com/products/docker-desktop/
https://minikube.sigs.k8s.io/docs/start/
https://devopscube.com/setup-kube-state-metrics/
https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/
https://devopscube.com/node-exporter-kubernetes/
https://goncalo-a-oliveira.medium.com/setting-up-openfaas-with-minikube-28ed2f78dd1b
https://grafana.com/docs/grafana/latest/