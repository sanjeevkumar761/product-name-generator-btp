import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const productDescription = req.body.productDescription || '';
  if (productDescription.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid product description",
      }
    });
    return;
  }

  const productSeedWords = req.body.productSeedWords || '';
  if (productSeedWords.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter valid product seed words",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(productDescription, productSeedWords),
      temperature: 0.6,
    });
    //console.log(generatePrompt(productDescription, productSeedWords));
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(productDescription, productSeedWords) {
  return `Suggest three names for a product.

Product description: A home milkshake maker
Seed words: fast, healthy, compact.
Product names: HomeShaker, Fit Shaker, QuickShake, Shake Maker

Product description: A pair of shoes that can fit any foot size.
Seed words: adaptable, fit, omni-fit.

Product description: ${productDescription}
Seed words: ${productSeedWords}
Product names:`;
}
