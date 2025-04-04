import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Box,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { useParams } from "react-router-dom";
import pinCodeData from "../../Assets/Pincodes/pincodeData.json";
import PlaceOrder from "./PlaceOrder";
import AdvisorySeeCustomerOldOrders from "./AdvisorySeeCustomerOldOrders";
import Sidebar from "../../components/SideNavbar/AdvisorSidebar";
import AdvisoryAddCustomerRemark from "./AdvisoryAddCustomerRemark";
import ApiLoader from "../../components/ApiLoader/ApiLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled Components
const CustomCard = styled(Card)({
  backgroundColor: "#f5f5f5",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  padding: "32px",
  margin: "40px auto",
});

const CustomButton = styled(IconButton)({
  backgroundColor: "#6C584C",
  color: "white",
  "&:hover": {
    backgroundColor: "#DDE5B6",
  },
});

const HighlightText = styled(Typography)({
  fontWeight: "bold",
  color: "#6C584C",
});

const ErrorText = styled(Typography)({
  color: "red",
  textAlign: "center",
});

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  backgroundColor: "#6C584C",
  color: "white",
  "&.Mui-selected": {
    backgroundColor: "#DDE5B6",
    color: "black",
  },
  "&:hover": {
    backgroundColor: "#DDE5B6",
    color: "black",
  },
}));

