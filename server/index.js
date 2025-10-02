const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS for your frontend
app.use(cors({
  origin: 'https://form-excel-beryl.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 600
}));
// Manual CORS headers as fallback for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://form-excel-beryl.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(bodyParser.json());

// Handle preflight requests
app.options('*', cors());

// Google Sheets setup
const SPREADSHEET_ID = '1C7us1TPVhEdg5NJYLg-QXiS3p2oHKIz0zTu10m0gxsE'; // TODO: Replace with your Google Sheet ID
const SHEET_NAME = 'Sheet1';

// Load credentials from file or environment variable
let credentials;
try {
  if (process.env.GOOGLE_CREDENTIALS) {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  } else {
    credentials = require('./credentials.json');
  }
} catch (error) {
  console.error('Error loading credentials:', error);
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Initialize Google Sheets
let sheetsApi;
async function initializeSheetsApi() {
  const client = await auth.getClient();
  sheetsApi = google.sheets({ version: 'v4', auth: client });
  
  // Check if headers exist, if not create them
  try {
    const response = await sheetsApi.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:H1`,
    });
    
    if (!response.data.values || response.data.values[0].length === 0) {
      await sheetsApi.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'Timestamp',
            'Name',
            'Email',
            'Phone',
            'Address',
            'Status'
          ]],
        },
      });
    }
  } catch (error) {
    console.error('Error initializing sheet:', error);
  }
}

// Initialize sheets API when server starts
initializeSheetsApi();

// Validation middleware
const validateRegistration = (req, res, next) => {
  console.log('Received data:', req.body);
  const { name, email, phone, address } = req.body;
  
  const missingFields = [];
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!phone) missingFields.push('phone');
  if (!address) missingFields.push('address');
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: `Missing required fields: ${missingFields.join(', ')}`,
      details: 'All fields (name, email, phone, and address) are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }

  // Validate phone number (basic validation)
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      error: 'Invalid phone number format' 
    });
  }

  // All validations passed

  next();
};

app.post('/api/register', validateRegistration, async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    // Check for duplicate registration
    const existing = await sheetsApi.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    });

    if (!existing.data.values) {
      existing.data.values = [];
    }

    // Skip header row and check for duplicates
    const isDuplicate = existing.data.values.slice(1).some(row => 
      row[2] === email || row[3] === phone
    );

    if (isDuplicate) {
      return res.status(409).json({ 
        error: 'A registration with this email or phone number already exists. Each participant can only register once.' 
      });
    }

    // Add new registration
    await sheetsApi.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(),
          name,
          email,
          phone,
          address,
          'Pending'
        ]],
      },
    });

    res.json({ 
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Check if sheets API is initialized
    if (!sheetsApi) {
      return res.status(500).json({
        error: 'Server is not ready',
        details: 'Google Sheets API is not initialized'
      });
    }
    
    // Handle specific Google Sheets API errors
    if (error.code === 403) {
      return res.status(500).json({
        error: 'Permission denied',
        details: 'Cannot access the Google Sheet. Please check permissions.'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to save registration',
      details: error.message || 'An unexpected error occurred'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
