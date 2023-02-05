import React, { useEffect, useState } from 'react';
// import { Box } from '@mui/material';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Custom = (props: {
  handleCustomClose: any;
  customBox: any;
  dbData?: any;
}) => {
  const { state }: any = useLocation();
  const urlOrigin = props.dbData || state[0];

  const [iframeHeight, setIframeHeight] = useState<number>(600);
  const [iframeWidth, setIframeWidth] = useState<number>(600);

  useEffect(() => {
    window.innerHeight < 700
      ? setIframeHeight(window.innerHeight)
      : setIframeHeight(window.innerHeight * 0.75);
    window.innerWidth < 600
      ? setIframeWidth(window.innerWidth)
      : setIframeWidth(window.innerWidth * 0.8);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      console.log(
        'window resized to:',
        window.innerWidth,
        'x',
        window.innerHeight
      );
      window.innerHeight < 700
        ? setIframeHeight(window.innerHeight)
        : setIframeHeight(window.innerHeight * 0.75);
      window.innerWidth < 600
        ? setIframeWidth(window.innerWidth)
        : setIframeWidth(window.innerWidth * 0.8);
    });
  });

  return (
    <Box className="customBox" sx={props.customBox}>
      <div className="renderCustom">
        <button className="closeButton" onClick={props.handleCustomClose}>
          {'Close Query'}
        </button>
        <iframe
          src={`${urlOrigin.grafana_url}/dashboard/new?orgId=1&edit`}
          height={iframeHeight}
          width={iframeWidth}
          title="grafana query dashboard"
          className="custom-graf"
          frameBorder="0"
        ></iframe>
      </div>
    </Box>
  );
};

export default Custom;
