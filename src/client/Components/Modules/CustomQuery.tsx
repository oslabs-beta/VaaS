import React, { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Visualizer } from '../../Interfaces/IVisualizer';
import { IReducers } from '../../Interfaces/IReducers';
import { Delete } from '../../Services';
import { setRender } from '../../Store/actions';
import { apiRoute } from '../../utils';
import customMetric from '../../Queries/Custom';
import { Accordion, AccordionSummary, AccordionDetails, Button, Container, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Modules } from '../../Interfaces/ICluster';


const CustomQuery = (props: Modules) => {
  const [data, setData] = useState<any[]>();

  const handleCustom = async (): Promise<void> => {
    try {
      const query = (document.getElementById('query-input') as HTMLInputElement).value;
      const outputQuery = await customMetric(props.id as string, 'k8', query);
      setData(outputQuery);
    console.log('THIS IS OUTPUT QUERY', outputQuery);

    } catch (error){
      console.log(error);
    }
  };

  return (
    <div>

      <TextField
      id="query-input"
      variant="outlined"
      size='small'
      // onKeyDown={handleEnterKeyDownUpdate}
      margin="dense"/>
      <Button variant="contained" className="btn" type="button" onClick = {handleCustom}>Custom Query Search</Button>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
};

export default CustomQuery;