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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login, register, error: authError } = useAuth();
  const { colorMode } = useColorMode();
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";
  const textColor = colorMode === "light" ? "gray.800" : "whiteAlpha.900";
  const inputBg = colorMode === "light" ? "white" : "gray.700";
  const toast = useToast();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (isRegistering && !formData.name) {
      errors.name = "Name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await register(formData);
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await login(formData);
        toast({
          title: "Welcome back",
          description: "You have been logged in successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
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
          <Heading size="lg" color={textColor}>
            {isRegistering ? "Create Account" : "Sign In"}
          </Heading>

          {authError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {authError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              {isRegistering && (
                <FormControl isRequired isInvalid={formErrors.name}>
                  <FormLabel color={textColor}>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    bg={inputBg}
                    borderColor={borderColor}
                    _hover={{ borderColor: "brand.400" }}
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                    }}
                  />
                  <FormErrorMessage>{formErrors.name}</FormErrorMessage>
                </FormControl>
              )}

              <FormControl isRequired isInvalid={formErrors.email}>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  bg={inputBg}
                  borderColor={borderColor}
                  _hover={{ borderColor: "brand.400" }}
                  _focus={{
                    borderColor: "brand.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                  }}
                />
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={formErrors.password}>
                <FormLabel color={textColor}>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={
                    isRegistering ? "new-password" : "current-password"
                  }
                  bg={inputBg}
                  borderColor={borderColor}
                  _hover={{ borderColor: "brand.400" }}
                  _focus={{
                    borderColor: "brand.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                  }}
                />
                <FormErrorMessage>{formErrors.password}</FormErrorMessage>
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
            color={textColor}
            _hover={{ bg: colorMode === "light" ? "gray.100" : "gray.700" }}
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
