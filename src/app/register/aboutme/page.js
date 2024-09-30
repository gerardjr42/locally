"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./aboutme.scss";

const icebreakerQuestions = [
  "What hobbies or activities do you enjoy in your free time?",
  "If you could travel anywhere in the world, where would you go and why?",
  "What’s your favorite book or movie, and what do you love about it?",
  "Do you have a favorite type of music or a favorite band?",
  "What’s a fun fact about you that most people don’t know?",
  "What’s your go-to comfort food?",
  "If you could have dinner with any three people, dead or alive, who would they be?",
  "What’s a skill you’ve always wanted to learn?",
  "How do you like to spend a rainy day?",
  "What’s something you’re passionate about?",
  "If you could instantly master any skill or talent, what would it be?",
  "What’s your favorite childhood memory?",
  "What’s a movie or TV show you can binge-watch anytime?",
  "What’s something on your bucket list that you hope to achieve?",
  "How would your friends describe you in three words?",
  "What’s your favorite way to meet new people?",
  "If you could live in any fictional world, which one would you choose?",
];

export default function UserBioCreation() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [icebreakerResponses, setIcebreakerResponses] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleIcebreakerChange = (index, field, value) => {
    const updatedResponses = [...icebreakerResponses];
    updatedResponses[index][field] = value;
    setIcebreakerResponses(updatedResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("No user found");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Users")
        .update({
          bio: bio,
          icebreaker_responses: icebreakerResponses,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      console.log(
        "User bio and icebreaker responses saved successfully:",
        data
      );
      router.push("/register/photo");
    } catch (error) {
      console.error(
        "Error saving user bio and icebreaker responses:",
        error.message
      );
    }
  };

  return (
    <div className="UserBioCreation">
      <div className="center">
        <progress className="progress w-56" value="60" max="100"></progress>
      </div>
      <h1>Tell us about yourself</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Your bio</h2>
          <label htmlFor="bio">Tell us about yourself</label>
          <textarea
            id="bio"
            className="textarea textarea-accent"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>
        <br />
        <div>
          <h2>Answer prompts</h2>
          <label htmlFor="">
            Select up to 3 questions and share your responses
          </label>

          {icebreakerResponses.map((response, index) => (
            <div key={index}>
              <select
                value={response.question}
                onChange={(e) =>
                  handleIcebreakerChange(index, "question", e.target.value)
                }
              >
                <option value="" disabled>
                  Select a question
                </option>
                {icebreakerQuestions.map((question, qIndex) => (
                  <option key={qIndex} value={question}>
                    {question}
                  </option>
                ))}
              </select>
              <textarea
                className="textarea textarea-accent"
                placeholder="Your response..."
                value={response.answer}
                onChange={(e) =>
                  handleIcebreakerChange(index, "answer", e.target.value)
                }
              ></textarea>
            </div>
          ))}
        </div>

        <div>
          <button
            type="button"
            className="btn"
            onClick={() => router.push("/register/photo")}
          >
            Skip for now
          </button>
          <button
            type="submit"
            className="btn"
            onClick={() => router.push("/register/photo")}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
