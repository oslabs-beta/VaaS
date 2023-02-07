import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AddClusterType } from '../client/Interfaces';
import request from 'supertest';
import app from './test-api';
import { User, Cluster } from 'src/server/models';

const testClusterOne: AddClusterType = {
  url: 'cluster.test',
  k8_port: '9090',
  faas_port: '9090',
  faas_username: 'admin',
  faas_password: 'password',
  name: 'test cluster',
  description: 'test cluster',
  faas_url: 'test',
  grafana_url: 'test',
  kubeview_url: 'test',
  cost_url: 'test',
  cost_port: '9090',
};

const testClusterTwo: AddClusterType = {
  url: 'cluster.test',
  k8_port: '9090',
  faas_port: '9090',
  faas_username: 'admin',
  faas_password: 'password',
  name: 'test cluster',
  description: 'test cluster',
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
  name: 'test cluster',
  description: 'test cluster',
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

describe('Cluster route testing', (): void => {
  let cookieHeader: string[];
  beforeAll(async () => {
    const response = await request(app).post('/api/auth').send(testUser);
    cookieHeader = response.headers['set-cookie'];
  });

  describe('POST /cluster', (): void => {
    describe('given valid cluster data and auth', (): void => {
      let response: request.Response;
      beforeAll(async (): Promise<void> => {
        response = await request(app)
          .post('/api/cluster')
          .set('Cookie', cookieHeader)
          .send(testClusterOne);
      });

      it('should respond with status 201', (): void => {
        expect(response.status).toBe(201);
      });

      it('should respond with a success object', (): void => {
        expect(response.body).toHaveProperty('success', true);
      });

      it('should add a cluster to the database', async (): Promise<void> => {
        const newCluster = await Cluster.findOne({ testClusterOne });
        expect(newCluster).toBeDefined();
        expect(newCluster).not.toBeNull();
      });
    });

    afterAll(async (): Promise<void> => {
      await Cluster.deleteOne({ testClusterOne });
    });
  });

  describe('given valid cluster data but no auth', (): void => {
    let response: request.Response;
    beforeAll(async (): Promise<void> => {
      response = await request(app).post('/api/cluster').send(testClusterOne);
    });

    it('should respond with status 400', (): void => {
      expect(response.status).toBe(400);
    });

    it('should not add a new cluster to the database', async (): Promise<void> => {
      const cluster = await Cluster.findOne({ testClusterOne });
      expect(cluster).toBeNull();
    });
  });

  describe('given invalid cluster data but correct auth', (): void => {
    let response: request.Response;

    beforeAll(async (): Promise<void> => {
      response = await request(app)
        .post('/api/cluster')
        .set('Cookie', cookieHeader)
        .send(badCluster);
    });

    it('should respond with status 500', (): void => {
      expect(response.status).toBe(500);
    });

    it('should not add a new cluster to the database', async (): Promise<void> => {
      const cluster = await Cluster.findOne({ testClusterOne });
      expect(cluster).toBeNull();
    });
  });

  afterAll(async (): Promise<void> => {
    await User.deleteOne({ username: testUser.username });
  });
});
