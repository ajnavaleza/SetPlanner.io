// server/services/openaiService.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
  throw new Error('OpenAI API key is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSetPlan = async ({ description, genre, length, referenceArtists }) => {
  console.log('Generating set plan with params:', { description, genre, length, referenceArtists });
  
  const prompt = `Create a ${length}-minute DJ set in the genre of ${genre}.
Description: ${description}
Reference Artists: ${referenceArtists}
Divide the set into sections (intro, build, peak, outro) with suggested energy levels and transitions.`;

  console.log('Sending prompt to OpenAI:', prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    console.log('Received response from OpenAI');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};
