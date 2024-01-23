import { useNavigate } from "react-router-dom";

export const NavigateHome = () => {
const navigate = useNavigate();
    
    window.alert('홈으로 이동?')
    navigate('/');
  };

