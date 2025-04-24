import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLink,
  FaStickyNote,
} from "react-icons/fa";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Icon,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Stack,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import axios from "axios";

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { colorMode } = useColorMode();
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";

  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/api/jobs/${id}`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:3000/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      navigate("/");
    },
  });

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

  if (!job) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          Job not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex align="center" mb={6}>
        <Button
          leftIcon={<Icon as={FaArrowLeft} />}
          variant="ghost"
          onClick={() => navigate("/")}
          mr={4}
        >
          Back
        </Button>
        <Heading size="lg">Job Details</Heading>
      </Flex>

      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stack spacing={6}>
            <Flex justify="space-between" align="start">
              <Box>
                <Heading size="lg" mb={2}>
                  {job.position}
                </Heading>
                <Text fontSize="xl" color="gray.600">
                  {job.company}
                </Text>
              </Box>
              <Badge
                colorScheme={getStatusColor(job.status)}
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="md"
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </Flex>

            <Flex direction={{ base: "column", md: "row" }} gap={6}>
              <Flex align="center" flex={1}>
                <Icon as={FaMapMarkerAlt} color="gray.400" mr={3} />
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Location
                  </Text>
                  <Text>{job.location || "Not specified"}</Text>
                </Box>
              </Flex>
              <Flex align="center" flex={1}>
                <Icon as={FaCalendarAlt} color="gray.400" mr={3} />
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Applied Date
                  </Text>
                  <Text>{new Date(job.appliedDate).toLocaleDateString()}</Text>
                </Box>
              </Flex>
            </Flex>

            {job.url && (
              <Flex align="start">
                <Icon as={FaLink} color="gray.400" mt={1} mr={3} />
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Job URL
                  </Text>
                  <Text
                    as="a"
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="brand.500"
                    _hover={{ color: "brand.600" }}
                    wordBreak="break-all"
                  >
                    {job.url}
                  </Text>
                </Box>
              </Flex>
            )}

            {job.notes && (
              <Flex align="start">
                <Icon as={FaStickyNote} color="gray.400" mt={1} mr={3} />
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Notes
                  </Text>
                  <Text whiteSpace="pre-wrap">{job.notes}</Text>
                </Box>
              </Flex>
            )}

            <Divider />

            <Flex justify="end" gap={4}>
              <Button
                leftIcon={<Icon as={FaEdit} />}
                variant="outline"
                onClick={() => navigate(`/jobs/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                leftIcon={<Icon as={FaTrash} />}
                colorScheme="red"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this job application?"
                    )
                  ) {
                    deleteMutation.mutate();
                  }
                }}
              >
                Delete
              </Button>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default JobDetails;
