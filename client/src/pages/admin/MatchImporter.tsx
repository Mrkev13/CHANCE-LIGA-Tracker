import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ImporterContainer = styled.div`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #444;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #fff;
  font-size: 1.2rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #555;
  background: #1a1a1a;
  color: #fff;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const Message = styled.p<{ isError?: boolean }>`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.isError ? '#ff4d4d' : '#4dff4d'};
  font-weight: 500;
`;

interface MatchImporterProps {
  onImportSuccess?: () => void;
}

const MatchImporter: React.FC<MatchImporterProps> = ({ onImportSuccess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleImport vyvolán s URL:', url);
    if (!url) {
      console.log('URL je prázdná, končím.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('Odesílám požadavek na import:', `${API_URL}/matches/import`, { url });
      const response = await axios.post(`${API_URL}/matches/import`, { url });
      console.log('Odpověď z importu:', response.data);
      setMessage({ 
        text: `✅ ${response.data.message || 'Zápas úspěšně importován!'}`, 
        isError: false 
      });
      setUrl('');
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error: any) {
      console.error('Detailní chyba importu:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Něco se pokazilo při importu.';
      setMessage({ 
        text: `❌ Chyba: ${errorMessage}`, 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImporterContainer>
      <Title>Rychlý import zápasu z Onlajny.com</Title>
      <Form onSubmit={handleImport}>
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Vložte URL zápasu (např. https://www.onlajny.com/match/index/date/...)"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Importuji...' : 'Importovat zápas'}
        </Button>
      </Form>
      {message && (
        <Message isError={message.isError}>
          {message.text}
        </Message>
      )}
    </ImporterContainer>
  );
};

export default MatchImporter;
