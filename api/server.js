import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { load } from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sendConfirmationEmail, sendWarmEmail } from './email.js';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Web scraping function
async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = await load(response.data);
    
    // Remove scripts and styles
    $('script, style').remove();
    
    const title = $('title').text() || '';
    const description = $('meta[name="description"]').attr('content') || '';
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 2000);
    
    return { title, description, bodyText };
  } catch (error) {
    console.error('Scraping error:', error.message);
    return null;
  }
}

// Gemini scoring function
async function scoreLead(leadData, websiteData) {
  const prompt = `
Eres un sistema de puntuación de leads para VitaliaOne, turismo dental en Oberá, Misiones, Argentina.
Puntuar este lead del 1 al 100:

Paciente: ${leadData.name}
Email: ${leadData.email}
Teléfono: ${leadData.phone || 'No proporcionado'}
Edad: ${leadData.age || 'No especificada'}
Ubicación: ${leadData.location || 'No especificada'}
Presupuesto: ${leadData.budget || 'No especificado'}
Servicio: ${leadData.service}
Timeline: ${leadData.timeline || 'No especificado'}
Sitio Web: ${websiteData ? JSON.stringify(websiteData) : 'No proporcionado'}
Info adicional: ${leadData.message || 'Ninguna'}

Criterios de puntuación:
- Ubicado en EE.UU. (+30 puntos)
- Presupuesto alto >$15k (+25 puntos)
- Servicio: implantes o rehabilitación completa (+20 puntos)
- Tiene sitio web (indica recursos) (+10 puntos)
- Timeline urgente o pronto (+15 puntos)

Retornar JSON con formato exacto:
{
  "score": 85,
  "priority": "Alta",
  "reasoning": "Breve explicación de la puntuación"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON in Gemini response');
  } catch (error) {
    console.error('Gemini error:', error.message);
    // Fallback scoring
    return {
      score: 50,
      priority: 'Media',
      reasoning: 'Error en scoring automático, puntuación por defecto'
    };
  }
}

// Submit to Airtable
async function submitToAirtable(fields) {
  try {
    const response = await axios.post(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_NAME)}`,
      { fields },
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Airtable error:', error.response?.data || error.message);
    throw error;
  }
}

// Main endpoint
// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/submit-lead', async (req, res) => {
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.name || !data.email || !data.service) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Scrape website if provided
    let websiteData = null;
    if (data.website) {
      websiteData = await scrapeWebsite(data.website);
    }
    
    // Get Gemini score
    const scoring = await scoreLead(data, websiteData);
    
    // Prepare Airtable fields
    const fields = {
      'Name': data.name,
      'Email': data.email,
      'Phone': data.phone || '',
      'Age': data.age || '',
      'Location': data.location || '',
      'Budget': data.budget || '',
      'Service': data.service,
      'Timeline': data.timeline || '',
      'Message': data.message || '',
      'Website Data': websiteData ? JSON.stringify(websiteData) : '',
      'Gemini Score': scoring.score,
      'Priority': scoring.priority,
      'Reasoning': scoring.reasoning,
      'Source': 'Vitalia One Landing Page',
      'Date': new Date().toISOString().split('T')[0]
    };
    
    // Submit to Airtable
    const airtableResponse = await submitToAirtable(fields);
    
    // Send emails in background (don't block response)
    const lead = { name: data.name, email: data.email, service: data.service, budget: data.budget, timeline: data.timeline, location: data.location };
    sendConfirmationEmail(lead).catch(err => console.error('Confirmation email failed:', err.message));
    sendWarmEmail(lead).catch(err => console.error('Warm email failed:', err.message));
    
    res.json({ success: true, scoring, airtableId: airtableResponse.id });
  } catch (error) {
    console.error('Error processing lead:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

export default app;
