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
import { FaLinkedin } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login: linkedInLogin } = useAuth();
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
      if (isRegistering) {
        await api.post("/api/auth/register", formData);
        toast({
          title: "Registration successful",
          status: "success",
          duration: 3000,
        });
      } else {
        await api.post("/api/auth/login", formData);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <Container maxW="container.sm" py={20}>
      <Box
        bg={cardBg}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6}>
          <Heading size="lg">Welcome to Job Tracker</Heading>
          <Text textAlign="center" color="gray.600">
            {isRegistering
              ? "Create an account to manage your job applications"
              : "Sign in to manage your job applications"}
          </Text>

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

          <Divider />

          <Button
            leftIcon={<FaLinkedin />}
            colorScheme="linkedin"
            size="lg"
            onClick={linkedInLogin}
            w="full"
          >
            Sign in with LinkedIn
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default Login;
