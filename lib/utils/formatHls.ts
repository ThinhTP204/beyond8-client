export interface HlsStream {
    Url: string;
    Quality: string;
    Resolution?: string; // Optional if available in JSON
}

/**
 * Parses a JSON string of HLS streams and extracts all valid streams.
 * @param hlsString The JSON string containing HLS stream information.
 * @returns An array of HlsStream objects.
 */
export const getHlsVariants = (hlsString: string | null): HlsStream[] => {
    if (!hlsString) return [];

    try {
        const streams: HlsStream[] = JSON.parse(hlsString);
        if (!Array.isArray(streams)) return [];
        return streams;
    } catch (error) {
        console.error("Error parsing HLS string:", error);
        return [];
    }
};

/**
 * Parses a JSON string of HLS streams and extracts the master playlist URL.
 * Prioritizes the stream with Quality "master".
 * @param hlsString The JSON string containing HLS stream information.
 * @returns The URL of the master playlist, or null if not found/invalid.
 */
export const formatHls = (hlsString: string | null): string | null => {
    if (!hlsString) return null;

    try {
        const streams = getHlsVariants(hlsString);
        if (streams.length === 0) return null;

        // Find the stream with "master" quality
        const masterStream = streams.find(
            (stream) => stream.Quality?.toLowerCase() === "master"
        );

        // Return master URL if found
        if (masterStream) {
            return masterStream.Url;
        }

        // Fallback: Return the first available URL if no master is found
        return streams[0].Url;
    } catch (error) {
        console.error("Error in formatHls:", error);
        return null;
    }
};
