import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";
import {
  Box,
  Container,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Icon,
  Spinner,
  Grid,
  GridItem,
  useColorMode,
  Card,
  CardBody,
  Stack,
  Divider,
} from "@chakra-ui/react";
import api from "../api";

function JobForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { colorMode } = useColorMode();
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.700";

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    status: "applied",
    notes: "",
    url: "",
  });

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await api.get(`/api/jobs/${id}`);
      return response.data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEditing) {
        return api.put(`/api/jobs/${id}`, data);
      }
      return api.post("/api/jobs", data);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
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
        <Heading size="lg">
          {isEditing ? "Edit Job Application" : "Add Job Application"}
        </Heading>
      </Flex>

      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Company</FormLabel>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter company name"
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Position</FormLabel>
                    <Input
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Enter job position"
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                <GridItem>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter job location"
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </Grid>

              <FormControl>
                <FormLabel>Job URL</FormLabel>
                <Input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="Enter job posting URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes about the application"
                  rows={4}
                />
              </FormControl>

              <Divider />

              <Flex justify="end" gap={4}>
                <Button
                  leftIcon={<Icon as={FaTimes} />}
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button
                  leftIcon={<Icon as={FaSave} />}
                  colorScheme="brand"
                  type="submit"
                  isLoading={mutation.isPending}
                  loadingText="Saving..."
                >
                  {isEditing ? "Update" : "Save"}
                </Button>
              </Flex>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}

export default JobForm;
