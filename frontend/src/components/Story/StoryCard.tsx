import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface StoryCardProps {
    story: {
        id: number;
        title: string;
        description: string;
        author_name: string;
        slug: string;
        created_at: string;
    };
}

const StoryCard = ({ story }: StoryCardProps) => {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            boxShadow="md"
            bg="white"
            transition="transform 0.2s"
            _hover={{ transform: 'translateY(-4px)' }}
        >
            <VStack align="start" spacing={3}>
                <Heading size="md">{story.title}</Heading>
                <Text color="gray.600" noOfLines={3}>
                    {story.description}
                </Text>
                <Text fontSize="sm" color="gray.500">
                    By {story.author_name}
                </Text>
                <Button
                    as={RouterLink}
                    to={`/story/${story.slug}`}
                    colorScheme="blue"
                    size="sm"
                >
                    Read Story
                </Button>
            </VStack>
        </Box>
    );
};

export default StoryCard;
