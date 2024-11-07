import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function convertToTimestamp(startDate, startTime) {
  if (!startDate || !startTime) {
    console.error("Invalid date or time format");
    return null; 
  }

  try {
    let [time, period] = startTime.split(" ");
    let [hours, minutes] = time.split(":");

    if (period.toLowerCase() === "pm" && hours !== 12) {
      hours = Number(hours) + 12;
    } else if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");

    const timestamp = `${startDate} ${hours}:${minutes}:00+00`;
    console.log("Timestamp:", timestamp);
    return timestamp;
  } catch (error) {
    console.error("Error converting to timestamp:", error);
    return null; 
  }
}

function extractAddressComponents(geocodeResponse) {
  let streetAddress = "";
  let postalCode = "";

  if (geocodeResponse.results && geocodeResponse.results.length > 0) {
    const addressComponents = geocodeResponse.results[0].address_components;

    const streetNumber =
      addressComponents.find((component) =>
        component.types.includes("street_number")
      )?.long_name || "";
    const route =
      addressComponents.find((component) => component.types.includes("route"))
        ?.short_name || component.types.includes("route")
        ?.long_name || "";
    streetAddress = `${streetNumber} ${route}`.trim();

    postalCode =
      addressComponents.find((component) =>
        component.types.includes("postal_code")
      )?.short_name || "";
  }

  return { streetAddress, postalCode };
}

function extractCoordinates(coordinatesString) {
  const [latitude, longitude] = coordinatesString.split(',').map(coord => parseFloat(coord.trim()));
  return { latitude, longitude };
}

async function getStreetAddressFromCoordinates(latitude, longitude) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const { streetAddress, postalCode } = extractAddressComponents(data);

    return { streetAddress, postalCode };
  } catch (error) {
    console.error("Error fetching address:", error);
    return { streetAddress: null, postalCode: null };
  }
}

async function processEvents(jsonData) {
  for (const event of jsonData) {
    const { latitude, longitude } = extractCoordinates(event.coordinates);
    const eventTime = convertToTimestamp(event.startdate, event.starttime);
    const { streetAddress, postalCode } = await getStreetAddressFromCoordinates(latitude, longitude);

    const eventData = {
      event_name: event.title,
      event_details: event.description,
      event_url: event.link,
      is_free: true,
      event_price: 0,
      event_time: eventTime,
      event_image_url: event.image || "https://images.pexels.com/photos/4451501/pexels-photo-4451501.jpeg?auto=compress&cs=tinysrgb&w=600",
      event_host: "NYC Parks and Recreation",
      event_location_name: event.location,
      event_street_address: streetAddress,
      event_zip_code: Number(postalCode),
      event_capacity: null,
    };

    const { data: existingEvent, error } = await supabase
      .from("Events")
      .select("*")
      .eq("event_url", event.link)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking event:", error.message);
      continue;
    }

    if (existingEvent) {
      const { error: updateError } = await supabase
        .from("Events")
        .update(eventData)
        .eq("event_url", event.link);

      if (updateError) {
        console.error(
          `Error updating event: ${event.title}`,
          updateError.message
        );
      } else {
        console.log(`Updated event: ${event.title}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from("Events")
        .insert(eventData);

      if (insertError) {
        console.error(
          `Error inserting event: ${event.title}`,
          insertError.message
        );
      } else {
        console.log(`Inserted new event: ${event.title}`);
      }
    }
  }
}

export async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  const jsonData = JSON.parse(text);

  await processEvents(jsonData);
}
