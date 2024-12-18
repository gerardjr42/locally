export default async function handler(req, res) {
  const { zipcode } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!zipcode || !apiKey) {
    return res.status(400).json({ error: "Missing zipcode or API key" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK") {
      const result = data.results[0];
      const boroughComponent = result.address_components.find(
        (component) =>
          component.types.includes("sublocality") ||
          component.types.includes("sublocality_level_1")
      );

      if (boroughComponent) {
        return res.status(200).json({ city: boroughComponent.long_name });
      }

      const cityComponent = result.address_components.find((component) =>
        component.types.includes("locality")
      );

      if (cityComponent) {
        return res.status(200).json({ city: cityComponent.long_name });
      }
    }

    return res.status(404).json({ error: "Borough/City not found" });
  } catch (error) {
    console.error("Error fetching city:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
