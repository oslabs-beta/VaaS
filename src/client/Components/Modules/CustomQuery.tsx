import React, { useEffect } from 'react';
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


const CustomQuery = (props: Visualizer) => {
  const handleCustom = async (): Promise<void> => {
    try {
      const query = (document.getElementById('query-input') as HTMLInputElement).value
      const outputQuery = await customMetric(props.id as string, 'k8', query)
    console.log('THIS IS OUTPUT QUERY', outputQuery);
    } catch (error){
      console.log(error);
    }
  };

// event handle clicks    

  return (
    <div>
      <TextField
      id="query-input"
      variant="outlined"
      size='small'
      // onKeyDown={handleEnterKeyDownUpdate}
      margin="dense"/>
      <Button variant="contained" className="btn" type="button" onClick = {handleCustom}>Custom Query Search</Button>

    </div>
  );
};

export default CustomQuery;