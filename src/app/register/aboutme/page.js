import './aboutme.scss';

const icebreakerQuestions = [
  'What hobbies or activities do you enjoy in your free time?',
  'If you could travel anywhere in the world, where would you go and why?',
  'What’s your favorite book or movie, and what do you love about it?',
  'Do you have a favorite type of music or a favorite band?',
  'What’s a fun fact about you that most people don’t know?',
  'What’s your go-to comfort food?',
  'If you could have dinner with any three people, dead or alive, who would they be?',
  'What’s a skill you’ve always wanted to learn?',
  'How do you like to spend a rainy day?',
  'What’s something you’re passionate about?',
  'If you could instantly master any skill or talent, what would it be?',
  'What’s your favorite childhood memory?',
  'What’s a movie or TV show you can binge-watch anytime?',
  'What’s something on your bucket list that you hope to achieve?',
  'How would your friends describe you in three words?',
  'What’s your favorite way to meet new people?',
  'If you could live in any fictional world, which one would you choose?',
];

export default function UserBioCreation() {
  return (
    <div className="UserBioCreation">
      <div className="center">
        <progress className="progress w-56" value="60" max="100"></progress>
      </div>
      <h1>Tell us about yourself</h1>
      <br />
      <div>
        <h2>Your bio</h2>
        <label htmlFor="">Tell us about yourself</label>
        <textarea
          className="textarea textarea-accent"
          placeholder="Bio"
        ></textarea>
      </div>
      <br />
      <div>
        <h2>Answer prompts</h2>
        <label htmlFor="">
          Select up to 3 questions and share your responses
        </label>

        {/* Select and text area for the first question */}
        <select name="icebreakerQuestions1" defaultValue="">
          <option value="" disabled>
            Select a question
          </option>
          {icebreakerQuestions.map((question, index) => (
            <option key={index} value={question}>
              {question}
            </option>
          ))}
        </select>
        <textarea
          className="textarea textarea-accent"
          placeholder="Your response..."
        ></textarea>

        {/* Select and text area for the second question */}
        <select name="icebreakerQuestions2" defaultValue="">
          <option value="" disabled>
            Select a question
          </option>
          {icebreakerQuestions.map((question, index) => (
            <option key={index} value={question}>
              {question}
            </option>
          ))}
        </select>
        <textarea
          className="textarea textarea-accent"
          placeholder="Your response..."
        ></textarea>

        {/* Select and text area for the third question */}
        <select name="icebreakerQuestions3" defaultValue="">
          <option value="" disabled>
            Select a question
          </option>
          {icebreakerQuestions.map((question, index) => (
            <option key={index} value={question}>
              {question}
            </option>
          ))}
        </select>
        <textarea
          className="textarea textarea-accent"
          placeholder="Your response..."
        ></textarea>
      </div>

      <div>
        <button>Skip for now</button>
        <button>Continue</button>
      </div>
    </div>
  );
}
