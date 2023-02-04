import React, { useState, useEffect } from 'react';
import './styles.css';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Modules } from 'src/client/Interfaces';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import AddClusters from '../Admin/AddCluster';
import About from '../Admin/About';

// formatting for the search bar
const textFieldStyle = {
  background: '#FFFF',
  borderTopLeftRadius: '5px',
  borderBottomLeftRadius: '5px',
  fontSize: '10px',
  color: 'white',
  margin: '0px',
  width: '160px',
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
}) => {
  const [open, setOpen] = useState(true);
  const [AddCluster, handleAddClusters] = useState(false);
  const [aboutPage, openAboutPage] = useState(false);
  const [btnText, setBtnText] = useState('Collapse');
  const [searchCluster, setSearchCluster] = useState('');

  //for sidebar menu expand and contract
  const toggleOpen = () => {
    setOpen(!open);
    if (btnText === 'Collapse') {
      setBtnText('Expand');
    } else setBtnText('Collapse');
  };

  //reassiging props from Home
  const handleFindCluster = props.handleFindCluster;
  const resetClusterArray = props.resetClusterArray;

  //search to find cluser occurs after each key stroke
  useEffect(
    (props): void => {
      handleFindCluster(searchCluster);
    },
    [searchCluster]
  );

  //resets searchCluster state on each key
  const handleChangeCluster = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // handleFindCluster(searchCluster);
    //console.log(searchCluster, 'handlechangecluster here value');
    setSearchCluster(e.target.value);
  };

  const handleEnterKeyDownFindCluster = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    //need to update argument in handlefindcluster;
    if (e.key) handleFindCluster(searchCluster);
  };

  return (
    <div className={open ? 'sidenav' : 'sidenavClosed'}>
      <div className="menuCollapse">
        <button className={open ? 'closeBtn' : 'openBtn'} onClick={toggleOpen}>
          {open ? (
            <KeyboardDoubleArrowLeftIcon />
          ) : (
            <KeyboardDoubleArrowRightIcon />
          )}
        </button>
      </div>
      <div className={open ? 'menuButtons' : 'menuButtonsClosed'}>
        <div className="search">
          <TextField
            id="cluster-findName"
            type="text"
            label="cluster name"
            variant="filled"
            size="small"
            onChange={handleChangeCluster}
            onKeyDown={handleEnterKeyDownFindCluster}
            sx={textFieldStyle}
          />
          <SearchOutlinedIcon
            sx={{
              fontSize: '30px',
              background: '#A1A9B5',
              borderTopRightRadius: '5px',
              borderBottomRightRadius: '5px',
              color: 'black',
              height: '47px',
            }}
          />
        </div>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button
                className="clusterButton"
                variant="contained"
                {...bindTrigger(popupState)}
                sx={{ justifyContent: 'space-between', color: 'black' }}
              >
                Clusters <KeyboardDoubleArrowDownIcon />
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem
                  onClick={() => {
                    handleAddClusters(true);
                  }}
                >
                  Add Cluster
                </MenuItem>
                <MenuItem onClick={popupState.close}>Favorites</MenuItem>
                <MenuItem
                  onClick={() => {
                    popupState.close;
                    resetClusterArray();
                  }}
                >
                  All
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
        <Button
          onClick={() => {
            openAboutPage(true);
          }}
          sx={{
            justifyContent: 'center',
            backgroundColor: '#262C36',
            marginTop: '150px',
            color: '#A1A9B5',
          }}
        >
          <InfoOutlinedIcon />
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
};;

export default HomeSidebar;
