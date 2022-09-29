# VaaS
VaaS
Visualization tool for OpenFaas

NOTE: The initial instructions below are meant to get you in and testing the development version of VaaS as quickly as possible - RZ

Before firing up and installing VaaS, please make sure to have...
1) your Kuberenetes clusters set up and ports open
2) created a Prometheus deployment - with ports properly forwarded: https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/

Skip to appropriate section - 

<b>Prerequisites</b>
( OPTIONAL ) Create a containerized image of your application
1) Set up a Kubernetes cluster https://kubernetes.io/docs/tasks/tools/
  a) Setting up Kind to run local cluster: https://kind.sigs.k8s.io/docs/user/quick-start/ <br />
  b) Setting up minikube to run local cluster: https://minikube.sigs.k8s.io/docs/start/ <br /> 
  c) Install kubectl <br />
2) Deploying Prometheus onto you clusters: https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/
  a) Follow the guide to deploy and port forward properly - keep track of monitoring pod and which port you're forwarding it to on localhost
3) Deploy OpenFaaS to Kubernetes

If you want to set up and play with multiple clusters, make sure to have kind (reqiures Docker) and minikube up and running
1) Navigating and moving between clusters
    i) To see all clusters - take note of the cluster names
    ```kubectl config view```
    ii) To see current cluster
    ```kubectl config current-context```
    iii) To switch into the cluster you want to configure/port forward 
    ```kubectl config use-context [clusterName]```
    iv) From here follow the steps under the "Using Kubectl port forwarding" - in link found in Step 2 of the pre-requisites
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

3.  Run the app with

```sh
npm run dev
```
