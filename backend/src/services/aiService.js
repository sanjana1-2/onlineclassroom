import OpenAI from 'openai';
import { config } from '../config/environment.js';
import logger from '../utils/logger.js';

let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient && config.openaiApiKey) {
    try {
      openaiClient = new OpenAI({
        apiKey: config.openaiApiKey,
      });
    } catch (error) {
      logger.warn('OpenAI initialization failed:', error.message);
    }
  }
  return openaiClient;
};

export const generateLectureSummary = async (transcriptText) => {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return `Summary: ${transcriptText.substring(0, 200)}...`;
    }

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at summarizing educational lectures. Provide a concise, well-structured summary.',
        },
        {
          role: 'user',
          content: `Please summarize the following lecture transcript:\n\n${transcriptText}`,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    logger.error('Generate summary error:', error);
    return `Summary: ${transcriptText.substring(0, 200)}...`;
  }
};

export const generateTimestampedNotes = async (transcriptText, timestamps) => {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return transcriptText;
    }

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating timestamped notes from lectures. Format notes with timestamps.',
        },
        {
          role: 'user',
          content: `Create timestamped notes from this lecture:\n\n${transcriptText}\n\nTimestamps: ${JSON.stringify(timestamps)}`,
        },
      ],
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    logger.error('Generate timestamped notes error:', error);
    return transcriptText;
  }
};

export const generateQuizQuestions = async (lectureContent, numberOfQuestions = 5) => {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return [];
    }

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating educational quiz questions. Return questions in JSON format.',
        },
        {
          role: 'user',
          content: `Generate ${numberOfQuestions} multiple choice quiz questions from this lecture content:\n\n${lectureContent}\n\nReturn as JSON array with fields: question, options (array), correctAnswer`,
        },
      ],
      max_tokens: 1500,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    logger.error('Generate quiz questions error:', error);
    return [];
  }
};

