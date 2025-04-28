import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorMode,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaBriefcase, FaChartLine, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";
  const gradientBg =
    colorMode === "light"
      ? "linear(to-b, brand.50, white)"
      : "linear(to-b, gray.900, gray.800)";

  return (
    <Box minH="100vh" bgGradient={gradientBg} py={0}>
      <Container maxW="container.md" py={20}>
        <Box
          bg={cardBg}
          border="1px"
          borderColor={borderColor}
          borderRadius="2xl"
          boxShadow="2xl"
          p={[8, 12]}
          textAlign="center"
        >
          <VStack spacing={8}>
            <Icon as={FaBriefcase} boxSize={16} color="brand.500" />
            <Heading size="2xl" color="brand.500" fontWeight="extrabold">
              Welcome to Job Tracker
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Your all-in-one platform to organize your job search, track applications, and stay on top of your career goals.
            </Text>
            <SimpleGrid columns={[1, 3]} spacing={6} mt={4}>
              <Feature icon={FaChartLine} text="Track Applications" />
              <Feature icon={FaCheckCircle} text="Stay Organized" />
              <Feature icon={FaBriefcase} text="Land Your Dream Job" />
            </SimpleGrid>
            <Button
              colorScheme="brand"
              size="lg"
              fontSize="xl"
              px={10}
              py={6}
              mt={6}
              onClick={() => navigate("/login")}
              boxShadow="lg"
            >
              Get Started
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

function Feature({ icon, text }) {
  return (
    <VStack>
      <Icon as={icon} boxSize={8} color="brand.400" />
      <Text fontWeight="semibold" color="gray.700" fontSize="md">
        {text}
      </Text>
    </VStack>
  );
}
