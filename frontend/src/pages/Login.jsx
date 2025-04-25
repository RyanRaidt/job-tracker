import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Button,
  Text,
  VStack,
  useColorMode,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const { checkAuthStatus } = useAuth();
  const { colorMode } = useColorMode();
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";
  const toast = useToast();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      navigate("/");
    }
  }, [isSubmitting, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const response = await api.post(endpoint, formData);
      await checkAuthStatus();
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <Box
        bg={cardBg}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6}>
          <Heading size="lg">
            {isRegistering ? "Create Account" : "Sign In"}
          </Heading>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              {isRegistering && (
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </FormControl>
              )}

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={
                    isRegistering ? "new-password" : "current-password"
                  }
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                w="full"
                isLoading={isSubmitting}
                loadingText={isRegistering ? "Registering..." : "Signing in..."}
                disabled={isSubmitting}
              >
                {isRegistering ? "Register" : "Sign In"}
              </Button>
            </VStack>
          </form>

          <Button
            variant="ghost"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "Don't have an account? Register"}
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default Login;
