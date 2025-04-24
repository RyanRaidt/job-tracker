import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChartLine,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Select,
  Button,
  Text,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  useColorMode,
  InputGroup,
  InputLeftElement,
  Card,
  CardBody,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import axios from "axios";

function Dashboard() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { colorMode } = useColorMode();
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", statusFilter],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/jobs${
          statusFilter ? `?status=${statusFilter}` : ""
        }`
      );
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://localhost:3000/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });

  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm("Are you sure you want to delete this job application?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const filteredJobs = jobs?.filter(
    (job) =>
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusCount = (status) => {
    return jobs?.filter((job) => job.status === status).length || 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "blue";
      case "interview":
        return "yellow";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Error: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Job Applications</Heading>
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        mb={8}
      >
        <Card bg="blue.50" border="1px" borderColor="blue.100">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel color="blue.600">Applied</StatLabel>
                <StatNumber color="blue.700">
                  {getStatusCount("applied")}
                </StatNumber>
              </Stat>
              <Box p={3} bg="blue.100" borderRadius="full">
                <Icon as={FaCalendarAlt} color="blue.600" boxSize={5} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
        <Card bg="yellow.50" border="1px" borderColor="yellow.100">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel color="yellow.600">Interview</StatLabel>
                <StatNumber color="yellow.700">
                  {getStatusCount("interview")}
                </StatNumber>
              </Stat>
              <Box p={3} bg="yellow.100" borderRadius="full">
                <Icon as={FaChartLine} color="yellow.600" boxSize={5} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
        <Card bg="red.50" border="1px" borderColor="red.100">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel color="red.600">Rejected</StatLabel>
                <StatNumber color="red.700">
                  {getStatusCount("rejected")}
                </StatNumber>
              </Stat>
              <Box p={3} bg="red.100" borderRadius="full">
                <Icon as={FaFilter} color="red.600" boxSize={5} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Grid>

      <Flex direction={{ base: "column", md: "row" }} gap={4} mb={8}>
        <InputGroup flex={1}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            pl={10}
          />
        </InputGroup>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          w={{ base: "full", md: "48" }}
        >
          <option value="">All Status</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
        </Select>
      </Flex>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {filteredJobs?.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id}>
            <Card
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
              _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              transition="all 0.2s"
            >
              <CardBody>
                <Flex justify="space-between" align="start">
                  <Box>
                    <Heading size="md">{job.position}</Heading>
                    <Text color="gray.600">{job.company}</Text>
                  </Box>
                  <Badge
                    colorScheme={getStatusColor(job.status)}
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </Flex>
                <Box mt={4}>
                  {job.location && (
                    <Flex align="center" color="gray.500" mb={2}>
                      <Icon as={FaMapMarkerAlt} mr={2} />
                      <Text>{job.location}</Text>
                    </Flex>
                  )}
                  <Flex align="center" color="gray.500" fontSize="sm">
                    <Icon as={FaCalendarAlt} mr={2} />
                    <Text>
                      Applied: {new Date(job.appliedDate).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Box>
                <Flex justify="end" mt={4} gap={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="brand"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/jobs/${job.id}/edit`);
                    }}
                  >
                    <Icon as={FaEdit} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={(e) => handleDelete(job.id, e)}
                  >
                    <Icon as={FaTrash} />
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          </Link>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;
