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

const testUser = {
  username: 'clustertest',
  password: 'test',
  firstName: 'test',
  lastName: 'test',
};

describe('Cluster route testing', () => {
  let cookieHeader: string[];
  beforeAll(async () => {
    const response = await request(app).post('/api/auth').send(testUser);
    cookieHeader = response.headers['set-cookie'];
  });

  describe('POST /cluster', () => {
    describe('given valid cluster data and auth', () => {
      let response: request.Response;
      beforeAll(async () => {
        response = await request(app)
          .post('/api/cluster')
          .set('Cookie', cookieHeader)
          .send(testClusterOne);
      });

      it('should respond with status 201', () => {
        expect(response.status).toBe(201);
      });

      it('should respond with a success object', () => {
        expect(response.body).toHaveProperty('success', true);
      });

      it('should add a cluster to the database', async () => {
        const newCluster = await Cluster.findOne({ testClusterOne });
        expect(newCluster).toBeDefined();
        expect(newCluster).not.toBeNull();
      });
    });

    afterAll(async () => {
      await Cluster.deleteMany({ url: 'cluster.test' });
    });
  });

  describe('given valid cluster data but no auth', () => {
    let response: request.Response;
    beforeAll(async () => {
      response = await request(app).post('/api/cluster').send(testClusterOne);
    });

    it('should respond with status 400', () => {
      expect(response.status).toBe(400);
    });

    it('should not add a new cluster to the database', async () => {
      const cluster = await Cluster.findOne({ testClusterOne });
      expect(cluster).toBeNull();
    });
  });

  afterAll(async () => {
    await User.deleteOne({ username: testUser.username });
  });
});
