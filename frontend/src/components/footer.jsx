import { Col, Row, Container } from 'react-bootstrap'
import React from 'react'

function Footer() {
    return (
        <Container>
            <Row>
                <Col className='text-center py-3'>&copy; 2024 Easy Stay</Col>
            </Row>
        </Container>
    )
}

export default Footer;