import NavBar from "@/components/NavBar";
import { Container, Row, Col } from 'react-bootstrap';

export default function Page() {
    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={10}>
                    <NavBar />
                    <div>
                        <br />
                    <h1>Welcome to Springverse</h1>
                    <br></br>
                    <div className="text-block"></div>
                        <h2>
                            Watch this space ...... Something great coming soon
                        </h2>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}