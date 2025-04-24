import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import JobForm from "./pages/JobForm";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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

// Create router with future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Router {...router}>
            <AuthProvider>
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs/new"
                  element={
                    <ProtectedRoute>
                      <JobForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs/:id"
                  element={
                    <ProtectedRoute>
                      <JobDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs/:id/edit"
                  element={
                    <ProtectedRoute>
                      <JobForm />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
