import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from 'vitest';
import { AddClusterType } from '../client/Interfaces';
import request from 'supertest';
import app from './test-api';
import { User, Cluster } from 'src/server/models';

const testCluster1: AddClusterType = {
  url: 'cluster.test',
  k8_port: '9090',
  faas_port: '9090',
  faas_username: 'admin',
  faas_password: 'password',
  name: 'test cluster 1',
  description: 'test cluster 1',
  faas_url: 'test',
  grafana_url: 'test',
  kubeview_url: 'test',
  cost_url: 'test',
  cost_port: '9090',
};

const testCluster2: AddClusterType = {
  url: 'cluster.test',
  k8_port: '9090',
  faas_port: '9090',
  faas_username: 'admin',
  faas_password: 'password',
  name: 'test cluster 2',
  description: 'test cluster 2',
  faas_url: 'test',
  grafana_url: 'test',
  kubeview_url: 'test',
  cost_url: 'test',
  cost_port: '9090',
};

const badCluster = {
  k8_port: '9090',
  faas_port: '9090',
  faas_username: 'admin',
  faas_password: 'password',
  name: 'test cluster bad',
  description: 'test cluster bad',
  faas_url: 'test',
  grafana_url: 'test',
  kubeview_url: 'test',
  cost_url: 'test',
  cost_port: '9090',
};

const testUser = {
  username: 'clustertest',
  password: 'test',
  firstName: 'test',
  lastName: 'test',
};

const testUser2 = { ...testUser, username: 'clustertest2' };

