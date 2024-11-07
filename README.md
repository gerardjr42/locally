# Locally - Connect Through Local Experiences

Locally is a modern social networking platform built with Next.js that helps people connect through shared interests and local activities. The platform uses AI-powered matchmaking to connect like-minded individuals at local events and experiences.

## Features

- **AI-Powered Matchmaking**: Uses TensorFlow.js for intelligent user matching based on interests and preferences
- **Real-time Chat**: Integrated with Stream Chat for real-time messaging between matched users
- **Event Discovery**: Browse and join local events and activities
- **Interactive Profiles**: Create detailed profiles with interests, bio, and icebreaker questions
- **Responsive Design**: Built with Tailwind CSS for a fully responsive experience
- **Secure Authentication**: Powered by Supabase for robust user authentication and data storage

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS, SASS, DaisyUI
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **AI/ML**: TensorFlow.js, Universal Sentence Encoder
- **Chat**: Stream Chat
- **UI Components**: Radix UI, Shadcn UI
- **Animation**: Framer Motion
- **State Management**: React Context

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Required APIs:
   - Supabase (Authentication and Database)
   - Stream Chat (Real-time messaging)
   - TensorFlow.js (AI matchmaking)

Contact repository owner for specific API setup instructions.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: Main application pages and routing
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and shared logic
- `/src/contexts`: React Context providers
- `/src/styles`: Global styles and SCSS modules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
