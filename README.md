# [VaaS](https://vaas.dev/) 
VaaS <br>
Visualization tool for OpenFaas

NOTE: The initial instructions below are meant to get you in and testing the development version of VaaS on your local machine as quickly as possible

Before firing up and installing VaaS, please make sure to have...
1) your Kuberenetes clusters set up and ports open
2) create a Prometheus deployment - with ports properly forwarded: https://devopscube.com/setup-prometheus-monitoring-on-kubernetes/
<br> a) ```Terminal: kubectl get pods --namespace=monitoring```
<br> b) ```kubectl port-forward <prometheus-deployment name> 30000:9090 -n monitoring```
3) Set up Kube State metrics: https://devopscube.com/setup-kube-state-metrics/
 <br> a) ```kubectl port-forward svc/kube-state-metrics 30135:8080 -n kube-system```
4) Set up node exporter; https://devopscube.com/node-exporter-kubernetes/
5) Install Grafana through standalone macOS binaries; https://grafana.com/docs/grafana/latest/setup-grafana/installation/mac/ <br />
  a) if on macOS, enable view hidden files and navigate to /usr/local/etc/grafana/; https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/<br />
  b) make a copy of grafana.ini and rename the copy to custom.ini
  c) in both custom.ini AND grafana.ini, modify the following settings:
    DISCLAIMER: remember to remove the semicolon in front of the setting to enable it
    1. ```allow_embedding = true``` <br>
    2. [auth.anonymous]
       ```sh
       enabled = true
       org_name = Main Org.
       org_role = Viewer 
          ```
    3. ```http_port = 3001``` <br />

6) Download CLI tools with arkade; https://github.com/alexellis/arkade
<br>a) ```curl -sLS https://get.arkade.dev | sh ```
<br>b) complete section, "Download CLI tools with arkade" in github link

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

EXPRESS_PORT=3020
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
https://goncalo-a-oliveira.medium.com/







<b>Authors <b>
- Jimmy Lim [@Radizorit](https://github.com/Radizorit) | [Linkedin](https://www.linkedin.com/in/jimmy-l-625ba98b/)
- Alex Kaneps [@AlexKaneps](https://github.com/AlexKaneps) | [Linkedin](https://www.linkedin.com/in/alex-kaneps/)
- James Chan [@j-chany](https://github.com/j-chany) | [Linkedin](https://www.linkedin.com/in/james-c-694018b5/)
- Vu Duong [@vduong021](https://github.com/vduong021) | [Linkedin](https://www.linkedin.com/in/vu-duong/)
- Matthew McGowan [@mcmcgowan](https://github.com/mcmcgowan) | [Linkedin](https://www.linkedin.com/in/matthewcharlesmcgowan/)
- Murad Alqadi [@murad-alqadi](https://github.com/murad-alqadi) | [Linkedin](https://www.linkedin.com/in/muradmd/)
- Kevin Le [@xkevinle](https://github.com/xkevinle) | [Linkedin](https://www.linkedin.com/in/xkevinle/)
- Richard Zhang [@rich9029](https://github.com/rich9029) | [Linkedin](https://www.linkedin.com/in/dickzhang/)
- Irvin Le [@irvinie](https://github.com/irvinie) | [Linkedin](https://www.linkedin.com/in/irvinie/)

<b>Show your support  <br>
Give a ⭐️ if this project helped you!