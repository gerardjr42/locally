'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import './verification.scss';

export default function UserVerification() {
  const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const responseType = 'token';
    const scopes = [
      'identity',
      'military_us',
      'responder_us',
      'student_us',
      'teacher_us',
      'government_us',
      'alumni',
      'medical',
      'nurse',
      'employee',
      'senior',
      'military_canada',
      'responder_canada',
      'student_canada',
      'teacher_canada',
      'government_canada',
      'nurse_canada',
      'hospital_employee',
      'kba_replacement/covid/verify',
      'kba_replacement/covid/questionnaire',
      // "kba_replacement/covid/pcr_test"
      // "sdca_resident",
      // "mcnj_resident"
    ].join(',');

  const accountOptions = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'https://cdn-icons-png.freepik.com/256/15707/15707869.png?semt=ais_hybrid',
      connectText: 'Connect Your Instagram Account',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'https://static.vecteezy.com/system/resources/previews/016/716/481/non_2x/facebook-icon-free-png.png',
      connectText: 'Connect Your Facebook Account',
    },
  ];

    // export const groupsEndpoint = (sandbox) => {
    //   const endpoint = 'https://groups.id.me';
    //   const parameters = [
    //     `client_id=${clientId}`,
    //     `redirect_uri=${redirectUri}`,
    //     `response_type=${responseType}`,
    //     `scopes=${scopes}`,
    //   ];

    //   if (sandbox) {
    //     parameters.push(`sandbox=${sandbox}`);
    //   }

    //   return `${endpoint}?${parameters.join('&')}`;
    // };

  const [payload, setPayload] = useState(null);
  const token = window.location.hash.match(/access_token=([^&]+)/)?.[1];

  const findAttributeValue = (attr) => {
    return payload
      ? payload.attributes.find((element) => element.handle === attr).value
      : null;
  };

  const fname = findAttributeValue('fname');
  const lname = findAttributeValue('lname');
  console.log(payload);

  useEffect(() => {
    if (token) {
      const tokenEndpoint = `https://api.id.me/api/public/v3/attributes.json?access_token=${token}`;

      const asyncFetch = async (endpoint) => {
        try {
          const response = await axios.get(endpoint);
          const data = response.data;
          setPayload(data);
        } catch (error) {
          console.log('Error:', error);
        }
      };
      asyncFetch(tokenEndpoint);
    }
  }, [token]);

  // Define the bindIDme function
  const bindIDme = () => {
    window.location.href =
      `https://api.id.me/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=military%20responder%20student%20teacher%20government`;
  };

  const handleButtonClick = () => {
    router.push('/register/confirmation');
  };

  return (
    <div className="UserVerification min-h-full flex flex-col items-center justify-center m-10">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/register/details')}
        >
          <ArrowLeft className="mr-2 h-10 w-4" />
        </Button>
        <div className="mb-6 w-full">
          <Progress value={95} className="h-2 w-full" />{' '}
          <div className="flex justify-between mt-2 text-sm font-medium text-[#0D9488]">
            <span>Profile Creation</span>
            <span>95%</span>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-6"
      >
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Connect Accounts</h2>
            <hr className="mb-4" />
            {accountOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-4 mb-4">
                <Checkbox id={option.id} />
                <label
                  htmlFor={option.id}
                  className="flex items-center space-x-4 cursor-pointer"
                >
                  <img
                    src={option.icon}
                    alt={option.name}
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="font-semibold">{option.name}</p>
                    <p className="text-sm text-gray-600">
                      {option.connectText}
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Third Party</h2>
            <hr className="mb-4" />
            <p className="text-gray-600 mb-4">
              Locally uses ID.me to verify users for added safety on our
              platform. Click here to verify.
            </p>
            <Button
              id="idme-wallet-button"
              data-scope="military,responder,student,teacher,government"
              variant="outline"
              onClick={bindIDme}
              className="w-full bg-green-600 text-white"
            >
              Verify with ID.me
            </Button>
          </section>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleButtonClick}>
              Skip For Now
            </Button>
            <Button disabled={!isVerified} onClick={handleButtonClick}>
              Continue
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
