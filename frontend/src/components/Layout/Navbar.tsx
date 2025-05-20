import { Box, Flex, Button, Link as ChakraLink, Container } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <Box bg="white" boxShadow="sm" position="sticky" top={0} zIndex={1000}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <ChakraLink
            as={RouterLink}
            to="/"
            fontSize="xl"
            fontWeight="bold"
            _hover={{ textDecoration: 'none' }}
            color="blue.500"
          >
            StoryTelling
          </ChakraLink>

          <Flex alignItems="center" gap={8}>
            <ChakraLink
              as={RouterLink}
              to="/stories"
              fontWeight="medium"
              color="gray.600"
              _hover={{ color: 'blue.500' }}
            >
              Stories
            </ChakraLink>
            
            {isAuthenticated ? (
              <>
                <ChakraLink
                  as={RouterLink}
                  to="/create-story"
                  fontWeight="medium"
                  color="gray.600"
                  _hover={{ color: 'blue.500' }}
                >
                  Create Story
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to="/my-stories"
                  fontWeight="medium"
                  color="gray.600"
                  _hover={{ color: 'blue.500' }}
                >
                  My Stories
                </ChakraLink>
                <Button
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <ChakraLink
                  as={RouterLink}
                  to="/login"
                  fontWeight="medium"
                  color="gray.600"
                  _hover={{ color: 'blue.500' }}
                >
                  Login
                </ChakraLink>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="blue"
                  size="sm"
                >
                  Register
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
