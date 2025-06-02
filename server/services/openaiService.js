// server/services/openaiService.js
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OpenAI API key is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSetPlan = async ({ description, genre, length, referenceArtists }) => {
  const prompt = `Create a ${length}-minute DJ set in the genre of ${genre}.
Description: ${description}
Reference Artists: ${referenceArtists}
Divide the set into sections (intro, build, peak, outro) with suggested energy levels and transitions.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};