describe('Cluster route testing', (): void => {
  // Create variable to store cookie
  let cookieHeader: string[];

  // Create user and save cookie
  beforeAll(async () => {
    const response = await request(app).post('/api/auth').send(testUser);
    cookieHeader = response.headers['set-cookie'];
  });

  describe('POST /cluster', (): void => {
    describe('given valid cluster data and auth', (): void => {
      // Create variable to store response
      let response: request.Response;

      // Before all tests, create cluster and save response
      beforeAll(async (): Promise<void> => {
        response = await request(app)
          .post('/api/cluster')
          .set('Cookie', cookieHeader)
          .send(testCluster1);
      });

      // After all tests delete test cluster from database
      afterAll(async (): Promise<void> => {
        await Cluster.deleteOne({ url: testCluster1.url });
      });

      it('should add a cluster to the database', async (): Promise<void> => {
        const newCluster = await Cluster.findOne({ name: testCluster1.name });
        expect(newCluster).toBeDefined();
        expect(newCluster).not.toBeNull();
      });

      it('should respond with status 201', (): void => {
        expect(response.status).toBe(201);
      });

      it('should respond with a success object', (): void => {
        expect(response.body).toHaveProperty('success', true);
      });
    });

    describe('given valid cluster data but no auth', (): void => {
      // Create variable to store response
      let response: request.Response;

      // Before all tests, attempt to create cluster (shouldnt work) and save response
      beforeAll(async (): Promise<void> => {
        response = await request(app).post('/api/cluster').send(testCluster1);
      });

      it('should respond with status 400', (): void => {
        expect(response.status).toBe(400);
      });

      it('should not add a new cluster to the database', async (): Promise<void> => {
        const cluster = await Cluster.findOne({ name: testCluster1.name });
        expect(cluster).toBeNull();
      });
    });

    describe('given invalid cluster data but correct auth', (): void => {
      let response: request.Response;

      // Before all tests, attempt to create cluster (shouldnt work) and save response
      beforeAll(async (): Promise<void> => {
        response = await request(app)
          .post('/api/cluster')
          .set('Cookie', cookieHeader)
          .send(badCluster);
      });

      // After all tests delete test user from database
      afterAll(async (): Promise<void> => {
        await User.deleteOne({ username: testUser.username });
      });

      it('should respond with status 500', (): void => {
        expect(response.status).toBe(500);
      });

      it('should not add a new cluster to the database', async (): Promise<void> => {
        const cluster = await Cluster.findOne({ name: badCluster.name });
        expect(cluster).toBeNull();
      });
    });
  });

  describe('GET /cluster', (): void => {
    // Define variables to store cookies for each user
    let cookieHeader1: string[];
    let cookieHeader2: string[];

    beforeAll(async (): Promise<void> => {
      // Create user 1 and add a cluster for user 1
      const response1 = await request(app).post('/api/auth').send(testUser);
      cookieHeader1 = response1.headers['set-cookie'];
      await request(app)
        .post('/api/cluster')
        .set('Cookie', cookieHeader1)
        .send(testCluster1);

      // Create user 2 and add a cluster for user 2
      const response2 = await request(app).post('/api/auth').send(testUser2);
      cookieHeader2 = response2.headers['set-cookie'];
      await request(app)
        .post('/api/cluster')
        .set('Cookie', cookieHeader2)
        .send(testCluster2);
    });

    describe('given valid auth, should fetch clusters for current user', (): void => {
      let response1: request.Response;
      let response2: request.Response;

      beforeAll(async (): Promise<void> => {
        // get list of clusters for user 1
        response1 = await request(app)
          .get('/api/cluster')
          .set('Cookie', cookieHeader1);

        // get list of clusters for user 2
        response2 = await request(app)
          .get('/api/cluster')
          .set('Cookie', cookieHeader2);
      });

      it('should respond with status 200', (): void => {
        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
      });

      it('should respond with an array of clusters for each user', (): void => {
        expect(response1.body).toBeInstanceOf(Array);
        expect(response1.body.length).toBe(1);
        expect(response2.body).toBeInstanceOf(Array);
        expect(response2.body.length).toBe(1);
        expect(response1.body).not.toEqual(response2.body);
      });
    });

    afterAll(async (): Promise<void> => {
      // Delete test clusters and users
      await User.deleteOne({ username: testUser.username });
      await User.deleteOne({ username: testUser2.username });
      await Cluster.deleteOne({ name: testCluster1.name });
      await Cluster.deleteOne({ name: testCluster2.name });
    });
  });

  describe('PUT /cluster', (): void => {
    // Define variables to store cookie and cluster id
    let cookieHeader: string[];
    let clusterId: string | undefined;

    beforeAll(async (): Promise<void> => {
      // Create a user and add a cluster for that user
      const response = await request(app).post('/api/auth').send(testUser);
      cookieHeader = response.headers['set-cookie'];
      await request(app)
        .post('/api/cluster')
        .set('Cookie', cookieHeader)
        .send(testCluster1);

      // Get the cluster id of the cluster we just added
      const cluster = await Cluster.findOne({ name: testCluster1.name });
      clusterId = cluster?._id.toString();
    });

    afterAll(async (): Promise<void> => {
      // After all tests, delete test cluster and user
      await User.deleteOne({ username: testUser.username });
      await Cluster.deleteOne({ name: testCluster1.name });
    });

    describe('given valid cluster data and auth', (): void => {
      let response: request.Response;

      // Update the name property of the cluster to 'newName'
      beforeAll(async (): Promise<void> => {
        response = await request(app)
          .put('/api/cluster')
          .set('Cookie', cookieHeader)
          .send({ ...testCluster1, name: 'newName', clusterId });
      });

      // After all tests, change the name of the cluster back to the original name
      afterAll(async (): Promise<void> => {
        await Cluster.updateOne(
          { _id: clusterId },
          { name: testCluster1.name }
        );
      });

      it('should respond with status 200', (): void => {
        expect(response.status).toBe(201);
      });

      it('should respond with a success object', (): void => {
        expect(response.body).toHaveProperty('success', true);
      });

      it('should update the cluster in the database', async (): Promise<void> => {
        const updatedCluster = await Cluster.findOne({ _id: clusterId });
        expect(updatedCluster?.name).toBe('newName');
      });
    });

    describe('given invalid cluster id but valid auth', (): void => {
      let response: request.Response;

      // Send a request with an invalid cluster id and save it to response variable
      beforeAll(async (): Promise<void> => {
        response = await request(app)
          .put('/api/cluster')
          .set('Cookie', cookieHeader)
          .send({ ...testCluster1, name: 'newName', clusterId: 'badId' });
      });

      it('should respond with status 500', (): void => {
        expect(response.status).toBe(500);
      });

      it('should respond with an error message', (): void => {
        expect(response.body).toHaveProperty('message');
      });

      it('should not update the cluster in the database', async (): Promise<void> => {
        const cluster = await Cluster.findOne({ name: 'newName' });
        expect(cluster).toBeNull();
      });
    });
  });
});
