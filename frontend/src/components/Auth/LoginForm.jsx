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

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const toast = useToast();
  const navigate = useNavigate();

  const loginMutation = useMutation(
    async (credentials) => {
      const response = await axios.post('http://localhost:8000/api/auth/token/', credentials);
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify({
          access: data.access,
          refresh: data.refresh
        }));
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
        });
        navigate('/');
      },
      onError: (error) => {
        console.error('Login error:', error);
        toast({
          title: 'Login failed',
          description: error.response?.data?.detail || 'Invalid credentials',
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
    loginMutation.mutate(formData);
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
              placeholder="Enter your username"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loginMutation.isLoading}
          >
            Login
          </Button>
          <Text>
            Don't have an account?{' '}
            <Button variant="link" onClick={() => navigate('/register')}>
              Register here
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginForm;
