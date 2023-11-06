import { Container, Col, Row } from "react-bootstrap";

const FormContainer = ({ children }) => (
  <Container>
    <Row className="justify-content-md-center">
      <Col sm={12} md={6}>
        {children}
      </Col>
    </Row>
  </Container>
);

export default FormContainer;
