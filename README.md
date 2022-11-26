# Installation / Setup Instructions:

_Note: The creators of this ReadMe file utilized MacOS machines to complete this project. Though the instructions below do make an effort to be as platform agnostic as possible, there may be some differences in the setup process, depending on your operating system, that you will need to troubleshoot through._

&nbsp;

&nbsp;


## Installation of required packages

_NOTE: At times you will be asked to port forward applications in this guide. Follow along exactly as shown in the guides/this ReadMe to avoid issues. You may also benefit from writing down the ports and port forwards associated with each tool._
&nbsp;

&nbsp;


### Docker

_For the purposes of this guide, we recommend setting up Docker Desktop to install Docker and provide you with an avenue to manage your containers via an intuitive GUI._

1. Download Docker Desktop from this [link](https://www.docker.com/products/docker-desktop/).

   - **Make sure that you choose the correct variant for your operating system and processor.**


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

&nbsp;


### Prometheus

_Prometheus is an open-source monitoring system that is used to monitor and alert on various metrics. We will be using Prometheus to monitor the health of our Kubernetes cluster._

1. For clarity, we will be setting up Prometheus in a separate namespace called `monitoring`. To create this namespace, run the following command:

    ```
    kubectl create namespace monitoring
    ```

2. Download the .zip file provided [here](https://drive.google.com/file/d/1TRwu_VUvNTp_nWYngA0W0svGO-AvM5s8/view?usp=share_link) and unzip it in an easy to access location. I recommend creating a new folder called 'monitoring' in your home directory and unzipping the file into it. You can use the command below to create the monitoring folder:

    ```
    mkdir ~/monitoring
    ```

3. Next, navigate into the "kubernetes-prometheus" folder within your monitoring folder via terminal. If you followed the instructions above, you can do this by running the following command:

    ```
    cd ~/monitoring/
    ```

4. Now, run the following command:

    ```
    kubectl apply -f kubernetes-prometheus/
    ```

      _This command will create a config map and a deployment for Prometheus. The config map will be used to configure Prometheus, and the deployment will be used to deploy Prometheus to your Kubernetes cluster. The deployment creates a pod with a Prometheus container. The container mounts the config map as a volume and uses the configuration file to scrape the metrics from the pods._

      _You can check the created deployment using:_ `kubectl get deployments --namespace=monitoring`
      _This should print the 'prometheus-deployment' in a new line_

5. Next, we will connect to the Prometheus dashboard via port forwarding. First, we will need to get the Prometheus pod's name by running the following command:

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

6. Next, we will port forward the Prometheus pod to the local machine by running the following command, replacing the pod name with the name you copied in the previous step:

    ```
    kubectl port-forward prometheus-deployment-5f4b8b7b-5x7xg 30000:9090 -n monitoring
    ```

  _This command will forward the Prometheus pod's port 9090 to the local machine's port 8080._

7. Open a browser and navigate to `http://localhost:30000`. You should see the Prometheus dashboard.

   *Some useful notes about target ports versus node ports:*
      - *Target ports are the ports that are exposed by the pods in the Kubernetes cluster. These ports are used to expose the pods to other pods within the cluster. In the above case, the target port is 9090.*
      - *Node ports are the ports that are exposed by the nodes in the Kubernetes cluster. These ports are used to expose the pods to the outside world. In the above case, the node port is 8080.*


### Kube State Metrics

_The kube-state-metrics component is a service that listens to the Kubernetes API server and generates metrics about the state of the objects._

1. For this part, we will, in a new terminal window/tab, navigate to the monitoring folder. If you followed the instructions above, you can do this by running the following command:

    ```
    cd ~/monitoring/
    ```

2. Now, we will go ahead and create all the necessary objects by pointing to the cloned directory. Execute the following command: 

    ```
    kubectl apply -f kube-state-metrics/
    ```

    *Verify that the deployment was successful via: `kubectl get deployments kube-state-metrics -n kube-system`*

    *You can pull Prometheus metrics from the kube-state-metrics service by accessing the /metrics endpoint.*

3. Now, we will port forward the kube-state-metrics pod to the local machine by running the following command:

    ```
    kubectl port-forward svc/kube-state-metrics 30135:8080 -n kube-system
    ```

### Alertmanager **Tenatively may not be used OR may require tweaking**

_Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email._

1. Open a new terminal window/tab and navigate to the monitoring folder. If you followed the instructions above, you can do this by running the following command:

  ```
  cd ~/monitoring/
  ```

2. Now, we will go ahead and create all the necessary objects by pointing to the cloned directory. Execute the following command: 

  ```
  kubectl apply -f kubernetes-alert-manager/
  ```

  *Verify that the deployment was successful via:* `kubectl get deployments alertmanager -n monitoring`

3. Now, we will port forward alertmanager to the local machine:

  - First, obtain the pod name for the alertmanager pod via: `kubectl get pods -n monitoring`
  - Next, execute the following command, replacing the pod name with the name you copied in the previous step:

    ```
    kubectl port-forward alertmanager-6ffb68c68d-8xczb 31000:9093 --namespace=monitoring
    ```

4. To access the alertmanager dashboard, navigate to `http://localhost:31000` in your browser.


### Grafana

_Grafana is an open source visualization and analytics software. It allows you to query, visualize, alert on and understand your metrics no matter where they are stored. In our case, we take data from Prometheus and visualize it in Grafana._

*We will also be installing a standalone Grafana instance to visualize the metrics from the Node Exporter as well as configure a custom .ini for our purposes*

1. Next, navigate to the Grafana folder in the monitoring directory. If you followed the instructions above, you can do this by running the following command:

    ```
    cd ~/monitoring/grafana/
    ```

2. Kill all processes on port 3001 by running the following command:

   ```
   kill -9 $(lsof -ti:3001)
   ```

3. Run the following command to start Grafana:

    ```
    ./bin/grafana-server web
    ```

4. Open a browser and navigate to `http://localhost:3001`. You should see the Grafana login page.

5. Login with the default credentials where username is `admin` and password is `admin`.

6. This will bring you to the Grafana home page. On the left-hand side, hover over the gears icon at the bottom and click on "Data sources". See the image below for reference.
   
    ![Grafana Settings](/setup-images/grafana-settings.png)

7. Select "Prometheus" as a data source and, on the following screen, add "http:localhost:30000" as the URL. Scroll to the bottom and click "Save & Test".

8. Now, we will import a Kubernetes dashboard. On the home page, hover over the four squares icon on the left and click on "Import". See the image below for reference.
   
    ![Grafana Import](/setup-images/grafana-dashboard.png)

9. In the "Import via grafana.com dashboard URL or ID" field, enter "8588" and click "Load".

10.  On the following screen, ensure you update your data source to reflect your Prometheus data source. Click "Import" to import the dashboard. See the image below for reference.

      ![Grafana Import](/setup-images/grafana-data-source.png)


### Node Exporter

_The Node Exporter is a Prometheus exporter that collects hardware and OS metrics._

1. Again, navigate into the monitoring folder in terminal. If you followed the instructions above, you can do this by running the following command:

    ```
    cd ~/monitoring/
    ```

2. From here, we will create the necessary objects by pointing to the cloned directory. Execute the following command: 

    ```
    kubectl apply -f kubernetes-node-exporter/
    ```

    *Verify that the deployment was successful via:* `kubectl get deployments node-exporter -n monitoring`

3. As with the Grafana setup, go to your Grafana dashboard and import a new dashboard. This time, enter `1860` in the "Import via grafana.com" field and click on "Load".

    *Ensure you select the correct Prometheus data source.*

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


# Troubleshooting:

**I am getting errors when running Grafana's grafana-server script**
   - Kill any processes running on Port 3001 and retry the script.

**No scripts are executing on the VaaS login page**
   - Ensure that you do not have any AdBlock/UBlock extensions running in your browser. These can interfere with Vite's script execution.

**Attempting to load visualizations on the dashboard page results in an error**
   - Ensure that you do not have any duplicate services, deployments, or pods running. If you do, delete them and try again.
  
 

# Credits:

[Bibin Wilson](https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/)