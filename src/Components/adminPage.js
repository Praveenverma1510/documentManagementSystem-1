import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (username && password) {
        setSuccess(true);
      } else {
        setError('Please fill all fields');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Create User</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">User created successfully!</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>
            
            <Button disabled={loading} type="submit" className="w-100">
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Admin;