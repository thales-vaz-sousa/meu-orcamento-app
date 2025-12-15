import { OpenAI } from 'openai';
import { Buffer } from 'buffer';
import busboy from 'busboy';

// Inicialize o OpenAI. A chave será injetada pelas variáveis de ambiente do Netlify.
const openai = new OpenAI();

// Função auxiliar para analisar o corpo da requisição multipart
const parseMultipartForm = (event) => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ 
      headers: event.headers,
      limits: {
          fileSize: 5 * 1024 * 1024, // Limite de 5MB por segurança
      }
    });
    
    const fields = {};
    const files = {};

    bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
      let fileBuffer = [];
      file.on('data', (data) => {
        fileBuffer.push(data);
      });
      file.on('end', () => {
        files[fieldname] = {
          buffer: Buffer.concat(fileBuffer),
          filename: filename.filename,
          mimetype,
        };
      });
    });

    bb.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    bb.on('finish', () => {
      resolve({ fields, files });
    });

    bb.on('error', (err) => {
      reject(err);
    });

    // O busboy precisa do Buffer da requisição
    bb.end(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
  });
};

// Handler principal da Netlify Function
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }
  
  try {
    const { files } = await parseMultipartForm(event);
    const invoiceFile = files.invoice; // 'invoice' deve ser o nome do campo no frontend

    if (!invoiceFile) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Nenhum arquivo de fatura encontrado.' }) };
    }

    // 1. Converte o buffer da imagem para Base64 (necessário para a API Vision)
    const base64Image = invoiceFile.buffer.toString('base64');
    const mimeType = invoiceFile.mimetype;
    
    // 2. Define o prompt de extração
    const prompt = 
      "Analise esta imagem/documento de fatura. Extraia os dados abaixo e retorne APENAS o objeto JSON. Não inclua texto explicativo antes ou depois. Se um dado não for encontrado, use null. Dados esperados: " + 
      "{ description: 'Nome do Comerciante ou descrição da compra', amount: 'Valor total da compra em R$', date: 'Data da compra no formato YYYY-MM-DD', category: 'Sugestão de Categoria (ex: Alimentação, Transporte, Lazer)' }";

    // 3. Chamada à API da OpenAI (GPT-4o)
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Modelo mais moderno com capacidades visuais
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" }, // Pede o retorno em formato JSON
    });

    // 4. Extrai e retorna o JSON limpo
    const jsonResult = response.choices[0].message.content;
    const extractedData = JSON.parse(jsonResult);
    
    return {
      statusCode: 200,
      body: JSON.stringify(extractedData),
    };

  } catch (error) {
    console.error('Erro na função de análise:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha na análise da fatura pela IA.', details: error.message }),
    };
  }
};