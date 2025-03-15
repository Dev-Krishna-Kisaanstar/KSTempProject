import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Container, Row, Col, Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const AdvisoryAddCustomerRemark = ({ customerId, advisoryId }) => {
    const [remark, setRemark] = useState("");
    const [remarks, setRemarks] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        const fetchRemarks = async () => {
            setLoading(true); // Set loading true when fetching remarks
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/advisory/customers/${customerId}/remarks`
                );
                const sortedRemarks = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRemarks(sortedRemarks);
            } catch (err) {
                setError("Failed to fetch remarks");
                toast.error("Failed to fetch remarks"); // Toast notification for fetch error
            } finally {
                setLoading(false); // Set loading false after fetching
            }
        };

        if (customerId) {
            fetchRemarks();
        }
    }, [customerId]);

    const handleRemarkSubmit = async () => {
        if (!remark.trim()) {
            setError("Please provide a remark.");
            toast.warning("Please provide a remark."); // Toast notification for empty remark
            return;
        }

        setLoading(true); // Set loading true when adding remark
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/advisory/customers/${customerId}/remarks`,
                { advisoryId, remark }
            );

            const newRemark = { ...response.data.remark, createdAt: new Date().toISOString() };
            setRemarks((prevRemarks) => {
                const updatedRemarks = [newRemark, ...prevRemarks];
                return updatedRemarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            });
            setRemark(""); // Reset the remark input
            setError(""); // Clear any previous errors
            toast.success("Remark added successfully!"); // Toast notification for successful remark addition
        } catch (error) {
            setError("Failed to add remark");
            toast.error("Failed to add remark"); // Toast notification for adding error
        } finally {
            setLoading(false); // Set loading false after adding
        }
    };

    // Early return if customerId or advisoryId is not provided
    if (!customerId || !advisoryId) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">Customer ID and Advisory ID are required.</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} /> {/* Toast Container */}
            <Row className="mb-3">
                <Col>
                    <h2 className="text-center" style={{ color: '#6C584C' }}>Add Your Remark</h2> {/* Updated color */}
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form>
                <Form.Group controlId="remarkInput">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter your remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="mb-3 rounded" // Added rounded corners
                        style={{ backgroundColor: '#f8f9fa', resize: 'none' }} // Light background for better readability
                    />
                </Form.Group>
                <Button
                    onClick={handleRemarkSubmit}
                    className="w-50"
                    style={{
                        backgroundColor: '#6C584C', // Updated button color
                        borderColor: '#6C584C', // Updated border color to match button color
                        transition: 'background-color 0.3s ease',
                        color: 'white'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#DDE5B6'; // Hover color
                        e.currentTarget.style.color = 'black'; // Hover text color
                    }} 
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#6C584C'; // Reset to original on mouse out
                        e.currentTarget.style.color = 'white'; // Reset text color
                    }}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? <Spinner animation="border" size="sm" /> : "Save Remark"}
                </Button>
            </Form>

            <Row className="mt-4">
                <Col>
                    <h3 className="text-center" style={{ color: '#6C584C' }}>Previous Remarks</h3> {/* Updated color */}
                    {remarks.length === 0 ? (
                        <Alert variant="info" className="text-center">No remarks available</Alert>
                    ) : (
                        remarks.map((item) => (
                            <Card key={item._id} className="mb-3">
                                <Card.Body>
                                    <Card.Text>{item.remark}</Card.Text>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Added by {item.advisoryId?.name} on{" "}
                                        {new Date(item.createdAt).toLocaleString()}
                                    </Card.Subtitle>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AdvisoryAddCustomerRemark;