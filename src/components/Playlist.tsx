import React from 'react'


    const url = 'https://api.spotify.com/v1/me/playlists/3cEYpjA9oz9GiPac4AsH4n';
    console.log("playlists" , url)
    async function fetchData(url: string) {
      try {
        const response = await fetch(url);
        // Check if the request was successful.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        return data;
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : 'there was an error...';
        console.error(errMsg);
        // throw error;
        return [];
      }
    }
    fetchData(url)







