import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
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
  name: 'test cluster',
  description: 'test cluster',
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

const testUser2 = { ...testUser, username: 'clustertest2' };

describe('Cluster route testing', (): void => {
  let cookieHeader: string[];
  beforeAll(async () => {
    const response = await request(app).post('/api/auth').send(testUser);
    cookieHeader = response.headers['set-cookie'];
  });

  afterEach(async (): Promise<void> => {
    await Cluster.deleteOne({ testCluster1 });
  });

  describe('POST /cluster', (): void => {
    describe('given valid cluster data and auth', (): void => {
      let response: request.Response;
      beforeAll(async (): Promise<void> => {
        response = await request(app)
          .post('/api/cluster')
          .set('Cookie', cookieHeader)
          .send(testCluster1);
      });

      it('should add a cluster to the database', async (): Promise<void> => {
        const newCluster = await Cluster.findOne({ testCluster1 });
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
      let response: request.Response;
      beforeAll(async (): Promise<void> => {
        response = await request(app).post('/api/cluster').send(testCluster1);
      });

      it('should respond with status 400', (): void => {
        expect(response.status).toBe(400);
      });

      it('should not add a new cluster to the database', async (): Promise<void> => {
        const cluster = await Cluster.findOne({ testCluster1 });
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
        const cluster = await Cluster.findOne({ testCluster1 });
        expect(cluster).toBeNull();
      });
    });

    afterAll(async (): Promise<void> => {
      await User.deleteOne({ username: testUser.username });
    });
  });

  // describe('GET /cluster', (): void => {
  //   let cookieHeader1: string[];
  //   let cookieHeader2: string[];

  //   beforeAll(async (): Promise<void> => {
  //     const response1 = await request(app).post('/api/auth').send(testUser);
  //     cookieHeader1 = response1.headers['set-cookie'];
  //     const response2 = await request(app).post('/api/auth').send(testUser2);
  //     cookieHeader2 = response2.headers['set-cookie'];

  //     await request(app)
  //       .post('/api/cluster')
  //       .set('Cookie', cookieHeader1)
  //       .send(testCluster1);

  //     await request(app)
  //       .post('/api/cluster')
  //       .set('Cookie', cookieHeader2)
  //       .send(testCluster2);
  //   });

  //   describe('given valid auth', (): void => {
  //     let response: request.Response;
  //     beforeAll(async (): Promise<void> => {
  //       response = await request(app)
  //         .get('/api/cluster')
  //         .set('Cookie', cookieHeader1);
  //     });

  //     it('should respond with status 200', (): void => {
  //       expect(response.status).toBe(200);
  //     });

  //     it('should respond with an array of clusters', (): void => {
  //       expect(response.body).toBeInstanceOf(Array);
  //       expect(response.body.length).toBe(1);
  //     });
  //   });

  //   afterAll(async (): Promise<void> => {
  //     await User.deleteOne({ testUser });
  //     await User.deleteOne({ testUser2 });
  //     await Cluster.deleteOne({ testCluster1 });
  //     await Cluster.deleteOne({ testCluster2 });
  //   });
  // });
});
