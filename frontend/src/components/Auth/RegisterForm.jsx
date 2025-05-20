import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const toast = useToast();
  const navigate = useNavigate();

  const registerMutation = useMutation(
    async (userData) => {
      const response = await axios.post('http://localhost:8000/api/auth/register/', userData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast({
          title: 'Registration successful',
          description: 'Please login with your credentials',
          status: 'success',
          duration: 3000,
        });
        navigate('/login');
      },
      onError: (error) => {
        toast({
          title: 'Registration failed',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 3000,
        });
      },
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    registerMutation.mutate(formData);
  };

  return (
    <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              name="password2"
              type="password"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={registerMutation.isLoading}
          >
            Register
          </Button>
          <Text>
            Already have an account?{' '}
            <Button variant="link" onClick={() => navigate('/login')}>
              Login here
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;
