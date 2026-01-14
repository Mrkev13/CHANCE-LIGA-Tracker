import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { login, clearError } from '../redux/slices/authSlice.ts';
import { RootState } from '../redux/store.ts';
import Navigation from '../components/Navigation.tsx';

const PageContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #2a2a2a;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background-color: rgba(220, 53, 69, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1rem;
`;

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, error } = useSelector((state: RootState) => state.auth);

  // Získání cesty, kam se uživatel snažil dostat
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(password));
  };

  // Pokud je přihlášen, přesměrujeme ho
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Vyčistit chyby při změně vstupu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) dispatch(clearError());
    setPassword(e.target.value);
  };

  return (
    <PageContainer>
      <Navigation />
      <Title>Admin Přihlášení</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Heslo</Label>
          <Input 
            type="password" 
            value={password} 
            onChange={handleChange}
            placeholder="Zadejte heslo"
            autoFocus
          />
        </FormGroup>
        <Button type="submit">Přihlásit se</Button>
      </Form>
    </PageContainer>
  );
};

export default LoginPage;
