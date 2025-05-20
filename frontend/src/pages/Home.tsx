import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api/axios';
import StoryCard from '../components/Story/StoryCard';
import useAuthStore from '../store/authStore';

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  const { data: stories, isLoading } = useQuery('stories', async () => {
    const response = await api.get('/stories/');
    return response.data;
  });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient="linear(to-r, blue.500, purple.500)"
        color="white"
        py={{ base: 12, md: 20 }}
        px={4}
      >
        <Container maxW="container.lg" textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            mb={6}
          >
            Welcome to Dynamic Storytelling
          </Heading>
          <Text fontSize="xl" mb={8} maxW="2xl" mx="auto">
            Explore interactive stories shaped by readers like you. Join our community
            of storytellers and be part of the narrative.
          </Text>
          {!isAuthenticated && (
            <Flex gap={4} justify="center">
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="white"
                size="lg"
                _hover={{ bg: 'white', color: 'blue.500' }}
              >
                Start Writing
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                variant="outline"
                size="lg"
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                Login
              </Button>
            </Flex>
          )}
        </Container>
      </Box>

      {/* Stories Section */}
      <Container maxW="container.xl" py={12}>
        <Heading size="xl" textAlign="center" mb={8}>
          Featured Stories
        </Heading>

        {isLoading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={8}
            px={{ base: 4, md: 0 }}
          >
            {stories?.map((story: any) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default Home;
