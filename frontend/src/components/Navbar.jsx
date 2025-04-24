import { Link, useLocation } from "react-router-dom";
import {
  FaBriefcase,
  FaChartLine,
  FaPlus,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  Box,
  Flex,
  Button,
  Container,
  Icon,
  Text,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const bgColor = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={10}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={2}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Link to="/">
            <Flex alignItems="center" color="brand.500">
              <Icon as={FaBriefcase} boxSize={6} />
              <Text ml={2} fontSize="xl" fontWeight="semibold">
                Job Tracker
              </Text>
            </Flex>
          </Link>

          <Flex alignItems="center" gap={6}>
            <Link to="/">
              <Button
                variant="ghost"
                leftIcon={<Icon as={FaChartLine} />}
                colorScheme={isActive("/") ? "brand" : "gray"}
                bg={isActive("/") ? "brand.50" : "transparent"}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/jobs/new">
              <Button
                leftIcon={<Icon as={FaPlus} />}
                colorScheme="brand"
                variant="solid"
              >
                Add Job
              </Button>
            </Link>
            <IconButton
              icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />
            {user ? (
              <Button
                leftIcon={<FaSignOutAlt />}
                variant="ghost"
                onClick={logout}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                colorScheme="brand"
                onClick={() => (window.location.href = "/login")}
              >
                Sign In
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

export default Navbar;
