import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
// import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import { Modules } from 'src/client/Interfaces';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import AddClusters from '../Admin/AddCluster';
import About from '../Admin/About';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

// formatting for the search bar
const textFieldStyle = {
  background: '#f5f5f5',
  borderTopLeftRadius: '5px',
  borderBottomLeftRadius: '5px',
  fontSize: '10px',
  color: 'white',
  margin: '0px',
  width: '160px',
  height: '48px',
  // alignSelf: 'center',
  links: {
    color: 'white',
    '&:hover': {
      textDecorationColor: 'green',
      cursor: 'pointer',
    },
  },
};

const HomeSidebar = (props: {
  handleFindCluster: any;
  resetClusterArray: any;
  refetch: any;
  open: boolean;
  toggleOpen: any;
}) => {
  // const [open, setOpen] = useState(true);
  const [AddCluster, handleAddClusters] = useState(false);
  const [aboutPage, openAboutPage] = useState(false);
  // const [btnText, setBtnText] = useState('Collapse');
  const [searchCluster, setSearchCluster] = useState('');
  const searchText: any = useRef();

  //for sidebar menu expand and contract
  // const toggleOpen = () => {
  //   setOpen(!open);
  //   if (btnText === 'Collapse') {
  //     setBtnText('Expand');
  //   } else setBtnText('Collapse');
  // };

  //reassiging props from Home
  const handleFindCluster = props.handleFindCluster;
  // const resetClusterArray = props.resetClusterArray;

  //search to find cluser occurs after each key stroke
  useEffect((): void => {
    handleFindCluster(searchCluster);
  }, [searchCluster]);

  //resets searchCluster state on each key
  const handleChangeCluster = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleFindCluster(searchCluster);
    console.log(searchText.value);
    setSearchCluster(e.target.value);
  };

  const handleEnterKeyDownFindCluster = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    //need to update argument in handlefindcluster;
    if (e.key) handleFindCluster(searchCluster);
  };

  return (
    <div className={props.open ? 'sidenav' : 'sidenavClosed'}>
      <div className="menuCollapse">
        <button
          // className={props.open ? 'closeBtn' : 'openBtn'}
          className="closeBtn"
          onClick={props.toggleOpen}
        >
          {/* {open ? ( */}
          {props.open && <KeyboardDoubleArrowLeftIcon fontSize="large" />}
          {/* // ) : ( */}
          {/* <KeyboardDoubleArrowRightIcon /> */}
          {/* // )} */}
        </button>
      </div>
      <div className={props.open ? 'menuButtons' : 'menuButtonsClosed'}>
        <div className="search">
          <TextField
            id="cluster-findName"
            type="text"
            label="cluster name"
            variant="filled"
            size="small"
            value={searchCluster}
            onChange={handleChangeCluster}
            onKeyDown={handleEnterKeyDownFindCluster}
            sx={textFieldStyle}
          />
          {searchCluster.length === 0 ? (
            <SearchOutlinedIcon
              sx={{
                fontSize: '30px',
                background: '#858585',
                borderTopRightRadius: '5px',
                borderBottomRightRadius: '5px',
                color: 'black',
                height: '48px',
              }}
            />
          ) : (
            <ClearIcon
              sx={{
                fontSize: '30px',
                background: '#858585',
                borderTopRightRadius: '5px',
                borderBottomRightRadius: '5px',
                color: 'black',
                height: '48px',
                '&:hover': { color: '#F5F5F5' },
              }}
              onClick={() => {
                setSearchCluster('');
              }}
            />
          )}
        </div>
        <Button
          onClick={() => {
            handleAddClusters(true);
          }}
          sx={{
            justifyContent: 'flex-start',
            backgroundColor: '#061320',
            marginTop: '40px',
            fontSize: '1rem',
            color: '#f5f5f5',
            '&:hover': { color: '#0f9595' },
          }}
        >
          <AddIcon sx={{ marginRight: '10px' }} />
          Add Cluster
        </Button>
        <Button
          onClick={() => {
            openAboutPage(true);
          }}
          sx={{
            justifyContent: 'flex-start',
            backgroundColor: '#061320',
            fontSize: '1rem',
            marginTop: '20px',
            color: '#f5f5f5',
            '&:hover': { color: '#0f9595' },
          }}
        >
          <InfoOutlinedIcon sx={{ marginRight: '10px' }} />
          About
        </Button>
      </div>
      <Modal
        open={AddCluster}
        onClose={() => {
          handleAddClusters(false);
        }}
      >
        <div>
          <AddClusters
            refetch={props.refetch}
            handleAddClusters={handleAddClusters}
          />
        </div>
      </Modal>
      <Modal
        open={aboutPage}
        onClose={() => {
          openAboutPage(false);
        }}
      >
        <div>
          <About openAboutPage={openAboutPage} />
        </div>
      </Modal>
    </div>
  );
};

export default HomeSidebar;
