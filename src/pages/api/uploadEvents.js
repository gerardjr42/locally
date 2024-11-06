import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

//function to prepare event start time
//function to prepare event street address from coordinates
//function to get zip code from street address

async function processEvents(jsonData) {
    for (const event of jsonData) {
        const eventData = {
            event_name: event.title,
            event_details: event.description,
            event_url: event.link,
            is_free: true,
            event_price: 0,
            event_time: event.starttime,
            event_image_url: event.image || "",
            event_host: "NYC Parks and Recreation",
            event_location_name: event.location,
            event_street_address: null,
            event_zip_code: null,
            event_capacity: null
        };

        const { data: existingEvent, error } = await supabase
            .from('Events')
            .select('*')
            .eq('event_url', event.link)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error checking event:', error.message);
            continue;
        }

        if (existingEvent) {
            const { error: updateError } = await supabase
                .from('Events')
                .update(eventData)
                .eq('event_url', event.link);

            if (updateError) {
                console.error(`Error updating event: ${event.title}`, updateError.message);
            } else {
                console.log(`Updated event: ${event.title}`);
            }
        } else {
            const { error: insertError } = await supabase
                .from('Events')
                .insert(eventData);

            if (insertError) {
                console.error(`Error inserting event: ${event.title}`, insertError.message);
            } else {
                console.log(`Inserted new event: ${event.title}`);
            }
        }
    }
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const jsonData = JSON.parse(text);

    await processEvents(jsonData);
}

document.getElementById('file-input').addEventListener('change', handleFileUpload);