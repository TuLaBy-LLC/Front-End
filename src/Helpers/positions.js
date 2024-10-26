// Function to calculate the distance using the Haversine formula
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert to radians

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Function to get the person's current geolocation
export function getPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;

                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    reject("Unable to retrieve person's location.");
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            reject("Geolocation not supported.");
        }
    });
}

// Function to check if a person is within the defined position radius
export async function isPersonInPosition(position) {
    const { latitude, longitude, radius } = position;

    try {
        const { latitude: personLat, longitude: personLon } = await getPosition();
        // console.log({ personLat, personLon });
        // console.log(position);

        // Calculate the distance between the person and the position's center
        const distance = haversineDistance(personLat, personLon, latitude, longitude);

        // Return true if the person is within the radius, otherwise false
        const isWithinRadius = distance <= radius;
        // console.log(`Is the person within the radius? ${isWithinRadius}`);
        return isWithinRadius;
    } catch (error) {
        console.error(error);
        return false; // Handle error case
    }
}

