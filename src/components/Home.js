import React, { useState } from 'react';
import _debounce from 'lodash/debounce';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../App.css'
function Home() {

  const [businessDetails, setBusinessDetails] = useState({
    name: '',
    yearEstablished: ''
  });
  const [loanAmount, setLoanAmount] = useState('');
  const [accountProvider, setAccountProvider] = useState('');
  const [balanceSheet, setBalanceSheet] = useState([]);
//   const [preAssessment, setPreAssessment] = useState(null);
  const [applicationResult, setApplicationResult] = useState(null);

  const handleRequestBalanceSheet = async () => {
    if (!businessDetails.name || !businessDetails.yearEstablished || !loanAmount) {
      alert('Please fill in all required fields before requesting the balance sheet.');
      return;
    }
    console.log(">>>>>>>>>making request for balance sheet")
    const response = await fetch('https://loan-application-ewu4.onrender.com/api/fetchBalanceSheet');
    const data = await response.json();
    setBalanceSheet(data);
  };

  const handleSubmitApplication = async () => {
    console.log(">>>>>>>>>making submit request")
    const response = await fetch('https://loan-application-ewu4.onrender.com/api/submitApplication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        businessDetails,
        loanAmount
      })
    });
    const data = await response.json();
    // setPreAssessment(data.preAssessment);
    setApplicationResult(data);
  };

  const debounceDelay = 100;

  const debouncedSetBusinessDetails = _debounce(newDetails => {
    setBusinessDetails(prevDetails => ({ ...prevDetails, ...newDetails }));
  }, debounceDelay);

  const handleBusinessDetailsChange = e => {
    const { name, value } = e.target;
    debouncedSetBusinessDetails({ [name]: value });
  };

  const debouncedSetLoanAmount = _debounce(amount => {
    setLoanAmount(amount);
  }, debounceDelay);

  const handleLoanAmountChange = e => {
    const { value } = e.target;
    debouncedSetLoanAmount(value);
  };
  return (
    <Container>
      <Box sx={{ textAlign: 'center', margin: 'auto', width: '50%', padding: '20px' }}>
        <form>
           <TextField
        label="Business Name"
        name="name"
        value={businessDetails.name}
        onChange={handleBusinessDetailsChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Year Established"
        name="yearEstablished"
        value={businessDetails.yearEstablished}
        onChange={handleBusinessDetailsChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Loan Amount"
        type="number"
        value={loanAmount}
        onChange={handleLoanAmountChange}
        fullWidth
        margin="normal"
      />
          <FormControl fullWidth margin="normal">
            <InputLabel>Account Provider</InputLabel>
            <Select
              value={accountProvider}
              onChange={(e) => setAccountProvider(e.target.value)}
            >
              <MenuItem value="">Select Account Provider</MenuItem>
              <MenuItem value="Xero">Xero</MenuItem>
              <MenuItem value="MYOB">MYOB</MenuItem>
            </Select>
          </FormControl>
        </form>
        <Button variant="contained" onClick={handleRequestBalanceSheet} sx={{ marginTop: '10px' }}>
          Request Balance Sheet
        </Button>
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h5">Balance Sheet</Typography>
        {balanceSheet.length > 0 ? (
          <table className="balance-sheet-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Profit/Loss</th>
                <th>Assets Value</th>
              </tr>
            </thead>
            <tbody>
              {balanceSheet.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.year}</td>
                  <td>{entry.month}</td>
                  <td>{entry.profitOrLoss}</td>
                  <td>{entry.assetsValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography>No balance sheet data available.</Typography>
        )}
          
        </Box>
        <Box sx={{ marginTop: '20px' }}>
          {/* Display preAssessment and application result here */}
        </Box>
        <Button variant="contained" onClick={handleSubmitApplication} sx={{ marginTop: '20px' }}>
          Submit Application
        </Button>
        <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h5">Result</Typography>
        {applicationResult ? (
          <div className="application-result">
            <Typography>Name: {applicationResult.name}</Typography>
            <Typography>Year Established: {applicationResult.yearEstablished}</Typography>
            <Typography>Pre-Assessment: {applicationResult.preAssessment}</Typography>
          </div>
        ) : (
          <Typography>No result data available.</Typography>
        )}
      </Box>
      </Box>
    </Container>
  );
}

export default Home;
