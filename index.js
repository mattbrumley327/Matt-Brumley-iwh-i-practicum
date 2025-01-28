const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Replace this with your actual private app access token
const PRIVATE_APP_ACCESS = '***********************';

// ROUTE 1: Homepage - Retrieve and display all contacts
app.get('/', async (req, res) => {
    const contactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts?properties=email,tmnt_name,tmnt_bio,tmnt_weapon';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.get(contactsUrl, { headers });
        const contacts = response.data.results;
        res.render('homepage', {
            title: 'TMNT Contacts | HubSpot Practicum',
            contacts,
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).send('Error retrieving contacts');
    }
});

// ROUTE 2: Form Page - Render the form for creating/updating contacts
app.get('/update-contact', (req, res) => {
    res.render('updates', {
        title: 'Add or Update TMNT Contact | HubSpot Practicum',
    });
});

// ROUTE 3: Handle Form Submission - Create or update a contact
app.post('/update-contact', async (req, res) => {
    const { email, tmnt_name, tmnt_bio, tmnt_weapon } = req.body;
    const createOrUpdateUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    };

    const contactData = {
        properties: {
            email,
            tmnt_name,
            tmnt_bio,
            tmnt_weapon,
        },
    };

    try {
        await axios.post(createOrUpdateUrl, contactData, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating/updating contact:', error);
        res.status(500).send('Error creating/updating contact');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
