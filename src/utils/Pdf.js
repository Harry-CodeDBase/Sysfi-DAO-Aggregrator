import React from 'react';
import pdfFile from '../../assets/HexaLinkwhitepaper.pdf';
import { FaArrowRight, FaFile, FaFileContract, FaNewspaper, FaTasks } from 'react-icons/fa';

const PdfViewer = ({ pdfTitle }) => {
  const openPdf = () => {
    window.open(pdfFile, '_blank');
  };

  return (
    <div className='whitepaper' onClick={openPdf}>
          <div>
      <FaFileContract/>
      </div>
<h3>Whitepaper</h3>
      <p>Learn more about the future Hexalink <FaArrowRight/></p>
      
    </div>
  );
};

export default PdfViewer;
