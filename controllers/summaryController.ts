import { Request, Response } from 'express';
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const summaryController = {
  summarize: async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      
    const model = new OpenAI({
        temperature: 0,
      });
        
        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
        const docs = await textSplitter.createDocuments([text]);

      const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'text-embedding-ada-002',
      }));

      const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever()
      );

      const question = 'Your task is to analyze and summarize the TV script I give you with a title summary and extract the names of all actors with a title actors. Use bullet points to list them and pick a good emoji to represent each actor.';
      const result = await chain.call({ question, chat_history: [] });

      res.json({ message: 'Summarizing', data: result.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred during summarization' });
    }
  }
};

export default summaryController;
