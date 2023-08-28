import ReactMarkdown from 'react-markdown';

function GPT3ResponseComponent({ gpt3Response }) {
  return (
    <div>
      <ReactMarkdown>{gpt3Response}</ReactMarkdown>
    </div>
  );
}

export default GPT3ResponseComponent;
