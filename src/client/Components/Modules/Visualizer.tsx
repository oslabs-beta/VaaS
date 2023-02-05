import React, { useEffect, useState } from 'react';
// import { Box } from '@mui/material';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function Visualizer(props: {
  handleVisualizerClose: any;
  customBox: any;
  dbData?: any;
}) {
  const { state } = useLocation();
  const urlOrigin = props.dbData || state[0];
  const [iframeHeight, setIframeHeight] = useState<number>(600);
  const [iframeWidth, setIframeWidth] = useState<number>(600);
  useEffect(() => {
    window.innerHeight < 700
      ? setIframeHeight(600)
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
        ? setIframeHeight(600)
        : setIframeHeight(window.innerHeight * 0.75);
      window.innerWidth < 600
        ? setIframeWidth(window.innerWidth)
        : setIframeWidth(window.innerWidth * 0.8);
    });
  });

  return (
    <Box className="customBox" sx={props.customBox}>
      <div className="renderCustom">
        <button className="closeButton" onClick={props.handleVisualizerClose}>
          {'Close Visualizer'}
        </button>
        <iframe
          title="kubeview"
          src={`${urlOrigin.kubeview_url}`}
          height={iframeHeight}
          width={iframeWidth}
          frameBorder="0"
          className="custom-graf"
        ></iframe>
      </div>
    </Box>
  );
}
