import router from '../router';
import { Request, Response } from "express";
import { IError } from '../../interfaces/IError';
import { jwtVerify } from '../../warehouse/middlewares';
import { terminal } from '../../services/terminal';
import { execSync } from 'child_process';

import yaml from 'js-yaml';
import fs from 'fs';


router.route('/alert')
  .get(jwtVerify, async (req: Request, res: Response) => {
    terminal({req});
    terminal(`Received ${req.method} request at terminal '${req.baseUrl}${req.url}' endpoint`);
    terminal(`URL IS ${req.url}`); 
    const { id, ns, q, expr, dur } = req.query;
    try {
      const doc : any = yaml.load(fs.readFileSync('/Users/alexkaneps/alert-rules.yaml', 'utf8'));
      doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["alert"] = q;
      doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["expr"] = expr;
      doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["for"] = dur;

      fs.writeFile('/Users/alexkaneps/alert-rules.yaml', yaml.dump(doc), (err) => {
        if (err) {
          console.log('error with overwriting the yaml file');
          console.log(err);
        }
       const term = execSync('helm upgrade --reuse-values -f /Users/alexkaneps/alert-rules.yaml prometheus prometheus-community/kube-prometheus-stack -n monitor', { encoding: 'utf-8' });
       terminal(term);
      });

      // terminal(doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["alert"]);
      // terminal(doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["expr"]);
      // terminal(doc["additionalPrometheusRulesMap"]["custom-rules"]["groups"][0]["rules"][0]["for"]);
      // ALL THE ABOVE ARE CORRECT FOR UPDATING THE RULES!
      // terminal(q?.expression);
        return res.status(200).json(q);
    } catch (err) {
      const error: IError = {
        status: 500,
        message: `Unable to alert fulfill ${req.method} request: ${err}`
      };
      terminal(`Fail in alert page: ${error.message}`);
      return res.status(error.status).json(error);
    }
  });


export default router;
