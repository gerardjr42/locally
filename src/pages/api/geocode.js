export default async function handler(req, res) {
  const { zipcode } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!zipcode || !apiKey) {
    return res.status(400).json({ error: 'Missing zipcode or API key' });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${apiKey}`
    );
    const data = await response.json();

    // Log the response from Google API
    console.log('Response from Google Geocoding API:', data);

    if (data.status === 'OK') {
      const result = data.results[0];
      const cityComponent = result.address_components.find(component =>
        component.types.includes('locality') || 
        component.types.includes('administrative_area_level_3')
      );
      const stateComponent = result.address_components.find(component =>
        component.types.includes('administrative_area_level_1')
      );
      const boroughComponent = result.address_components.find(component =>
        component.types.includes('sublocality') || 
        component.types.includes('neighborhood')
      );

      const city = cityComponent ? cityComponent.long_name : null;
      const state = stateComponent ? stateComponent.long_name : null;
      const borough = boroughComponent ? boroughComponent.long_name : null;

      return res.status(200).json({ city, state, borough });
    }

    // Handle the case when there are no results
    if (data.status === 'ZERO_RESULTS') {
      return res.status(404).json({ error: 'No results found for this ZIP code' });
    }

    return res.status(404).json({ error: 'Location not found' });
  } catch (error) {
    console.error('Error fetching location:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
