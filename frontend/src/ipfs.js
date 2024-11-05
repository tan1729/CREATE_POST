import axios from 'axios';

const pinataApiKey = '7c332877835212f5309a';
const pinataSecretApiKey = 'f8e407edab91595079f14ce9d7381b567abf409cf2d91059fa27aed8e9d290e7';

/**
 * Uploads a file to Pinata's IPFS service and returns the IPFS URI.
 * @param {File | Blob} file - The file to be uploaded to IPFS.
 * @returns {Promise<string>} The IPFS URI of the uploaded file.
 */
export const uploadToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const data = new FormData();
    data.append('file', file);

    try {
        const response = await axios.post(url, data, {
            maxContentLength: 'Infinity', 
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            }
        });

        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
        console.error("IPFS upload error:", error);
        throw new Error("Failed to upload file to IPFS via Pinata");
    }
};
