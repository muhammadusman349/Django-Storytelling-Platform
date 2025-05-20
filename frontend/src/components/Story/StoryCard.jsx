import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Avatar,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const StoryCard = ({ story }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
      }}
    >
      <Box p={6}>
        <VStack align="stretch" spacing={4}>
          <VStack align="stretch" spacing={2}>
            <Heading
              size="md"
              noOfLines={2}
              _hover={{ color: 'blue.500' }}
            >
              {story.title}
            </Heading>
            <Text
              color={textColor}
              fontSize="sm"
              noOfLines={3}
            >
              {story.description}
            </Text>
          </VStack>

          <HStack spacing={2}>
            <Badge colorScheme="blue" fontSize="xs">
              {story.genre || 'Adventure'}
            </Badge>
            <Badge colorScheme="green" fontSize="xs">
              {story.status || 'Active'}
            </Badge>
          </HStack>

          <Box>
            <HStack spacing={2} mb={4}>
              <Avatar
                size="sm"
                name={story.author_name}
                src={story.author_avatar}
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="medium">
                  {story.author_name}
                </Text>
                <Text fontSize="xs" color={textColor}>
                  {new Date(story.created_at).toLocaleDateString()}
                </Text>
              </VStack>
            </HStack>
          </Box>

          <Button
            as={RouterLink}
            to={`/story/${story.slug}`}
            colorScheme="blue"
            size="sm"
            width="full"
          >
            Read Story
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default StoryCard;
