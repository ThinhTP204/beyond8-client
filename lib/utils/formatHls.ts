interface HlsStream {
    Url: string;
    Quality: string;
}

/**
 * Parses a JSON string of HLS streams and extracts the master playlist URL.
 * Prioritizes the stream with Quality "master".
 * @param hlsString The JSON string containing HLS stream information.
 * @returns The URL of the master playlist, or null if not found/invalid.
 */
export const formatHls = (hlsString: string | null): string | null => {
    if (!hlsString) return null;

    try {
        const streams: HlsStream[] = JSON.parse(hlsString);

        if (!Array.isArray(streams)) {
            return null;
        }

        // Find the stream with "master" quality
        const masterStream = streams.find(
            (stream) => stream.Quality?.toLowerCase() === "master"
        );

        // Return master URL if found
        if (masterStream) {
            return masterStream.Url;
        }

        // Fallback: Return the first available URL if no master is found
        // This handles cases where only specific resolutions are provided
        if (streams.length > 0) {
            return streams[0].Url;
        }

        return null;
    } catch (error) {
        console.error("Error parsing HLS string:", error);
        return null;
    }
};
