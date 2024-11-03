// pages/api/reverseGeocode.js
export default async function handler(req, res) {
    const { lat, lng } = req.query;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!lat || !lng || !apiKey) {
        return res.status(400).json({ error: 'Missing latitude, longitude, or API key' });
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === 'OK') {
            const result = data.results[0];
            const formattedAddress = result.formatted_address;

            if (formattedAddress) {
                return res.status(200).json({ address: formattedAddress });
            }
        }

        return res.status(404).json({ error: 'Address not found' });
    } catch (error) {
        console.error('Error fetching address:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


