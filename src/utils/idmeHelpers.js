const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
const responseType = 'code';
const scopes = [
  //   'identity',
  'military_us',
  //   'responder_us',
  //   'student_us',
  //   'teacher_us',
  //   'government_us',
  //   'alumni',
  //   'medical',
  //   'nurse',
  //   'employee',
  //   'senior',
  //   'military_canada',
  //   'responder_canada',
  //   'student_canada',
  //   'teacher_canada',
  //   'government_canada',
  //   'nurse_canada',
  //   'hospital_employee',
  //   'kba_replacement/covid/verify',
  //   'kba_replacement/covid/questionnaire',
  //   // "kba_replacement/covid/pcr_test"
  //   // "sdca_resident",
  //   // "mcnj_resident"
].join(',');

export const groupsEndpoint = () => {
  const endpoint = 'https://groups.id.me';
  const parameters = [
    `client_id=${clientId}`,
    `redirect_uri=${redirectUri}`,
    `response_type=${responseType}`,
    `scope=${scopes}`,
  ];

    const url = `${endpoint}?${parameters.join('&')}`;
    console.log(url);

  return `${endpoint}?${parameters.join('&')}`;
};
