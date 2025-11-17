
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/reducers";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
