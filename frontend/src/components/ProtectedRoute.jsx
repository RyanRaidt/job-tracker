import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Flex } from "@chakra-ui/react";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
