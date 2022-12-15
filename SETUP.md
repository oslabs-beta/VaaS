# Installation / Setup Instructions:

_Note: The creators of this ReadMe file utilized MacOS machines to complete this project. Though the instructions below do make an effort to be as platform agnostic as possible, there may be some differences in the setup process, depending on your operating system, that you will need to troubleshoot through._

<br/>


## Installation of required packages

_NOTE: At times you will be asked to port forward applications in this guide. Follow along exactly as shown in this guide to avoid issues. You may also benefit from writing down the ports and port forwards associated with each tool._

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


<br/>

### Kube-Prometheus Stack
_The Kube-Prometheus Stack is a collection of applications that are intended for monitoring of Kubernetes clusters. Here is the relevant documentation: &nbsp;[link](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/README.md)._

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

<br/>

### Kube-View
_Kube-View is a web-based UI that allows you to view the status of your Kubernetes cluster. Here is the relevant documentation: &nbsp;[link](https://artifacthub.io/packages/helm/kubeview/kubeview?modal=install)._

1. First, add the relevant repo to Helm by running the following command:

   ```
   helm repo add kubeview https://benc-uk.github.io/kubeview/charts
   ```

2. Now we can install the actual Helm chart for Kube-View: 

    ```
    helm install my-kubeview kubeview/kubeview --version 0.1.31 --namespace=monitoring
    ```

<br/>

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
   kubectl port-forward -n openfaas svc/gateway 30001:8080
   export OPENFAAS_URL=http://127.0.0.1:30001/
   ```

5. Now, we log into the OpenFaaS dashboard. Run the following commands in a new Terminal window/tab _(copy and paste the entire block)_:

   ```
   PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
   echo $PASSWORD
   echo -n $PASSWORD | faas-cli login --username admin --password-stdin 
   ```

   Now our OpenFaaS cluster should be ready to use!

   _To check, navigate to http://localhost:8080_

   _You may be prompted to input a username and password. You will not have the password at this time because the CLI automatically generated a random password with a secret and stored it away._

   - _To access this password, go to the terminal and enter `echo $PASSWORD`_
   - _This will print your password on the next line._
   - _That being said, the 3 commands in the codeblock above should automatically pull and enter your login credentials for you._

<br/>

### Port-Forwarding
_In order to access many of the applications we just installed on our Kubernetes cluster, we will need to port-forward them to our local machine. This will allow us to access them via our browser._

**These steps need to be repeated each time you restart your device or close out of your terminal.**

1. Ensure that Minikube is running by executing the following command: &nbsp;`minikube status` 
   - If it is not running, please start it via &nbsp;`minikube start`

2. Port forward Prometheus:
   1. First, get the name of the Prometheus pod by running the following command:

      ```
      kubectl get pods -n monitoring
      ```
   2. Next, execute the following command, making sure to replace `podname` with your pod's name:
      
      ```
      kubectl port-forward podname 30000:9090 -n monitoring
      ```
3. Port forward Kube State Metrics:
   1. Because we are simply forwarding a service, this step is much simpler. Simply run:
      ```
      kubectl port-forward svc/kube-state-metrics 30135:8080 -n monitoring
      ```

4. Port forward Alert Manager:
   1. Fort this step, we will again need to get the name of the Alert Manager pod. Run the following command:
      ```
      kubectl get pods -n monitoring
      ```
    2. Next, execute the following command, making sure to replace `podname` with your pod's name:
      
        ```
        kubectl port-forward podname 31000:9093 -n monitoring
        ```

5. Port forward Grafana:
   1. To port forward Grafana, we will need to get the name of the Grafana pod. Run the following command:
      ```
      kubectl get pods -n monitoring
      ```
    2. Next, execute the following command, making sure to replace `podname` with your pod's name:
      
        ```
        kubectl port-forward podname 3001:3000 -n monitoring
        ```

6. Port forward OpenFaaS:
   1. The first step is to simply forward the openfaas gateway service. Run the following command:
   
      ```
      kubectl port-forward svc/gateway 30001:8080 -n openfaas
      ```

    2. Next, we need to export the OpenFaaS URL. Run the following command:
   
        ```
        export OPENFAAS_URL=http://127.0.0.1:30001/
        ```

    3. Finally, we need to log into the OpenFaaS dashboard. Run the following commands in a new Terminal window/tab _(copy and paste the entire block)_:

        ```
        PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
        echo $PASSWORD
        echo -n $PASSWORD | faas-cli login --username admin --password-stdin
        ```

<br/>

# Part 2: Setting up VaaS

1. Clone down the VaaS repo onto your machine. You can locate this clone wherever you like.

   ```
    git clone https://github.com/oslabs-beta/VaaS.git
   ```

2. Now, go into the VaaS project folder and install the dependencies. _At this time, you will need to use the specific command below due to issues with some packages being deprecated._

   ```
   npm install --legacy-peer-deps
   ```

3. Create a .env file in the root of VaaS. You can literally name this file '.env'

4. Within the .env file, these are fields you would need to have. Variables prefixed with VITE are utilized on the frontend only. Although, they are not neccessary to set the project up, they are needed to test/achieve the full functionality of VaaS:

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

   VITE_COMPUTING_CLUSTER=
   VITE_COMPUTING_NODES=
   VITE_COMPUTING_WORKLOADS=
   VITE_COMPUTING_PODS=

   VITE_NETWORKING_CLUSTER=
   VITE_NETWORKING_NAMESPACES=
   VITE_NETWORKING_WORKLOADS=
   VITE_NETWORKING_PODS=

   VITE_ISOLATED_CLUSTER=
   VITE_ISOLATED_NODES=
   VITE_ISOLATED_WORKLOADS=
   VITE_ISOLATED_PODS=

   VITE_OVERVIEW_KUBELET=
   VITE_OVERVIEW_USENODE=
   VITE_OVERVIEW_USECLUSTER=
   VITE_OVERVIEW_NODEEXPORTER=

   VITE_CORE_APISERVER=
   VITE_CORE_ETCD=
   VITE_CORE_SCHEDULER=
   VITE_CORE_CONTROLMANAGER=
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

<br/>


### Congratulations, you have successfully set up VaaS on Minikube!

<br/>

## Next steps:
**At this stage, we HIGHLY recommend that you attempt to deploy a similar monitoring cluster on the web using a cloud provider such as AWS, GCS, or Azure.**

   - This will allow your team to have a more robust and scalable monitoring cluster that can be accessed from anywhere, negating the need for each team member to have a local cluster running.

In order to deploy such a cluster, we recommend using the Minikube instructions above as a guide. 
  - *We also recommend reading more about External Load Balancers, as they will be necessary to access your cluster from the web.*
  - *If you find yourself lost, please feel free to reach out to the VaaS team for help!*
