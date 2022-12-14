# Installation / Setup Instructions:

_Note: The creators of this ReadMe file utilized MacOS machines to complete this project. Though the instructions below do make an effort to be as platform agnostic as possible, there may be some differences in the setup process, depending on your operating system, that you will need to troubleshoot through._

<br/>


## Installation of required packages

_NOTE: At times you will be asked to port forward applications in this guide. Follow along exactly as shown in the guides/this ReadMe to avoid issues. You may also benefit from writing down the ports and port forwards associated with each tool._

<br/>

### Docker

_For the purposes of this guide, we recommend setting up Docker Desktop to install Docker and provide you with an avenue to manage your containers via an intuitive GUI._

1. Download Docker Desktop from this [link](https://www.docker.com/products/docker-desktop/).

   - **Make sure that you choose the correct variant for your operating system and processor.**

<br/>

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

   ```
   minikube kubectl -- get po -A
   ```

   - This command should not only start your local Kubernetes cluster, but it will also install kubectl, which is the command line tool for Kubernetes. You can verify that kubectl is installed correctly by running the following command:

   ```
   kubectl version --client
   ```

4. <font size='2'>Let's take a look at the minikube dashboard: </font>

   - The dashboard is a web-based UI that allows you to see the status of your minikube Kubernetes cluster. You can access the dashboard by running the following command:

   ```
   minikube dashboard
   ```

   - This should open up a new tab in your browser where you can see the dashboard.
   - If you close out of this tab and need to access the dashboard again, simply rerun the command above.

<br/>

### Helm

_Helm is a package manager for Kubernetes that allows you to easily install and manage applications on your Kubernetes cluster. We will be using Helm to install and manage our Kube-Prometheus Stack, which contains applications intended for monitoring of Kubernetes clusters._

1. Install Helm by following the instructions at this [link](https://helm.sh/docs/intro/quickstart/).


### Kube-Prometheus Stack
Once you have installed Helm, we will proceed with installing the Kube-Prometheus Stack. 

1. Begin by creating the monitoring namespace by running the following command:

   ```
   kubectl create namespace monitoring
   ```

2. Now, we will add the prometheus-community repo to Helm by running the following command:

   ```
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   ```

   - Ensure the repo is up-to-date by executing &nbsp;`helm repo update`
  
3. Now we can install the actual Helm chart for the Kube-Prometheus Stack:

   ```
   helm install kubepromstack prometheus-community/kube-prometheus-stack --namespace=monitoring
   ```

### Kube-View
Now we will install the Kube-View Chart. Here is a [lin]

1. First, add the relevant repo to Helm by running the following command:

   ```
   helm repo add kubeview https://benc-uk.github.io/kubeview/charts
   ```

2. Now we can install the actual Helm chart for Kube-View: 

    ```
    helm install my-kubeview kubeview/kubeview --version 0.1.31 --namespace=monitoring
    ```
