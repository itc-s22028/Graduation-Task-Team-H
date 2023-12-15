import React, { useState, useEffect } from 'react';

const IntroQuestion = ({ selectedCategory }) => {
  const [question, setQuestion] = useState('');

  useEffect(() => {
    // Fetch or generate a question based on the selected category
    // You can customize this logic based on your requirements
    const generateQuestion = () => {
      switch (selectedCategory) {
        case 'rock':
          return 'What is your favorite rock band?';
        case 'pop':
          return 'Who is your favorite pop artist?';
        // Add more cases for other genres
        default:
          return 'Tell us about your music preferences!';
      }
    };

    const generatedQuestion = generateQuestion();
    setQuestion(generatedQuestion);
  }, [selectedCategory]);

  return (
    <div>
      <h2>Introductory Question</h2>
      <p>{question}</p>
      {/* Add input or button for the user to respond to the question */}
    </div>
  );
};

export default IntroQuestion;
