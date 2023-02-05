import router from '../router';
import { Request, Response } from 'express';
import { IError } from '../../interfaces/IError';
import { verifyCookie } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';
import { execSync } from 'child_process';
import yaml from 'js-yaml';
import findup from 'findup-sync';

const fs = require('fs');

router
  .route('/alert')
  .get(verifyCookie, async (req: Request, res: Response) => {
    terminal({ req });
    terminal(
      `Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`
    );
    terminal(`URL IS ${req.url}`);
    const { id, ns, q, expr, dur } = req.query;
    try {
      const fileLoc = findup('alert-rules.yaml');
      const doc: any = yaml.load(fs.readFileSync(`${fileLoc}`, 'utf8'));
      doc['additionalPrometheusRulesMap']['custom-rules']['groups'][0][
        'rules'
      ][0]['alert'] = q;
      doc['additionalPrometheusRulesMap']['custom-rules']['groups'][0][
        'rules'
      ][0]['expr'] = expr;
      doc['additionalPrometheusRulesMap']['custom-rules']['groups'][0][
        'rules'
      ][0]['for'] = dur;

      fs.writeFile(`${fileLoc}`, yaml.dump(doc), (err: unknown) => {
        if (err) {
          console.log('error with overwriting the yaml file');
          console.log(err);
        }
        const term = execSync(
          `helm upgrade --reuse-values -f ${fileLoc} prometheus prometheus-community/kube-prometheus-stack -n monitor`,
          { encoding: 'utf-8' }
        );
        terminal(term);
      });

      return res.status(200).json(q);
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to alert fulfill ${req.method} request: ${err}`,
      };
      terminal(`Fail in alert page: ${error.message}`);
      return res.status(error.status).json(error);
    }
  });

export default router;