const AdvisorySeenewCustomerDetails = () => {
  const { mobileNumber } = useParams();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [updatedCustomer, setUpdatedCustomer] = useState({});
  const [postOffices, setPostOffices] = useState([]);
  const [pincodeError, setPincodeError] = useState("");
  const [advisoryId, setAdvisoryId] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading state
  const [activeComponent, setActiveComponent] = useState("remark");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch customer data
        const customerResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/advisory/customers/${mobileNumber}`
        );
        setCustomer(customerResponse.data);
        setUpdatedCustomer(customerResponse.data);

        // Load post offices based on customer pincode
        updatePostOffices(customerResponse.data.pincode, customerResponse.data.postOffice);

        // Fetch advisory ID
        const advisoryResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/advisory/dashboard`,
          { withCredentials: true }
        );
        setAdvisoryId(advisoryResponse.data.id);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mobileNumber]);

  const updatePostOffices = (pincode, currentPostOffice) => {
    const officeData = pinCodeData[pincode];

    if (officeData) {
      setPostOffices(officeData);
      setPincodeError("");

      // If the current post office is valid, set it; otherwise, clear it
      if (currentPostOffice && officeData.some(office => office.officename === currentPostOffice)) {
        setUpdatedCustomer(prevState => ({
          ...prevState,
          postOffice: currentPostOffice
        }));
      } else {
        setUpdatedCustomer(prevState => ({
          ...prevState,
          taluka: "",
          district: "",
          state: "",
          postOffice: "" // Clear previously selected post office
        }));
      }
    } else {
      setPostOffices([]);
      setPincodeError("No records found for this pincode.");
      setUpdatedCustomer(prevState => ({
        ...prevState,
        taluka: "",
        district: "",
        state: "",
        postOffice: "",
      }));
    }
  };

  const handleEditToggle = () => setIsEditable(prev => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCustomer((prevState) => ({ ...prevState, [name]: value }));

    // Update post offices if pincode is changed
    if (name === "pincode") {
      updatePostOffices(value);
    }
  };

  const updateCustomerData = async (dataToUpdate) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/advisory/customer/${mobileNumber}`,
        dataToUpdate
      );
      setCustomer(dataToUpdate);
      toast.success("Customer details updated successfully!"); // Notify only on save
    } catch (err) {
      setError(err.response?.data?.message || "Error updating customer data");
      toast.error(err.response?.data?.message || "Error updating customer data");
    }
  };

  const handlePostOfficeChange = (e) => {
    const selectedPostOffice = e.target.value;
    const selectedOffice = postOffices.find((office) => office.officename === selectedPostOffice);

    if (selectedOffice) {
      const newUpdatedCustomer = {
        ...updatedCustomer,
        postOffice: selectedPostOffice,
        taluka: selectedOffice.Taluk || selectedOffice.Districtname, // Use district if taluka is not available
        district: selectedOffice.Districtname,
        state: selectedOffice.statename,
      };

      setUpdatedCustomer(newUpdatedCustomer);
      // Don't update backend immediately; just update state
    }
  };

  const handleSave = async () => {
    // Check if nearbyLocation is valid
    const nearbyLocation = updatedCustomer.nearbyLocation || "";
  
    // Ensure it has at least one word with letters only (allowing multiple words)
    if (!/^(?=.*[a-zA-Z]).+$/.test(nearbyLocation)) {  // Check for at least one Latin letter in the string
      toast.error("Nearby location must contain at least one valid word.");
      return; // Prevent saving if the condition is not met
    }
  
    await updateCustomerData(updatedCustomer);
    setIsEditable(false);
  };

  const handleToggleComponent = (event, newComponent) => {
    if (newComponent !== null) {
      setActiveComponent(newComponent);
    }
  };

  // Removed loading animation but made the Loader unclickable
  if (loading) {
    return (
      <Container>
        <ApiLoader style={{ pointerEvents: "none" }} /> {/* No interaction while loading */}
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorText variant="h6" mt={4}>
          {error}
        </ErrorText>
      </Container>
    );
  }

  const areAddressFieldsFilled = () => {
    return (
      updatedCustomer.village &&
      updatedCustomer.nearbyLocation &&
      updatedCustomer.pincode &&
      updatedCustomer.postOffice &&
      updatedCustomer.taluka &&
      updatedCustomer.district &&
      updatedCustomer.state
    );
  };

  return (
    <Sidebar>
      <Container>
        <ToastContainer />
        <CustomCard>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <HighlightText variant="h4">Customer Details</HighlightText>
              <CustomButton onClick={isEditable ? handleSave : handleEditToggle}>
                {isEditable ? <SaveIcon /> : <EditIcon />}
              </CustomButton>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={updatedCustomer.mobileNumber}
                  disabled
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              {[
                { label: "Alternative Number", name: "alternativeNumber" },
                { label: "Name", name: "name" },
                { label: "Village", name: "village" },
                { label: "Nearby Location", name: "nearbyLocation" },
              ].map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={updatedCustomer[field.name]}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={updatedCustomer.pincode}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={!!pincodeError}
                  helperText={pincodeError}
                />
              </Grid>

              {/* Post Office Field */}
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel>Post Office</InputLabel>
                  <Select
                    label="Post Office"
                    name="postOffice"
                    value={updatedCustomer.postOffice || ""} // Ensures it shows the selected post office or is empty
                    onChange={handlePostOfficeChange}
                    disabled={!isEditable || postOffices.length === 0}
                    displayEmpty
                  >
                    {/* Show available post offices when user clicks */}
                    {postOffices.length > 0 ? (
                      postOffices.map((office) => (
                        <MenuItem key={office.officename} value={office.officename}>
                          {office.officename}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No options available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {[
                { label: "Taluka", name: "taluka" },
                { label: "District", name: "district" },
                { label: "State", name: "state" },
              ].map((field, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={updatedCustomer[field.name]}
                    disabled
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              ))}
            </Grid>

            <Box mt={4}>
              <ToggleButtonGroup
                value={activeComponent}
                exclusive
                onChange={handleToggleComponent}
                aria-label="component toggle"
                fullWidth
                sx={{ mb: 4 }}
              >
                <StyledToggleButton value="remark" aria-label="remark">
                  Remark
                </StyledToggleButton>
                <StyledToggleButton value="oldOrder" aria-label="old order">
                  Old Order
                </StyledToggleButton>
                <StyledToggleButton value="placeOrder" aria-label="place order">
                  Place Order
                </StyledToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box mt={4} textAlign="center">
              {activeComponent === "remark" && (
                <AdvisoryAddCustomerRemark customerId={customer._id} advisoryId={advisoryId} />
              )}
              {activeComponent === "placeOrder" && (
               <PlaceOrder 
               customerId={customer._id} 
               advisorId={advisoryId}
               isAddressFilled={areAddressFieldsFilled()} // Pass the filled address status
             />
              )}
              {activeComponent === "oldOrder" && (
                <AdvisorySeeCustomerOldOrders customerId={customer._id} />
              )}
            </Box>
          </CardContent>
        </CustomCard>
      </Container>
    </Sidebar>
  );
};

export default AdvisorySeenewCustomerDetails;