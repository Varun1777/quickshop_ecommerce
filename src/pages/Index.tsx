
import { Navigate } from "react-router-dom";

// Use Navigate instead of useNavigate hook with useEffect
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
