'use client';
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

const icebreakerQuestions = [
  "What hobbies or activities do you enjoy in your free time?",
  "If you could travel anywhere in the world, where would you go and why?",
  "What's your favorite book or movie, and what do you love about it?",
  "Do you have a favorite type of music or a favorite band?",
  "What's a fun fact about you that most people don't know?",
  "What's your go-to comfort food?",
  "If you could have dinner with any three people, dead or alive, who would they be?",
  "What's a skill you've always wanted to learn?",
  "How do you like to spend a rainy day?",
  "What's something you're passionate about?",
  "If you could instantly master any skill or talent, what would it be?",
  "What's your favorite childhood memory?",
  "What's a movie or TV show you can binge-watch anytime?",
  "What's something on your bucket list that you hope to achieve?",
  "How would your friends describe you in three words?",
  "What's your favorite way to meet new people?",
  "If you could live in any fictional world, which one would you choose?",
]

const MAX_BIO_LENGTH = 500

export default function UserBioCreation() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [bio, setBio] = useState('')
  const [icebreakerResponses, setIcebreakerResponses] = useState([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' },
  ])
  const [particles, setParticles] = useState([])
  const [progress, setProgress] = useState(60)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
    }))
    setParticles(newParticles)

    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        })))
    }

    const intervalId = setInterval(animateParticles, 50)
    return () => clearInterval(intervalId);
  }, [])

  const handleIcebreakerChange = (index, field, value) => {
    const updatedResponses = [...icebreakerResponses]
    updatedResponses[index][field] = value
    if (field === 'question') {
      updatedResponses[index].answer = ''
    }
    setIcebreakerResponses(updatedResponses)
  }

  const availableQuestions = useMemo(() => {
    const selectedQuestions = icebreakerResponses.map(response => response.question)
    return icebreakerQuestions.filter(question => !selectedQuestions.includes(question));
  }, [icebreakerResponses])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('No user found')
      return
    }

    try {
      const { data, error } = await supabase
        .from('Users')
        .update({
          bio: bio,
          icebreaker_responses: icebreakerResponses,
        })
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Bio and icebreaker responses saved successfully!')
      router.push('/register/photo')
    } catch (error) {
      toast.error(`Error saving bio and icebreaker responses: ${error.message}`)
    }
  }

  return (
    (<div
      className="relative min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-teal-500 opacity-20"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }} />
        ))}
      </div>
      <div
        className="z-10 w-full max-w-2xl space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LocallyBrandingAssets-14-E4UXhMoOavGDvDfu04DsGvsuuX33Tv.png"
            alt="Locally Logo"
            width={100}
            height={100}
            className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-teal-600">Tell us about yourself</h2>
        </div>

        <div className="relative pt-1">
          <Progress value={progress} className="w-full h-2" />
          <div className="flex justify-between mt-2">
            <div className="text-xs font-semibold inline-block text-teal-600">
              Profile Creation
            </div>
            <div className="text-xs font-semibold inline-block text-teal-600">
              {progress}%
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="bio">Your bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
              className="mt-1"
              maxLength={MAX_BIO_LENGTH} />
            <p className="text-sm text-gray-500 mt-1">{bio.length}/{MAX_BIO_LENGTH} characters</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Answer prompts</h3>
            <p className="text-sm text-gray-600 mb-4">Select up to 3 questions and share your responses</p>
            {icebreakerResponses.map((response, index) => (
              <div key={index} className="space-y-2 mb-4">
                <Select
                  value={response.question}
                  onValueChange={(value) => handleIcebreakerChange(index, 'question', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a question" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px] w-full">
                      {availableQuestions.map((question, qIndex) => (
                        <SelectItem key={qIndex} value={question}>
                          {question}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Your response..."
                  value={response.answer}
                  onChange={(e) => handleIcebreakerChange(index, 'answer', e.target.value)}
                  className="mt-1"
                  disabled={!response.question} />
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/register/photo')}>
              Skip for now
            </Button>
            <Button type="submit" className="bg-[#0D9488] hover:bg-[#0A7C72] text-white">
              Continue
            </Button>
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>)
  );
}