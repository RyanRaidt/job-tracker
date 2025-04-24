import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import JobForm from "./pages/JobForm";
import JobDetails from "./pages/JobDetails";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f0f7ff",
      100: "#e0f0ff",
      200: "#bae0ff",
      300: "#7cc5ff",
      400: "#36a9ff",
      500: "#0090ff",
      600: "#0072cc",
      700: "#005999",
      800: "#004066",
      900: "#002233",
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.900",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "medium",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
        outline: {
          borderColor: "gray.200",
          _hover: {
            bg: "gray.50",
          },
        },
        danger: {
          bg: "red.500",
          color: "white",
          _hover: {
            bg: "red.600",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "white",
          borderRadius: "lg",
          boxShadow: "sm",
          p: 6,
        },
      },
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs/new" element={<JobForm />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/:id/edit" element={<JobForm />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
