import React from 'react';

const DownloadKeystore = () => {
    const handleDownload = async () => {
        try {

            // Assuming you are using React and not React Native, as URLSearchParams is a Web API
            const queryParams = new URLSearchParams(window.location.search);
            const accountId = queryParams.get('accountId').toLowerCase();
            // Construct the URL for the download endpoint
            const url = `http://localhost:3001/download-key?accountId=${accountId}`;
            // Fetch the file from the backend
            const response = await fetch(url);
            if (response.ok) {
                // Create a blob from the response data
                const blob = await response.blob();
                // Create a URL for the blob
                const downloadUrl = window.URL.createObjectURL(blob);
                // Create an anchor tag to download the file
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${accountId}-keystore.json`; // Optional: customize the file name
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                throw new Error('Failed to download file.');
            }
        } catch (error) {
            console.error('Error downloading the keystore file:', error);
            alert('There was an error downloading the file. Please try again.');
        }
    };

    return (
        <div>
            <h2>Download Your Keystore File</h2>
            <button onClick={handleDownload}>Download Keystore</button>
        </div>
    );
};

export default DownloadKeystore;