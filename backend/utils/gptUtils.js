const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

function getReportWriterPrompt(student_name, class_name, topics, competencies) {
  const topicsText = topics
    .map((topic) => `${topic.name}. Performance ${topic.performance}.`)
    .join(" ");
  const competenciesText = competencies
    .map(
      (competency) =>
        `${competency.name}. Performance ${competency.performance}.`
    )
    .join(" ");

  return `
    Return a student report which has up to 4 paragraphs. Only do the main writing, not titles or headers.
    The student is ${student_name}, the class is ${class_name}.
    The topics and the students performance in each are: ${topicsText}.
    The competencies and the students performance in each are: ${competenciesText}.
    Make sure to add in new paragraphs by adding "\\n\\n".
    Return a valid json with the key 'report' which contains the report.
  `;
}

async function sendPromptToGpt(prompt, use_gpt4 = false) {
  const model = use_gpt4 ? "gpt-4-0125-preview" : "gpt-3.5-turbo-0125";

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant designed to output a string with a maximum of 150 words",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  const content = JSON.parse(response.choices[0].message.content);
  return content.report.trim();
}

module.exports = {
  getReportWriterPrompt,
  sendPromptToGpt,
};
