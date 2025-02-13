import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('ScrollToTop triggered. Scrolling to top.');
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default ScrollToTop;
